# Import Previous Customers

This guide will help you import your previous customer data into the new admin system.

## Option 1: Manual Entry via Admin Panel

1. Log in to your admin panel: `https://burchcontracting.com/admin`
2. Navigate to **Customers** section
3. Click **Add New Customer** button
4. Fill in customer details:
   - Name
   - Email
   - Phone
   - Address
   - Set a temporary password
5. Customer can log in at `/portal` and reset their password

## Option 2: Bulk Import Script

If you have many customers, use the import script:

### Step 1: Edit the customer list

Edit `scripts/import-customers.js` and update the `CUSTOMERS` array with your actual customer data:

```javascript
const CUSTOMERS = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '864-555-0101',
    address: '123 Main St, Simpsonville, SC 29681',
    password: 'TempPassword123!'
  },
  // Add more customers...
];
```

### Step 2: Run the import script locally

```bash
cd c:\Users\cscot\burch-contracting-fresh
node scripts/import-customers.js
```

### Step 3: Run on the server

If you need to run it directly on your server:

```bash
# Upload the script
scp scripts/import-customers.js root@72.60.166.68:/root/burch-contracting-fresh/scripts/

# SSH into server and run it
ssh root@72.60.166.68
cd /root/burch-contracting-fresh
node scripts/import-customers.js
```

## Option 3: Export from Previous System

### If you had Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this query to export customers:

```sql
SELECT 
  name,
  email,
  phone,
  address,
  created_at
FROM customers
ORDER BY created_at DESC;
```

4. Download the results as CSV
5. Convert to the format needed in `import-customers.js`

### If you had MySQL backup:

1. Find your old MySQL dump file
2. Extract customer data:

```bash
grep "INSERT INTO \`customers\`" your-backup.sql > customers-data.sql
```

3. Import directly:

```bash
mysql -u burch_user -p burch_contracting < customers-data.sql
```

## Option 4: Direct Database Insert

If you have customer data in a spreadsheet, you can run SQL directly:

```sql
INSERT INTO customers (name, email, password_hash, phone, address, created_at)
VALUES 
  ('Customer Name', 'email@example.com', '$2b$10$hashedpassword', '864-555-0100', '123 Main St', NOW());
```

**Note:** You'll need to generate bcrypt password hashes. Use this online or via Node.js:

```javascript
const bcrypt = require('bcrypt');
console.log(bcrypt.hashSync('TempPassword123!', 10));
```

## After Import

1. Verify customers appear in `/admin/customers`
2. Send customers their temporary credentials
3. Direct them to `/portal` to log in and change their password
4. Optionally, you can trigger password reset emails for all new customers

## Need Help?

Contact support or check the customer table structure:

```sql
DESCRIBE customers;
```
