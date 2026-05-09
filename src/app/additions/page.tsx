import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from '@/lib/seo/schema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Home Additions Contractor in Upstate SC | Burch Contracting',
  description:
    'Professional home additions & room expansions in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Custom designs, skilled craftsmanship, licensed & insured. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/additions'),
  },
  openGraph: {
    title: 'Home Additions Contractor in Upstate SC | Burch Contracting',
    description: 'Professional home additions & room expansions in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Free estimates.',
    url: absoluteUrl('/additions'),
    type: 'website',
    images: [{ url: absoluteUrl('/og-image.webp'), width: 1200, height: 630, alt: 'Home Additions Contractor in Upstate SC | Burch Contracting' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Additions Contractor | Upstate SC | Burch Contracting',
    description: 'Home additions & room expansions in Simpsonville, Mauldin, Fountain Inn and Woodruff SC.',
    images: [absoluteUrl('/og-image.webp')],
  },
};

export default function AdditionsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Services', url: absoluteUrl('/services') },
    { name: 'Additions', url: absoluteUrl('/additions') },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Home Additions Contractor in Upstate SC</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Professional room additions, family room expansions, and home extensions for Simpsonville, Mauldin, Fountain Inn & Woodruff SC
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

      {/* What We Do */}
      <Section background="white" padding="lg">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">What Are Home Additions?</h2>
          <p className="mt-4 text-lg text-gray-600">
            A room addition expands your home's square footage by adding new living space. Whether you need an extra bedroom, a larger family room, or a dedicated home office, we design and build additions that blend seamlessly with your existing home.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Family Room Additions</h3>
            <p className="text-gray-600">
              Open-concept family rooms designed for entertainment and everyday living. Perfect for growing families and entertaining guests.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Bedroom Expansions</h3>
            <p className="text-gray-600">
              Additional bedrooms for growing families, guest suites, or ADU concepts. Custom layouts matched to your home's architecture.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Kitchen Extensions</h3>
            <p className="text-gray-600">
              Expanded kitchens with island seating, walk-in pantries, and breakfast nooks. Modern, functional designs that add value.
            </p>
          </Card>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Choose Burch Contracting?</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>30+ Years Experience:</strong> Over three decades building additions in Upstate SC</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Licensed & Insured:</strong> SC General Contractor #CLG118679 with full liability coverage</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Local Expertise:</strong> Familiar with Simpsonville, Mauldin, Fountain Inn & Woodruff permit processes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Transparent Pricing:</strong> Clear, upfront estimates with no surprises</span>
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
              <p className="text-gray-600 text-sm">Room Additions & Home Expansions</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Planning Section */}
      <Section background="white" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Planning Your Addition</h2>
          <p className="mt-4 text-lg text-gray-600">
            Every addition starts with clear planning. Here's what to consider before you begin:
          </p>
        </div>
        <ul className="space-y-4 text-gray-700 max-w-3xl">
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">1.</span>
            <div>
              <strong>Zoning & Setbacks:</strong> Your lot size, setback requirements, and HOA rules affect design options. We verify these early.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">2.</span>
            <div>
              <strong>Foundation & Utilities:</strong> Existing utilities (plumbing, electrical, HVAC) must connect cleanly to your new space.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">3.</span>
            <div>
              <strong>Roof & Siding Match:</strong> New additions must match your home's existing roofline, materials, and exterior finish.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">4.</span>
            <div>
              <strong>Timeline & Budget:</strong> Most additions take 8-16 weeks. Budgets start at $45k for modest 200 sqft expansions.
            </div>
          </li>
        </ul>
      </Section>

      {/* FAQ Section */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Frequently Asked Questions</h2>
        <div className="space-y-6 max-w-3xl">
          {[
            {
              q: 'How much does a room addition cost?',
              a: 'Room additions in Upstate SC cost $40,000–$80,000+ for a 200–400 sqft addition. Costs depend on foundation type, roof complexity, HVAC extension, and materials. A basic family room addition runs $45k–$60k. Premium finishes or custom features can increase costs significantly.'
            },
            {
              q: 'How long does an addition take?',
              a: 'Most additions take 8–16 weeks from permit approval to completion. Permitting typically takes 2–4 weeks. Simple additions can move faster; complex designs with structural changes take longer. We schedule weather buffers.'
            },
            {
              q: 'Do I need permits for an addition?',
              a: 'Yes, all room additions require building permits in Simpsonville, Mauldin, Fountain Inn, and Woodruff. Permits ensure code compliance, structural integrity, and proper HVAC/electrical design. We handle permitting for you.'
            },
            {
              q: 'Will an addition increase my property value?',
              a: 'Yes, room additions typically add 50–80% of construction cost to property value. A $60k addition might add $30k–$48k in resale value, depending on market and quality of execution. Additions also improve daily living comfort.'
            },
            {
              q: 'Can you match my home\'s exterior?',
              a: 'Absolutely. We match your home\'s roofline, siding, and exterior details. Using original materials when possible ensures continuity. If original materials are discontinued, we find the closest match available.'
            },
          ].map((faq, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-gray-700">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section background="blue" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to Expand Your Home?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Get a free estimate for your room addition. We'll walk you through options and pricing.
          </p>
          <Button variant="primary" size="lg" href="/contact" className="bg-white text-gray-900 hover:bg-gray-100">
            Request Free Estimate
          </Button>
        </div>
      </Section>
    </>
  );
}
