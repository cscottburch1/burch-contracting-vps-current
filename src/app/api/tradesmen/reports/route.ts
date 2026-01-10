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

    const reports = await query(
      `SELECT * FROM tradesman_daily_reports 
       WHERE tradesman_id = ? AND project_id = ?
       ORDER BY report_date DESC
       LIMIT 30`,
      [tradesman.id, projectId]
    );

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tradesman = await getCurrentTradesman();
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { project_id, report_date, work_completed, hours_worked, materials_used, weather_conditions, safety_issues, notes } = await request.json();

    if (!project_id || !work_completed) {
      return NextResponse.json({ error: 'Project ID and work completed are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO tradesman_daily_reports 
       (tradesman_id, project_id, report_date, work_completed, hours_worked, materials_used, weather_conditions, safety_issues, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       work_completed = VALUES(work_completed),
       hours_worked = VALUES(hours_worked),
       materials_used = VALUES(materials_used),
       weather_conditions = VALUES(weather_conditions),
       safety_issues = VALUES(safety_issues),
       notes = VALUES(notes)`,
      [tradesman.id, project_id, report_date || new Date().toISOString().split('T')[0], work_completed, hours_worked || null, materials_used || null, weather_conditions || null, safety_issues || null, notes || null]
    );

    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
