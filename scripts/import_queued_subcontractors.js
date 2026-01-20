#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const QUEUE_PATH = path.resolve(__dirname, '..', 'tmp', 'subcontractor_applications.json');

async function main() {
  if (!fs.existsSync(QUEUE_PATH)) {
    console.error('No queued applications file found at', QUEUE_PATH);
    process.exit(1);
  }

  const raw = fs.readFileSync(QUEUE_PATH, 'utf8');
  let items;
  try {
    items = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse queued file:', err.message);
    process.exit(1);
  }

  if (!Array.isArray(items) || items.length === 0) {
    console.log('No queued entries to import.');
    process.exit(0);
  }

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
  });

  const remaining = [];
  for (const entry of items) {
    const email = entry.email;
    if (!email) {
      console.warn('Skipping entry with no email:', entry);
      continue;
    }

    try {
      const [rows] = await pool.execute('SELECT id FROM subcontractors WHERE email = ? LIMIT 1', [email]);
      if (rows && rows.length > 0) {
        console.log(`Already exists, skipping: ${email}`);
        continue;
      }

      const specialties = entry.specialties ? JSON.stringify(entry.specialties) : JSON.stringify([]);
      const createdAt = entry.created_at ? new Date(entry.created_at) : new Date();

      const insertSql = `INSERT INTO subcontractors
        (company_name, contact_name, email, phone, business_type, years_in_business, specialties, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        entry.company_name || null,
        entry.contact_name || null,
        email,
        entry.phone || null,
        entry.business_type || 'sole_proprietor',
        entry.years_in_business || null,
        specialties,
        'pending',
        createdAt,
      ];

      const [res] = await pool.execute(insertSql, params);
      const insertedId = res.insertId;
      console.log(`Imported ${email} as id=${insertedId}`);

      // Add an activity log entry if table exists
      try {
        await pool.execute(
          'INSERT INTO subcontractor_activity (subcontractor_id, activity_type, description, created_at) VALUES (?, ?, ?, ?)',
          [insertedId, 'application', 'Imported from queued applications', new Date()]
        );
      } catch (actErr) {
        // Non-fatal
      }

    } catch (err) {
      console.error('Failed to import', email, '-', err.message);
      // Keep this entry in the remaining queue
      remaining.push(entry);
    }
  }

  // Write back remaining items (if any). If none, remove the queue file.
  if (remaining.length > 0) {
    fs.writeFileSync(QUEUE_PATH, JSON.stringify(remaining, null, 2), 'utf8');
    console.log(`Wrote ${remaining.length} remaining queued entries back to queue.`);
  } else {
    try {
      fs.unlinkSync(QUEUE_PATH);
      console.log('All queued entries imported; removed queue file.');
    } catch (e) {
      console.warn('Imported all entries but failed to delete queue file:', e.message);
    }
  }

  await pool.end();
}

main().catch((err) => {
  console.error('Import script failed:', err.message);
  process.exit(1);
});
