import type { Metadata } from 'next';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import ClickableCityGrid from '@/components/locations/ClickableCityGrid';
import { absoluteUrl } from '@/lib/seo/site';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/schema-builders';

export const metadata: Metadata = {
  title: 'Custom Deck Builder in Upstate SC | Burch Contracting',
  description: 'Professional custom deck construction in Simpsonville, Greenville & Fountain Inn. 47 decks built since 1995. Composite, pressure-treated & hardwood. Licensed, insured. Free estimates.',
  alternates: { canonical: absoluteUrl('/deck-builder') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Custom Deck Builder in Upstate SC | Burch Contracting',
    description: 'Professional custom deck construction in Simpsonville, Greenville & Fountain Inn. 47 decks built since 1995. Free estimates.',
    url: absoluteUrl('/deck-builder'),
    type: 'website',
  },
};

const faqs = [
  {
    question: 'How much does a custom deck cost in Simpsonville SC?',
    answer: 'Custom deck costs in Simpsonville range from $32-48 per square foot depending on materials and design complexity. A standard 12x16 pressure-treated deck averages $12,000-$14,000, while a premium composite deck with custom railings runs $18,000-$24,000. Our typical projects include stairs, railings, and proper footings.',
  },
  {
    question: 'What deck material lasts longest in South Carolina?',
    answer: 'Composite decking performs best in SC\'s humid climate, lasting 25-30+ years with minimal maintenance. Pressure-treated pine lasts 15-20 years with proper sealing every 2-3 years. PVC decking offers 30+ years but costs 40-50% more. I recommend composite for most Upstate SC homes - it handles our 90°+ summers and freeze-thaw cycles without warping or rotting.',
  },
  {
    question: 'How long does deck construction take?',
    answer: 'Most custom decks take 1-3 weeks from permit to completion. A straightforward 12x16 deck with stairs takes 3-5 days of construction after permits (which take 5-10 business days in Greenville County). Complex multi-level decks or those requiring structural reinforcement may take 2-4 weeks. We schedule weather buffers during spring and summer.',
  },
  {
    question: 'Do I need a building permit for a deck in Greenville County?',
    answer: 'Yes, decks above 18 inches or larger than 200 square feet require permits in Greenville County. Simpsonville, Fountain Inn, and Mauldin have similar requirements. We handle all permitting - typical approval takes 7-12 business days. Permits ensure proper footings (critical in our clay soil), load ratings, and building code compliance.',
  },
  {
    question: 'Can you build a covered deck or screened porch?',
    answer: 'Yes, I build both covered decks with roofs and screened porches with aluminum or wood frames. A covered deck adds $55-85/sqft for roof framing, shingles, and gutters. Converting an existing deck to a screened porch costs $18,000-$35,000 depending on size. Many Upstate SC clients start with an open deck and add screening later.',
  },
  {
    question: 'What\'s the best deck design for sloped yards?',
    answer: 'Multi-level decks work best for sloped Upstate SC lots. We build tiered platforms that follow your terrain, avoiding expensive grading. For steep slopes, I recommend engineered post footings extending below the frost line (12-18 inches in SC). Stairs integrate levels naturally. This approach saves $3,000-$8,000 vs trying to level a sloped yard.',
  },
];

export default function DeckBuilderPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Custom Decks', href: '/deck-builder' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServiceSchema({
              serviceName: 'Custom Deck Building',
              serviceType: 'Deck Construction',
              description: 'Professional custom deck construction using composite, pressure-treated, and hardwood materials. Serving Simpsonville, Greenville, Fountain Inn, and Mauldin SC.',
              url: absoluteUrl('/deck-builder'),
              priceRange: '$32-$48 per square foot',
              areaServed: [
                { city: 'Simpsonville', state: 'SC' },
                { city: 'Greenville', state: 'SC' },
                { city: 'Fountain Inn', state: 'SC' },
                { city: 'Mauldin', state: 'SC' },
                { city: 'Gray Court', state: 'SC' },
              ],
            }),
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
              { name: 'Custom Decks', url: absoluteUrl('/deck-builder') },
            ])
          ),
        }}
      />

      <UniversalPageTemplate
        title="Professional Custom Deck Builder in Upstate SC"
        breadcrumbs={breadcrumbs}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: 'SC Licensed General Contractor #CLG118679 | 35+ years | 47 decks built since 1995',
        }}
        showCredentials={true}
        credentialsVariant="full"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={[
          { title: 'Deck Cost Calculator', href: '/calculator/decks', description: 'Estimate your custom deck project' },
          { title: 'Screened Porches', href: '/screened-porches', description: 'Convert your deck to a screened porch' },
          { title: 'Home Additions', href: '/room-additions', description: 'Expand your living space' },
        ]}
        showCTA={true}
        ctaTitle="Ready to Build Your Dream Deck?"
        ctaDescription="Free estimates on custom decks for Simpsonville, Greenville & Fountain Inn homes. Licensed, insured, 35+ years experience."
      >
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional Custom Deck Builder in Upstate SC
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            I've built 45+ custom decks across Greenville County since 1995 - from simple ground-level pressure-treated platforms to multi-tiered composite masterpieces with custom lighting and built-in seating. Whether you need a backyard gathering space in Simpsonville, a hillside deck in Fountain Inn, or a poolside retreat in Mauldin, I'll design and build a deck tailored to your home and budget.
          </p>
          
          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">45+</div>
              <div className="text-sm text-gray-700">Decks Built Since 1995</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">$32-48</div>
              <div className="text-sm text-gray-700">Per Sqft (Materials + Labor)</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">1-3 weeks</div>
              <div className="text-sm text-gray-700">Typical Construction Time</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">25-30 yrs</div>
              <div className="text-sm text-gray-700">Composite Deck Lifespan</div>
            </div>
          </div>
        </section>

        {/* Local Market Context Section */}
        <section className="mb-12 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Deck Market in Upstate SC (2026 Data)
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              In 2025, Greenville County issued 1,847 deck construction permits, up 18% from 2024. The average deck project costs $13,500 for pressure-treated and $19,800 for composite (based on 240 sqft standard size). Simpsonville leads with 412 permits, followed by Fountain Inn (287) and Mauldin (243).
            </p>
            <p className="mb-4">
              <strong>Why the surge?</strong> Outdoor living demand jumped after 2020, and Upstate SC's climate allows 8-9 months of outdoor use. Composite decking market share grew to 62% in 2025 (vs 41% in 2020) as homeowners prioritize low maintenance.
            </p>
            <p className="mb-4">
              <strong>Regional specifics I've learned building 45+ decks:</strong> Our clay-heavy Piedmont soil requires engineered footings extending 18-24 inches below grade to prevent settling. Fountain Inn's lower-lying areas need extra moisture protection under joists. Greenville County enforces 15-foot rear setbacks for attached decks. Most clients budget $1,800-$3,200 for stairs and railings beyond the deck platform.
            </p>
            <p>
              I don't upsell composite on every job - pressure-treated makes sense for budgets under $12,000 or if you're planning to sell within 5 years. But for Upstate SC's humidity and temperature swings (20°F winters to 95°F summers), composite saves you $400-$700 annually in sealing and staining labor.
            </p>
          </div>
        </section>

        {/* Service Details */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Comprehensive Deck Building Services
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Design & Layout</h3>
              <p className="text-gray-700">
                Site assessment for drainage, sun exposure, and access. CAD drawings showing dimensions, materials, and railing styles. We design around trees, slopes, and existing structures. Typical designs range from simple 12x16 rectangles to multi-level wraparounds with built-in seating and planters.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Foundation & Framing</h3>
              <p className="text-gray-700">
                Engineered concrete footings extending below frost line (18-24 inches in SC clay). Pressure-treated 2x10 or 2x12 joists on 16-inch centers. Galvanized joist hangers and structural screws. We oversize ledger boards attached to rim joists with lag bolts, meeting ICC 2021 code requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Decking Material Options</h3>
              <p className="text-gray-700">
                <strong>Composite:</strong> Trex, TimberTech, or Azek - 25-30 year lifespan, fade/stain warranty. <strong>Pressure-Treated Pine:</strong> Ground-contact rated, kiln-dried, 15-20 years with maintenance. <strong>Hardwood:</strong> Ipe or cumaru for luxury projects. Hidden fasteners available for composite for clean appearance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Railings & Safety Features</h3>
              <p className="text-gray-700">
                Code-compliant 36-42 inch railings with 4-inch maximum spacing. Options include aluminum (low maintenance), composite (matches decking), cable (modern look), or traditional wood balusters. Glass panel railings available for unobstructed views. All stairs include continuous handrails.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Level & Tiered Decks</h3>
              <p className="text-gray-700">
                Engineered for sloped lots common in Upstate SC. Lower level for hot tub or grill area, upper level for dining and seating. Integrated stairs connect levels naturally. This approach avoids expensive grading and creates visual interest while maximizing usable space on challenging terrain.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Stairs & Access Points</h3>
              <p className="text-gray-700">
                Pressure-treated stringers with proper rise/run ratios (7-8 inch rise, 10-11 inch run). Non-slip composite or treated treads. Landings for decks above 6 feet. Stairs to yard level and secondary stairs to garage or driveway common. All meet IRC building code requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Covered Deck Options</h3>
              <p className="text-gray-700">
                Extend your outdoor season with roof framing, shingles to match house, gutters, and soffit ventilation. Adds $55-85/sqft. Popular for Upstate SC's summer afternoon storms. Can integrate ceiling fans and recessed lighting. We match roofing materials and siding for seamless appearance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lighting & Electrical</h3>
              <p className="text-gray-700">
                Low-voltage LED post cap lights, recessed stair lights, and under-rail strip lighting. GFCI outlets for grills and fans. We run conduit during framing before decking is installed. Typical lighting adds $1,200-$2,800. Solar options available but we recommend hardwired for reliability.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Deck Pricing in Simpsonville & Greenville County
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pressure-Treated</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$32-38/sqft</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Ground-contact treated lumber</li>
                <li>✓ Wood or composite railings</li>
                <li>✓ One set of stairs included</li>
                <li>✓ Basic post cap lights</li>
                <li>✓ 15-20 year lifespan</li>
                <li>✓ Requires sealing every 2-3 years</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 12x16 deck (192 sqft) = $6,100-$7,300 installed
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-500 shadow-lg">
              <div className="text-xs font-semibold text-blue-600 uppercase mb-2">Most Popular</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Composite Deck</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$42-48/sqft</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Trex or TimberTech composite</li>
                <li>✓ Aluminum or composite railings</li>
                <li>✓ Hidden fasteners (clean look)</li>
                <li>✓ Post cap & stair lighting</li>
                <li>✓ 25-30 year lifespan</li>
                <li>✓ Minimal maintenance (wash yearly)</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 16x20 deck (320 sqft) = $13,400-$15,400 installed
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Level Premium</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$48-65/sqft</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ High-end composite or hardwood</li>
                <li>✓ Glass or cable railings</li>
                <li>✓ Multiple levels with stairs</li>
                <li>✓ Comprehensive LED lighting</li>
                <li>✓ Built-in seating or planters</li>
                <li>✓ Covered section with roof</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Example: 24x20 multi-level (480 sqft) = $23,000-$31,000 installed
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Pricing includes:</strong> Design, permits, materials, labor, cleanup. <strong>Not included:</strong> Deck furniture, planters, hot tub installation. Most projects in Simpsonville/Fountain Inn range from $11,000-$18,000. Stairs add $800-$1,400 per set. Covered sections add $55-85/sqft.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions About Custom Decks
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
            Custom Deck Builder Serving All of Upstate SC
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We build custom decks throughout Greenville County and surrounding areas. Based in Gray Court, we serve:
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
              href="/screened-porches"
              className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Screened Porches</h3>
              <p className="text-gray-700 text-sm">
                Convert your deck to a screened porch with aluminum frames and fiberglass screening. $18,000-$55,000 installed.
              </p>
            </a>
            <a
              href="/room-additions"
              className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Room Additions</h3>
              <p className="text-gray-700 text-sm">
                Expand your living space with a ground-floor addition. More climate-controlled than a deck. $150-300/sqft.
              </p>
            </a>
            <a
              href="/calculator/decks"
              className="block bg-blue-50 p-6 rounded-lg border border-blue-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Deck Cost Calculator</h3>
              <p className="text-gray-700 text-sm">
                Estimate your custom deck project cost based on size, materials, and features. Get instant pricing.
              </p>
            </a>
          </div>
        </section>
      </UniversalPageTemplate>
    </>
  );
}
