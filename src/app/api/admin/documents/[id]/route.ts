import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mysql from '@/lib/mysql';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Get document info
    const [documents] = await mysql.query(
      'SELECT filename FROM documents WHERE id = ?',
      [id]
    );

    if (!documents || (documents as any[]).length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const document = (documents as any[])[0];

    // Delete file from filesystem
    const filepath = join(process.cwd(), 'public', 'uploads', document.filename);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    // Delete from database
    await mysql.query('DELETE FROM documents WHERE id = ?', [id]);

    return NextResponse.json({ 
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
