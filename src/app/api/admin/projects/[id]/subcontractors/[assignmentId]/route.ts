import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// PATCH - Update subcontractor assignment
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; assignmentId: string }> }
) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const assignmentId = parseInt(params.assignmentId);
    const projectId = parseInt(params.id);

    const {
      role,
      notes,
      amount_quoted,
      amount_paid,
      status,
      start_date,
      completion_date
    } = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    if (role !== undefined) {
      updates.push('role = ?');
      values.push(role);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }
    if (amount_quoted !== undefined) {
      updates.push('amount_quoted = ?');
      values.push(amount_quoted);
    }
    if (amount_paid !== undefined) {
      updates.push('amount_paid = ?');
      values.push(amount_paid);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
      
      // Auto-set completion_date when status changes to completed
      if (status === 'completed' && completion_date === undefined) {
        updates.push('completion_date = NOW()');
      }
    }
    if (start_date !== undefined) {
      updates.push('start_date = ?');
      values.push(start_date);
    }
    if (completion_date !== undefined) {
      updates.push('completion_date = ?');
      values.push(completion_date);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(assignmentId);

    await query(
      `UPDATE project_subcontractors SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Log activity for significant changes
    if (status === 'completed') {
      const assignments = await query(
        `SELECT s.name FROM project_subcontractors ps 
         JOIN subcontractors s ON ps.subcontractor_id = s.id 
         WHERE ps.id = ?`,
        [assignmentId]
      );
      if (Array.isArray(assignments) && assignments.length > 0) {
        const assignment = assignments[0] as any;
        await query(
          `INSERT INTO project_activity (project_id, activity_type, description, user_name)
           VALUES (?, 'subcontractor_completed', ?, ?)`,
          [projectId, `Subcontractor work completed: ${assignment.name}`, adminUser.name]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update subcontractor assignment error:', error);
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    );
  }
}

// DELETE - Remove subcontractor assignment
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; assignmentId: string }> }
) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const assignmentId = parseInt(params.assignmentId);
    const projectId = parseInt(params.id);

    // Get assignment info for activity log
    const assignments = await query(
      `SELECT s.name FROM project_subcontractors ps
       JOIN subcontractors s ON ps.subcontractor_id = s.id
       WHERE ps.id = ?`,
      [assignmentId]
    );

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const assignment = assignments[0] as any;

    await query('DELETE FROM project_subcontractors WHERE id = ?', [assignmentId]);

    // Log activity
    await query(
      `INSERT INTO project_activity (project_id, activity_type, description, user_name)
       VALUES (?, 'subcontractor_removed', ?, ?)`,
      [projectId, `Removed subcontractor: ${assignment.name}`, adminUser.name]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete subcontractor assignment error:', error);
    return NextResponse.json(
      { error: 'Failed to remove assignment' },
      { status: 500 }
    );
  }
}
