import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// GET - Get project assignments for a tradesman
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const tradesmanId = parseInt(params.id);

    const assignments = await query(
      `SELECT 
        a.id, a.project_id, a.assigned_at,
        p.title as project_title,
        p.status as project_status,
        c.name as customer_name
       FROM tradesman_project_assignments a
       JOIN projects p ON a.project_id = p.id
       LEFT JOIN customers c ON p.customer_id = c.id
       WHERE a.tradesman_id = ?
       ORDER BY a.assigned_at DESC`,
      [tradesmanId]
    );

    return NextResponse.json({ assignments: Array.isArray(assignments) ? assignments : [] });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

// POST - Assign tradesman to project
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const tradesmanId = parseInt(params.id);
    const body = await request.json();
    const { project_id } = body;

    if (!project_id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Check if already assigned
    const existing = await query(
      'SELECT id FROM tradesman_project_assignments WHERE tradesman_id = ? AND project_id = ?',
      [tradesmanId, project_id]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ error: 'Already assigned to this project' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO tradesman_project_assignments (tradesman_id, project_id) VALUES (?, ?)',
      [tradesmanId, project_id]
    );

    const insertResult = result as any;

    return NextResponse.json({
      success: true,
      assignment: {
        id: insertResult.insertId,
        tradesman_id: tradesmanId,
        project_id
      }
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}

// DELETE - Remove project assignment
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignment_id');

    if (!assignmentId) {
      return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
    }

    await query('DELETE FROM tradesman_project_assignments WHERE id = ?', [parseInt(assignmentId)]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}
