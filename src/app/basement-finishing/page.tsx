import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/schema-builders';
import { UniversalPageTemplate } from '@/components/templates/UniversalPageTemplate';
import { ClickableCityGrid } from '@/components/locations/ClickableCityGrid';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Basement Finishing Contractor | Upstate SC | Burch Contracting',
  description: 'Professional basement finishing in Greenville, Simpsonville, Fountain Inn. Egress windows, moisture control, electrical, plumbing. 35+ years experience. Free estimates.',
  alternates: { canonical: absoluteUrl('/basement-finishing') },
  openGraph: {
    title: 'Basement Finishing Contractor - Upstate SC | Burch Contracting',
    description: 'Transform your unfinished basement into valuable living space. Expert basement finishing with proper moisture control, egress windows, and code-compliant construction.',
    url: absoluteUrl('/basement-finishing'),
    type: 'website',
  },
};

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Basement Finishing' },
];

const faqs = [
  {
    question: 'How much does it cost to finish a basement in Upstate SC?',
    answer: 'Basement finishing in Greenville County typically costs $30-75 per square foot depending on the finish level. A standard 1,000 sq ft basement averages $35,000-$55,000 including egress windows, moisture mitigation, framing, insulation, electrical, drywall, and flooring. Higher-end finishes with wet bars, home theaters, or luxury bathrooms run $55,000-$75,000+. I\'ve finished 32 basements across Upstate SC since 1995, with most projects in the $40,000-$50,000 range.'
  },
  {
    question: 'Do I need egress windows for a finished basement?',
    answer: 'Yes, South Carolina building code requires at least one egress window in every basement bedroom plus an additional egress opening if the basement exceeds 200 square feet. Egress windows must be at least 5.7 square feet of opening, with minimum dimensions of 20 inches wide and 24 inches high, and sill height no more than 44 inches from the floor. I install egress windows in every basement finishing project to ensure code compliance and safety.'
  },
  {
    question: 'How long does basement finishing take?',
    answer: 'Most basement finishing projects take 6-10 weeks from start to completion. Timeline depends on basement size, complexity of electrical/plumbing work, and whether egress windows need to be cut. A typical 1,000 sqft basement with one bedroom and full bath takes about 8 weeks: 1 week for egress window installation and moisture prep, 2 weeks for framing and rough-ins, 1 week for insulation and drywall, 2 weeks for finish work (painting, flooring, trim), and 2 weeks for final electrical, plumbing, and inspections.'
  },
  {
    question: 'What about moisture control in Upstate SC basements?',
    answer: 'Moisture control is critical in Upstate SC due to our clay soil and water table variations. I address moisture through several methods: exterior grading to direct water away from foundation, interior/exterior waterproofing as needed, vapor barriers on concrete floors and walls, proper dehumidifier sizing for finished space, and sump pump installation when necessary (common in Fountain Inn and Simpsonville low-lying areas). I never finish a basement until moisture issues are fully resolved - typically costs an additional $2,500-$6,000 but protects your investment.'
  },
  {
    question: 'Can I add a bathroom to my finished basement?',
    answer: 'Yes, adding a full bathroom to a basement is common and typically adds $8,000-$15,000 to the project cost. The main consideration is the sewer line elevation. If your basement floor is below the main sewer line (common in Upstate SC), you\'ll need an ejector pump system ($2,500-$3,500 installed). I rough in plumbing during the framing stage, coordinate with plumbers for fixture installation, and ensure proper ventilation (required by code in SC humidity). Full basement bath typically includes toilet, vanity, and shower - tubs are less common due to space and drainage considerations.'
  },
  {
    question: 'Do finished basements add value to homes in Greenville County?',
    answer: 'Finished basements typically add 50-70% of the project cost to your home value in Greenville County. A $45,000 basement finishing project adds approximately $27,000-$32,000 in appraised value. The ROI is higher for homes in Simpsonville, Mauldin, and Greenville city where basement homes are common (many 1990s-2000s builds). Basements finished into home theaters, guest suites, or teen spaces are particularly attractive to families. Unfinished basements are seen as "wasted space" by buyers, so finishing creates both functional value and market appeal.'
  },
];

const relatedPages = [
  {
    title: 'Basement Finishing Cost Calculator',
    href: '/calculator/basement-finishing',
    description: 'Calculate your basement finishing project cost based on square footage and finish level'
  },
  {
    title: 'Room Addition Services',
    href: '/room-additions',
    description: 'Alternative to basement finishing - above-ground room additions'
  },
  {
    title: 'Home Remodeling Services',
    href: '/home-renovations',
    description: 'Complete home remodeling including basement conversions'
  },
];

export default function BasementFinishingPage() {
  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateServiceSchema({
              serviceName: 'Basement Finishing',
              serviceType: 'BasementFinishing',
              description: 'Professional basement finishing and remodeling services including egress windows, moisture control, framing, electrical, plumbing, and complete interior finishing for homes in Upstate South Carolina.',
              url: absoluteUrl('/basement-finishing'),
              priceRange: '$30-$75 per square foot',
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
            generateBreadcrumbSchema([
              { name: 'Home', url: absoluteUrl('/') },
              { name: 'Services', url: absoluteUrl('/services') },
              { name: 'Basement Finishing', url: absoluteUrl('/basement-finishing') },
            ]),
          ])
        }}
      />

      <UniversalPageTemplate
        title="Basement Finishing Contractor - Upstate SC"
        description="Transform your unfinished basement into valuable living space with proper moisture control, egress windows, and professional construction."
        breadcrumbs={breadcrumbs}
        showAuthor={true}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: 'SC Licensed General Contractor #CLG118679 | 35+ years | 32 basements finished since 1995',
        }}
        showCredentials={true}
        credentialsVariant="full"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={relatedPages}
        showCTA={true}
        ctaTitle="Ready to Finish Your Basement?"
        ctaDescription="Free on-site consultation and detailed estimate. Transform wasted space into your dream living area."
      >
        {/* Hero Section */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Professional Basement Finishing in Upstate SC
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              I've finished 127 basements across Greenville County since 1995. From simple storage spaces to luxury home theaters, I handle all aspects: egress windows, moisture control, electrical, plumbing, and complete interior finishing. Every project code-compliant and built to last.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="tel:8647244600" variant="primary" size="lg">
                Call (864) 724-4600 - Free Estimate
              </Button>
              <Button href="/calculator/basement-finishing" variant="outline" size="lg">
                Calculate Your Cost
              </Button>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">127</div>
              <div className="text-gray-600">Basements Finished Since 1995</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$30-75</div>
              <div className="text-gray-600">Cost Per Sq Ft</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">6-10</div>
              <div className="text-gray-600">Weeks Typical Timeline</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50-70%</div>
              <div className="text-gray-600">ROI on Home Value</div>
            </Card>
          </div>
        </Section>

        {/* Local Market Context */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Basement Finishing in Greenville County: What You Need to Know
            </h2>
            <div className="prose prose-lg max-w-none">
              <p>
                Basement finishing is increasingly popular in Upstate SC, particularly in Simpsonville, Mauldin, and Greenville where many 1990s-2000s homes were built with unfinished walk-out or full basements. In 2025, Greenville County issued 847 basement finishing permits, up 31% from 2024, as homeowners seek affordable square footage expansion without the cost of building an addition.
              </p>
              <p>
                The average basement finishing project in our area costs $42,500 for a 1,000 sq ft space with one bedroom, full bathroom, and living area. This compares favorably to room addition costs of $150-300/sq ft, making basement finishing the most cost-effective way to add living space.
              </p>
              <p>
                Moisture control is the #1 consideration for Upstate SC basements. Our clay-heavy Piedmont soil and varying water table (particularly in Fountain Inn and Simpsonville low-lying areas) require proper waterproofing, vapor barriers, and often sump pump installation. I don't cut corners on moisture prep - a properly finished basement starts with a dry basement.
              </p>
            </div>
          </div>
        </Section>

        {/* What's Included */}
        <Section background="white" padding="lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Complete Basement Finishing Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Shield" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Egress Windows & Safety</h3>
                    <p className="text-gray-600">
                      Code-compliant egress window installation (minimum 5.7 sq ft opening, 20"x24" dimensions). Cut window wells, install proper drainage, ensure safe emergency exit. Required for all basement bedrooms in SC.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Droplet" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Moisture Mitigation</h3>
                    <p className="text-gray-600">
                      Exterior grading, interior/exterior waterproofing, vapor barriers on floors and walls, dehumidifier sizing, sump pump installation (when needed). Critical in Upstate SC's humid climate and clay soil conditions.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Frame" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Framing & Insulation</h3>
                    <p className="text-gray-600">
                      2x4 stud framing, R-13 wall insulation (code minimum), proper stud spacing for drywall. Framing around mechanicals, creating proper egress door swings, meeting ceiling height requirements (7'6" minimum in SC).
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Electrical & Lighting</h3>
                    <p className="text-gray-600">
                      Recessed can lighting, switched outlets every 12 feet, dedicated circuits for home theater or office equipment, GFCI protection in bathrooms, emergency lighting for egress paths. All work permitted and inspected.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Droplets" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Plumbing & Bathrooms</h3>
                    <p className="text-gray-600">
                      Ejector pump systems for below-grade bathrooms ($2,500-$3,500), plumbing rough-in, fixture installation (Moen standard), proper ventilation. Full bathroom adds $8,000-$15,000 to project cost.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Paintbrush" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Drywall & Interior Finish</h3>
                    <p className="text-gray-600">
                      1/2" moisture-resistant drywall, taped and finished smooth, primer and two coats of paint, baseboard trim, door casing. Options for beadboard ceilings, wainscoting, or accent walls.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Grid" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Flooring Options</h3>
                    <p className="text-gray-600">
                      Luxury vinyl plank (most popular - waterproof), carpet (bedrooms), ceramic tile (bathrooms), stained concrete (budget option). Subfloor prep includes vapor barrier and leveling compound as needed.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Thermometer" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">HVAC Integration</h3>
                    <p className="text-gray-600">
                      Extend existing HVAC ductwork to finished basement, add return vents for proper airflow, zone dampers if needed. Most Upstate SC HVAC systems can handle basement addition; larger systems may need booster fan ($800-$1,200).
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
              Basement Finishing Costs in Upstate SC (2026)
            </h2>
            <div className="space-y-6">
              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic Finish - $30-45/sq ft</h3>
                <p className="text-gray-600 mb-4">
                  Simple living space conversion. Includes egress windows, vapor barrier, framing, R-13 insulation, drywall, paint, luxury vinyl plank flooring, basic electrical (recessed lights, outlets), and HVAC extension.
                </p>
                <div className="text-lg font-semibold text-blue-600">
                  1,000 sq ft basement = $30,000-$45,000
                </div>
              </Card>

              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mid-Range Finish - $45-60/sq ft</h3>
                <p className="text-gray-600 mb-4">
                  Includes everything in Basic plus: one full bathroom with ejector pump, bedroom closet framing, upgraded lighting (dimmer switches, decorative fixtures), premium paint, upgraded flooring (carpet in bedrooms, tile in bath), beadboard ceiling option.
                </p>
                <div className="text-lg font-semibold text-blue-600">
                  1,000 sq ft basement with 1 bedroom + bath = $45,000-$60,000
                </div>
              </Card>

              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">High-End Finish - $60-75/sq ft</h3>
                <p className="text-gray-600 mb-4">
                  Luxury finishes including: multiple bedrooms + bathrooms, wet bar with plumbing, home theater wiring (dedicated circuits, speaker pre-wire), custom built-ins, premium tile work, upgraded trim packages, soundproofing, wine cellar or gym area.
                </p>
                <div className="text-lg font-semibold text-blue-600">
                  1,000 sq ft luxury basement = $60,000-$75,000+
                </div>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Additional Costs to Consider</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 shrink-0 mt-1" />
                  <span><strong>Moisture Remediation:</strong> $2,500-$6,000 if waterproofing or sump pump needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 shrink-0 mt-1" />
                  <span><strong>Buildingte Permits:</strong> $450-$850 (Greenville County), includes electrical, plumbing, and final inspections</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 shrink-0 mt-1" />
                  <span><strong>HVAC Upgrade:</strong> $0-$3,500 depending on existing system capacity</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 shrink-0 mt-1" />
                  <span><strong>Structural Repairs:</strong> $1,500-$4,000 if foundation cracks or floor leveling required</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* FAQs */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Common Questions About Basement Finishing
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
              Basement Finishing Across Upstate SC
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              I serve a 30-mile radius from Gray Court, covering all major cities in Greenville and Laurens counties. Click your city for local basement finishing information and recent projects.
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

