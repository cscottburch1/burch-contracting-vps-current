import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import mysql from '@/lib/mysql';

export async function GET() {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [proposals] = await mysql.query(
      `SELECT * FROM proposals ORDER BY created_at DESC LIMIT 100`
    );

    return NextResponse.json({ proposals });

  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
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
      proposalNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      proposalDate,
      expirationDate,
      items,
      laborSubtotal = 0,
      serviceCharge = 0,
      subtotal,
      taxRate,
      tax,
      total,
      notes,
      proposalType,
      status = 'draft'
    } = data;

    const [result] = await mysql.query(
      `INSERT INTO proposals
      (proposal_number, customer_id, customer_name, customer_email, customer_phone,
       customer_address, proposal_date, expiration_date, proposal_type,
       labor_subtotal, service_charge, subtotal, tax_rate, tax, total, notes, status, items_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        proposalNumber,
        customerId || null,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        proposalDate,
        expirationDate,
        proposalType,
        laborSubtotal,
        serviceCharge,
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
          `Proposal ${proposalNumber} created - ${proposalType} - Total: $${total.toFixed(2)}`
        ]
      );
    }

    return NextResponse.json({
      success: true,
      proposalId: (result as any).insertId,
      message: 'Proposal saved successfully'
    });

  } catch (error) {
    console.error('Error saving proposal:', error);
    return NextResponse.json(
      { error: 'Failed to save proposal' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, status } = data;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await mysql.query(
      `UPDATE proposals SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Proposal updated successfully'
    });

  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 500 }
    );
  }
}
