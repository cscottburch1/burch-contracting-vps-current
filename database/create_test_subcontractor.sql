-- Create test subcontractor with PIN for unified login
INSERT INTO subcontractors 
(company_name, contact_name, email, phone, address, city, state, zip, specialties, years_in_business, license_number, insurance_provider, status, admin_notes, pin)
VALUES 
('Test Subcontractor LLC', 'John Smith', 'sub@burchcontracting.com', '864-555-0123', '123 Main St', 'Greenville', 'SC', '29601', '["Electrical","Plumbing"]', 15, 'SC-12345', 'General Liability Insurance Co - Policy #GL123456', 'active', 'Test subcontractor for system testing', '123456');
