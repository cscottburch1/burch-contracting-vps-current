-- Stripe Payment Tables

-- Payment Records
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    customer_id INT NOT NULL,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    status ENUM('pending', 'processing', 'succeeded', 'failed', 'refunded') DEFAULT 'pending',
    payment_method_type ENUM('card', 'ach', 'other') DEFAULT 'card',
    payment_method_last4 VARCHAR(4),
    receipt_url VARCHAR(500),
    failure_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_stripe_payment_intent_id (stripe_payment_intent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stripe Customer IDs (for saved payment methods)
CREATE TABLE IF NOT EXISTS customer_stripe_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL UNIQUE,
    stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
    has_saved_payment_method BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_stripe_customer_id (stripe_customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add payment fields to invoices table if not exists
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS payment_status ENUM('unpaid', 'partial', 'paid', 'overdue') DEFAULT 'unpaid',
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS payment_link VARCHAR(500),
ADD COLUMN IF NOT EXISTS stripe_enabled BOOLEAN DEFAULT TRUE;
