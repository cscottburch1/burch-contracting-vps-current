-- Add photos column to tradesman_daily_reports table
-- This will store photo URLs as JSON array for daily work reports

ALTER TABLE tradesman_daily_reports 
ADD COLUMN photos TEXT NULL 
COMMENT 'JSON array of photo/receipt URLs' 
AFTER notes;

-- Add index for faster queries when filtering by reports with photos
CREATE INDEX idx_reports_with_photos ON tradesman_daily_reports (project_id, report_date, (photos IS NOT NULL));
