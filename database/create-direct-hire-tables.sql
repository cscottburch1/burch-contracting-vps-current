-- Direct Hire Employee Applications Table
CREATE TABLE IF NOT EXISTS `direct_hire_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` VARCHAR(255),
  `city` VARCHAR(100),
  `state` VARCHAR(50),
  `zip` VARCHAR(10),
  `position` VARCHAR(100) NOT NULL,
  `experience_level` VARCHAR(50) NOT NULL,
  `years_experience` SMALLINT,
  `certifications` LONGTEXT,
  `bio` LONGTEXT,
  `ip_address` VARCHAR(45),
  `status` ENUM('pending', 'reviewing', 'approved', 'rejected') DEFAULT 'pending',
  `admin_notes` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_position` (`position`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employee Documents Table (for storing uploaded certifications, licenses, etc)
CREATE TABLE IF NOT EXISTS `employee_documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_id` INT NOT NULL,
  `document_type` VARCHAR(100) NOT NULL,
  `document_url` VARCHAR(512) NOT NULL,
  `file_name` VARCHAR(255),
  `file_size` INT,
  `expiry_date` DATE,
  `verified` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`application_id`) REFERENCES `direct_hire_applications`(`id`) ON DELETE CASCADE,
  INDEX `idx_application_id` (`application_id`),
  INDEX `idx_document_type` (`document_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employee Activity Log
CREATE TABLE IF NOT EXISTS `employee_activity` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_id` INT NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `description` LONGTEXT,
  `performed_by` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`application_id`) REFERENCES `direct_hire_applications`(`id`) ON DELETE CASCADE,
  INDEX `idx_application_id` (`application_id`),
  INDEX `idx_action` (`action`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hired Employees Table
CREATE TABLE IF NOT EXISTS `hired_employees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_id` INT NOT NULL,
  `employee_status` ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
  `hire_date` DATE,
  `position_assigned` VARCHAR(100),
  `salary_grade` VARCHAR(50),
  `employment_type` ENUM('full-time', 'part-time', 'contract') DEFAULT 'full-time',
  `manager_id` INT,
  `performance_notes` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_application_id` (`application_id`),
  FOREIGN KEY (`application_id`) REFERENCES `direct_hire_applications`(`id`) ON DELETE CASCADE,
  INDEX `idx_employee_status` (`employee_status`),
  INDEX `idx_hire_date` (`hire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
