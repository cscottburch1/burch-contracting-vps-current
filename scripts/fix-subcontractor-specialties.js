const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fixSubcontractorSpecialties() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'burch_contracting'
  });

  try {
    console.log('Connected to database');

    // Get all subcontractors
    const [rows] = await connection.query('SELECT id, specialties FROM subcontractors');
    
    console.log(`Found ${rows.length} subcontractors to check`);

    let fixedCount = 0;
    
    for (const row of rows) {
      const { id, specialties } = row;
      
      // Skip if null or already valid JSON array
      if (!specialties) {
        console.log(`  Subcontractor ${id}: specialties is null, setting to empty array`);
        await connection.query('UPDATE subcontractors SET specialties = ? WHERE id = ?', [JSON.stringify([]), id]);
        fixedCount++;
        continue;
      }

      // Check if it's a valid JSON array
      try {
        const parsed = JSON.parse(specialties);
        if (Array.isArray(parsed)) {
          console.log(`  Subcontractor ${id}: already valid JSON array`);
          continue;
        }
      } catch (e) {
        // Not valid JSON, needs fixing
      }

      // If it's a comma-separated string, convert to array
      if (typeof specialties === 'string' && !specialties.startsWith('[')) {
        const specialtiesArray = specialties.split(',').map(s => s.trim()).filter(s => s);
        const jsonSpecialties = JSON.stringify(specialtiesArray);
        
        console.log(`  Subcontractor ${id}: Converting "${specialties}" to ${jsonSpecialties}`);
        await connection.query('UPDATE subcontractors SET specialties = ? WHERE id = ?', [jsonSpecialties, id]);
        fixedCount++;
      }
    }

    console.log(`\nFixed ${fixedCount} subcontractor records`);

    // Verify the fix
    console.log('\nVerifying...');
    const [verifyRows] = await connection.query('SELECT id, specialties FROM subcontractors LIMIT 5');
    for (const row of verifyRows) {
      console.log(`  ID ${row.id}: ${row.specialties}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
    console.log('\nDatabase connection closed');
  }
}

fixSubcontractorSpecialties();
