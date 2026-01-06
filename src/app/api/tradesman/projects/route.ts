import { NextResponse } from 'next/server';
import { getCurrentTradesman } from '@/lib/tradesmanAuth';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    const tradesman = await getCurrentTradesman();
    
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get projects assigned to this tradesman
    const projects = await query(
      `SELECT 
        p.id,
        p.title,
        p.description,
        p.status,
        p.start_date,
        p.end_date,
        c.name as customer_name,
        tpa.role,
        tpa.assigned_date,
        (SELECT COUNT(*) FROM project_photos WHERE project_id = p.id) as photo_count
      FROM tradesman_project_assignments tpa
      JOIN projects p ON tpa.project_id = p.id
      LEFT JOIN customers c ON p.customer_id = c.id
      WHERE tpa.tradesman_id = ?
      AND p.status IN ('pending', 'active')
      ORDER BY p.start_date DESC`,
      [tradesman.id]
    );
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
