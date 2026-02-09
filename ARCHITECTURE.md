# 🏗️ Architecture Overview - Burch Contracting Website

## System Architecture

### Core Technologies
- **Framework**: Next.js 14 (App Router)
- **Database**: MySQL with connection pooling
- **Styling**: Tailwind CSS
- **Deployment**: VPS with PM2
- **Version Control**: GitHub

## Auto-Healing System 🔄

### Database Initialization (`src/lib/dbInit.ts`)
Automatically creates missing database tables on app startup:
- `service_settings` - Service configuration
- `project_photos` - Project photo gallery
- `project_milestones` - Project tracking
- `project_activity` - Activity logs
- `project_subcontractors` - Subcontractor assignments

### How It Works:
1. **App Startup**: `instrumentation.ts` runs on server start
2. **Table Check**: Queries database for each required table
3. **Auto-Create**: Creates missing tables with proper schema
4. **Seed Data**: Inserts default data where needed
5. **Graceful Degradation**: Continues running even if some tables fail

### Health Monitoring (`/api/health`)
Real-time system status endpoint:
```json
{
  "status": "healthy",
  "database": "connected",
  "tables": 25,
  "initialization": [
    {"table": "service_settings", "status": "exists"},
    {"table": "project_photos", "status": "created"}
  ]
}
```

## Error Handling Strategy

### Client-Side (`ErrorBoundary.tsx`)
- Catches React rendering errors
- Displays user-friendly error messages
- Provides refresh option
- Prevents full page crashes

### API Routes
- All database queries wrapped in try-catch
- Returns empty arrays instead of crashing
- Logs errors to console for debugging
- HTTP status codes indicate error type

### Safe Data Access
```typescript
// Before (crashes if undefined):
{subcontractors.length}

// After (safe):
{subcontractors?.length || 0}
{(photos || []).map(...)}
```

## Database Schema

### Core Tables (Existing)
- `customers` - Customer information
- `leads` - Lead tracking
- `projects` - Project management
- `subcontractors` - Subcontractor database
- `admin_users` - Admin authentication
- `banners` - Emergency banners
- `notifications` - System notifications
- `documents` - File management

### Project Management (Auto-Created)
- `project_photos` - Photo galleries with categories
- `project_milestones` - Timeline tracking
- `project_activity` - Activity history
- `project_subcontractors` - Assignment management

### Service Configuration (Auto-Created)
- `service_settings` - Dynamic service management
  - Enable/disable services
  - SEO meta tags per service
  - Navigation control
  - Calculator integration

## API Routes Structure

### Public APIs
- `/api/services/active` - Get enabled services
- `/api/contact` - Contact form submission
- `/api/health` - System health check

### Admin APIs (Protected)
- `/api/admin/login` - Authentication
- `/api/admin/projects/*` - Project management
- `/api/admin/leads/*` - Lead management
- `/api/admin/customers/*` - Customer management

### Customer Portal APIs
- `/api/portal/login` - Customer auth
- `/api/portal/projects/*` - View projects
- `/api/portal/messages/*` - Messaging

## Performance Optimizations

### Caching Strategy
```typescript
// Static assets: 1 year cache
Cache-Control: public, max-age=31536000, immutable

// Images: WebP format, optimized sizes
formats: ['image/webp']
```

### Database
- Connection pooling (10 connections)
- Indexed queries on critical columns
- Graceful fallbacks to prevent slow queries blocking app

### Build Optimization
- Gzip compression enabled
- Unused dependencies removed
- Image optimization automatic

## SEO Implementation

### Meta Tags (layout.tsx)
- Comprehensive title and description
- Keywords targeting Simpsonville SC area
- Social media cards (Open Graph, Twitter)
- Structured data (JSON-LD)

### Sitemap (`/sitemap.xml`)
- Automatically generated
- Includes all service pages
- Priority weighting for important pages

### Robots.txt (`/robots.txt`)
- Allows search engine crawling
- Blocks admin/API routes
- Links to sitemap

## Security Features

### Authentication
- JWT-based admin sessions
- Password hashing (bcrypt)
- Session expiration
- Protected API routes

### Database
- Prepared statements (SQL injection prevention)
- Connection pooling
- Error message sanitization

### Headers
- `poweredByHeader: false` (hides Next.js)
- HTTPS enforced in production
- CORS configured for API routes

## Deployment Process

### Build Steps
```bash
npm install          # Install dependencies
npm run build        # Build production bundle
npm start            # Start production server
```

### Environment Variables Required
```env
MYSQL_HOST=database-host
MYSQL_USER=database-user
MYSQL_PASSWORD=database-password
MYSQL_DATABASE=database-name
MYSQL_PORT=3306
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://burchcontracting.com
```

### Post-Deployment
1. Visit `/api/health` to trigger table creation
2. Check browser console for errors
3. Test critical user flows

## Monitoring & Debugging

### Health Check
```bash
curl https://burchcontracting.com/api/health
```

### Common Issues & Solutions

#### "Table doesn't exist"
- Visit `/api/health` endpoint
- Auto-creates missing tables
- Check database permissions

#### "Cannot read properties of undefined"
- Ensure optional chaining in all array access
- Check API response format matches frontend expectations
- Verify fallback empty arrays

#### Database connection failed
- Check environment variables
- Verify database host is accessible
- Check firewall rules on VPS

## Code Quality Standards

### Component Structure
```typescript
// Safe data fetching
const [data, setData] = useState<Type[]>([]);

// Safe rendering
{(data || []).map(item => ...)}

// Error boundaries
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

### API Route Pattern
```typescript
export async function GET() {
  try {
    const data = await query('SELECT ...');
    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
```

## Future Enhancements

### Short Term
- [ ] Redis caching for frequent queries
- [ ] Rate limiting on API routes
- [ ] Automated error reporting (Sentry)
- [ ] Automated backups

### Long Term
- [ ] WebSocket for real-time updates
- [ ] GraphQL API layer
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard

---

## Quick Reference

### Critical Files
- `src/lib/dbInit.ts` - Auto-healing system
- `src/instrumentation.ts` - Startup initialization
- `src/lib/mysql.ts` - Database connection
- `src/components/ErrorBoundary.tsx` - Error handling
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide

### Emergency Contacts
- Health Check: `/api/health`
- Error Logs: Server console / PM2 logs
- Database: Check MySQL connection

---

**Last Updated**: February 9, 2026
**Version**: 2.0 (Auto-Healing Architecture)
