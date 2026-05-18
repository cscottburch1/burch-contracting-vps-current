import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import mysql from '@/lib/mysql';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const customerId = formData.get('customer_id') as string;
    const projectId = formData.get('project_id') as string;
    const category = (formData.get('category') as string) || 'general';
    const description = (formData.get('description') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = (file.name.split('.').pop() || 'bin').replace(/[^a-zA-Z0-9]/g, '');
    const filename = `${timestamp}-${randomStr}.${extension}`;

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    await writeFile(join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));

    const [result]: any = await mysql.query(
      `INSERT INTO documents (customer_id, project_id, filename, original_name, file_type, file_size, category, description, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'admin')`,
      [customerId || null, projectId || null, filename, file.name, file.type, file.size, category, description]
    );

    return NextResponse.json({
      success: true,
      document: {
        id: result.insertId,
        filename,
        original_name: file.name,
        file_type: file.type,
        file_size: file.size,
        category,
        description
      }
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');
    const projectId = searchParams.get('project_id');

    let sql = 'SELECT * FROM documents WHERE 1=1';
    const params: any[] = [];

    if (customerId) {
      sql += ' AND customer_id = ?';
      params.push(customerId);
    }
    if (projectId) {
      sql += ' AND project_id = ?';
      params.push(projectId);
    }

    sql += ' ORDER BY created_at DESC';

    const [documents] = await mysql.query(sql, params) as any;
    return NextResponse.json({ documents });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
