import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/mailer';
import { query } from '@/lib/mysql';
import { validateRecaptcha } from '@/lib/recaptcha';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { calculateLeadScore } from '@/lib/leadScoring';

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

    const body = await request.json();
    const {
      name,
      phone,
      email,
      address,
      serviceType,
      budgetRange,
      timeframe,
      referralSource,
      description,
      recaptchaToken,
      website, // Honeypot field
    } = body;

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

    // Save lead to database (using contact_leads table for CRM integration)
    // Calculate lead score and auto-assign priority
    const leadScore = calculateLeadScore({
      budgetRange,
      timeframe,
      serviceType,
      referralSource,
      description,
    });

    const result = await query<any>(
      `INSERT INTO contact_leads (name, phone, email, address, service_type, budget_range, timeframe, referral_source, description, status, priority, estimated_value, lead_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)`,
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
        leadScore.priority, // Auto-assigned priority
        null, // estimated_value (can be set later)
        leadScore.totalScore // Store the calculated score
      ]
    );

    const leadId = (result as any).insertId;

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        // Generate priority badge for email
        const priorityBadge = leadScore.priority === 'urgent' ? '🔴 URGENT' :
                              leadScore.priority === 'high' ? '🟠 HIGH PRIORITY' :
                              leadScore.priority === 'medium' ? '🔵 MEDIUM' : '⚪ LOW';

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

Message:
${description}

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
        // Don't fail the request if email fails
      }
    }

    console.log('New contact form submission:', {
      name,
      phone,
      email,
      serviceType,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
