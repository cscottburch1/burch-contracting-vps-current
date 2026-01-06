-- Comprehensive tradesman app database tables

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
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
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
  FOREIGN KEY (assigned_to) REFERENCES tradesman_users(id) ON DELETE SET NULL
);
