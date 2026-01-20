#!/bin/bash
# Automated script to sync queued subcontractors to VPS and import them

set -e

VPS_HOST="root@72.60.166.68"
VPS_PATH="/root/burch-contracting-fresh"
LOCAL_QUEUE="tmp/subcontractor_applications.json"

echo "🔄 Syncing queued subcontractors to VPS..."

# Check if queue file exists
if [ ! -f "$LOCAL_QUEUE" ]; then
    echo "❌ No queue file found at $LOCAL_QUEUE"
    exit 1
fi

# Count queued entries
QUEUE_COUNT=$(jq '. | length' "$LOCAL_QUEUE")
echo "📋 Found $QUEUE_COUNT queued subcontractor(s)"

if [ "$QUEUE_COUNT" -eq 0 ]; then
    echo "✅ Queue is empty, nothing to import"
    exit 0
fi

# Upload queue file and import script
echo "📤 Uploading queue file to VPS..."
scp "$LOCAL_QUEUE" "$VPS_HOST:$VPS_PATH/tmp/" || {
    echo "❌ Failed to upload queue file"
    exit 1
}

echo "📤 Uploading import script to VPS..."
scp scripts/import_queued_subcontractors.js "$VPS_HOST:$VPS_PATH/scripts/" || {
    echo "❌ Failed to upload import script"
    exit 1
}

# Run import on VPS
echo "🚀 Running import on VPS..."
ssh "$VPS_HOST" "cd $VPS_PATH && node scripts/import_queued_subcontractors.js" || {
    echo "❌ Import script failed on VPS"
    exit 1
}

# Download the updated queue (in case some failed)
echo "📥 Downloading updated queue file..."
scp "$VPS_HOST:$VPS_PATH/tmp/subcontractor_applications.json" "$LOCAL_QUEUE" || {
    echo "⚠️  Could not download updated queue"
}

# Check final queue count
NEW_QUEUE_COUNT=$(jq '. | length' "$LOCAL_QUEUE")
IMPORTED_COUNT=$((QUEUE_COUNT - NEW_QUEUE_COUNT))

echo ""
echo "✅ Import complete!"
echo "   Imported: $IMPORTED_COUNT"
echo "   Remaining in queue: $NEW_QUEUE_COUNT"

if [ "$NEW_QUEUE_COUNT" -gt 0 ]; then
    echo ""
    echo "⚠️  Some entries remain in queue (likely due to duplicates)"
fi

# Verify in database
echo ""
echo "🔍 Verifying in production database..."
ssh "$VPS_HOST" "mysql -u root -p\$(grep DB_PASSWORD $VPS_PATH/.env.production | cut -d '=' -f2) -e \"USE u239178742_burch; SELECT COUNT(*) as total, status FROM subcontractors WHERE email LIKE 'queued%' GROUP BY status;\" 2>/dev/null" || {
    echo "⚠️  Could not verify database (check manually in admin panel)"
}

echo ""
echo "🎉 Done! Check https://your-domain.com/admin/subcontractors"
