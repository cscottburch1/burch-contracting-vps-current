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

    let sql = `
      SELECT l.*, COUNT(a.id) AS attachment_count
      FROM contact_leads l
      LEFT JOIN lead_attachments a ON a.lead_id = l.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' AND l.status = ?';
      params.push(status);
    }

    if (priority && priority !== 'all') {
      sql += ' AND l.priority = ?';
      params.push(priority);
    }

    if (search) {
      sql += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' GROUP BY l.id ORDER BY l.created_at DESC';

    const leads: any[] = await query(sql, params);

    const normalized = leads.map((lead) => ({
      ...lead,
      attachment_count: Number(lead.attachment_count || 0),
    }));

    return NextResponse.json({ leads: normalized });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
