import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Garage Builder & Garage Construction in Upstate SC | Burch Contracting',
  description:
    'Professional garage construction & garage apartments in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Detached & attached garages, workshop spaces. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/garages'),
  },
  openGraph: {
    title: 'Garage Builder & Garage Construction in Upstate SC | Burch Contracting',
    description: 'Professional garage construction in Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Free estimates.',
    url: absoluteUrl('/garages'),
    type: 'website',
    images: [{ url: absoluteUrl('/og-image.webp'), width: 1200, height: 630, alt: 'Garage Builder & Construction in Upstate SC | Burch Contracting' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garage Builder in Upstate SC | Burch Contracting',
    description: 'Attached & detached garage construction in Simpsonville, Mauldin, Fountain Inn and Woodruff SC.',
    images: [absoluteUrl('/og-image.webp')],
  },
};

export default function GaragesPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Services', url: absoluteUrl('/services') },
    { name: 'Garages', url: absoluteUrl('/garages') },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Garage Builder &amp; Garage Construction in Upstate SC</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Custom detached & attached garages, workshop spaces & garage apartments for Simpsonville, Mauldin, Fountain Inn & Woodruff
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

      {/* What We Build */}
      <Section background="white" padding="lg">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Custom Garage Construction</h2>
          <p className="mt-4 text-lg text-gray-600">
            We build detached and attached garages that add storage, security, and value to your property. From standard two-car garages to workshop spaces and garage apartments, we design with your needs in mind.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Detached Garages</h3>
            <p className="text-gray-600">
              Freestanding garages positioned away from your home. Great for maximizing driveway space and protecting vehicles from the elements.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Attached Garages</h3>
            <p className="text-gray-600">
              Connected garages for convenient vehicle access and home integration. We match your home's roofline and exterior finishes seamlessly.
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Workshop Spaces</h3>
            <p className="text-gray-600">
              Custom workshop garages with workbenches, storage, and utility setup. Perfect for hobbies, tools, or small projects.
            </p>
          </Card>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Garage Building Features</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Professional Foundation:</strong> Proper drainage, frost line footings, and reinforced concrete</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Durable Framing:</strong> Engineered post systems and roof designs built to withstand Upstate SC weather</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Professional Doors:</strong> Smooth-operating garage doors with weather sealing and hardware</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-700 font-bold">✓</span>
              <span><strong>Electrical & Climate Control:</strong> Outlets, lighting, and optional HVAC or mini-split systems</span>
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
              <p className="text-gray-600 text-sm">Garage Construction & Builders</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Planning */}
      <Section background="white" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Garage Planning Guide</h2>
          <p className="mt-4 text-lg text-gray-600">
            Consider these factors when planning your garage:
          </p>
        </div>
        <ul className="space-y-4 text-gray-700 max-w-3xl">
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">1.</span>
            <div>
              <strong>Size & Layout:</strong> Standard two-car garages are 20x20 or 22x22. Three-car garages run 30x20 or larger. Consider vehicle dimensions, storage, and workbench space.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">2.</span>
            <div>
              <strong>Doors & Access:</strong> Overhead garage doors are standard. Width determines how many doors you need (typically 8-9 feet per door).
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">3.</span>
            <div>
              <strong>Foundation Prep:</strong> Proper concrete thickness (4-6 inches), grading, and drainage prevent water infiltration—critical in Upstate SC.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-700">4.</span>
            <div>
              <strong>Setback & Utility Lines:</strong> Check property lines, setback requirements, and locate underground utilities before excavation.
            </div>
          </li>
        </ul>
      </Section>

      {/* FAQ */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Garage FAQs</h2>
        <div className="space-y-6 max-w-3xl">
          {[
            {
              q: 'How much does garage construction cost?',
              a: 'A standard 2-car attached garage costs $20,000–$35,000. Detached garages run $22,000–$40,000. Workshop garages with upgraded features (workbench, storage) cost $28,000–$50,000+. Costs vary based on materials, finishes, and site conditions.'
            },
            {
              q: 'How long does garage building take?',
              a: 'Most garages take 6–12 weeks from permit to completion. Permitting typically takes 2–3 weeks. Simple attached garages move faster than detached structures. Weather can extend timelines.'
            },
            {
              q: 'Do I need a permit for a garage?',
              a: 'Yes, all garages require permits in Simpsonville, Mauldin, Fountain Inn, and Woodruff. Permits ensure foundation integrity, roof design compliance, and proper setbacks. We handle permitting for you.'
            },
            {
              q: 'Can you add electric or HVAC to my garage?',
              a: 'Yes. We can add outlets, LED lighting, circuit breakers, and heating/cooling systems. Mini-split HVAC systems are popular for workshop garages. These add $2,000–$8,000 depending on scope.'
            },
            {
              q: 'What garage door style do you recommend?',
              a: 'Traditional raised-panel and carriage-style doors match most homes. Aluminum and steel doors are durable and low-maintenance. We install quality garage door systems with smooth operation and weather sealing.'
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
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to Build a Garage?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Get a free estimate for your garage project. We'll discuss size, style, and features.
          </p>
          <Button variant="ctaLight" size="lg" href="/contact">
            Request Free Estimate
          </Button>
        </div>
      </Section>
    </>
  );
}
