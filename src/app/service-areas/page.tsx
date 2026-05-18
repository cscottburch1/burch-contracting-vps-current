import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Service Areas in Simpsonville, Mauldin, Fountain Inn & Woodruff | Burch Contracting',
  description:
    'Burch Contracting serves Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Additions, garages, decks, outdoor living & remodeling.',
  alternates: {
    canonical: absoluteUrl('/areas'),
  },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Service Areas | Burch Contracting',
    description: 'We serve Simpsonville, Mauldin, Fountain Inn & Woodruff SC.',
    url: absoluteUrl('/areas'),
    type: 'website',
  },
};

export default function ServiceAreasPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Service Areas', url: absoluteUrl('/service-areas') },
  ]);

  const cities = [
    {
      name: 'Simpsonville, SC',
      slug: 'simpsonville',
      description: 'Home additions, garages, decks & outdoor living for Simpsonville homeowners.',
    },
    {
      name: 'Mauldin, SC',
      slug: 'mauldin',
      description: 'Remodeling, garage construction & outdoor spaces for Mauldin neighborhoods.',
    },
    {
      name: 'Fountain Inn, SC',
      slug: 'fountain-inn',
      description: 'Custom additions, decks, screened porches & more for Fountain Inn families.',
    },
    {
      name: 'Woodruff, SC',
      slug: 'woodruff',
      description: 'Professional contracting services for Woodruff & surrounding areas.',
    },
  ];

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
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Service Areas</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Serving Simpsonville, Mauldin, Fountain Inn & Woodruff SC
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      <Section background="white" padding="lg">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Where We Work</h2>
          <p className="mt-4 text-lg text-gray-600">
            Burch Contracting serves four target areas in Upstate South Carolina. Click on your city to learn more about local services, neighborhood insights, and projects we've completed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {cities.map((city) => (
            <Card key={city.slug} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-slate-900">{city.name}</h3>
              </div>
              <p className="text-gray-600 mb-6">{city.description}</p>
              <Link href={`/service-areas/${city.slug}`}>
                <Button variant="primary">
                  Learn More
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Local Expertise</h3>
          <p className="text-gray-700 mb-4">
            We've been building in Upstate SC since 1995. Our team understands:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">•</span>
              <span>Local building codes & permit requirements in each city</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">•</span>
              <span>Neighborhood character & architectural styles</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">•</span>
              <span>Site conditions, soil types & drainage patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">•</span>
              <span>Local contractors, suppliers & subcontractors</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">•</span>
              <span>Upstate SC weather & building science</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* Services Overview */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Services We Offer</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          We deliver the same high-quality services across all service areas:
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: 'Additions', href: '/additions' },
            { title: 'Garages', href: '/garages' },
            { title: 'Outdoor Living', href: '/outdoor-living' },
            { title: 'Remodeling', href: '/remodeling' },
            { title: 'Commercial Upfits', href: '/commercial-upfits' },
          ].map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="block p-4 rounded-lg border border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="font-bold text-slate-900">{service.title}</h3>
              <p className="text-gray-600 text-sm">Learn more →</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="blue" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to Start Your Project?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Contact us for a free estimate. We'll discuss your project and provide clear pricing.
          </p>
          <Button variant="ctaLight" size="lg" href="/contact">
            Request Free Estimate
          </Button>
        </div>
      </Section>
    </>
  );
}
