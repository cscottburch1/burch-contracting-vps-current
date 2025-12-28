import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// Run payments migration
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Create payments table
    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        invoice_id INT NOT NULL,
        customer_id INT NOT NULL,
        stripe_payment_intent_id VARCHAR(255) UNIQUE,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'usd',
        status ENUM('pending', 'processing', 'succeeded', 'failed', 'refunded') DEFAULT 'pending',
        payment_method_type VARCHAR(50),
        payment_method_last4 VARCHAR(4),
        receipt_url VARCHAR(500),
        failure_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        INDEX idx_invoice (invoice_id),
        INDEX idx_customer (customer_id),
        INDEX idx_status (status),
        INDEX idx_stripe_payment (stripe_payment_intent_id)
      )
    `);

    // Create customer_stripe_info table
    await query(`
      CREATE TABLE IF NOT EXISTS customer_stripe_info (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT UNIQUE NOT NULL,
        stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
        has_saved_payment_method BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      )
    `);

    // Check if columns already exist before adding them
    const checkInvoicesColumns = await query(`
      SHOW COLUMNS FROM invoices LIKE 'payment_status'
    `);

    if ((checkInvoicesColumns as any[]).length === 0) {
      // Alter invoices table to add payment tracking
      await query(`
        ALTER TABLE invoices
        ADD COLUMN payment_status ENUM('unpaid', 'partial', 'paid', 'overdue') DEFAULT 'unpaid' AFTER status,
        ADD COLUMN amount_paid DECIMAL(10, 2) DEFAULT 0.00 AFTER payment_status,
        ADD COLUMN payment_link VARCHAR(500) AFTER amount_paid,
        ADD COLUMN stripe_enabled BOOLEAN DEFAULT TRUE AFTER payment_link
      `);
      console.log('✅ Invoices table altered successfully');
    } else {
      console.log('ℹ️ Invoice columns already exist, skipping ALTER');
    }

    console.log('✅ Payments tables created successfully');

    return NextResponse.json({
      success: true,
      message: 'Payments tables created successfully',
      tables: [
        'payments',
        'customer_stripe_info'
      ],
      invoicesAltered: (checkInvoicesColumns as any[]).length === 0
    });

  } catch (error: any) {
    console.error('❌ Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error.message 
    }, { status: 500 });
  }
}
