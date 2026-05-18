import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

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

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

    const activities = await query(
      `SELECT id, activity_type, description, user_name, created_at
       FROM project_activity
       WHERE project_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [projectId, limit]
    );

    return NextResponse.json({ activities: activities || [] });
  } catch (error) {
    console.error('Fetch activity log error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity log' }, { status: 500 });
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

    const projects = await query('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { activity_type, description } = await request.json();

    if (!activity_type || !description) {
      return NextResponse.json({ error: 'Activity type and description are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO project_activity (project_id, activity_type, description, user_name)
       VALUES (?, ?, ?, ?)`,
      [projectId, activity_type, description, adminUser.name]
    );

    return NextResponse.json({
      success: true,
      activity: {
        id: (result as any).insertId,
        project_id: projectId,
        activity_type,
        description,
        user_name: adminUser.name,
        created_at: new Date()
      }
    });
  } catch (error) {
    console.error('Create activity entry error:', error);
    return NextResponse.json({ error: 'Failed to create activity entry' }, { status: 500 });
  }
}
