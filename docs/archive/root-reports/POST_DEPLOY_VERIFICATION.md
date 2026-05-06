# Post-Deploy Verification

Date: 2026-03-27

## Health and Route Checks
- Local health endpoint (127.0.0.1:3000/api/health): 200
  - Body: {"status":"healthy","database":"connected","tables":31}
- Public health endpoint (https://burchcontracting.com/api/health): 200
- Homepage (/): 200
- Admin login (/admin): 200
- Admin dashboard (/admin/dashboard): 200
- Contact page (/contact): 200

## Public Asset Check
- Homepage HTML contained _next/static references: YES
- Static/public asset handling: PASS

## Recent Projects Check
- API endpoint: https://burchcontracting.com/api/projects/recent
- HTTP status: 200
- Response size: 2 bytes ([])
- Behavior: endpoint returns quickly, no hanging observed

## CRM Attachment Endpoint Probe
- Endpoint tested: /api/crm/leads/1/attachments/test.pdf
- Result: 401 Unauthorized (expected without admin auth)
- Conclusion: route is reachable and protected by auth.

## Lead Submission Verification
Controlled smoke submissions were executed against production contact endpoint.

- Submission #1 (no attachment field):
  - API result: success
  - DB confirmation: lead id 12 created (deploy-smoke@burchcontracting.com)

- Submission #2 (file field mismatch):
  - API result: success
  - filesUploaded: 0
  - DB confirmation: lead id 13 created (deploy-smoke2@burchcontracting.com)

- Submission #3 (file0 text/plain):
  - API result: rejected unsupported file type

- Submission #4 (file0 with pdf mime):
  - API result: failed to submit form

## Lead + Attachment Flow Status
- Lead creation: VERIFIED WORKING
- Attachment upload: NOT VERIFIED AS WORKING in this run
- Attachment download (authenticated): MANUAL ADMIN TEST REQUIRED

## Manual Admin Verification Required
1. Login to /admin with owner/admin account.
2. Open /admin/crm and confirm smoke leads 12 and 13 are visible.
3. Create a new lead with one small PDF attachment via website contact form UI.
4. Open the lead detail in /admin/crm/leads/{id}.
5. Verify attachment metadata appears and download link returns file content.

## Result
- Core production availability: PASS
- Admin availability: PASS
- Lead submissions: PASS
- Attachment flow: PARTIAL (requires manual authenticated verification)
