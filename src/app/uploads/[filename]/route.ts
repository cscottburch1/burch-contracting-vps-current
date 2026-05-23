import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { verifyAdminAuth } from '@/lib/adminAuth';

const CONTENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  txt: 'text/plain',
};

export async function GET(
  request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { filename } = await context.params;

    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const uploadBase = process.env.UPLOAD_DIR ?? join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadBase, filename);

    if (!existsSync(filePath)) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'private, no-cache',
        'Content-Length': String(fileBuffer.length),
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Failed to serve file', { status: 500 });
  }
}
