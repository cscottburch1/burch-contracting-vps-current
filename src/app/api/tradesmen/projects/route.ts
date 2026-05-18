import { NextResponse } from 'next/server';
import { getCurrentTradesman } from '@/lib/tradesmanAuth';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    const tradesman = await getCurrentTradesman();
    
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get projects from both tradesman_project_assignments and project_subcontractors
    const projects = await query(
      `SELECT DISTINCT
        p.id,
        p.project_name AS title,
        p.description,
        p.status,
        p.start_date,
        p.estimated_completion_date AS end_date,
        c.name as customer_name,
        COALESCE(tpa.role, ps.role, 'Crew Member') as role,
        COALESCE(tpa.assigned_date, ps.assigned_date) as assigned_date,
        (SELECT COUNT(*) FROM project_photos WHERE project_id = p.id) as photo_count
      FROM projects p
      LEFT JOIN customers c ON p.customer_id = c.id
      LEFT JOIN tradesman_project_assignments tpa ON tpa.project_id = p.id AND tpa.tradesman_id = ?
      LEFT JOIN project_subcontractors ps ON ps.project_id = p.id AND ps.subcontractor_id = ?
      WHERE (tpa.tradesman_id = ? OR ps.subcontractor_id = ?)
      AND p.status IN ('pending', 'active', 'in_progress')
      ORDER BY p.start_date DESC`,
      [tradesman.id, tradesman.id, tradesman.id, tradesman.id]
    );
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
