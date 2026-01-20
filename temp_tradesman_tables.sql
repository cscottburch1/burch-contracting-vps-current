CREATE TABLE IF NOT EXISTS tradesman_time_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tradesman_id INT NOT NULL,
  project_id INT NOT NULL,
  clock_in DATETIME NOT NULL,
  clock_out DATETIME,
  break_minutes INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tradesman (tradesman_id),
  INDEX idx_project (project_id),
  INDEX idx_date (clock_in)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  INDEX idx_tradesman_project (tradesman_id, project_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  INDEX idx_tradesman_project (tradesman_id, project_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  INDEX idx_project_status (project_id, status),
  INDEX idx_assigned (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
