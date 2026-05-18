import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    try {
      // Fetch all projects with customer info
      // Map database columns to frontend expected field names
      const [projectsRaw] = await connection.execute(
        `SELECT 
          p.id,
          p.customer_id,
          p.project_name,
          p.project_type,
          p.description,
          p.start_date,
          p.estimated_completion_date,
          p.actual_completion_date,
          p.status,
          p.completion_percentage,
          p.total_cost,
          p.address_line1,
          p.address_line2,
          p.city,
          p.state,
          p.zip_code,
          p.created_at,
          p.updated_at,
          c.name as customer_name,
          c.email as customer_email
        FROM projects p
        LEFT JOIN customers c ON p.customer_id = c.id
        ORDER BY 
          CASE p.status
            WHEN 'in_progress' THEN 1
            WHEN 'scheduled' THEN 2
            WHEN 'completed' THEN 3
            WHEN 'cancelled' THEN 4
            WHEN 'on_hold' THEN 5
          END,
          p.start_date DESC`
      );

      // Ensure customer name shows even if customer was deleted
      const projects = (projectsRaw as any[]).map(p => ({
        ...p,
        customer_name: p.customer_name || 'Deleted Customer',
        customer_email: p.customer_email || ''
      }));

      return NextResponse.json({ projects });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      customer_id,
      project_name,
      project_type,
      description,
      start_date,
      estimated_completion_date,
      total_cost,
      address_line1,
      address_line2,
      city,
      state,
      zip_code,
    } = data;

    if (!customer_id || !project_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      // Verify customer exists
      const [customers] = await connection.execute(
        'SELECT id FROM customers WHERE id = ?',
        [customer_id]
      );

      if (!Array.isArray(customers) || customers.length === 0) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }

      const [result] = await connection.execute(
        `INSERT INTO projects (
          customer_id, project_name, project_type, description,
          start_date, estimated_completion_date, total_cost,
          address_line1, address_line2, city, state, zip_code, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
        [
          customer_id,
          project_name,
          project_type || 'General',
          description || null,
          start_date || null,
          estimated_completion_date || null,
          total_cost ? parseFloat(total_cost) : null,
          address_line1 || null,
          address_line2 || null,
          city || null,
          state ? String(state).toUpperCase().slice(0, 2) : null,
          zip_code || null,
        ]
      );

      const projectId = (result as any).insertId;

      return NextResponse.json({ success: true, projectId });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
