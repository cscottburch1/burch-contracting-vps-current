#!/bin/bash
# Run this on your production server (72.60.166.68) to verify/create the direct hire table

cd /root/burch-contracting

# Check if table exists
echo "Checking if direct_hire_applications table exists..."

mysql -h srv1204.hstgr.io \
  -u u239178742_cscottburch \
  -p'Breana3397@@' \
  u239178742_burch_contract \
  -e "SHOW TABLES LIKE 'direct_hire_applications';"

# If not exists, create it
echo -e "\nCreating table if it doesn't exist..."

mysql -h srv1204.hstgr.io \
  -u u239178742_cscottburch \
  -p'Breana3397@@' \
  u239178742_burch_contract < database/create-direct-hire-tables.sql

echo -e "\n✓ Table verification complete!"

# Show table structure
echo -e "\nTable structure:"
mysql -h srv1204.hstgr.io \
  -u u239178742_cscottburch \
  -p'Breana3397@@' \
  u239178742_burch_contract \
  -e "SHOW COLUMNS FROM direct_hire_applications;"

# Count applications
echo -e "\nTotal applications:"
mysql -h srv1204.hstgr.io \
  -u u239178742_cscottburch \
  -p'Breana3397@@' \
  u239178742_burch_contract \
  -e "SELECT COUNT(*) as total FROM direct_hire_applications;"
