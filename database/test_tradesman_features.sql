-- Test data for tradesmen features
-- This creates sample materials, issues, reports, and tasks for testing

-- Sample material requests (using existing tradesman_users and projects)
INSERT INTO tradesman_material_requests 
(tradesman_id, project_id, item_name, quantity, priority, reason, needed_by_date, status, requested_date)
VALUES 
(1, 1, '2x4 Lumber', '50 pieces', 'high', 'Framing for new addition', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'pending', NOW()),
(1, 1, 'Drywall Screws', '2 boxes', 'medium', 'Interior finishing work', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'pending', NOW()),
(1, 2, 'Concrete Mix', '10 bags', 'urgent', 'Foundation repair needed ASAP', CURDATE(), 'approved', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Sample issues
INSERT INTO tradesman_issues 
(tradesman_id, project_id, issue_type, title, description, severity, status, reported_at)
VALUES 
(1, 1, 'safety', 'Exposed Electrical Wiring', 'Found exposed wiring near the main panel that needs immediate attention', 'high', 'open', NOW()),
(1, 1, 'material', 'Wrong Paint Color Delivered', 'Customer ordered Sherwin Williams SW7006 but received SW7007', 'medium', 'open', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 2, 'equipment', 'Nail Gun Malfunction', 'Pneumatic nail gun not firing consistently', 'low', 'resolved', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Sample daily reports
INSERT INTO tradesman_daily_reports 
(tradesman_id, project_id, report_date, work_completed, hours_worked, materials_used, weather_conditions, notes)
VALUES 
(1, 1, CURDATE(), 'Completed framing for master bedroom addition. Installed all studs and header beams.', 8.5, '2x4 lumber (40 pieces), framing nails', 'Clear/Sunny', 'Good progress today. On schedule.'),
(1, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Rough electrical work in new addition. Ran all circuits for outlets and switches.', 7.0, 'Romex wire, junction boxes, wire nuts', 'Partly Cloudy', 'Inspector coming tomorrow.'),
(1, 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Foundation repair completed. Poured new concrete and leveled.', 9.0, 'Concrete mix (8 bags), rebar', 'Clear/Sunny', 'Waiting for concrete to cure.');

-- Sample tasks
INSERT INTO tradesman_tasks 
(project_id, title, description, assigned_to, priority, status, due_date, created_by)
VALUES 
(1, 'Install Drywall in Master Bedroom', 'Hang and tape drywall for master bedroom addition', 1, 'high', 'pending', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 1),
(1, 'Paint Trim Work', 'Prime and paint all interior trim and baseboards', 1, 'medium', 'pending', DATE_ADD(CURDATE(), INTERVAL 10 DAY), 1),
(2, 'Final Walkthrough', 'Complete final walkthrough with customer and address any concerns', 1, 'high', 'in_progress', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1),
(1, 'Electrical Inspection', 'Schedule and complete electrical inspection', NULL, 'high', 'completed', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1);
