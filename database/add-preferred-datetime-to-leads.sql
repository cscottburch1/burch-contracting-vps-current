-- Add preferred_date and preferred_time columns to contact_leads table
ALTER TABLE contact_leads 
ADD COLUMN preferred_date DATE COMMENT 'Customer preferred consultation date',
ADD COLUMN preferred_time VARCHAR(50) COMMENT 'Customer preferred consultation time';
