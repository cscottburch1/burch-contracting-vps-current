import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { serviceLandingPages } from '@/lib/seo/localSeoData';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Remodeling Service Areas and Local Landing Pages',
  description:
    'Browse Burch Contracting local remodeling and outdoor living pages for Simpsonville and Fountain Inn, SC.',
  alternates: { canonical: absoluteUrl('/locations') },
  openGraph: {
    title: 'Local Remodeling Service Pages | Burch Contracting',
    description: 'Explore localized remodeling pages for Simpsonville and Fountain Inn homeowners.',
    url: absoluteUrl('/locations'),
  },
};

const groupedPages = serviceLandingPages.reduce<Record<string, typeof serviceLandingPages>>((groups, page) => {
  groups[page.city] = groups[page.city] ? [...groups[page.city], page] : [page];
  return groups;
}, {});

export default function LocationsIndexPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">Localized Remodeling Pages for Simpsonville and Fountain Inn</h1>
            <p className="text-lg text-blue-100 md:text-xl">
              Compare service-specific planning pages for kitchens, bathrooms, room additions, decks, porches, and basement finishing.
            </p>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="mx-auto max-w-6xl space-y-10">
          {Object.entries(groupedPages).map(([city, pages]) => (
            <div key={city}>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{city}</h2>
                  <p className="text-gray-600">Local planning pages built around common project types in {city}.</p>
                </div>
                <Button variant="outline" href={city.includes('Simpsonville') ? '/service-areas/simpsonville' : '/service-areas/fountain-inn'}>
                  <Icon name="MapPin" size={18} />
                  View Area Page
                </Button>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {pages.map((page) => (
                  <Card key={page.slug} className="h-full">
                    <h3 className="mb-3 text-xl font-bold text-gray-900">{page.h1}</h3>
                    <p className="mb-5 text-gray-600">{page.shortDescription}</p>
                    <Button href={`/locations/${page.slug}`}>Read Local Guide</Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Need a Written Estimate Instead?</h2>
          <p className="mb-8 text-lg text-gray-300">
            Call {siteConfig.phoneDisplay} or request an estimate online. We help homeowners across Simpsonville and Fountain Inn plan the right scope before construction starts.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" href="/contact">Get Free Estimate</Button>
            <Button variant="outline" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-gray-900">
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
