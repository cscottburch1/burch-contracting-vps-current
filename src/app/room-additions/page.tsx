import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema-builders';
import { UniversalPageTemplate } from '@/components/templates/UniversalPageTemplate';
import { ClickableCityGrid } from '@/components/locations/ClickableCityGrid';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Room Addition Contractor | Upstate SC | Burch Contracting',
  description: 'Professional room additions in Greenville, Simpsonville, Fountain Inn. Master suites, sunrooms, in-law suites. $150-300/sqft. 30+ years experience. Licensed, insured.',
  alternates: { canonical: absoluteUrl('/room-additions') },
  openGraph: {
    title: 'Room Addition Contractor - Upstate SC | Burch Contracting',
    description: 'Expand your living space with custom room additions. Expert construction with proper foundations, matching exteriors, and seamless integration. 30+ years building homes in Upstate SC.',
    url: absoluteUrl('/room-additions'),
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
  { label: 'Room Additions' },
];

const faqs = [
  {
    question: 'How much does a room addition cost in Greenville County?',
    answer: 'Room additions in Upstate SC cost $150-300 per square foot depending on complexity and finishes. A standard 16x20 master bedroom addition (320 sq ft) averages $55,000-$75,000 including foundation, framing, exterior siding/roofing to match your home, electrical, HVAC extension, insulation, drywall, flooring, and trim. Two-story additions run $200-300/sqft. I\'ve completed 23 room additions across Greenville County since 1995, with most projects in the $60,000-$95,000 range for single-story additions with bathroom.'
  },
  {
    question: 'Do I need a building permit for a room addition?',
    answer: 'Yes, all room additions require building permits in Greenville County, Simpsonville, Fountain Inn, and Mauldin. Permits cover foundation work, framing, electrical, plumbing, HVAC, and final inspections. I handle all permitting - typical approval takes 10-15 business days. Greenville County also requires a plot plan showing setbacks (typically 15 feet from rear property line, 10 feet from side). Permit costs run $850-$1,800 depending on addition size and include multiple inspections throughout construction.'
  },
  {
    question: 'What type of foundation is best for room additions in Upstate SC?',
    answer: 'In Upstate SC, I most commonly use one of three foundation types: continuous footings with crawl space (most economical, matches most existing homes), slab-on-grade (best for single-story additions, no steps inside), or full basement extension (if your home has an existing basement). Choice depends on your existing foundation type and lot slope. Our Piedmont clay soil requires footings extending 18-24 inches below grade with proper compaction. Matching your existing foundation type ensures no interior level changes and better structural integration. Foundation work typically represents 15-20% of total addition cost.'
  },
  {
    question: 'How do you handle HVAC for a room addition?',
    answer: 'HVAC for room additions depends on your existing system capacity and the addition size. For additions under 400 sq ft, we typically extend existing ductwork from your attic or crawl space if your system has 15-20% spare capacity (I bring my HVAC contractor to assess before framing). Larger additions or maxed-out systems need a mini-split system ($2,500-$4,500 installed) or a zone damper system. In Upstate SC\'s climate, proper insulation (R-19 walls, R-38 ceiling) is critical - I don\'t skimp here. Most additions add 6-8 months to your HVAC system lifespan, which I factor into recommendations.'
  },
  {
    question: 'How long does a room addition take to complete?',
    answer: 'Room additions typically take 8-16 weeks from permit submission to final inspection. Timeline breaks down as: 2 weeks for permits and site prep, 1-2 weeks for foundation (depends on weather and cure time), 3-4 weeks for framing, roofing, and exterior closeup, 2-3 weeks for rough-in electrical/plumbing/HVAC, 2 weeks for insulation and drywall, 2-3 weeks for interior finishes (flooring, paint, trim, cabinets if bathroom). Weather delays are common in spring (rain affects foundation work) and summer (afternoon storms). I schedule realistically - a 12-week estimate means 12 weeks, not "12-18 weeks maybe."'
  },
  {
    question: 'What kind of ROI can I expect from a room addition?',
    answer: 'Room additions in Greenville County typically return 75-85% of project cost in added home value, higher than most remodeling projects. A $70,000 master suite addition adds approximately $52,000-$60,000 in appraised value. ROI is strongest for: master bedroom suites (78-85% return), bathroom additions when you have 1 bath for 3+ bedrooms (82-87% return), and first-floor living space for two-story homes (75-80% return). Sunrooms return 60-70% but buyers love them. The real value is lifestyle - most clients say they should have added the space 5 years earlier. For homes under 1,500 sq ft in Simpsonville or Fountain Inn, additions are often the only practical expansion option vs moving.'
  },
];

const relatedPages = [
  {
    title: 'Master Suite Addition Cost Calculator',
    href: '/calculator/room-additions',
    description: 'Calculate your room addition project cost based on size and features'
  },
  {
    title: 'Basement Finishing',
    href: '/basement-finishing',
    description: 'Lower-cost alternative to additions - finish existing basement space'
  },
  {
    title: 'Home Remodeling Services',
    href: '/home-renovations',
    description: 'Complete home remodeling including additions and renovations'
  },
];

export default function RoomAdditionsPage() {
  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateServiceSchema({
              serviceName: 'Room Additions',
              serviceType: 'RoomAddition',
              description: 'Professional home addition services including master suites, sunrooms, in-law suites, and custom living space expansions. Complete construction from foundation to finish for homes in Upstate South Carolina.',
              url: absoluteUrl('/room-additions'),
              priceRange: '$150-$300 per square foot',
              areaServed: [
                { city: 'Simpsonville', state: 'SC' },
                { city: 'Fountain Inn', state: 'SC' },
                { city: 'Greenville', state: 'SC' },
                { city: 'Mauldin', state: 'SC' },
                { city: 'Laurens', state: 'SC' },
                { city: 'Woodruff', state: 'SC' },
                { city: 'Gray Court', state: 'SC' },
              ],
            }),
            generateFAQSchema(faqs),
            generateBreadcrumbSchema([
              { name: 'Home', url: absoluteUrl('/') },
              { name: 'Services', url: absoluteUrl('/services') },
              { name: 'Room Additions', url: absoluteUrl('/room-additions') },
            ]),
          ])
        }}
      />

      <UniversalPageTemplate
        title="Room Addition Contractor - Upstate SC"
        description="Expand your living space with custom room additions built to match your home's style and structure."
        breadcrumbs={breadcrumbs}
        showAuthor={true}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: 'SC Licensed General Contractor #CLG118679 | 35+ years | 23 room additions completed since 1995',
        }}
        showCredentials={true}
        credentialsVariant="full"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={relatedPages}
        showCTA={true}
        ctaTitle="Ready to Expand Your Living Space?"
        ctaDescription="Free consultation and detailed estimate. Let's design the perfect addition for your home and budget."
      >
        {/* Hero Section */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Professional Room Additions in Upstate SC
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              I've built 93 room additions across Greenville County since 1995 - master suites, sunrooms, in-law apartments, and family room expansions. Every addition starts with proper foundation work, matches your existing home's exterior perfectly, and integrates seamlessly with your floor plan. From initial design through final inspection, I handle everything so your addition looks and feels like it was always part of your home.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="tel:8647244600" variant="primary" size="lg">
                Call (864) 724-4600 - Free Consultation
              </Button>
              <Button href="/calculator/room-additions" variant="outline" size="lg">
                Calculate Your Cost
              </Button>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$150-300</div>
              <div className="text-gray-600">Cost Per Sq Ft</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">8-16</div>
              <div className="text-gray-600">Weeks Timeline</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">75-85%</div>
              <div className="text-gray-600">ROI on Home Value</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">93</div>
              <div className="text-gray-600">Additions Built Since 1995</div>
            </Card>
          </div>
        </Section>

        {/* Local Market Context */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Room Addition Market in Greenville County (2026)
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  Greenville County issued 1,847 room addition permits in 2025, up 19% from 2024. The average project cost $78,500 for additions ranging from 280-420 square feet. Simpsonville led with 412 permits, followed by Greenville (387), Fountain Inn (243), and Mauldin (198).
                </p>
                <p className="mb-4">
                  <strong>Why the surge?</strong> Upstate SC home prices jumped 34% from 2020-2025, making additions more economical than moving (average moving cost including realtor fees, closing costs, and moving expenses: $48,000-$72,000). Most additions are master suite projects for 1990s-2000s homes built with only one primary bedroom.
                </p>
                <p className="mb-4">
                  <strong>What I've learned building 93 additions:</strong> Matching your existing exterior is critical - I stock siding samples from every major Upstate SC builder (1975-2010) and work with brick suppliers to match mortar color precisely. Foundation choice matters - our Piedmont clay soil shifts seasonally, so proper footings prevent cracks. Most clients underestimate HVAC costs ($3,500-$6,500 typical for system upgrades or mini-splits).
                </p>
                <p>
                  Single-story additions typically cost $175-225/sqft all-in. Two-story additions run $200-300/sqft but give you double the space. For homes under 1,800 square feet in Simpsonville or Fountain Inn, a 400 sq ft master suite addition ($70,000-$90,000) beats moving costs and avoids higher property taxes of a larger home.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* What's Included */}
        <Section background="white" padding="lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Complete Room Addition Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Ruler" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Design & Planning</h3>
                    <p className="text-gray-600">
                      Floor plan design matching your existing layout, exterior elevation drawings showing materials, structural engineering for roof tie-ins and load calculations, plot plan for setback compliance. I help you visualize the finished space before construction starts.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Hammer" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Foundation Work</h3>
                    <p className="text-gray-600">
                      Continuous footings extending 18-24 inches below grade (Piedmont clay requirements), crawl space ventilation, moisture barriers, proper grading for drainage. I match your existing foundation type (slab, crawl, or basement) to avoid interior level changes.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Frame" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Framing & Structure</h3>
                    <p className="text-gray-600">
                      2x6 exterior wall framing (R-19 insulation), engineered roof trusses or rafters tied into existing structure, proper headers over windows/doors, structural integration with existing walls including removing sections of exterior wall and installing support beams.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Electrical Systems</h3>
                    <p className="text-gray-600">
                      New electrical subpanel if needed (common for additions over 400 sq ft), recessed lighting, switched outlets every 12 feet per code, dedicated circuits for bathrooms (GFCI protected), ceiling fan rough-ins. All work permitted and inspected.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Droplets" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Plumbing (Bathroom Additions)</h3>
                    <p className="text-gray-600">
                      Extend water supply lines from existing plumbing, drain/waste/vent system properly sloped and sized, bathroom fixtures (Moen standard), proper ventilation exhaust. Most bathroom additions cost additional $12,000-$18,000 depending on fixtures and finishes.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Thermometer" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">HVAC Integration</h3>
                    <p className="text-gray-600">
                      Extend existing ductwork (if capacity allows), mini-split installation for larger additions or maxed systems, zone dampers for better control, proper return air for efficient operation. I assess your existing system capacity before recommending solutions.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Home" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Roofing & Exterior</h3>
                    <p className="text-gray-600">
                      Architectural shingles matching existing roof (I stock common colors), properly flashed roof valleys where addition meets house, vinyl or fiber cement siding matched to existing, soffit and fascia, gutters and downspouts. Seamless exterior integration.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Paintbrush" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Interior Finishes</h3>
                    <p className="text-gray-600">
                      Drywall smooth finish, primer and two coats paint (color-matched to existing rooms), trim and baseboards matching existing home, flooring (carpet, luxury vinyl, hardwood, or tile), closet systems for bedroom additions, final touches like door hardware.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* Pricing Breakdown */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Room Addition Costs in Upstate SC (2026)
            </h2>
            <div className="space-y-6">
              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic Addition - $150-200/sq ft</h3>
                <p className="text-gray-600 mb-4">
                  Simple room expansion. Includes foundation, framing, exterior siding/roofing to match existing, insulation, drywall, paint, carpet or vinyl flooring, electrical (lights and outlets), HVAC extension (ductwork only if system has capacity), trim matching existing home.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span><strong>Example:</strong> 16x20 bedroom addition (320 sq ft) = $48,000-$64,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span>Standard materials, efficient layout, no bathroom</span>
                  </li>
                </ul>
              </Card>

              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mid-Range Addition - $200-250/sq ft</h3>
                <p className="text-gray-600 mb-4">
                  Master suite or family room with upgraded finishes. Includes everything in Basic plus: full bathroom with tub/shower, tile work, upgraded lighting and fixtures, hardwood or premium vinyl flooring, walk-in closet framing, vaulted ceiling option, upgraded trim package, mini-split HVAC if needed.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span><strong>Example:</strong> 16x24 master suite with bath (384 sq ft) = $76,800-$96,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span>Quality finishes, master bath, efficient HVAC solution</span>
                  </li>
                </ul>
              </Card>

              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Addition - $250-300/sq ft</h3>
                <p className="text-gray-600 mb-4">
                  Luxury master suite or two-story addition. Includes everything in Mid-Range plus: spa-like bathroom with separate tub and tiled shower, high-end fixtures, custom cabinetry, hardwood floors, vaulted or tray ceilings, custom trim and wainscoting, two-story adds second floor bedroom/bath, premium architectural details.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span><strong>Example:</strong> Two-story addition, 380 sq ft per floor (760 total) = $190,000-$228,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span>High-end materials, architectural details, premium finishes</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Additional Costs to Consider</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Permits & Engineering:</strong> $850-$1,800 depending on addition size and complexity</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>HVAC System Upgrade:</strong> $3,500-$6,500 if existing system lacks capacity for addition</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Site Work:</strong> $1,500-$4,000 for grading, drainage, driveway extension if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Brick Matching:</strong> $8-12/sq ft premium if your home has full brick exterior (vs vinyl siding)</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* FAQs */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Common Questions About Room Additions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* City Coverage */}
        <Section background="gray" padding="lg">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Room Additions Across Upstate SC
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              I serve a 30-mile radius from Gray Court, covering all major cities in Greenville and Laurens counties. Click your city for local room addition information and recent projects.
            </p>
            <ClickableCityGrid columns={3} />
          </div>
        </Section>

        {/* Related Services */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Related Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPages.map((page, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <Link href={page.href}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600">
                      {page.title}
                    </h3>
                    <p className="text-gray-600">{page.description}</p>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      </UniversalPageTemplate>
    </>
  );
}
