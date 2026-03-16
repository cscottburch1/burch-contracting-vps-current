-- Simple Contact Leads Fix for phpMyAdmin
-- Copy and paste this entire script into phpMyAdmin SQL tab

-- Step 1: Check if you need to rename 'leads' to 'contact_leads'
-- Uncomment the line below ONLY if you have a 'leads' table (not 'contact_leads')
-- RENAME TABLE leads TO contact_leads;

-- Step 2: Create the table with all required columns
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
  attachments TEXT COMMENT 'JSON array of uploaded file names',
  preferred_date DATE COMMENT 'Customer preferred consultation date',
  preferred_time VARCHAR(50) COMMENT 'Customer preferred consultation time',
  lead_score INT DEFAULT 0 COMMENT 'Calculated lead score (0-375)',
  status ENUM('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost') DEFAULT 'new',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  assigned_to VARCHAR(255),
  estimated_value DECIMAL(10, 2),
  scheduled_date DATETIME,
  last_contact_date DATETIME,
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

-- Step 3: Add missing columns to existing table (these will only run if columns don't exist)
-- Note: Some of these may give "duplicate column" errors - that's OK, just ignore them

ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS attachments TEXT COMMENT 'JSON array of uploaded file names' AFTER description;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS preferred_date DATE COMMENT 'Customer preferred consultation date' AFTER attachments;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS preferred_time VARCHAR(50) COMMENT 'Customer preferred consultation time' AFTER preferred_date;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS lead_score INT DEFAULT 0 COMMENT 'Calculated lead score (0-375)' AFTER preferred_time;

-- Step 4: Add index for lead_score if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_lead_score ON contact_leads(lead_score);

-- Step 5: Create related tables
CREATE TABLE IF NOT EXISTS lead_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  note_type ENUM('general', 'call', 'email', 'meeting', 'follow_up') DEFAULT 'general',
  content TEXT NOT NULL,
  is_important BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lead_id (lead_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Done! Your contact_leads table is now ready.
