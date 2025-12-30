# 🔐 Customer Portal - Complete Guide

## Overview

The customer portal provides a comprehensive self-service experience for your clients to track projects, communicate with your team, manage documents, and pay invoices.

**Access URL:** `https://burchcontracting.com/portal`

---

## 🚀 Features

### 1. **Customer Authentication**
- ✅ Secure login with email and password
- ✅ Password reset via email token
- ✅ Registration for new customers
- ✅ Session management with cookies
- ✅ Auto-redirect to dashboard when logged in

**Test Points:**
- [ ] Try logging in with valid credentials
- [ ] Test forgot password flow
- [ ] Verify invalid login attempts are blocked
- [ ] Check session persists across page refreshes
- [ ] Verify logout works correctly

---

### 2. **Dashboard**
**Route:** `/portal/dashboard`

Features:
- Customer profile information
- List of all projects
- Quick status overview
- Password change functionality
- Project filtering and search

**Test Points:**
- [ ] Dashboard loads with customer name and email
- [ ] All projects display correctly
- [ ] Status badges show correct colors
- [ ] "View Details" buttons navigate to project pages
- [ ] Password change modal works
- [ ] Logout button redirects to login

---

### 3. **Project Tracking**
**Route:** `/portal/projects/[id]`

Features:
- **Overview Tab:**
  - Project title, description, status
  - Budget and timeline
  - Start and end dates
  - Real-time progress tracking

- **Updates Tab:**
  - Chronological project updates from admin
  - Title, description, and timestamp
  - Latest updates appear first

- **Documents Tab:** (NEW ✨)
  - View all project documents
  - Upload documents from customer side
  - Download documents
  - Delete customer-uploaded documents
  - See who uploaded each document (customer vs admin)
  - Document categories (general, contract, permit, invoice, photo)
  - Optional descriptions for uploads

**Test Points:**
- [ ] Project details load correctly
- [ ] All three tabs switch properly
- [ ] Status badge reflects current project state
- [ ] Budget displays as currency ($X,XXX.XX)
- [ ] Dates format correctly
- [ ] Updates display in reverse chronological order
- [ ] **Document upload modal opens**
- [ ] **File selection works**
- [ ] **Category dropdown functions**
- [ ] **Description textarea saves input**
- [ ] **Upload button submits successfully**
- [ ] **New document appears in list immediately**
- [ ] **Delete button only shows for customer-uploaded docs**
- [ ] **Download button works for all documents**

---

### 4. **Document Management** (NEWLY ADDED)

#### Customer Capabilities:
- ✅ Upload documents to their projects
- ✅ View all project documents
- ✅ Download any document
- ✅ Delete only their own uploads
- ✅ Add categories and descriptions
- ✅ See upload timestamps

#### Supported File Types:
- PDF documents (`.pdf`)
- Word documents (`.doc`, `.docx`)
- Excel spreadsheets (`.xls`, `.xlsx`)
- Images (`.jpg`, `.jpeg`, `.png`)

#### Upload Flow:
1. Navigate to project → Documents tab
2. Click "Upload Document" button
3. Select file from computer
4. Choose category (general, contract, permit, invoice, photo, other)
5. Add optional description
6. Click "Upload" button
7. Document appears in list instantly

**Test Points:**
- [ ] Upload modal opens when button clicked
- [ ] File input accepts valid file types
- [ ] File name and size display after selection
- [ ] Category defaults to "general"
- [ ] Description is optional
- [ ] Upload button disabled until file selected
- [ ] Upload shows "Uploading..." during process
- [ ] Success message appears after upload
- [ ] Modal closes automatically
- [ ] Document list refreshes with new upload
- [ ] Delete confirmation prompt appears
- [ ] Delete only works for customer uploads
- [ ] Download links work correctly

---

### 5. **Messaging System**
**Route:** `/portal/messages`

Features:
- Two-way communication with admin
- Message threads and replies
- Subject lines and timestamps
- Read/unread status indicators
- Send new messages
- Reply to existing threads

**Test Points:**
- [ ] Messages load correctly
- [ ] Unread messages show indicator
- [ ] New message form works
- [ ] Reply functionality works
- [ ] Messages mark as read when opened
- [ ] Admin responses appear in threads
- [ ] Timestamps format correctly

---

### 6. **Invoice Management & Payments**
**Routes:**
- `/portal/invoices` - List view
- `/portal/invoices/[id]/pay` - Payment page
- `/portal/invoices/[id]/success` - Success confirmation

Features:
- View all invoices
- Status indicators (paid, pending, overdue)
- Stripe payment integration
- Secure credit card processing
- Payment history
- Receipt downloads
- Email confirmations

**Test Points:**
- [ ] Invoice list displays correctly
- [ ] Amount formats as currency
- [ ] Due dates show correctly
- [ ] "Pay Now" button appears for unpaid invoices
- [ ] Payment page loads Stripe elements
- [ ] Card input fields render
- [ ] Test card processes successfully (4242 4242 4242 4242)
- [ ] Success page confirms payment
- [ ] Invoice status updates to "paid"
- [ ] Receipt email sends

---

## 🛠️ Admin Portal Integration

### Customer Management
**Route:** `/admin/customers/[id]`

Admin can:
- View customer details
- Edit customer information
- Create projects for customer
- Upload documents to customer projects
- Send messages to customers
- Delete customers (with confirmation)

### Document Management (Admin Side)
Admin features:
- Upload documents to any customer project
- View all customer-uploaded documents
- Delete any document
- Organize by categories
- Track who uploaded what

**Test Points:**
- [ ] Admin can see all documents
- [ ] Upload modal works from admin side
- [ ] Admin uploads show "uploaded_by: admin"
- [ ] Admin can delete any document
- [ ] Category filtering works
- [ ] Search/filter functionality

---

## 🔒 Security Features

### Authentication
- Secure password hashing (bcrypt)
- Session token validation
- HTTP-only cookies
- CSRF protection
- Auto-logout on session expiry

### Authorization
- Customers can only access their own data
- Project verification before document access
- Delete restrictions (own uploads only)
- Admin-level permissions separated

### Data Protection
- SQL injection prevention (parameterized queries)
- XSS protection (sanitized inputs)
- File upload validation
- Size limit enforcement
- Type checking on uploads

**Test Points:**
- [ ] Cannot access another customer's projects
- [ ] Cannot delete admin-uploaded documents
- [ ] Session expires after timeout
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] File size limits enforced
- [ ] Invalid file types rejected

---

## 📊 Database Schema

### `customers` Table
```sql
id, email, password_hash, name, phone, address, session_token, created_at
```

### `projects` Table
```sql
id, customer_id, title, description, status, budget, start_date, end_date, created_at
```

### `documents` Table (UPDATED ✨)
```sql
id, project_id, filename, filepath, filetype, filesize, 
uploaded_by, category, description, created_at
```

### `project_updates` Table
```sql
id, project_id, title, description, created_at
```

### `messages` Table
```sql
id, customer_id, sender_type, sender_name, subject, message, 
is_read, parent_message_id, created_at
```

### `invoices` Table
```sql
id, customer_id, invoice_number, total_amount, due_date, 
status, stripe_payment_intent_id, paid_at, created_at
```

---

## 🧪 Complete Testing Checklist

### Phase 1: Authentication
- [ ] Register new customer account
- [ ] Login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Forgot password sends email
- [ ] Reset token works within time limit
- [ ] Expired token rejected
- [ ] Password change works from dashboard
- [ ] Logout clears session

### Phase 2: Dashboard
- [ ] Dashboard loads with correct customer name
- [ ] Project count is accurate
- [ ] All project statuses display correctly
- [ ] Navigation to project details works
- [ ] Profile information is accurate
- [ ] Edit profile functionality works

### Phase 3: Project Tracking
- [ ] Project overview shows all details
- [ ] Budget displays correctly
- [ ] Timeline dates are accurate
- [ ] Status badge shows correct color
- [ ] Updates tab loads chronologically
- [ ] Documents tab displays existing docs

### Phase 4: Document Upload (PRIORITY)
- [ ] Upload button is visible
- [ ] Modal opens when clicked
- [ ] File selection dialog works
- [ ] File name displays after selection
- [ ] File size calculates correctly
- [ ] Category dropdown has all options
- [ ] Description field accepts text
- [ ] Upload button enables with file
- [ ] Upload shows progress indicator
- [ ] Success message appears
- [ ] Document appears in list
- [ ] Timestamp is current
- [ ] Download button works
- [ ] Delete button only shows for customer uploads
- [ ] Delete confirmation works
- [ ] Document removal refreshes list

### Phase 5: Messaging
- [ ] Message list loads
- [ ] New message form works
- [ ] Subject and body save correctly
- [ ] Reply functionality works
- [ ] Read status updates
- [ ] Timestamps are accurate

### Phase 6: Payments
- [ ] Invoice list displays
- [ ] Pay button navigates correctly
- [ ] Stripe form loads
- [ ] Test card processes
- [ ] Success page confirms
- [ ] Status updates to paid
- [ ] Receipt email sends

### Phase 7: Admin Integration
- [ ] Admin can upload documents
- [ ] Admin documents show correctly
- [ ] Admin can delete any document
- [ ] Customer documents visible to admin
- [ ] Categories sync between admin/customer

### Phase 8: Security
- [ ] Cannot access other customer data
- [ ] Session timeout works
- [ ] Invalid tokens rejected
- [ ] SQL injection blocked
- [ ] XSS attempts sanitized
- [ ] File upload validation works

---

## 🚨 Known Issues & Limitations

### Current Limitations:
1. **File Storage:** Currently using base64 encoding (not ideal for production)
   - **Recommendation:** Integrate with AWS S3, Cloudinary, or similar
   - **Impact:** Limited to smaller files (<5MB recommended)

2. **Email Notifications:** Not implemented for document uploads
   - **Recommendation:** Add email alerts when documents are uploaded

3. **Document Versioning:** No version control
   - **Recommendation:** Consider adding version history

4. **Bulk Operations:** No bulk upload/delete
   - **Recommendation:** Add multi-select functionality

### Planned Enhancements:
- [ ] Cloud storage integration (S3/Cloudinary)
- [ ] Document preview (for images/PDFs)
- [ ] Email notifications for uploads
- [ ] Document search and filtering
- [ ] Bulk operations
- [ ] Document categories management
- [ ] Document expiration dates
- [ ] Document approval workflow
- [ ] Mobile app support
- [ ] Push notifications

---

## 🔧 Configuration

### Environment Variables Required:
```env
# Database
MYSQL_HOST=srv1204.hstgr.io
MYSQL_PORT=3306
MYSQL_USER=u239178742_cscottburch
MYSQL_PASSWORD=Breana3397@@
MYSQL_DATABASE=u239178742_burch_contract

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App
NEXT_PUBLIC_APP_URL=https://burchcontracting.com
```

---

## 📱 Mobile Responsiveness

All portal pages are mobile-responsive:
- ✅ Touch-friendly buttons (48x48px minimum)
- ✅ Responsive grid layouts
- ✅ Mobile navigation menu
- ✅ Optimized for tablets and phones
- ✅ Accessible form inputs

**Test Devices:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (Chrome, Firefox, Edge)

---

## 🎯 Success Metrics

Track these KPIs:
- Customer login frequency
- Document upload count
- Message response time
- Invoice payment time
- Feature adoption rate
- Customer satisfaction
- Support ticket reduction

---

## 📞 Support

For issues or questions:
- **Email:** support@burchcontracting.com
- **Phone:** (864) 724-4600
- **Admin Portal:** https://burchcontracting.com/admin

---

## ✅ Deployment Checklist

Before going live:
- [ ] All tests pass
- [ ] Database migrations complete
- [ ] Environment variables set
- [ ] Stripe keys configured (production)
- [ ] Email service configured
- [ ] SSL certificate active
- [ ] Cloud storage configured (optional but recommended)
- [ ] Backup system in place
- [ ] Error monitoring active (Sentry recommended)
- [ ] Analytics tracking (Google Analytics)
- [ ] Customer documentation ready
- [ ] Staff training completed

---

**Last Updated:** December 30, 2025  
**Version:** 2.0  
**Status:** ✅ Feature Complete - Document Upload Added
