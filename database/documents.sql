-- Document Management Tables
-- For subcontractors, customers, and projects

-- Subcontractor Documents
CREATE TABLE IF NOT EXISTS subcontractor_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subcontractor_id INT NOT NULL,
    document_type ENUM('license', 'insurance', 'w9', 'certificate', 'contract', 'other') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL,
    expiration_date DATE,
    status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
    uploaded_by INT,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE CASCADE,
    INDEX idx_subcontractor_id (subcontractor_id),
    INDEX idx_document_type (document_type),
    INDEX idx_status (status),
    INDEX idx_expiration_date (expiration_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Documents (in addition to existing documents table)
CREATE TABLE IF NOT EXISTS customer_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    project_id INT NULL,
    document_type ENUM('contract', 'permit', 'invoice', 'receipt', 'photo', 'other') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL,
    uploaded_by ENUM('admin', 'customer') NOT NULL,
    is_visible_to_customer BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_project_id (project_id),
    INDEX idx_document_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project Documents
CREATE TABLE IF NOT EXISTS project_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    document_type ENUM('contract', 'permit', 'invoice', 'photo', 'blueprint', 'change_order', 'other') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL,
    uploaded_by_admin INT NULL,
    uploaded_by_customer INT NULL,
    is_visible_to_customer BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_document_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
