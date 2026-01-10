import { NextResponse } from 'next/server';
import { getCurrentTradesman } from '@/lib/tradesmanAuth';
import { query } from '@/lib/mysql';
import { writeFile } from 'fs/promises';
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

// GET - List photos for a project
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
    const projectId = parseInt(params.id);

    // Verify tradesman is assigned to this project
    const assignments = await query(
      'SELECT id FROM tradesman_project_assignments WHERE tradesman_id = ? AND project_id = ?',
      [tradesman.id, projectId]
    );

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return NextResponse.json({ error: 'Not assigned to this project' }, { status: 403 });
    }

    await ensureProjectPhotosTable();

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

// POST - Upload photo(s)
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
    const projectId = parseInt(params.id);

    // Verify tradesman is assigned to this project
    const assignments = await query(
      'SELECT id FROM tradesman_project_assignments WHERE tradesman_id = ? AND project_id = ?',
      [tradesman.id, projectId]
    );

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return NextResponse.json({ error: 'Not assigned to this project' }, { status: 403 });
    }

    // Verify project exists
    const projects = await query('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await ensureProjectPhotosTable();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'progress';
    const caption = (formData.get('caption') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (20MB max for photos from mobile)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 20MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `project-${projectId}-${timestamp}-${random}.${ext}`;
    
    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);
    
    await writeFile(filepath, buffer);

    // Save to database
    const result = await query(
      `INSERT INTO project_photos 
       (project_id, filename, original_name, category, caption, file_size, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [projectId, filename, file.name, category, caption, file.size, tradesman.name]
    );

    const insertResult = result as any;

    return NextResponse.json({
      success: true,
      photo: {
        id: insertResult.insertId,
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
