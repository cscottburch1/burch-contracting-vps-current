import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Custom Deck Builder | Composite & Wood Decks | Upstate SC | Burch Contracting',
  description:
    'Custom deck construction in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Composite, pressure-treated, and hardwood decks. Licensed, insured. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/outdoor-living/decks'),
  },
  openGraph: {
    title: 'Custom Deck Builder | Upstate SC | Burch Contracting',
    description: 'Custom decks built in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Free estimates.',
    url: absoluteUrl('/outdoor-living/decks'),
    type: 'website',
  },
};

const faqs = [
  {
    q: 'How much does a custom deck cost in Simpsonville SC?',
    a: 'Decks in Upstate SC typically cost $30–$50 per square foot installed. A standard 12×16 pressure-treated deck runs $12,000–$15,000. Composite decks with stairs and railings typically run $18,000–$28,000. We provide detailed written estimates at no charge.',
  },
  {
    q: 'What deck material is best for SC\'s climate?',
    a: 'Composite decking handles SC humidity and temperature swings without warping or rotting. It lasts 25–30+ years with minimal maintenance. Pressure-treated wood is more affordable but needs sealing every 2–3 years. We recommend composite for most homeowners.',
  },
  {
    q: 'Do I need a permit for a deck in Greenville County?',
    a: 'Yes. Decks above 18 inches or over 200 square feet require a building permit in Greenville County. We handle all permitting for you â€” typical approval takes 7–12 business days.',
  },
  {
    q: 'How long does deck construction take?',
    a: 'Most decks take 1–2 weeks of construction after permits are approved. Complex multi-level decks may take 2–3 weeks. We keep you updated throughout.',
  },
];

export default function DecksPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Services', url: absoluteUrl('/services') },
    { name: 'Decks', url: absoluteUrl('/outdoor-living/decks') },
  ]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-300">
            Outdoor Living
          </p>
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Custom Deck Construction</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Composite, pressure-treated, and hardwood decks built for Simpsonville, Mauldin, Fountain Inn &amp; Woodruff SC
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="/contact">
              Request Free Estimate
            </Button>
            <Button
              variant="outline"
              size="lg"
              href={siteConfig.phoneHref}
              className="border-white text-white hover:bg-white hover:text-slate-900"
            >
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <Section background="white" padding="lg">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Built to Last in Upstate SC</h2>
          <p className="mt-4 text-lg text-gray-600">
            We design and build custom decks that match your home's style and your outdoor lifestyle. From simple ground-level platforms to multi-level decks with built-in seating, we handle design, permitting, and construction.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Composite Decks</h3>
            <p className="text-gray-600 text-sm">
              Low-maintenance composite decking that resists rot, fading, and warping. Lasts 25–30+ years with minimal upkeep.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pressure-Treated Wood</h3>
            <p className="text-gray-600 text-sm">
              Durable and affordable. Classic look with proper sealing. Budget-friendly option for most homeowners.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-Level Decks</h3>
            <p className="text-gray-600 text-sm">
              Tiered platforms that work with sloped yards. Stairs, railings, and integrated seating designed for your space.
            </p>
          </Card>
        </div>
      </Section>

      {/* Service Areas */}
      <Section background="gray" padding="md">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Deck Building Service Areas</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { city: 'Simpsonville', slug: 'simpsonville' },
            { city: 'Mauldin', slug: 'mauldin' },
            { city: 'Fountain Inn', slug: 'fountain-inn' },
            { city: 'Woodruff', slug: 'woodruff' },
          ].map(({ city, slug }) => (
            <Link
              key={slug}
              href={`/service-areas/${slug}`}
              className="block rounded-lg border border-gray-300 p-4 text-center hover:border-blue-500 hover:shadow-md transition-all"
            >
              <span className="font-semibold text-slate-900">{city}, SC</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section background="white" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Deck FAQs</h2>
        <div className="space-y-6 max-w-3xl">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{q}</h3>
              <p className="text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Related + CTA */}
      <Section background="gray" padding="lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Start Your Deck Project?</h2>
          <p className="text-lg text-gray-600 mb-8">
            We provide free, detailed estimates with no pressure and no obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button variant="primary" size="lg" href="/contact">
              Request Free Estimate
            </Button>
            <Button variant="secondary" size="lg" href="/outdoor-living/screened-porches">
              See Screened Porches
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <Link href="/outdoor-living/screened-porches" className="hover:text-blue-700">
              Screened Porches →
            </Link>
            <Link href="/room-additions" className="hover:text-blue-700">
              Room Additions →
            </Link>
            <Link href="/cost" className="hover:text-blue-700">
              Cost Guides →
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

