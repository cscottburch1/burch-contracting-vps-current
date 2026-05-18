import { NextResponse } from 'next/server';
import { getCustomerFromSession } from '@/lib/customerAuth';
import { query } from '@/lib/mysql';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCustomerFromSession();
    if (!customer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const projectId = parseInt(id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const projects = await query(
      'SELECT id FROM projects WHERE id = ? AND customer_id = ?',
      [projectId, customer.id]
    );
    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const rawDocs = await query(
      'SELECT * FROM documents WHERE project_id = ? ORDER BY created_at DESC',
      [projectId]
    );

    const documents = (rawDocs as any[]).map((d) => ({
      id: d.id,
      project_id: d.project_id,
      filename: d.original_name || d.filename,
      filepath: `/uploads/${d.filename}`,
      filetype: d.file_type || '',
      filesize: d.file_size ?? 0,
      uploaded_by: d.uploaded_by,
      category: d.category,
      description: d.description,
      created_at: d.created_at,
    }));

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCustomerFromSession();
    if (!customer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    const docs = await query(
      `SELECT d.* FROM documents d
       INNER JOIN projects p ON d.project_id = p.id
       WHERE d.id = ? AND p.customer_id = ? AND d.uploaded_by = 'customer'`,
      [documentId, customer.id]
    );

    if (!Array.isArray(docs) || docs.length === 0) {
      return NextResponse.json({ error: 'Document not found or unauthorized' }, { status: 404 });
    }

    await query('DELETE FROM documents WHERE id = ?', [documentId]);

    return NextResponse.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
