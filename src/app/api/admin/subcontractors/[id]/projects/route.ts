import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// GET /api/admin/subcontractors/[id]/projects - Get subcontractor's project history
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    const projects: any = await query(
      `SELECT 
        p.id,
        p.title,
        p.status,
        ps.role,
        ps.amount_quoted,
        ps.amount_paid,
        ps.assigned_at as start_date,
        ps.completed_at as end_date
      FROM project_subcontractors ps
      JOIN projects p ON ps.project_id = p.id
      WHERE ps.subcontractor_id = ?
      ORDER BY ps.assigned_at DESC`,
      [id]
    );

    return NextResponse.json({ projects: projects || [] });
  } catch (error) {
    console.error('Error fetching subcontractor projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
