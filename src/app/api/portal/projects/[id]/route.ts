import { NextResponse } from 'next/server';
import { getCustomerFromSession } from '@/lib/customerAuth';
import { query, queryOne } from '@/lib/mysql';

interface Project {
  id: number;
  customer_id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

interface ProjectUpdate {
  id: number;
  project_id: number;
  title: string;
  description: string;
  created_at: string;
}

interface Document {
  id: number;
  project_id: number;
  filename: string;
  filepath: string;
  filetype: string;
  filesize: number;
  uploaded_by: 'customer' | 'admin';
  created_at: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCustomerFromSession();
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectId = parseInt(id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    // Get project and verify ownership
    const project = await queryOne<Project>(
      'SELECT * FROM projects WHERE id = ? AND customer_id = ?',
      [projectId, customer.id]
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get project updates
    const updates = await query<ProjectUpdate>(
      'SELECT * FROM project_updates WHERE project_id = ? ORDER BY created_at DESC',
      [projectId]
    );

    // Get project documents and normalise field names for the UI
    const rawDocs = await query(
      'SELECT * FROM documents WHERE project_id = ? ORDER BY created_at DESC',
      [projectId]
    );

    const documents = (rawDocs as any[]).map((d) => ({
      id: d.id,
      project_id: d.project_id,
      filename: d.original_name || d.filename,
      filepath: `/uploads/${d.filename}`,
      filetype: d.file_type || d.filetype || '',
      filesize: d.file_size ?? d.filesize ?? 0,
      uploaded_by: d.uploaded_by,
      category: d.category,
      description: d.description,
      created_at: d.created_at,
    }));

    return NextResponse.json({
      project,
      updates,
      documents,
    });
  } catch (error) {
    console.error('Get project details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project details' },
      { status: 500 }
    );
  }
}
