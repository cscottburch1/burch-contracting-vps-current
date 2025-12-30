import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { docId } = await context.params;

    await query('DELETE FROM documents WHERE id = ?', [docId]);

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
