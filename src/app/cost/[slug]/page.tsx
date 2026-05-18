import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { costLandingPages, getCostLandingPageBySlug } from '@/lib/seo/costSeoData';
import { blogPosts } from '@/lib/seo/localSeoData';
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from '@/lib/seo/schema';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import TrustBar from '@/components/TrustBar';

interface CostLandingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return costLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: CostLandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getCostLandingPageBySlug(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: absoluteUrl(`/cost/${page.slug}`) },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: absoluteUrl(`/cost/${page.slug}`),
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function CostLandingPage({ params }: CostLandingPageProps) {
  const { slug } = await params;
  const page = getCostLandingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Cost Guides', url: absoluteUrl('/cost') },
    { name: page.h1, url: absoluteUrl(`/cost/${page.slug}`) },
  ]);
  const localBusinessSchema = buildLocalBusinessSchema();
  const relatedBlogPosts = blogPosts
    .filter((b) => b.serviceType === page.serviceName)
    .slice(0, 3);

  const faqSchema = page.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <Script id={`cost-breadcrumb-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id={`cost-local-business-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      {faqSchema && <Script id={`cost-faq-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-50">
              {page.city} Cost Guide
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">{page.h1}</h1>
            <p className="mb-8 text-lg text-blue-100 md:text-xl">{page.intro}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" size="lg" href="/contact">
                <Icon name="ClipboardEdit" size={20} />
                Request Free Estimate
              </Button>
              <Button variant="outline" size="lg" href={page.calculatorPath} className="border-cyan-300 text-cyan-100 hover:bg-cyan-50 hover:text-blue-900">
                <Icon name="Calculator" size={20} />
                Use Cost Calculator
              </Button>
              <Button variant="ctaOutlineLight" size="lg" href={siteConfig.phoneHref}>
                <Icon name="Phone" size={20} />
                {siteConfig.phoneDisplay}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <Section background="white" padding="lg">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Typical Investment Ranges</h2>
              <p className="mb-4 text-sm text-gray-500">
                Based on current Simpsonville / Greenville County market rates, installed pricing, and contractor overhead.
                Each project may vary due to existing conditions, finish selections, and permit requirements.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {page.ranges.map((range) => (
                  <div key={range.label} className="rounded-2xl border border-gray-200 p-5">
                    <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">{range.label}</div>
                    <div className="mt-2 text-xl font-bold leading-tight text-gray-900 sm:text-2xl wrap-anywhere">
                      {range.range.replace(/-/g, ' - ')}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{range.details}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">What Moves the Budget</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {page.costDrivers.map((driver) => (
                  <div key={driver} className="flex gap-3 rounded-xl bg-blue-50 p-4 text-gray-700">
                    <Icon name="BadgeCheck" size={18} className="mt-0.5 text-blue-600" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">How to Use This Cost Guide</h2>
              <div className="space-y-4 text-gray-700">
                <p>Use these ranges to decide whether your project fits a refresh, a full remodel, or a more custom scope. The biggest mistake homeowners make is comparing vague online averages to a real project with real constraints.</p>
                <p>A written estimate is still the right next step when you are serious about moving forward. That process lets us confirm actual measurements, product allowances, and any code or structural items that should be accounted for before construction starts.</p>
                <p>If you are still researching, pair this page with the calculator and the related local service page below. That gives you both a pricing framework and a better understanding of timeline, process, and scope decisions.</p>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-cyan-50">
              <h2 className="mb-2 text-xl font-bold text-gray-900">Get a Written Estimate</h2>
              <p className="mb-4 text-sm text-gray-600">Stop guessing. We turn online ranges into a project-specific number. Free, no pressure.</p>
              <Button variant="primary" href="/contact" fullWidth>
                <Icon name="ClipboardEdit" size={18} />
                Request Free Estimate
              </Button>
              <Button variant="outline" href={siteConfig.phoneHref} fullWidth className="mt-2">
                <Icon name="Phone" size={18} />
                {siteConfig.phoneDisplay}
              </Button>
              <p className="mt-3 text-center text-xs text-gray-400">Licensed &amp; insured · BBB A+ · 30+ yrs</p>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Next Best Pages</h2>
              <div className="space-y-3 text-sm">
                <a href={page.relatedLocationPath} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Read the local {page.serviceName.toLowerCase()} guide for {page.city}
                </a>
                <a href={page.relatedServicePath} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Explore the main {page.serviceName.toLowerCase()} service page
                </a>
                <a href={page.calculatorPath} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Open the {page.serviceName.toLowerCase()} cost calculator
                </a>
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Why Homeowners Use Cost Pages</h2>
              <div className="space-y-3 text-gray-700">
                <p>Most homeowners want to know whether a project is realistic before they commit to design work. That is why cost pages work: they create clarity earlier in the buying process.</p>
                <p>We prefer realistic ranges over artificially low starting numbers. Clear expectations lead to better scope choices, better conversations, and fewer surprises after demolition starts.</p>
              </div>
            </Card>

            {relatedBlogPosts.length > 0 && (
              <Card>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Related Planning Articles</h2>
                <div className="space-y-3 text-sm">
                  {relatedBlogPosts.map((post) => (
                    <a key={post.slug} href={`/blog/${post.slug}`} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                      {post.title}
                    </a>
                  ))}
                  <a href="/blog" className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-gray-600 hover:bg-gray-50">
                    Browse all planning guides &rarr;
                  </a>
                </div>
              </Card>
            )}
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

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Need a Written Budget Range for Your Project?</h2>
          <p className="mb-8 text-lg text-gray-300">
            Call {siteConfig.phoneDisplay} or request an estimate online. We help homeowners turn broad online ranges into project-specific planning numbers.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" href="/contact">Get Free Estimate</Button>
            <Button variant="ctaOutlineLight" href={page.calculatorPath}>
              Use Calculator
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
