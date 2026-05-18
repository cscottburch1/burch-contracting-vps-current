import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: subcontractorId } = await params;
    const connection = await pool.getConnection();
    
    try {
      const [documents] = await connection.execute(
        `SELECT * FROM subcontractor_documents 
         WHERE subcontractor_id = ? 
         ORDER BY created_at DESC`,
        [subcontractorId]
      );

      return NextResponse.json({ documents });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: subcontractorIdRaw } = await params;
    const subcontractorId = parseInt(subcontractorIdRaw, 10);
    if (isNaN(subcontractorId) || subcontractorId <= 0) {
      return NextResponse.json({ error: 'Invalid subcontractor ID' }, { status: 400 });
    }

    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const expirationDate = formData.get('expirationDate') as string;

    if (!file || !documentType || !title) {
      return NextResponse.json(
        { error: 'File, document type, and title are required' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Please upload PDF, JPG, PNG, DOC, DOCX, XLS, or XLSX' },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const ext = (file.name.split('.').pop() || 'bin').replace(/[^a-zA-Z0-9]/g, '');
    const rand = Math.random().toString(36).slice(2, 8);
    const fileName = `${subcontractorId}_${timestamp}_${rand}.${ext}`;

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'subcontractors', String(subcontractorId));
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save to database
    const relativePath = `/uploads/subcontractors/${subcontractorId}/${fileName}`;
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute(
        `INSERT INTO subcontractor_documents 
        (subcontractor_id, document_type, title, description, file_name, original_name, 
         file_path, file_type, file_size, expiration_date, uploaded_by, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          subcontractorId,
          documentType,
          title,
          description || null,
          fileName,
          file.name,
          relativePath,
          file.type,
          file.size,
          expirationDate || null,
          currentUser.id
        ]
      );

      const documentId = (result as any).insertId;

      return NextResponse.json({
        success: true,
        document: {
          id: documentId,
          file_path: relativePath,
          title,
          document_type: documentType
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document', details: (error as Error).message },
      { status: 500 }
    );
  }
}
