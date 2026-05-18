import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import mysql from '@/lib/mysql';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: rawId } = await context.params;
    const invoiceId = parseInt(rawId, 10);
    if (isNaN(invoiceId) || invoiceId <= 0) {
      return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 });
    }
    const { amount, payment_method, payment_date, notes } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid payment amount required' }, { status: 400 });
    }

    await mysql.query(
      `INSERT INTO invoice_payments (invoice_id, amount, payment_method, payment_date, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [invoiceId, amount, payment_method || 'cash', payment_date || new Date().toISOString().split('T')[0], notes || '']
    );

    const [invoices] = await mysql.query(
      `SELECT total, amount_paid FROM invoices WHERE id = ?`,
      [invoiceId]
    );

    if (invoices && (invoices as any[]).length > 0) {
      const invoice = (invoices as any[])[0];
      const newAmountPaid = parseFloat(invoice.amount_paid || 0) + parseFloat(amount);
      const total = parseFloat(invoice.total);

      let newStatus = 'unpaid';
      if (newAmountPaid >= total) {
        newStatus = 'paid';
      } else if (newAmountPaid > 0) {
        newStatus = 'partial';
      }

      await mysql.query(
        `UPDATE invoices SET amount_paid = ?, status = ?, updated_at = NOW() WHERE id = ?`,
        [newAmountPaid, newStatus, invoiceId]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment recorded successfully'
    });

  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}
