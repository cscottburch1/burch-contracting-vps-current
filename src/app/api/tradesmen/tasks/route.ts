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

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const tasks = await query(
      `SELECT * FROM tradesman_tasks 
       WHERE project_id = ? AND (assigned_to IS NULL OR assigned_to = ?)
       ORDER BY 
         CASE status 
           WHEN 'in_progress' THEN 1 
           WHEN 'pending' THEN 2 
           WHEN 'completed' THEN 3 
         END,
         CASE priority 
           WHEN 'high' THEN 1 
           WHEN 'medium' THEN 2 
           WHEN 'low' THEN 3 
         END,
         due_date ASC`,
      [projectId, tradesman.id]
    );

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const tradesman = await getCurrentTradesman();
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { task_id, status } = await request.json();

    if (!task_id || !status) {
      return NextResponse.json({ error: 'Task ID and status required' }, { status: 400 });
    }

    const completedAt = status === 'completed' ? 'NOW()' : 'NULL';

    await query(
      `UPDATE tradesman_tasks 
       SET status = ?, completed_at = ${completedAt}
       WHERE id = ? AND (assigned_to IS NULL OR assigned_to = ?)`,
      [status, task_id, tradesman.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
