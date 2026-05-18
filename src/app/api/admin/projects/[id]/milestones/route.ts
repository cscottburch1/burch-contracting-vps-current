import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';

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
    const projectId = parseInt(params.id, 10);

    const [milestones] = await pool.query(
      `SELECT id, title, description, due_date,
              completed_date, status, order_index, created_at, updated_at
       FROM project_milestones
       WHERE project_id = ?
       ORDER BY order_index ASC, due_date ASC`,
      [projectId]
    );

    return NextResponse.json({ milestones: milestones || [] });
  } catch (error) {
    console.error('Fetch milestones error:', error);
    return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 });
  }
}

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
    const projectId = parseInt(params.id, 10);

    const [projects] = await pool.query('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { title, description, due_date, status, order_index } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const [result] = await pool.query(
      `INSERT INTO project_milestones
       (project_id, title, description, due_date, status, order_index)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [projectId, title, description || null, due_date || null, status || 'pending', order_index || 0]
    );

    await pool.query(
      `INSERT INTO project_activity (project_id, activity_type, description, user_name)
       VALUES (?, 'milestone_created', ?, ?)`,
      [projectId, `Created milestone: ${title}`, adminUser.name]
    );

    return NextResponse.json({
      success: true,
      milestone: {
        id: (result as any).insertId,
        project_id: projectId,
        title,
        description,
        due_date,
        status: status || 'pending',
        order_index: order_index || 0
      }
    });
  } catch (error) {
    console.error('Create milestone error:', error);
    return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 });
  }
}
