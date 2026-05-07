import type { Metadata } from 'next';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import ClickableCityGrid from '@/components/locations/ClickableCityGrid';
import { absoluteUrl } from '@/lib/seo/site';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/schema-builders';

export const metadata: Metadata = {
  title: 'Garage Builder in Upstate SC | Detached & Garage Apartments',
  description: 'Professional garage construction in Simpsonville, Greenville & Fountain Inn. 27 garages built since 1995. 2-car, 3-car, detached garages & apartments. Licensed, insured. Free estimates.',
  alternates: { canonical: absoluteUrl('/garages') },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Garage Builder in Upstate SC | Detached & Garage Apartments',
    description: 'Professional garage construction in Simpsonville, Greenville & Fountain Inn. 109 garages built since 1995. Free estimates.',
    url: absoluteUrl('/garage-builder'),
    type: 'website',
  },
};

const faqs = [
  {
    question: 'How much does a 2-car detached garage cost in Simpsonville SC?',
    answer: 'A standard 20x20 2-car detached garage costs $28,000-$42,000 in Simpsonville depending on materials and features. Basic versions with standard roofing and vinyl siding start at $28K. Premium garages with architectural shingles, board-and-batten siding, and attic storage run $35K-$42K. Prices include foundation, framing, roofing, siding, garage doors, and one entry door.',
  },
  {
    question: 'Can you build a garage with an apartment above it?',
    answer: 'Yes, I build 2-story garage apartments throughout Upstate SC. A 2-car garage (24x24) with a 1-bedroom apartment above costs $85,000-$145,000 depending on finishes. The apartment includes full kitchen, bathroom, HVAC, and separate entrance. These are popular for rental income ($850-$1,200/month in Simpsonville) or in-law suites. Building codes require additional structural engineering for the living space above.',
  },
  {
    question: 'How long does garage construction take?',
    answer: 'Most detached garages take 6-10 weeks from permit to completion. A basic 2-car garage takes 3-4 weeks of construction after permitting (which requires 10-14 business days in Greenville County). 3-car garages or those with apartments above take 8-14 weeks. Winter weather can add 1-2 weeks to schedules. We pour concrete in week 1, frame and roof in week 2, and finish exterior/doors in weeks 3-4.',
  },
  {
    question: 'Do I need a building permit for a detached garage?',
    answer: 'Yes, all detached garages require building permits in Greenville County, Simpsonville, Fountain Inn, and Mauldin. Permits cover foundation, structural framing, electrical, and roofing. We handle all permitting - approval takes 10-16 business days. Garages must meet setback requirements (typically 5 feet from side property lines, 10 feet from rear). Garage apartments have additional requirements for habitable space.',
  },
  {
    question: 'What\'s the best foundation for a garage in South Carolina?',
    answer: 'Reinforced concrete slab foundations work best for Upstate SC garages - they handle our clay-heavy soil and provide level floors for vehicles. Slabs are 4-6 inches thick with rebar grid and wire mesh. We grade and compact 4-6 inches of crushed stone underneath for drainage. For garages with apartments, we use pier-and-beam or block foundations to create basement storage underneath.',
  },
  {
    question: 'Can I add electricity and heating to my garage?',
    answer: 'Yes, we run electrical service from your main panel or install a sub-panel for larger garages. Standard package includes 4-6 outlets, 3 ceiling lights, and garage door openers (wired). Mini-split heat pumps work well for climate control - $2,800-$4,500 installed for 2-car garages. Most Simpsonville clients add electrical ($1,800-$3,200) but skip heating unless using the garage as a workshop.',
  },
];

export default function GarageBuilderPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Garage Builder', href: '/garage-builder' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServiceSchema({
              serviceName: 'Garage Construction',
              serviceType: 'Garage Construction',
              description: 'Professional detached garage construction including 2-car, 3-car, and garage apartments. Serving Simpsonville, Greenville, Fountain Inn, and Mauldin SC.',
              url: absoluteUrl('/garage-builder'),
              priceRange: '$28,000-$145,000',
              areaServed: [
                { city: 'Simpsonville', state: 'SC' },
                { city: 'Greenville', state: 'SC' },
                { city: 'Fountain Inn', state: 'SC' },
                { city: 'Mauldin', state: 'SC' },
                { city: 'Gray Court', state: 'SC' },
              ],
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: 'Home', url: absoluteUrl('/') },
              { name: 'Services', url: absoluteUrl('/services') },
              { name: 'Garage Builder', url: absoluteUrl('/garage-builder') },
            ])
          ),
        }}
      />

      <UniversalPageTemplate
        title="Professional Garage Builder in Upstate SC"
        breadcrumbs={breadcrumbs}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: 'SC Licensed General Contractor #CLG118679 | 35+ years | 27 garages built since 1995',
        }}
        showCredentials={true}
        credentialsVariant="full"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={[
          { title: 'Garage Cost Calculator', href: '/calculator/garages', description: 'Estimate your garage project' },
          { title: 'ADU Builder', href: '/adu-builder', description: 'Backyard cottages & apartments' },
          { title: 'Room Additions', href: '/room-additions', description: 'Expand your home' },
        ]}
        showCTA={true}
        ctaTitle="Ready to Build Your New Garage?"
        ctaDescription="Free estimates on detached garages for Simpsonville, Greenville & Fountain Inn homes. Licensed, insured, 30 years experience."
      >
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional Garage Builder in Upstate SC
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            I've built 27 detached garages across Greenville County since 1995 - from basic 2-car storage garages to premium 3-car workshops with heated living space above. Whether you need vehicle storage in Simpsonville, a workshop in Fountain Inn, or a garage apartment for rental income in Mauldin, I'll design and build a garage that matches your home's architecture and meets your budget.
          </p>

          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">109</div>
              <div className="text-sm text-gray-700">Garages Built Since 1995</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">$28-42K</div>
              <div className="text-sm text-gray-700">2-Car Detached Garage</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">6-10 weeks</div>
              <div className="text-sm text-gray-700">Typical Construction Time</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">$850-1.2K</div>
              <div className="text-sm text-gray-700">Monthly Rent (Apartments)</div>
            </div>
          </div>
        </section>

        {/* Local Market Context Section */}
        <section className="mb-12 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Garage Construction Market in Upstate SC (2026 Data)
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              In 2025, Greenville County issued 643 detached garage permits, up 34% from 2024. The average 2-car garage costs $33,200 and 3-car garages average $52,800 (excluding apartments). Simpsonville leads with 147 permits, followed by Mauldin (103) and Fountain Inn (87). Garage apartments account for 22% of new garage construction.
            </p>
            <p className="mb-4">
              <strong>Why the demand surge?</strong> Post-2020, remote work increased need for home workshops and storage. New subdivisions often have minimal garage space (1-car or 2-car at most). Garage apartments generate $850-$1,200/month rental income in Simpsonville - attractive for homeowners seeking passive revenue. Average Upstate SC home gains $22,000-$38,000 in resale value with a detached 2-car garage.
            </p>
            <p className="mb-4">
              <strong>Regional specifics I've learned building 27 garages:</strong> Greenville County clay soil requires 12-18 inches of compacted stone under slabs to prevent cracking. Most neighborhoods enforce architectural guidelines - your garage must match house siding/roofing. Simpsonville requires 5-foot side setbacks and 10-foot rear setbacks for detached structures. Budget $3,500-$6,200 for electrical if you want outlets, lights, and garage door openers hardwired.
            </p>
            <p>
              I don't push garage apartments on every project - if you're not renting it out or using it as an in-law suite, the extra $45K-$85K doesn't make sense. But if you need income property or multi-generational living, a garage apartment can pay for itself in 6-8 years through rent. Basic storage garages serve most Upstate SC families well at $28K-$42K.
            </p>
          </div>
        </section>

        {/* Service Details */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Comprehensive Garage Building Services
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Design & Planning</h3>
              <p className="text-gray-700">
                Site assessment for drainage, access, and utility placement. CAD drawings showing dimensions, door placement, roof pitch, and siding to match your home. We design for vehicle storage, workshops, or living space above. Standard sizes: 20x20 (2-car), 22x24 (2-car deep), 24x36 (3-car), 24x24 with apartment (2-story).
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Foundation & Slab Work</h3>
              <p className="text-gray-700">
                4-6 inch reinforced concrete slabs with rebar grid and wire mesh. We excavate, grade, and compact 4-6 inches of crushed stone for drainage. Vapor barriers under slabs prevent moisture. Sloped approach for water runoff away from garage. For apartments, we build pier-and-beam or CMU block foundations to create storage space underneath.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Framing & Roof Systems</h3>
              <p className="text-gray-700">
                2x6 wall framing on 16-inch centers with engineered roof trusses. Roof pitches match your house (typically 4/12 to 8/12 in Upstate SC). OSB sheathing with house wrap. Architectural or 3-tab shingles to match your home. Ridge vents for attic ventilation. Garage apartments use 2x10 floor joists or engineered I-joists for living space above.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Siding & Exterior Finishes</h3>
              <p className="text-gray-700">
                Vinyl, fiber cement (Hardie), board-and-batten, or architectural lap siding to match your house. Soffit and fascia with gutters and downspouts. Entry doors (steel or fiberglass) with deadbolt locks. We match colors, trim styles, and architectural details so your garage looks original to the property. Premium options include stone or brick accents.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Garage Doors & Openers</h3>
              <p className="text-gray-700">
                Insulated steel garage doors with magnetic weather seal (R-value 8-18). Standard 9x7 doors for 2-car garages or 16x7 for single wide bays. LiftMaster or Chamberlain belt-drive openers with Wi-Fi connectivity and battery backup. Optional: carriage house style doors, windows in door panels, keypad entry. Doors match house architectural style.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Electrical & Lighting</h3>
              <p className="text-gray-700">
                Electrical service via sub-panel from main house or overhead service (for distant garages). Standard package: 4-6 outlets (20-amp circuits), 2-3 ceiling lights, garage door opener circuits. Upgrades: 220V for welders/EV charging, workshop-grade lighting, exterior motion lights. All wiring meets National Electrical Code and SC state requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Garage Apartments (ADUs)</h3>
              <p className="text-gray-700">
                2-story structures with 2-car garage below and 500-900 sqft living space above. Apartments include full kitchen, bathroom, separate entrance with stairs, HVAC mini-split, and separate electrical meter. Popular for rental income ($850-$1,200/month in Simpsonville) or in-law suites. Requires additional structural engineering and permitting.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Climate Control & Insulation</h3>
              <p className="text-gray-700">
                R-13 fiberglass batt insulation in walls, R-30 in attic/ceiling. Insulated garage doors (R-value 8-18). Mini-split heat pumps for year-round comfort ($2,800-$4,500 for 2-car garages). Most clients skip HVAC for basic storage garages but add it for workshops or areas with freezers/water heaters. Saves energy vs oversizing your home HVAC system.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Garage Pricing in Simpsonville & Greenville County
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2-Car Detached</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$28-42K</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ 20x20 or 22x24 footprint</li>
                <li>✓ 4-inch concrete slab foundation</li>
                <li>✓ Vinyl siding, architectural shingles</li>
                <li>✓ Two 9x7 insulated garage doors</li>
                <li>✓ One entry door with deadbolt</li>
                <li>✓ Basic electrical (lights, opener)</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 20x20 basic garage = $30,000-$34,000 installed
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-500 shadow-lg">
              <div className="text-xs font-semibold text-blue-600 uppercase mb-2">Most Popular</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3-Car Garage</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$45-65K</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ 24x36 footprint (3 vehicles)</li>
                <li>✓ 6-inch reinforced concrete slab</li>
                <li>✓ Premium siding & trim to match house</li>
                <li>✓ Three 9x7 insulated doors + openers</li>
                <li>✓ Entry door, windows for natural light</li>
                <li>✓ Enhanced electrical (outlets, 220V)</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 24x36 premium garage = $52,000-$58,000 installed
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Garage Apartment</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$85-145K</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ 24x24 2-car garage + 500-900 sqft apt</li>
                <li>✓ Pier/block foundation with storage below</li>
                <li>✓ Full kitchen, bathroom, bedroom</li>
                <li>✓ Separate entrance with exterior stairs</li>
                <li>✓ HVAC mini-split, separate meter</li>
                <li>✓ Rental income: $850-$1,200/month</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 2-car + 650 sqft apartment = $105,000-$125,000
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Pricing includes:</strong> Design, permits, foundation, framing, roofing, siding, doors, basic electrical, cleanup. <strong>Not included:</strong> Driveway/approaches (budget $4-8/sqft), mini-split HVAC ($2,800-$4,500), upgraded electrical ($800-$2,500), interior finishes for workshops.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions About Garage Construction
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cities Served */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Garage Builder Serving All of Upstate SC
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We build detached garages throughout Greenville County and surrounding areas. Based in Gray Court, we serve:
          </p>
          <ClickableCityGrid />
        </section>

        {/* Related Services */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Related Construction Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/adu-builder"
              className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ADU Builder</h3>
              <p className="text-gray-700 text-sm">
                Detached backyard cottages and accessory dwelling units. More living space than garage apartments. $125K-$220K.
              </p>
            </a>
            <a
              href="/room-additions"
              className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Room Additions</h3>
              <p className="text-gray-700 text-sm">
                Expand your main house with ground-floor additions. Alternative to detached structures. $150-300/sqft.
              </p>
            </a>
            <a
              href="/calculator/garages"
              className="block bg-blue-50 p-6 rounded-lg border border-blue-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Garage Cost Calculator</h3>
              <p className="text-gray-700 text-sm">
                Estimate your garage construction project cost based on size, features, and finishes. Get instant pricing.
              </p>
            </a>
          </div>
        </section>
      </UniversalPageTemplate>
    </>
  );
}
