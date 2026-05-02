import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config({ path: '.env.production' });
dotenv.config({ path: '.env.local' });
dotenv.config();

const key = (process.env.INDEXNOW_KEY || 'f8b5a3e7c4d1f9a2e8b6d3c7f4a1e9b2').trim();

// IndexNow recommends using the key itself as the filename: {key}.txt
const outputPath = path.join(process.cwd(), 'public', `${key}.txt`);

if (!key) {
  console.log('IndexNow key sync skipped: INDEXNOW_KEY is not configured.');
  process.exit(0);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${key}\n`, 'utf8');
console.log(`✅ IndexNow key file written to ${outputPath}`);
console.log(`   Key: ${key}`);
console.log(`   URL: https://burchcontracting.com/${key}.txt`);
