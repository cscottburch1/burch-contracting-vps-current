# Tradesman Mobile App - Setup Guide

## 🎉 Your Crew Photo Upload App is LIVE!

The Progressive Web App (PWA) has been deployed and is ready for your crew to use.

## 📱 Access the App

**URL:** https://burchcontracting.com/tradesman

## 🔐 Test Login Credentials

- **Email:** crew@burchcontracting.com
- **PIN:** 123456

## 📋 Features

### ✅ What's Built:
1. **Mobile-First Login** - Simple email + PIN authentication
2. **Project Dashboard** - Shows all assigned projects
3. **Photo Upload** - Two methods:
   - 📷 Take Photo (opens camera directly)
   - 🖼️ Choose from Gallery (select multiple)
4. **Category Selection** - Progress, Before, After, Other
5. **Offline Support** - PWA caches for offline access
6. **Photo History** - See recently uploaded photos

### 📱 Install as App (iOS/Android):

**iPhone:**
1. Open https://burchcontracting.com/tradesman in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

**Android:**
1. Open https://burchcontracting.com/tradesman in Chrome
2. Tap the menu (3 dots)
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install"

## 👷 Adding Real Crew Members

You can add crew members through the database or I can build an admin interface. For now, use MySQL:

```sql
-- Add a crew member
INSERT INTO tradesman_users (name, email, phone, pin, is_active) 
VALUES ('John Smith', 'john@example.com', '864-555-0100', '123456', true);

-- Assign to a project
INSERT INTO tradesman_project_assignments (tradesman_id, project_id, assigned_date, role) 
VALUES (1, 1, CURDATE(), 'Lead Carpenter');
```

## 🎯 How It Works

1. **Login** → Crew enters email + 6-digit PIN
2. **Dashboard** → Shows their assigned active projects
3. **Select Project** → Tap a project to upload photos
4. **Upload** → Take photo or choose from gallery
5. **Done** → Photos appear in project detail page instantly

## 🔒 Security

- JWT token authentication (30-day expiry)
- PIN-based access (change in production)
- HTTPS only in production
- Separate from admin accounts

## 📊 Photo Management

All photos uploaded by crew appear in:
- `/admin/project-detail?id={project_id}` (Photos tab)
- Automatically tagged with uploader info
- Categorized (progress, before, after, etc.)

## 🚀 Next Steps (Optional Enhancements)

1. **Admin Interface** - Manage crew members from admin panel
2. **Push Notifications** - Alert crew of new assignments
3. **Time Tracking** - Clock in/out feature
4. **Notes** - Add text notes with photos
5. **GPS Tagging** - Auto-tag photos with location
6. **Signature Capture** - Daily work sign-off

## 📝 Notes

- The app works offline (caches pages)
- Photos sync when connection returns
- Mobile-optimized for quick uploads
- No app store needed - works on all devices

## 🆘 Support

If crew members have issues:
1. Check they're using the correct email/PIN
2. Ensure they have an active project assignment
3. Check internet connection
4. Try clearing browser cache

---

**Total Build Time:** ~2 hours
**Cost:** $0 (uses existing infrastructure)
**Maintenance:** Minimal (just add/remove crew members)
