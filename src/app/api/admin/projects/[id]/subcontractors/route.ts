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

    const assignments = await query(
      `SELECT
         ps.id as assignment_id, ps.project_id, ps.subcontractor_id, ps.role, ps.notes,
         ps.amount_quoted, ps.amount_paid, ps.status, ps.assigned_date,
         ps.start_date, ps.completion_date, ps.created_at,
         s.company_name as company, s.contact_name as name, s.phone, s.email
       FROM project_subcontractors ps
       JOIN subcontractors s ON ps.subcontractor_id = s.id
       WHERE ps.project_id = ?
       ORDER BY ps.created_at DESC`,
      [projectId]
    );

    return NextResponse.json({ subcontractors: assignments || [] });
  } catch (error) {
    console.error('Fetch subcontractor assignments error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
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

    const { subcontractor_id, role, notes, amount_quoted, status, assigned_date, start_date } = await request.json();

    if (!subcontractor_id) {
      return NextResponse.json({ error: 'Subcontractor ID is required' }, { status: 400 });
    }

    const subs = await query(
      'SELECT company_name, contact_name FROM subcontractors WHERE id = ?',
      [subcontractor_id]
    );
    if (!Array.isArray(subs) || subs.length === 0) {
      return NextResponse.json({ error: 'Subcontractor not found' }, { status: 404 });
    }

    const result = await query(
      `INSERT INTO project_subcontractors
       (project_id, subcontractor_id, role, notes, amount_quoted, status, assigned_date, start_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        subcontractor_id,
        role || null,
        notes || null,
        amount_quoted || null,
        status || 'pending',
        assigned_date || new Date().toISOString().split('T')[0],
        start_date || null
      ]
    );

    const sub = subs[0] as any;
    await query(
      `INSERT INTO project_activity (project_id, activity_type, description, user_name)
       VALUES (?, 'subcontractor_assigned', ?, ?)`,
      [projectId, `Assigned subcontractor: ${sub.company_name}${role ? ` (${role})` : ''}`, adminUser.name]
    );

    return NextResponse.json({
      success: true,
      assignment: {
        id: (result as any).insertId,
        project_id: projectId,
        subcontractor_id,
        role,
        notes,
        amount_quoted,
        status: status || 'pending'
      }
    });
  } catch (error: any) {
    console.error('Assign subcontractor error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'This subcontractor is already assigned to this role' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to assign subcontractor' }, { status: 500 });
  }
}
