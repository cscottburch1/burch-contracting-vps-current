# Warnings and Residual Risks

## Cleanup Constraints / Decisions
1. `tmp/` was not removed.
- Reason: active runtime API queue fallback reads/writes files in `tmp`.
- Risk if deleted: lead/subcontractor queue fallback behavior can break.
- Note: one disposable file (`tmp/next-start-log.txt`) remained because it was process-locked during cleanup.

2. `archive/` path now exists.
- Purpose: preserve non-runtime historical artifacts and support reversible cleanup.
- Guardrail: `archive/**` is excluded from TypeScript compilation.

3. Root deployment docs were intentionally retained.
- `HOSTINGER_DEPLOY.md` remains at root per cleanup requirements.

3. `.next/` and `node_modules/` remain in workspace.
- Reason: local build artifacts/dependencies present in working directory.
- Recommendation: do not commit these; ensure `.gitignore` remains effective.

## Items Intentionally Skipped
1. Runtime logic rewrites outside cleanup scope.
- Per requirement, production CRM/DB behavior was not re-architected.

2. Global vulnerability remediation.
- `npm install` reported vulnerabilities in dependency tree.
- Not auto-fixed during this cleanup to avoid behavior drift.

## Potential Follow-up Checks
1. Confirm VPS serves this cleaned root app path after deploy.
2. Re-run smoke checks against production to verify route parity.
3. Optionally prune old backup artifacts in `tmp/backups*` if operationally unnecessary.
