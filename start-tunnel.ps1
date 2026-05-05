# Start SSH Tunnel for Database Access
# This creates a tunnel so localhost:3307 -> srv1204.hstgr.io:3306 through VPS

Write-Host "Starting SSH tunnel for database access..." -ForegroundColor Green
Write-Host "Local port 3307 -> srv1204.hstgr.io:3306 via 72.60.166.68" -ForegroundColor Cyan
Write-Host ""
Write-Host "After tunnel is established:" -ForegroundColor Yellow
Write-Host "1. Copy .env.local.tunnel to .env.local" -ForegroundColor Yellow
Write-Host "2. Run: npm run dev" -ForegroundColor Yellow
Write-Host "3. Press Ctrl+C here to close tunnel when done" -ForegroundColor Yellow
Write-Host ""

ssh -L 3307:srv1204.hstgr.io:3306 root@72.60.166.68 -N
