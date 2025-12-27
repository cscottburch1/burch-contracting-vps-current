import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { cookies } from 'next/headers';

async function getCustomerFromSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('customer_session');
  
  if (!sessionToken) return null;

  const customers = await query(
    'SELECT id FROM customers WHERE session_token = ?',
    [sessionToken.value]
  );

  return Array.isArray(customers) && customers.length > 0 ? customers[0] : null;
}

// GET - Fetch activity log for customer's project
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCustomerFromSession();
    if (!customer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const projectId = parseInt(params.id);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Verify project belongs to customer
    const projects = await query(
      'SELECT id FROM projects WHERE id = ? AND customer_id = ?',
      [projectId, (customer as any).id]
    );

    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Fetch activity (customers see sanitized version)
    const activities = await query(
      `SELECT id, activity_type, description, created_at
       FROM project_activity 
       WHERE project_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [projectId, limit]
    );

    return NextResponse.json({ activities: activities || [] });
  } catch (error) {
    console.error('Fetch activity log error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity log' },
      { status: 500 }
    );
  }
}
