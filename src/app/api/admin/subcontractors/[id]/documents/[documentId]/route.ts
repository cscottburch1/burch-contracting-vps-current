import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await params;
    const connection = await pool.getConnection();
    
    try {
      // Get document info
      const [documents] = await connection.execute(
        'SELECT * FROM subcontractor_documents WHERE id = ?',
        [documentId]
      );

      if ((documents as any[]).length === 0) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }

      const document = (documents as any[])[0];

      // Delete file from filesystem
      try {
        const filePath = path.join(process.cwd(), 'public', document.file_path);
        await unlink(filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue anyway - file might already be deleted
      }

      // Delete from database
      await connection.execute(
        'DELETE FROM subcontractor_documents WHERE id = ?',
        [documentId]
      );

      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await params;
    const { status } = await request.json();

    if (!['pending', 'approved', 'rejected', 'expired'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.execute(
        `UPDATE subcontractor_documents 
         SET status = ?, reviewed_by = ?, reviewed_at = NOW() 
         WHERE id = ?`,
        [status, currentUser.id, documentId]
      );

      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}
