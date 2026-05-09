import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Screened Porch Builder | Aluminum & Wood Frames | Upstate SC | Burch Contracting',
  description:
    'Custom screened porch construction in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Aluminum and wood framing, ceiling fans, lighting. Licensed, insured. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/outdoor-living/screened-porches'),
  },
  openGraph: {
    title: 'Screened Porch Builder | Upstate SC | Burch Contracting',
    description: 'Custom screened porches in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Free estimates.',
    url: absoluteUrl('/outdoor-living/screened-porches'),
    type: 'website',
  },
};

const faqs = [
  {
    q: 'How much does a screened porch cost in Upstate SC?',
    a: 'Screened porches in Upstate SC typically cost $20,000â€“$55,000 depending on size and materials. A basic 12Ã—16 aluminum-framed porch averages $22,000â€“$28,000. Premium wood-framed porches with fans, lighting, and tile flooring run $35,000â€“$55,000. Converting an existing deck is typically 25â€“30% less expensive.',
  },
  {
    q: 'Aluminum vs wood framing â€” which is better?',
    a: 'Aluminum lasts 30+ years in SC\'s humidity with zero maintenance. Wood framing offers more design flexibility but needs painting or staining every 3â€“5 years. We recommend aluminum for most homeowners and wood when you want custom columns or traditional architectural details.',
  },
  {
    q: 'Can you convert my existing deck to a screened porch?',
    a: 'Yes, if the existing deck framing is structurally sound. We inspect joists, beams, and footings first. Converting a 12Ã—16 deck costs significantly less than building from scratch. About 40% of our screened porch projects are deck conversions.',
  },
  {
    q: 'Do I need a building permit for a screened porch?',
    a: 'Yes. Screened porches require permits in Greenville County, Simpsonville, Fountain Inn, and Mauldin. We handle all permitting â€” typical approval takes 7â€“14 business days.',
  },
];

export default function ScreenedPorchesSubPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Services', url: absoluteUrl('/services') },
    { name: 'Outdoor Living', url: absoluteUrl('/outdoor-living') },
    { name: 'Screened Porches', url: absoluteUrl('/outdoor-living/screened-porches') },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-green-900 to-teal-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-300">
            Outdoor Living
          </p>
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Screened Porch Construction</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-green-100 md:text-xl">
            Bug-free outdoor living spaces for Simpsonville, Mauldin, Fountain Inn &amp; Woodruff SC
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
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Enjoy Your Outdoor Space Year-Round</h2>
          <p className="mt-4 text-lg text-gray-600">
            A screened porch extends your living season and eliminates bugs, letting you enjoy your outdoor space from spring through fall. We build screened porches that integrate seamlessly with your home's architecture.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aluminum Framing</h3>
            <p className="text-gray-600 text-sm">
              Low-maintenance, rust-resistant frames built for SC humidity. 30+ year lifespan with no painting or staining required.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Wood Framing</h3>
            <p className="text-gray-600 text-sm">
              Traditional look with custom columns and trim. Great for historic or craftsman-style homes. Requires periodic maintenance.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Deck Conversions</h3>
            <p className="text-gray-600 text-sm">
              Convert your existing deck into a screened porch. We evaluate your current structure and build around it â€” often at significant savings.
            </p>
          </Card>
        </div>
      </Section>

      {/* Service Areas */}
      <Section background="gray" padding="md">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Screened Porch Service Areas</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { city: 'Simpsonville', slug: 'simpsonville-sc' },
            { city: 'Mauldin', slug: 'mauldin-sc' },
            { city: 'Fountain Inn', slug: 'fountain-inn-sc' },
            { city: 'Woodruff', slug: 'woodruff-sc' },
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
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Screened Porch FAQs</h2>
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
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Build Your Screened Porch?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Free estimates with no pressure. We'll visit your property and give you a detailed written proposal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button variant="primary" size="lg" href="/contact">
              Request Free Estimate
            </Button>
            <Button variant="secondary" size="lg" href="/outdoor-living">
              See All Outdoor Living
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <Link href="/outdoor-living/decks" className="hover:text-blue-700">
              Custom Decks â†’
            </Link>
            <Link href="/outdoor-living/covered-patios" className="hover:text-blue-700">
              Covered Patios â†’
            </Link>
            <Link href="/pricing" className="hover:text-blue-700">
              Pricing Guide â†’
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

