# BURCH CONTRACTING PRODUCTION DEPLOYMENT
## 9-Phase Safe Deployment Strategy

**Project**: Burch Contracting CRM  
**Domain**: burchcontracting.com (Hostinger VPS 72.60.166.68)  
**Date**: March 27, 2026  
**Deployment Engineer**: GitHub Copilot  
**Methodology**: Non-destructive, discovery-driven, validation-at-each-phase  

---

## OVERVIEW: YOUR 9-PHASE DEPLOYMENT PATH

```
PHASE 1: SERVER DISCOVERY
  ↓ (Generate VPS_DISCOVERY_REPORT.md)
PHASE 2: PRE-DEPLOY SAFETY SNAPSHOT  
  ↓ (Generate PRE_DEPLOY_SNAPSHOT.md)
PHASE 3: ENVIRONMENT VALIDATION
  ↓ (Generate ENV_VALIDATION_REPORT.md)
PHASE 4: NGINX & UPLOAD READINESS
  ↓ (Generate NGINX_UPLOAD_REPORT.md)
PHASE 5: SAFE DEPLOYMENT
  ↓ (Generate DEPLOY_EXECUTION_REPORT.md)
PHASE 6: POST-DEPLOY VERIFICATION
  ↓ (Generate POST_DEPLOY_VERIFICATION.md)
PHASE 7: LOG & ERROR REVIEW
  ↓ (Generate PRODUCTION_LOG_REVIEW.md)
PHASE 8: ROLLBACK READINESS
  ↓ (Generate ROLLBACK_RUNBOOK.md)
PHASE 9: FINAL HANDOFF
  ↓ (Generate FINAL_PRODUCTION_STATUS.md)
  
DEPLOYMENT COMPLETE ✓
```

---

## CURRENT STATUS: PHASE 1 READY

You have been provided: **DEPLOYMENT_PHASE1_SERVER_DISCOVERY.md**

This is a **read-only discovery script** that inspects your VPS without making any changes.

---

## WHAT TO DO NOW

### Step 1: Connect to VPS
```bash
ssh root@72.60.166.68
# Password: [You have this]
```

### Step 2: Run Phase 1 Discovery
Follow the runbook in **DEPLOYMENT_PHASE1_SERVER_DISCOVERY.md** exactly.

### Step 3: Capture Output
Once the discovery script completes, you will have terminal output showing:
- ✓ Current git repository location
- ✓ Node version
- ✓ Process manager (pm2, systemd, etc)
- ✓ App process name and PID
- ✓ Nginx configuration
- ✓ Environment file locations
- ✓ Uploads directory path and permissions
- ✓ Database client availability
- ✓ Disk space

### Step 4: Return Output
Paste **ALL** terminal output into a file or text, and share back with me. I need:
- Exact paths (not assumptions)
- Exact process names
- Exact usernames
- Exact nginx upstream targets

---

## CRITICAL RULES (ENFORCED)

1. **NO GUESSING**: Every path, service name, and env var will be discovered, not assumed
2. **NO DESTRUCTIVE CHANGES WITHOUT SNAPSHOT**: Phase 2 captures current state before any modification
3. **NO SECRETS IN LOGS**: Environment variables are checked, not printed
4. **REVERSIBLE ONLY**: Every change has a rollback step documented in advance
5. **VALIDATION AFTER EVERY CRITICAL STEP**: Build, restart, health check, etc.
6. **SMALL CHANGES**: Deploy in minimal, testable increments
7. **STOP ON ISSUES**: If a step fails, we document and either fix or rollback

---

## WHAT WILL BE DEPLOYED

From your repository root (`c:\Users\cscot\burch-contracting-fresh`):

- ✓ All source code in `src/`
- ✓ All cleaned admin routes (legacy migrations hidden, CRM archived)
- ✓ All API endpoints (50+)
- ✓ TypeScript strict mode (0 errors verified locally)
- ✓ Production build (220 pages, 59s, passing)
- ✓ Database migrations (safe, non-destructive)
- ✓ Email/SMS templates
- ✓ Environment configuration (from server .env files)

### What WON'T change:
- ✗ Production database (read-only schema checks)
- ✗ Uploads directory (preserved, symlinked if needed)
- ✗ Nginx config (only validated, not rewritten)
- ✗ Session data or logs
- ✗ Any business data or customer records

---

## WHAT WILL BE VERIFIED

### Basic Infrastructure
- [ ] SSH access working
- [ ] Node.js version compatible
- [ ] npm version compatible
- [ ] Git repository found
- [ ] Process manager detected
- [ ] Nginx running and configured

### Application Environment
- [ ] All required env vars present
- [ ] Database reachable from server
- [ ] SMTP configured (if enabled)
- [ ] Disk space sufficient (> 5GB)
- [ ] Uploads directory writable

### Deployment & Operations
- [ ] Code pulls successfully
- [ ] Dependencies install without error
- [ ] TypeScript compilation: 0 errors
- [ ] Production build completes
- [ ] App process starts successfully
- [ ] Health endpoint returns 200 OK

### Functionality
- [ ] Homepage loads
- [ ] Admin login page loads
- [ ] Admin dashboard accessible
- [ ] CRM page loads without hanging
- [ ] Contact form accessible
- [ ] No 500 errors in logs
- [ ] Attachment upload/download path is writable

### Security & Reversibility
- [ ] Nginx points to correct app
- [ ] Previous version archived
- [ ] Rollback steps documented
- [ ] Git history preserved
- [ ] No destructive changes made

---

## TIMELINE & ESTIMATES

| Phase | Task | Duration | Manual/Auto |
|-------|------|----------|-------------|
| 1 | Server Discovery | 5-10 min | Manual (discovery script run by you) |
| 2 | Pre-deploy Snapshot | 5-10 min | Manual (snapshot script run by you) |
| 3 | Env Validation | 5 min | Manual (check output) |
| 4 | Nginx & Uploads | 5-10 min | Manual (config review + fixes) |
| 5 | Safe Deployment | 10-15 min | Manual (git pull, npm install, build, restart) |
| 6 | Post-deploy Verification | 10-15 min | Manual (smoke tests) |
| 7 | Log Review | 5 min | Manual (log inspection) |
| 8 | Rollback Docs | 5 min | Auto (generated based on Phase 1 findings) |
| 9 | Final Handoff | 5 min | Auto (status report generation) |
| **TOTAL** | | **60-75 min** | Mix of manual discovery + scripted ops |

---

## SUCCESS CRITERIA (DEPLOYMENT COMPLETE WHEN)

✅ App deployed from correct repository root  
✅ Build succeeds on server without errors  
✅ App process restarts and stays running  
✅ `GET /api/health` returns 200 OK  
✅ Homepage loads (public routes working)  
✅ Admin login page loads (auth working)  
✅ CRM loads without hanging (data flow working)  
✅ No critical errors in app logs  
✅ Nginx confirmed pointing to app  
✅ Uploads directory writable (file operations working)  
✅ Rollback documented and tested conceptually  
✅ Final status report shows "READY AND VERIFIED"  

---

## CONTINGENCY: WHAT IF SOMETHING GOES WRONG?

We will have both:
- **Rollback steps** (documented in PHASE 8, executable in < 15 minutes)
- **Recovery procedures** (exact commands, not guesses)
- **Previous version archived** (safe restore point on server)
- **Git history preserved** (atomic rollback via git revert available)

Example rollback (will be customized based on what we find):
```bash
# On VPS
cd /home/burch/app  # (exact path discovered in PHASE 1)
git revert --no-edit <current-commit>
npm run build
pm2 restart app  # (exact process name from PHASE 1)
```

---

## QUESTIONS BEFORE WE START?

Before you run Phase 1, clarify:

1. **Ready to SSH to 72.60.166.68 now?** (Yes/No)
2. **Any known deployment paths or process names?** (Will be discovered if not)
3. **Any known issues with the current VPS setup?** (Database slow? Nginx not responding?)
4. **Is this a fresh VPS or has this app been deployed before?** (Will detect in Phase 1)
5. **Maintenance window approved?** (We'll execute during off-hours if needed)

---

## YOUR NEXT ACTION

✅ **Execute DEPLOYMENT_PHASE1_SERVER_DISCOVERY.md on your VPS**

⏱️ **Time to execute**: 5-10 minutes  
🎯 **Expected output**: VPS_DISCOVERY_OUTPUT.txt file with full terminal output  
📋 **Success criteria**: See all system info without errors  

---

## AFTER PHASE 1 COMPLETE

Return the output file, and I will:
1. Analyze the actual VPS setup
2. Generate **VPS_DISCOVERY_REPORT.md** with findings
3. Create customized **Phase 2-9 runbooks** based on what we found
4. Guide you through each phase sequentially

---

**STATUS**: 🟡 AWAITING PHASE 1 EXECUTION  
**RISK LEVEL**: 🟢 LOW (Read-only discovery, no changes yet)  
**DEPLOYMENT ENGINEER**: Ready to proceed once Phase 1 output received  

---

## FILES PROVIDED

- ✅ [FINAL_DEPLOYMENT_REPORT.md](FINAL_DEPLOYMENT_REPORT.md) — Executive summary of admin cleanup
- ✅ [DEPLOYMENT_PHASE1_SERVER_DISCOVERY.md](DEPLOYMENT_PHASE1_SERVER_DISCOVERY.md) — Phase 1 runbook (execute this first)
- ✅ [BURCH_PRODUCTION_DEPLOYMENT_STRATEGY.md](BURCH_PRODUCTION_DEPLOYMENT_STRATEGY.md) — This file (your roadmap)

---

**Ready? Execute Phase 1 now. Report back when complete.**
