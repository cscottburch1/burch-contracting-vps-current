import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema-builders';
import { UniversalPageTemplate } from '@/components/templates/UniversalPageTemplate';
import { EEATSignals } from '@/components/seo/EEATSignals';
import { ClickableCityGrid } from '@/components/locations/ClickableCityGrid';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bathroom Remodeling Contractor | Upstate SC | Burch Contracting',
  description: 'Professional bathroom remodeling in Greenville, Simpsonville, Fountain Inn. Custom tile, vanities, tub-to-shower conversions. $8K-$55K. 30+ years experience.',
  alternates: { canonical: absoluteUrl('/bathroom-remodeling') },
  openGraph: {
    title: 'Bathroom Remodeling Contractor - Upstate SC | Burch Contracting',
    description: 'Transform your bathroom with custom tile work, modern vanities, and walk-in showers. 30+ years experience with 240+ bathroom remodels completed.',
    url: absoluteUrl('/bathroom-remodeling'),
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Bathroom Remodeling' },
];

const faqs = [
  {
    question: 'How much does a bathroom remodel cost in Greenville County?',
    answer: 'Bathroom remodeling costs vary significantly by scope and bathroom size. A full hall bathroom (5x8) remodel averages $12,000-$28,000 including demolition, new tile shower, vanity, toilet, flooring, lighting, and paint. Primary bathroom remodels (larger, often with separate tub and shower) run $28,000-$55,000. Tub-to-shower conversions in existing footprint cost $8,500-$14,000. Small powder room updates run $6,000-$12,000. I\'ve completed 240 bathroom remodels across Upstate SC since 1995. Most of my Simpsonville and Fountain Inn projects fall in the $15,000-$32,000 range for complete bath renovations.'
  },
  {
    question: 'How long does a bathroom remodel take?',
    answer: 'Most bathroom remodels take 2-4 weeks from demolition to completion. Timeline breaks down as: 1-2 days for demolition and disposal, 2-3 days for plumbing rough-in (moving fixtures or adding new drains), 1 day for electrical rough-in (new circuits, ventilation fan, lighting), 3-5 days for shower/tub installation and tile work (longer for complex tile patterns), 1 day for drywall repairs and paint, 1 day for vanity and toilet installation, 1 day for final tile grouting and sealing, 1-2 days for trim, mirrors, accessories, and final cleanup. Custom tile work or structural changes (expanding into closet space) can extend timeline to 4-6 weeks.'
  },
  {
    question: 'Should I keep the tub or convert to a walk-in shower?',
    answer: 'The tub-vs-shower decision depends on your home situation and future plans. Keep the tub if: you have young children (bathing small kids in showers is difficult), it\'s your only bathroom with a tub in the house (hurts resale value if you remove all tubs), or you personally enjoy baths. Convert to walk-in shower if: you\'re 55+ planning to age in place (eliminates fall risk), it\'s a secondary bath and you have a tub elsewhere, or you want a spa-like shower with multiple heads and body sprays. In Greenville County, I recommend keeping at least one tub in homes under $400,000 for resale. For luxury homes and primary baths in homes with multiple bathrooms, walk-in showers are increasingly standard. Tub-to-shower conversions cost $8,500-$14,000 and typically take 5-7 days.'
  },
  {
    question: 'What tile options work best for Upstate SC bathrooms?',
    answer: 'For Upstate SC\'s humidity, I recommend porcelain tile over ceramic - it\'s less porous and more durable. For shower walls: 3x6 or 4x12 subway tile (classic, timeless, $8-12/sqft installed), large format 12x24 tile (modern, fewer grout lines, $12-18/sqft), or penny tile accent strips. For floors: 12x24 porcelain wood-look plank tile (slip-resistant, looks like hardwood, $10-15/sqft) or hexagon mosaic (classic, excellent traction, $15-22/sqft). I always use epoxy grout in showers (mold-proof, never needs sealing) and proper waterproofing membrane systems like Schluter or RedGard. Avoid marble and travertine in Upstate SC - they require high maintenance and stain easily in our humid climate.'
  },
  {
    question: 'Do bathroom remodels require permits in Simpsonville and Greenville?',
    answer: 'Yes, bathroom remodels require permits if you\'re moving plumbing fixtures, doing electrical work, or making structural changes. A simple vanity and flooring swap doesn\'t need permits, but full bath remodels with tile work, shower replacement, or toilet relocation do. Greenville County permit costs run $250-$450 for bathroom work. I handle all permitting - inspections are required after rough plumbing/electrical and before covering with drywall, plus final inspection. Permits protect you by ensuring proper waterproofing, electrical work meets code (GFCI outlets required within 6 feet of water), and ventilation is adequate (required by SC building code to prevent mold).'
  },
  {
    question: 'Can you make bathrooms more accessible for aging in place?',
    answer: 'Yes, aging-in-place bathroom remodels are increasingly common in Upstate SC. Key modifications include: curbless walk-in showers with linear drains (eliminates step-over barrier), grab bars installed into blocking during framing (not surface-mount - those fail), comfort-height toilets (17-19 inches vs standard 15 inches), wider doorways to 32-36 inches for walker/wheelchair access, non-slip flooring throughout, handheld shower heads on slide bars, and lever-handle faucets (easier to operate than knobs). I plan blocking locations carefully during framing for future grab bar installation even if not installing them immediately. These modifications add $3,500-$7,500 to a standard bathroom remodel but provide safety and longevity for aging in your home.'
  },
];

const relatedPages = [
  {
    title: 'Bathroom Remodel Cost Calculator',
    href: '/calculator/bathroom-remodeling',
    description: 'Estimate your bathroom remodeling project cost'
  },
  {
    title: 'Kitchen Remodeling',
    href: '/kitchen-remodeling',
    description: 'Complete kitchen renovations with custom cabinets and countertops'
  },
  {
    title: 'Home Remodeling Services',
    href: '/home-renovations',
    description: 'Whole-home remodeling including multiple rooms'
  },
];

export default function BathroomRemodelingPage() {
  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateServiceSchema({
              serviceName: 'Bathroom Remodeling',
              serviceType: 'BathroomRemodeling',
              description: 'Professional bathroom remodeling services including custom tile work, shower and tub installation, vanities, flooring, lighting, plumbing, and complete renovations for homes in Upstate South Carolina.',
              url: absoluteUrl('/bathroom-remodeling'),
              priceRange: '$8,500-$55,000',
              areaServed: [
                { city: 'Simpsonville', state: 'SC' },
                { city: 'Fountain Inn', state: 'SC' },
                { city: 'Greenville', state: 'SC' },
                { city: 'Mauldin', state: 'SC' },
                { city: 'Laurens', state: 'SC' },
                { city: 'Woodruff', state: 'SC' },
                { city: 'Gray Court', state: 'SC' },
              ],
            }),
            generateFAQSchema(faqs),
            generateBreadcrumbSchema([
              { name: 'Home', url: absoluteUrl('/') },
              { name: 'Services', url: absoluteUrl('/services') },
              { name: 'Bathroom Remodeling', url: absoluteUrl('/bathroom-remodeling') },
            ]),
          ])
        }}
      />

      <UniversalPageTemplate
        title="Bathroom Remodeling Contractor - Upstate SC"
        description="Transform your bathroom with custom tile, modern fixtures, and expert craftsmanship."
        breadcrumbs={breadcrumbs}
        showAuthor={true}
        author={{
          name: 'Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: 'SC Licensed General Contractor #CLG118679 | 35+ years | 240 bathrooms remodeled since 1995',
        }}
        showCredentials={true}
        credentialsVariant="full"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={relatedPages}
        showCTA={true}
        ctaTitle="Ready to Transform Your Bathroom?"
        ctaDescription="Free consultation and detailed estimate. Let's create a beautiful, functional bathroom you'll love."
      >
        {/* Hero Section */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Professional Bathroom Remodeling in Upstate SC
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              I've remodeled 240 bathrooms across Greenville County since 1995 - from simple tub-to-shower conversions to complete luxury primary bathroom transformations. Every project includes meticulous tile work, proper waterproofing, modern fixtures, and attention to the details that make bathrooms both beautiful and functional. I coordinate plumbing, electrical, tile, and finish work so you work with one contractor from design through final grout sealing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="tel:8647244600" variant="primary" size="lg">
                Call (864) 724-4600 - Free Consultation
              </Button>
              <Button href="/calculator/bathroom-remodeling" variant="outline" size="lg">
                Calculate Your Cost
              </Button>
            </div>
          </div>

          {/* Trust Signals */}
          <EEATSignals variant="full" className="mb-12" />

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$12-28K</div>
              <div className="text-gray-600">Full Bath Remodel Cost</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$28-55K</div>
              <div className="text-gray-600">Primary Bath Remodel</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$8.5-14K</div>
              <div className="text-gray-600">Tub-to-Shower Conversion</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2-4</div>
              <div className="text-gray-600">Weeks Typical Timeline</div>
            </Card>
          </div>
        </Section>

        {/* Local Market Context */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Bathroom Remodeling in Greenville County (2026)
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  Greenville County issued 2,847 bathroom remodeling permits in 2025, up 24% from 2024 - the fastest-growing home improvement category. Average project cost was $19,800 across all bathroom sizes and scopes. Simpsonville averaged $17,200 for full bathroom remodels while Greenville city averaged $21,500, reflecting larger primary bathrooms and higher-end finishes.
                </p>
                <p className="mb-4">
                  <strong>What's driving the bathroom boom?</strong> Many 1990s-2000s homes have original bathrooms with builder-grade fiberglass tub surrounds, cultured marble vanity tops, and dated fixtures. Tub-to-shower conversions represent 38% of projects as baby boomers age in place and eliminate fall risks. Walk-in showers with curbless entries and frameless glass are now standard in new construction, pushing remodels to match.
                </p>
                <p className="mb-4">
                  <strong>Material trends in Upstate SC bathrooms (2026):</strong> Large-format tile (12x24 or larger) dominates shower walls (64% of my recent projects) due to fewer grout lines and modern appearance. White subway tile remains popular for budget-conscious projects. Matte black fixtures and hardware replaced chrome as the default finish in 2024. Floating vanities (wall-mounted, no legs) are gaining popularity but I still install traditional vanities in 70% of projects for storage and timeless appeal. Quartz vanity tops have overtaken granite (easier to clean, no sealing required).
                </p>
                <p>
                  Most Simpsonville and Fountain Inn clients budget $15,000-$25,000 for a complete hall bathroom remodel (5x8 typical). This gets you full tile shower with glass door, new vanity with quartz top, comfort-height toilet, luxury vinyl plank flooring, updated lighting and ventilation, and professional tile work with proper waterproofing. Primary bathroom remodels with double vanities, separate tub and shower, and premium finishes run $32,000-$48,000 in typical Upstate SC homes.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* What's Included */}
        <Section background="white" padding="lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Complete Bathroom Remodeling Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Trash" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Demolition & Disposal</h3>
                    <p className="text-gray-600">
                      Complete bathroom demolition including old tub/shower, vanity, toilet, flooring down to subfloor, and drywall removal as needed. I protect your home with plastic barriers and runner protection. All debris hauled away same day - no dumpster sitting in your driveway for weeks. Rough framing inspection before closing walls.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Droplet" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Plumbing Rough-In</h3>
                    <p className="text-gray-600">
                      Relocate or replace all supply lines and drain pipes. PEX supply lines (flexible, reliable), proper drain venting per code, shower valve rough-in at correct height/depth, toilet flange installation. I work with licensed plumbers for gas line work. Pressure test all lines before closing walls. Rough plumbing inspection coordinated.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Grid" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Tile Work</h3>
                    <p className="text-gray-600">
                      Professional tile installation with Schluter or RedGard waterproofing systems (code requirement in SC). Shower walls to ceiling, decorative niche for shampoo storage, precise grout lines, epoxy grout in showers (mold-proof, never seals). Floor tile with proper slope to drain. I template and plan all tile layouts before installation to avoid awkward cuts.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Box" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Vanity & Sinks</h3>
                    <p className="text-gray-600">
                      Stock vanities (24"-36" wide for hall baths, 48"-72" doubles for primary), semi-custom, or custom-built options. Quartz tops with undermount sinks standard (easier to clean than drop-in). Soft-close drawers, adequate storage for toiletries. I handle sink cutouts, faucet installation, and supply line connections. Floating vanities available for modern look.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Waves" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Shower & Tub Installation</h3>
                    <p className="text-gray-600">
                      Tile showers with custom waterproofing, Delta or Moen fixtures (quality brands with local parts availability), frameless glass doors for modern look or framed for budget-conscious. Tub-to-shower conversions popular for aging-in-place. Alcove tubs, freestanding soaking tubs, or curbless walk-in showers. Proper slope and drainage critical in SC humidity.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Square" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Flooring</h3>
                    <p className="text-gray-600">
                      Porcelain tile (most common - waterproof, durable, $10-15/sqft installed) or luxury vinyl plank (budget option, waterproof, $6-10/sqft). I avoid ceramic tile in bathrooms - porcelain is less porous. Heated floor options available ($8-12/sqft additional). Proper subfloor prep including leveling compound ensures no loose tiles later.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Lightbulb" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Lighting & Electrical</h3>
                    <p className="text-gray-600">
                      Recessed LED vanity lighting (no shadows on face), exhaust fan sized properly for bathroom cubic footage (required by SC code), GFCI outlets within 6 feet of water sources per code, additional outlets for electric toothbrush/hair tools. Updated switches including dimmer for ambiance. Night light outlets common addition.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Wind" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ventilation</h3>
                    <p className="text-gray-600">
                      Proper bathroom ventilation is critical in Upstate SC's humidity to prevent mold. I install Panasonic or Broan exhaust fans sized correctly (CFM rating based on room size), vented to exterior (never to attic), with humidity sensor switches that run automatically. Many codes now require this in new construction - I include it in all remodels.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* Pricing Breakdown */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Bathroom Remodeling Costs in Upstate SC (2026)
            </h2>
            <div className="space-y-6">
              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Budget Update - $8,000-$15,000</h3>
                <p className="text-gray-600 mb-4">
                  Cosmetic refresh or tub-to-shower conversion. Includes fiberglass or acrylic shower surround (or basic tile), new vanity with stock cabinet and quartz top, new toilet, luxury vinyl plank flooring, updated lighting and exhaust fan, fresh paint. Perfect for hall baths or rental properties. Tub-to-shower conversions in existing footprint fall in this range.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span><strong>Example:</strong> 5x8 hall bath update = $11,500 average</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span>Good quality materials, functional upgrade</span>
                  </li>
                </ul>
              </Card>

              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mid-Range Remodel - Full Bath $15-28K | Primary $28-45K</h3>
                <p className="text-gray-600 mb-4">
                  Complete bathroom renovation with custom tile. Includes full tile shower with glass door, semi-custom or stock vanity with quartz top, comfort-height toilet, porcelain tile floor, recessed LED lighting, proper exhaust ventilation, professional tile installation with waterproofing membrane, matte black or brushed nickel fixtures. Primary baths add double vanity, larger shower or separate tub/shower, upgraded tile patterns.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span><strong>Example:</strong> 6x9 full bath = $21,000 average</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span>Most popular tier for Simpsonville/Fountain Inn homes</span>
                  </li>
                </ul>
              </Card>

              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Luxury Remodel - $45,000-$70,000+</h3>
                <p className="text-gray-600 mb-4">
                  Spa-like primary bathroom transformation. Includes custom tile work with decorative accents or natural stone, freestanding soaking tub, separate large walk-in shower with multiple shower heads and body sprays, custom double vanity (60"-84" wide) with premium quartz or marble top, heated floors, custom lighting plan with chandelier or pendants, frameless heavy glass shower enclosure, premium fixtures (Kohler, Delta luxury lines), expanded footprint into adjacent closet if needed.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span><strong>Example:</strong> 10x14 primary bath = $58,000 average</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span>Common in Greenville homes $500K+</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Additional Costs to Consider</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Permits:</strong> $250-$450 for plumbing and electrical work in Greenville County</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Structural Changes:</strong> $2,500-$6,000 to expand bathroom into adjacent closet (includes framing, beam if needed)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Exhaust Fan Venting:</strong> $400-$800 if existing fan vents to attic (not code compliant - must vent to exterior)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Plumbing Issues:</strong> $800-$2,500 if we discover old galvanized pipes or cast iron drains needing replacement</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* FAQs */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Common Questions About Bathroom Remodeling
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* City Coverage */}
        <Section background="gray" padding="lg">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Bathroom Remodeling Across Upstate SC
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              I serve a 30-mile radius from Gray Court, covering all major cities in Greenville and Laurens counties. Click your city for local bathroom remodeling information and recent projects.
            </p>
            <ClickableCityGrid columns={3} />
          </div>
        </Section>

        {/* Related Services */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Related Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPages.map((page, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <Link href={page.href}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600">
                      {page.title}
                    </h3>
                    <p className="text-gray-600">{page.description}</p>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      </UniversalPageTemplate>
    </>
  );
}
