-- Add attachments column to contact_leads table
ALTER TABLE contact_leads 
ADD COLUMN attachments TEXT COMMENT 'JSON array of uploaded file names' AFTER description;

-- Update existing records to have empty array
UPDATE contact_leads SET attachments = '[]' WHERE attachments IS NULL;
