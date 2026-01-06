import { NextResponse } from 'next/server';
import { getCurrentTradesman } from '@/lib/tradesmanAuth';
import { query, queryOne } from '@/lib/mysql';

// Get time entries for tradesman
export async function GET(request: Request) {
  try {
    const tradesman = await getCurrentTradesman();
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    let timeEntries;
    if (projectId) {
      timeEntries = await query(
        `SELECT te.*, p.title as project_title 
         FROM tradesman_time_entries te
         JOIN projects p ON te.project_id = p.id
         WHERE te.tradesman_id = ? AND te.project_id = ?
         ORDER BY te.clock_in DESC
         LIMIT 50`,
        [tradesman.id, projectId]
      );
    } else {
      timeEntries = await query(
        `SELECT te.*, p.title as project_title 
         FROM tradesman_time_entries te
         JOIN projects p ON te.project_id = p.id
         WHERE te.tradesman_id = ?
         ORDER BY te.clock_in DESC
         LIMIT 50`,
        [tradesman.id]
      );
    }

    // Check for active clock-in
    const activeEntry = await queryOne(
      `SELECT * FROM tradesman_time_entries 
       WHERE tradesman_id = ? AND clock_out IS NULL
       ORDER BY clock_in DESC LIMIT 1`,
      [tradesman.id]
    );

    return NextResponse.json({ timeEntries, activeEntry });
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 });
  }
}

// Clock in/out
export async function POST(request: Request) {
  try {
    const tradesman = await getCurrentTradesman();
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, project_id, notes, break_minutes } = await request.json();

    if (action === 'clock_in') {
      // Check if already clocked in
      const existing = await queryOne(
        'SELECT id FROM tradesman_time_entries WHERE tradesman_id = ? AND clock_out IS NULL',
        [tradesman.id]
      );

      if (existing) {
        return NextResponse.json({ error: 'Already clocked in' }, { status: 400 });
      }

      const result = await query(
        `INSERT INTO tradesman_time_entries (tradesman_id, project_id, clock_in, notes)
         VALUES (?, ?, NOW(), ?)`,
        [tradesman.id, project_id, notes || null]
      );

      return NextResponse.json({ success: true, id: (result as any).insertId });
    } else if (action === 'clock_out') {
      const activeEntry = await queryOne(
        'SELECT id FROM tradesman_time_entries WHERE tradesman_id = ? AND clock_out IS NULL',
        [tradesman.id]
      );

      if (!activeEntry) {
        return NextResponse.json({ error: 'Not clocked in' }, { status: 400 });
      }

      await query(
        `UPDATE tradesman_time_entries 
         SET clock_out = NOW(), break_minutes = ?, notes = COALESCE(?, notes)
         WHERE id = ?`,
        [break_minutes || 0, notes || null, (activeEntry as any).id]
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error managing time entry:', error);
    return NextResponse.json({ error: 'Failed to manage time entry' }, { status: 500 });
  }
}
