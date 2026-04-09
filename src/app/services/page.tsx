import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { localDominanceServices, serviceHubPages, targetCities } from '@/lib/seo/localDominanceData';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Garage Builders, Room Additions, Screened Porches, Decks & ADUs in Simpsonville, SC | Burch Contracting',
  description:
    'Explore garage construction, room additions, screened porches, deck building, and ADU pages for Simpsonville, Fountain Inn, Mauldin, Laurens, and nearby Upstate SC cities.',
  alternates: {
    canonical: absoluteUrl('/services'),
  },
  openGraph: {
    title: 'Local Service Hubs | Burch Contracting',
    description:
      'Browse the five core service pages and jump directly to the city-service landing page that matches your project intent.',
    url: absoluteUrl('/services'),
    type: 'website',
  },
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_top_right,_white,_transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold md:text-6xl">Garage Construction, Additions, Porches, Decks & ADUs</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Use this page as the master hub for the corrected local SEO structure. Every service page targets one primary keyword, links to the right city pages, and includes strong lead-generation CTAs.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="/contact">
              Get Free Estimate
            </Button>
            <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-slate-900">
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Primary service pages</h2>
          <p className="mt-3 text-lg text-gray-600">
            Each page is now focused on one service keyword and routes visitors into the full city-by-service linking web.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {serviceHubPages.map((page) => (
            <Card key={page.path} className="h-full border border-gray-200">
              <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">{page.primaryKeyword}</div>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">{page.service.navLabel}</h3>
              <p className="mt-3 text-gray-600">{page.shortDescription}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {page.service.deliverables.slice(0, 3).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-700">•</span>
                    <span className="capitalize">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex gap-3">
                <Button href={page.path}>View Service Page</Button>
                <Button variant="outline" href={siteConfig.phoneHref}>Call Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Target city coverage</h2>
          <p className="mt-3 text-lg text-gray-600">
            The local SEO rebuild now prioritizes nine Upstate communities with dedicated city-service landing pages and tighter keyword mapping.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {targetCities.map((city) => (
            <Card key={city.slug} className="border border-gray-200 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{city.displayName}</h3>
                  <p className="mt-2 text-gray-600">{city.intro}</p>
                </div>
                <Icon name="MapPin" size={22} className="text-blue-700" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {localDominanceServices.slice(0, 3).map((service) => (
                  <a
                    key={`${city.slug}-${service.slug}`}
                    href={`/${city.slug}/${service.slug}`}
                    className="rounded-full border border-blue-200 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    {service.navLabel}
                  </a>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold">Need a written estimate now?</h2>
          <p className="mt-4 text-lg text-gray-300">
            Call {siteConfig.phoneDisplay} or request a free estimate online. We will help you choose the right service page and the right city page for your project.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="/contact">Get Free Estimate</Button>
            <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-slate-900">
              Click to Call
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}