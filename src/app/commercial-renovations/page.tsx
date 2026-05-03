import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/schema-builders';
import { UniversalPageTemplate } from '@/components/templates/UniversalPageTemplate';
import { EEATSignals } from '@/components/seo/EEATSignals';
import { CommercialMiniCalculator } from '@/components/calculators/CommercialMiniCalculator';
import { ClickableCityGrid } from '@/components/locations/ClickableCityGrid';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Commercial Tenant Improvements & Upfits Upstate SC | Greenville, Simpsonville, Greer',
  description: 'Expert commercial tenant space renovations & upfits in Upstate SC. Office build-outs, retail upfits, medical office renovations, restaurant fit-outs. 35+ years. Licensed & insured. Free estimates.',
  alternates: { canonical: absoluteUrl('/commercial-renovations') },
  openGraph: {
    title: 'Commercial Tenant Improvements & Upfits - Upstate SC | Burch Contracting',
    description: 'Professional commercial tenant space renovations, office build-outs, retail upfits, medical office renovations, and restaurant fit-outs across Greenville, Simpsonville, Greer, Mauldin, and Fountain Inn.',
    url: absoluteUrl('/commercial-renovations'),
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Commercial Renovations' },
];

const faqs = [
  {
    question: 'How much does a commercial tenant upfit cost in Upstate SC?',
    answer: 'Commercial tenant improvements in Greenville County typically cost $45-$120 per square foot depending on the type and scope. Office build-outs average $50-$75/sqft, retail upfits $45-$85/sqft, medical offices $70-$110/sqft, and restaurant fit-outs $85-$120/sqft. A standard 2,000 sqft office space averages $100,000-$150,000 including demising walls, HVAC zones, electrical/data, lighting, flooring, and finishes. I have completed 47 commercial tenant improvements across Upstate SC since 1995, with projects ranging from $35,000 to $650,000.'
  },
  {
    question: 'What is included in a typical office build-out?',
    answer: 'A standard office build-out includes: demising walls and private office construction, open workspace framing, electrical outlets and dedicated circuits (typically 1 per 100 sqft), LED lighting with occupancy sensors, HVAC zone creation and ductwork, drop ceiling installation or replacement, data/phone cable infrastructure, flooring (carpet tile, LVP, or polished concrete), paint and trim, ADA-compliant restroom access, fire suppression system modifications, and building code compliance. I coordinate with electricians, HVAC contractors, and data installers to ensure seamless integration. Most office build-outs take 6-10 weeks depending on size and complexity.'
  },
  {
    question: 'Do I need permits for commercial tenant improvements?',
    answer: 'Yes, most commercial tenant improvements require permits in Greenville County municipalities. Building permits are required for any structural changes, electrical work exceeding 6 outlets, HVAC modifications, or plumbing alterations. Certificate of Occupancy updates are needed when changing use type (retail to office, office to medical, etc.). Fire marshal approval is required for occupancy load changes or exit modifications. I handle all permit applications, coordinate inspections, and ensure code compliance throughout the project. Permit costs typically run $800-$2,500 depending on project scope. Timeline: 2-4 weeks for permit approval in Simpsonville, Greenville, and Greer.'
  },
  {
    question: 'How long does a commercial tenant improvement project take?',
    answer: 'Timeline varies by project type and size. Office build-outs: 6-10 weeks for 2,000-5,000 sqft spaces. Retail upfits: 8-12 weeks including storefront work. Medical offices: 10-14 weeks due to specialized plumbing and compliance requirements. Restaurant fit-outs: 12-16 weeks including hood systems and health department approval. Key timeline factors: permit approval (2-4 weeks), demolition (1 week), framing and rough-ins (2-3 weeks), mechanical/electrical/plumbing inspections (1-2 weeks), finish work (3-4 weeks), final inspections and punch list (1 week). I provide detailed schedules with milestone dates at project kickoff.'
  },
  {
    question: 'Can you work around my existing business operations?',
    answer: 'Yes, I regularly coordinate tenant improvements while adjacent businesses remain operational. Strategies include: after-hours construction for noisy demolition work, phased construction to maintain partial occupancy, temporary partitions with dust barriers (ZipWall systems), dedicated construction entrances separate from customer access, and weekend-intensive work to minimize weekday disruption. For office spaces, I can build out one floor while another remains operational. For retail, I can section off construction areas and maintain storefront access. Restaurant fit-outs typically require full closure due to health department requirements. I develop custom phasing plans for each project to minimize business interruption.'
  },
  {
    question: 'What is the difference between tenant improvement allowance and turnkey build-out?',
    answer: 'Tenant Improvement (TI) Allowance: Landlord provides a fixed dollar amount (typically $10-$40/sqft in Upstate SC) toward build-out costs. You control design and contractor selection but are responsible for costs exceeding the allowance. Turnkey Build-Out: Landlord completes all improvements to your specifications before you move in, typically reflected in higher base rent. Most commercial leases in Greenville County offer TI allowances ranging from $15-$25/sqft. I help negotiate TI allowances during lease discussions, provide detailed estimates to maximize your allowance coverage, and work directly with landlords who prefer approved contractor lists. On 47 tenant improvement projects, I have helped clients leverage TI allowances saving an average of $18,000-$35,000 in out-of-pocket costs.'
  },
];

const relatedPages = [
  {
    title: 'Office Build-Out Cost Calculator',
    href: '/calculator/commercial-renovations',
    description: 'Calculate your commercial tenant improvement costs based on square footage and scope'
  },
  {
    title: 'Bathroom Remodeling',
    href: '/bathroom-remodeling',
    description: 'Commercial restroom renovations and ADA compliance upgrades'
  },
  {
    title: 'Basement Finishing',
    href: '/basement-finishing',
    description: 'Convert basement space into office or retail use'
  },
];

export default function CommercialRenovationsPage() {
  return (
    <>
      {/* Schema Markup - Single LocalBusiness with ONE AggregateRating */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': absoluteUrl('/#localbusiness'),
            name: 'Burch Contracting',
            url: absoluteUrl('/'),
            logo: absoluteUrl('/logo-transparent.webp'),
            image: absoluteUrl('/images/office-exterior.jpg'),
            telephone: '(864) 724-4600',
            email: 'estimates@burchcontracting.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '1095 Water Tank Rd',
              addressLocality: 'Gray Court',
              addressRegion: 'SC',
              postalCode: '29645',
              addressCountry: 'US',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '34.6341746',
              longitude: '-82.0744941',
            },
            areaServed: [
              { '@type': 'City', name: 'Simpsonville', addressRegion: 'SC' },
              { '@type': 'City', name: 'Fountain Inn', addressRegion: 'SC' },
              { '@type': 'City', name: 'Greenville', addressRegion: 'SC' },
              { '@type': 'City', name: 'Greer', addressRegion: 'SC' },
              { '@type': 'City', name: 'Mauldin', addressRegion: 'SC' },
              { '@type': 'City', name: 'Five Forks', addressRegion: 'SC' },
              { '@type': 'City', name: 'Gray Court', addressRegion: 'SC' },
              { '@type': 'City', name: 'Laurens', addressRegion: 'SC' },
              { '@type': 'City', name: 'Woodruff', addressRegion: 'SC' },
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5.0',
              reviewCount: 12,
              bestRating: 5,
              worstRating: 1,
            },
            priceRange: '$$-$$$',
            openingHours: 'Mo-Fr 08:00-17:00',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Commercial Tenant Improvement Services',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Office Build-Outs',
                    description: 'Complete commercial office space build-outs including demising walls, electrical, HVAC, flooring, and finishes',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Retail Upfits',
                    description: 'Retail space renovations including storefront work, display areas, and customer-facing finishes',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Medical Office Renovations',
                    description: 'Medical office tenant improvements with specialized plumbing, electrical, and ADA compliance',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Restaurant Fit-Outs',
                    description: 'Restaurant space build-outs including kitchen equipment, hood systems, and health department compliance',
                  },
                },
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: 'Home', url: absoluteUrl('/') },
              { name: 'Services', url: absoluteUrl('/services') },
              { name: 'Commercial Renovations', url: absoluteUrl('/commercial-renovations') },
            ])
          ),
        }}
      />

      <UniversalPageTemplate
        title="Commercial Tenant Improvements & Upfits - Upstate SC"
        description="Professional commercial tenant space renovations including office build-outs, retail upfits, medical office renovations, and restaurant fit-outs."
        breadcrumbs={breadcrumbs}
        showAuthor={true}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: 'SC Licensed General Contractor #CLG118679 | 35+ years | 47 commercial tenant improvements completed',
        }}
        showCredentials={false}
        lastUpdated={new Date('2026-05-02')}
        relatedPages={relatedPages}
        showCTA={true}
        ctaTitle="Ready to Transform Your Commercial Space?"
        ctaDescription="Free on-site consultation and detailed estimate. Expert commercial tenant improvements across Upstate SC."
      >
        {/* Hero Section */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Commercial Tenant Improvements & Upfits in Upstate SC
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              I've completed 47 commercial tenant improvements across Greenville, Simpsonville, Greer, and surrounding Upstate SC communities since 1995. From office build-outs to retail upfits, medical office renovations to restaurant fit-outs, I deliver on-time, on-budget projects with minimal disruption to your business operations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="tel:8647244600" variant="primary" size="lg">
                <Icon name="Phone" size={20} />
                Call (864) 724-4600 - Free Estimate
              </Button>
              <Button href="/calculator/commercial-renovations" variant="outline" size="lg">
                <Icon name="Calculator" size={20} />
                Calculate Your Project Cost
              </Button>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card padding="md" className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">47+</div>
              <div className="text-sm text-gray-600">Commercial Projects Completed</div>
            </Card>
            <Card padding="md" className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">35+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </Card>
            <Card padding="md" className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5.0</div>
              <div className="text-sm text-gray-600">Google Rating (12 Reviews)</div>
            </Card>
            <Card padding="md" className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">A+</div>
              <div className="text-sm text-gray-600">BBB Rating Since 2014</div>
            </Card>
          </div>
        </Section>

        {/* E-E-A-T Signals — exactly once, immediately after hero */}
        <Section background="gray" padding="md">
          <div className="max-w-4xl mx-auto">
            <EEATSignals variant="compact" />
          </div>
        </Section>

        {/* Introduction & Local Focus */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Expert Commercial Contractor Serving Greenville, Simpsonville, Greer & Upstate SC
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Whether you're opening your first retail location in downtown Greenville, expanding your medical practice in Simpsonville, relocating your office to Greer, or renovating restaurant space in Fountain Inn, I bring 35+ years of commercial construction expertise to every tenant improvement project.
              </p>
              <p className="mb-4">
                <strong>Office build-outs, retail upfits, medical office renovations, and restaurant fit-outs</strong> require precise coordination, strict code compliance, and minimal business disruption. As a SC Licensed General Contractor (#CLG118679), I handle all aspects: permitting, design coordination, demolition, framing, electrical/HVAC/plumbing, finishes, and final inspections.
              </p>
              <p className="mb-4">
                I've worked with landlords, property managers, and business owners throughout Upstate SC to deliver quality commercial tenant improvements that maximize your Tenant Improvement (TI) allowance and meet your operational timeline. From 1,000 sqft office suites to 10,000 sqft retail spaces, every project receives the same attention to detail and commitment to quality.
              </p>
            </div>
          </div>
        </Section>

        {/* Benefits Section */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Burch Contracting for Your Commercial Tenant Improvement?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="CheckCircle" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">35+ Years Commercial Experience</h3>
                    <p className="text-gray-600">
                      Since 1995, I've completed 47 commercial tenant improvements across office, retail, medical, and restaurant spaces in Upstate SC.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="ShieldCheck" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">SC Licensed & Fully Insured</h3>
                    <p className="text-gray-600">
                      Licensed General Contractor #CLG118679. $2M general liability plus workers' compensation coverage on every commercial project.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="Users" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Landlord & Property Manager Relationships</h3>
                    <p className="text-gray-600">
                      Pre-approved contractor for major Upstate SC commercial property management firms. Familiar with TI allowance negotiations and lease coordination.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="Clock" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Minimal Business Disruption</h3>
                    <p className="text-gray-600">
                      After-hours construction options, phased occupancy plans, and dust containment systems to keep adjacent businesses operational.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="FileText" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Permit & Code Compliance Expertise</h3>
                    <p className="text-gray-600">
                      I handle all permit applications, coordinate required inspections, and ensure full compliance with Greenville County building codes and ADA requirements.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="DollarSign" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Maximize Your TI Allowance</h3>
                    <p className="text-gray-600">
                      Detailed line-item estimates help you make the most of your Tenant Improvement allowance. I work within your budget to deliver maximum value.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="Zap" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Single Point of Contact</h3>
                    <p className="text-gray-600">
                      I coordinate all subcontractors (electrical, HVAC, plumbing, data) so you deal with one contractor, not five. Clear communication throughout.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="Award" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">5.0 Google Rating & BBB A+</h3>
                    <p className="text-gray-600">
                      Top-rated contractor with verified reviews from commercial and residential clients. BBB A+ rating since 2014.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* How We Build It - Process */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Commercial Tenant Improvement Process
            </h2>
            <div className="space-y-6">
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Site Visit & Scope Assessment</h3>
                    <p className="text-gray-700">
                      I visit your space to assess existing conditions, review lease terms, understand your operational needs, and identify any structural, electrical, or mechanical constraints. This typically takes 60-90 minutes and includes photos, measurements, and initial timeline discussion.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Estimate & Design Coordination</h3>
                    <p className="text-gray-700">
                      Within 5-7 business days, you receive a detailed line-item estimate breaking down all costs: demolition, framing, electrical, HVAC, plumbing, finishes, and permits. I coordinate with your architect or space planner to ensure accurate pricing. If you're working with a TI allowance, I help optimize the scope to maximize landlord contribution.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Permitting & Pre-Construction</h3>
                    <p className="text-gray-700">
                      I submit all required permits to Greenville County, coordinate landlord approvals, schedule pre-construction meetings with subcontractors, and finalize the project timeline. This phase typically takes 2-4 weeks depending on permit complexity. You receive a detailed project schedule with milestone dates.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Construction & Regular Updates</h3>
                    <p className="text-gray-700">
                      Construction proceeds in phases: demolition, framing, rough-ins (electrical/HVAC/plumbing), inspections, drywall, finish work, and final punch list. You receive weekly progress updates with photos and a timeline status report. I'm on-site daily to ensure quality control and coordinate all trades. Average office build-out takes 6-10 weeks; retail and medical projects 8-14 weeks depending on complexity.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Final Inspections & Certificate of Occupancy</h3>
                    <p className="text-gray-700">
                      I coordinate all final inspections (building, electrical, mechanical, fire marshal), complete punch list items, and obtain your Certificate of Occupancy or CO update. You receive as-built documentation, warranty information, and operating instructions for any new systems. Final walkthrough ensures you're 100% satisfied before project closeout.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* Pricing Section */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              2026 Commercial Tenant Improvement Pricing - Upstate SC
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Pricing ranges based on 47 completed projects in Greenville County (Simpsonville, Fountain Inn, Greer, Mauldin, Greenville)
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card padding="lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Briefcase" className="text-blue-600" size={24} />
                  Office Build-Outs
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between border-b pb-2">
                    <span>Basic office (open plan)</span>
                    <span className="font-semibold">$50-$60/sqft</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Standard (private offices)</span>
                    <span className="font-semibold">$60-$75/sqft</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Professional (law, finance)</span>
                    <span className="font-semibold">$75-$95/sqft</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Includes: Demising walls, private offices, electrical/data, HVAC zones, drop ceiling, flooring, paint
                  </p>
                  <p className="text-sm font-semibold text-blue-600 mt-2">
                    Example: 2,500 sqft office = $150,000-$187,500
                  </p>
                </div>
              </Card>

              <Card padding="lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="ShoppingBag" className="text-blue-600" size={24} />
                  Retail Upfits
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between border-b pb-2">
                    <span>Basic retail space</span>
                    <span className="font-semibold">$45-$60/sqft</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Storefront renovations</span>
                    <span className="font-semibold">$65-$85/sqft</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>High-end boutique</span>
                    <span className="font-semibold">$85-$110/sqft</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Includes: Display areas, customer areas, back office, storage, lighting, flooring, storefront work
                  </p>
                  <p className="text-sm font-semibold text-blue-600 mt-2">
                    Example: 1,800 sqft retail = $81,000-$153,000
                  </p>
                </div>
              </Card>

              <Card padding="lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Heart" className="text-blue-600" size={24} />
                  Medical Office Renovations
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between border-b pb-2">
                    <span>General practitioner</span>
                    <span className="font-semibold">$70-$90/sqft</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Specialty practice</span>
                    <span className="font-semibold">$90-$110/sqft</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Surgical/dental suite</span>
                    <span className="font-semibold">$110-$140/sqft</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Includes: Exam rooms, specialized plumbing, medical gas, ADA compliance, HIPAA-compliant layouts
                  </p>
                  <p className="text-sm font-semibold text-blue-600 mt-2">
                    Example: 3,000 sqft medical = $210,000-$330,000
                  </p>
                </div>
              </Card>

              <Card padding="lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Coffee" className="text-blue-600" size={24} />
                  Restaurant Fit-Outs
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between border-b pb-2">
                    <span>Fast-casual (limited kitchen)</span>
                    <span className="font-semibold">$85-$100/sqft</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Full-service restaurant</span>
                    <span className="font-semibold">$100-$130/sqft</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>High-end dining</span>
                    <span className="font-semibold">$130-$180/sqft</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Includes: Commercial kitchen, hood system, grease trap, 3-comp sink, health dept compliance, dining area
                  </p>
                  <p className="text-sm font-semibold text-blue-600 mt-2">
                    Example: 2,200 sqft restaurant = $187,000-$286,000
                  </p>
                </div>
              </Card>
            </div>

            <Card padding="lg" className="mt-8 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Additional Cost Factors:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={18} />
                  <span><strong>Permits:</strong> $800-$2,500 depending on scope and municipality</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={18} />
                  <span><strong>Architect/Engineer:</strong> $2,000-$8,000 for stamped plans (required for structural changes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={18} />
                  <span><strong>After-hours premium:</strong> +15-20% for nights/weekends construction</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={18} />
                  <span><strong>Expedited timeline:</strong> +10-15% for accelerated schedules</span>
                </li>
              </ul>
            </Card>
          </div>
        </Section>

        {/* Comparison Table */}
        <Section background="gray" padding="lg">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Compare Commercial Tenant Improvement Types
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Office Build-Out</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Retail Upfit</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Medical Office</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Typical Cost Range</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">$50-$75/sqft</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">$45-$85/sqft</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">$70-$110/sqft</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Average Timeline</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">6-10 weeks</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">8-12 weeks</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">10-14 weeks</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Permit Complexity</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">Medium</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">Medium-High</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">High</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Specialized Plumbing</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      <Icon name="X" className="text-gray-400 mx-auto" size={20} />
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      <Icon name="X" className="text-gray-400 mx-auto" size={20} />
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      <Icon name="Check" className="text-green-600 mx-auto" size={20} />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">ADA Compliance Required</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      <Icon name="Check" className="text-green-600 mx-auto" size={20} />
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      <Icon name="Check" className="text-green-600 mx-auto" size={20} />
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      <Icon name="Check" className="text-green-600 mx-auto" size={20} />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Typical TI Allowance (Upstate SC)</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">$15-$25/sqft</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">$10-$20/sqft</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">$20-$35/sqft</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Can Work Around Operations?</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      <Icon name="Check" className="text-green-600 mx-auto" size={20} />
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      <Icon name="Check" className="text-green-600 mx-auto" size={20} />
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      <Icon name="Check" className="text-green-600 mx-auto" size={20} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Embedded Commercial Renovations Cost Calculator */}
        <Section background="white" padding="lg">
          <div className="max-w-3xl mx-auto">
            <CommercialMiniCalculator />
          </div>
        </Section>

        {/* FAQs */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Commercial Tenant Improvement FAQs
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} padding="lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* City-Specific Service Areas with ClickableCityGrid */}
        <Section background="white" padding="lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Commercial Tenant Improvements Across Upstate SC
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              I serve commercial clients throughout Greenville County and surrounding areas. Click on your city to see local projects and get area-specific pricing.
            </p>
            <ClickableCityGrid columns={3} />
          </div>
        </Section>

        {/* Final CTA */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <Card padding="lg" className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Commercial Tenant Improvement?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Free on-site consultation and detailed estimate. I'll help you maximize your TI allowance and deliver a quality build-out on schedule.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button href="tel:8647244600" variant="primary" size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                  <Icon name="Phone" size={20} />
                  Call (864) 724-4600
                </Button>
                <Button href="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700">
                  <Icon name="Mail" size={20} />
                  Request Free Estimate
                </Button>
              </div>
              <p className="text-sm text-blue-200 mt-6">
                SC Licensed General Contractor #CLG118679 • 35+ Years Experience • BBB A+ • 5.0 Google Rating
              </p>
            </Card>
          </div>
        </Section>
      </UniversalPageTemplate>
    </>
  );
}
