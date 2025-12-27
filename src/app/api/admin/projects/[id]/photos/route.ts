import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

// Create project_photos table if it doesn't exist
async function ensureProjectPhotosTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS project_photos (
      id INT PRIMARY KEY AUTO_INCREMENT,
      project_id INT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      category ENUM('before', 'progress', 'after', 'other') DEFAULT 'progress',
      caption TEXT,
      file_size INT,
      uploaded_by VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      INDEX idx_project_id (project_id),
      INDEX idx_category (category)
    )
  `);
}

// POST - Upload photo
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
    const projectId = parseInt(params.id);

    // Verify project exists
    const projects = await query('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await ensureProjectPhotosTable();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'progress';
    const caption = formData.get('caption') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (15MB max for photos)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 15MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `project-${projectId}-${timestamp}.${ext}`;
    
    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'projects');
    const filePath = join(uploadDir, filename);
    
    await writeFile(filePath, buffer);

    // Save to database
    const result = await query(
      `INSERT INTO project_photos 
       (project_id, filename, original_name, category, caption, file_size, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [projectId, filename, file.name, category, caption, file.size, adminUser.name]
    );

    // Log activity
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
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}

// GET - Fetch all photos for a project
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
    const projectId = parseInt(params.id);

    await ensureProjectPhotosTable();

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
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
