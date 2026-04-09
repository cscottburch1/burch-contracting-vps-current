-- 2026-03-27: Lead/CRM hardening migration
-- Safe to run multiple times.

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Best-effort backfill from legacy JSON attachment column.
INSERT IGNORE INTO lead_attachments (lead_id, original_filename, stored_filename, file_path, mime_type, file_size)
SELECT
  l.id,
  jt.filename,
  jt.filename,
  CONCAT('/uploads/leads/', l.id, '/', jt.filename),
  'application/octet-stream',
  0
FROM contact_leads l
JOIN JSON_TABLE(
  IF(JSON_VALID(l.attachments), l.attachments, JSON_ARRAY()),
  '$[*]' COLUMNS (filename VARCHAR(255) PATH '$')
) AS jt
WHERE l.attachments IS NOT NULL AND l.attachments <> '';
