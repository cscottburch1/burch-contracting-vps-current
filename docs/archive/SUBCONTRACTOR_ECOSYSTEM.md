# Subcontractor Management Ecosystem - Complete Overview

## 1. Directory Structure

```
src/
├── app/
│   ├── subcontractors/                    # Public subcontractor pages
│   │   └── join/
│   │       └── page.tsx                   # Subcontractor application/signup page
│   ├── admin/
│   │   └── subcontractors/                # Admin management interface
│   │       ├── page.tsx                   # Main subcontractors management page
│   │       └── manage/
│   │           └── page.tsx               # Detailed subcontractor management
│   └── api/
│       ├── subcontractors/
│       │   └── apply/
│       │       └── route.ts               # POST - Submit subcontractor application
│       └── admin/
│           └── subcontractors/
│               ├── route.ts               # GET - List all subcontractors
│               ├── import/
│               │   └── route.ts           # POST - Import queued applications
│               └── [id]/
│                   ├── route.ts           # PATCH - Update subcontractor details
│                   ├── documents/
│                   │   ├── route.ts       # GET/POST - Manage subcontractor documents
│                   │   └── [documentId]/
│                   │       └── route.ts   # DELETE - Remove document
│                   └── projects/
│                       └── route.ts       # GET - View project history
├── types/
│   └── subcontractor.ts                   # TypeScript interfaces & constants
├── lib/
│   ├── tradesmanAuth.ts                   # Auth for tradesman/subcontractor login
│   ├── dbInit.ts                          # DB initialization (includes schemas)
│   └── mysql.ts                           # MySQL connection utilities
└── components/
    ├── layout/Header.tsx                  # Navigation link to /subcontractors/join
    └── admin/AdminNav.tsx                 # Admin nav to /admin/subcontractors
database/
├── subcontractors.sql                     # Complete subcontractor schema
└── [migrations]
    ├── add_pin_to_subcontractors.sql      # Added PIN field for mobile login
    └── add_profile_fields_to_subcontractors.sql  # Added profile customization
```

---

## 2. Public-Facing Pages

### `/subcontractors/join` - Subcontractor Application Form
**File:** [src/app/subcontractors/join/page.tsx](src/app/subcontractors/join/page.tsx)

**Features:**
- Registration/signup form for new subcontractors
- Client-side form with validation and spam detection
- Integration with:
  - **reCAPTCHA v3** for bot protection
  - **Honeypot field** ("website") for basic spam filtering
  - **Time-based validation** (form must take >3 seconds to fill)
  - **Form start time tracking** to detect automated submissions
- Collects:
  - Company information (name, contact, address, city, state, zip)
  - Business details (type, years in business, license, insurance info)
  - Specialties (multi-select from predefined list)
  - Payment terms, W9 submission status

**Form Fields:**
- Company name, contact name, email, phone (required)
- Business type: sole proprietor, LLC, corporation, partnership (required)
- Years in business (required)
- License number, insurance provider, insurance expiry (optional)
- Address, city, state, zip (optional)
- Specialties: multi-select (required - at least one)

---

## 3. Admin Management Pages

### `/admin/subcontractors` - Subcontractor Management Dashboard
**File:** [src/app/admin/subcontractors/page.tsx](src/app/admin/subcontractors/page.tsx)

**Features:**
- View all subcontractors with filters
- Filter by:
  - **Status:** pending, approved, active, suspended, rejected
  - **Search:** by company name, email, phone
  - **Specialty:** filter by trade specialty
- Actions available:
  - View detailed information (modal)
  - Manage documents (upload, delete, expiration tracking)
  - View project history and assignments
  - View and edit admin notes
  - Update status, rating, specialties
  - Edit company/contact information
  - Manage PIN for mobile app access
  - Add/edit/delete records

**Modals & Features:**
1. **Details Modal** - View all subcontractor information
2. **Documents Modal** - Manage business documents (license, insurance, W9, certificates, contracts)
3. **Notes Modal** - Add/edit internal admin notes
4. **Add/Edit Form** - Create new or update existing subcontractor records

### `/admin/subcontractors/manage` - Detailed Management
**File:** [src/app/admin/subcontractors/manage/page.tsx](src/app/admin/subcontractors/manage/page.tsx)

Extended management functionality for individual subcontractor operations.

---

## 4. API Routes & Endpoints

### Public Subcontractor Application
**POST** `/api/subcontractors/apply` - Submit new subcontractor application
- **Spam Protection:**
  - Honeypot field check
  - Time-based validation (>3 seconds)
  - reCAPTCHA verification
  - Spam detection (email/phone patterns)
- **Rate Limiting:** 5 applications per hour per IP
- **Validation:**
  - Required fields: company_name, contact_name, email, phone, business_type, years_in_business, specialties
  - Email must be unique
  - At least one specialty required
- **Response:** Generates 6-digit PIN for mobile access, stores in database with status='pending'
- **Fallback:** If DB unavailable, queues in `tmp/subcontractor_applications.json`

### Admin API Endpoints

#### **GET** `/api/admin/subcontractors` - List All Subcontractors
- Returns array of all subcontractors with:
  - Parsed specialties (handles JSON and comma-separated formats)
  - Queued applications from tmp file (if any)
  - Status 403 if not authorized admin

#### **PATCH** `/api/admin/subcontractors/[id]` - Update Subcontractor
- Updateable fields: company_name, contact_name, email, phone, pin, status, admin_notes, business_type, years_in_business, license_number, insurance_provider, insurance_expiry, specialties, rating
- PIN validation: must be exactly 6 digits
- Logs activity: approval/rejection/status changes to `subcontractor_activity` table
- Returns 403 if not authenticated

#### **POST** `/api/admin/subcontractors/import` - Import Queued Applications
- Processes pending applications from `tmp/subcontractor_applications.json`
- Skips duplicates (existing emails)
- Generates 6-digit PIN for each imported entry
- Returns: count of imported, skipped, and failed entries

#### **GET/POST** `/api/admin/subcontractors/[id]/documents` - Manage Documents
**GET** - Fetch all documents for subcontractor
- Ordered by creation date (newest first)

**POST** - Upload new document
- Accepts: file, documentType, title, description, expirationDate
- Document types: license, insurance, w9, certificate, contract, other
- Stores in uploads directory
- Creates database record with expiration tracking

#### **DELETE** `/api/admin/subcontractors/[id]/documents/[documentId]` - Delete Document
- Removes document from storage and database
- Updates subcontractor record

#### **GET** `/api/admin/subcontractors/[id]/projects` - View Project History
- Returns all projects assigned to subcontractor
- Includes: project title, status, role, amounts (quoted/paid), dates (assigned/completed)
- Data from `project_subcontractors` junction table joined with `projects` table

---

## 5. Database Schema

**Part of:** [database/subcontractors.sql](database/subcontractors.sql)

### Main Tables

#### `subcontractors` (Parent table)
```sql
id                      INT PRIMARY KEY
company_name           VARCHAR(255) NOT NULL
contact_name           VARCHAR(255) NOT NULL
email                  VARCHAR(255) NOT NULL UNIQUE
phone                  VARCHAR(50) NOT NULL
address                VARCHAR(255)
city                   VARCHAR(100)
state                  VARCHAR(50)
zip                    VARCHAR(20)
pin                    VARCHAR(6)                    -- Added: for mobile app login
logo_url               VARCHAR(500)                  -- Added: profile customization
bio                    TEXT                          -- Added: profile customization
website                VARCHAR(255)                  -- Added: profile customization
services_offered       TEXT                          -- Added: profile customization
profile_theme          VARCHAR(50) DEFAULT 'default' -- Added: profile customization

-- Business Details
business_type          ENUM('sole_proprietor','llc','corporation','partnership')
years_in_business      INT
license_number         VARCHAR(100)
insurance_provider     VARCHAR(255)
insurance_expiry       DATE

-- Specialties (JSON array)
specialties            JSON

-- Status & Ratings
status                 ENUM('pending','approved','active','suspended','rejected')
rating                 DECIMAL(3,2) DEFAULT 0.00
total_projects         INT DEFAULT 0

-- Financial
payment_terms          VARCHAR(100)
w9_submitted           BOOLEAN DEFAULT FALSE

-- Notes
admin_notes            TEXT

-- Timestamps
created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at             TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
last_active            TIMESTAMP NULL
approved_at            TIMESTAMP NULL
approved_by            INT (FK: admin_users)

-- Indexes
INDEX idx_email (email)
INDEX idx_status (status)
INDEX idx_rating (rating)
INDEX idx_created (created_at)
INDEX idx_email_pin (email, pin)
```

#### `subcontractor_documents` - Document Management
```sql
id                  INT PRIMARY KEY
subcontractor_id    INT NOT NULL (FK: subcontractors)
document_type       ENUM('license','insurance','w9','certificate','contract','other')
document_name       VARCHAR(255) NOT NULL
file_path           VARCHAR(500) NOT NULL
file_size           INT
uploaded_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
uploaded_by         INT (FK: admin_users)
expires_at          DATE

-- Indexes
INDEX idx_subcontractor (subcontractor_id)
INDEX idx_type (document_type)
INDEX idx_expires (expires_at)
```

#### `bid_opportunities` - Project Opportunities
```sql
id                      INT PRIMARY KEY
project_title           VARCHAR(255) NOT NULL
project_description     TEXT NOT NULL
project_type            VARCHAR(100)
location                VARCHAR(255)
scope_of_work           TEXT
required_specialties    JSON (array of skill types)
estimated_budget_min    DECIMAL(10,2)
estimated_budget_max    DECIMAL(10,2)

-- Timeline
bid_deadline            DATETIME NOT NULL
project_start_date      DATE
project_end_date        DATE

-- Status
status                  ENUM('draft','open','closed','awarded','cancelled')
awarded_to              INT (FK: subcontractors)
awarded_at              TIMESTAMP NULL
awarded_amount          DECIMAL(10,2)

created_by              INT NOT NULL (FK: admin_users)
created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at              TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

-- Indexes
INDEX idx_status (status)
INDEX idx_deadline (bid_deadline)
INDEX idx_created (created_at)
```

#### `subcontractor_bids` - Bid Submissions
```sql
id                      INT PRIMARY KEY
opportunity_id          INT NOT NULL (FK: bid_opportunities)
subcontractor_id        INT NOT NULL (FK: subcontractors)
bid_amount              DECIMAL(10,2) NOT NULL
timeline_days           INT
bid_notes               TEXT
proposal_file_path      VARCHAR(500)

-- Status
status                  ENUM('submitted','under_review','accepted','rejected','withdrawn')
reviewed_by             INT (FK: admin_users)
reviewed_at             TIMESTAMP NULL
review_notes            TEXT

submitted_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at              TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

-- Constraints
UNIQUE KEY unique_bid (opportunity_id, subcontractor_id)
-- Indexes
INDEX idx_opportunity (opportunity_id)
INDEX idx_subcontractor (subcontractor_id)
INDEX idx_status (status)
```

#### `subcontractor_reviews` - Performance Reviews
```sql
id                      INT PRIMARY KEY
subcontractor_id        INT NOT NULL (FK: subcontractors)
project_id              INT (FK: projects)

-- Ratings (1-5 scale)
quality_rating          INT NOT NULL
timeliness_rating       INT NOT NULL
communication_rating    INT NOT NULL
professionalism_rating  INT NOT NULL

-- Review Details
review_text             TEXT
would_hire_again        BOOLEAN DEFAULT TRUE
reviewed_by             INT NOT NULL (FK: admin_users)
created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Indexes
INDEX idx_subcontractor (subcontractor_id)
INDEX idx_created (created_at)
```

#### `subcontractor_activity` - Activity Audit Log
```sql
id                  INT PRIMARY KEY
subcontractor_id    INT NOT NULL (FK: subcontractors)
activity_type       ENUM('application','approved','rejected','bid_submitted',
                          'bid_awarded','document_uploaded','status_change','note_added')
description         TEXT
performed_by        INT (FK: admin_users)
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Indexes
INDEX idx_subcontractor (subcontractor_id)
INDEX idx_type (activity_type)
INDEX idx_created (created_at)
```

#### `project_subcontractors` - Assignment Junction Table
```sql
id                      INT PRIMARY KEY
project_id              INT NOT NULL (FK: projects)
subcontractor_id        INT NOT NULL (FK: subcontractors)
role                    VARCHAR(100) NOT NULL
amount_quoted           DECIMAL(10,2)
amount_paid             DECIMAL(10,2)
assigned_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
completed_at            TIMESTAMP NULL

-- Constraints
UNIQUE KEY unique_project_sub (project_id, subcontractor_id, role)
FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE CASCADE
-- Indexes
INDEX idx_subcontractor_id (subcontractor_id)
```

---

## 6. TypeScript Types & Constants

**File:** [src/types/subcontractor.ts](src/types/subcontractor.ts)

### Interfaces

#### `Subcontractor` Interface
Main entity representing a subcontractor profile with all fields including:
- ID, company info, personal contact
- Business details (type, years, license, insurance)
- Specialties array
- Status and rating
- Financial info (payment terms, W9 status)
- Admin notes
- Timestamps (created, updated, last_active, approved_at, approved_by)

#### `SubcontractorDocument` Interface
Document records with:
- ID, subcontractor_id, document_type
- document_name, file_path, file_size
- uploaded_at, uploaded_by, expires_at

#### `BidOpportunity` Interface
Project opportunities open for bidding:
- project_title, description, type, location
- scope_of_work, required_specialties
- estimated_budget_min/max
- bid_deadline, project_start_date, end_date
- status, awarded_to (subcontractor), awarded_amount
- created_by, timestamps

#### `SubcontractorBid` Interface
Bid submissions from subcontractors:
- opportunity_id, subcontractor_id
- bid_amount, timeline_days, bid_notes
- proposal_file_path
- status: submitted|under_review|accepted|rejected|withdrawn
- reviewed_by, reviewed_at, review_notes
- timestamps

#### `SubcontractorReview` Interface
Performance reviews with 1-5 ratings for:
- quality_rating
- timeliness_rating
- communication_rating
- professionalism_rating
- Plus: review_text, would_hire_again, reviewed_by, created_at

#### `SubcontractorActivity` Interface
Audit log entries tracking actions on subcontractor records

### Constants

#### `SUBCONTRACTOR_SPECIALTIES` - List of Available Trade Skills
```typescript
export const SUBCONTRACTOR_SPECIALTIES = [
  'Framing',
  'Roofing',
  'Siding',
  'Windows & Doors',
  'Drywall',
  'Painting',
  'Flooring',
  'Tile Work',
  'Cabinetry',
  'Countertops',
  'Plumbing',
  'Electrical',
  'HVAC',
  'Insulation',
  'Concrete',
  'Masonry',
  'Landscaping',
  'Excavation',
  'Demolition',
  'Carpentry',
  'Trim Work',
  'Kitchen Remodeling',
  'Bathroom Remodeling',
  'Deck Building',
  'Fence Installation',
  'General Labor'
]

export type SubcontractorSpecialty = typeof SUBCONTRACTOR_SPECIALTIES[number];
```

---

## 7. Database Migrations

**Location:** [migrations/](migrations/)

### Applied Migrations

#### `add_pin_to_subcontractors.sql`
Added PIN field for unified mobile app login system:
```sql
ALTER TABLE subcontractors 
  ADD COLUMN pin VARCHAR(6) NULL AFTER email;
ALTER TABLE subcontractors 
  ADD INDEX idx_email_pin (email, pin);
```
- PIN is 6 random digits
- Generated during application submission
- Allows subcontractors to log in via mobile app without password

#### `add_profile_fields_to_subcontractors.sql`
Added profile customization fields:
```sql
ALTER TABLE subcontractors 
  ADD COLUMN logo_url VARCHAR(500) NULL,
  ADD COLUMN bio TEXT NULL,
  ADD COLUMN website VARCHAR(255) NULL,
  ADD COLUMN services_offered TEXT NULL,
  ADD COLUMN profile_theme VARCHAR(50) DEFAULT 'default';
```
- Allows subcontractors to customize their public profile
- Logo URL for company branding
- Bio and services description
- Personal website link
- Theme preference

---

## 8. Authentication & Authorization

### Subcontractor Authentication
**File:** [src/lib/tradesmanAuth.ts](src/lib/tradesmanAuth.ts)

Unified authentication for both tradesmen and subcontractors:
- PIN-based login (6-digit code)
- Email + PIN combination
- Supports statuses: pending, approved, active (allows suspended/rejected)
- Tries `tradesmen` table first, then `subcontractors` table as fallback

### Admin Authentication
**File:** [src/lib/adminAuth.ts](src/lib/adminAuth.ts)

Admin-only access to subcontractor management:
- Session-based authentication
- Stored in HTTP-only cookies
- Verifies admin user authorization for all operations
- Required for all `/api/admin/subcontractors/*` endpoints

---

## 9. Database Initialization

**File:** [src/lib/dbInit.ts](src/lib/dbInit.ts)

During app startup, the database is automatically initialized with:
- `project_subcontractors` table (junction table for project assignments)
- Relationships between projects and subcontractors
- Indexes for optimization

---

## 10. Utility & Library Functions

### MySQL Connection
**File:** [src/lib/mysql.ts](src/lib/mysql.ts)
- Database connection pooling
- Query execution interface
- Connection lifecycle management

### Spam Detection
**File:** [src/lib/spamDetection.ts](src/lib/spamDetection.ts)
- Email pattern validation
- Phone number pattern validation
- Company name analysis
- Spam scoring algorithm

### Rate Limiting
**File:** [src/lib/rateLimit.ts](src/lib/rateLimit.ts)
- 5 applications per hour per IP
- In-memory rate limit tracking
- Client IP extraction from request headers

### reCAPTCHA Integration
**File:** [src/lib/recaptcha.ts](src/lib/recaptcha.ts)
- reCAPTCHA v3 verification
- Server-side validation of tokens
- Action-based scoring

### Email Service
**File:** [src/lib/mailer.ts](src/lib/mailer.ts)
- Sends notification emails to subcontractor
- Admin notification emails for new applications
- Uses `sendLeadEmail` and `sendEmail` functions

---

## 11. Key Features & Workflow

### 1. Subcontractor Application Workflow
```
Public User → /subcontractors/join page
            ↓
         Form validation & spam checks
            ↓
         reCAPTCHA verification
            ↓
         Rate limit check (5/hour per IP)
            ↓
         POST /api/subcontractors/apply
            ↓
      Generate 6-digit PIN
            ↓
   Insert into subcontractors table (status=pending)
            ↓
   Send welcome/confirmation email
            ↓
   Log to subcontractor_activity
            ↓
   Return success + PIN to user
```

### 2. Admin Approval Workflow
```
Admin → /admin/subcontractors
      ↓
View all applications (pending/approved/active/suspended/rejected)
      ↓
Select subcontractor → view details modal
      ↓
Options:
  a) Approve: PATCH status='approved', log approval
  b) Reject: PATCH status='rejected', log rejection
  c) Upload documents
  d) Add admin notes
  e) Edit details
```

### 3. Project Assignment Workflow
```
Admin creates project → Opens bidding
      ↓
PATCH /bid_opportunities status='open'
      ↓
Subcontractors submit bids
      ↓
Admin reviews bids → selects winner
      ↓
PATCH bid_opportunities awarded_to=subcontractor_id
      ↓
Creates project_subcontractors entry
      ↓
Assign PIN/PIN-based login for mobile access
```

### 4. Document Management
```
Admin → /admin/subcontractors/[id]/documents
      ↓
Upload document:
  - License
  - Insurance certificate
  - W9 form
  - Certificate/qualification
  - Contract
      ↓
Set expiration date for tracking
      ↓
Store in file system + database record
      ↓
Track upload timestamp & uploader
```

---

## 12. Related Components

### Navigation
- [src/components/layout/Header.tsx](src/components/layout/Header.tsx) - Public header nav link to `/subcontractors/join`
- [src/components/admin/AdminNav.tsx](src/components/admin/AdminNav.tsx) - Admin navigation with Alt+8 shortcut to `/admin/subcontractors`
- [src/components/MobileStickyCta.tsx](src/components/MobileStickyCta.tsx) - Mobile CTA (hides on `/subcontractors` routes)

---

## 13. Data Persistence Fallback

### Queued Applications
If database is unavailable during application submission:
- Applications saved to: `tmp/subcontractor_applications.json`
- Each application includes all form data plus ID and timestamp
- Admin can import queued applications via: `POST /api/admin/subcontractors/import`
- Import process:
  - Reads queue file
  - Skips duplicates (existing emails)
  - Generates PIN for each
  - Inserts into database
  - Deletes or clears queue file
  - Returns summary (imported/skipped/failed counts)

---

## 14. Security & Validation

### Application Submission Security
- ✅ **Honeypot field** - catches automated bot submissions
- ✅ **Time-based validation** - form must take >3 seconds
- ✅ **reCAPTCHA v3** - AI-powered bot detection
- ✅ **Spam detection** - email/phone/company pattern analysis
- ✅ **Rate limiting** - 5 applications per hour per IP
- ✅ **Input validation** - required fields enforcement
- ✅ **Email uniqueness** - prevents duplicate subcontractors

### Admin API Security
- ✅ **Authentication required** - all endpoints check admin session
- ✅ **Authorization** - admin user verification
- ✅ **PIN validation** - 6-digit format enforcement
- ✅ **Activity logging** - all changes tracked in `subcontractor_activity`
- ✅ **Document upload validation** - file type/size checks

---

## 15. Integration Points

### With Projects System
- `project_subcontractors` junction table
- Associates subcontractors with projects via role, amount quoted/paid
- Links to `projects` table for project details

### With Admin System
- Admin authentication required for management
- Admin user IDs tracked for approvals and document uploads
- Activity logging records admin actions

### With Messaging System
- Email notifications: application confirmations, status changes
- Integration with mail service for admin alerts

### With CRM/Leads System
- Subcontractors as service providers
- Lead assignment to relevant subcontractors

---

## 16. Status Flow

```
pending → approved → active
   ↓         ↓         ↓
rejected  suspended  suspended
```

**Status Meanings:**
- **pending** - Application submitted, awaiting admin review
- **approved** - Application reviewed and approved, ready to activate
- **active** - Approved and working, can receive project assignments
- **suspended** - Temporarily inactive, can be reactivated
- **rejected** - Application denied, cannot proceed

---

## Summary Table

| Component | Purpose | Type | Key Files |
|-----------|---------|------|-----------|
| Application Page | Public signup form | Page | `src/app/subcontractors/join/page.tsx` |
| Application API | Form submission endpoint | API Route | `src/app/api/subcontractors/apply/route.ts` |
| Admin Dashboard | Manage subcontractors | Page | `src/app/admin/subcontractors/page.tsx` |
| Admin APIs | CRUD operations | API Routes | `src/app/api/admin/subcontractors/*` |
| Database Schema | Data persistence | SQL | `database/subcontractors.sql` |
| Types | TypeScript interfaces | Types | `src/types/subcontractor.ts` |
| Migrations | Schema evolution | SQL | `migrations/add_pin_to_subcontractors.sql`, `add_profile_fields_to_subcontractors.sql` |
| Auth | Access control | Library | `src/lib/tradesmanAuth.ts`, `src/lib/adminAuth.ts` |
| Utilities | Helpers & validation | Library | `src/lib/mysql.ts`, `spamDetection.ts`, `rateLimit.ts`, `recaptcha.ts`, `mailer.ts` |
