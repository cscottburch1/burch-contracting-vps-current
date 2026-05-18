import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';

async function getTableColumns(tableName: string): Promise<Set<string>> {
  const columns = await query<{ COLUMN_NAME: string }>(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [tableName]
  );
  return new Set(columns.map((column) => column.COLUMN_NAME));
}

function getAdminIdentifier(adminUser: any): string {
  return adminUser?.email || adminUser?.name || `admin:${adminUser?.userId || 'unknown'}`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const notes = await query(
      'SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC',
      [id]
    );

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { content, note_type, is_important } = body;

    if (!content) {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
    }

    const noteColumns = await getTableColumns('lead_notes');
    const noteInsertColumns: string[] = ['lead_id', 'content'];
    const noteInsertValues: any[] = [id, content];

    if (noteColumns.has('note_type')) {
      noteInsertColumns.push('note_type');
      noteInsertValues.push(note_type || 'general');
    }
    if (noteColumns.has('is_important')) {
      noteInsertColumns.push('is_important');
      noteInsertValues.push(Boolean(is_important));
    }
    if (noteColumns.has('created_by')) {
      noteInsertColumns.push('created_by');
      noteInsertValues.push(getAdminIdentifier(adminUser));
    }

    const notePlaceholders = noteInsertColumns.map(() => '?').join(', ');
    const result = await query(
      `INSERT INTO lead_notes (${noteInsertColumns.join(', ')}) VALUES (${notePlaceholders})`,
      noteInsertValues
    );

    try {
      const activityColumns = await getTableColumns('lead_activities');
      const activityInsertColumns: string[] = ['lead_id', 'activity_type', 'description'];
      const activityInsertValues: any[] = [id, 'note_added', `Note added: ${content.substring(0, 50)}...`];

      if (activityColumns.has('created_by')) {
        activityInsertColumns.push('created_by');
        activityInsertValues.push(getAdminIdentifier(adminUser));
      }

      const activityPlaceholders = activityInsertColumns.map(() => '?').join(', ');
      await query(
        `INSERT INTO lead_activities (${activityInsertColumns.join(', ')}) VALUES (${activityPlaceholders})`,
        activityInsertValues
      );
    } catch (activityError) {
      console.error('Note created, but failed to log activity:', activityError);
    }

    const insertId = (result as any).insertId;
    const note = await query('SELECT * FROM lead_notes WHERE id = ?', [insertId]);

    return NextResponse.json({ note: note[0] });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
