-- Add PIN field to subcontractors table for unified login
ALTER TABLE subcontractors 
ADD COLUMN pin VARCHAR(6) NULL AFTER email;

-- Add index for faster lookups
ALTER TABLE subcontractors 
ADD INDEX idx_email_pin (email, pin);
