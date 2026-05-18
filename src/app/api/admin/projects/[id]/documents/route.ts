import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

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

    const rawDocs = await query(
      'SELECT * FROM documents WHERE project_id = ? ORDER BY created_at DESC',
      [id]
    );

    const documents = (rawDocs as any[]).map((d) => ({
      id: d.id,
      project_id: d.project_id,
      filename: d.original_name || d.filename,
      filepath: `/uploads/${d.filename}`,
      filetype: d.file_type || '',
      filesize: d.file_size ?? 0,
      uploaded_by: d.uploaded_by,
      category: d.category || 'general',
      description: d.description || '',
      created_at: d.created_at,
    }));

    return NextResponse.json({ documents });
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
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await context.params;
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin';
    const storedName = `admin-${timestamp}-${rand}.${ext}`;

    await writeFile(join(uploadsDir, storedName), Buffer.from(await file.arrayBuffer()));

    const result: any = await query(
      `INSERT INTO documents (project_id, filename, original_name, file_type, file_size, category, description, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'admin')`,
      [
        projectId,
        storedName,
        file.name,
        file.type || 'application/octet-stream',
        file.size,
        String(formData.get('category') || 'general'),
        String(formData.get('description') || ''),
      ]
    );

    return NextResponse.json({
      document: {
        id: result.insertId,
        project_id: Number(projectId),
        filename: file.name,
        filepath: `/uploads/${storedName}`,
        filetype: file.type || 'application/octet-stream',
        filesize: file.size,
        category: String(formData.get('category') || 'general'),
        description: String(formData.get('description') || ''),
        uploaded_by: 'admin',
      }
    });
  } catch (error) {
    console.error('Error adding document:', error);
    return NextResponse.json({ error: 'Failed to add document' }, { status: 500 });
  }
}
