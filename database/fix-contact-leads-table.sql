-- Migration to fix contact_leads table
-- This handles both renaming and adding missing columns

-- Step 1: Check if 'leads' table exists and rename it to 'contact_leads'
-- Note: This requires manual execution or checking which table exists

-- If you have a 'leads' table, run this:
-- RENAME TABLE leads TO contact_leads;

-- Step 2: Create contact_leads table if it doesn't exist (for new installations)
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

-- Step 3: Add missing columns if they don't exist (for existing installations)
SET @dbname = DATABASE();
SET @tablename = 'contact_leads';

-- Add attachments column if missing
SET @s = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME='attachments') > 0,
  'SELECT ''Column attachments already exists''',
  'ALTER TABLE contact_leads ADD COLUMN attachments TEXT COMMENT ''JSON array of uploaded file names'' AFTER description'
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add preferred_date column if missing
SET @s = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME='preferred_date') > 0,
  'SELECT ''Column preferred_date already exists''',
  'ALTER TABLE contact_leads ADD COLUMN preferred_date DATE COMMENT ''Customer preferred consultation date'' AFTER attachments'
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add preferred_time column if missing
SET @s = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME='preferred_time') > 0,
  'SELECT ''Column preferred_time already exists''',
  'ALTER TABLE contact_leads ADD COLUMN preferred_time VARCHAR(50) COMMENT ''Customer preferred consultation time'' AFTER preferred_date'
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add lead_score column if missing
SET @s = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME='lead_score') > 0,
  'SELECT ''Column lead_score already exists''',
  'ALTER TABLE contact_leads ADD COLUMN lead_score INT DEFAULT 0 COMMENT ''Calculated lead score (0-375)'' AFTER preferred_time'
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for lead_score if missing
SET @s = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND INDEX_NAME='idx_lead_score') > 0,
  'SELECT ''Index idx_lead_score already exists''',
  'ALTER TABLE contact_leads ADD INDEX idx_lead_score (lead_score)'
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 4: Create or update related tables
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

-- Note: Foreign key constraints are omitted to avoid errors if tables already exist
-- You can manually add them after ensuring the schema is correct if needed:
-- ALTER TABLE lead_notes ADD FOREIGN KEY (lead_id) REFERENCES contact_leads(id) ON DELETE CASCADE;
-- ALTER TABLE lead_activities ADD FOREIGN KEY (lead_id) REFERENCES contact_leads(id) ON DELETE CASCADE;
