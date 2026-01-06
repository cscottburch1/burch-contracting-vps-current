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

    let issues;
    if (projectId) {
      issues = await query(
        `SELECT i.*, p.title as project_title 
         FROM tradesman_issues i
         JOIN projects p ON i.project_id = p.id
         WHERE i.tradesman_id = ? AND i.project_id = ?
         ORDER BY i.reported_at DESC`,
        [tradesman.id, projectId]
      );
    } else {
      issues = await query(
        `SELECT i.*, p.title as project_title 
         FROM tradesman_issues i
         JOIN projects p ON i.project_id = p.id
         WHERE i.tradesman_id = ?
         ORDER BY i.reported_at DESC
         LIMIT 50`,
        [tradesman.id]
      );
    }

    return NextResponse.json({ issues });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tradesman = await getCurrentTradesman();
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { project_id, issue_type, title, description, severity, photo_filename } = await request.json();

    if (!project_id || !issue_type || !title || !description) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO tradesman_issues 
       (tradesman_id, project_id, issue_type, title, description, severity, photo_filename, reported_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [tradesman.id, project_id, issue_type, title, description, severity || 'medium', photo_filename || null]
    );

    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
  }
}
