-- Add lead_score column for intelligent lead scoring
ALTER TABLE contact_leads ADD COLUMN lead_score INT DEFAULT 0 COMMENT 'Calculated lead score (0-375)';

-- Add index for efficient sorting by score
ALTER TABLE contact_leads ADD INDEX idx_lead_score (lead_score);

-- Update existing leads with default score
UPDATE contact_leads SET lead_score = 100 WHERE lead_score = 0 OR lead_score IS NULL;

-- Show confirmation
SELECT 'Migration completed successfully!' as Status;
SELECT COUNT(*) as total_leads, AVG(lead_score) as avg_score FROM contact_leads;
