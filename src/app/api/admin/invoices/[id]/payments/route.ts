import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mysql from '@/lib/mysql';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: invoiceId } = await context.params;
    const { amount, payment_method, payment_date, notes } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid payment amount required' }, { status: 400 });
    }

    // Create invoice_payments table if not exists
    await mysql.query(`
      CREATE TABLE IF NOT EXISTS invoice_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        payment_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
      )
    `);

    // Record payment
    await mysql.query(
      `INSERT INTO invoice_payments (invoice_id, amount, payment_method, payment_date, notes) 
       VALUES (?, ?, ?, ?, ?)`,
      [invoiceId, amount, payment_method || 'cash', payment_date || new Date().toISOString().split('T')[0], notes || '']
    );

    // Update invoice amount_paid and status
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
