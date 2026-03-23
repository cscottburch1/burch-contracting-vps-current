param(
  [Parameter(Mandatory = $true)][string]$VpsHost,
  [string]$VpsUser = "root",
  [string]$AppDir = "/var/www/upstate-home-services",
  [string]$Branch = "main"
)

$remote = "$VpsUser@$VpsHost"
$remoteCmd = "APP_DIR='$AppDir' BRANCH='$Branch' bash '$AppDir/scripts/deploy/deploy-vps.sh'"

Write-Host "Deploying $Branch to $remote" -ForegroundColor Cyan
ssh $remote $remoteCmd
if ($LASTEXITCODE -ne 0) {
  throw "Remote deploy failed with exit code $LASTEXITCODE"
}

Write-Host "Deploy successful: https://upstatehomeservices.pro" -ForegroundColor Green
