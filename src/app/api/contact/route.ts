import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/mailer';
import { query } from '@/lib/mysql';
import { validateRecaptcha } from '@/lib/recaptcha';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { calculateLeadScore } from '@/lib/leadScoring';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    // Rate limiting - max 5 submissions per 15 minutes per IP
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit({
      identifier: clientIp,
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse FormData for file upload support
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const serviceType = formData.get('serviceType') as string;
    const budgetRange = formData.get('budgetRange') as string;
    const timeframe = formData.get('timeframe') as string;
    const referralSource = formData.get('referralSource') as string;
    const description = formData.get('description') as string;
    const preferredDate = formData.get('preferredDate') as string;
    const preferredTime = formData.get('preferredTime') as string;
    const recaptchaToken = formData.get('recaptchaToken') as string;
    const website = formData.get('website') as string; // Honeypot field

    // Honeypot check
    if (website) {
      console.warn(`Spam detected (honeypot): ${email || 'no email'}`);
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Basic validation
    if (!name || !phone || !email || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA if token provided
    if (recaptchaToken) {
      try {
        await validateRecaptcha(recaptchaToken, 'contact_form', 0.5);
      } catch (recaptchaError) {
        console.error('reCAPTCHA validation failed:', recaptchaError);
        return NextResponse.json(
          { error: 'Spam protection check failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Calculate lead score and auto-assign priority
    const leadScore = calculateLeadScore({
      budgetRange,
      timeframe,
      serviceType,
      referralSource,
      description,
    });

    // Save lead to database
    const result = await query<any>(
      `INSERT INTO contact_leads (name, phone, email, address, service_type, budget_range, timeframe, referral_source, description, preferred_date, preferred_time, status, priority, estimated_value, lead_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)`,
      [
        name, 
        phone, 
        email, 
        address || null, 
        serviceType || null, 
        budgetRange || null, 
        timeframe || null, 
        referralSource || null, 
        description,
        preferredDate || null,
        preferredTime || null,
        leadScore.priority,
        null,
        leadScore.totalScore
      ]
    );

    const leadId = (result as any).insertId;

    // Handle file uploads
    const uploadedFileNames: string[] = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'leads', String(leadId));
    
    // Collect files from formData
    const files: File[] = [];
    for (let i = 0; i < 10; i++) { // Check up to 10 files
      const file = formData.get(`file${i}`) as File;
      if (file && file.size > 0) {
        files.push(file);
      }
    }

    if (files.length > 0) {
      try {
        // Create upload directory if it doesn't exist
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        // Save each file
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Sanitize filename
          const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const timestamp = Date.now();
          const fileName = `${timestamp}_${sanitizedName}`;
          const filePath = join(uploadDir, fileName);
          
          await writeFile(filePath, buffer);
          uploadedFileNames.push(fileName);
          
          console.log(`Saved file: ${fileName} (${(file.size / 1024).toFixed(2)} KB)`);
        }

        // Store file references in database
        if (uploadedFileNames.length > 0) {
          await query(
            `UPDATE contact_leads SET attachments = ? WHERE id = ?`,
            [JSON.stringify(uploadedFileNames), leadId]
          );
        }
      } catch (fileError) {
        console.error('Error saving uploaded files:', fileError);
        // Don't fail the request if file upload fails
      }
    }

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        const priorityBadge = leadScore.priority === 'urgent' ? '🔴 URGENT' :
                              leadScore.priority === 'high' ? '🟠 HIGH PRIORITY' :
                              leadScore.priority === 'medium' ? '🔵 MEDIUM' : '⚪ LOW';

        const attachmentsText = uploadedFileNames.length > 0 
          ? `\n\n📎 Attachments (${uploadedFileNames.length}):\n${uploadedFileNames.map(f => `  • ${f}`).join('\n')}\n`
          : '';

        await sendLeadEmail({
          to: adminEmail,
          subject: `${priorityBadge} New Lead: ${name} - ${serviceType || 'General Inquiry'}`,
          text: `
New Lead Submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEAD SCORE: ${leadScore.totalScore}/375 | PRIORITY: ${priorityBadge}

Contact Information:
• Name: ${name}
• Phone: ${phone}
• Email: ${email}
${address ? `• Address: ${address}` : ''}

Project Details:
${serviceType ? `• Service Type: ${serviceType}` : ''}
${budgetRange ? `• Budget Range: ${budgetRange}` : ''}
${timeframe ? `• Timeframe: ${timeframe}` : ''}
${referralSource ? `• Referral Source: ${referralSource}` : ''}

Appointment Request:
${preferredDate ? `• Preferred Date: ${preferredDate}` : ''}
${preferredTime ? `• Preferred Time: ${preferredTime}` : ''}

Message:
${description}${attachmentsText}

Score Breakdown:
• Budget: ${leadScore.breakdown.budgetScore}/100
• Timeframe: ${leadScore.breakdown.timeframeScore}/100
• Service Type: ${leadScore.breakdown.serviceScore}/100
• Referral: ${leadScore.breakdown.referralScore}/50

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
View in CRM: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/crm/leads/${leadId}
          `,
          replyTo: email,
        });
        console.log('Lead email notification sent to admin');
      } catch (emailError) {
        console.error('Failed to send lead email:', emailError);
      }
    }

    console.log('New contact form submission:', {
      name,
      phone,
      email,
      serviceType,
      filesUploaded: uploadedFileNames.length,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      filesUploaded: uploadedFileNames.length
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
