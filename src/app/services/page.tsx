import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { localDominanceServices, serviceHubPages } from '@/lib/seo/localDominanceData';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import Link from 'next/link';
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Services & Pricing | Burch Contracting',
  description:
    'Garages, additions, decks, screened porches, remodeling, and commercial upfits with transparent pricing and free estimates across Upstate SC.',
  alternates: {
    canonical: absoluteUrl('/services'),
  },
  openGraph: {
    title: 'Services & Pricing | Burch Contracting',
    description:
      'Professional construction services with transparent pricing for Upstate South Carolina homeowners.',
    url: absoluteUrl('/services'),
    type: 'website',
  },
};

export default function ServicesPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Services & Pricing', url: absoluteUrl('/services') },
  ]);

  const servicesCatalog: {
    "@type": "OfferCatalog";
    name: string;
    itemListElement: Array<{
      "@type": "Offer";
      itemOffered: {
        "@type": "Service";
        name: string;
        description: string;
      };
    }>;
  } = {
    "@type": "OfferCatalog",
    "name": "Construction Services",
    "itemListElement": serviceHubPages.map(service => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service.service.serviceName,
        "description": service.shortDescription,
      }
    }))
  };

  const localBusinessSchema = buildLocalBusinessSchema({
    description: "Full-service contractor for garages, additions, decks, screened porches, and remodeling",
    hasOfferCatalog: servicesCatalog
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold md:text-6xl">Services & Pricing</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Complete construction services with transparent pricing for Upstate South Carolina homeowners
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="/contact">
              Get Free Estimate
            </Button>
          </div>
        </div>
      </section>

      {/* Core Services with Pricing */}
      <Section background="white" padding="lg">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">What We Build</h2>
          <p className="mt-3 text-lg text-gray-600">
            Six core services with transparent pricing. Click any service to learn more about what we build and see project examples.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceHubPages.map((page) => {
            // Define pricing for each service
            const pricingMap: Record<string, { budget: string; subtitle: string; details: string[] }> = {
              '/garages': {
                budget: '$20k–$40k',
                subtitle: '2-car attached/detached',
                details: ['2-car attached: $20k–$35k', '2-car detached: $22k–$40k', '3-car garage: $28k–$50k', 'Timeline: 6–12 weeks']
              },
              '/additions': {
                budget: '$45k–$80k',
                subtitle: '200–400 sqft expansion',
                details: ['Family room: $45k–$65k', 'Bedroom addition: $40k–$60k', 'Kitchen extension: $50k–$80k+', 'Timeline: 8–16 weeks']
              },
              '/outdoor-living': {
                budget: '$12k–$35k',
                subtitle: 'Decks, porches & patios',
                details: ['Deck: $12k–$18k', 'Screened porch: $18k–$28k', 'Covered patio: $15k–$25k', 'Timeline: 3–8 weeks']
              },
              '/remodeling': {
                budget: '$10k–$60k',
                subtitle: 'Kitchen or bathroom',
                details: ['Bathroom: $10k–$25k', 'Kitchen: $25k–$60k', 'Both: $40k–$85k+', 'Timeline: 4–12 weeks']
              },
              '/commercial-upfits': {
                budget: '$30–$100+/sqft',
                subtitle: 'Varies by type',
                details: ['Retail: $35–$80/sqft', 'Office: $30–$70/sqft', 'Restaurant: $50–$150/sqft', 'Timeline: 4–16 weeks']
              },
            };

            const pricing = pricingMap[page.path] || { budget: 'Custom Quote', subtitle: 'Call for pricing', details: [] };

            return (
              <Card key={page.path} className="h-full border border-gray-200">
                <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">Upstate SC Service</div>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{page.service.navLabel}</h3>
                
                <div className="my-4 border-t border-b border-gray-200 py-4">
                  <p className="text-sm text-gray-600 mb-1">Typical Budget</p>
                  <p className="text-2xl font-bold text-blue-700">{pricing.budget}</p>
                  <p className="text-xs text-gray-500 mt-1">{pricing.subtitle}</p>
                </div>

                <ul className="space-y-2 text-sm text-gray-700 mb-5">
                  {pricing.details.slice(0, 4).map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button href={page.path} fullWidth>View Details</Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* What Affects Costs */}
      <Section background="gray" padding="lg">
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">What Affects Project Costs?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <Icon name="Home" size={24} className="text-blue-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3">Design & Materials</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Project size & complexity</li>
                <li>• Material selections</li>
                <li>• Custom features</li>
                <li>• Architectural details</li>
              </ul>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                <Icon name="MapPin" size={24} className="text-green-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3">Site & Conditions</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Existing home condition</li>
                <li>• Site accessibility</li>
                <li>• Utility relocations</li>
                <li>• Foundation work</li>
              </ul>
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                <Icon name="ClipboardCheck" size={24} className="text-orange-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3">Permits & Code</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Local permit costs</li>
                <li>• Code compliance</li>
                <li>• HOA approvals</li>
                <li>• Engineer review</li>
              </ul>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <Icon name="Clock" size={24} className="text-purple-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3">Schedule & Labor</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Timeline & weather</li>
                <li>• Seasonal demand</li>
                <li>• Sub availability</li>
                <li>• Project phasing</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Our Process */}
      <Section background="white" padding="lg">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">How We Work</h2>
          <p className="mt-3 text-lg text-gray-600">
            Transparent process from first call to final walkthrough.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { num: '1', title: 'Free Consultation', desc: 'Discuss your project, site conditions, and goals. No obligation.' },
            { num: '2', title: 'Detailed Estimate', desc: 'Line-item quote with timeline and payment schedule.' },
            { num: '3', title: 'Permits & Approvals', desc: 'We handle permits, HOA approvals, and inspections.' },
            { num: '4', title: 'Build & Deliver', desc: 'Work proceeds on schedule with milestone invoicing.' },
          ].map((step) => (
            <Card key={step.num} className="border border-gray-200 text-center">
              <div className="text-4xl font-bold text-blue-700 mb-3">{step.num}</div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="blue" padding="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to Get Started?</h2>
          <p className="text-white text-lg mb-8">
            Contact us for a free, detailed estimate tailored to your project and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="ctaLight" size="lg" href="/contact">
              Get Free Estimate
            </Button>
            <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-slate-900">
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}