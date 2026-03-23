import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// Update employee application status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    const applicationId = id;

    if (!['pending', 'reviewing', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE direct_hire_applications 
       SET status = ?, updated_at = NOW() 
       WHERE id = ?`,
      [status, applicationId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

// GET single employee application
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const results = await query(
      `SELECT * FROM direct_hire_applications WHERE id = ?`,
      [id]
    );

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(results[0]);
  } catch (error) {
    console.error('Failed to fetch application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}
