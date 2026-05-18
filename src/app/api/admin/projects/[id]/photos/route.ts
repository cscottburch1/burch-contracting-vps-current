import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_CATEGORIES = new Set(['before', 'progress', 'after', 'other']);

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const projectId = parseInt(params.id, 10);

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
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 15MB.' }, { status: 400 });
    }

    const timestamp = Date.now();
    const ext = (file.name.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '');
    const filename = `project-${projectId}-${timestamp}.${ext}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'projects');
    await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

    const result = await query(
      `INSERT INTO project_photos
       (project_id, filename, original_name, category, caption, file_size, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [projectId, filename, file.name, category, caption, file.size, adminUser.name]
    );

    await query(
      `INSERT INTO project_activity (project_id, activity_type, description, user_name)
       VALUES (?, 'photo_added', ?, ?)`,
      [projectId, `Added ${category} photo: ${file.name}`, adminUser.name]
    );

    return NextResponse.json({
      success: true,
      photo: {
        id: (result as any).insertId,
        filename,
        original_name: file.name,
        category,
        caption,
        url: `/uploads/projects/${filename}`
      }
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const projectId = parseInt(params.id, 10);

    const photos = await query(
      `SELECT id, filename, original_name, category, caption, file_size, uploaded_by, created_at
       FROM project_photos
       WHERE project_id = ?
       ORDER BY created_at DESC`,
      [projectId]
    );

    const photosWithUrls = Array.isArray(photos) ? photos.map((photo: any) => ({
      ...photo,
      url: `/uploads/projects/${photo.filename}`
    })) : [];

    return NextResponse.json({ photos: photosWithUrls });
  } catch (error) {
    console.error('Fetch photos error:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}
