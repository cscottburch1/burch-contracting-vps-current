# Deploy to Hostinger VPS
$VPS = "root@156.67.71.222"
Write-Host "Deploying to production..." -ForegroundColor Green
$script = @"
cd /var/www/burchcontracting-fresh && git pull origin main && npm install && npm run build && pm2 restart all && pm2 list
"@
$script | ssh $VPS
Write-Host "Done! Visit https://burchcontracting.com/api/health" -ForegroundColor Cyan
