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
          p.title,
          p.description,
          p.start_date,
          p.end_date,
          p.status,
          p.budget,
          p.created_at,
          p.updated_at,
          c.name as customer_name,
          c.email as customer_email
        FROM projects p
        LEFT JOIN customers c ON p.customer_id = c.id
        ORDER BY 
          CASE p.status
            WHEN 'active' THEN 1
            WHEN 'pending' THEN 2
            WHEN 'completed' THEN 3
            WHEN 'cancelled' THEN 4
          END,
          p.start_date DESC`
      );

      // Map database fields to frontend expected fields
      const projects = (projectsRaw as any[]).map(p => ({
        id: p.id,
        customer_id: p.customer_id,
        customer_name: p.customer_name,
        customer_email: p.customer_email,
        project_name: p.title,
        project_type: 'Remodeling', // Default since not stored in this table
        description: p.description,
        start_date: p.start_date,
        estimated_completion_date: p.end_date,
        actual_completion_date: null,
        status: p.status === 'active' ? 'in_progress' : 
                p.status === 'pending' ? 'scheduled' : 
                p.status === 'completed' ? 'completed' : 'cancelled',
        completion_percentage: p.status === 'completed' ? 100 : 
                               p.status === 'active' ? 50 : 0,
        total_cost: p.budget,
        city: '',
        state: '',
        created_at: p.created_at,
        updated_at: p.updated_at
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
      project_name, // will be mapped to 'title'
      description,
      start_date,
      estimated_completion_date, // will be mapped to 'end_date'
    } = data;

    if (!customer_id || !project_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      // Map frontend fields to database columns
      const [result] = await connection.execute(
        `INSERT INTO projects (
          customer_id, title, description,
          start_date, end_date, status
        ) VALUES (?, ?, ?, ?, ?, 'pending')`,
        [
          customer_id,
          project_name, // maps to 'title'
          description || null,
          start_date || null,
          estimated_completion_date || null, // maps to 'end_date'
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
