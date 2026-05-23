import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
]);

export async function POST(request: Request) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Validate file type and extension for safer admin uploads
    const extension = extname(file.name || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has((file.type || '').toLowerCase()) || !ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json({ error: 'File type is not allowed' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = process.env.UPLOAD_DIR ?? join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return URL path (not filesystem path)
    const url = `/uploads/${filename}`;

    return NextResponse.json({ 
      url, 
      filename: originalName,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
