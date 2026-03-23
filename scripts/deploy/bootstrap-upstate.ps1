param(
  [Parameter(Mandatory = $true)][string]$VpsHost,
  [string]$VpsUser = "root",
  [string]$Domain = "upstatehomeservices.pro",
  [string]$RepoUrl = "https://github.com/cscottburch1/upstate-home-services.git",
  [string]$Branch = "main",
  [string]$AdminEmail = "",
  [switch]$SkipSsl
)

$scriptPath = Join-Path $PSScriptRoot "bootstrap-vps.sh"
if (!(Test-Path $scriptPath)) {
  throw "bootstrap-vps.sh not found at $scriptPath"
}

$remote = "$VpsUser@$VpsHost"
$enableSsl = if ($SkipSsl) { "false" } else { "true" }

Write-Host "Running first-time VPS bootstrap on $remote for $Domain" -ForegroundColor Cyan
Get-Content -Raw $scriptPath | ssh $remote "DOMAIN='$Domain' REPO_URL='$RepoUrl' BRANCH='$Branch' ADMIN_EMAIL='$AdminEmail' ENABLE_SSL='$enableSsl' bash -s --"

Write-Host "Bootstrap finished. Verify DNS and browse https://$Domain" -ForegroundColor Green
