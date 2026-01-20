@echo off
REM Automated script to sync queued subcontractors to VPS and import them (Windows version)

setlocal EnableDelayedExpansion

set VPS_HOST=root@72.60.166.68
set VPS_PATH=/root/burch-contracting-fresh
set LOCAL_QUEUE=tmp\subcontractor_applications.json

echo [32m=== Syncing queued subcontractors to VPS ===[0m
echo.

REM Check if queue file exists
if not exist "%LOCAL_QUEUE%" (
    echo [31mError: No queue file found at %LOCAL_QUEUE%[0m
    exit /b 1
)

REM Use Git Bash to run commands (adjust path if needed)
set GIT_BASH="C:\Program Files\Git\bin\bash.exe"
if not exist %GIT_BASH% (
    echo [31mError: Git Bash not found. Install Git for Windows or adjust the path.[0m
    exit /b 1
)

echo [36mUploading queue file to VPS...[0m
%GIT_BASH% -c "scp tmp/subcontractor_applications.json %VPS_HOST%:%VPS_PATH%/tmp/"
if errorlevel 1 (
    echo [31mFailed to upload queue file[0m
    exit /b 1
)

echo [36mUploading import script to VPS...[0m
%GIT_BASH% -c "scp scripts/import_queued_subcontractors.js %VPS_HOST%:%VPS_PATH%/scripts/"
if errorlevel 1 (
    echo [31mFailed to upload import script[0m
    exit /b 1
)

echo [36mRunning import on VPS...[0m
%GIT_BASH% -c "ssh %VPS_HOST% 'cd %VPS_PATH% && node scripts/import_queued_subcontractors.js'"
if errorlevel 1 (
    echo [31mImport script failed on VPS[0m
    exit /b 1
)

echo [36mDownloading updated queue file...[0m
%GIT_BASH% -c "scp %VPS_HOST%:%VPS_PATH%/tmp/subcontractor_applications.json tmp/"

echo.
echo [32mImport complete! Check your admin panel at /admin/subcontractors[0m
echo.

pause
