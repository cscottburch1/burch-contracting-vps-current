# Burch Contracting - Implementation Guide

## Quick Start

This guide shows how to implement the new components created in the Local SEO overhaul.

## New Components Created

### 1. ClickableCityGrid
**Path:** `src/components/locations/ClickableCityGrid.tsx`

**Usage:**
```tsx
import { ClickableCityGrid } from '@/components/locations/ClickableCityGrid';

// In any page
<ClickableCityGrid 
  title="Proudly Serving Upstate South Carolina"
  description="Click on your city to see local services, projects, and pricing"
  columns={3}
  showDistance={true}
  showPopulation={false}
/>

// Compact variant (for smaller sections)
<ClickableCityGrid 
  compact={true}
  columns={4}
/>
```

**Best used on:**
- Homepage
- Service area pages
- Contact page
- Calculator pages (bottom section)

---

### 2. EEATSignals
**Path:** `src/components/seo/EEATSignals.tsx`

**Usage:**
```tsx
import { EEATSignals } from '@/components/seo/EEATSignals';

// Full variant (most detailed)
<EEATSignals variant="full" />

// Compact variant (4-column grid)
<EEATSignals variant="compact" />

// Minimal variant (single line)
<EEATSignals variant="minimal" />

// Custom configuration
<EEATSignals 
  variant="compact"
  showBBB={true}
  showGoogleRating={true}
  showExperience={true}
  showLicensing={true}
  showCredentials={true}
/>
```

**Best used on:**
- Every service page (top of page)
- Calculator results
- Contact page
- About page

---

### 3. UniversalPageTemplate
**Path:** `src/components/templates/UniversalPageTemplate.tsx`

**Usage:**
```tsx
import { UniversalPageTemplate } from '@/components/templates/UniversalPageTemplate';

export default function ServicePage() {
  return (
    <UniversalPageTemplate
      title="Custom Deck Building in Simpsonville, SC"
      description="Professional deck construction with 30+ years of experience"
      breadcrumbs={[
        { label: 'Services', href: '/services' },
        { label: 'Decks', href: '/services/decks' },
        { label: 'Simpsonville' }
      ]}
      showAuthor={true}
      author={{
        name: 'Robert Burch',
        role: 'Owner & Lead Contractor',
        experience: '30+ years in residential construction'
      }}
      showCredentials={true}
      credentialsVariant="compact"
      lastUpdated={new Date('2024-04-17')}
      relatedPages={[
        {
          title: 'Screened Porches',
          href: '/services/screened-porches',
          description: 'Add comfort to your outdoor space'
        },
        {
          title: 'Deck Calculator',
          href: '/calculator/decks',
          description: 'Estimate your deck project cost'
        }
      ]}
      showCTA={true}
      ctaTitle="Ready to Start Your Deck Project?"
      ctaDescription="Get a free estimate from Upstate SC's most trusted deck builder"
      schemaType="Service"
      maxWidth="xl"
    >
      {/* Your page content here */}
      <div className="prose max-w-none">
        <h2>About Our Deck Building Services</h2>
        <p>Your content...</p>
      </div>
    </UniversalPageTemplate>
  );
}
```

**Wrap these pages:**
- All service pages
- All location pages
- All calculator pages
- About page
- Project gallery pages

---

### 4. AdvancedCalculator
**Path:** `src/components/calculators/AdvancedCalculator.tsx`

**Usage:**
```tsx
'use client';

import { useState } from 'react';
import { AdvancedCalculator } from '@/components/calculators/AdvancedCalculator';

export default function DeckCalculator() {
  const [calculatorResult, setCalculatorResult] = useState(null);

  // Your existing calculation logic
  const calculateDeckCost = (inputs) => {
    // ... calculation
    return {
      total: 15000,
      breakdown: [
        { label: 'Materials', value: 8000, description: 'Pressure-treated lumber, hardware' },
        { label: 'Labor', value: 5000, description: 'Installation and finishing' },
        { label: 'Permits', value: 500, description: 'Building permits and inspections' },
        { label: 'Overhead & Profit', value: 1500, description: '22.5% markup' }
      ],
      inputs: {
        size: inputs.squareFootage + ' sq ft',
        material: inputs.material,
        location: inputs.city
      },
      projectType: 'Deck Construction',
      timestamp: new Date()
    };
  };

  return (
    <div>
      {/* Your existing calculator inputs */}
      
      {/* Show advanced calculator when results calculated */}
      {calculatorResult && (
        <AdvancedCalculator
          result={calculatorResult}
          onShowMathChange={(show) => console.log('Show math:', show)}
          onSave={() => console.log('Saved to localStorage')}
          onPrint={() => console.log('Printing...')}
          onRequestQuote={() => window.location.href = '/contact'}
        />
      )}
    </div>
  );
}
```

**Add to:**
- All 12 calculator pages

**Required NPM packages:**
```bash
npm install html2canvas jspdf
```

---

### 5. MultiStepEstimateForm
**Path:** `src/components/forms/MultiStepEstimateForm.tsx`

**Usage:**
```tsx
import { MultiStepEstimateForm } from '@/components/forms/MultiStepEstimateForm';

export default function ContactPage() {
  const handleSubmit = async (formData) => {
    // Send to API
    const response = await fetch('/api/estimates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      // Redirect to thank you page
      window.location.href = '/thank-you';
    }
  };

  return (
    <div className="py-12">
      <MultiStepEstimateForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Best used on:**
- Contact page
- Get Started page
- Bottom of service pages (in a modal/popup)

---

### 6. Schema Builders
**Path:** `src/lib/schema-builders.tsx`

**Usage:**
```tsx
import { 
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateFAQSchema,
  injectSchema
} from '@/lib/schema-builders';

export default function DeckServicePage() {
  // Generate schemas
  const serviceSchema = generateServiceSchema({
    serviceName: 'Custom Deck Building',
    serviceType: 'DeckBuilding',
    description: 'Professional custom deck construction in Upstate SC',
    url: 'https://burchcontracting.com/services/decks',
    priceRange: '$5,000 - $50,000',
    areaServed: [
      { city: 'Simpsonville', state: 'SC' },
      { city: 'Fountain Inn', state: 'SC' }
    ]
  });

  const faqSchema = generateFAQSchema([
    {
      question: 'How much does a deck cost?',
      answer: 'Deck costs typically range from $25-50 per square foot depending on materials and complexity.'
    },
    {
      question: 'How long does deck construction take?',
      answer: 'Most decks take 5-10 business days to complete, weather permitting.'
    }
  ]);

  return (
    <>
      {/* Inject schemas into page head */}
      {injectSchema(serviceSchema)}
      {injectSchema(faqSchema)}
      
      {/* Your page content */}
    </>
  );
}
```

---

## Step-by-Step Integration

### Phase 1: Add E-E-A-T Signals to Existing Pages

1. **Homepage** (`src/app/page.tsx`)
```tsx
import { EEATSignals } from '@/components/seo/EEATSignals';
import { ClickableCityGrid } from '@/components/locations/ClickableCityGrid';

// Add after hero section
<EEATSignals variant="compact" />

// Add before footer
<ClickableCityGrid />
```

2. **All Service Pages** (`src/app/services/*/page.tsx`)
```tsx
import { UniversalPageTemplate } from '@/components/templates/UniversalPageTemplate';

// Wrap entire page content
<UniversalPageTemplate
  title="Service Name"
  breadcrumbs={...}
  showAuthor={true}
  showCredentials={true}
>
  {/* existing content */}
</UniversalPageTemplate>
```

3. **Calculator Pages** (`src/app/calculator/*/page.tsx`)
```tsx
import { AdvancedCalculator } from '@/components/calculators/AdvancedCalculator';

// Add after calculation results display
{result && (
  <AdvancedCalculator
    result={result}
    onRequestQuote={() => router.push('/contact')}
  />
)}
```

---

### Phase 2: Add Schema Markup

Create `src/app/layout-schema.tsx`:
```tsx
import { generateLocalBusinessSchema, injectSchema } from '@/lib/schema-builders';

export function RootSchema() {
  const businessSchema = generateLocalBusinessSchema();
  return injectSchema(businessSchema);
}
```

Add to `src/app/layout.tsx`:
```tsx
import { RootSchema } from './layout-schema';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <RootSchema />
        {children}
      </body>
    </html>
  );
}
```

---

### Phase 3: Add Multi-Step Form to Contact Page

Update `src/app/contact/page.tsx`:
```tsx
import { MultiStepEstimateForm } from '@/components/forms/MultiStepEstimateForm';

export default function ContactPage() {
  return (
    <div>
      <h1>Request a Free Estimate</h1>
      <MultiStepEstimateForm 
        onSubmit={async (data) => {
          await fetch('/api/estimates', {
            method: 'POST',
            body: JSON.stringify(data)
          });
        }}
      />
    </div>
  );
}
```

---

## Installation Requirements

### NPM Packages
```bash
npm install html2canvas jspdf
```

### Environment Variables
No additional environment variables needed for basic functionality.

For full lead tracking integration, add to `.env.local`:
```env
# Lead tracking (if using API)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
ESTIMATE_NOTIFICATION_EMAIL=estimates@burchcontracting.com
```

---

## Example Page Updates

### Example 1: Update Homepage
**File:** `src/app/page.tsx`

```tsx
import { EEATSignals } from '@/components/seo/EEATSignals';
import { ClickableCityGrid } from '@/components/locations/ClickableCityGrid';

export default function HomePage() {
  return (
    <>
      {/* Existing hero section */}
      <HeroSection />
      
      {/* NEW: Add E-E-A-T signals */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <EEATSignals variant="compact" />
        </div>
      </section>
      
      {/* Existing sections */}
      <ServicesSection />
      <ProjectsSection />
      
      {/* NEW: Add city grid before footer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ClickableCityGrid />
        </div>
      </section>
    </>
  );
}
```

### Example 2: Update Deck Calculator
**File:** `src/app/calculator/decks/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { AdvancedCalculator } from '@/components/calculators/AdvancedCalculator';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';

export default function DecksCalculatorPage() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [calculatorResult, setCalculatorResult] = useState(null);

  const handleCalculationComplete = (result) => {
    setCalculatorResult({
      total: result.total,
      breakdown: [
        { label: 'Base Materials', value: result.directCosts, description: 'Lumber, hardware, fasteners' },
        { label: 'Labor Cost', value: result.laborCost, description: 'Professional installation' },
        { label: 'Location Factor', value: result.locationAdjustment, description: 'Local market adjustment' },
        { label: 'Overhead & Profit', value: result.overheadProfit, description: '22.5% markup' }
      ],
      inputs: {
        size: result.squareFootage + ' sq ft',
        material: result.material,
        location: result.location
      },
      projectType: 'Deck Construction',
      timestamp: new Date()
    });
    setShowAdvanced(true);
  };

  return (
    <>
      <CompetitivePricingCalculator
        serviceKey="decks"
        title="Deck Cost Calculator"
        intro="Plan your deck project with competitive local pricing"
        icon="Trees"
        marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
        onCalculate={handleCalculationComplete}
      />
      
      {showAdvanced && calculatorResult && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <AdvancedCalculator
              result={calculatorResult}
              onRequestQuote={() => window.location.href = '/contact'}
            />
          </div>
        </section>
      )}
    </>
  );
}
```

### Example 3: Create New Service Page with Universal Template
**File:** `src/app/services/decks/simpsonville/page.tsx`

```tsx
import { UniversalPageTemplate } from '@/components/templates/UniversalPageTemplate';
import { generateServiceSchema, generateFAQSchema, injectSchema } from '@/lib/schema-builders';

export default function SimpsonvilleDeckPage() {
  const serviceSchema = generateServiceSchema({
    serviceName: 'Custom Deck Building in Simpsonville, SC',
    serviceType: 'DeckBuilding',
    description: 'Professional deck construction serving Simpsonville and surrounding Upstate SC',
    url: 'https://burchcontracting.com/services/decks/simpsonville',
    priceRange: '$8,000 - $40,000',
    areaServed: [{ city: 'Simpsonville', state: 'SC' }]
  });

  const faqSchema = generateFAQSchema([
    {
      question: 'How much does a deck cost in Simpsonville, SC?',
      answer: 'Deck costs in Simpsonville typically range from $25-50 per square foot depending on materials, size, and complexity. A 300 sq ft deck averages $8,000-$15,000.'
    },
    {
      question: 'Do I need a permit for a deck in Simpsonville?',
      answer: 'Yes, most decks over 200 square feet or attached to a home require a building permit in Simpsonville. We handle all permit applications for you.'
    }
  ]);

  return (
    <>
      {injectSchema(serviceSchema)}
      {injectSchema(faqSchema)}
      
      <UniversalPageTemplate
        title="Custom Deck Building in Simpsonville, SC"
        description="Burch Contracting builds beautiful, durable custom decks for Simpsonville homeowners. 30+ years experience, BBB A+ rated, free estimates."
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: 'Decks', href: '/services/decks' },
          { label: 'Simpsonville' }
        ]}
        showAuthor={true}
        showCredentials={true}
        credentialsVariant="compact"
        lastUpdated={new Date('2024-04-17')}
        relatedPages={[
          {
            title: 'Screened Porches Simpsonville',
            href: '/services/screened-porches/simpsonville',
            description: 'Add a screened porch for outdoor comfort'
          },
          {
            title: 'Deck Cost Calculator',
            href: '/calculator/decks',
            description: 'Estimate your deck project cost'
          },
          {
            title: 'Deck Photo Gallery',
            href: '/projects/decks',
            description: 'See our completed Simpsonville deck projects'
          }
        ]}
        schemaType="Service"
      >
        <div className="prose max-w-none">
          <h2>Simpsonville's Premier Deck Builder Since 1995</h2>
          <p>
            Burch Contracting has been building exceptional custom decks for Simpsonville homeowners for over 30 years. 
            Located just minutes away in Gray Court, we've completed hundreds of deck projects throughout the Simpsonville area.
          </p>

          <h2>Our Deck Building Services in Simpsonville</h2>
          <ul>
            <li><strong>Custom Pressure-Treated Decks</strong> - Classic, durable, and affordable</li>
            <li><strong>Composite Decking</strong> - Low-maintenance Trex, Azek, and TimberTech</li>
            <li><strong>Multi-Level Decks</strong> - Maximize your outdoor living space</li>
            <li><strong>Deck Pergolas & Rails</strong> - Add shade and style</li>
            <li><strong>Deck Repairs & Refinishing</strong> - Restore your existing deck</li>
          </ul>

          <h2>Why Choose Burch Contracting for Your Simpsonville Deck?</h2>
          <ul>
            <li><strong>Local Expertise</strong> - 30+ years serving Simpsonville and Greenville County</li>
            <li><strong>Licensed & Insured</strong> - Fully certified South Carolina General Contractor</li>
            <li><strong>BBB A+ Rated</strong> - A+ Rating since 2014 with perfect consumer reviews</li>
            <li><strong>Google 5.0 Stars</strong> - Hundreds of verified 5-star reviews from real customers</li>
            <li><strong>Free Estimates</strong> - No-obligation on-site consultation and detailed quote</li>
            <li><strong>Transparent Pricing</strong> - Clear, itemized estimates with no hidden fees</li>
          </ul>

          <h2>Simpsonville Deck Building Process</h2>
          <ol>
            <li><strong>Free Consultation</strong> - We visit your property to discuss your vision</li>
            <li><strong>Custom Design</strong> - We create a deck design tailored to your home</li>
            <li><strong>Permit Handling</strong> - We manage all permitting with the City of Simpsonville</li>
            <li><strong>Professional Installation</strong> - Our experienced crew builds your deck</li>
            <li><strong>Final Inspection</strong> - We ensure everything meets code and your approval</li>
          </ol>

          <h2>Deck Permit Requirements in Simpsonville, SC</h2>
          <p>
            The City of Simpsonville requires building permits for most deck projects. Burch Contracting handles all 
            permit applications, inspections, and code compliance so you don't have to worry about the paperwork.
          </p>

          <h2>Frequently Asked Questions</h2>
          
          <h3>How much does a deck cost in Simpsonville?</h3>
          <p>
            Deck costs vary based on size, materials, and features. A typical 300 sq ft pressure-treated deck ranges 
            from $8,000-$12,000, while composite decks range from $12,000-$18,000. Use our free deck calculator for 
            an instant estimate.
          </p>

          <h3>How long does deck construction take?</h3>
          <p>
            Most residential decks take 5-10 business days to complete, weather permitting. Larger or more complex 
            projects may take 2-3 weeks.
          </p>

          <h3>What's the best deck material for Simpsonville's climate?</h3>
          <p>
            Both pressure-treated wood and composite decking perform well in Simpsonville's climate. Pressure-treated 
            is more affordable upfront, while composite requires less maintenance long-term. We'll help you choose based 
            on your budget and preferences.
          </p>
        </div>
      </UniversalPageTemplate>
    </>
  );
}
```

---

## Priority Implementation Order

### Week 1: High-Impact Quick Wins
1. ✅ Add `EEATSignals` to homepage (compact variant)
2. ✅ Add `ClickableCityGrid` to homepage
3. ✅ Add `EEATSignals` to all calculator pages (minimal variant)
4. ✅ Inject `LocalBusinessSchema` into root layout

### Week 2: Universal Template Rollout
1. ✅ Wrap all service pages with `UniversalPageTemplate`
2. ✅ Wrap all location pages with `UniversalPageTemplate`
3. ✅ Add breadcrumbs to all pages
4. ✅ Add author bylines to service pages

### Week 3: Calculator Enhancements
1. ✅ Install `html2canvas` and `jspdf` packages
2. ✅ Integrate `AdvancedCalculator` into deck calculator (pilot)
3. ✅ Roll out to remaining 11 calculators
4. ✅ Test Save/Print/PDF features

### Week 4: Forms & Conversion
1. ✅ Add `MultiStepEstimateForm` to contact page
2. ✅ Create API endpoint for form submissions
3. ✅ Add form to bottom of service pages (modal)
4. ✅ Test form submission and email notifications

---

## Testing Checklist

- [ ] All pages load without errors
- [ ] `ClickableCityGrid` links work correctly
- [ ] `EEATSignals` displays proper credentials
- [ ] `AdvancedCalculator` Show Math toggle works
- [ ] `AdvancedCalculator` Save function works (check localStorage)
- [ ] `AdvancedCalculator` Print function works
- [ ] `AdvancedCalculator` PDF generation works
- [ ] `MultiStepEstimateForm` validation works
- [ ] `MultiStepEstimateForm` submission works
- [ ] Schema markup validates (use Google Rich Results Test)
- [ ] All breadcrumbs navigate correctly
- [ ] Mobile responsive on all new components

---

## SEO Validation

After implementation, validate using:

1. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - Test each page type (service, location, calculator)
   - Verify LocalBusiness, Service, BreadcrumbList schemas

2. **Google Search Console**
   - Submit updated sitemap
   - Check for structured data errors
   - Monitor coverage and indexing

3. **PageSpeed Insights**
   - Test homepage, service pages, calculator pages
   - Ensure new components don't degrade performance
   - Target: 90+ desktop, 70+ mobile

---

## Support

For questions or issues:
- Email: dev@burchcontracting.com
- Phone: (864) 724-4600

---

## Change Log

- **2024-04-17**: Initial component creation and documentation
- All components created with TypeScript and full accessibility support
- All components optimized for SEO and conversion
