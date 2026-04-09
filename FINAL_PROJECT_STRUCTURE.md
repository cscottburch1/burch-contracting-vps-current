# Final Project Structure (Cleaned)

## Top Level
- .github/
- .next/
- .vscode/
- archive/
- database/
- docs/
- email-templates/
- migrations/
- node_modules/
- public/
- scripts/
- src/
- tmp/
- .env.local
- .env.production.example
- .env.production.temp
- .env.recaptcha.example
- .env.stripe.example
- .eslintrc.json
- .gitignore
- ARCHITECTURE.md
- CLEANUP_SUMMARY.md
- DEPLOYMENT_CHECKLIST.md
- FINAL_PROJECT_STRUCTURE.md
- HOSTINGER_DEPLOY.md
- REPO_STRUCTURE_AUDIT.md
- TMP_USAGE.md
- WARNINGS.md
- README.md
- package.json
- package-lock.json
- next.config.ts
- tsconfig.json

## src/
- app/
- components/
- config/
- hooks/
- lib/
- pages/
- types/

## src/app/ (App Router)
- admin/
- api/
- blog/
- calculator/
- contact/
- cost/
- crm/
- employment/
- locations/
- portal/
- projects/
- service-areas/
- services/
- sitemaps/
- subcontractors/
- tradesmen/
- uploads/

## docs/
- archive/ (previous root markdown docs preserved)

## Notes
- Exactly one active Next.js app root remains: `src/app` at repository root.
- Duplicate roots removed: `imported_repo/`, `burch-contracting/`.
