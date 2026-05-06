import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contractor in Woodruff SC | Home Additions, Garages & Decks | Burch Contracting',
  description:
    'Burch Contracting serves Woodruff SC with professional additions, garages, outdoor living & remodeling. Licensed contractor. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/service-areas/woodruff-sc'),
  },
  openGraph: {
    title: 'Contractor in Woodruff SC | Burch Contracting',
    description: 'Home improvements in Woodruff SC. Free estimates.',
    url: absoluteUrl('/service-areas/woodruff-sc'),
    type: 'website',
  },
};

export default function WoodruffPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Service Areas', url: absoluteUrl('/service-areas') },
    { name: 'Woodruff, SC', url: absoluteUrl('/service-areas/woodruff-sc') },
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
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Contractor in Woodruff, SC</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Professional home additions, garages, outdoor living & remodeling for Woodruff families
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

      {/* About Local Service */}
      <Section background="white" padding="lg">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Local Contractor for Woodruff</h2>
          <p className="mt-4 text-lg text-gray-600">
            For over 30 years, Burch Contracting has served Woodruff and surrounding Spartanburg County areas. We understand Woodruff's unique site conditions, building character, and community values.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">About Woodruff</h3>
            <p className="text-gray-600 text-sm mb-4">
              Woodruff is a Spartanburg County city known for its strong community, established neighborhoods, and beautiful natural surroundings. Many properties have larger lot sizes with varied terrain—perfect for creative outdoor and addition designs.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Larger lot sizes & rural character</li>
              <li>• Varied terrain & site conditions</li>
              <li>• Established neighborhood values</li>
            </ul>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Why Woodruff Homeowners Choose Us</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Long-term Woodruff presence & trust</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Expertise with varied terrain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Spartanburg County code knowledge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Craftsmanship that respects your land</span>
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* Services */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Services for Woodruff</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          All our core services for Woodruff homeowners:
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Home Additions', href: '/additions', desc: 'Custom additions for your land' },
            { title: 'Garages', href: '/garages', desc: 'Detached & attached structures' },
            { title: 'Outdoor Living', href: '/outdoor-living', desc: 'Decks, porches & retreats' },
            { title: 'Remodeling', href: '/remodeling', desc: 'Modernize your interior' },
            { title: 'Commercial Upfits', href: '/commercial-upfits', desc: 'Local business build-outs' },
          ].map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="block p-4 rounded-lg border border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all bg-white"
            >
              <h3 className="font-bold text-slate-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{service.desc}</p>
              <span className="text-blue-700 font-semibold text-sm">Learn More →</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Permitting & Site Conditions */}
      <Section background="white" padding="lg">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Woodruff Permitting</h3>
            <p className="text-gray-600 mb-4">
              Woodruff building permits go through Spartanburg County. Typical timeline:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Application:</strong> 2–3 days</li>
              <li><strong>County Review:</strong> 5–7 business days</li>
              <li><strong>Revisions:</strong> 3–5 days if needed</li>
              <li><strong>Approval:</strong> 2–3 days</li>
              <li><strong>Total:</strong> 2–4 weeks typical</li>
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              We handle all Spartanburg County coordination.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Terrain & Site Planning</h3>
            <p className="text-gray-600 mb-4">
              Woodruff's varied terrain offers opportunities & challenges. We specialize in:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Slope Analysis:</strong> Multi-level designs for terrain</li>
              <li><strong>Drainage Design:</strong> Managing water on varied lots</li>
              <li><strong>Foundation Planning:</strong> Proper footings for soil & slope</li>
              <li><strong>Site Access:</strong> Efficient staging & construction logistics</li>
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              Your land's character becomes your project's advantage.
            </p>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section background="blue" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to Build in Woodruff?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Get a free estimate for your addition, garage, outdoor living, or remodeling project.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="/contact" className="bg-white text-blue-700 hover:bg-gray-100">
              Request Free Estimate
            </Button>
            <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-blue-700">
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
