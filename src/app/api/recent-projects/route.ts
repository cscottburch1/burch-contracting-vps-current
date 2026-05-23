import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    const projects = await query(
      `SELECT id, title, category, short_description, image_url,
              completion_date, project_duration, location, featured
       FROM recent_projects
       WHERE is_active = TRUE
       ORDER BY display_order ASC, completion_date DESC
       LIMIT 12`
    );
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching recent projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
