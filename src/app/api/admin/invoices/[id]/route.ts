import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mysql from '@/lib/mysql';

export async function GET(
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

    const [invoices] = await mysql.query(
      `SELECT i.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone 
       FROM invoices i 
       LEFT JOIN customers c ON i.customer_id = c.id 
       WHERE i.id = ?`,
      [invoiceId]
    );

    if (!invoices || (invoices as any[]).length === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = (invoices as any[])[0];

    // Get payment history
    const payments = await mysql.query(
      `SELECT * FROM invoice_payments WHERE invoice_id = ? ORDER BY payment_date DESC`,
      [invoiceId]
    );

    return NextResponse.json({ 
      invoice,
      payments: payments || []
    });

  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const data = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    if (data.invoice_number !== undefined) {
      updates.push('invoice_number = ?');
      values.push(data.invoice_number);
    }

    if (data.customer_id !== undefined) {
      updates.push('customer_id = ?');
      values.push(data.customer_id);
    }

    if (data.project_id !== undefined) {
      updates.push('project_id = ?');
      values.push(data.project_id);
    }

    if (data.items !== undefined) {
      updates.push('items = ?');
      values.push(JSON.stringify(data.items));
    }

    if (data.subtotal !== undefined) {
      updates.push('subtotal = ?');
      values.push(data.subtotal);
    }

    if (data.tax !== undefined) {
      updates.push('tax = ?');
      values.push(data.tax);
    }

    if (data.total !== undefined) {
      updates.push('total = ?');
      values.push(data.total);
    }

    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }

    if (data.due_date !== undefined) {
      updates.push('due_date = ?');
      values.push(data.due_date);
    }

    if (data.notes !== undefined) {
      updates.push('notes = ?');
      values.push(data.notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(invoiceId);
    await mysql.query(
      `UPDATE invoices SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return NextResponse.json({ 
      success: true,
      message: 'Invoice updated successfully'
    });

  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if invoice has any payments
    const [payments] = await mysql.query(
      `SELECT COUNT(*) as count FROM invoice_payments WHERE invoice_id = ?`,
      [invoiceId]
    );

    if ((payments as any[])[0].count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete invoice with payment history. Mark as cancelled instead.' },
        { status: 400 }
      );
    }

    await mysql.query(`DELETE FROM invoices WHERE id = ?`, [invoiceId]);

    return NextResponse.json({ 
      success: true,
      message: 'Invoice deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
