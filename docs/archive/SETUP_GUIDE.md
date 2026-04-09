# 🚀 Document Management & Stripe Payments - Setup Guide

## ✅ What's Been Completed

### Backend Infrastructure (100% Complete)
- ✅ Database schemas created for documents and payments
- ✅ Stripe SDK added to package.json (v17.5.0)
- ✅ Document upload API (GET, POST, DELETE, PATCH)
- ✅ Stripe payment intent API
- ✅ Stripe webhook handler
- ✅ Migration endpoints for both systems

### Frontend Components (100% Complete)
- ✅ Document upload modal in subcontractor management
- ✅ Document list with status management
- ✅ Customer payment checkout page
- ✅ Payment success page
- ✅ Migration buttons added to /admin/migrate page

---

## 🔧 Required Setup Steps

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- `stripe` (v17.5.0) - Server-side Stripe SDK
- `@stripe/stripe-js` (v5.2.0) - Client-side Stripe SDK
- `@stripe/react-stripe-js` (v3.2.0) - Stripe React components

### Step 2: Configure Stripe Environment Variables

Add these to your `.env.local` file (see `.env.stripe.example` for template):

```env
# Get these from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Get this from https://dashboard.stripe.com/webhooks after creating webhook
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Your application base URL
NEXT_PUBLIC_BASE_URL=https://burchcontracting.com:3000
```

### Step 3: Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://burchcontracting.com:3000/api/payments/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Step 4: Run Database Migrations

**IMPORTANT ORDER:**

1. **First: Fix Projects Schema** (if not done already)
   - Navigate to: `/admin/tools/fix-projects`
   - Click: "Backup Old Table & Create New Schema"
   - This fixes the schema mismatch blocking customer deletion

2. **Second: Run Documents Migration**
   - Navigate to: `/admin/migrate`
   - Scroll to: "📄 Document Management Migration"
   - Click: "Run Documents Migration"
   - Wait for success message

3. **Third: Run Payments Migration**
   - Stay on: `/admin/migrate`
   - Scroll to: "💳 Stripe Payments Migration"
   - Click: "Run Payments Migration"
   - Wait for success message

### Step 5: Build and Deploy

```bash
# Build the application
npm run build

# On production server:
ssh root@72.60.166.68
cd /var/www/burch-contracting
git pull
npm install
npm run build
pm2 restart burch-site
```

---

## 🎯 Feature Overview

### Document Management System

**For Subcontractors:**
- Upload licenses, insurance, W-9 forms, certificates
- Track expiration dates for compliance
- Approval workflow (pending → approved/rejected/expired)
- Download and delete documents
- File validation: Max 10MB, PDF/JPG/PNG/DOC/DOCX/XLS/XLSX

**Access:**
- Admin: `/admin/subcontractors` → Click subcontractor → "Upload Documents"
- API: `/api/admin/subcontractors/[id]/documents`

**Database Tables:**
- `subcontractor_documents`
- `customer_documents`
- `project_documents`

### Stripe Payment Processing

**For Customers:**
- Pay invoices online with credit card or ACH
- Credit cards: 2.9% + $0.30 per transaction
- ACH transfers: 0.8% (max $5) - significant savings on large invoices
- Automatic receipt generation
- Real-time payment status updates

**Access:**
- Customer: `/portal/invoices/[id]/pay`
- Success: `/portal/invoices/[id]/success`
- API: `/api/payments/create-intent`, `/api/payments/webhook`

**Database Tables:**
- `payments` - Tracks all payment attempts
- `customer_stripe_info` - Links customers to Stripe IDs
- `invoices` - Altered with payment tracking columns

---

## 📋 Testing Checklist

### Document Management Testing

- [ ] Upload a license document
- [ ] Upload an insurance document with expiration date
- [ ] View document list
- [ ] Change document status (pending → approved)
- [ ] Download a document
- [ ] Delete a document
- [ ] Verify file is removed from disk after deletion

### Stripe Payments Testing

**Test Mode Setup:**
1. Use Stripe test keys (start with `sk_test_` and `pk_test_`)
2. Test card numbers from: https://stripe.com/docs/testing

**Test Cases:**
- [ ] Create an invoice
- [ ] Navigate to payment page
- [ ] Enter test card: `4242 4242 4242 4242` (any future expiry, any CVC)
- [ ] Complete payment
- [ ] Verify webhook updates payment status
- [ ] Check invoice shows as paid
- [ ] Test failure with card: `4000 0000 0000 0002`
- [ ] Verify error handling

**Test ACH Payment:**
- [ ] Use test bank account numbers from Stripe docs
- [ ] Verify 0.8% fee calculation
- [ ] Check 3-5 day processing time message

---

## 🔐 Security Notes

- All document uploads are admin-only (verified via `getCurrentAdminUser`)
- Payment intents include Stripe signature verification
- Webhooks verify `STRIPE_WEBHOOK_SECRET` signature
- Files stored in `/public/uploads/` with unique naming
- Customer payments require valid session

---

## 💡 Future Enhancements

**Priority: MEDIUM**
1. Document expiration email alerts (30 days, 7 days before expiry)
2. Admin payment dashboard at `/admin/payments`
3. Refund capability through admin interface
4. Customer document upload from portal
5. Project document management
6. Export payments to CSV for accounting

**Priority: LOW**
1. Bulk document upload
2. Document templates
3. E-signature integration
4. Recurring payments / subscriptions
5. Payment plans for large invoices

---

## 🆘 Troubleshooting

### "Stripe is not defined" Error
- Check `.env.local` has `STRIPE_SECRET_KEY` set
- Restart Next.js dev server after adding env vars
- Verify package.json has `stripe` dependency installed

### Webhook Not Receiving Events
- Verify webhook URL is correct in Stripe dashboard
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/payments/webhook`

### Documents Not Uploading
- Check `/public/uploads/subcontractors/` directory exists and is writable
- Verify file size is under 10MB
- Check file type is allowed: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX
- Review browser console for errors

### Payment Page Not Loading
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check invoice exists and has correct `customer_id`
- Ensure Stripe account is activated (not in restricted mode)

---

## 📞 Support

For Stripe-specific issues:
- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

For application issues:
- Check PM2 logs: `pm2 logs burch-site`
- Review browser console for frontend errors
- Check `/admin/tools/diagnose-projects` for database issues

---

## 🎉 You're Ready!

Once you complete the setup steps above, you'll have:
- ✅ Full document management for subcontractors
- ✅ Online invoice payments via Stripe
- ✅ Automatic payment tracking and updates
- ✅ Professional payment experience for customers
- ✅ Significant cost savings with ACH payments

**Next Action:** Run `npm install` and follow Step 2-5 above!
