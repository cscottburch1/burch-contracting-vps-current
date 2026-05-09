import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Covered Patio Builder | Shade Structures | Upstate SC | Burch Contracting',
  description:
    'Custom covered patio construction in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Pergolas, solid roof covers, and attached patios. Licensed, insured. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/outdoor-living/covered-patios'),
  },
  openGraph: {
    title: 'Covered Patio Builder | Upstate SC | Burch Contracting',
    description: 'Custom covered patios in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Free estimates.',
    url: absoluteUrl('/outdoor-living/covered-patios'),
    type: 'website',
  },
};

const faqs = [
  {
    q: 'How much does a covered patio cost in Upstate SC?',
    a: 'Covered patios typically cost $15,000â€“$45,000 depending on size, roof type, and finish level. A simple solid-roof cover on an existing patio slab runs $15,000â€“$25,000. A fully built covered patio with concrete, ceiling fans, and lighting runs $25,000â€“$45,000. We provide free detailed estimates.',
  },
  {
    q: 'What\'s the best roofing option for a covered patio?',
    a: 'Solid aluminum panel roofing is our most popular option â€” weathertight, low-maintenance, and matches most homes. Standing seam metal roofs offer a premium look. Open pergola structures provide shade without full coverage. We recommend a solid roof for maximum weather protection in SC.',
  },
  {
    q: 'Can I attach a covered patio to my existing home?',
    a: 'Yes, most covered patios attach directly to the home\'s roofline or fascia. We evaluate your home\'s structure and ensure the attachment is properly flashed and waterproofed. This is the most common and cost-effective approach.',
  },
  {
    q: 'Do I need a permit for a covered patio?',
    a: 'Yes, covered patios with roofs require building permits in Greenville County and most municipalities. We handle all permitting â€” typical approval takes 7â€“12 business days.',
  },
];

export default function CoveredPatiosPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Services', url: absoluteUrl('/services') },
    { name: 'Outdoor Living', url: absoluteUrl('/outdoor-living') },
    { name: 'Covered Patios', url: absoluteUrl('/outdoor-living/covered-patios') },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-amber-900 to-orange-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-300">
            Outdoor Living
          </p>
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Covered Patio Construction</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-amber-100 md:text-xl">
            Shaded outdoor living spaces for Simpsonville, Mauldin, Fountain Inn &amp; Woodruff SC
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
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Outdoor Living You Can Use Year-Round</h2>
          <p className="mt-4 text-lg text-gray-600">
            A covered patio gives you shaded outdoor space for dining, entertaining, and relaxing â€” protected from rain, direct sun, and weather. We design covered structures that complement your home and maximize usable outdoor space.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Solid Roof Covers</h3>
            <p className="text-gray-600 text-sm">
              Fully weathertight aluminum or shingle roofing. Complete rain and sun protection for year-round use.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pergolas</h3>
            <p className="text-gray-600 text-sm">
              Open lattice structures that filter sun and provide a defined outdoor room. Add climbing plants for natural shade.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Attached Covers</h3>
            <p className="text-gray-600 text-sm">
              Extensions tied into your home's roofline for a seamless look. Most cost-effective way to cover an existing patio slab.
            </p>
          </Card>
        </div>
      </Section>

      {/* Service Areas */}
      <Section background="gray" padding="md">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Covered Patio Service Areas</h2>
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
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Covered Patio FAQs</h2>
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
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Build Your Covered Patio?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Free estimates with no pressure. We'll visit your property and provide a detailed written proposal.
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
            <Link href="/outdoor-living/screened-porches" className="hover:text-blue-700">
              Screened Porches â†’
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

