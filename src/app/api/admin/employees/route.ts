import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET all employee applications
export async function GET(request: Request) {
  try {
    const results = await query(
      `SELECT 
        da.*,
        ed.document_url as resume_url,
        ed.file_name as resume_file_name
      FROM direct_hire_applications da
      LEFT JOIN employee_documents ed ON da.id = ed.application_id AND ed.document_type = 'resume'
      ORDER BY da.created_at DESC`
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
