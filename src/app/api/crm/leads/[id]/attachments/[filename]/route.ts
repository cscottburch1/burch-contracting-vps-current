import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { ensureLeadSchema, getLeadAttachmentByStoredName } from '@/lib/leadService';

const CONTENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
};

function sanitizeSegment(value: string): string {
  if (!value || value.includes('..') || value.includes('/') || value.includes('\\')) {
    throw new Error('Invalid path segment');
  }
  return value;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; filename: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureLeadSchema();

    const { id, filename } = await context.params;
    const safeLeadId = sanitizeSegment(String(id));
    const safeFilename = sanitizeSegment(String(filename));

    const attachment = await getLeadAttachmentByStoredName(Number(safeLeadId), safeFilename);
    if (!attachment) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const filePath = join(process.cwd(), 'public', 'uploads', 'leads', safeLeadId, safeFilename);
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File is missing from storage' }, { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = safeFilename.split('.').pop()?.toLowerCase() || '';
    const contentType = CONTENT_TYPES[ext] || attachment.mime_type || 'application/octet-stream';

    const url = new URL(request.url);
    const shouldDownload = url.searchParams.get('download') === '1';
    const disposition = shouldDownload ? 'attachment' : 'inline';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `${disposition}; filename="${attachment.original_filename || safeFilename}"`,
        'Cache-Control': 'private, max-age=0, no-cache',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'Invalid path segment' ? 400 : 500;
    return NextResponse.json({ error: status === 400 ? 'Invalid file path' : 'Failed to serve attachment' }, { status });
  }
}
