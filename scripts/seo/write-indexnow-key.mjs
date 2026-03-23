import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config({ path: '.env.production' });
dotenv.config({ path: '.env.local' });
dotenv.config();

const key = (process.env.INDEXNOW_KEY || '').trim();
const outputPath = path.join(process.cwd(), 'public', 'indexnow-key.txt');

if (!key) {
  console.log('IndexNow key sync skipped: INDEXNOW_KEY is not configured.');
  process.exit(0);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${key}\n`, 'utf8');
console.log(`IndexNow key file written to ${outputPath}`);
