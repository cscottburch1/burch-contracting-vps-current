-- Add missing tradesmen feature tables
-- Run this migration to enable materials, issues, reports, and tasks features

-- Material Requests
CREATE TABLE IF NOT EXISTS tradesman_material_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tradesman_id INT NOT NULL,
  project_id INT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity VARCHAR(100) NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  reason TEXT,
  needed_by_date DATE,
  status ENUM('pending', 'approved', 'ordered', 'delivered', 'denied') DEFAULT 'pending',
  requested_date DATETIME NOT NULL,
  approved_by INT,
  approval_date DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tradesman_id) REFERENCES tradesman_users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_tradesman_project (tradesman_id, project_id),
  INDEX idx_status (status)
);

-- Issues/Problems reporting
CREATE TABLE IF NOT EXISTS tradesman_issues (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tradesman_id INT NOT NULL,
  project_id INT NOT NULL,
  issue_type ENUM('safety', 'quality', 'material', 'equipment', 'weather', 'schedule', 'other') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  status ENUM('open', 'acknowledged', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  photo_filename VARCHAR(255),
  reported_at DATETIME NOT NULL,
  resolved_at DATETIME,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tradesman_id) REFERENCES tradesman_users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_tradesman_project (tradesman_id, project_id),
  INDEX idx_status (status)
);

-- Daily Reports
CREATE TABLE IF NOT EXISTS tradesman_daily_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tradesman_id INT NOT NULL,
  project_id INT NOT NULL,
  report_date DATE NOT NULL,
  work_completed TEXT NOT NULL,
  hours_worked DECIMAL(5,2),
  materials_used TEXT,
  weather_conditions VARCHAR(100),
  safety_issues TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tradesman_id) REFERENCES tradesman_users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE KEY unique_daily_report (tradesman_id, project_id, report_date),
  INDEX idx_project_date (project_id, report_date)
);

-- Tasks/Checklist
CREATE TABLE IF NOT EXISTS tradesman_tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to INT,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  due_date DATE,
  completed_at DATETIME,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES tradesman_users(id) ON DELETE SET NULL,
  INDEX idx_project_status (project_id, status),
  INDEX idx_assigned (assigned_to)
);
