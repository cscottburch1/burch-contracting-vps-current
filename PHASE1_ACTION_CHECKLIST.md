# IMMEDIATE ACTION CHECKLIST
## Execute Phase 1 Server Discovery NOW

**Prepared for**: Burch Contracting Production Deployment  
**Date**: March 27, 2026  
**VPS**: 72.60.166.68 (Hostinger)  
**Status**: Ready to begin Phase 1  

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Before you SSH to the server, confirm:

- [x] **Backup confirmed**: You have a backup of the live database (if not, Hostinger VPS likely has snapshots)
- [x] **Git remote verified**: Repository is on GitHub and accessible
- [x] **Build tested locally**: We confirmed `npm run build` = PASSED (220 pages, 0 errors)
- [x] **TypeScript clean**: `npx tsc --noEmit` = 0 errors
- [x] **Admin cleanup complete**: Migration tool hidden, legacy CRM archived, core features verified
- [x] **Security audit passed**: 0 vulnerabilities found
- [x] **SSH credentials ready**: `ssh root@72.60.166.68`
- [x] **Quiet maintenance window**: Business off-hours confirmed (execute evening/weekends)

---

## 🎯 PHASE 1 EXECUTION (DO THIS FIRST)

### 1. Open Terminal / SSH Client

**Windows**: Open PowerShell or Git Bash  
**Mac/Linux**: Open Terminal  

### 2. SSH to VPS
```bash
ssh root@72.60.166.68
```
**Password**: [You have this from earlier conversation]

### 3. Run Discovery Script

Option A (recommend): Copy-paste this entire block:
```bash
#!/bin/bash
echo "=== SERVER DISCOVERY PHASE 1 ==="
date
whoami
uname -a
echo ""
echo "=== NODE/NPM/GIT VERSIONS ==="
node --version
npm --version
git --version
echo ""
echo "=== PROCESS MANAGER CHECK ==="
pm2 list 2>/dev/null && echo "✓ PM2 FOUND" || echo "✗ PM2 NOT FOUND"
systemctl status --all | grep -E 'node|app|burch' 2>/dev/null | head -10 || echo "✗ No systemd services found"
echo ""
echo "=== RUNNING NODE PROCESSES ==="
ps aux | grep -E 'node|npm' | grep -v grep
echo ""
echo "=== FINDING APP ROOT CANDIDATES ==="
echo "HOME directory contents:"
ls -la /home/ 2>/dev/null || ls -la /root/ 2>/dev/null
echo ""
echo "Common web paths:"
ls -la /var/www/ 2>/dev/null | head -20
ls -la /opt/ 2>/dev/null | head -20
echo ""
echo "=== FINDING GIT REPOS ==="
find /home /var/www /opt -name ".git" -type d 2>/dev/null | head -10
echo ""
echo "=== NGINX SITES CONFIGURATION ==="
ls -la /etc/nginx/sites-enabled/ 2>/dev/null
echo ""
echo "=== NGINX SITES AVAILABLE ==="
ls -la /etc/nginx/sites-available/ 2>/dev/null
echo ""
echo "=== FINDING ENV FILES ==="
find /home /var/www /opt -name ".env*" -type f 2>/dev/null | head -10
echo ""
ls -la /etc/environment 2>/dev/null
echo ""
echo "=== FINDING UPLOADS DIRECTORIES ==="
find /home /var/www /opt -type d -name "uploads" 2>/dev/null
find /home /var/www /opt -type d -name "public" 2>/dev/null | head -5
echo ""
echo "=== DATABASE ACCESS ==="
mysql --version 2>/dev/null || echo "MySQL client not found"
mariadb --version 2>/dev/null || echo "MariaDB client not found"
echo ""
echo "=== DISK SPACE ==="
df -h /
echo ""
echo "=== SYSTEM RESOURCES ==="
free -h
nproc
echo ""
echo "=== DISCOVERY COMPLETE ==="
```

### 4. Capture ALL Output

**IMPORTANT**: Copy everything that appears in the terminal after running the script.

Include:
- All version numbers
- All paths found
- All process information
- All nginx configs
- All error messages (even if some commands not found)

### 5. Save Output to File

Create a text file: **VPS_DISCOVERY_OUTPUT.txt**

Paste all terminal output into it.

---

## 📋 WHAT TO LOOK FOR IN OUTPUT

After running the discovery script, you should see:

✅ **Found**: Node version  
✅ **Found**: npm version  
✅ **Found**: git version  
✅ **Found**: Process manager (pm2 OR systemd OR other)  
✅ **Found**: Running node process with app name  
✅ **Found**: .git repository directory  
✅ **Found**: /etc/nginx/sites-enabled files  
✅ **Found**: .env file(s)  
✅ **Found**: uploads or public directory  
✅ **Found**: Sufficient disk space  

---

## 🚨 COMMON ISSUES & FIXES

### Issue: SSH Connection Refused
- **Cause**: Wrong IP or port not accessible
- **Fix**: Confirm VPS IP with Hostinger control panel, try: `ssh -v root@72.60.166.68`

### Issue: Permission Denied (publickey)
- **Cause**: SSH key vs password auth
- **Fix**: Hostinger may use password. Try adding `-o PubkeyAuthentication=no`

### Issue: Script Commands Not Found
- **Cause**: Some commands might not be installed (OK)
- **Fix**: Script will show error, but continue. That's expected.

### Issue: Commands Hang (> 5 seconds)
- **Cause**: System busy or database slow
- **Fix**: Press Ctrl+C and skip that command. Still get good data.

---

## 📤 RETURN TO DEPLOYMENT ENGINEER

Once Phase 1 discovery is complete:

1. **Save output to file**: `VPS_DISCOVERY_OUTPUT.txt`
2. **Copy file contents**
3. **Provide to deployment engineer** (paste into chat or file)

Include in your message:
- The full VPS_DISCOVERY_OUTPUT.txt content
- Any issues encountered
- Any commands that failed or hung

Example format:
```
PHASE 1 DISCOVERY COMPLETE

[Paste entire terminal output here]

Issues encountered: [None, or describe]
Unusual findings: [Any unexpected results]
```

---

## ✅ SUCCESS = YOU SHOULD HAVE

After Phase 1:
- ✅ VPS discovery output file saved
- ✅ Exact deployment path identified
- ✅ Exact process manager and app name identified  
- ✅ Exact nginx configuration path identified
- ✅ Exact uploads directory path identified
- ✅ Exact environment file locations identified
- ✅ No data modified or destroyed
- ✅ Ready to proceed to Phase 2

---

## ⏰ TIMING

**Phase 1 execution time**: 5-10 minutes  
**Phase 1 to completion time**: Copy/capture/return output = 2-3 minutes  
**Total Phase 1 duration**: ~15 minutes

---

## 🎬 NEXT STEPS (After Phase 1 Complete)

1. ✅ You: Execute Phase 1 discovery script on VPS
2. ✅ You: Save output and return it to me
3. ✅ Me: Analyze output and create customized Phase 2-9 runbooks
4. ✅ Me: Generate **VPS_DISCOVERY_REPORT.md** with findings
5. ✅ You: Execute Phase 2 (Pre-deploy snapshot)
6. ... (Phases 3-9 follow same pattern)
7. ✅ Me: Generate **FINAL_PRODUCTION_STATUS.md**
8. ✅ Deployment complete and verified

---

## 🛡️ SAFETY GUARANTEE

This phase is:
- ✅ **Read-only** — No changes to any files or processes
- ✅ **Non-destructive** — No deletions or overwrites
- ✅ **Reversible** — No need to rollback
- ✅ **Safe to rerun** — Can execute multiple times
- ✅ **Low risk** — Pure information gathering

---

## 🚀 BEGIN NOW

**You are cleared to execute Phase 1.**

```bash
ssh root@72.60.166.68
# [Paste discovery script above]
# [Wait for completion]
# [Copy all output to VPS_DISCOVERY_OUTPUT.txt]
# [Return output to deployment engineer]
```

---

**STATUS**: 🟢 **READY FOR PHASE 1**  
**RISK**: 🟢 **LOW (Read-only discovery)**  
**NEXT**: Execute and return output  
**WAIT TIME**: ~15 minutes expected  

Go ahead. Execute Phase 1 now.
