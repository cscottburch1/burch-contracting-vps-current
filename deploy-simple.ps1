# Deploy to Hostinger VPS
$VPS = "root@72.60.166.68"
Write-Host "Deploying to production..." -ForegroundColor Green
$script = @"
set -e
cd /root/burch-contracting
git fetch origin main
git checkout main
git pull origin main
npm ci
npm run build
pm2 restart burch-contracting --update-env
sleep 5
npm run verify:production -- --base-url=https://burchcontracting.com
pm2 status burch-contracting
"@
$script | ssh $VPS
Write-Host "Done! Visit https://burchcontracting.com/api/health" -ForegroundColor Cyan
