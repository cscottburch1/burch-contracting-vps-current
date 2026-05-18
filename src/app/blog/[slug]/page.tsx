import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { blogPosts, buildBlogSections, getBlogBySlug, serviceLandingPages } from '@/lib/seo/localSeoData';
import { costLandingPages } from '@/lib/seo/costSeoData';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo/schema';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import TrustBar from '@/components/TrustBar';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const sections = buildBlogSections(post);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Blog', url: absoluteUrl('/blog') },
    { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
  ]);
  const articleSchema = buildArticleSchema({
    title: post.metaTitle,
    description: post.metaDescription,
    url: absoluteUrl(`/blog/${post.slug}`),
  });
  const faqSchema = post.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;

  const relatedCostPages = costLandingPages
    .filter((cp) => cp.serviceName === post.serviceType)
    .slice(0, 2);
  const relatedLocationPages = serviceLandingPages
    .filter((lp) => lp.serviceName === post.serviceType)
    .slice(0, 2);

  return (
    <>
      <Script id={`blog-breadcrumb-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id={`blog-article-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <Script id={`blog-faq-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-50">
              {post.serviceType} • {post.cityFocus}
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">{post.title}</h1>
            <p className="text-lg text-blue-100 md:text-xl">{post.metaDescription}</p>
          </div>
        </div>
      </section>

      <TrustBar />

      <Section background="white" padding="lg">
        <div className="mx-auto max-w-4xl space-y-8">
          {sections.map((section) => (
            <Card key={section.heading}>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{section.heading}</h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {post.faqs.map((faq) => (
              <Card key={faq.question}>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{faq.question}</h3>
                <p className="leading-relaxed text-gray-700">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">Continue Your Research</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedCostPages.map((cp) => (
              <a key={cp.slug} href={`/cost/${cp.slug}`} className="block rounded-xl border border-gray-200 p-4 hover:bg-blue-50">
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">Cost Guide</div>
                <div className="mt-1 font-semibold text-gray-900">{cp.h1}</div>
              </a>
            ))}
            {relatedLocationPages.map((lp) => (
              <a key={lp.slug} href={`/locations/${lp.slug}`} className="block rounded-xl border border-gray-200 p-4 hover:bg-blue-50">
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">Local Service Guide</div>
                <div className="mt-1 font-semibold text-gray-900">{lp.h1}</div>
              </a>
            ))}
            <a href="/blog" className="block rounded-xl border border-dashed border-gray-300 p-4 hover:bg-gray-50">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">All Articles</div>
              <div className="mt-1 font-semibold text-gray-700">Browse all planning guides &rarr;</div>
            </a>
          </div>
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Need Project-Specific Advice?</h2>
          <p className="mb-8 text-lg text-gray-300">
            Articles are useful for planning, but a written estimate is the fastest way to turn research into an actual scope, budget range, and next step.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" href="/contact">Request Free Estimate</Button>
            <Button variant="ctaOutlineLight" href={siteConfig.phoneHref}>
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
