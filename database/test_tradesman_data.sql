-- Insert a test tradesman user
INSERT INTO tradesman_users (name, email, phone, pin, is_active) 
VALUES ('Test Crew Member', 'crew@burchcontracting.com', '864-555-0100', '123456', true);

-- Assign the test user to project 1
INSERT INTO tradesman_project_assignments (tradesman_id, project_id, assigned_date, role) 
VALUES (1, 1, CURDATE(), 'Lead Installer');
