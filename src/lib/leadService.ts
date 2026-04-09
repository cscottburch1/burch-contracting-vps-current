import pool from '@/lib/mysql';
import { query, queryOne } from '@/lib/mysql';
import { storeLeadFiles, UploadedFileRecord } from '@/lib/uploads';
import { unlink } from 'fs/promises';
import { join } from 'path';

export type LeadCreatePayload = {
  name: string;
  phone: string;
  email: string;
  address?: string | null;
  serviceType?: string | null;
  budgetRange?: string | null;
  timeframe?: string | null;
  referralSource?: string | null;
  description: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  status?: string;
  priority?: string;
  source?: string;
  leadScore?: number;
};

export async function ensureLeadSchema(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS contact_leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      address TEXT,
      service_type VARCHAR(100),
      budget_range VARCHAR(100),
      timeframe VARCHAR(100),
      referral_source VARCHAR(100),
      description TEXT,
      message TEXT,
      attachments TEXT,
      preferred_date DATE,
      preferred_time VARCHAR(50),
      status ENUM('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost') DEFAULT 'new',
      priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
      assigned_to VARCHAR(255),
      estimated_value DECIMAL(10,2),
      scheduled_date DATETIME,
      last_contact_date DATETIME,
      lead_score INT DEFAULT 0,
      source VARCHAR(100),
      source_url VARCHAR(500),
      tags JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_status (status),
      INDEX idx_priority (priority),
      INDEX idx_email (email),
      INDEX idx_created_at (created_at),
      INDEX idx_lead_score (lead_score)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS lead_attachments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      lead_id INT NOT NULL,
      original_filename VARCHAR(255) NOT NULL,
      stored_filename VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      mime_type VARCHAR(120) NOT NULL,
      file_size INT NOT NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_lead_attachments_lead (lead_id),
      UNIQUE KEY uniq_lead_stored (lead_id, stored_filename),
      CONSTRAINT fk_lead_attachments_lead FOREIGN KEY (lead_id) REFERENCES contact_leads(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS lead_notes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      lead_id INT NOT NULL,
      note_type ENUM('general', 'call', 'email', 'meeting', 'follow_up') DEFAULT 'general',
      content TEXT NOT NULL,
      is_important BOOLEAN DEFAULT FALSE,
      created_by VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_lead_id (lead_id),
      CONSTRAINT fk_lead_notes_lead FOREIGN KEY (lead_id) REFERENCES contact_leads(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS lead_activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      lead_id INT NOT NULL,
      activity_type ENUM('lead_created', 'status_change', 'note_added', 'attachment_uploaded', 'email_sent', 'email_failed', 'call_made', 'meeting_scheduled', 'proposal_sent') NOT NULL,
      description TEXT NOT NULL,
      metadata JSON,
      created_by VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_lead_id (lead_id),
      INDEX idx_activity_type (activity_type),
      CONSTRAINT fk_lead_activities_lead FOREIGN KEY (lead_id) REFERENCES contact_leads(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

export async function logLeadActivity(
  leadId: number,
  activityType: string,
  description: string,
  metadata?: unknown,
  createdBy?: string
): Promise<void> {
  try {
    await query(
      'INSERT INTO lead_activities (lead_id, activity_type, description, metadata, created_by) VALUES (?, ?, ?, ?, ?)',
      [leadId, activityType, description, metadata ? JSON.stringify(metadata) : null, createdBy || null]
    );
  } catch (error) {
    console.warn('[leadService] activity logging skipped', { leadId, activityType, error });
  }
}

export async function createLead(payload: LeadCreatePayload): Promise<number> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      `INSERT INTO contact_leads
       (name, phone, email, address, service_type, budget_range, timeframe, referral_source, description, message, preferred_date, preferred_time, status, priority, lead_score, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.name,
        payload.phone,
        payload.email,
        payload.address || null,
        payload.serviceType || null,
        payload.budgetRange || null,
        payload.timeframe || null,
        payload.referralSource || null,
        payload.description,
        payload.description,
        payload.preferredDate || null,
        payload.preferredTime || null,
        payload.status || 'new',
        payload.priority || 'medium',
        payload.leadScore || 0,
        payload.source || 'contact_form',
      ]
    );

    const insertId = Number((result as any).insertId);
    await logLeadActivity(insertId, 'lead_created', 'Lead created from contact form', {
      source: payload.source || 'contact_form',
    });

    return insertId;
  } finally {
    connection.release();
  }
}

export async function saveLeadAttachments(leadId: number, files: File[]): Promise<UploadedFileRecord[]> {
  if (files.length === 0) return [];

  const written = await storeLeadFiles(leadId, files);

  try {
    for (const item of written) {
      await query(
        `INSERT INTO lead_attachments (lead_id, original_filename, stored_filename, file_path, mime_type, file_size)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [leadId, item.originalName, item.storedName, item.relativePath, item.mimeType, item.size]
      );

      await logLeadActivity(
        leadId,
        'attachment_uploaded',
        `Attachment uploaded: ${item.originalName}`,
        { stored: item.storedName, size: item.size }
      );
    }

    await query('UPDATE contact_leads SET attachments = ? WHERE id = ?', [JSON.stringify(written.map((w) => w.storedName)), leadId]);

    return written;
  } catch (error) {
    for (const item of written) {
      const absolute = join(process.cwd(), 'public', 'uploads', 'leads', String(leadId), item.storedName);
      await unlink(absolute).catch(() => undefined);
    }
    throw error;
  }
}

export async function getLeadAttachmentByStoredName(leadId: number, filename: string) {
  return queryOne<{
    id: number;
    lead_id: number;
    original_filename: string;
    stored_filename: string;
    file_path: string;
    mime_type: string;
    file_size: number;
  }>(
    'SELECT * FROM lead_attachments WHERE lead_id = ? AND stored_filename = ? LIMIT 1',
    [leadId, filename]
  );
}

export async function getLeadAttachments(leadId: number) {
  return query<{
    id: number;
    original_filename: string;
    stored_filename: string;
    file_path: string;
    mime_type: string;
    file_size: number;
    uploaded_at: string;
  }>(
    'SELECT id, original_filename, stored_filename, file_path, mime_type, file_size, uploaded_at FROM lead_attachments WHERE lead_id = ? ORDER BY uploaded_at DESC',
    [leadId]
  );
}
