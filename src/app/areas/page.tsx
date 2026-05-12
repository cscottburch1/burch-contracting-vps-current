import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { localDominanceServices, targetCities } from '@/lib/seo/localDominanceData';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Service Areas: Upstate SC Contractor | Burch Contracting',
  description:
    'Serving Simpsonville, Mauldin, Fountain Inn, Woodruff, and surrounding Upstate SC communities with garages, additions, decks, and screened porches.',
  alternates: { canonical: absoluteUrl('/areas') },
  openGraph: {
    title: 'Service Areas | Burch Contracting',
    description: 'We serve Simpsonville, Mauldin, Fountain Inn, Woodruff, and surrounding Upstate SC.',
    url: absoluteUrl('/areas'),
  },
};

export default function AreasPage() {
  // Featured cities with dedicated pages
  const featuredCities = [
    { name: 'Simpsonville, SC', slug: '/service-areas/simpsonville-sc', description: 'Full-service contractor for residential additions, garages, decks, and screened porches in Simpsonville' },
    { name: 'Mauldin, SC', slug: '/service-areas/mauldin-sc', description: 'Licensed contractor serving Mauldin with custom garages, home additions, and outdoor living projects' },
    { name: 'Fountain Inn, SC', slug: '/service-areas/fountain-inn-sc', description: 'Professional deck, porch, garage, and addition services in Fountain Inn and surrounding areas' },
    { name: 'Woodruff, SC', slug: '/service-areas/woodruff-sc', description: 'Expert contractor for garages, additions, and outdoor living in Woodruff and North Greenville County' },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">Areas We Serve</h1>
            <p className="text-lg text-blue-100 md:text-xl">
              Serving homeowners across Simpsonville, Mauldin, Fountain Inn, Woodruff, and nearby Upstate South Carolina communities with garages, additions, decks, and screened porches.
            </p>
          </div>
        </div>
      </section>

      {/* Primary Service Areas */}
      <Section background="white" padding="lg">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Primary Service Areas</h2>
          <p className="mt-3 text-lg text-gray-600">
            We're based in Gray Court and focus on these four core markets with the fastest response times and deepest local knowledge.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredCities.map((city) => (
            <Card key={city.slug} className="border border-gray-200 bg-white hover-lift">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon name="MapPin" size={24} className="text-blue-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{city.name}</h3>
                  <p className="text-gray-600 mb-4">{city.description}</p>
                  <Link 
                    href={city.slug}
                    className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800"
                  >
                    View City Page
                    <Icon name="ArrowRight" size={16} />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* All Communities Served */}
      <Section background="gray" padding="lg">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">All Communities We Serve</h2>
          <p className="mt-3 text-lg text-gray-600">
            We work throughout Greenville and Laurens counties, including these communities:
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {targetCities.map((city) => (
            <Card key={city.slug} className="border border-gray-200 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{city.displayName}</h3>
                  <p className="mt-2 text-sm text-gray-600">{city.intro}</p>
                </div>
                <Icon name="MapPin" size={20} className="text-blue-700" />
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Don't See Your City?</h3>
          <p className="text-gray-700 mb-4">
            We frequently work in other Upstate SC communities. If you're within 45 minutes of Gray Court (29645), give us a call and we'll let you know if we can help with your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" href="/contact">
              Request Estimate
            </Button>
            <Button variant="outline" href={siteConfig.phoneHref}>
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>

      {/* Services by Area */}
      <Section background="white" padding="lg">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Services We Offer</h2>
          <p className="mt-3 text-lg text-gray-600">
            Every service area gets access to our complete range of construction services:
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {localDominanceServices.slice(0, 6).map((service) => (
            <Card key={service.slug} className="border border-gray-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.navLabel}</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {service.deliverables.slice(0, 4).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-700">•</span>
                    <span className="capitalize">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="blue" padding="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to Start Your Project?</h2>
          <p className="text-white text-lg mb-8">
            Contact us today for a free estimate. We'll visit your property, discuss your project, and provide a detailed quote.
          </p>
          <Button variant="ctaLight" size="lg" href="/contact">
            Get Free Estimate
          </Button>
        </div>
      </Section>
    </>
  );
}
