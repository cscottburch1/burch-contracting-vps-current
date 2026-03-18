import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import {
  buildServiceContent,
  getServicePageBySlug,
  serviceLandingPages,
} from '@/lib/seo/localSeoData';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
} from '@/lib/seo/schema';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';

interface LocalServicePageProps {
  params: Promise<{ slug: string }>;
}

const cityLinks: Record<string, string> = {
  'Simpsonville SC': '/service-areas/simpsonville',
  'Fountain Inn SC': '/service-areas/fountain-inn',
};

const serviceSlugs: Record<string, string> = {
  'Kitchen Remodeling': 'remodeling',
  'Bathroom Remodeling': 'remodeling',
  'Room Additions': 'additions',
  'Deck Builder': 'additions',
  'Screened Porch Builder': 'additions',
  'Decks and Screened Porches': 'additions',
  'Basement Finishing': 'basement',
};

const calculatorLinks: Record<string, string> = {
  'Kitchen Remodeling': '/calculator/kitchen-remodeling',
  'Bathroom Remodeling': '/calculator/bathroom-remodeling',
  'Room Additions': '/calculator/room-additions',
  'Deck Builder': '/calculator/decks-screened-porches',
  'Screened Porch Builder': '/calculator/decks-screened-porches',
  'Decks and Screened Porches': '/calculator/decks-screened-porches',
  'Basement Finishing': '/calculator/basement-finishing',
};

function getGeoReferences(city: string) {
  if (city === 'Simpsonville SC') {
    return ['Five Forks', 'Harrison Bridge', 'Downtown Simpsonville', 'Fairview Road corridor'];
  }

  return ['Downtown Fountain Inn', 'Jones Mill Road corridor', 'Fairview area', 'growing residential neighborhoods near I-385'];
}

function getTrustSignals(serviceName: string) {
  return [
    '30+ years serving Upstate South Carolina homeowners',
    'Licensed, insured, and BBB A+ rated',
    `Clear scope planning for ${serviceName.toLowerCase()} projects`,
    'Written estimates with realistic allowances and sequencing',
  ];
}

export async function generateStaticParams() {
  return serviceLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: LocalServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePageBySlug(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: absoluteUrl(`/locations/${page.slug}`) },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: absoluteUrl(`/locations/${page.slug}`),
      type: 'article',
      images: [{ url: absoluteUrl(siteConfig.defaultOgImage), width: 1200, height: 630, alt: page.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: [absoluteUrl(siteConfig.defaultOgImage)],
    },
  };
}

export default async function LocalServicePage({ params }: LocalServicePageProps) {
  const { slug } = await params;
  const page = getServicePageBySlug(slug);

  if (!page) {
    notFound();
  }

  const contentBlocks = buildServiceContent(page);
  const serviceSlug = serviceSlugs[page.serviceName] ?? 'services';
  const calculatorLink = calculatorLinks[page.serviceName] ?? '/contact';
  const areaLink = cityLinks[page.city] ?? '/services';
  const geoReferences = getGeoReferences(page.city);
  const trustSignals = getTrustSignals(page.serviceName);
  const relatedPages = serviceLandingPages.filter((item) => item.city === page.city && item.slug !== page.slug).slice(0, 3);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Locations', url: absoluteUrl('/locations') },
    { name: page.h1, url: absoluteUrl(`/locations/${page.slug}`) },
  ]);

  const serviceSchema = buildServiceSchema(page);
  const faqSchema = buildFaqSchema(page.faqs);
  const localBusinessSchema = buildLocalBusinessSchema();

  return (
    <>
      <Script id={`local-service-breadcrumb-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id={`local-service-schema-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id={`local-service-faq-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id={`local-business-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_top_left,_white_0,_transparent_45%)]"></div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <Badge variant="blue" className="mb-5 inline-flex px-4 py-2 text-sm">
              {page.city} Remodeling and Outdoor Living
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">{page.h1}</h1>
            <p className="mb-8 text-lg text-blue-100 md:text-xl">{page.shortDescription}</p>
            <div className="mb-8 flex flex-wrap gap-3 text-sm text-blue-50">
              {geoReferences.map((item) => (
                <span key={item} className="rounded-full border border-white/20 bg-white/10 px-3 py-2">
                  Near {item}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" size="lg" href="/contact">
                <Icon name="ClipboardEdit" size={20} />
                Get Free Estimate
              </Button>
              <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-gray-900">
                <Icon name="Phone" size={20} />
                {siteConfig.phoneDisplay}
              </Button>
              <Button variant="outline" size="lg" href={calculatorLink} className="border-cyan-300 text-cyan-100 hover:bg-cyan-50 hover:text-blue-900">
                <Icon name="Calculator" size={20} />
                View Cost Calculator
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Planning {page.serviceName.toLowerCase()} in {page.city}</h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                {contentBlocks.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Typical Investment Ranges</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {page.priceRanges.map((range) => (
                  <div key={range.label} className="rounded-2xl border border-gray-200 p-5">
                    <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">{range.label}</div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">{range.range}</div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{range.details}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Why Homeowners Call Burch Contracting</h2>
              <div className="space-y-3">
                {trustSignals.map((signal) => (
                  <div key={signal} className="flex gap-3 rounded-xl bg-blue-50 p-3 text-gray-700">
                    <Icon name="BadgeCheck" size={20} className="mt-0.5 text-blue-600" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Internal Links for Project Research</h2>
              <div className="space-y-3 text-sm">
                <a href={`/services/${serviceSlug}`} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Explore our main {page.serviceName.toLowerCase()} service page
                </a>
                <a href={areaLink} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Read our {page.city} service area page
                </a>
                <a href={calculatorLink} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Use the {page.serviceName.toLowerCase()} cost calculator
                </a>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <Card key={faq.question}>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{faq.question}</h3>
                <p className="leading-relaxed text-gray-700">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {relatedPages.length > 0 && (
        <Section background="white" padding="lg">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">More {page.city} planning guides</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {relatedPages.map((item) => (
                <Card key={item.slug}>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">{item.h1}</h3>
                  <p className="mb-5 text-gray-600">{item.shortDescription}</p>
                  <Button href={`/locations/${item.slug}`}>Read This Guide</Button>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Talk Through Your {page.city} Project</h2>
          <p className="mb-8 text-lg text-gray-300">
            If you are comparing timelines, design options, or budget ranges, we can help you narrow the scope before demolition starts.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" href="/contact">Request Free Estimate</Button>
            <Button variant="outline" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-gray-900">
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
