import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Construction Pricing Guide for Additions, Garages & Outdoor Living | Burch Contracting',
  description:
    'Transparent pricing for home additions, garages, outdoor living & remodeling in Upstate SC. Budget guides, cost factors & free estimates.',
  alternates: {
    canonical: absoluteUrl('/pricing'),
  },
  openGraph: {
    title: 'Pricing Guide | Burch Contracting',
    description: 'Transparent pricing for home improvements. Learn typical costs.',
    url: absoluteUrl('/pricing'),
    type: 'website',
  },
};

export default function PricingPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Pricing', url: absoluteUrl('/pricing') },
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
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Pricing Guide</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-xl">
            Transparent cost ranges for home additions, garages, outdoor living & remodeling projects
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="/contact">
              Get Free Estimate
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <Section background="white" padding="lg">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Transparent Project Costs</h2>
          <p className="mt-4 text-lg text-gray-600">
            We believe in clear, upfront pricing. Below are typical cost ranges for our five core services. Actual costs depend on design complexity, materials, permits, and site conditions. Every project gets a custom estimate.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Home Additions</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Typical Budget</p>
              <p className="text-3xl font-bold text-blue-700">$45k–$80k</p>
              <p className="text-xs text-gray-500 mt-1">200–400 sqft expansion</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Family room: $45k–$65k</li>
              <li>• Bedroom addition: $40k–$60k</li>
              <li>• Kitchen extension: $50k–$80k+</li>
              <li>• Timeline: 8–16 weeks</li>
            </ul>
            <Link href="/additions" className="text-blue-700 font-semibold text-sm hover:underline mt-4 inline-block">
              Learn More →
            </Link>
          </Card>

          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Garages</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Typical Budget</p>
              <p className="text-3xl font-bold text-blue-700">$20k–$40k</p>
              <p className="text-xs text-gray-500 mt-1">2-car detached/attached</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 2-car attached: $20k–$35k</li>
              <li>• 2-car detached: $22k–$40k</li>
              <li>• 3-car garage: $28k–$50k</li>
              <li>• Timeline: 6–12 weeks</li>
            </ul>
            <Link href="/garages" className="text-blue-700 font-semibold text-sm hover:underline mt-4 inline-block">
              Learn More →
            </Link>
          </Card>

          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Outdoor Living</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Typical Budget</p>
              <p className="text-3xl font-bold text-blue-700">$12k–$35k</p>
              <p className="text-xs text-gray-500 mt-1">Decks, porches & patios</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Deck: $12k–$18k</li>
              <li>• Screened porch: $18k–$28k</li>
              <li>• Covered patio: $15k–$25k</li>
              <li>• Timeline: 3–8 weeks</li>
            </ul>
            <Link href="/outdoor-living" className="text-blue-700 font-semibold text-sm hover:underline mt-4 inline-block">
              Learn More →
            </Link>
          </Card>

          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Remodeling</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Typical Budget</p>
              <p className="text-3xl font-bold text-blue-700">$10k–$60k</p>
              <p className="text-xs text-gray-500 mt-1">Kitchen or bathroom</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Bathroom: $10k–$25k</li>
              <li>• Kitchen: $25k–$60k</li>
              <li>• Both: $40k–$85k+</li>
              <li>• Timeline: 4–12 weeks</li>
            </ul>
            <Link href="/remodeling" className="text-blue-700 font-semibold text-sm hover:underline mt-4 inline-block">
              Learn More →
            </Link>
          </Card>

          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Commercial Upfits</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Typical Budget</p>
              <p className="text-3xl font-bold text-blue-700">$30–$100+/sqft</p>
              <p className="text-xs text-gray-500 mt-1">Varies by type</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Retail: $35–$80/sqft</li>
              <li>• Office: $30–$70/sqft</li>
              <li>• Restaurant: $50–$150/sqft</li>
              <li>• Timeline: 4–16 weeks</li>
            </ul>
            <Link href="/commercial-upfits" className="text-blue-700 font-semibold text-sm hover:underline mt-4 inline-block">
              Learn More →
            </Link>
          </Card>

          <Card className="border border-gray-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Financing Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Home equity loans or HELOCs</li>
              <li>• Contractor financing (0% options)</li>
              <li>• Construction-to-permanent loans</li>
              <li>• FHA 203k renovation loans</li>
              <li>• Personal loans or credit lines</li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              We work with multiple financing partners.
            </p>
          </Card>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">What Affects Project Costs?</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Design & Materials</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Complexity & size of project</li>
                <li>• Material selections & finishes</li>
                <li>• Custom features & add-ons</li>
                <li>• Architectural details & trim</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Site & Conditions</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Existing home condition</li>
                <li>• Site accessibility & terrain</li>
                <li>• Utility relocations needed</li>
                <li>• Drainage & foundation work</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Permitting & Code</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Local permit costs & timeline</li>
                <li>• Inspections & code compliance</li>
                <li>• HOA review & approvals</li>
                <li>• Structural engineer work</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Labor & Schedule</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Project timeline & weather</li>
                <li>• Seasonal labor demand</li>
                <li>• Subcontractor availability</li>
                <li>• Phasing & staging logistics</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Process & Payment */}
      <Section background="gray" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Our Pricing Process</h2>
          <p className="mt-4 text-lg text-gray-600">
            We deliver transparent estimates at every stage.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              num: '1',
              title: 'Free Consultation',
              desc: 'We discuss your project, site conditions, and goals. No obligation, no charge.'
            },
            {
              num: '2',
              title: 'Detailed Estimate',
              desc: 'Comprehensive quote with line items, timeline, and payment schedule.'
            },
            {
              num: '3',
              title: 'Design Refinement',
              desc: 'We finalize details and get any necessary approvals (permits, HOA) before starting.'
            },
            {
              num: '4',
              title: 'Construction & Invoice',
              desc: 'Work proceeds on schedule. Invoicing per contract milestone schedule.'
            },
          ].map((step) => (
            <Card key={step.num} className="border border-gray-200">
              <div className="text-4xl font-bold text-blue-700 mb-2">{step.num}</div>
              <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="blue" padding="lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to Get a Custom Estimate?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Contact us today for a free, no-obligation estimate tailored to your project and budget.
          </p>
          <Button variant="ctaLight" size="lg" href="/contact">
            Request Free Estimate
          </Button>
        </div>
      </Section>
    </>
  );
}
