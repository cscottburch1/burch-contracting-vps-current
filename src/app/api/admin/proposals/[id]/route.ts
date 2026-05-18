import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import mysql from '@/lib/mysql';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: rawId } = await context.params;
    const proposalId = parseInt(rawId, 10);
    if (isNaN(proposalId) || proposalId <= 0) {
      return NextResponse.json({ error: 'Invalid proposal ID' }, { status: 400 });
    }

    const [proposals] = await mysql.query(
      `SELECT * FROM proposals WHERE id = ?`,
      [proposalId]
    );

    if (!proposals || (proposals as any[]).length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({ proposal: (proposals as any[])[0] });

  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: rawId } = await context.params;
    const proposalId = parseInt(rawId, 10);
    if (isNaN(proposalId) || proposalId <= 0) {
      return NextResponse.json({ error: 'Invalid proposal ID' }, { status: 400 });
    }
    const data = await request.json();

    if (data.status && Object.keys(data).length === 1) {
      await mysql.query(
        `UPDATE proposals SET status = ?, updated_at = NOW() WHERE id = ?`,
        [data.status, proposalId]
      );
    } else {
      const { customer_id, items, subtotal, tax, total, notes } = data;
      await mysql.query(
        `UPDATE proposals
         SET customer_id = ?, items_json = ?, subtotal = ?, tax = ?, total = ?, notes = ?, updated_at = NOW()
         WHERE id = ?`,
        [customer_id, JSON.stringify(items), subtotal, tax, total, notes || '', proposalId]
      );
    }

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

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: rawId } = await context.params;
    const proposalId = parseInt(rawId, 10);
    if (isNaN(proposalId) || proposalId <= 0) {
      return NextResponse.json({ error: 'Invalid proposal ID' }, { status: 400 });
    }

    const [proposals] = await mysql.query(
      `SELECT status FROM proposals WHERE id = ?`,
      [proposalId]
    );

    if (!proposals || (proposals as any[]).length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const proposal = (proposals as any[])[0];
    if (proposal.status === 'accepted') {
      return NextResponse.json(
        { error: 'Cannot delete accepted proposals' },
        { status: 400 }
      );
    }

    await mysql.query(`DELETE FROM proposals WHERE id = ?`, [proposalId]);

    return NextResponse.json({
      success: true,
      message: 'Proposal deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { error: 'Failed to delete proposal' },
      { status: 500 }
    );
  }
}
