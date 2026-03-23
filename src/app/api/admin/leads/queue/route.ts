import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

type QueuedLead = {
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
  priority: string;
  leadScore: number;
  queued_at?: string;
  reason?: string;
};

const LEAD_QUEUE_FILE = join(process.cwd(), 'tmp', 'emergency_leads_queue.json');

async function ensureContactLeadsTable() {
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
      estimated_value DECIMAL(10, 2),
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
}

async function readQueue(): Promise<QueuedLead[]> {
  if (!existsSync(LEAD_QUEUE_FILE)) {
    return [];
  }

  try {
    const raw = await readFile(LEAD_QUEUE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeQueue(items: QueuedLead[]) {
  const queueDir = join(process.cwd(), 'tmp');
  if (!existsSync(queueDir)) {
    await mkdir(queueDir, { recursive: true });
  }

  await writeFile(LEAD_QUEUE_FILE, JSON.stringify(items, null, 2), 'utf8');
}

async function flushQueue() {
  await ensureContactLeadsTable();

  const queue = await readQueue();
  if (queue.length === 0) {
    return { replayed: 0, failed: 0, remaining: 0 };
  }

  let replayed = 0;
  const remaining: QueuedLead[] = [];

  for (const item of queue) {
    try {
      await query(
        `INSERT INTO contact_leads
         (name, phone, email, address, service_type, budget_range, timeframe, referral_source, description, message, preferred_date, preferred_time, status, priority, estimated_value, lead_score, source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.name,
          item.phone,
          item.email,
          item.address || null,
          item.serviceType || null,
          item.budgetRange || null,
          item.timeframe || null,
          item.referralSource || null,
          item.description,
          item.description,
          item.preferredDate || null,
          item.preferredTime || null,
          'new',
          item.priority || 'medium',
          null,
          item.leadScore || 0,
          'contact_form',
        ]
      );
      replayed += 1;
    } catch {
      remaining.push(item);
    }
  }

  await writeQueue(remaining);
  return {
    replayed,
    failed: remaining.length,
    remaining: remaining.length,
  };
}

export async function GET(request: Request) {
  try {
    const adminSession = await verifyAdminAuth(request);
    if (!adminSession || adminSession.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const queue = await readQueue();
    return NextResponse.json({
      queuedCount: queue.length,
      latestQueuedAt: queue.length > 0 ? queue[queue.length - 1].queued_at || null : null,
      sampleReasons: queue.slice(-3).map((q) => q.reason || 'Unknown DB error'),
    });
  } catch (error) {
    console.error('Failed to get lead queue status:', error);
    return NextResponse.json({ error: 'Failed to get queue status' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminSession = await verifyAdminAuth(request);
    if (!adminSession || adminSession.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await flushQueue();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Failed to replay queued leads:', error);
    return NextResponse.json({ error: 'Failed to replay queued leads' }, { status: 500 });
  }
}
