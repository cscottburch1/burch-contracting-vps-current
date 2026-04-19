import type { Metadata } from 'next';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import ClickableCityGrid from '@/components/locations/ClickableCityGrid';
import { absoluteUrl } from '@/lib/seo/site';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema-builders';

export const metadata: Metadata = {
  title: 'ADU Builder in Upstate SC | Accessory Dwelling Units | Burch Contracting',
  description: 'Professional ADU construction in Simpsonville, Greenville & Fountain Inn. Garage apartments, backyard cottages, in-law suites. $65K-$220K. 35+ years experience. Licensed, insured.',
  alternates: { canonical: absoluteUrl('/adu-builder') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'ADU Builder in Upstate SC | Burch Contracting',
    description: 'Professional accessory dwelling unit construction. Garage apartments, backyard cottages, granny flats. Turn-key ADU builds since 1995.',
    url: absoluteUrl('/adu-builder'),
    type: 'website',
  },
};

const faqs = [
  {
    question: 'How much does it cost to build an ADU in Simpsonville SC?',
    answer: 'ADU construction costs in Simpsonville vary by type and size. Garage apartments (24x24 with 500-700 sqft living space above) cost $65,000-$95,000. Detached 1-bedroom cottages (600-800 sqft) run $125,000-$185,000. Larger 2-bedroom detached ADUs (900-1200 sqft) cost $175,000-$220,000. Costs include foundation, full framing, exterior siding/roofing, complete interior finishing, kitchen, bathroom, HVAC, and electrical. I\'ve built 7 ADUs across Upstate SC since 2015, with most projects in the $85,000-$165,000 range.',
  },
  {
    question: 'Are ADUs allowed in Greenville County and Simpsonville?',
    answer: 'ADU regulations vary by municipality in Upstate SC. Simpsonville allows ADUs on lots 0.5+ acres with proper setbacks (typically 10-15 feet from property lines). Greenville County permits them in unincorporated areas on lots meeting minimum size requirements. Fountain Inn requires special use permits. Mauldin allows ADUs with homeowner occupancy requirement. Every jurisdiction requires building permits, septic/sewer approval, and compliance with residential codes. I handle all permitting and zoning coordination - typical approval takes 3-5 weeks depending on location.',
  },
  {
    question: 'How long does ADU construction take?',
    answer: 'Most ADUs take 10-16 weeks from permit approval to completion. Garage apartments take 10-14 weeks - foundation and garage structure in weeks 1-4, second-story framing and exterior in weeks 5-8, interior finishing in weeks 9-13. Detached cottages take 12-16 weeks - foundation in weeks 1-2, framing and exterior in weeks 3-8, interior finishing in weeks 9-15. Permitting adds 3-5 weeks before construction starts. Winter weather can extend timelines by 2-3 weeks. Complex designs or custom finishes may add 2-4 weeks.',
  },
  {
    question: 'Can I use an ADU as a rental property in Upstate SC?',
    answer: 'Yes, most Upstate SC jurisdictions allow ADU rentals with some restrictions. Simpsonville and Fountain Inn require the property owner to live in either the main house or ADU (owner-occupancy). Greenville County unincorporated areas have fewer restrictions. Typical rental income: 1-bedroom ADU $850-$1,200/month, 2-bedroom $1,100-$1,500/month. Short-term rentals (Airbnb/VRBO) are restricted in some areas - check local ordinances. Long-term rentals (6+ month leases) are generally allowed. ADU rental income helps offset construction costs - typical ROI is 8-12 years.',
  },
  {
    question: 'How do utilities work for ADUs?',
    answer: 'ADUs typically connect to your existing utilities with proper sizing considerations. Electrical: Most ADUs need a 100-amp sub-panel run from your main panel ($2,500-$4,500). Water/sewer: We tap into your existing lines and install separate shutoffs - must verify capacity. Septic systems may need expansion if undersized for additional bedroom(s) - upgrade costs $8,000-$15,000. HVAC: ADUs need independent systems - mini-split heat pumps work well ($3,500-$6,500 installed). Separate meters aren\'t typically required for utilities but can be added if you want tenant-paid utilities.',
  },
  {
    question: 'What\'s more cost-effective: garage apartment or detached ADU?',
    answer: 'Garage apartments are 30-40% cheaper than detached cottages of similar living space. A 2-car garage with 600 sqft apartment costs $65,000-$95,000 vs $140,000-$175,000 for a detached 600 sqft cottage. You get both parking and living space with garage apartments. However, detached ADUs offer more design flexibility, better privacy, and can be positioned to maximize yard space or views. If you need both parking and living space, garage apartment is most economical. If you want standalone guest quarters or rental property with privacy, detached ADU is better despite higher cost.',
  },
];

export default function AduBuilderPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'ADU Builder', href: '/adu-builder' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServiceSchema({
              serviceName: 'Accessory Dwelling Unit (ADU) Construction',
              serviceType: 'ADU Construction',
              description: 'Professional accessory dwelling unit construction including garage apartments, backyard cottages, in-law suites, and granny flats. Full design, permitting, and turn-key construction for homes in Upstate South Carolina.',
              url: absoluteUrl('/adu-builder'),
              priceRange: '$65,000-$220,000',
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
          __html: JSON.stringify(generateFAQSchema(faqs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: 'Home', url: absoluteUrl('/') },
              { name: 'Services', url: absoluteUrl('/services') },
              { name: 'ADU Builder', url: absoluteUrl('/adu-builder') },
            ])
          ),
        }}
      />

      <UniversalPageTemplate
        title="Professional ADU Builder in Upstate SC"
        breadcrumbs={breadcrumbs}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: 'SC Licensed General Contractor #CLG118679 | 35+ years | 7 ADUs built since 2015',
        }}
        showCredentials={true}
        credentialsVariant="full"
        lastUpdated={new Date('2026-04-18')}
        relatedPages={[
          { title: 'Garage Builder', href: '/garage-builder', description: 'Build a garage with apartment above' },
          { title: 'Room Additions', href: '/room-additions', description: 'Expand your main house instead' },
          { title: 'Free Estimate', href: '/contact', description: 'Get pricing for your ADU project' },
        ]}
        showCTA={true}
        ctaTitle="Ready to Build Your ADU?"
        ctaDescription="Free consultations on ADU zoning, design, and pricing. Licensed contractor with 35+ years experience in Upstate SC."
      >
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional ADU Builder in Simpsonville & Upstate SC
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            I've built 7 accessory dwelling units across Greenville County since 2015 - from garage apartments above 2-car garages to standalone backyard cottages with full kitchens and baths. Whether you need a rental property for income ($850-$1,500/month), in-law suite for aging parents, or guest house for extended family, I handle design, permitting, zoning compliance, and turn-key construction.
          </p>

          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">7</div>
              <div className="text-sm text-gray-700">ADUs Built Since 2015</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">$65-220K</div>
              <div className="text-sm text-gray-700">Typical Project Range</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">10-16 weeks</div>
              <div className="text-sm text-gray-700">Average Construction Time</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">$850-1500</div>
              <div className="text-sm text-gray-700">Monthly Rental Income</div>
            </div>
          </div>
        </section>

        {/* Local Market Context Section */}
        <section className="mb-12 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ADU Market in Upstate SC (2026 Data)
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              Accessory dwelling units are growing rapidly in Upstate SC. In 2025, Greenville County issued 103 ADU permits, up 67% from 2024, as homeowners seek rental income, multigenerational housing, and property value increases. The average ADU project costs $118,500 (700 sqft average size). Simpsonville leads with 31 ADU permits, followed by unincorporated Greenville County (28) and Mauldin (19).
            </p>
            <p className="mb-4">
              <strong>Why the surge?</strong> Rising housing costs and aging parents. Average 2-bedroom apartment rent in Simpsonville is $1,450/month - many homeowners build ADUs for rental income that covers construction costs in 8-12 years. Others build for aging parents (in-law suites avoid assisted living costs of $4,500-$6,500/month). Some use them for adult children returning home or home offices separate from main house.
            </p>
            <p className="mb-4">
              <strong>Zoning reality check:</strong> Every Upstate SC municipality has different ADU rules. Simpsonville requires 0.5+ acre lots with 15-foot rear setbacks. Greenville County unincorporated allows them with fewer restrictions. Fountain Inn requires special use permits (3-4 week process). Mauldin allows ADUs but requires owner-occupancy (you must live in main house or ADU, not rent both). I navigate these regulations daily - I know which lots work and which don't before you spend money on plans.
            </p>
            <p>
              <strong>ROI depends on use:</strong> If you're building for rental income, typical ROI is 8-12 years at $1,000/month average rental rate. If you're avoiding assisted living costs ($54,000-$78,000/year), your ADU pays for itself in 2-3 years. If you're adding family space for kids/parents, value is lifestyle-based rather than financial. ADUs also add 50-75% of construction cost to home appraisal value in Upstate SC.
            </p>
          </div>
        </section>

        {/* Service Details */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Complete ADU Construction Services
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Design & Planning</h3>
              <p className="text-gray-700">
                Site assessment to determine optimal ADU placement, sun orientation, and privacy. Zoning research for your specific property (setbacks, lot size minimums, owner-occupancy rules). Conceptual floor plans for garage apartments, detached cottages, or converted spaces. We design around your goals: rental income, in-law suite, guest house, or home office.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Permitting & Zoning Compliance</h3>
              <p className="text-gray-700">
                Handle all building permits, septic/sewer approvals, electrical permits, and special use permits if required. I coordinate with Simpsonville, Fountain Inn, Mauldin, and Greenville County building departments. Typical permitting takes 3-5 weeks. Setback variances handled if needed. Ensure compliance with SC residential codes and local ADU ordinances.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Garage Apartments</h3>
              <p className="text-gray-700">
                Build 2-story garage with 2-car or 3-car parking below and 500-700 sqft living space above. Includes separate entrance, full kitchen, bathroom, bedroom/living area, and HVAC. Most cost-effective ADU option at $65,000-$95,000. Perfect for properties needing both parking and rental/guest space. Popular in Simpsonville neighborhoods with garage setback requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Detached Backyard Cottages</h3>
              <p className="text-gray-700">
                Standalone 1-2 bedroom cottages (600-1200 sqft) positioned for privacy and yard optimization. Full foundations, complete exterior siding/roofing, open-concept living areas, full kitchens, bathrooms, bedrooms, covered porches. Higher cost ($125,000-$220,000) but maximum privacy and design flexibility. Best for larger lots (0.5+ acres) with room for separate structure.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">In-Law Suites & Granny Flats</h3>
              <p className="text-gray-700">
                Designed specifically for aging parents with accessibility features: no-step entries, wider doorways (36"), roll-in showers, grab bars, lever-style door handles, single-floor living. Full kitchens or kitchenettes depending on needs. Close proximity to main house while maintaining separate living space. Popular in Simpsonville for multigenerational families.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Utility Connections</h3>
              <p className="text-gray-700">
                Electrical sub-panels (100-amp service) run from main house panel. Water/sewer taps to existing lines with separate shutoffs. Septic system evaluation and upgrades if needed for additional bedroom. Mini-split HVAC systems (efficient for small spaces). Optional separate utility meters for tenant-paid utilities. All utility work coordinated with proper permits and inspections.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interior Finishing</h3>
              <p className="text-gray-700">
                Complete interior finishing: drywall, paint, flooring (LVP, tile, or carpet), kitchen cabinets and countertops, bathroom vanities and fixtures, trim work and doors. Separate HVAC thermostats for independent climate control. Energy-efficient LED lighting, low-flow fixtures. Choose finish levels from builder-grade to custom based on use (rental vs family suite).
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Turnkey Project Management</h3>
              <p className="text-gray-700">
                Single point of contact managing all trades: foundation contractors, framing crews, electricians, plumbers, HVAC techs, finish carpenters. Coordinate material deliveries, inspections (7-10 required throughout project), and final certificate of occupancy. Weekly progress updates with photos. Typical 10-16 week timeline from permit to move-in ready.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ADU Pricing in Simpsonville & Greenville County
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Garage Apartment</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$65-95K</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ 2-car garage below (24x24)</li>
                <li>✓ 500-700 sqft living space above</li>
                <li>✓ Full kitchen & bathroom</li>
                <li>✓ 1 bedroom + living area</li>
                <li>✓ Separate entrance & HVAC</li>
                <li>✓ Builder-grade finishes</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 24x24 garage with 576 sqft studio apartment = $75,000-$85,000 turnkey
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-500 shadow-lg">
              <div className="text-xs font-semibold text-blue-600 uppercase mb-2">Most Popular</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1-Bedroom Cottage</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$125-185K</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Detached 600-800 sqft cottage</li>
                <li>✓ Full kitchen with appliances</li>
                <li>✓ Complete bathroom with tub/shower</li>
                <li>✓ Bedroom + living room</li>
                <li>✓ Covered front porch</li>
                <li>✓ Mid-grade finishes (LVP, quartz)</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 24x30 detached cottage (720 sqft) = $145,000-$165,000 turnkey
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2-Bedroom ADU</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$175-220K</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Larger cottage 900-1200 sqft</li>
                <li>✓ Full kitchen & dining area</li>
                <li>✓ 1-2 full bathrooms</li>
                <li>✓ 2 bedrooms + living room</li>
                <li>✓ Laundry hookups</li>
                <li>✓ Custom finishes available</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 30x36 two-bedroom cottage (1,080 sqft) = $185,000-$205,000 turnkey
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Pricing includes:</strong> Design, permits, site work, foundation, complete construction, utilities, appliances, final inspections. <strong>Not included:</strong> Impact fees (varies by municipality), septic system upgrades if needed ($8K-$15K), furniture, landscaping. Detached cottages require proper lot size and setbacks per local ordinances.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions About ADUs
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
            ADU Builder Serving All of Upstate SC
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We build accessory dwelling units throughout Greenville County and surrounding areas. Based in Gray Court, we serve:
          </p>
          <ClickableCityGrid />
        </section>

        {/* Related Services */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Related ADU & Addition Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/garage-builder"
              className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Garage Builder</h3>
              <p className="text-gray-700 text-sm">
                Build a detached garage with apartment above. Most cost-effective ADU option at $65K-$95K.
              </p>
            </a>
            <a
              href="/room-additions"
              className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Room Additions</h3>
              <p className="text-gray-700 text-sm">
                Add square footage to your main house instead. Master suites, sunrooms, in-law additions.
              </p>
            </a>
            <a
              href="/contact"
              className="block bg-blue-50 p-6 rounded-lg border border-blue-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free ADU Consultation</h3>
              <p className="text-gray-700 text-sm">
                Schedule a free consultation to discuss your ADU project, zoning, and pricing estimates.
              </p>
            </a>
          </div>
        </section>
      </UniversalPageTemplate>
    </>
  );
}
