const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

// Sample customers - UPDATE THIS ARRAY with your actual customer data
const CUSTOMERS = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '864-555-0101',
    address: '123 Main St, Simpsonville, SC 29681',
    password: 'TempPassword123!' // They can reset this via "forgot password"
  },
  {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '864-555-0102',
    address: '456 Oak Ave, Greenville, SC 29607',
    password: 'TempPassword123!'
  },
  // Add more customers here...
];

async function importCustomers() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  console.log('Connected to MySQL database');

  try {
    const bcrypt = require('bcrypt');
    
    for (const customer of CUSTOMERS) {
      // Check if customer already exists
      const [existing] = await connection.execute(
        'SELECT id FROM customers WHERE email = ?',
        [customer.email]
      );

      if (existing.length > 0) {
        console.log(`⚠️  Customer ${customer.email} already exists, skipping...`);
        continue;
      }

      // Hash the password
      const password_hash = await bcrypt.hash(customer.password, 10);

      // Insert customer
      const [result] = await connection.execute(
        `INSERT INTO customers (name, email, password_hash, phone, address, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [customer.name, customer.email, password_hash, customer.phone, customer.address]
      );

      console.log(`✅ Imported customer: ${customer.name} (${customer.email})`);
    }

    console.log('\n✨ Import complete!');
    console.log('\nNext steps:');
    console.log('1. Customers can log in at /portal with their email and temporary password');
    console.log('2. They should change their password after first login');
    console.log('3. You can view all customers in the admin panel at /admin/customers');

  } catch (error) {
    console.error('Error importing customers:', error);
  } finally {
    await connection.end();
  }
}

importCustomers();
