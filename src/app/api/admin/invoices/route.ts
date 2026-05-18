import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import mysql from '@/lib/mysql';

export async function GET() {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [invoices] = await mysql.query(
      `SELECT * FROM invoices ORDER BY created_at DESC LIMIT 200`
    );

    return NextResponse.json({ invoices });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      invoiceNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      invoiceDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      tax,
      total,
      notes,
      invoiceType,
      status = 'draft'
    } = data;

    const [result] = await mysql.query(
      `INSERT INTO invoices
      (invoice_number, customer_id, customer_name, customer_email, customer_phone,
       customer_address, invoice_date, due_date, invoice_type,
       subtotal, tax_rate, tax, total, notes, status, items_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        invoiceNumber,
        customerId || null,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        invoiceDate,
        dueDate,
        invoiceType,
        subtotal,
        taxRate,
        tax,
        total,
        notes,
        status,
        JSON.stringify(items)
      ]
    );

    if (customerId) {
      await mysql.query(
        `INSERT INTO customer_notes (customer_id, note, created_by, created_at)
         VALUES (?, ?, 'admin', NOW())`,
        [
          customerId,
          `Invoice ${invoiceNumber} created - ${invoiceType} - Total: $${total.toFixed(2)}`
        ]
      );
    }

    return NextResponse.json({
      success: true,
      invoiceId: (result as any).insertId,
      message: 'Invoice created successfully'
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
