import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

type DocumentRow = {
  id: number;
  project_id: number;
  filename?: string;
  original_name?: string;
  filepath?: string;
  filetype?: string;
  file_type?: string;
  filesize?: number;
  file_size?: number;
  category?: string;
  description?: string;
  uploaded_by?: string;
  created_at?: string;
};

const normalizeDocument = (doc: DocumentRow) => {
  const storedFilename = doc.filename || '';
  const displayName = doc.original_name || doc.filename || 'document';
  const path = doc.filepath || (storedFilename ? `/uploads/${storedFilename}` : '');

  return {
    ...doc,
    filename: displayName,
    filepath: path,
    filetype: doc.filetype || doc.file_type || 'application/octet-stream',
    filesize: doc.filesize ?? doc.file_size ?? 0,
    category: doc.category || 'general',
    description: doc.description || '',
  };
};

const getDocumentColumns = async () => {
  const columns = await query<{ Field: string }>('SHOW COLUMNS FROM documents');
  return new Set(columns.map((col) => col.Field));
};

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

    const documents = await query<DocumentRow>(
      'SELECT * FROM documents WHERE project_id = ? ORDER BY created_at DESC',
      [id]
    );

    const normalized = (documents || []).map(normalizeDocument);
    return NextResponse.json({ documents: normalized });
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

    // Save to database using whatever schema exists in this environment.
    const columns = await getDocumentColumns();
    const documentPath = `/uploads/${filename}`;

    let result: any;
    if (columns.has('filepath') && columns.has('filetype') && columns.has('filesize')) {
      result = await query(
        'INSERT INTO documents (project_id, filename, filepath, filetype, filesize, uploaded_by, category, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, file.name, documentPath, file.type || 'unknown', file.size, 'admin', formData.get('category') || 'general', formData.get('description') || '']
      );
    } else {
      result = await query(
        'INSERT INTO documents (project_id, filename, original_name, file_type, file_size, category, description, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, filename, file.name, file.type || 'unknown', file.size, formData.get('category') || 'general', formData.get('description') || '', 'admin']
      );
    }

    const docId = (result as any).insertId;

    return NextResponse.json({
      document: normalizeDocument({
        id: docId,
        project_id: Number(id),
        filename: columns.has('original_name') ? filename : file.name,
        original_name: columns.has('original_name') ? file.name : undefined,
        filepath: columns.has('filepath') ? documentPath : undefined,
        filetype: columns.has('filetype') ? file.type || 'unknown' : undefined,
        file_type: columns.has('file_type') ? file.type || 'unknown' : undefined,
        filesize: columns.has('filesize') ? file.size : undefined,
        file_size: columns.has('file_size') ? file.size : undefined,
        category: String(formData.get('category') || 'general'),
        description: String(formData.get('description') || ''),
        uploaded_by: 'admin',
      })
    });
  } catch (error) {
    console.error('Error adding document:', error);
    return NextResponse.json({ error: 'Failed to add document' }, { status: 500 });
  }
}
