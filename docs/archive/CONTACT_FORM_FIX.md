# 🔧 Contact Form Database Fix

## Problem Identified

The contact form submission was failing because of a database schema mismatch:

1. **Wrong table name**: The API code referenced `contact_leads`, but the schema created a table named `leads`
2. **Missing columns**: The table was missing these required columns:
   - `attachments` (for file uploads)
   - `preferred_date` (for consultation scheduling)
   - `preferred_time` (for consultation scheduling)
   - `lead_score` (for lead scoring system)

## What Was Fixed

### 1. Database Schema Updated
- **File**: `database/leads-schema.sql`
- Changed table name from `leads` to `contact_leads`
- Added all missing columns with proper types and comments
- Updated foreign key references in related tables

### 2. Migration Scripts Created

#### For Remote Database (Recommended):
**Browser-based migration** - Works from anywhere:
1. Visit: `http://localhost:3000/admin/fix-contact-leads` (or your domain)
2. Click "Check Database Status" to see current state
3. Click "Run Migration" to fix the database
4. Test the contact form

**API Endpoint**: `/api/admin/migrate-contact-leads`
- GET: Check current status
- POST: Run migration (admin auth required)

#### For Local Database:
**Script**: `scripts/fix-contact-leads.js`
```bash
node scripts/fix-contact-leads.js
```

### 3. Test Script Created
**Script**: `scripts/test-contact-form-db.js`
```bash
node scripts/test-contact-form-db.js
```
This will verify the database is properly configured.

## How to Apply the Fix

### Option A: Browser-Based (Easiest for Remote DB)

1. Make sure you're logged into the admin panel
2. Navigate to: `/admin/fix-contact-leads`
3. Click "Run Migration"
4. Wait for success message
5. Test the contact form at `/contact`

### Option B: Command Line (Local DB Only)

```bash
# Run the fix
node scripts/fix-contact-leads.js

# Verify it worked
node scripts/test-contact-form-db.js
```

### Option C: Manual SQL (Direct Database Access)

If you have direct database access (phpMyAdmin, command line, etc.):

```sql
-- Run this SQL file:
database/fix-contact-leads-table.sql
```

## Verification Steps

1. ✅ Visit `/admin/fix-contact-leads` - Should show "Status: ok"
2. ✅ Submit a test through `/contact` - Should succeed
3. ✅ Check `/admin/crm/leads` - Should show the new lead
4. ✅ Verify file uploads work

## Files Modified/Created

### Modified:
- `database/leads-schema.sql` - Fixed table name and added columns

### Created:
- `database/fix-contact-leads-table.sql` - Migration SQL
- `scripts/fix-contact-leads.js` - Local migration script
- `scripts/test-contact-form-db.js` - Test script
- `src/app/api/admin/migrate-contact-leads/route.ts` - Migration API
- `src/app/admin/fix-contact-leads/page.tsx` - Migration UI

## Next Steps

1. **Run the migration** using one of the options above
2. **Test the contact form** thoroughly
3. **Check the admin CRM** to see if leads are being saved
4. **Monitor for any errors** in the browser console or server logs

## Troubleshooting

### "Access denied" error
- Your local IP is not whitelisted on the remote database
- **Solution**: Use the browser-based migration (Option A)

### "Table already exists" error
- The table exists but is named incorrectly or missing columns
- **Solution**: The migration handles this automatically

### Migration succeeds but form still fails
1. Check browser console for JavaScript errors
2. Check `/api/contact` endpoint in Network tab
3. Verify all environment variables are set
4. Check server logs for detailed error messages

## Technical Details

### Database Schema Changes

**Before:**
```sql
CREATE TABLE leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  -- ... other basic columns
);
```

**After:**
```sql
CREATE TABLE contact_leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  -- ... other basic columns
  attachments TEXT,
  preferred_date DATE,
  preferred_time VARCHAR(50),
  lead_score INT DEFAULT 0,
  -- ... rest of columns
);
```

### Environment Variables Required

The migration uses these environment variables:
- `MYSQL_HOST` - Database host
- `MYSQL_PORT` - Database port (default: 3306)
- `MYSQL_USER` - Database user
- `MYSQL_PASSWORD` - Database password
- `MYSQL_DATABASE` - Database name

Make sure these are set in your `.env.local` file.

## Support

If you encounter any issues:
1. Check the detailed error message
2. Verify database connection settings
3. Ensure you have proper database permissions
4. Contact support with the error details
