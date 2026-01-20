import { NextResponse } from 'next/server';
import { verifyAdminAuth, findAdminById } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// GET - Get specific tradesman
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAdminAuth(request);
    let adminUser = null;
    if (session) adminUser = await findAdminById(session.userId);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const id = parseInt(params.id);

    const tradesmen = await query(
      'SELECT id, name, email, phone, pin, is_active, created_at FROM tradesman_users WHERE id = ?',
      [id]
    );

    if (!Array.isArray(tradesmen) || tradesmen.length === 0) {
      return NextResponse.json({ error: 'Tradesman not found' }, { status: 404 });
    }

    return NextResponse.json({ tradesman: tradesmen[0] });
  } catch (error) {
    console.error('Error fetching tradesman:', error);
    return NextResponse.json({ error: 'Failed to fetch tradesman' }, { status: 500 });
  }
}

// PATCH - Update tradesman
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAdminAuth(request);
    let adminUser = null;
    if (session) adminUser = await findAdminById(session.userId);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const id = parseInt(params.id);
    const body = await request.json();

    const updateFields: string[] = [];
    const values: any[] = [];

    if (body.name !== undefined) {
      updateFields.push('name = ?');
      values.push(body.name);
    }
    if (body.email !== undefined) {
      updateFields.push('email = ?');
      values.push(body.email);
    }
    if (body.phone !== undefined) {
      updateFields.push('phone = ?');
      values.push(body.phone);
    }
    if (body.pin !== undefined) {
      if (!/^\d{6}$/.test(body.pin)) {
        return NextResponse.json(
          { error: 'PIN must be exactly 6 digits' },
          { status: 400 }
        );
      }
      updateFields.push('pin = ?');
      values.push(body.pin);
    }
    if (body.is_active !== undefined) {
      updateFields.push('is_active = ?');
      values.push(body.is_active);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);

    await query(
      `UPDATE tradesman_users SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating tradesman:', error);
    return NextResponse.json({ error: 'Failed to update tradesman' }, { status: 500 });
  }
}

// DELETE - Delete tradesman
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAdminAuth(request);
    let adminUser = null;
    if (session) adminUser = await findAdminById(session.userId);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const id = parseInt(params.id);

    // Delete project assignments first
    await query('DELETE FROM tradesman_project_assignments WHERE tradesman_id = ?', [id]);

    // Delete tradesman
    await query('DELETE FROM tradesman_users WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tradesman:', error);
    return NextResponse.json({ error: 'Failed to delete tradesman' }, { status: 500 });
  }
}
