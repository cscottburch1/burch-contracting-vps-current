import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';

async function ensureLeadActivitiesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS lead_activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      lead_id INT NOT NULL,
      activity_type ENUM('status_change', 'note_added', 'email_sent', 'call_made', 'meeting_scheduled', 'proposal_sent') NOT NULL,
      description TEXT NOT NULL,
      metadata JSON,
      created_by VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_lead_id (lead_id),
      INDEX idx_activity_type (activity_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureLeadActivitiesTable();

    const { id } = await context.params;
    const activities = await query(
      'SELECT * FROM lead_activities WHERE lead_id = ? ORDER BY created_at DESC',
      [id]
    );

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
