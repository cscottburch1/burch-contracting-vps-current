import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { saveLeadAttachments, getLeadAttachments, logLeadActivity } from '@/lib/leadService';
import { collectFormFiles, validateFiles } from '@/lib/uploads';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const leadId = Number(id);
    if (!leadId || isNaN(leadId)) {
      return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 });
    }

    const lead = await queryOne<{ id: number }>('SELECT id FROM contact_leads WHERE id = ?', [leadId]);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const files = collectFormFiles(formData);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const validation = validateFiles(files);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }

    await saveLeadAttachments(leadId, files);

    await logLeadActivity(
      leadId,
      'attachment_uploaded',
      `${files.length} attachment(s) added by admin`,
      { count: files.length },
      adminUser.email || adminUser.name
    );

    const attachments = await getLeadAttachments(leadId);
    return NextResponse.json({ attachments });
  } catch (error) {
    console.error('Error uploading attachments:', error);
    return NextResponse.json({ error: 'Failed to upload attachments' }, { status: 500 });
  }
}
