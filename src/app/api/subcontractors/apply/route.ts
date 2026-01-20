import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { validateRecaptcha } from '@/lib/recaptcha';
import { sendLeadEmail, sendEmail } from '@/lib/mailer';
import { detectSpam } from '@/lib/spamDetection';

export async function POST(request: Request) {
  try {
    // Rate limiting: 5 applications per hour per IP (more lenient)
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit({
      identifier: `subcontractor-apply-${clientIp}`,
      maxRequests: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many applications. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      // Honeypot check
      website,
      
      // reCAPTCHA
      recaptchaToken,
      
      // Time-based validation
      formTimeTaken,
      
      // Required fields
      company_name,
      contact_name,
      email,
      phone,
      business_type,
      years_in_business,
      license_number,
      insurance_provider,
      insurance_expiry,
      specialties,
      
      // Optional fields
      address,
      city,
      state,
      zip,
    } = body;

    // Honeypot check - if filled, it's a bot
    if (website && website.toString().trim().length > 0) {
      console.log('Spam detected: honeypot field filled');
      return NextResponse.json(
        { error: 'Unable to process your application. Please try again or contact us directly.' },
        { status: 400 }
      );
    }
    
    // Time-based bot detection - form filled too quickly (under 3 seconds)
    if (formTimeTaken && formTimeTaken < 3000) {
      console.log(`Spam detected: form filled too quickly (${formTimeTaken}ms)`);
      return NextResponse.json(
        { error: 'Please take your time filling out the form.' },
        { status: 400 }
      );
    }

    // Basic validation - only check truly required fields
    if (!company_name || !contact_name || !email || !phone || !business_type || 
        years_in_business === undefined || years_in_business === null || years_in_business === '') {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    if (!specialties || !Array.isArray(specialties) || specialties.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one specialty' },
        { status: 400 }
      );
    }

    // Advanced spam detection
    const spamCheck = detectSpam({
      email: email as string,
      phone: phone as string,
      company_name: company_name as string,
      contact_name: contact_name as string,
    });
    
    if (spamCheck.isSpam) {
      console.log(`Spam detected: ${spamCheck.reason}`);
      return NextResponse.json(
        { error: 'Unable to process your application. Please verify your information or contact us directly.' },
        { status: 400 }
      );
    }

    // reCAPTCHA verification (optional but recommended)
    if (recaptchaToken) {
      const isValid = await validateRecaptcha(recaptchaToken, 'subcontractor_apply');
      if (!isValid) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Generate a random 6-digit PIN for mobile app access
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    // Insert into database (if DB available)
    let insertId: number | null = null;
    try {
      const result: any = await query(
        `INSERT INTO subcontractors 
         (company_name, contact_name, email, pin, phone, address, city, state, zip,
          business_type, years_in_business, license_number, insurance_provider, 
          insurance_expiry, specialties, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          company_name,
          contact_name,
          email,
          pin,
          phone,
          address || null,
          city || null,
          state || null,
          zip || null,
          business_type,
          years_in_business,
          license_number || null,
          insurance_provider || null,
          insurance_expiry || null,
          JSON.stringify(specialties),
        ]
      );

      insertId = (result && result.insertId) ? result.insertId : null;

      // Log activity
      if (insertId) {
        await query(
          `INSERT INTO subcontractor_activity 
           (subcontractor_id, activity_type, description)
           VALUES (?, 'application', ?)`,
          [insertId, `New application submitted by ${company_name}`]
        );
      }

      // Send welcome email to subcontractor with login credentials
      if (insertId) {
        try {
          await sendEmail(
            email as string,
            'Welcome to Burch Contracting - Your Login Credentials',
            `Hi ${contact_name},

Thank you for applying to join our team at Burch Contracting!

We've received your application and our team will review it within 48 hours. In the meantime, we've created your account for the crew mobile app.

YOUR LOGIN CREDENTIALS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: ${email}
PIN: ${pin}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACCESSING THE MOBILE APP:

📱 On iPhone (Safari):
1. Go to burchcontracting.com/tradesmen
2. Login with your email and PIN
3. Tap the Share button (box with arrow)
4. Scroll down and tap "Add to Home Screen"
5. Tap "Add" in the top right

📱 On Android (Chrome):
1. Go to burchcontracting.com/tradesmen
2. Login with your email and PIN
3. Tap the three-dot menu (⋮)
4. Tap "Add to Home screen"
5. Tap "Add"

Once your application is approved, you'll have full access to:
✓ View and manage assigned projects
✓ Track time and materials
✓ Submit daily reports
✓ Upload project photos
✓ Communicate with the office

IMPORTANT: Please keep your PIN secure. You can access the mobile app once your application is approved by our team.

If you have any questions, please don't hesitate to contact us at ${process.env.ADMIN_EMAIL || 'info@burchcontracting.com'}.

Best regards,
Burch Contracting Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated email. For assistance, please call (864) 881-7096 or email info@burchcontracting.com.`
          );
        } catch (emailError) {
          console.error('Failed to send welcome email to subcontractor:', emailError);
          // Don't fail the request if email fails
        }
      }
    } catch (dbErr: any) {
      console.error('DB insert failed, queuing application:', dbErr);

      // Queue the application to local file so admins can review when DB is down
      try {
        const path = require('path');
        const fs = require('fs');
        const queueDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(queueDir)) fs.mkdirSync(queueDir, { recursive: true });
        const queueFile = path.join(queueDir, 'subcontractor_applications.json');
        let queued: any[] = [];
        if (fs.existsSync(queueFile)) {
          try { queued = JSON.parse(fs.readFileSync(queueFile, 'utf8') || '[]'); } catch(e) { queued = []; }
        }
        queued.push({ company_name, contact_name, email, phone, address, city, state, zip, business_type, years_in_business, license_number, insurance_provider, insurance_expiry, specialties, status: 'queued', created_at: new Date().toISOString() });
        fs.writeFileSync(queueFile, JSON.stringify(queued, null, 2), 'utf8');
      } catch (fileErr) {
        console.error('Failed to queue application to file:', fileErr);
      }
    }
    try {
      await sendLeadEmail({
        to: process.env.ADMIN_EMAIL || 'estimates@burchcontracting.com',
        subject: 'New Subcontractor Application',
        text: `New subcontractor application from ${company_name}.

Contact: ${contact_name}
Email: ${email}
Phone: ${phone}
PIN: ${pin}
Specialties: ${Array.isArray(specialties) ? specialties.join(', ') : specialties}

Login URL: https://burchcontracting.com/tradesmen
Admin Review: https://burchcontracting.com/admin/subcontractors`,
        replyTo: email as string,
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails
    }
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully. We will review and contact you within 48 hours.',
      id: insertId,
      queued: insertId ? false : true,
    });
  } catch (error: any) {
    console.error('Error processing subcontractor application:', error);

    // Check for duplicate email
    if (error && (error.code === 'ER_DUP_ENTRY' || (error.errno && error.errno === 1062))) {
      return NextResponse.json(
        { error: 'An application with this email already exists.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
