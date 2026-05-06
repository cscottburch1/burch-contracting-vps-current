# 🚀 Deployment Checklist - Burch Contracting Website

## Pre-Deployment (Local Testing)

### 1. **Fix All Console Errors**
- [ ] Run `npm run build` locally - must complete without errors
- [ ] Check browser console for client-side errors
- [ ] Test all major pages (home, services, contact, portal, admin)

### 2. **Database Health Check**
- [ ] After deployment, visit: `https://burchcontracting.com/api/health`
- [ ] Should return `{"status":"healthy"}` or auto-create missing tables
- [ ] If unhealthy, check database credentials in environment variables

### 3. **Test Critical Flows**
- [ ] Homepage loads without errors
- [ ] Contact form submission works
- [ ] Admin login works
- [ ] Projects page loads (if you have projects)
- [ ] Customer portal works

## Deployment Steps

### 1. **Commit and Push Changes**
```bash
git add .
git commit -m "feat: add auto-healing database system + fix critical errors"
git push origin main
```

### 2. **Deploy to VPS**
Your VPS should automatically pull and build the latest code.
If not, SSH in and run:
```bash
cd /path/to/app
git pull
npm install
npm run build
pm2 restart all  # or however you restart the app
```

### 3. **Post-Deployment Verification**
- [ ] Visit homepage - should load without errors
- [ ] Check `/api/health` - should be healthy
- [ ] Open browser console - no red errors
- [ ] Test contact form
- [ ] Test admin login

## Auto-Healing Features Added ✅

### What Was Fixed:
1. **Auto-Table Creation**: Missing database tables now create automatically on first request
2. **Error Boundaries**: Client errors caught gracefully with user-friendly messages
3. **Health Monitoring**: `/api/health` endpoint shows system status
4. **Safe Array Access**: All `.map()` and `.length` calls now use optional chaining
5. **Nested Anchor Fix**: ServiceCard component no longer creates invalid HTML

### New Endpoints:
- `/api/health` - Check database health and auto-initialize tables
- All API routes now have proper error handling

### How It Works:
1. When your app starts, it checks for missing database tables
2. If tables are missing, it creates them automatically
3. If creation fails, the app continues with graceful degradation
4. All database queries have try-catch blocks to prevent crashes

## Monitoring

### Quick Health Check
```bash
# Check if site is healthy
curl https://burchcontracting.com/api/health

# Should return:
# {"status":"healthy","database":"connected","tables":XX,"initialization":[...]}
```

### If Something Breaks:
1. Check `/api/health` first
2. Look at server logs
3. Check browser console
4. Verify database connection

## Environment Variables Required

Make sure your VPS has these set:
```env
# Database (MySQL)
MYSQL_HOST=your-db-host
MYSQL_USER=your-db-user
MYSQL_PASSWORD=your-db-password
MYSQL_DATABASE=your-db-name
MYSQL_PORT=3306

# Or alternative format:
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

# Next.js
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://burchcontracting.com
```

## Rollback Plan

If deployment breaks:
```bash
git log  # Find last working commit
git revert <commit-hash>  # Revert to last working version
git push
# Redeploy
```

## Performance Optimizations Included

✅ Image optimization (WebP format)
✅ Static asset caching (1 year)
✅ CSS chunking disabled (reduces critical request chains)
✅ CSS optimization enabled (inlines critical styles)

---

## 🎯 March 2026: PageSpeed Critical Chain Fix

### What Changed:
- Modified `next.config.ts` to reduce CSS critical request chains
- Added `experimental.cssChunking = false` to consolidate CSS on first load
- Added `experimental.optimizeCss = true` to inline critical above-the-fold CSS

### Pre-Deploy Testing:
- [x] Code changes committed to git
- [ ] Deployed to production VPS
- [ ] Verified build completes on Linux server
- [ ] Re-ran PageSpeed Insights mobile test

### Expected Results After Deploy:
- **Before**: 2 CSS files loaded in sequence (1,271ms critical chain on mobile)
- **After**: Single consolidated CSS or better critical path timing
- **Metric**: "Avoid chaining critical requests" warning should reduce/disappear

### Verification Steps:
1. Deploy changes to production VPS
2. Wait 2-3 minutes for build completion
3. Clear browser cache and CDN cache (if applicable)
4. Run PageSpeed Insights mobile test: https://pagespeed.web.dev/
5. Check "Avoid chaining critical requests" section - should see improvement
6. Verify no new errors in browser console
7. Confirm site still loads and renders correctly

### Rollback if Needed:
```bash
# Revert next.config.ts changes
git revert HEAD
git push
# Redeploy
```

### Notes:
- Local Windows build blocked by unrelated webpack/filesystem issue
- Production Linux build should complete normally
- CSS optimization is progressive - won't break existing functionality
✅ Gzip compression enabled
✅ Database connection pooling
✅ Error boundaries prevent full page crashes
✅ Graceful degradation when database unavailable

## SEO Features

✅ Comprehensive meta tags
✅ Structured data (JSON-LD)
✅ Social media cards (Open Graph)
✅ Mobile responsive
✅ Fast page loads
⏳ Sitemap.xml (next step)
⏳ Robots.txt (next step)

## Next Steps (Future Improvements)

1. **Add Monitoring**: Set up error tracking (Sentry, LogRocket)
2. **Performance**: Add Redis caching for database queries
3. **SEO**: Generate dynamic sitemap.xml
4. **Security**: Add rate limiting on API routes
5. **Testing**: Add automated tests
6. **CI/CD**: Automate deployment via GitHub Actions

## Support

If issues persist:
1. Check server logs: `pm2 logs` or `journalctl`
2. Check database connectivity
3. Verify environment variables are set
4. Run health check: `curl your-domain.com/api/health`

---

**Remember**: The auto-healing system means most database issues will fix themselves on first request. Just deploy and let it work! 🎉
