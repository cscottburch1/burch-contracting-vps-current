import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorItemListSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Free Construction Cost Calculators | Simpsonville, Fountain Inn & Greenville County SC',
  description: 'Instant cost estimates for decks, screened porches, garages, room additions, kitchen & bath remodels, basement finishing, ADUs, and commercial renovations in Simpsonville, Fountain Inn, and Greenville County, SC.',
  alternates: { canonical: absoluteUrl('/calculators') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Free Construction Cost Calculators | Burch Contracting — Upstate SC',
    description: 'Interactive project cost estimators built on real 2025–2026 local pricing for Simpsonville, Fountain Inn, Gray Court, and Greenville County.',
    url: absoluteUrl('/calculators'),
  },
};

const calculators = [
  {
    title: 'Deck Cost Calculator',
    href: '/calculator/decks',
    description: 'Estimate deck construction costs in Simpsonville & Greenville County by size, material (pressure-treated, composite, cedar), and features.',
    icon: '🪵',
  },
  {
    title: 'Screened Porch Calculator',
    href: '/calculator/screened-porches',
    description: 'Get a cost range for screened porch additions in Fountain Inn & Upstate SC based on size, roofing, and screen type.',
    icon: '🏠',
  },
  {
    title: 'Garage Cost Calculator',
    href: '/calculator/garages',
    description: 'Price out an attached or detached garage in Simpsonville, Gray Court & Greenville County by size, door count, and finish level.',
    icon: '🚗',
  },
  {
    title: 'Room Addition Calculator',
    href: '/calculator/room-additions',
    description: 'Calculate home addition costs in Upstate SC by square footage, foundation type, and room purpose.',
    icon: '📐',
  },
  {
    title: 'General Additions Calculator',
    href: '/calculator/additions',
    description: 'Line-item estimator covering additions, porches, decks, and outdoor structures for Greenville area homes.',
    icon: '🏗️',
  },
  {
    title: 'Kitchen Remodeling Calculator',
    href: '/calculator/kitchen-remodeling',
    description: 'Estimate kitchen renovation costs in Simpsonville & Fountain Inn by cabinet quality, appliances, and countertop material.',
    icon: '🍳',
  },
  {
    title: 'Bathroom Remodeling Calculator',
    href: '/calculator/bathroom-remodeling',
    description: 'Price a bathroom remodel in Upstate SC by size, fixture upgrades, tile, and finish selections.',
    icon: '🛁',
  },
  {
    title: 'Basement Finishing Calculator',
    href: '/calculator/basement-finishing',
    description: 'Get basement finishing cost estimates for Simpsonville & Fountain Inn homes based on square footage and room configuration.',
    icon: '⬇️',
  },
  {
    title: 'ADU Cost Calculator',
    href: '/calculator/adus',
    description: 'Estimate accessory dwelling unit (backyard cottage, garage apartment) construction costs in Upstate SC.',
    icon: '🏡',
  },
  {
    title: 'Remodeling Calculator',
    href: '/calculator/remodeling',
    description: 'General remodeling cost estimator for Greenville County covering interior renovations by scope and finish level.',
    icon: '🔨',
  },
  {
    title: 'Handyman Services Calculator',
    href: '/calculator/handyman',
    description: 'Price handyman and home repair services in Simpsonville & Fountain Inn by task type and estimated hours.',
    icon: '🔧',
  },
  {
    title: 'Commercial Renovations Calculator',
    href: '/calculator/commercial-renovations',
    description: 'Estimate office build-outs, retail upfits, medical offices, and restaurant fit-out costs in Upstate SC.',
    icon: '🏢',
  },
  {
    title: 'Decks & Screened Porches Calculator',
    href: '/calculator/decks-screened-porches',
    description: 'Combined estimator for deck and screened porch outdoor living projects in Greenville County, SC.',
    icon: '🌿',
  },
];

const itemListSchema = buildCalculatorItemListSchema(
  calculators.map((c) => ({ name: c.title, url: c.href, description: c.description }))
);

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'Cost Calculators', item: absoluteUrl('/calculators') },
  ],
};

export default function CalculatorsPage() {
  return (
    <>
      <Script
        id="calc-hub-itemlist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Script
        id="calc-hub-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-200 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Free Construction Cost Calculators</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Instant estimates for every project we build in Simpsonville, Fountain Inn, Gray Court, and across Greenville and Laurens Counties — no sign-up, no personal information required.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>✓ Based on real 2025–2026 local pricing</span>
              <span>✓ Instant results</span>
              <span>✓ No email required</span>
            </div>
          </div>
        </section>

        {/* Service Area note */}
        <section className="bg-blue-50 border-b border-blue-100 py-4 px-4">
          <p className="max-w-4xl mx-auto text-center text-sm text-blue-800">
            Pricing reflects current Upstate SC market rates for <strong>Simpsonville</strong>, <strong>Fountain Inn</strong>, <strong>Gray Court</strong>, <strong>Mauldin</strong>, <strong>Greenville</strong>, <strong>Woodruff</strong>, and surrounding Greenville County and Laurens County communities.
          </p>
        </section>

        {/* Calculator Grid */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-3">{calc.icon}</div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 mb-2 flex items-center justify-between">
                  {calc.title}
                  <span className="text-blue-400 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">{calc.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-blue-700 text-white py-12 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Need a Precise Estimate?</h2>
            <p className="text-blue-100 mb-6">
              Calculators give good ballparks. For an exact quote on your specific project in Simpsonville, Fountain Inn, or anywhere in Upstate SC, get a free on-site estimate — typically delivered within 5 business days.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Request Free Estimate
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
