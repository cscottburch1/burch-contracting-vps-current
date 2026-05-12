import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contractor in Simpsonville SC for Additions, Garages & Outdoor Living | Burch Contracting',
  description:
    'Burch Contracting serves Simpsonville SC with home additions, garages, outdoor living & remodeling. Local, licensed contractor. Free estimates.',
  alternates: {
    canonical: absoluteUrl('/service-areas/simpsonville-sc'),
  },
  openGraph: {
    title: 'Contractor in Simpsonville SC | Burch Contracting',
    description: 'Home additions, garages, decks & remodeling in Simpsonville SC. Free estimates.',
    url: absoluteUrl('/service-areas/simpsonville-sc'),
    type: 'website',
  },
};

export default function SimpsOnvillePage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Service Areas', url: absoluteUrl('/service-areas') },
    { name: 'Simpsonville, SC', url: absoluteUrl('/service-areas/simpsonville-sc') },
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
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Contractor in Simpsonville SC</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Professional additions, garages, outdoor living & remodeling for Simpsonville homeowners
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
      <Section background="white" padding="md">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Local Contractor for Simpsonville</h2>
          <p className="mt-4 text-lg text-gray-600">
            For over 30 years, Burch Contracting has served Simpsonville homeowners with quality craftsmanship and clear communication. We understand Simpsonville's neighborhoods, building codes, and homeowner priorities.
          </p>
        </div>
      </Section>
        
      {/* Services */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Services for Simpsonville</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          We deliver all our core services throughout Simpsonville:
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Home Additions', href: '/additions', desc: 'Family rooms, bedrooms & kitchen expansions' },
            { title: 'Garages', href: '/garages', desc: 'Detached & attached garage construction' },
            { title: 'Outdoor Living', href: '/outdoor-living', desc: 'Decks, screened porches & patios' },
            { title: 'Remodeling', href: '/remodeling', desc: 'Kitchen & bathroom renovations' },
            { title: 'Commercial Upfits', href: '/commercial-upfits', desc: 'Retail, office & restaurant build-outs' },
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
 
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">About Simpsonville</h3>
            <p className="text-gray-600 text-sm mb-4">
              Simpsonville is a vibrant Greenville County community known for well-maintained homes, active neighborhoods, and strong family values. Many homes range from 1980s ranch-style to newer two-story designs.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Strong HOA requirements in many neighborhoods</li>
              <li>• Greenville County permitting process</li>
              <li>• Mixed lot sizes: small urban to larger suburban</li>
            </ul>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Why Simpsonville Homeowners Choose Us</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Local reputation & references</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>HOA navigation expertise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Fast permit coordination</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-700">✓</span>
                <span>Transparent pricing & timelines</span>
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* Services */}
      <Section background="gray" padding="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 md:text-4xl">Services for Simpsonville</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          We deliver all our core services throughout Simpsonville:
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Home Additions', href: '/additions', desc: 'Family rooms, bedrooms & kitchen expansions' },
            { title: 'Garages', href: '/garages', desc: 'Detached & attached garage construction' },
            { title: 'Outdoor Living', href: '/outdoor-living', desc: 'Decks, screened porches & patios' },
            { title: 'Remodeling', href: '/remodeling', desc: 'Kitchen & bathroom renovations' },
            { title: 'Commercial Upfits', href: '/commercial-upfits', desc: 'Retail, office & restaurant build-outs' },
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

      {/* Permitting & HOA */}
      <Section background="white" padding="lg">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Simpsonville Permitting</h3>
            <p className="text-gray-600 mb-4">
              Simpsonville building permits are handled through Greenville County. Typical timeline:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Application Submit:</strong> 2–3 days</li>
              <li><strong>Initial Review:</strong> 5–7 business days</li>
              <li><strong>Corrections (if needed):</strong> 3–5 days</li>
              <li><strong>Final Approval:</strong> 2–3 days</li>
              <li><strong>Total Typical:</strong> 2–4 weeks</li>
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              We handle all permitting coordination so you don't have to.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">HOA Considerations</h3>
            <p className="text-gray-600 mb-4">
              Many Simpsonville neighborhoods have HOA requirements. We help navigate:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Architectural Review:</strong> Design approval before construction</li>
              <li><strong>Material Standards:</strong> Roofing, siding, color matching</li>
              <li><strong>Timeline Alignment:</strong> HOA approval + city permits</li>
              <li><strong>Documentation:</strong> Before/after photos for HOA records</li>
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              We've successfully navigated 100+ Simpsonville HOA projects.
            </p>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section background="blue" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Let's Build Your Simpsonville Project</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Get a free estimate for your addition, garage, remodel, or outdoor living project. We'll discuss your vision and provide clear pricing.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="ctaLight" size="lg" href="/contact">
              Request Free Estimate
            </Button>
            <Button variant="ctaOutlineLight" size="lg" href={siteConfig.phoneHref}>
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
