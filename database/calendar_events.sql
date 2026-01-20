-- Calendar events table for scheduling and appointments
CREATE TABLE IF NOT EXISTS calendar_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  location VARCHAR(500),
  attendees TEXT COMMENT 'Comma-separated email addresses',
  event_type ENUM('consultation', 'site_visit', 'meeting', 'follow_up', 'other') DEFAULT 'consultation',
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  google_event_id VARCHAR(255),
  outlook_event_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES contact_leads(id) ON DELETE SET NULL,
  INDEX idx_start_datetime (start_datetime),
  INDEX idx_status (status),
  INDEX idx_lead (lead_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
