# Deploy Execution Report

Date: 2026-03-27

## Target
- Deploy path: /root/burch-contracting
- Branch: main
- Process manager: PM2
- Process: burch-contracting

## Pre-Deploy Commit
- 1da7b919ba3bd31e48d932bd8e3867172fcd89e8

## Deployment Steps Executed
1. Created deployment log directory:
   - /root/deploy-logs/20260327-172353
2. Captured pre-commit and status logs.
3. Stashed tracked modified file:
   - tmp/subcontractor_applications.json
   - Stash label: predeploy-20260327-172353
4. git fetch origin
5. git pull --ff-only origin main
6. npm install --no-fund --no-audit
7. npx tsc --noEmit
8. npm run build
9. pm2 restart burch-contracting
10. pm2 status burch-contracting

## Pull Result
- Remote main: 41bba7333aa44c7996a8b7ae31a1250010cdfed5
- Post-pull commit: 41bba7333aa44c7996a8b7ae31a1250010cdfed5
- Update type: fast-forward
- Scope: 67 files changed

## Build Result
- Result: PASS
- Next.js: 15.5.13
- Build time: ~70s
- Generated static pages: 221

## Restart Result
- PM2 restart: PASS
- Process status: online

## Local Health Check During Restart Window
- Immediate probe right after restart initially failed once (startup race).
- Follow-up delayed probe passed (documented in post-deploy verification).

## Deployment Outcome
- Deploy completed successfully.
- App serving latest main commit.
