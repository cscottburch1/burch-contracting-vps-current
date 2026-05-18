import type { Metadata } from 'next';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { costLandingPages } from '@/lib/seo/costSeoData';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Remodeling Cost Guides | Burch Contracting',
  description:
    'Browse remodeling cost guides for kitchens, bathrooms, room additions, decks, and basement finishing across Simpsonville and Greenville area markets.',
  alternates: { canonical: absoluteUrl('/cost') },
  openGraph: {
    title: 'Remodeling Cost Guides | Burch Contracting',
    description: 'Explore local remodeling cost guides designed to help homeowners budget before requesting a written estimate.',
    url: absoluteUrl('/cost'),
  },
};

const groupedPages = costLandingPages.reduce<Record<string, typeof costLandingPages>>((groups, page) => {
  groups[page.city] = groups[page.city] ? [...groups[page.city], page] : [page];
  return groups;
}, {});

const costItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Remodeling Cost Guides',
  itemListElement: costLandingPages.map((page, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: absoluteUrl(`/cost/${page.slug}`),
    name: page.h1,
  })),
};

export default function CostIndexPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Cost Guides', url: absoluteUrl('/cost') },
  ]);

  return (
    <>
      <Script id="cost-item-list-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(costItemListSchema) }} />
      <Script id="cost-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">Local Remodeling Cost Guides</h1>
            <p className="text-lg text-blue-100 md:text-xl">
              Compare budget ranges for kitchens, bathrooms, additions, decks, and basement finishing before you request a written estimate.
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
                  <p className="text-gray-600">Cost guides built around common project scopes and realistic planning ranges in {city}.</p>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {pages.map((page) => (
                  <Card key={page.slug} className="h-full">
                    <h3 className="mb-3 text-xl font-bold text-gray-900">{page.h1}</h3>
                    <p className="mb-5 text-gray-600">{page.metaDescription}</p>
                    <Button href={`/cost/${page.slug}`}>
                      <Icon name="ArrowRight" size={18} />
                      Read Cost Guide
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Need a Project-Specific Budget Range?</h2>
          <p className="mb-8 text-lg text-gray-300">
            Call {siteConfig.phoneDisplay} or request an estimate online. We help homeowners turn planning ranges into written scopes and real next steps.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" href="/contact">Get Free Estimate</Button>
            <Button variant="ctaOutlineLight" href={siteConfig.phoneHref}>
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
