# PHASE 1: SERVER DISCOVERY RUNBOOK
**Status**: Ready to execute  
**Run on**: Hostinger VPS (72.60.166.68) as root  
**Expected duration**: 5-10 minutes  
**Output required**: Copy ALL terminal output and return to deployment engineer

---

## OBJECTIVE
Inspect and document the current production environment WITHOUT CHANGING ANYTHING.

---

## RUNBOOK: Execute these commands in order

### STEP 1: Verify SSH Connection and Basic OS Info
```bash
#!/bin/bash
# Step 1: Basic OS and user info
echo "=== SERVER DISCOVERY PHASE 1 ==="
date
whoami
uname -a
echo ""

# Step 2: Node, npm, git versions
echo "=== NODE/NPM/GIT VERSIONS ==="
node --version
npm --version
git --version
echo ""

# Step 3: Process manager detection
echo "=== PROCESS MANAGER CHECK ==="
# Check for pm2
pm2 list 2>/dev/null && echo "✓ PM2 FOUND" || echo "✗ PM2 NOT FOUND"
# Check for systemctl
systemctl status --all | grep -E 'node|app|burch' 2>/dev/null | head -10 || echo "✗ No systemd services found"
# Check for running node processes
echo ""
echo "=== RUNNING NODE PROCESSES ==="
ps aux | grep -E 'node|npm' | grep -v grep
echo ""

# Step 4: Home directories and likely app paths
echo "=== FINDING APP ROOT CANDIDATES ==="
echo "HOME directory contents:"
ls -la /home/ 2>/dev/null || ls -la /root/ 2>/dev/null
echo ""
echo "Common web paths:"
ls -la /var/www/ 2>/dev/null | head -20
ls -la /opt/ 2>/dev/null | head -20
echo ""

# Step 5: Git repositories
echo "=== FINDING GIT REPOS ==="
find /home /var/www /opt -name ".git" -type d 2>/dev/null | head -10
echo ""

# Step 6: Nginx config
echo "=== NGINX SITES CONFIGURATION ==="
ls -la /etc/nginx/sites-enabled/ 2>/dev/null
echo ""
echo "=== NGINX SITES AVAILABLE ==="
ls -la /etc/nginx/sites-available/ 2>/dev/null
echo ""

# Step 7: Environment files
echo "=== FINDING ENV FILES ==="
find /home /var/www /opt -name ".env*" -type f 2>/dev/null | head -10
echo ""
ls -la /etc/environment 2>/dev/null
echo ""

# Step 8: Uploads directory
echo "=== FINDING UPLOADS DIRECTORIES ==="
find /home /var/www /opt -type d -name "uploads" 2>/dev/null
find /home /var/www /opt -type d -name "public" 2>/dev/null | head -5
echo ""

# Step 9: Database connectivity
echo "=== DATABASE ACCESS ==="
mysql --version 2>/dev/null || echo "MySQL client not found"
mariadb --version 2>/dev/null || echo "MariaDB client not found"
echo ""

# Step 10: Disk space
echo "=== DISK SPACE ==="
df -h /
echo ""

# Step 11: Memory and CPU
echo "=== SYSTEM RESOURCES ==="
free -h
nproc
echo ""
```

---

## HOW TO EXECUTE

### Option A: Copy-paste into VPS terminal (one command at a time)
```
ssh root@72.60.166.68
# Enter password when prompted
```

Then copy and paste each section of the script above.

### Option B: Create a script file and run it
```bash
# On your local machine:
cat > discovery.sh << 'EOF'
[PASTE THE ENTIRE SCRIPT ABOVE HERE]
EOF

# SCP it to the VPS
scp discovery.sh root@72.60.166.68:/tmp/

# SSH to VPS and run it
ssh root@72.60.166.68
chmod +x /tmp/discovery.sh
/tmp/discovery.sh > /tmp/discovery_output.txt 2>&1
cat /tmp/discovery_output.txt
```

---

## SUCCESS CRITERIA
All commands execute without hanging.  
You should see output for:
- ✓ Node version
- ✓ npm version
- ✓ Git version
- ✓ Process manager (pm2 or systemd)
- ✓ Running node processes
- ✓ Git repository location
- ✓ Nginx sites enabled
- ✓ .env files
- ✓ Uploads path
- ✓ Disk space > 5GB free

---

## NEXT STEP
Once you have the output:
1. Copy ALL terminal output
2. Create a file `VPS_DISCOVERY_OUTPUT.txt` with the content
3. Share it back with me
4. I will analyze and move to PHASE 2

---

## SAFETY NOTES
- This runbook ONLY reads and inspects
- No changes made
- No files modified
- Safe to run at any time
- If a command hangs more than 5 seconds, Ctrl+C and skip it

**Do NOT proceed to Phase 2 until Phase 1 output is verified by deployment engineer.**
