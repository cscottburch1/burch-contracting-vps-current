import { NextResponse } from 'next/server';
import { getCurrentTradesman } from '@/lib/tradesmanAuth';
import { query } from '@/lib/mysql';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
const ALLOWED_CATEGORIES = new Set(['before', 'progress', 'after', 'other']);

async function isAssignedToProject(tradesmanId: number, projectId: number): Promise<boolean> {
  const [direct] = await Promise.all([
    query(
      'SELECT id FROM tradesman_project_assignments WHERE tradesman_id = ? AND project_id = ?',
      [tradesmanId, projectId]
    ),
  ]);
  if (Array.isArray(direct) && direct.length > 0) return true;

  const sub = await query(
    'SELECT id FROM project_subcontractors WHERE subcontractor_id = ? AND project_id = ?',
    [tradesmanId, projectId]
  );
  return Array.isArray(sub) && sub.length > 0;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tradesman = await getCurrentTradesman();
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    if (!(await isAssignedToProject(tradesman.id, projectId))) {
      return NextResponse.json({ error: 'Not assigned to this project' }, { status: 403 });
    }

    const photos = await query(
      `SELECT id, filename, original_name, category, caption, file_size, uploaded_by, created_at
       FROM project_photos
       WHERE project_id = ?
       ORDER BY created_at DESC`,
      [projectId]
    );

    return NextResponse.json({ photos: Array.isArray(photos) ? photos : [] });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tradesman = await getCurrentTradesman();
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    if (!(await isAssignedToProject(tradesman.id, projectId))) {
      return NextResponse.json({ error: 'Not assigned to this project' }, { status: 403 });
    }

    const projects = await query('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const rawCategory = (formData.get('category') as string) || 'progress';
    const category = ALLOWED_CATEGORIES.has(rawCategory) ? rawCategory : 'progress';
    const caption = (formData.get('caption') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 20MB.' }, { status: 400 });
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `project-${projectId}-${timestamp}-${random}.${ext}`;

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

    const result = await query(
      `INSERT INTO project_photos
       (project_id, filename, original_name, category, caption, file_size, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [projectId, filename, file.name, category, caption, file.size, tradesman.name]
    );

    return NextResponse.json({
      success: true,
      photo: {
        id: (result as any).insertId,
        filename,
        original_name: file.name,
        category,
        caption,
        file_size: file.size,
        uploaded_by: tradesman.name,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}
