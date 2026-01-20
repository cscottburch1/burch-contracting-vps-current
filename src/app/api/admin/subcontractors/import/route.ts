import { NextResponse } from 'next/server';
import { verifyAdminAuth, findAdminById } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// POST /api/admin/subcontractors/import - Import queued applications from tmp file
export async function POST(request: Request) {
  try {
    const session = await verifyAdminAuth(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const admin = await findAdminById(session.userId);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const path = require('path');
    const fs = require('fs');
    const queueFile = path.join(process.cwd(), 'tmp', 'subcontractor_applications.json');

    if (!fs.existsSync(queueFile)) {
      return NextResponse.json({ success: true, imported: 0, message: 'No queued entries' });
    }

    let queuedRaw = [];
    try {
      queuedRaw = JSON.parse(fs.readFileSync(queueFile, 'utf8') || '[]');
    } catch (err) {
      console.error('Failed to parse queued file:', err);
      return NextResponse.json({ error: 'Failed to parse queued file' }, { status: 500 });
    }

    if (!Array.isArray(queuedRaw) || queuedRaw.length === 0) {
      return NextResponse.json({ success: true, imported: 0, message: 'No queued entries' });
    }

    const imported: string[] = [];
    const skipped: string[] = [];
    const failed: Array<{ email?: string; error: string }> = [];
    const remaining: any[] = [];

    for (const entry of queuedRaw) {
      const email = entry.email;
      if (!email) {
        failed.push({ email: undefined, error: 'Missing email' });
        continue;
      }

      try {
        const existing = await query('SELECT id FROM subcontractors WHERE email = ? LIMIT 1', [email]);
        if (existing && existing.length > 0) {
          skipped.push(email);
          continue;
        }

        const specialties = entry.specialties ? JSON.stringify(entry.specialties) : JSON.stringify([]);
        const createdAt = entry.created_at ? new Date(entry.created_at) : new Date();

        const insertSql = `INSERT INTO subcontractors
          (company_name, contact_name, email, phone, business_type, years_in_business, specialties, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
          entry.company_name || null,
          entry.contact_name || null,
          email,
          entry.phone || null,
          entry.business_type || 'sole_proprietor',
          entry.years_in_business || null,
          specialties,
          entry.status || 'pending',
          createdAt,
        ];

        const res: any = await query(insertSql, params);
        const insertedId = res.insertId;
        imported.push(email);

        // Try to add an activity record (non-fatal)
        try {
          await query(
            'INSERT INTO subcontractor_activity (subcontractor_id, activity_type, description, created_at) VALUES (?, ?, ?, ?)',
            [insertedId, 'application', 'Imported from queued applications', new Date()]
          );
        } catch (e) {
          // ignore
        }
      } catch (err: any) {
        console.error('Failed to import queued entry', email, err?.message || err);
        // If DB error occurs, keep the entry in remaining so admin can retry
        remaining.push(entry);
        failed.push({ email, error: err?.message || String(err) });
      }
    }

    try {
      if (remaining.length > 0) {
        fs.writeFileSync(queueFile, JSON.stringify(remaining, null, 2), 'utf8');
      } else {
        fs.unlinkSync(queueFile);
      }
    } catch (err) {
      console.error('Failed to update queue file after import:', err);
      return NextResponse.json({ error: 'Failed to update queue file after import' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      skipped: skipped.length,
      failed: failed,
      remaining: remaining.length,
    });
  } catch (error) {
    console.error('Import endpoint error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}
