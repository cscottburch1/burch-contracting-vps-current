import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { validateRecaptcha } from '@/lib/recaptcha';
import { sendEmail } from '@/lib/mailer';
import { detectSpam } from '@/lib/spamDetection';

export async function POST(request: Request) {
  try {
    // Rate limiting: 5 applications per hour per IP
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit({
      identifier: `employee-apply-${clientIp}`,
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
      first_name,
      last_name,
      email,
      phone,
      position,
      experience_level,
      
      // Optional fields
      address,
      city,
      state,
      zip,
      years_experience,
      certifications,
      bio,
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

    // Basic validation - check truly required fields
    if (!first_name || !last_name || !email || !phone || !position || !experience_level) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Advanced spam detection
    const spamCheck = detectSpam({
      email: email as string,
      phone: phone as string,
      company_name: '', // Not applicable for employees
      contact_name: `${first_name} ${last_name}`,
    });
    
    if (spamCheck.isSpam) {
      console.log(`Spam detected: ${spamCheck.reason}`);
      return NextResponse.json(
        { error: 'Unable to process your application. Please verify your information or contact us directly.' },
        { status: 400 }
      );
    }

    // Validate reCAPTCHA if token is present
    if (recaptchaToken) {
      const recaptchaValid = await validateRecaptcha(recaptchaToken, 'employee_apply');
      if (!recaptchaValid) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Insert into database
    try {
      const result = await query(
        `INSERT INTO direct_hire_applications (
          first_name, last_name, email, phone, 
          address, city, state, zip,
          position, experience_level, years_experience,
          certifications, bio, ip_address, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          first_name,
          last_name,
          email,
          phone,
          address || null,
          city || null,
          state || null,
          zip || null,
          position,
          experience_level,
          years_experience || null,
          certifications || null,
          bio || null,
          clientIp,
          'pending', // Initial status
        ]
      );

      // Send confirmation email to applicant
      try {
        await sendEmail(
          email as string,
          'Application Received - Burch Contracting Direct Hire',
          `
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #059669;">Application Received!</h2>
                  <p>Dear ${first_name},</p>
                  <p>Thank you for applying for the <strong>${position}</strong> position at Burch Contracting.</p>
                  <p>We have received your application and will review it carefully. We typically respond to applications within 48 hours.</p>
                  <p><strong>Application Details:</strong></p>
                  <ul>
                    <li>Position: ${position}</li>
                    <li>Experience Level: ${experience_level}</li>
                    <li>Submitted: ${new Date().toLocaleDateString()}</li>
                  </ul>
                  <p>If you have any questions, please feel free to contact us at <strong>jobs@burchcontracting.com</strong>.</p>
                  <p>Best regards,<br/>The Burch Contracting Team</p>
                </div>
              </body>
            </html>
          `
        );
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the entire request if email fails
      }

      // Send notification email to admin
      try {
        await sendEmail(
          process.env.ADMIN_EMAIL || 'admin@burchcontracting.com',
          `New Direct Hire Application: ${first_name} ${last_name}`,
          `
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #059669;">New Application Received</h2>
                  <p><strong>Applicant Information:</strong></p>
                  <ul>
                    <li>Name: ${first_name} ${last_name}</li>
                    <li>Email: ${email}</li>
                    <li>Phone: ${phone}</li>
                    <li>Position: ${position}</li>
                    <li>Experience: ${experience_level}</li>
                    ${years_experience ? `<li>Years of Experience: ${years_experience}</li>` : ''}
                    ${address ? `<li>Address: ${address}, ${city}, ${state} ${zip}</li>` : ''}
                  </ul>
                  <p><strong>About:</strong></p>
                  <p>${bio || 'No additional information provided'}</p>
                  ${certifications ? `<p><strong>Certifications:</strong></p><p>${certifications}</p>` : ''}
                  <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://burchcontracting.com'}/admin/employees" style="color: #059669; text-decoration: none;">View in Admin Panel</a></p>
                </div>
              </body>
            </html>
          `
        );
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
        // Don't fail the entire request if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully',
      }, { status: 201 });

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback: store in queue if database fails
      try {
        await query(
          `INSERT INTO application_queue (type, data, ip_address, created_at) 
           VALUES ('direct_hire', ?, ?, NOW())`,
          [
            JSON.stringify({
              first_name,
              last_name,
              email,
              phone,
              address,
              city,
              state,
              zip,
              position,
              experience_level,
              years_experience,
              certifications,
              bio,
            }),
            clientIp,
          ]
        );

        return NextResponse.json({
          success: true,
          message: 'Application submitted successfully',
          queued: true,
        }, { status: 201 });
      } catch (queueError) {
        console.error('Queue error:', queueError);
        return NextResponse.json(
          { error: 'Unable to process application. Please try again later.' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your application.' },
      { status: 500 }
    );
  }
}
