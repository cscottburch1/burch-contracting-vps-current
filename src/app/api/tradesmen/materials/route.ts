import { NextResponse } from 'next/server';
import { getCurrentTradesman } from '@/lib/tradesmanAuth';
import { query } from '@/lib/mysql';

export async function GET(request: Request) {
  try {
    const tradesman = await getCurrentTradesman();
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    let requests;
    if (projectId) {
      requests = await query(
        `SELECT mr.*, p.title as project_title 
         FROM tradesman_material_requests mr
         JOIN projects p ON mr.project_id = p.id
         WHERE mr.tradesman_id = ? AND mr.project_id = ?
         ORDER BY mr.created_at DESC`,
        [tradesman.id, projectId]
      );
    } else {
      requests = await query(
        `SELECT mr.*, p.title as project_title 
         FROM tradesman_material_requests mr
         JOIN projects p ON mr.project_id = p.id
         WHERE mr.tradesman_id = ?
         ORDER BY mr.created_at DESC
         LIMIT 50`,
        [tradesman.id]
      );
    }

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching material requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tradesman = await getCurrentTradesman();
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { project_id, item_name, quantity, priority, reason, needed_by_date } = await request.json();

    if (!project_id || !item_name || !quantity) {
      return NextResponse.json({ error: 'Project ID, item name, and quantity are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO tradesman_material_requests 
       (tradesman_id, project_id, item_name, quantity, priority, reason, needed_by_date, requested_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [tradesman.id, project_id, item_name, quantity, priority || 'medium', reason || null, needed_by_date || null]
    );

    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error('Error creating material request:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
