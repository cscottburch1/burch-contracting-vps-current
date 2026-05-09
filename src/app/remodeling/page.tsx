import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Home Remodeling Contractor in Upstate SC | Burch Contracting',
  description:
    'Professional home remodeling in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Kitchen, bathroom & whole-home renovations. Licensed & insured. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/remodeling'),
  },
  openGraph: {
    title: 'Home Remodeling Contractor in Upstate SC | Burch Contracting',
    description: 'Professional home remodeling in Upstate SC. Kitchen & bathroom renovations. Free estimates.',
    url: absoluteUrl('/remodeling'),
    type: 'website',
    images: [{ url: absoluteUrl('/og-image.webp'), width: 1200, height: 630, alt: 'Home Remodeling Contractor in Upstate SC | Burch Contracting' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Remodeling Contractor | Upstate SC | Burch Contracting',
    description: 'Kitchen, bathroom and whole-home remodeling in Simpsonville, Mauldin, Fountain Inn and Woodruff SC.',
    images: [absoluteUrl('/og-image.webp')],
  },
};

export default function RemodellingPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Services', url: absoluteUrl('/services') },
    { name: 'Remodeling', url: absoluteUrl('/remodeling') },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Home Remodeling Contractor in Upstate SC</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Professional kitchen & bathroom remodeling for Simpsonville, Mauldin, Fountain Inn & Woodruff SC
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
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Modernize Your Home</h2>
          <p className="mt-4 text-lg text-gray-600">
            Kitchen and bathroom renovations are among the best home investments. We design and build remodels that improve functionality, style, and home value.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Kitchen Remodeling</h3>
            <p className="text-gray-600 mb-4">
              From cabinet updates and countertop replacements to complete gut renovations. Modern layouts with quality appliances and finishes.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• New cabinetry & hardware</li>
              <li>• Granite or quartz countertops</li>
              <li>• Backsplash & flooring</li>
              <li>• Appliance upgrades</li>
              <li>• Lighting & plumbing updates</li>
            </ul>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Bathroom Remodeling</h3>
            <p className="text-gray-600 mb-4">
              Beautiful, functional bathrooms with premium fixtures and finishes. Single-bathroom updates or complete multi-bath renovations.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Vanity & cabinetry</li>
              <li>• Tile flooring & walls</li>
              <li>• Shower & tub systems</li>
              <li>• Lighting & ventilation</li>
              <li>• Plumbing upgrades</li>
            </ul>
          </Card>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Remodel?</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Adds Value:</strong> Kitchen & bathroom remodels return 50–70% of costs in resale value</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Improves Function:</strong> Modern layouts and storage make daily life easier</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Energy Efficiency:</strong> New fixtures and insulation reduce utility costs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Peace of Mind:</strong> Quality craftsmanship and modern materials last decades</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* Service Areas */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Service Areas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {['Simpsonville', 'Mauldin', 'Fountain Inn', 'Woodruff'].map((city) => (
            <Link
              key={city}
              href={`/service-areas/${city.toLowerCase()}-sc`}
              className="block p-6 rounded-lg border border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="font-bold text-slate-900">{city}, SC</h3>
              <p className="text-gray-600 text-sm">Kitchen & Bathroom Remodeling</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Planning */}
      <Section background="white" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Remodeling Planning</h2>
          <p className="mt-4 text-lg text-gray-600">
            Smart planning ensures your remodel comes in on time and on budget.
          </p>
        </div>
        <ul className="space-y-4 text-gray-700 max-w-3xl">
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">1.</span>
            <div>
              <strong>Budget & Timeline:</strong> Establish realistic expectations upfront. Kitchen remodels typically take 4–8 weeks; bathrooms 2–4 weeks.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">2.</span>
            <div>
              <strong>Design & Materials:</strong> Choose finishes, fixtures, and layouts that reflect your style and meet your needs.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">3.</span>
            <div>
              <strong>Permitting:</strong> Most kitchen and bathroom remodels require permits. We handle permit coordination.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">4.</span>
            <div>
              <strong>Contingency Planning:</strong> Unexpected issues (hidden damage, code updates) happen. We keep contingency reserves and communicate clearly.
            </div>
          </li>
        </ul>
      </Section>

      {/* FAQ */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Remodeling FAQs</h2>
        <div className="space-y-6 max-w-3xl">
          {[
            {
              q: 'How much does a kitchen remodel cost?',
              a: 'Kitchen remodels in SC range from $20,000 (modest updates) to $60,000+ (premium renovations). A mid-range kitchen remodel with new cabinetry, countertops, flooring, and appliances costs $35,000–$50,000. Costs depend on size, materials, and scope.'
            },
            {
              q: 'How long does a kitchen remodel take?',
              a: 'Most kitchen remodels take 4–8 weeks. Simple updates (cabinets, countertops) can be 3–4 weeks. Complex remodels with layout changes take 8–12 weeks. Permitting adds 2–3 weeks.'
            },
            {
              q: 'How much does a bathroom remodel cost?',
              a: 'Bathroom remodels cost $8,000–$25,000+. A modest bathroom remodel (tile, vanity, fixtures) runs $10,000–$15,000. A luxury bathroom with heated floors and high-end fixtures runs $20,000–$35,000.'
            },
            {
              q: 'Can I stay in my home during a remodel?',
              a: 'For bathroom remodels, yes—we typically keep at least one bathroom functional. Kitchen remodels are more disruptive but possible with planning. We minimize dust, noise, and disruption.'
            },
            {
              q: 'Do I need permits for a kitchen/bathroom remodel?',
              a: 'Yes, most kitchen and bathroom remodels require permits (especially if moving plumbing/electrical). Permits ensure code compliance and proper ventilation. We handle permitting.'
            },
          ].map((faq, idx) => (
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
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to Remodel?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Get a free estimate for your kitchen or bathroom remodel.
          </p>
          <Button variant="ctaLight" size="lg" href="/contact">
            Request Free Estimate
          </Button>
        </div>
      </Section>
    </>
  );
}
