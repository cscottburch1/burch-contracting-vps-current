import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { getProjectSpotlightBySlug, isBrandedProjectImage, projectSpotlights } from '@/lib/seo/projectSpotlightsData';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';

interface ProjectSpotlightPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projectSpotlights.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ProjectSpotlightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectSpotlightBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} | Burch Contracting`,
    description: project.summary,
    alternates: { canonical: absoluteUrl(`/projects/${project.slug}`) },
    openGraph: {
      title: `${project.title} | Burch Contracting`,
      description: project.summary,
      url: absoluteUrl(`/projects/${project.slug}`),
      type: 'article',
      images: [{ url: absoluteUrl(project.image), width: 1200, height: 630, alt: project.imageAlt }],
    },
  };
}

export default async function ProjectSpotlightPage({ params }: ProjectSpotlightPageProps) {
  const { slug } = await params;
  const project = getProjectSpotlightBySlug(slug);

  if (!project) {
    notFound();
  }

  const related = projectSpotlights.filter((item) => item.slug !== project.slug && item.serviceType === project.serviceType).slice(0, 3);
  const brandedImage = isBrandedProjectImage(project.image);
  const isBathroomGreenville = project.slug === 'bathroom-renovation-greenville';
  const heroImageSrc = isBathroomGreenville ? '/images/projects/bathroom-renovation-greenville-sc.webp' : project.image;
  const heroImageAlt = isBathroomGreenville
    ? 'Primary Bathroom Renovation in Greenville SC by Burch Contracting'
    : project.imageAlt;
  const heroImageCaption = isBathroomGreenville
    ? 'Recently completed primary bathroom renovation in Greenville, SC'
    : 'Image shown for visual context. Spotlight content focuses on planning scope and process guidance.';

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Projects', url: absoluteUrl('/projects') },
    { name: project.title, url: absoluteUrl(`/projects/${project.slug}`) },
  ]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    description: project.summary,
    image: [absoluteUrl(project.image)],
    author: {
      '@type': 'Organization',
      name: siteConfig.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo-transparent.png'),
      },
    },
    mainEntityOfPage: absoluteUrl(`/projects/${project.slug}`),
    articleSection: 'Project Spotlight',
  };

  return (
    <>
      <Script id={`project-breadcrumb-${project.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id={`project-article-${project.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-blue-50">
                {project.serviceType} • {project.city}
              </div>
              <h1 className="mb-5 text-4xl font-bold leading-tight md:text-6xl">{project.title}</h1>
              <p className="mb-4 text-lg text-blue-100 md:text-xl">{project.summary}</p>
              <p className="mb-8 max-w-2xl text-base text-blue-200 md:text-lg">
                Homeowners in {project.city} use this spotlight to plan scope, sequence, and budget expectations before requesting a written estimate.
              </p>

              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-blue-100">Typical Timeline</div>
                  <div className="mt-1 text-sm font-semibold text-white">{project.timeline}</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-blue-100">Investment Range</div>
                  <div className="mt-1 text-sm font-semibold text-white">{project.budgetBand}</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-blue-100">Profile Type</div>
                  <div className="mt-1 text-sm font-semibold text-white">{project.representative ? 'Representative Profile' : 'Project Spotlight'}</div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="primary" href="/contact" className="bg-orange-600 hover:bg-orange-700">
                  Request Free Estimate
                </Button>
                <Button variant="outline" href="tel:8647244600" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Call 864-724-4600
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
              <div className={`overflow-hidden rounded-xl aspect-[16/10] ${brandedImage ? 'border border-gray-200 bg-white p-4 sm:p-6' : ''}`}>
                <Image
                  src={heroImageSrc}
                  alt={heroImageAlt}
                  width={1200}
                  height={800}
                  className={`rounded-xl object-cover w-full h-full ${isBathroomGreenville ? 'hover:scale-105 transition duration-500' : ''}`}
                  priority
                />
              </div>
              <p className="mt-3 px-1 text-xs font-semibold uppercase tracking-wide text-blue-100/90">
                {heroImageCaption}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Project Challenge</h2>
              <p className="text-lg leading-relaxed text-gray-700">{project.challenge}</p>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Approach</h2>
              <p className="text-lg leading-relaxed text-gray-700">{project.approach}</p>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Outcome</h2>
              <p className="text-lg leading-relaxed text-gray-700">{project.outcome}</p>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Continue Your Research</h2>
              <div className="space-y-3 text-sm">
                <a href={project.relatedLocationPath} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Read the local service guide
                </a>
                {project.relatedCostPath ? (
                  <a href={project.relatedCostPath} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                    Read the matching cost guide
                  </a>
                ) : null}
                <a href="/contact" className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Request a project-specific estimate
                </a>
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Lead-Time Reminder</h2>
              <p className="text-gray-700 leading-relaxed">
                Price and timeline ranges are planning guidance. Final scope should always be confirmed through a written estimate that includes measurements,
                selections, permit requirements, and sequencing.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section background="gray" padding="lg">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">More {project.serviceType} Spotlights</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <Card key={item.slug}>
                  <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">{item.city}</div>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-3 text-gray-600">{item.summary}</p>
                  <div className="mt-5">
                    <Button variant="outline" href={`/projects/${item.slug}`}>Read Spotlight</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Ready to Plan Your Project?</h2>
          <p className="mb-8 text-lg text-gray-300">
            Use these spotlights as planning references, then request a written estimate for your home, your scope, and your timeline.
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
