import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// Create project_activity table if it doesn't exist
async function ensureProjectActivityTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS project_activity (
      id INT PRIMARY KEY AUTO_INCREMENT,
      project_id INT NOT NULL,
      activity_type VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      user_name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      INDEX idx_project_id (project_id),
      INDEX idx_activity_type (activity_type),
      INDEX idx_created_at (created_at DESC)
    )
  `);
}

// GET - Fetch activity log for a project
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
    const projectId = parseInt(params.id);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    await ensureProjectActivityTable();

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
    return NextResponse.json(
      { error: 'Failed to fetch activity log' },
      { status: 500 }
    );
  }
}

// POST - Add manual activity entry
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
    const projectId = parseInt(params.id);

    // Verify project exists
    const projects = await query('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await ensureProjectActivityTable();

    const { activity_type, description } = await request.json();

    if (!activity_type || !description) {
      return NextResponse.json(
        { error: 'Activity type and description are required' },
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: 'Failed to create activity entry' },
      { status: 500 }
    );
  }
}
