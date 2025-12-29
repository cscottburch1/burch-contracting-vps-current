import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// Create project_subcontractors table if it doesn't exist
async function ensureProjectSubcontractorsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS project_subcontractors (
      id INT PRIMARY KEY AUTO_INCREMENT,
      project_id INT NOT NULL,
      subcontractor_id INT NOT NULL,
      role VARCHAR(100),
      notes TEXT,
      amount_quoted DECIMAL(10, 2),
      amount_paid DECIMAL(10, 2) DEFAULT 0,
      status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
      assigned_date DATE,
      start_date DATE,
      completion_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE CASCADE,
      UNIQUE KEY unique_project_sub (project_id, subcontractor_id, role),
      INDEX idx_project_id (project_id),
      INDEX idx_subcontractor_id (subcontractor_id),
      INDEX idx_status (status)
    )
  `);
}

// GET - Fetch all subcontractors assigned to a project
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

    await ensureProjectSubcontractorsTable();

    const assignments = await query(
      `SELECT 
         ps.id, ps.project_id, ps.subcontractor_id, ps.role, ps.notes,
         ps.amount_quoted, ps.amount_paid, ps.status, ps.assigned_date,
         ps.start_date, ps.completion_date, ps.created_at,
         s.company_name as subcontractor_name, s.contact_name, s.phone, s.email
       FROM project_subcontractors ps
       JOIN subcontractors s ON ps.subcontractor_id = s.id
       WHERE ps.project_id = ?
       ORDER BY ps.created_at DESC`,
      [projectId]
    );

    return NextResponse.json({ assignments: assignments || [] });
  } catch (error) {
    console.error('Fetch subcontractor assignments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

// POST - Assign subcontractor to project
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

    await ensureProjectSubcontractorsTable();

    const {
      subcontractor_id,
      role,
      notes,
      amount_quoted,
      status,
      assigned_date,
      start_date
    } = await request.json();

    if (!subcontractor_id) {
      return NextResponse.json(
        { error: 'Subcontractor ID is required' },
        { status: 400 }
      );
    }

    // Verify subcontractor exists
    const subs = await query(
      'SELECT name FROM subcontractors WHERE id = ?',
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

    // Log activity
    const sub = subs[0] as any;
    await query(
      `INSERT INTO project_activity (project_id, activity_type, description, user_name)
       VALUES (?, 'subcontractor_assigned', ?, ?)`,
      [projectId, `Assigned subcontractor: ${sub.name}${role ? ` (${role})` : ''}`, adminUser.name]
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
    
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'This subcontractor is already assigned to this role' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to assign subcontractor' },
      { status: 500 }
    );
  }
}
