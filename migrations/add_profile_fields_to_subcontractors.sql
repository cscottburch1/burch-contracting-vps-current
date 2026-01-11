-- Add profile customization fields to subcontractors table
ALTER TABLE subcontractors 
ADD COLUMN logo_url VARCHAR(500) NULL AFTER email,
ADD COLUMN bio TEXT NULL AFTER specialties,
ADD COLUMN website VARCHAR(255) NULL AFTER phone,
ADD COLUMN services_offered TEXT NULL AFTER bio,
ADD COLUMN profile_theme VARCHAR(50) DEFAULT 'default' AFTER services_offered;
