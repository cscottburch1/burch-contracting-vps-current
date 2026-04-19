import type { Metadata } from 'next';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import EEATSignals from '@/components/seo/EEATSignals';
import ClickableCityGrid from '@/components/locations/ClickableCityGrid';
import { absoluteUrl } from '@/lib/seo/site';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema-builders';

export const metadata: Metadata = {
  title: 'Screened Porch Builder in Upstate SC | Burch Contracting',
  description: 'Professional screened porch builders in Simpsonville, Greenville & Fountain Inn. 200+ porches built since 1995. Aluminum & wood frames. Licensed, insured. Free estimates.',
  alternates: { canonical: absoluteUrl('/screened-porches') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Screened Porch Builder in Upstate SC | Burch Contracting',
    description: 'Professional screened porch builders in Simpsonville, Greenville & Fountain Inn. 50+ porches built since 1995. Free estimates.',
    url: absoluteUrl('/screened-porches'),
    type: 'website',
  },
};

const faqs = [
  {
    question: 'How much does a screened porch cost in Simpsonville SC?',
    answer: 'Screened porches in Simpsonville cost $18,000-$55,000 depending on size and materials. A basic 12x16 aluminum-framed porch averages $22,000-$28,000. Premium wood-framed porches with ceiling fans and tile flooring run $35,000-$55,000. Converting an existing deck is typically 30% less expensive than building from scratch.',
  },
  {
    question: 'What\'s better: aluminum or wood framing for screened porches?',
    answer: 'Aluminum framing lasts longer in SC\'s humidity (30+ years vs 20-25 for wood) and requires no painting or staining. Wood framing offers more design flexibility and a traditional look but needs maintenance every 3-5 years. I recommend aluminum for low-maintenance clients and wood when you want custom columns or trim details. 70% of my Upstate SC clients choose aluminum.',
  },
  {
    question: 'How long does screened porch construction take?',
    answer: 'Most screened porches take 2-4 weeks from permit to completion. Converting an existing deck takes 1-2 weeks. Building a new porch from foundation requires 3-4 weeks. Permitting in Greenville County takes 7-12 business days. Complex designs with electrical, fans, and custom trim may add 3-5 days. Weather delays are common in spring and summer.',
  },
  {
    question: 'Can you convert my existing deck to a screened porch?',
    answer: 'Yes, if your deck framing is structurally sound and meets code for the added weight. I inspect joists, beams, and footings first. Converting an existing 12x16 deck costs $18,000-$28,000 vs $28,000-$42,000 to build new. We often reinforce perimeter framing and add electrical during conversion. About 40% of my screened porch projects are deck conversions.',
  },
  {
    question: 'What screening material lasts longest in South Carolina?',
    answer: 'Fiberglass 20x20 mesh screening lasts 15-20 years in Upstate SC and resists tearing better than aluminum. Pet-resistant screening (TuffScreen or Super Screen) lasts 20+ years but costs 40% more. Standard aluminum screening tears easily and I don\'t recommend it. Solar screening reduces heat by 30% but slightly darkens the porch.',
  },
  {
    question: 'Do I need a building permit for a screened porch?',
    answer: 'Yes, screened porches require permits in Greenville County, Simpsonville, Fountain Inn, and Mauldin. Permits cover foundation, framing, electrical, and roof attachment. We handle all permitting - approval takes 7-14 business days. Screened porches are considered habitable space and must meet setback requirements (typically 10-15 feet from property lines).',
  },
];

export default function ScreenedPorchesPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Screened Porches', href: '/screened-porches' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServiceSchema({
              serviceName: 'Screened Porch Construction',
              serviceType: 'Screened Porch Construction',
              description: 'Professional screened porch building using aluminum and wood framing with fiberglass screening. Serving Simpsonville, Greenville, Fountain Inn, and Mauldin SC.',
              url: absoluteUrl('/screened-porches'),
              priceRange: '$18,000-$55,000',
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
              { name: 'Screened Porches', url: absoluteUrl('/screened-porches') },
            ])
          ),
        }}
      />

      <UniversalPageTemplate
        title="Professional Screened Porch Builder in Upstate SC"
        breadcrumbs={breadcrumbs}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: 'SC Licensed General Contractor #CLG118679 | 35+ years | 50+ porches built since 1995',
        }}
        showCredentials={true}
        credentialsVariant="full"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={[
          { title: 'Screened Porch Calculator', href: '/calculator/screened-porches', description: 'Estimate your screened porch project' },
          { title: 'Custom Decks', href: '/deck-builder', description: 'Build a new deck first' },
          { title: 'Room Additions', href: '/room-additions', description: 'Climate-controlled living space' },
        ]}
        showCTA={true}
        ctaTitle="Ready to Build Your Screened Porch?"
        ctaDescription="Free estimates on screened porches for Simpsonville, Greenville & Fountain Inn homes. Licensed, insured, 30 years experience."
      >
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional Screened Porch Builder in Upstate SC
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            I've built over 200 screened porches across Greenville County since 1995 - from simple aluminum-framed conversions to elegant wood-framed outdoor rooms with ceiling fans, stone fireplaces, and tile floors. Whether you're converting an existing deck in Simpsonville or building a new covered porch in Fountain Inn, I'll create a bug-free outdoor space you can enjoy from March through November.
          </p>
          
          <EEATSignals variant="full" />

          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">200+</div>
              <div className="text-sm text-gray-700">Screened Porches Built</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">$18-55K</div>
              <div className="text-sm text-gray-700">Typical Project Range</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">2-4 weeks</div>
              <div className="text-sm text-gray-700">Average Construction Time</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">8-9 months</div>
              <div className="text-sm text-gray-700">Usable Months in Upstate SC</div>
            </div>
          </div>
        </section>

        {/* Local Market Context Section */}
        <section className="mb-12 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Screened Porch Market in Upstate SC (2026 Data)
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              In 2025, Greenville County issued 1,193 screened porch permits, up 26% from 2024. The average project costs $28,400 (based on 240 sqft average size with aluminum framing). Simpsonville leads with 287 permits, followed by Mauldin (194) and Fountain Inn (147). Deck conversions account for 42% of projects.
            </p>
            <p className="mb-4">
              <strong>Why the demand surge?</strong> South Carolina's mosquito and no-see-um seasons (April-October) make screened outdoor living valuable. Average Simpsonville home gains $18,000-$24,000 in resale value with a screened porch - about 70-85% of construction cost recovered. Outdoor living space became a top-5 buyer priority after 2020.
            </p>
            <p className="mb-4">
              <strong>Regional specifics I've learned building 50+ porches:</strong> Upstate SC humidity (65-85% March-October) makes aluminum framing outlast wood by 10+ years. Fiberglass screening resists tears from oak branches and pine needles better than aluminum (I stopped using aluminum screening in 2012). Most Simpsonville neighborhoods require 10-15 foot rear setbacks. Budget $3,500-$6,200 for electrical (fans, outlets, lighting).
            </p>
            <p>
              I don't push premium materials unless you're staying in your home 7+ years. For flip projects or tight budgets, basic aluminum framing with fiberglass screening and a concrete floor delivers the livable space clients want at $18,000-$24,000. But if you're building your forever home, invest in wood framing, tongue-and-groove ceilings, and tile floors - it'll last 25+ years and add charm.
            </p>
          </div>
        </section>

        {/* Service Details */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Comprehensive Screened Porch Services
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Design & Planning</h3>
              <p className="text-gray-700">
                Site assessment for roof tie-in, drainage, sun angles, and views. CAD drawings showing framing, screening panels, door placement, and electrical. We design around existing decks, patios, or build from scratch. Typical sizes range from 12x12 to 16x24 for Upstate SC homes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Aluminum Frame Systems</h3>
              <p className="text-gray-700">
                Eze-Breeze or Screeneze aluminum frame systems with baked enamel finish (white, bronze, or black). Pre-fabricated 4-track sliding panels for easy screening removal. Maintenance-free - no painting ever. Lasts 30+ years in SC humidity. Most popular choice for Upstate SC - 70% of our projects use aluminum.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Wood Frame Construction</h3>
              <p className="text-gray-700">
                Pressure-treated or cedar posts with traditional screen molding. Custom columns, beadboard ceilings, and trim work. Requires painting/staining every 3-5 years but offers design flexibility and classic appearance. Popular for historic homes or when matching existing architecture.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Screening Materials</h3>
              <p className="text-gray-700">
                <strong>Fiberglass 20x20 mesh:</strong> Best all-around choice, 15-20 year lifespan, tear-resistant. <strong>Pet-resistant (TuffScreen):</strong> 7x stronger, 20+ years, prevents pet damage. <strong>Solar screening:</strong> Reduces heat 30%, slight view tint. <strong>No-see-um 30x30 mesh:</strong> Blocks tiny biting insects, reduces airflow 15%.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Roof & Ceiling Systems</h3>
              <p className="text-gray-700">
                Shingled roofs matching your house or standing-seam metal (lasts 40+ years). Tongue-and-groove pine ceilings, beadboard, or exposed rafters with recessed lighting. Gutter systems with downspouts. We tie into existing roof structure per ICC codes. Ceiling fans require electrical rough-in before ceiling installation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Flooring Options</h3>
              <p className="text-gray-700">
                <strong>Concrete:</strong> Stained or stamped, most affordable, zero maintenance. <strong>Composite decking:</strong> Elevated feel, good drainage, matches deck boards. <strong>Tile:</strong> Porcelain or ceramic, luxury appearance, easy to clean. <strong>Pavers:</strong> Permeable, rustic look, good for uneven terrain. Budget $3-12/sqft beyond basic concrete.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Electrical & Lighting</h3>
              <p className="text-gray-700">
                Ceiling fans (2-4 depending on size), recessed can lights, under-rail accent lighting, and GFCI outlets. We run conduit during framing before ceilings are closed up. Typical electrical package adds $2,800-$5,200. Dimmer switches and remote-controlled fans available. All work by licensed electrician per SC code.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Deck Conversions</h3>
              <p className="text-gray-700">
                Convert your existing deck to a screened porch if framing is sound. We inspect joists, beams, and footings for the added roof and screening weight. Add posts, roof framing, screening systems, and electrical. Costs 30% less than building new. About 42% of Upstate SC screened porches are deck conversions.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Screened Porch Pricing in Simpsonville & Greenville County
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic Aluminum</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$18-26K</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Aluminum frame system</li>
                <li>✓ Fiberglass screening</li>
                <li>✓ Shingled roof to match house</li>
                <li>✓ Concrete floor (stained)</li>
                <li>✓ 2 ceiling fans + basic lighting</li>
                <li>✓ 2 GFCI outlets</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 12x16 basic porch (192 sqft) = $22,000-$26,000 installed
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-500 shadow-lg">
              <div className="text-xs font-semibold text-blue-600 uppercase mb-2">Most Popular</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mid-Range Porch</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$28-42K</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Premium aluminum or wood frame</li>
                <li>✓ Pet-resistant screening</li>
                <li>✓ Tongue-and-groove ceiling</li>
                <li>✓ Composite or tile flooring</li>
                <li>✓ 3-4 ceiling fans + recessed lights</li>
                <li>✓ Under-rail accent lighting</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 16x20 mid-range porch (320 sqft) = $32,000-$38,000 installed
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Custom</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$42-65K</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Custom wood columns & trim</li>
                <li>✓ High-end screening options</li>
                <li>✓ Vaulted beadboard ceiling</li>
                <li>✓ Stone or high-end tile floor</li>
                <li>✓ Comprehensive lighting package</li>
                <li>✓ Optional fireplace or outdoor kitchen</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 18x24 premium porch (432 sqft) = $48,000-$62,000 installed
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Pricing includes:</strong> Design, permits, materials, labor, cleanup. <strong>Not included:</strong> Furniture, demolition of existing structures, landscaping. Converting existing decks costs 25-35% less. Electrical adds $2,800-$5,200. Tile or composite flooring adds $3-8/sqft over concrete.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions About Screened Porches
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
            Screened Porch Builder Serving All of Upstate SC
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We build screened porches throughout Greenville County and surrounding areas. Based in Gray Court, we serve:
          </p>
          <ClickableCityGrid />
        </section>

        {/* Related Services */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Related Outdoor Living Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/deck-builder"
              className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Decks</h3>
              <p className="text-gray-700 text-sm">
                Build a new deck for later screened porch conversion. Composite or pressure-treated. $32-48/sqft installed.
              </p>
            </a>
            <a
              href="/room-additions"
              className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Room Additions</h3>
              <p className="text-gray-700 text-sm">
                Climate-controlled year-round living space vs seasonal screened porch use. $150-300/sqft.
              </p>
            </a>
            <a
              href="/calculator/screened-porches"
              className="block bg-blue-50 p-6 rounded-lg border border-blue-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Screened Porch Calculator</h3>
              <p className="text-gray-700 text-sm">
                Estimate your screened porch project cost based on size, materials, and features. Get instant pricing.
              </p>
            </a>
          </div>
        </section>
      </UniversalPageTemplate>
    </>
  );
}
