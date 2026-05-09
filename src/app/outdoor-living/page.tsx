import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Outdoor Living, Decks & Screened Porches in Upstate SC | Burch Contracting',
  description:
    'Custom decks, screened porches, and covered patios in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Composite decking, premium finishes. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/outdoor-living'),
  },
  openGraph: {
    title: 'Outdoor Living, Decks & Screened Porches | Burch Contracting',
    description: 'Custom outdoor spaces in Upstate SC. Decks, screened porches, covered patios. Free estimates.',
    url: absoluteUrl('/outdoor-living'),
    type: 'website',
    images: [{ url: absoluteUrl('/og-image.webp'), width: 1200, height: 630, alt: 'Outdoor Living, Decks & Screened Porches in Upstate SC | Burch Contracting' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Decks, Screened Porches & Outdoor Living | Burch Contracting',
    description: 'Custom decks, screened porches and covered patios in Simpsonville, Mauldin, Fountain Inn and Woodruff SC.',
    images: [absoluteUrl('/og-image.webp')],
  },
};

export default function OutdoorLivingPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Services', url: absoluteUrl('/services') },
    { name: 'Outdoor Living', url: absoluteUrl('/outdoor-living') },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Outdoor Living, Decks &amp; Screened Porches in Upstate SC</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Custom decks, screened porches & covered patios for Simpsonville, Mauldin, Fountain Inn & Woodruff
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="/contact">
              Request Free Estimate
            </Button>
            <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-slate-900">
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <Section background="white" padding="lg">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Expand Your Living Space Outdoors</h2>
          <p className="mt-4 text-lg text-gray-600">
            Enjoy beautiful outdoor entertaining spaces built to last. We design and construct decks, screened porches, and covered patios that blend with your home and enhance your lifestyle.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Custom Decks</h3>
            <p className="text-gray-600">
              Composite, pressure-treated, or hardwood decks. Multi-level designs for sloped yards. Stairs, railings, and built-in seating.
            </p>
            <Link href="/outdoor-living/decks" className="text-blue-700 font-semibold text-sm hover:underline mt-3 inline-block">
              Learn More →
            </Link>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Screened Porches</h3>
            <p className="text-gray-600">
              Protected outdoor rooms for bug-free entertaining. Aluminum or wood screens, ceiling fans, and lighting.
            </p>
            <Link href="/outdoor-living/screened-porches" className="text-blue-700 font-semibold text-sm hover:underline mt-3 inline-block">
              Learn More →
            </Link>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Covered Patios</h3>
            <p className="text-gray-600">
              Roofed outdoor spaces for shade and weather protection. Great for dining areas and entertaining year-round.
            </p>
            <Link href="/outdoor-living/covered-patios" className="text-blue-700 font-semibold text-sm hover:underline mt-3 inline-block">
              Learn More →
            </Link>
          </Card>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Outdoor Living?</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Adds Home Value:</strong> Outdoor spaces increase property value 50–100% of construction cost</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Extends Living Season:</strong> Enjoy your yard 9+ months per year in Upstate SC</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Entertainment Ready:</strong> Perfect for family gatherings, barbecues, and relaxation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Low Maintenance Options:</strong> Composite decking requires minimal maintenance vs wood</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* Service Areas */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Service Areas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {['Simpsonville', 'Mauldin', 'Fountain Inn', 'Woodruff'].map((city) => (
            <Link
              key={city}
              href={`/service-areas/${city.toLowerCase()}-sc`}
              className="block p-6 rounded-lg border border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="font-bold text-slate-900">{city}, SC</h3>
              <p className="text-gray-600 text-sm">Decks, Screened Porches & Outdoor Living</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Design Considerations */}
      <Section background="white" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Outdoor Living Design</h2>
          <p className="mt-4 text-lg text-gray-600">
            Every outdoor project is designed around your home's architecture and your lifestyle needs.
          </p>
        </div>
        <ul className="space-y-4 text-gray-700 max-w-3xl">
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">•</span>
            <div><strong>Layout & Traffic Flow:</strong> We design for natural movement and functional zones (dining, lounging, grilling)</div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">•</span>
            <div><strong>Materials & Durability:</strong> Composite decking, pressure-treated lumber, or hardwood—each with pros and cons</div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">•</span>
            <div><strong>Weather Resistance:</strong> Upstate SC humidity and freeze-thaw cycles require quality materials and proper grading</div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">•</span>
            <div><strong>Architectural Integration:</strong> Colors, roofline, and railings match your home's style</div>
          </li>
        </ul>
      </Section>

      {/* FAQ */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Outdoor Living FAQs</h2>
        <div className="space-y-6 max-w-3xl">
          {[
            {
              q: 'What\'s the best deck material for SC?',
              a: 'Composite decking is our top recommendation. It lasts 25+ years with minimal maintenance, handles humidity and temperature swings, and doesn\'t rot or warp. Pressure-treated wood is budget-friendly but requires sealing every 2–3 years.'
            },
            {
              q: 'How much does a deck cost?',
              a: 'Decks typically cost $30–$50 per square foot installed. A 12x16 pressure-treated deck runs $12,000–$15,000. Composite decks with stairs run $18,000–$28,000. Factors: materials, complexity, site access.'
            },
            {
              q: 'Do I need a permit for a deck?',
              a: 'Yes, decks over 18 inches high or larger than 200 sqft require permits in Simpsonville, Mauldin, Fountain Inn, and Woodruff. Permits ensure proper footings and code compliance. We handle permitting.'
            },
            {
              q: 'How long does a screened porch last?',
              a: 'Screened porches last 20–30 years if properly maintained. The roof and framing last the longest. Screens may need replacement every 10–15 years. Aluminum frames outlast wood.'
            },
            {
              q: 'Can I add a roof to my deck?',
              a: 'Yes! A covered deck (pergola or full roof) costs $55–$85 per sqft. A full roof protects against rain and adds HVAC-friendly space. Pergolas provide partial shade at lower cost ($35–$50/sqft).'
            },
          ].map((faq, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-gray-700">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="blue" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready for Outdoor Living?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Get a free estimate for your deck, screened porch, or patio project.
          </p>
          <Button variant="primary" size="lg" href="/contact" className="bg-white text-gray-900 hover:bg-gray-100">
            Request Free Estimate
          </Button>
        </div>
      </Section>
    </>
  );
}
