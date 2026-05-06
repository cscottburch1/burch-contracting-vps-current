import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contractor in Mauldin SC | Garages, Additions & Decks | Burch Contracting',
  description:
    'Burch Contracting serves Mauldin SC with additions, garages, outdoor living & remodeling. Local licensed contractor. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/service-areas/mauldin-sc'),
  },
  openGraph: {
    title: 'Contractor in Mauldin SC | Burch Contracting',
    description: 'Home additions, garages & outdoor living in Mauldin SC. Free estimates.',
    url: absoluteUrl('/service-areas/mauldin-sc'),
    type: 'website',
  },
};

export default function MauldinPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Service Areas', url: absoluteUrl('/service-areas') },
    { name: 'Mauldin, SC', url: absoluteUrl('/service-areas/mauldin-sc') },
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
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Contractor in Mauldin, SC</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Professional home additions, garages, decks & remodeling for Mauldin families
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
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Local Contractor for Mauldin</h2>
          <p className="mt-4 text-lg text-gray-600">
            Burch Contracting has built trust in Mauldin for over 30 years. We understand Mauldin's lot constraints, HOA rules, and the neighborhood's building character. From Butler Road to east Mauldin, we've handled hundreds of projects.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">About Mauldin</h3>
            <p className="text-gray-600 text-sm mb-4">
              Mauldin is a thriving Greenville County city with mixed lot sizes and diverse neighborhoods. Many properties have limited backyard depth, making efficient design crucial for additions and outdoor spaces.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Tighter lot footprints than Simpsonville</li>
              <li>• Active HOA management in newer subdivisions</li>
              <li>• Growing Mauldin city center area</li>
            </ul>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Why Mauldin Homeowners Choose Us</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Experienced with tight lot designs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Proven Mauldin project portfolio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Efficient space optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Clear communication & transparency</span>
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* Services */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Services for Mauldin</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          All our core services tailored for Mauldin properties:
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Home Additions', href: '/additions', desc: 'Efficient designs for Mauldin lots' },
            { title: 'Garages', href: '/garages', desc: 'Detached & attached garage builds' },
            { title: 'Outdoor Living', href: '/outdoor-living', desc: 'Multi-level decks & screened porches' },
            { title: 'Remodeling', href: '/remodeling', desc: 'Kitchen & bathroom renovations' },
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

      {/* Permitting */}
      <Section background="white" padding="lg">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Mauldin Permitting</h3>
            <p className="text-gray-600 mb-4">
              Mauldin building permits go through the City of Mauldin and Greenville County. Typical timeline:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Application Submit:</strong> 2–3 days</li>
              <li><strong>Initial Review:</strong> 5–7 business days</li>
              <li><strong>Corrections (if any):</strong> 3–5 days</li>
              <li><strong>Final Approval:</strong> 2–3 days</li>
              <li><strong>Total Typical:</strong> 2–4 weeks</li>
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              We've navigated Mauldin permitting 100+ times successfully.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Lot Layout Expertise</h3>
            <p className="text-gray-600 mb-4">
              Mauldin lots often have unique shapes and sizes. We specialize in:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Efficient Spaces:</strong> Maximizing utility on compact lots</li>
              <li><strong>Access & Staging:</strong> Managing construction logistics</li>
              <li><strong>Drainage Solutions:</strong> Clay soil & water management</li>
              <li><strong>Setback Compliance:</strong> Zoning & HOA navigation</li>
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              Design efficiency saves time and money on Mauldin projects.
            </p>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section background="blue" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready for Your Mauldin Project?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Get a free estimate for your addition, garage, remodel, or outdoor living project.
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
