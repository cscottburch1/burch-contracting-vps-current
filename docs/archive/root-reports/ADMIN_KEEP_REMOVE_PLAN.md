# Admin Keep / Remove Plan

**Phase 2 Output**: Strategic classification of admin features  
**Purpose**: Define which features to KEEP, REMOVE, HIDE, or ARCHIVE  
**Scope**: Based on ADMIN_ROUTE_AUDIT.md findings

---

## Overview

After comprehensive audit (ADMIN_ROUTE_AUDIT.md), the admin area is **largely clean** with no broken core features. Strategic improvements focus on:

1. **Clarity**: Hide legacy/one-time-use tools from main navigation
2. **Focus**: Ensure admin sidebar shows only active operational tools
3. **Documentation**: Archive obsolete utilities for historical reference

---

## TIER 1: CORE WORKFLOW (KEEP - MUST HAVE)

These features are essential to daily business operations. **Visible in primary AdminNav**.

### Primary Workflow Chain
- ✅ `/admin/dashboard` — Operation control center
- ✅ `/admin/customers` — Customer portal user management
- ✅ `/admin/projects` — Project tracking and job management
- ✅ `/admin/crm` — Lead pipeline and follow-up tracking

### Sales & Fulfillment
- ✅ `/admin/proposals` — Estimate creation and tracking
- ✅ `/admin/invoices` — Billing and payment tracking
- ✅ `/admin/projects` [detail] — Job details, milestones, photos

### Team & Operations
- ✅ `/admin/messages` — Customer communication
- ✅ `/admin/subcontractors` — Crew and subcontractor management
- ✅ `/admin/tools` — Central tools hub

**Action**: **KEEP ALL** — Core navigation, all links working, no changes needed

---

## TIER 2: OPERATIONAL TOOLS (KEEP - NICE TO HAVE)

These features support specific operations. **Visible in AdminNav and accessible via Tools Hub**.

### Additional Management
- ✅ `/admin/calendar` — Event and milestone scheduling
- ✅ `/admin/tradesmen` — Field crew assignments
- ✅ `/admin/employees` — Direct hire applications (owner-only)
- ✅ `/admin/settings` — Admin user and system settings (owner-only)

### Tools Subsections
- ✅ `/admin/tools/notifications` — Email/SMS template management
- ✅ `/admin/tools/services` — Website service visibility control
- ✅ `/admin/tools/banners` — Homepage promotional banners
- ✅ `/admin/tools/projects` — Featured projects showcase curation

**Action**: **KEEP ALL** — Working features, properly categorized

---

## TIER 3: LEGACY / MAINTENANCE UTILITIES (HIDE OR ARCHIVE)

These features are one-time or legacy utilities **NOT part of regular workflow**.

### 3.1 Data Migrations (`/admin/migrate`)

**Current Status**: 
- ✅ Technically working
- ✅ Owner-only access enforced
- ⚠️ Not part of active workflow (one-time setup)
- ⚠️ Should not be easily accessible to support staff

**Current Visibility**: 
- Listed in `/admin/tools/page.tsx` under "System Utilities"
- Contains 15+ migration endpoints for legacy data import

**Recommendations**:

**Option A (Recommended): HIDE from Tools Hub**
1. Remove `migrate` tool item from TOOL_ITEMS array in `/admin/tools/page.tsx`
2. Add notice to Tools page: "Migration utilities archived. Contact owner if needed."
3. Keep the page and API routes intact (may be needed for recovery)
4. Creates clear separation between operations and maintenance

**Option B (Alternative): ADD CLEAR WARNING**
1. Keep tools link visible
2. Add prominent warning badge: "⚠️ Maintenance Only"
3. Add disclaimer: "Data migrations are one-time utilities. Use only for system setup/recovery."
4. Requires no code changes beyond UI update

**Recommended Action**: **OPTION A — HIDE migration link**
- Cleaner admin interface
- Reduces confusion for support staff
- Owner can still directly access `/admin/migrate` if needed
- Maintain all API routes for recovery

---

### 3.2 Duplicate CRM UI (`/crm/` pages)

**Current Status**:
- ✅ Technically working (same auth as `/admin/crm`)
- ✅ Functionally equivalent to `/admin/crm`
- ⚠️ Legacy/redundant UI
- ⚠️ **NOT linked in AdminNav** (already hidden ✅)

**Current Visibility**:
- No navigation link in sidebar
- Not mentioned in admin tools
- Direct URL access only (`/crm/page.tsx`)

**Analysis**:
- `/admin/crm` is newer, better error handling, more features
- `/crm` appears to be from earlier repo iteration
- Both use same API endpoints and auth
- Keeping both causes maintenance confusion

**Recommendations**:

**Option A (Aggressive): REMOVE**
1. Delete `/src/app/crm/` folder entirely
2. Verify no code imports from this path (already excluded in tsconfig)
3. Breaks direct URL access to `/crm/*` (low risk, not in nav)
4. Cleaner repo

**Option B (Conservative): ARCHIVE WITH DEPRECATION**
1. Move `/src/app/crm/` to `/archive/crm/` or `/docs/archive/crm/`
2. Add archival notice in WARNINGS.md
3. Preserves history if needed for debugging
4. No direct URL access, but available in git history

**Recommended Action**: **OPTION B — ARCHIVE FOR NOW**
- Low risk (already hidden)
- Preserves audit trail
- Can be removed entirely in future if no one accesses
- Less disruptive than deletion

---

## TIER 4: POTENTIALLY PROBLEMATIC FEATURES (VERIFY)

After audit, **no problematic features were found**. All pages have:
- ✅ Auth protection
- ✅ Corresponding API endpoints
- ✅ Database support
- ✅ Error handling
- ✅ Working UI

---

## ACTION PLAN SUMMARY

| Feature | Current State | Recommended Action | Effort | Risk | Priority |
|---------|---------------|-------------------|--------|------|----------|
| Core CRM/Projects/Customers/Invoices | KEEP | No change | 0 | None | — |
| Tools & Messages | KEEP | No change | 0 | None | — |
| Calendar & Tradesmen | KEEP | No change | 0 | None | — |
| Settings & Employees | KEEP | No change | 0 | None | — |
| Notifications/Services/Banners | KEEP | No change | 0 | None | — |
| Migration utilities | HIDE | Remove from tools list UI | 1 file | Low | Phase 3 |
| Duplicate `/crm/*` pages | ARCHIVE | Move to archive folder | 1 folder | Low | Phase 3 |
| Total Admin Pages | 25+ | Keep all | — | Minimal | — |
| Total API Routes | 50+ | Keep all | — | Minimal | — |

---

## Phase 3 Implementation Tasks

### Task 3.1: Hide Migration Tools Link
**File**: `/admin/tools/page.tsx`  
**Change**: Remove migration tool from TOOL_ITEMS array  
**Specifics**:
- Delete or comment out the migration tool item entry
- Update category count if needed
- Save and commit

**Effort**: 2 minutes  
**Risk**: Minimal (already owner-only, just UI hiding)

### Task 3.2: Archive Duplicate CRM Pages
**Folder**: `/src/app/crm/`  
**Change**: Move to archive (or delete)  
**Options**:
- Option 1: Delete folder entirely
- Option 2: Move to `/archive/legacy-crm/`

**Effort**: 5 minutes  
**Risk**: Low (not linked in nav, no imports reference it)

### Task 3.3: Update Documentation
**Files**: 
- `WARNINGS.md` (add note about archived CRM)
- `ADMIN_KEEP_REMOVE_PLAN.md` (this file, update completion status)

**Effort**: 5 minutes  
**Risk**: None

---

## Cleanup Verification Checklist

After Phase 3, verify:

- [ ] Migration tools link removed from AdminNav
- [ ] `/crm/*` pages archived or deleted
- [ ] `npm install` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] No broken links in AdminNav
- [ ] All primary workflow pages still accessible
- [ ] `/admin/dashboard` loads correctly
- [ ] `/admin/crm` still works
- [ ] `/admin/tools` shows only operational tools (no migration link)
- [ ] No console errors when navigating admin area

---

## Non-Actions (Do NOT Do)

❌ **Do NOT** remove core CRM/project/customer pages  
❌ **Do NOT** delete API routes (keep for recovery)  
❌ **Do NOT** remove owner-only restrictions  
❌ **Do NOT** break auth protection  
❌ **Do NOT** modify database schema  
❌ **Do NOT** change active lead/customer workflow  

---

## Future Hardening (Not in this phase)

These are good ideas for **later**:
- Move tmp/emergency_leads_queue.json to persistent storage (documented in TMP_USAGE.md)
- Add feature flags for beta tools
- Build audit/logging for admin actions
- Rate-limit admin endpoints
- Add 2FA for owner account

---

## Sign-Off

This plan represents a **minimal, safe cleanup** that:
- Preserves all working functionality
- Removes confusion from legacy tools
- Maintains all auth protections
- Keeps API routes intact for recovery

**Status**: Ready for Phase 3 implementation  
**Date**: 2026-03-27  
**Approval**: GitHub Copilot
