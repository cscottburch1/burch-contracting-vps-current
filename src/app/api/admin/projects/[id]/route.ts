import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';

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
    
    const projectRaw = await queryOne(
      `SELECT p.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address
       FROM projects p
       LEFT JOIN customers c ON p.customer_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    if (!projectRaw) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Map database fields to frontend expected fields
    const project = {
      ...projectRaw,
      title: projectRaw.project_name,
      budget: projectRaw.total_cost,
      end_date: projectRaw.estimated_completion_date,
      street_address: projectRaw.address_line1,
      // Ensure customer fields are present even if customer was deleted
      customer_name: projectRaw.customer_name || 'Deleted Customer',
      customer_email: projectRaw.customer_email || '',
      customer_phone: projectRaw.customer_phone || '',
      customer_address: projectRaw.customer_address || ''
    };

    const updates = await query(
      'SELECT * FROM project_updates WHERE project_id = ? ORDER BY created_at DESC',
      [id]
    );

    const documents = await query(
      'SELECT * FROM documents WHERE project_id = ? ORDER BY created_at DESC',
      [id]
    );

    return NextResponse.json({ project, updates, documents });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
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
    const { title, description, budget, start_date, end_date, status } = body;

    const updates: string[] = [];
    const params: any[] = [];

    if (title !== undefined) {
      updates.push('project_name = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (budget !== undefined) {
      updates.push('total_cost = ?');
      params.push(budget);
    }
    if (start_date !== undefined) {
      updates.push('start_date = ?');
      params.push(start_date);
    }
    if (end_date !== undefined) {
      updates.push('estimated_completion_date = ?');
      params.push(end_date);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (updates.length > 0) {
      params.push(id);
      await query(
        `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }

    const projectRaw = await queryOne(
      `SELECT p.*, c.name as customer_name 
       FROM projects p 
       LEFT JOIN customers c ON p.customer_id = c.id 
       WHERE p.id = ?`,
      [id]
    );
    
    // Map database fields to frontend expected fields
    const project = {
      ...projectRaw,
      title: projectRaw.project_name,
      budget: projectRaw.total_cost,
      end_date: projectRaw.estimated_completion_date,
      street_address: projectRaw.address_line1,
      customer_name: projectRaw.customer_name || 'Deleted Customer'
    };

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    await query('DELETE FROM projects WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
