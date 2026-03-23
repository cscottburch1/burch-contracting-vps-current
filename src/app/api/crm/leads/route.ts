import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(request: Request) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM contact_leads WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (priority && priority !== 'all') {
      sql += ' AND priority = ?';
      params.push(priority);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC';

    const leads: any[] = await query(sql, params);

    const normalizedLeads = leads.map((lead) => {
      let attachments: string[] = [];

      if (Array.isArray(lead.attachments)) {
        attachments = lead.attachments.filter((item: unknown): item is string => typeof item === 'string' && item.length > 0);
      } else if (typeof lead.attachments === 'string' && lead.attachments.trim().length > 0) {
        try {
          const parsed = JSON.parse(lead.attachments);
          if (Array.isArray(parsed)) {
            attachments = parsed.filter((item: unknown): item is string => typeof item === 'string' && item.length > 0);
          }
        } catch {
          attachments = [];
        }
      }

      return {
        ...lead,
        attachments,
        attachment_count: attachments.length,
      };
    });

    return NextResponse.json({ leads: normalizedLeads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
