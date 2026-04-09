import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      invoiceNumber,
      customerName,
      customerEmail,
      invoiceDate,
      dueDate,
      items,
      subtotal,
      tax,
      total,
      amountPaid,
      notes
    } = data;

    // Build items table
    const itemsRows = items.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151;">${item.description}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151;">$${parseFloat(item.price).toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #1e40af;">$${parseFloat(item.total).toFixed(2)}</td>
      </tr>
    `).join('');

    const balance = parseFloat(total) - parseFloat(amountPaid || 0);

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #1e40af;">
              <img src="https://burchcontracting.com/logo-transparent.webp" alt="Burch Contracting" style="max-width: 200px; height: auto; margin-bottom: 10px;" />
              <div style="font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 5px;">INVOICE</div>
              <div style="font-size: 14px; color: #6b7280;">${invoiceNumber}</div>
            </td>
          </tr>

          <!-- Invoice Info -->
          <tr>
            <td style="padding: 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width: 50%; vertical-align: top;">
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">BILL TO:</div>
                    <div style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 5px;">${customerName}</div>
                  </td>
                  <td style="width: 50%; vertical-align: top; text-align: right;">
                    <div style="margin-bottom: 8px;">
                      <span style="font-size: 12px; color: #6b7280;">Invoice Date:</span>
                      <span style="font-size: 14px; color: #111827; font-weight: 600; margin-left: 10px;">${new Date(invoiceDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span style="font-size: 12px; color: #6b7280;">Due Date:</span>
                      <span style="font-size: 14px; color: #dc2626; font-weight: 600; margin-left: 10px;">${new Date(dueDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; border-bottom: 2px solid #e5e7eb;">DESCRIPTION</th>
                    <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; border-bottom: 2px solid #e5e7eb;">QTY</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; border-bottom: 2px solid #e5e7eb;">RATE</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; border-bottom: 2px solid #e5e7eb;">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width: 60%;"></td>
                  <td style="width: 40%;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Subtotal:</td>
                        <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #111827; font-weight: 600;">$${parseFloat(subtotal).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Tax:</td>
                        <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #111827; font-weight: 600;">$${parseFloat(tax).toFixed(2)}</td>
                      </tr>
                      <tr style="border-top: 2px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-size: 16px; color: #111827; font-weight: 700;">Total:</td>
                        <td style="padding: 12px 0; text-align: right; font-size: 18px; color: #1e40af; font-weight: 700;">$${parseFloat(total).toFixed(2)}</td>
                      </tr>
                      ${amountPaid > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #059669;">Amount Paid:</td>
                        <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #059669; font-weight: 600;">-$${parseFloat(amountPaid).toFixed(2)}</td>
                      </tr>
                      <tr style="border-top: 2px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-size: 16px; color: #dc2626; font-weight: 700;">Balance Due:</td>
                        <td style="padding: 12px 0; text-align: right; font-size: 18px; color: #dc2626; font-weight: 700;">$${balance.toFixed(2)}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${notes ? `
          <!-- Notes -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; border-left: 4px solid #1e40af;">
                <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">NOTES:</div>
                <div style="font-size: 14px; color: #374151; line-height: 1.6;">${notes}</div>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Payment Instructions -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; border: 1px solid #bfdbfe;">
                <div style="font-size: 14px; font-weight: 600; color: #1e40af; margin-bottom: 10px;">Payment Instructions:</div>
                <div style="font-size: 13px; color: #1e40af; line-height: 1.6;">
                  • Checks payable to: <strong>Burch Contracting LLC</strong><br>
                  • Mail to: PO Box 123, Simpsonville, SC 29681<br>
                  • Questions? Call us at <strong>(864) 724-4600</strong>
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
              <div style="font-size: 16px; font-weight: bold; color: #1e40af; margin-bottom: 5px;">BURCH CONTRACTING</div>
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 10px;">Construction & Remodeling</div>
              <div style="font-size: 12px; color: #6b7280;">
                📞 (864) 724-4600 | ✉️ estimates@burchcontracting.com<br>
                🌐 <a href="https://burchcontracting.com" style="color: #2563eb; text-decoration: none;">burchcontracting.com</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await sendEmail(
      customerEmail,
      `Invoice ${invoiceNumber} from Burch Contracting`,
      emailHtml
    );

    return NextResponse.json({ success: true, message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json({ error: 'Failed to send invoice' }, { status: 500 });
  }
}
