import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { cookies } from 'next/headers';

interface Customer {
  id: number;
  email: string;
  name: string;
  phone: string;
}

async function getCurrentCustomer(): Promise<Customer | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('customer_session');
    
    if (!sessionCookie) {
      return null;
    }

    const rows = await pool.query(
      'SELECT id, email, name, phone FROM customers WHERE session_token = ?',
      [sessionCookie.value]
    ) as any[];

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Customer;
    }

    return null;
  } catch (error) {
    console.error('Error getting current customer:', error);
    return null;
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCurrentCustomer();
    
    if (!customer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await context.params;

    // Verify the project belongs to this customer
    const projectRows = await pool.query(
      'SELECT * FROM projects WHERE id = ? AND customer_id = ?',
      [projectId, customer.id]
    ) as any[];

    if (!Array.isArray(projectRows) || projectRows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Fetch documents for this project
    const documents = await pool.query(
      'SELECT * FROM documents WHERE project_id = ? ORDER BY created_at DESC',
      [projectId]
    ) as any[];

    return NextResponse.json({ documents: documents || [] });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCurrentCustomer();
    
    if (!customer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await context.params;

    // Verify the project belongs to this customer
    const projectRows = await pool.query(
      'SELECT * FROM projects WHERE id = ? AND customer_id = ?',
      [projectId, customer.id]
    ) as any[];

    if (!Array.isArray(projectRows) || projectRows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, url, file_type, file_size, category, description } = body;

    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO documents (project_id, filename, filepath, filetype, filesize, uploaded_by, category, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [projectId, name, url, file_type || 'unknown', file_size || 0, 'customer', category || 'general', description || '']
    );

    const docId = (result as any).insertId;
    const document = await pool.query('SELECT * FROM documents WHERE id = ?', [docId]) as any[];

    return NextResponse.json({ document: document[0] });
  } catch (error) {
    console.error('Error adding document:', error);
    return NextResponse.json({ error: 'Failed to add document' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCurrentCustomer();
    
    if (!customer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Verify the document belongs to a project owned by this customer
    const docRows = await pool.query(
      `SELECT d.* FROM documents d
       INNER JOIN projects p ON d.project_id = p.id
       WHERE d.id = ? AND p.customer_id = ? AND d.uploaded_by = 'customer'`,
      [documentId, customer.id]
    ) as any[];

    if (!Array.isArray(docRows) || docRows.length === 0) {
      return NextResponse.json({ error: 'Document not found or unauthorized' }, { status: 404 });
    }

    await pool.query('DELETE FROM documents WHERE id = ?', [documentId]);

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
