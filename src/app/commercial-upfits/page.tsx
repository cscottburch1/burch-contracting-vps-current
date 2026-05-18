import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import Link from 'next/link';

const faqs = [
  { q: "What's included in a tenant upfit?", a: 'Upfits typically include demolition of existing spaces, rough-in for utilities (electrical, plumbing, HVAC), walls and partitions, flooring, ceiling, lighting, and final finishes. Specific scope depends on lease requirements and use type.' },
  { q: 'How long does a commercial build-out take?', a: 'Small retail or office upfits (1,000–2,000 sqft) take 4–8 weeks. Larger spaces or complex F&B facilities take 8–16 weeks. We provide aggressive timelines and track daily progress.' },
  { q: 'What permits do commercial projects require?', a: 'All commercial build-outs require building permits. F&B spaces need health department approvals. We obtain all necessary permits and coordinate inspections.' },
  { q: 'Can you work around an operating lease?', a: 'Yes, if the space is still occupied during upfit. We coordinate work schedules, manage dust and noise, and work evenings/weekends if needed. Your lease terms dictate the approach.' },
  { q: 'How are commercial costs estimated?', a: 'Commercial projects are bid on square footage, scope of work, and complexity. Most build-outs run $30–$100+ per sqft depending on finishes, utilities, and health/safety codes. We provide fixed-price estimates after site review.' },
];

export const metadata: Metadata = {
  title: 'Commercial Tenant Upfits in Upstate SC | Burch Contracting',
  description:
    'Professional commercial tenant upfits & build-outs in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Retail, office, restaurant build-outs. Licensed, bonded, insured.',
  alternates: {
    canonical: absoluteUrl('/commercial-upfits'),
  },
  openGraph: {
    title: 'Commercial Tenant Upfits in Upstate SC | Burch Contracting',
    description: 'Professional commercial build-outs in Upstate SC. Retail, office, restaurant upfits.',
    url: absoluteUrl('/commercial-upfits'),
    type: 'website',
    images: [{ url: absoluteUrl('/og-image.webp'), width: 1200, height: 630, alt: 'Commercial Tenant Upfits in Upstate SC | Burch Contracting' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Tenant Upfits | Upstate SC | Burch Contracting',
    description: 'Retail, office and light commercial tenant upfits in Simpsonville, Mauldin, Fountain Inn and Woodruff SC.',
    images: [absoluteUrl('/og-image.webp')],
  },
};

export default function CommercialUpfitsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Services', url: absoluteUrl('/services') },
    { name: 'Commercial Upfits', url: absoluteUrl('/commercial-upfits') },
  ]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Commercial Tenant Upfits in Upstate SC</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Professional build-outs & tenant improvements for retail, office & restaurant spaces in Upstate SC
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="/contact">
              Request Free Estimate
            </Button>
            <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-slate-900">
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <Section background="white" padding="lg">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Commercial Build-Outs Done Right</h2>
          <p className="mt-4 text-lg text-gray-600">
            Tenant upfits and build-outs require precision, speed, and compliance. We manage every detail to get your commercial space market-ready on time.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Retail Build-Outs</h3>
            <p className="text-gray-600">
              Storefront layouts, flooring, lighting, fixtures, and customer experience design. Fast turnarounds for seasonal retail.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Office Upfits</h3>
            <p className="text-gray-600">
              Professional office spaces with functional layouts, partition walls, lighting, and technology infrastructure.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Restaurant & Food Service</h3>
            <p className="text-gray-600">
              Kitchens, dining areas, POS systems, and health code compliance. Full F&B facility design and installation.
            </p>
          </Card>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Commercial Expertise</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Licensed & Bonded:</strong> SC General Contractor #CLG118679 with full bonding and insurance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Code Compliance:</strong> Health codes, ADA accessibility, commercial electrical and plumbing standards</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Schedule Management:</strong> Aggressive timelines met without cutting corners on quality</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Landlord & Tenant Coordination:</strong> We work with property managers and tenant requirements seamlessly</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* Service Areas */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Service Areas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { name: 'Simpsonville', slug: 'simpsonville' },
            { name: 'Mauldin', slug: 'mauldin' },
            { name: 'Fountain Inn', slug: 'fountain-inn' },
            { name: 'Woodruff', slug: 'woodruff' },
          ].map(({ name, slug }) => (
            <Link
              key={slug}
              href={`/service-areas/${slug}`}
              className="block p-6 rounded-lg border border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="font-bold text-slate-900">{name}, SC</h3>
              <p className="text-gray-600 text-sm">Commercial Tenant Upfits & Build-Outs</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section background="white" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Our Commercial Process</h2>
          <p className="mt-4 text-lg text-gray-600">
            Systematic, professional, on-time delivery.
          </p>
        </div>
        <ul className="space-y-4 text-gray-700 max-w-3xl">
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">1.</span>
            <div>
              <strong>Scope & Timeline:</strong> Review lease terms, space requirements, and landlord/city requirements. Build aggressive but realistic schedule.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">2.</span>
            <div>
              <strong>Permitting & Approvals:</strong> Obtain commercial permits, health department approvals (if F&B), and landlord sign-off before construction.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">3.</span>
            <div>
              <strong>Rough-In & Finishes:</strong> Build-out includes framing, electrical, plumbing, HVAC, flooring, walls, and fixtures. Daily coordination with your team.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">4.</span>
            <div>
              <strong>Inspections & Closeout:</strong> All inspections passed, final walkthroughs completed, final payment, and ready for business opening.
            </div>
          </li>
        </ul>
      </Section>

      {/* FAQ */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Commercial FAQs</h2>
        <div className="space-y-6 max-w-3xl">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-gray-700">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="blue" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready for Your Commercial Build-Out?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss your tenant upfit or commercial project. Get a free estimate today.
          </p>
          <Button variant="ctaLight" size="lg" href="/contact">
            Request Free Estimate
          </Button>
        </div>
      </Section>
    </>
  );
}
