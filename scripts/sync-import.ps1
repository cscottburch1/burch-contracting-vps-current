# PowerShell script to sync and import queued subcontractors

$VPS = "root@72.60.166.68"
$VPS_PATH = "/root/burch-contracting-fresh"

Write-Host "=== Syncing queued subcontractors to VPS ===" -ForegroundColor Green
Write-Host ""

# Check if queue file exists
if (-not (Test-Path "tmp\subcontractor_applications.json")) {
    Write-Host "Error: No queue file found" -ForegroundColor Red
    exit 1
}

# Count entries
$queueData = Get-Content "tmp\subcontractor_applications.json" | ConvertFrom-Json
$count = $queueData.Count
Write-Host "Found $count queued subcontractor(s)" -ForegroundColor Cyan

if ($count -eq 0) {
    Write-Host "Queue is empty" -ForegroundColor Yellow
    exit 0
}

Write-Host "Creating directories on VPS..." -ForegroundColor Cyan
ssh $VPS "mkdir -p $VPS_PATH/tmp $VPS_PATH/scripts"

Write-Host "Uploading queue file..." -ForegroundColor Cyan
scp tmp/subcontractor_applications.json "${VPS}:${VPS_PATH}/tmp/"

Write-Host "Uploading import script..." -ForegroundColor Cyan
scp scripts/import_queued_subcontractors.js "${VPS}:${VPS_PATH}/scripts/"

Write-Host "Running import on VPS..." -ForegroundColor Cyan
ssh $VPS "cd $VPS_PATH && MYSQL_HOST=srv1204.hstgr.io MYSQL_PORT=3306 MYSQL_USER=u239178742_cscottburch MYSQL_PASSWORD='Breana3397@@' MYSQL_DATABASE=u239178742_burch_contract node scripts/import_queued_subcontractors.js"

Write-Host "Downloading updated queue..." -ForegroundColor Cyan
scp "${VPS}:${VPS_PATH}/tmp/subcontractor_applications.json" tmp/

$newQueueData = Get-Content "tmp\subcontractor_applications.json" | ConvertFrom-Json
$newCount = $newQueueData.Count
$imported = $count - $newCount

Write-Host ""
Write-Host "Import complete!" -ForegroundColor Green
Write-Host "  Imported: $imported" -ForegroundColor Green
Write-Host "  Remaining: $newCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "Check admin panel: /admin/subcontractors" -ForegroundColor Cyan
