import type { Metadata } from 'next';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { blogPosts } from '@/lib/seo/localSeoData';
import { absoluteUrl } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Remodeling Blog and Planning Guides | Burch Contracting',
  description:
    'Read remodeling planning guides from Burch Contracting covering costs, timelines, permits, material choices, and property-value decisions across the Upstate.',
  alternates: { canonical: absoluteUrl('/blog') },
  openGraph: {
    title: 'Remodeling Blog and Planning Guides | Burch Contracting',
    description: 'Explore helpful remodeling articles focused on costs, timelines, permitting, and practical planning.',
    url: absoluteUrl('/blog'),
  },
};

const groupedPosts = blogPosts.reduce<Record<string, typeof blogPosts>>((groups, post) => {
  groups[post.queryIntent] = groups[post.queryIntent] ? [...groups[post.queryIntent], post] : [post];
  return groups;
}, {});

const blogItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Remodeling Planning Guides',
  itemListElement: blogPosts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: absoluteUrl(`/blog/${post.slug}`),
    name: post.title,
  })),
};

export default function BlogIndexPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Blog', url: absoluteUrl('/blog') },
  ]);

  return (
    <>
      <Script id="blog-item-list-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogItemListSchema) }} />
      <Script id="blog-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">Remodeling Planning Guides</h1>
            <p className="text-lg text-blue-100 md:text-xl">
              Practical articles on remodeling cost, timelines, permitting, material choices, and project planning for Upstate homeowners.
            </p>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="mx-auto max-w-6xl space-y-10">
          {Object.entries(groupedPosts).map(([intent, posts]) => (
            <div key={intent}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 capitalize">{intent} Articles</h2>
                <p className="text-gray-600">Helpful {intent} content tied to remodeling decisions homeowners make before requesting an estimate.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <Card key={post.slug} className="h-full">
                    <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {post.serviceType}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">{post.title}</h3>
                    <p className="mb-5 text-gray-600">{post.metaDescription}</p>
                    <Button href={`/blog/${post.slug}`}>
                      <Icon name="ArrowRight" size={18} />
                      Read Article
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
