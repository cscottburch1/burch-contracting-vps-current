import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// PATCH - Update milestone
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const milestoneId = parseInt(params.milestoneId);
    const projectId = parseInt(params.id);

    const { title, description, due_date, status, order_index, completed_date } = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push('milestone_name = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (due_date !== undefined) {
      updates.push('scheduled_date = ?');
      values.push(due_date);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
      
      // Auto-set completed_date when status changes to completed
      if (status === 'completed' && completed_date === undefined) {
        updates.push('completed_date = NOW()');
      } else if (status !== 'completed') {
        updates.push('completed_date = NULL');
      }
    }
    if (completed_date !== undefined) {
      updates.push('completed_date = ?');
      values.push(completed_date);
    }
    if (order_index !== undefined) {
      updates.push('order_num = ?');
      values.push(order_index);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(milestoneId);

    await query(
      `UPDATE project_milestones SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Log activity
    let activityDesc = 'Updated milestone';
    if (status === 'completed') {
      activityDesc = `Completed milestone: ${title || 'milestone'}`;
    } else if (title) {
      activityDesc = `Updated milestone: ${title}`;
    }

    await query(
      `INSERT INTO project_activity (project_id, activity_type, description, user_name)
       VALUES (?, 'milestone_updated', ?, ?)`,
      [projectId, activityDesc, adminUser.name]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update milestone error:', error);
    return NextResponse.json(
      { error: 'Failed to update milestone' },
      { status: 500 }
    );
  }
}

// DELETE - Delete milestone
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const milestoneId = parseInt(params.milestoneId);
    const projectId = parseInt(params.id);

    // Get milestone title for activity log
    const milestones = await query(
      'SELECT title FROM project_milestones WHERE id = ?',
      [milestoneId]
    );

    if (!Array.isArray(milestones) || milestones.length === 0) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    const milestone = milestones[0] as any;

    await query('DELETE FROM project_milestones WHERE id = ?', [milestoneId]);

    // Log activity
    await query(
      `INSERT INTO project_activity (project_id, activity_type, description, user_name)
       VALUES (?, 'milestone_deleted', ?, ?)`,
      [projectId, `Deleted milestone: ${milestone.title}`, adminUser.name]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete milestone error:', error);
    return NextResponse.json(
      { error: 'Failed to delete milestone' },
      { status: 500 }
    );
  }
}
