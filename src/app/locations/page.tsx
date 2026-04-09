import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { localDominanceServices, targetCities } from '@/lib/seo/localDominanceData';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Local Service Area Pages for Simpsonville, Fountain Inn, Mauldin & Laurens County | Burch Contracting',
  description:
    'Browse every city-service page for garage construction, room additions, screened porches, deck building, and ADUs across nine Upstate South Carolina communities.',
  alternates: { canonical: absoluteUrl('/locations') },
  openGraph: {
    title: 'Local Service Area Pages | Burch Contracting',
    description: 'Explore targeted city and service pages built for local search intent and faster estimate requests.',
    url: absoluteUrl('/locations'),
    type: 'website',
  },
};

export default function LocationsIndexPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">City + Service Pages Built for Local Search Intent</h1>
            <p className="text-lg text-blue-100 md:text-xl">
              Choose your city, then jump straight to the service page that matches your project. Every page includes a single primary keyword, CTAs, internal links, and local proof signals.
            </p>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="space-y-10">
          {targetCities.map((city) => (
            <div key={city.slug} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900">{city.displayName}</h2>
                <p className="mt-2 max-w-4xl text-gray-600">{city.intro}</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {localDominanceServices.map((service) => (
                  <Card key={`${city.slug}-${service.slug}`} className="h-full border border-gray-200">
                    <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                      {service.primaryKeywordBase} {city.name} SC
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">{service.navLabel}</h3>
                    <p className="mt-3 text-gray-600">
                      View the {service.navLabel.toLowerCase()} page for {city.displayName} with local references, FAQs, CTA sections, and estimate prompts.
                    </p>
                    <div className="mt-5 flex gap-3">
                      <Button href={`/${city.slug}/${service.slug}`}>Open Page</Button>
                      <Button variant="outline" href={`/${service.slug}`}>Main Service</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Ready to request your estimate?</h2>
          <p className="mb-8 text-lg text-gray-300">
            Call {siteConfig.phoneDisplay} or use the quick estimate form on any city-service page to reach the team faster.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" href="/contact">Get Free Estimate</Button>
            <Button variant="outline" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-gray-900">
              Click to Call
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
