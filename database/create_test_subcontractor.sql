-- Create test subcontractor with PIN for unified login
INSERT INTO subcontractors 
(company_name, contact_name, email, phone, address, city, state, zip_code, specialties, years_experience, insurance_info, license_number, status, admin_notes, pin)
VALUES 
('Test Subcontractor LLC', 'John Smith', 'sub@burchcontracting.com', '864-555-0123', '123 Main St', 'Greenville', 'SC', '29601', '["Electrical","Plumbing"]', 15, 'General Liability: $2M Policy #GL123456', 'SC-12345', 'active', 'Test subcontractor for system testing', '123456');
