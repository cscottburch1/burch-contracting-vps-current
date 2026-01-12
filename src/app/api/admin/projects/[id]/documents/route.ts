import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

    const documents = await query(
      'SELECT * FROM documents WHERE project_id = ? ORDER BY created_at DESC',
      [id]
    );

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
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save to database
    const result = await query(
      'INSERT INTO documents (project_id, filename, filepath, filetype, filesize, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
      [id, file.name, `/uploads/${filename}`, file.type || 'unknown', file.size, 'admin']
    );

    const docId = (result as any).insertId;
    const document = await query('SELECT * FROM documents WHERE id = ?', [docId]);

    return NextResponse.json({ document: document[0] });
  } catch (error) {
    console.error('Error adding document:', error);
    return NextResponse.json({ error: 'Failed to add document' }, { status: 500 });
  }
}
