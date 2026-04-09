import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/mailer';
import { validateRecaptcha } from '@/lib/recaptcha';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { calculateLeadScore } from '@/lib/leadScoring';
import { assertCriticalEnv, getEmailEnvHealth } from '@/lib/envCheck';
import {
  ensureLeadSchema,
  createLead,
  saveLeadAttachments,
  logLeadActivity,
} from '@/lib/leadService';
import { collectFormFiles, validateFiles } from '@/lib/uploads';
import { query } from '@/lib/mysql';

type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  address?: string;
  serviceType?: string;
  budgetRange?: string;
  timeframe?: string;
  referralSource?: string;
  description: string;
  preferredDate?: string;
  preferredTime?: string;
};

function asCleanString(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parsePayload(formData: FormData): ContactPayload {
  return {
    name: asCleanString(formData.get('name')),
    phone: asCleanString(formData.get('phone')),
    email: asCleanString(formData.get('email')),
    address: asCleanString(formData.get('address')),
    serviceType: asCleanString(formData.get('serviceType')),
    budgetRange: asCleanString(formData.get('budgetRange')),
    timeframe: asCleanString(formData.get('timeframe')),
    referralSource: asCleanString(formData.get('referralSource')),
    description: asCleanString(formData.get('description')),
    preferredDate: asCleanString(formData.get('preferredDate')),
    preferredTime: asCleanString(formData.get('preferredTime')),
  };
}

function validatePayload(payload: ContactPayload): string | null {
  if (!payload.name || !payload.phone || !payload.email || !payload.description) {
    return 'Missing required fields';
  }
  return null;
}

export async function POST(request: Request) {
  try {
    assertCriticalEnv();

    const clientIp = getClientIp(request);
    const limit = checkRateLimit({
      identifier: clientIp,
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!limit.allowed) {
      console.warn('[contact] rate limit exceeded', { clientIp });
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const formData = await request.formData();
    if (asCleanString(formData.get('website'))) {
      console.warn('[contact] honeypot triggered');
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const payload = parsePayload(formData);
    const payloadError = validatePayload(payload);
    if (payloadError) {
      return NextResponse.json({ error: payloadError }, { status: 400 });
    }

    const recaptchaToken = asCleanString(formData.get('recaptchaToken'));
    if (recaptchaToken) {
      await validateRecaptcha(recaptchaToken, 'contact_form', 0.5);
    }

    const files = collectFormFiles(formData);
    const fileValidation = validateFiles(files);
    if (!fileValidation.ok) {
      return NextResponse.json({ error: fileValidation.message }, { status: 400 });
    }

    await ensureLeadSchema();

    const score = calculateLeadScore({
      budgetRange: payload.budgetRange,
      timeframe: payload.timeframe,
      serviceType: payload.serviceType,
      referralSource: payload.referralSource,
      description: payload.description,
    });

    const leadId = await createLead({
      ...payload,
      priority: score.priority,
      leadScore: score.totalScore,
      source: 'contact_form',
    });

    let uploadedNames: string[] = [];

    try {
      const saved = await saveLeadAttachments(leadId, files);
      uploadedNames = saved.map((s) => s.storedName);
    } catch (attachmentError) {
      console.error('[contact] attachment write failed', attachmentError);
      await query('DELETE FROM contact_leads WHERE id = ?', [leadId]);
      return NextResponse.json(
        {
          error: 'Attachment upload failed. Please retry with smaller files or submit without attachments.',
        },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const emailHealth = getEmailEnvHealth();

    if (adminEmail && emailHealth.ready) {
      try {
        await sendLeadEmail({
          to: adminEmail,
          subject: `New Lead: ${payload.name} - ${payload.serviceType || 'General Inquiry'}`,
          text:
            `Lead #${leadId}\n\n` +
            `Name: ${payload.name}\n` +
            `Phone: ${payload.phone}\n` +
            `Email: ${payload.email}\n` +
            `Address: ${payload.address || 'N/A'}\n` +
            `Service: ${payload.serviceType || 'N/A'}\n` +
            `Budget: ${payload.budgetRange || 'N/A'}\n` +
            `Timeframe: ${payload.timeframe || 'N/A'}\n` +
            `Preferred Date: ${payload.preferredDate || 'N/A'}\n` +
            `Preferred Time: ${payload.preferredTime || 'N/A'}\n` +
            `Description: ${payload.description}\n` +
            `Attachments: ${uploadedNames.length}\n\n` +
            `View: ${(process.env.NEXT_PUBLIC_BASE_URL || 'https://burchcontracting.com') + '/admin/crm/leads/' + leadId}`,
          replyTo: payload.email,
        });

        await logLeadActivity(leadId, 'email_sent', 'Admin lead notification sent');
      } catch (emailError) {
        console.error('[contact] email send failed', emailError);
        await logLeadActivity(
          leadId,
          'email_failed',
          'Admin lead notification failed',
          {
            error: emailError instanceof Error ? emailError.message : 'Unknown email error',
          }
        );
      }
    } else {
      const details = adminEmail ? emailHealth.missing : ['ADMIN_EMAIL'];
      await logLeadActivity(leadId, 'email_failed', 'Admin lead notification skipped due to missing configuration', {
        missing: details,
      });
      console.warn('[contact] email skipped due to missing config', details);
    }

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      leadId,
      filesUploaded: uploadedNames.length,
    });
  } catch (error) {
    console.error('[contact] unhandled error', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
