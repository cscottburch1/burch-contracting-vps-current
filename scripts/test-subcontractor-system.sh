#!/bin/bash

echo "=== SUBCONTRACTOR SYSTEM TEST ==="
echo ""

echo "1. Database Check - Subcontractors Table:"
echo 'SELECT COUNT(*) as count FROM subcontractors;' | mysql -u burch_user -pb0i0Z-owELo3TS_Hgm=_eRxgMQD4 burch_contracting 2>&1 | grep -v Warning
echo ""

echo "2. Subcontractor Details:"
echo 'SELECT id, company_name, email, status, pin FROM subcontractors;' | mysql -u burch_user -pb0i0Z-owELo3TS_Hgm=_eRxgMQD4 burch_contracting 2>&1 | grep -v Warning
echo ""

echo "3. Checking if API route file exists:"
ls -lah /root/burch-contracting-fresh/src/app/api/admin/subcontractors/route.ts
echo ""

echo "4. Testing API endpoint (requires admin auth cookie):"
echo "You need to test this from browser logged in as admin:"
echo "curl https://burchcontracting.com/api/admin/subcontractors"
echo ""

echo "5. Checking recent app logs for errors:"
pm2 logs burch-contracting --lines 20 --nostream --err 2>&1 | tail -10
echo ""

echo "=== TEST COMPLETE ==="
