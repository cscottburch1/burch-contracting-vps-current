import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import QuickEstimateForm from '@/components/seo/QuickEstimateForm';
import { homeRenovationsHub } from '@/lib/seo/renovationSeoData';
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from '@/lib/seo/schema';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';

export default function HomeRenovationsHub() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Home Renovations', url: absoluteUrl('/home-renovations') },
  ]);
  const localBusinessSchema = buildLocalBusinessSchema({
    description: homeRenovationsHub.metaDescription,
  });

  return (
    <>
      <Script id="home-renovations-breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="home-renovations-local-business-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-emerald-900 to-cyan-900 py-16 text-white md:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.35fr_0.9fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Interior Remodeling SEO Silo</p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">{homeRenovationsHub.h1}</h1>
            {homeRenovationsHub.introParagraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 max-w-3xl text-lg leading-8 text-emerald-50">
                {paragraph}
              </p>
            ))}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" size="lg" href="/kitchen-remodeling">
                Explore Kitchen Remodeling
                <Icon name="ArrowRight" size={18} />
              </Button>
              <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-slate-900">
                <Icon name="Phone" size={18} />
                Call {siteConfig.phoneDisplay}
              </Button>
            </div>
          </div>

          <div>
            <QuickEstimateForm serviceName="Home Renovations" cityName="Simpsonville" />
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Kitchen remodeling and bathroom remodeling</h2>
          <p className="mt-3 text-lg text-gray-600">
            This hub keeps renovation keywords separate from the existing garage, deck, porch, and exterior service structure while still supporting lead generation and local authority.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {homeRenovationsHub.serviceCards.map((card) => (
            <Card key={card.href} className="border border-emerald-100 bg-emerald-50">
              <h3 className="text-2xl font-bold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-gray-700">{card.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {card.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-700">•</span>
                    <span className="capitalize">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href={card.href}>View Service Page</Button>
                <Button variant="outline" href={siteConfig.phoneHref}>Call Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Why choose us for home renovations?</h2>
          <p className="mt-3 text-lg text-gray-600">
            The new silo is built for ranking, cleaner internal linking, and conversion-focused remodeling traffic.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {homeRenovationsHub.whyChoose.map((item) => (
            <Card key={item.title} className="h-full border border-gray-200 bg-white">
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-gray-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Service areas</h2>
          <p className="mt-3 text-lg text-gray-600">
            Choose a city, then go straight to the kitchen or bathroom page built for that local search intent.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {homeRenovationsHub.cityCards.map((card) => (
            <Card key={card.city} className="border border-gray-200">
              <h3 className="text-xl font-bold text-slate-900">{card.city}</h3>
              <p className="mt-3 text-gray-600">{card.summary}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href={card.kitchenHref}>Kitchen Page</Button>
                <Button variant="outline" href={card.bathroomHref}>Bathroom Page</Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="blue" padding="lg">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-bold text-slate-900">Ready to request your estimate?</h2>
          <p className="mt-4 text-lg text-gray-700">
            Use the renovation hub to compare service pages, jump to your city, and contact Burch Contracting for a free estimate.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" href="/bathroom-remodeling">View Bathroom Remodeling</Button>
            <Button variant="outline" size="lg" href={siteConfig.phoneHref}>Click to Call</Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {homeRenovationsHub.lightLinks.map((link) => (
              <Card key={link.href} className="border border-white/60 bg-white text-left">
                <a href={link.href} className="block">
                  <h3 className="text-lg font-bold text-slate-900">{link.label}</h3>
                  <p className="mt-2 text-gray-600">{link.description}</p>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
