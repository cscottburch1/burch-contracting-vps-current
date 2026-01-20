# PowerShell script to deploy to production VPS

$VPS = "root@72.60.166.68"
$VPS_PATH = "/root/burch-contracting-fresh"
$LOCAL_PATH = (Get-Location).Path

Write-Host "=== Deploying to Production VPS ===" -ForegroundColor Green
Write-Host ""

# Build the production version
Write-Host "Building production app..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build complete!" -ForegroundColor Green
Write-Host ""

# Create necessary directories on VPS
Write-Host "Creating directories on VPS..." -ForegroundColor Cyan
ssh $VPS "mkdir -p $VPS_PATH/.next $VPS_PATH/public $VPS_PATH/src"

# Upload the built files
Write-Host "Uploading .next build directory..." -ForegroundColor Cyan
ssh $VPS "rm -rf $VPS_PATH/.next/*"
scp -r .next/* "${VPS}:${VPS_PATH}/.next/"

Write-Host "Uploading source files..." -ForegroundColor Cyan
scp -r src/* "${VPS}:${VPS_PATH}/src/"

Write-Host "Uploading public assets..." -ForegroundColor Cyan
scp -r public/* "${VPS}:${VPS_PATH}/public/"

Write-Host "Uploading config files..." -ForegroundColor Cyan
scp package.json "${VPS}:${VPS_PATH}/"
scp next.config.ts "${VPS}:${VPS_PATH}/"
scp tsconfig.json "${VPS}:${VPS_PATH}/"

# Install dependencies on VPS (in case package.json changed)
Write-Host "Installing dependencies on VPS..." -ForegroundColor Cyan
ssh $VPS "cd $VPS_PATH && npm install --production"

# Restart the application
Write-Host "Restarting application..." -ForegroundColor Cyan
ssh $VPS "cd $VPS_PATH && pm2 restart burch-contracting || pm2 start npm --name burch-contracting -- start"

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Site: https://burchcontracting.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "To check logs: ssh $VPS 'pm2 logs burch-contracting'" -ForegroundColor Yellow
Write-Host "To check status: ssh $VPS 'pm2 status'" -ForegroundColor Yellow
