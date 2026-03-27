import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/mailer';
import { query } from '@/lib/mysql';
import { validateRecaptcha } from '@/lib/recaptcha';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { calculateLeadScore } from '@/lib/leadScoring';
import { writeFile, mkdir, readFile, rename, copyFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

type LeadInsertPayload = {
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
};

type QueuedLeadFile = {
  storedName: string;
  originalName: string;
  mimeType: string;
  size: number;
  tempDirId: string;
};

type QueuedLeadPayload = LeadInsertPayload & {
  queuedFiles?: QueuedLeadFile[];
};

const LEAD_QUEUE_FILE = join(process.cwd(), 'tmp', 'emergency_leads_queue.json');
const LEAD_UPLOAD_QUEUE_DIR = join(process.cwd(), 'tmp', 'emergency_lead_uploads');

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function createUniqueName(originalName: string): string {
  const sanitized = sanitizeFileName(originalName);
  const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return `${stamp}_${sanitized}`;
}

async function ensureDir(path: string) {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
}

function getAllowedUploadType(fileType: string): boolean {
  const allowed = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]);
  return allowed.has((fileType || '').toLowerCase());
}

async function moveFileWithFallback(fromPath: string, toPath: string) {
  try {
    await rename(fromPath, toPath);
  } catch {
    await copyFile(fromPath, toPath);
    await unlink(fromPath).catch(() => undefined);
  }
}

async function persistQueuedFiles(files: File[]): Promise<QueuedLeadFile[]> {
  if (files.length === 0) {
    return [];
  }

  await ensureDir(LEAD_UPLOAD_QUEUE_DIR);
  const tempDirId = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const tempDir = join(LEAD_UPLOAD_QUEUE_DIR, tempDirId);
  await ensureDir(tempDir);

  const queuedFiles: QueuedLeadFile[] = [];
  for (const file of files) {
    const storedName = createUniqueName(file.name || 'upload.bin');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(join(tempDir, storedName), buffer);

    queuedFiles.push({
      storedName,
      originalName: file.name || storedName,
      mimeType: file.type || 'application/octet-stream',
      size: file.size || buffer.length,
      tempDirId,
    });
  }

  return queuedFiles;
}

async function attachQueuedFilesToLead(leadId: number, queuedFiles: QueuedLeadFile[]) {
  if (!queuedFiles || queuedFiles.length === 0) {
    return [] as string[];
  }

  const leadDir = join(process.cwd(), 'public', 'uploads', 'leads', String(leadId));
  await ensureDir(leadDir);

  const attachmentNames: string[] = [];
  for (const file of queuedFiles) {
    const sourcePath = join(LEAD_UPLOAD_QUEUE_DIR, file.tempDirId, file.storedName);
    const destinationName = file.storedName;
    const destinationPath = join(leadDir, destinationName);

    if (!existsSync(sourcePath)) {
      continue;
    }

    await moveFileWithFallback(sourcePath, destinationPath);
    attachmentNames.push(destinationName);
  }

  return attachmentNames;
}

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

  // Defensive column sync for older/stale schemas.
  await query(`ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS message TEXT`);
  await query(`ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS attachments TEXT`);
  await query(`ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS preferred_date DATE`);
  await query(`ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS preferred_time VARCHAR(50)`);
  await query(`ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS lead_score INT DEFAULT 0`);
  await query(`ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS source VARCHAR(100)`);
  await query(`ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
}

async function queueLeadForRecovery(payload: LeadInsertPayload, reason: string, files: File[] = []) {
  const queueDir = join(process.cwd(), 'tmp');
  if (!existsSync(queueDir)) {
    await mkdir(queueDir, { recursive: true });
  }

  let queue: any[] = [];
  if (existsSync(LEAD_QUEUE_FILE)) {
    try {
      queue = JSON.parse(await readFile(LEAD_QUEUE_FILE, 'utf8'));
      if (!Array.isArray(queue)) queue = [];
    } catch {
      queue = [];
    }
  }

  const queuedFiles = await persistQueuedFiles(files);

  queue.push({
    ...payload,
    queuedFiles,
    queued_at: new Date().toISOString(),
    reason,
  });

  await writeFile(LEAD_QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
}

async function tryFlushLeadQueue() {
  if (!existsSync(LEAD_QUEUE_FILE)) {
    return;
  }

  let queue: QueuedLeadPayload[] = [];
  try {
    const raw = await readFile(LEAD_QUEUE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      queue = parsed;
    }
  } catch {
    return;
  }

  if (queue.length === 0) {
    return;
  }

  const remaining: any[] = [];
  for (const item of queue) {
    try {
      const insertResult = await query<any>(
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
          item.priority,
          null,
          item.leadScore,
          'contact_form',
        ]
      );

      const leadId = (insertResult as any)?.insertId;
      if (leadId && item.queuedFiles && item.queuedFiles.length > 0) {
        const attachmentNames = await attachQueuedFilesToLead(Number(leadId), item.queuedFiles);
        if (attachmentNames.length > 0) {
          await query('UPDATE contact_leads SET attachments = ? WHERE id = ?', [JSON.stringify(attachmentNames), leadId]);
        }
      }
    } catch {
      remaining.push(item);
    }
  }

  await writeFile(LEAD_QUEUE_FILE, JSON.stringify(remaining, null, 2), 'utf8');
}

async function getLeadTableConfig(): Promise<{ tableName: 'contact_leads' | 'leads'; columns: Set<string> }> {
  await ensureContactLeadsTable();

  const tableName = 'contact_leads' as const;

  const columnRows = await query<{ COLUMN_NAME: string }>(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?`,
    [tableName]
  );

  return {
    tableName,
    columns: new Set(columnRows.map(c => c.COLUMN_NAME)),
  };
}

export async function POST(request: Request) {
  try {
    // Rate limiting - max 5 submissions per 15 minutes per IP
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit({
      identifier: clientIp,
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse FormData for file upload support
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const serviceType = formData.get('serviceType') as string;
    const budgetRange = formData.get('budgetRange') as string;
    const timeframe = formData.get('timeframe') as string;
    const referralSource = formData.get('referralSource') as string;
    const description = formData.get('description') as string;
    const preferredDate = formData.get('preferredDate') as string;
    const preferredTime = formData.get('preferredTime') as string;
    const recaptchaToken = formData.get('recaptchaToken') as string;
    const website = formData.get('website') as string; // Honeypot field

    // Honeypot check
    if (website) {
      console.warn(`Spam detected (honeypot): ${email || 'no email'}`);
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Basic validation
    if (!name || !phone || !email || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Collect files early so they can be queued safely if DB is unavailable.
    const files: File[] = [];
    for (let i = 0; i < 10; i++) {
      const file = formData.get(`file${i}`) as File | null;
      if (file && file.size > 0) {
        files.push(file);
      }
    }

    if (files.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 files allowed' }, { status: 400 });
    }

    const maxFileSize = 10 * 1024 * 1024;
    for (const file of files) {
      if (file.size > maxFileSize) {
        return NextResponse.json({ error: 'Each file must be 10MB or smaller' }, { status: 400 });
      }

      if (!getAllowedUploadType(file.type || '')) {
        return NextResponse.json({ error: `Unsupported file type: ${file.type || 'unknown'}` }, { status: 400 });
      }
    }

    // Verify reCAPTCHA if token provided
    if (recaptchaToken) {
      try {
        await validateRecaptcha(recaptchaToken, 'contact_form', 0.5);
      } catch (recaptchaError) {
        console.error('reCAPTCHA validation failed:', recaptchaError);
        return NextResponse.json(
          { error: 'Spam protection check failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Calculate lead score and auto-assign priority
    const leadScore = calculateLeadScore({
      budgetRange,
      timeframe,
      serviceType,
      referralSource,
      description,
    });

    const leadPayload: LeadInsertPayload = {
      name,
      phone,
      email,
      address: address || null,
      serviceType: serviceType || null,
      budgetRange: budgetRange || null,
      timeframe: timeframe || null,
      referralSource: referralSource || null,
      description,
      preferredDate: preferredDate || null,
      preferredTime: preferredTime || null,
      priority: leadScore.priority,
      leadScore: leadScore.totalScore,
    };

    // Support both legacy and current schemas to avoid submission failures.
    const { tableName, columns } = await getLeadTableConfig();

    // Opportunistically replay any previously queued leads when DB is healthy.
    await tryFlushLeadQueue();

    const insertColumns: string[] = [];
    const insertValues: any[] = [];

    const addField = (column: string, value: any) => {
      if (columns.has(column)) {
        insertColumns.push(column);
        insertValues.push(value);
      }
    };

    addField('name', name);
    addField('phone', phone);
    addField('email', email);
    addField('address', address || null);
    addField('service_type', serviceType || null);
    addField('budget_range', budgetRange || null);
    addField('timeframe', timeframe || null);
    addField('referral_source', referralSource || null);
    addField('description', description);
    addField('message', description); // Legacy compatibility.
    addField('preferred_date', preferredDate || null);
    addField('preferred_time', preferredTime || null);
    addField('status', 'new');
    addField('priority', leadScore.priority);
    addField('estimated_value', null);
    addField('lead_score', leadScore.totalScore);
    addField('source', 'contact_form');

    if (insertColumns.length === 0) {
      throw new Error(`No compatible columns found on ${tableName}`);
    }

    // Save lead to database
    const placeholders = insertColumns.map(() => '?').join(', ');
    let result: any;
    try {
      result = await query<any>(
        `INSERT INTO ${tableName} (${insertColumns.join(', ')}) VALUES (${placeholders})`,
        insertValues
      );
    } catch (dbError) {
      // Emergency fallback to avoid losing leads when DB/schema is temporarily unhealthy.
      await queueLeadForRecovery(leadPayload, dbError instanceof Error ? dbError.message : 'Unknown DB error', files);
      console.error('Lead queued for recovery due to DB error:', dbError);

      return NextResponse.json({
        success: true,
        queued: true,
        message: 'Request received and queued for processing',
      });
    }

    const leadId = (result as any).insertId;

    // Handle file uploads
    const uploadedFileNames: string[] = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'leads', String(leadId));

    if (files.length > 0) {
      try {
        // Create upload directory if it doesn't exist
        await ensureDir(uploadDir);

        // Save each file
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          const fileName = createUniqueName(file.name || 'upload.bin');
          const filePath = join(uploadDir, fileName);
          
          await writeFile(filePath, buffer);
          uploadedFileNames.push(fileName);
          
          console.log(`Saved file: ${fileName} (${(file.size / 1024).toFixed(2)} KB)`);
        }

        // Store file references in database
        if (uploadedFileNames.length > 0 && leadId && columns.has('attachments')) {
          await query(
            `UPDATE ${tableName} SET attachments = ? WHERE id = ?`,
            [JSON.stringify(uploadedFileNames), leadId]
          );
        }
      } catch (fileError) {
        console.error('Error saving uploaded files:', fileError);
        // Don't fail the request if file upload fails
      }
    }

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        const priorityBadge = leadScore.priority === 'urgent' ? '🔴 URGENT' :
                              leadScore.priority === 'high' ? '🟠 HIGH PRIORITY' :
                              leadScore.priority === 'medium' ? '🔵 MEDIUM' : '⚪ LOW';

        const attachmentsText = uploadedFileNames.length > 0 
          ? `\n\n📎 Attachments (${uploadedFileNames.length}):\n${uploadedFileNames.map(f => `  • ${f}`).join('\n')}\n`
          : '';

        await sendLeadEmail({
          to: adminEmail,
          subject: `${priorityBadge} New Lead: ${name} - ${serviceType || 'General Inquiry'}`,
          text: `
New Lead Submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEAD SCORE: ${leadScore.totalScore}/375 | PRIORITY: ${priorityBadge}

Contact Information:
• Name: ${name}
• Phone: ${phone}
• Email: ${email}
${address ? `• Address: ${address}` : ''}

Project Details:
${serviceType ? `• Service Type: ${serviceType}` : ''}
${budgetRange ? `• Budget Range: ${budgetRange}` : ''}
${timeframe ? `• Timeframe: ${timeframe}` : ''}
${referralSource ? `• Referral Source: ${referralSource}` : ''}

Appointment Request:
${preferredDate ? `• Preferred Date: ${preferredDate}` : ''}
${preferredTime ? `• Preferred Time: ${preferredTime}` : ''}

Message:
${description}${attachmentsText}

Score Breakdown:
• Budget: ${leadScore.breakdown.budgetScore}/100
• Timeframe: ${leadScore.breakdown.timeframeScore}/100
• Service Type: ${leadScore.breakdown.serviceScore}/100
• Referral: ${leadScore.breakdown.referralScore}/50

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
View in CRM: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/crm/leads/${leadId}
          `,
          replyTo: email,
        });
        console.log('Lead email notification sent to admin');
      } catch (emailError) {
        console.error('Failed to send lead email:', emailError);
      }
    }

    console.log('New contact form submission:', {
      name,
      phone,
      email,
      serviceType,
      filesUploaded: uploadedFileNames.length,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      filesUploaded: uploadedFileNames.length
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
