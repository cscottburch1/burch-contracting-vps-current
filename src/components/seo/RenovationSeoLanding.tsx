import Image from 'next/image';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import QuickEstimateForm from '@/components/seo/QuickEstimateForm';
import type { RenovationPageData } from '@/lib/seo/renovationSeoData';
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
  buildPersonSchema,
} from '@/lib/seo/schema';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { primaryAuthor } from '@/lib/seo/author';

interface RenovationSeoLandingProps {
  page: RenovationPageData;
}

export default function RenovationSeoLanding({ page }: RenovationSeoLandingProps) {
  const breadcrumbItems = [
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Home Renovations', url: absoluteUrl('/home-renovations') },
    ...(page.city
      ? [
          { name: page.service.serviceName, url: absoluteUrl(`/${page.service.slug}`) },
          { name: page.city.displayName, url: absoluteUrl(page.path) },
        ]
      : [{ name: page.service.serviceName, url: absoluteUrl(page.path) }]),
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const localBusinessSchema = buildLocalBusinessSchema({
    description: page.metaDescription,
  });
  const serviceSchema = buildServiceSchema({
    slug: page.slug,
    serviceName: page.service.serviceName,
    city: page.city?.displayName ?? 'Upstate South Carolina',
    h1: page.h1,
    shortDescription: page.shortDescription,
    path: page.path,
  });

  const personSchema = buildPersonSchema({
    name: primaryAuthor.name,
    jobTitle: `${primaryAuthor.role}, SC License #${primaryAuthor.licenseNumber}`,
    description: primaryAuthor.bio,
    email: primaryAuthor.email,
    image: primaryAuthor.image,
    sameAs: primaryAuthor.sameAs,
  });

  const faqSchema = page.faqItems?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faqItems.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;

  const areaLine = page.city
    ? `${page.city.displayName} · ${page.city.county}`
    : 'Serving Simpsonville, Fountain Inn, Mauldin, Gray Court, Laurens, Woodruff, Clinton, Ora, and Joanna';

  return (
    <>
      <Script id={`${page.id}-breadcrumb-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id={`${page.id}-local-business-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <Script id={`${page.id}-service-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id={`${page.id}-person-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      {faqSchema && <Script id={`${page.id}-faq-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-emerald-900 to-cyan-900 py-16 text-white md:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.35fr_0.9fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">{areaLine}</p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">{page.h1}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50">{page.leadParagraphs[0]}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" size="lg" href="#quick-estimate">
                Get Free Estimate
                <Icon name="ArrowRight" size={18} />
              </Button>
              <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-slate-900">
                <Icon name="Phone" size={18} />
                Call {siteConfig.phoneDisplay}
              </Button>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-emerald-50 sm:grid-cols-2">
              <div className="rounded-xl bg-white/10 px-4 py-3">✅ One keyword focus per page</div>
              <div className="rounded-xl bg-white/10 px-4 py-3">✅ Free estimate and quick lead form</div>
              <div className="rounded-xl bg-white/10 px-4 py-3">✅ Cost, permits, and timeline guidance</div>
              <div className="rounded-xl bg-white/10 px-4 py-3">✅ Internal links across the renovation silo</div>
            </div>
          </div>

          <div id="quick-estimate">
            <QuickEstimateForm serviceName={page.service.serviceName} cityName={page.city?.name ?? 'Simpsonville'} />
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 text-gray-700">
            {page.leadParagraphs.slice(1).map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8">
                {paragraph}
              </p>
            ))}
          </div>

          <Card className="h-fit border border-emerald-100 bg-emerald-50">
            <h2 className="text-2xl font-bold text-slate-900">What this page covers</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              {page.designSection.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-700">•</span>
                  <span className="capitalize">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-gray-700">{page.service.ctaSummary}</p>
          </Card>
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Why Homeowners in {page.city?.name ?? 'Simpsonville & the Upstate'} Choose Us
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            This renovation silo is designed to answer local cost, schedule, design, and permitting questions while making it easy to request an estimate.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {page.whyChoose.map((item) => (
            <Card key={item.title} className="h-full border border-gray-200">
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-gray-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{page.designSection.title}</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              {page.designSection.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <Card className="border border-gray-200 bg-slate-50">
            <h3 className="text-2xl font-bold text-slate-900">Design priorities</h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              {page.designSection.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-700">•</span>
                  <span className="capitalize">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section background="blue" padding="lg">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{page.finishesSection.title}</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              {page.finishesSection.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <Card className="border border-cyan-100 bg-white">
            <h3 className="text-2xl font-bold text-slate-900">Popular material choices</h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              {page.finishesSection.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-700">•</span>
                  <span className="capitalize">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{page.costSection.title}</h2>
          <p className="mt-4 text-lg leading-8 text-gray-700">{page.costSection.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="#quick-estimate">Get Free Estimate</Button>
            <Button variant="outline" href={siteConfig.phoneHref}>Click to Call</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {page.costSection.ranges.map((range) => (
            <Card key={range.label} className="border border-emerald-100 bg-emerald-50">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{range.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{range.range}</p>
              <p className="mt-3 text-gray-700">{range.note}</p>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-lg leading-8 text-gray-700">{page.costSection.summary}</p>
      </Section>

      <Section background="white" padding="lg">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{page.timelineSection.title}</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              {page.timelineSection.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <Card className="border border-gray-200 bg-slate-50">
            <h3 className="text-2xl font-bold text-slate-900">Remodeling process</h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              {page.timelineSection.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-700">•</span>
                  <span className="capitalize">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{page.permitsSection.title}</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              {page.permitsSection.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
            <ul className="mt-5 space-y-3 text-gray-700">
              {page.permitsSection.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-700">•</span>
                  <span className="capitalize">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="border border-emerald-100 bg-white">
            <h3 className="text-2xl font-bold text-slate-900">Trusted planning resources</h3>
            <div className="mt-4 space-y-3">
              {page.authorityLinks.map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  className="block rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Nearby Projects {page.city ? `for ${page.city.name}` : 'Across the Upstate'}
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            These proof sections help support trust and local relevance while giving homeowners a clearer picture of how each renovation can be scoped.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {page.projectHighlights.map((project) => (
            <Card key={project.title} className="overflow-hidden border border-gray-200 p-0">
              <Image
                src={project.image}
                alt={project.alt}
                width={1200}
                height={800}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                <p className="mt-3 text-gray-600">{project.summary}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {page.faqItems.map((faq) => (
                <Card key={faq.question} className="border border-gray-200 bg-white">
                  <h3 className="text-lg font-bold text-slate-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Explore related pages</h2>
            <div className="mt-6 space-y-4">
              {page.relatedLinks.map((link) => (
                <Card key={link.href} className="border border-emerald-100 bg-white">
                  <a href={link.href} className="block">
                    <h3 className="text-lg font-bold text-slate-900">{link.label}</h3>
                    <p className="mt-2 text-gray-600">{link.description}</p>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="border-l-4 border-emerald-600 bg-gray-50 p-6 rounded-r-lg">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                  {primaryAuthor.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-1">Written by</p>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{primaryAuthor.name}</h3>
                <p className="text-gray-700 mb-2">{primaryAuthor.role}</p>
                <p className="text-sm text-gray-600 mb-3">
                  SC Licensed General Contractor #{primaryAuthor.licenseNumber} | {primaryAuthor.yearsExperience}+ years{page.city ? ` serving ${page.city.displayName}` : ' serving Upstate SC'}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {primaryAuthor.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold">Ready to request your remodel estimate?</h2>
          <p className="mt-4 text-lg text-gray-300">
            Get a written estimate, speak with a local contractor, and move forward with a cleaner scope for {page.service.serviceName.toLowerCase()}.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="#quick-estimate">Get Free Estimate</Button>
            <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-slate-900">
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
