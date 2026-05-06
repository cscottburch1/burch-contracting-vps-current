import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contractor in Fountain Inn SC | Additions, Garages & Outdoor Living | Burch Contracting',
  description:
    'Burch Contracting serves Fountain Inn SC with home additions, garages, decks & remodeling. Licensed local contractor. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/service-areas/fountain-inn-sc'),
  },
  openGraph: {
    title: 'Contractor in Fountain Inn SC | Burch Contracting',
    description: 'Home improvements in Fountain Inn SC. Free estimates.',
    url: absoluteUrl('/service-areas/fountain-inn-sc'),
    type: 'website',
  },
};

export default function FountainInnPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Service Areas', url: absoluteUrl('/service-areas') },
    { name: 'Fountain Inn, SC', url: absoluteUrl('/service-areas/fountain-inn-sc') },
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
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Contractor in Fountain Inn, SC</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Quality home additions, garages, outdoor spaces & remodeling for Fountain Inn homeowners
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
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Local Contractor for Fountain Inn</h2>
          <p className="mt-4 text-lg text-gray-600">
            Burch Contracting has served Fountain Inn for over 30 years. We understand Fountain Inn's mix of established downtown homes and newer subdivisions, along with the unique site conditions and permitting requirements.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">About Fountain Inn</h3>
            <p className="text-gray-600 text-sm mb-4">
              Fountain Inn is a growing Greenville County city with a mix of established neighborhoods and newer developments. Homes range from modest ranch properties to newer two-story construction, particularly around Highway 418 and I-385 corridors.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Mix of older & newer neighborhoods</li>
              <li>• Larger lot sizes in many areas</li>
              <li>• Growing commercial corridors</li>
            </ul>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Why Fountain Inn Homeowners Choose Us</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Deep community roots & reputation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Diverse project experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Permitting expertise for City of Fountain Inn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Trusted by generations of families</span>
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* Services */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Services for Fountain Inn</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          All our core services available throughout Fountain Inn:
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Home Additions', href: '/additions', desc: 'Room expansions & family space' },
            { title: 'Garages', href: '/garages', desc: 'Detached & attached construction' },
            { title: 'Outdoor Living', href: '/outdoor-living', desc: 'Decks, porches & entertaining spaces' },
            { title: 'Remodeling', href: '/remodeling', desc: 'Kitchen & bathroom updates' },
            { title: 'Commercial Upfits', href: '/commercial-upfits', desc: 'Retail & office build-outs' },
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
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Fountain Inn Permitting</h3>
            <p className="text-gray-600 mb-4">
              Fountain Inn building permits coordinate through both the City and Greenville County. Typical timeline:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Application:</strong> 2–3 days prep</li>
              <li><strong>City Review:</strong> 5–7 business days</li>
              <li><strong>Revisions (if needed):</strong> 3–5 days</li>
              <li><strong>Final Approval:</strong> 2–3 days</li>
              <li><strong>Total:</strong> 2–4 weeks typical</li>
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              We manage all permitting details so you can focus on your project.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Neighborhood Diversity</h3>
            <p className="text-gray-600 mb-4">
              Fountain Inn's neighborhoods have different characteristics. We adapt to:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Downtown Properties:</strong> Established streetscape & utilities</li>
              <li><strong>Newer Subdivisions:</strong> HOA standards & modern codes</li>
              <li><strong>Varied Lot Sizes:</strong> From urban to spacious rural</li>
              <li><strong>Growth Corridors:</strong> Highway 418 & I-385 development</li>
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              Each neighborhood gets customized design & planning.
            </p>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section background="blue" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Start Your Fountain Inn Project</h2>
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
