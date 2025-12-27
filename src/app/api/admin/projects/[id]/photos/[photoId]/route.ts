import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';
import { unlink } from 'fs/promises';
import { join } from 'path';

// DELETE - Delete photo
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const photoId = parseInt(params.photoId);

    // Get photo info
    const photos = await query(
      'SELECT filename, project_id, original_name FROM project_photos WHERE id = ?',
      [photoId]
    );

    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const photo = photos[0] as any;

    // Delete file from filesystem
    const filePath = join(process.cwd(), 'public', 'uploads', 'projects', photo.filename);
    try {
      await unlink(filePath);
    } catch (err) {
      console.error('File deletion error:', err);
    }

    // Delete from database
    await query('DELETE FROM project_photos WHERE id = ?', [photoId]);

    // Log activity
    await query(
      `INSERT INTO project_activity (project_id, activity_type, description, user_name)
       VALUES (?, 'photo_deleted', ?, ?)`,
      [photo.project_id, `Deleted photo: ${photo.original_name}`, adminUser.name]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
