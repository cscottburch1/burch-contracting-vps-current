import { stat } from 'fs/promises';
import { join } from 'path';

const SAFE_FALLBACK_LASTMOD = '2026-03-01T00:00:00.000Z';

function toIsoDate(value: Date) {
  return value.toISOString();
}

export async function getFileLastModified(relativePath: string): Promise<string> {
  try {
    const absolutePath = join(process.cwd(), relativePath);
    const fileStats = await stat(absolutePath);
    return toIsoDate(fileStats.mtime);
  } catch {
    return SAFE_FALLBACK_LASTMOD;
  }
}
