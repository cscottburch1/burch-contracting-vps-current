import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';

export const MAX_UPLOAD_FILES = 5;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]);

export type UploadedFileRecord = {
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  relativePath: string;
};

function sanitizeBaseName(value: string): string {
  const trimmed = value.trim();
  const withoutPath = trimmed.replace(/\\/g, '/').split('/').pop() || 'upload';
  const dot = withoutPath.lastIndexOf('.');
  const name = dot >= 0 ? withoutPath.slice(0, dot) : withoutPath;
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) || 'upload';
}

function sanitizeExtension(value: string): string {
  const extension = extname(value || '').toLowerCase();
  if (!extension) return '';
  return extension.replace(/[^.a-z0-9]/g, '').slice(0, 10);
}

export function isAllowedUploadType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has((mimeType || '').toLowerCase());
}

export function createUniqueStoredName(originalName: string): string {
  const base = sanitizeBaseName(originalName);
  const extension = sanitizeExtension(originalName);
  const token = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  return `${token}_${base}${extension}`;
}

export function collectFormFiles(formData: FormData): File[] {
  const files: File[] = [];

  for (const [, value] of formData.entries()) {
    if (value instanceof File && value.size > 0) {
      files.push(value);
    }
  }

  return files;
}

export function validateFiles(files: File[]): { ok: true } | { ok: false; message: string } {
  if (files.length > MAX_UPLOAD_FILES) {
    return { ok: false, message: `Maximum ${MAX_UPLOAD_FILES} files allowed` };
  }

  for (const file of files) {
    if (file.size > MAX_UPLOAD_BYTES) {
      return { ok: false, message: `File ${file.name} exceeds 10MB limit` };
    }
    if (!isAllowedUploadType(file.type || '')) {
      return { ok: false, message: `Unsupported file type: ${file.type || 'unknown'}` };
    }
  }

  return { ok: true };
}

export async function ensureDirectory(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

export async function storeLeadFiles(leadId: number, files: File[]): Promise<UploadedFileRecord[]> {
  if (files.length === 0) return [];

  const leadDir = join(process.cwd(), 'public', 'uploads', 'leads', String(leadId));
  await ensureDirectory(leadDir);

  const records: UploadedFileRecord[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const storedName = createUniqueStoredName(file.name || 'upload.bin');
    const absolutePath = join(leadDir, storedName);

    await writeFile(absolutePath, buffer);

    records.push({
      originalName: file.name || storedName,
      storedName,
      mimeType: file.type || 'application/octet-stream',
      size: file.size || buffer.length,
      relativePath: `/uploads/leads/${leadId}/${storedName}`,
    });
  }

  return records;
}
