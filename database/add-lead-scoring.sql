-- Add lead_score column to leads table
-- This migration adds intelligent lead scoring to track lead quality

ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_score INT DEFAULT 0 COMMENT 'Calculated lead score (0-375)';

-- Add index for efficient sorting by score
ALTER TABLE leads ADD INDEX IF NOT EXISTS idx_lead_score (lead_score);

-- Update existing leads with default score
-- This will be recalculated automatically on next update
UPDATE leads SET lead_score = 100 WHERE lead_score = 0 OR lead_score IS NULL;

-- Ensure contact_leads table (if it exists) also has the column
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS lead_score INT DEFAULT 0 COMMENT 'Calculated lead score (0-375)';
ALTER TABLE contact_leads ADD INDEX IF NOT EXISTS idx_lead_score (lead_score);
UPDATE contact_leads SET lead_score = 100 WHERE lead_score = 0 OR lead_score IS NULL;
