import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET all employee applications
export async function GET(request: Request) {
  try {
    const results = await query(
      `SELECT * FROM direct_hire_applications 
       ORDER BY created_at DESC`
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
