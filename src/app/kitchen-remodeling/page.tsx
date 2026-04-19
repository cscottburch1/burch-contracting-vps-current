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
  title: 'Kitchen Remodeling Contractor | Upstate SC | Burch Contracting',
  description: 'Professional kitchen remodeling in Greenville, Simpsonville, Fountain Inn. Custom cabinets, countertops, backsplash. $25K-$85K. 30+ years experience. Licensed, insured.',
  alternates: { canonical: absoluteUrl('/kitchen-remodeling') },
  openGraph: {
    title: 'Kitchen Remodeling Contractor - Upstate SC | Burch Contracting',
    description: 'Transform your kitchen with custom cabinets, granite or quartz countertops, designer backsplash, and modern appliances. Expert remodeling with 30+ years experience.',
    url: absoluteUrl('/kitchen-remodeling'),
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
  { label: 'Kitchen Remodeling' },
];

const faqs = [
  {
    question: 'How much does a kitchen remodel cost in Simpsonville and Greenville?',
    answer: 'Kitchen remodeling costs in Upstate SC vary widely by scope and finishes. A budget refresh (new paint, hardware, countertops only) runs $15,000-$25,000. Mid-range remodels with stock or semi-custom cabinets, quartz countertops, subway tile backsplash, and mid-grade appliances average $25,000-$45,000. High-end remodels with custom cabinets, premium stone, designer tile, and luxury appliances run $50,000-$85,000+. In 2026, the average kitchen remodel in Simpsonville is $28,500 while Greenville averages $32,200. I\'ve completed 47 kitchen remodels since 1995, with most projects in the $30,000-$50,000 range.'
  },
  {
    question: 'Should I replace cabinets or just reface them?',
    answer: 'Cabinet replacement vs refacing depends on your goals and budget. Refacing (new doors, drawer fronts, and veneer on cabinet boxes) costs $8,000-$15,000 and works if your existing cabinet boxes are solid and the layout is functional. Full replacement costs $15,000-$35,000 but lets you change the layout, add soft-close drawers, optimize storage with pullouts and organizers, and update to modern dimensions (deeper base cabinets, taller uppers). I recommend replacement if: your cabinets are particle board (common in 1980s-90s homes), you want to change the layout, or you\'re doing a full remodel anyway. Refacing works for budget-conscious updates when the layout already works well.'
  },
  {
    question: 'How long does a kitchen remodel take?',
    answer: 'Most kitchen remodels take 4-7 weeks from demolition to completion. Timeline breaks down as: 3-7 days for demolition and disposal, 1-2 weeks for rough-in work (electrical upgrades, plumbing reroutes, any structural changes), 3-5 days for drywall and paint, 1 week for cabinet installation, 2-3 days for countertop template and installation (quartz is faster than granite due to less fabrication time), 2-3 days for backsplash tile, 2-3 days for flooring (if replacing), 1 week for final trim, hardware, appliance installation, and punch list. Custom cabinets add 4-6 weeks to the front end for manufacturing before we start demolition.'
  },
  {
    question: 'Can I stay in my home during a kitchen remodel?',
    answer: 'Yes, most of my clients stay home during kitchen remodels, though it requires planning and patience. You\'ll be without a functioning kitchen for 3-5 weeks. I recommend setting up a temporary kitchen in your garage or dining room with a microwave, toaster oven, coffee maker, and mini fridge. Your water will be off for 1-2 days during plumbing work (I coordinate this to minimize disruption). Dust is managed with plastic barriers and daily cleanup. Many families eat out more, use paper plates, and simplify meals. Some clients with young children or who work from home choose to stay with family for 2-3 weeks during the most disruptive phases (demolition and cabinet installation).'
  },
  {
    question: 'What kitchen upgrades give the best ROI?',
    answer: 'In Greenville County, the best ROI kitchen upgrades are: quartz countertops (87% return - buyers expect stone counters now, granite and quartz both work), subway or classic tile backsplash to ceiling behind stove (85% return - relatively inexpensive but high visual impact), soft-close cabinet doors and drawers (82% return - buyers notice quality details), undermount stainless steel sink (80% return), and upgraded lighting including under-cabinet LEDs (78% return). Cabinet painting returns 75-85% vs full replacement at 65-75%, making it a smart budget option. Avoid over-improving for your neighborhood - a $75,000 kitchen in a $250,000 home won\'t return well. For most Upstate SC homes valued at $300,000-$450,000, a $35,000-$50,000 kitchen remodel is the sweet spot.'
  },
  {
    question: 'Do you offer financing for kitchen remodels?',
    answer: 'I don\'t directly offer financing, but I work with clients using several common financing options for kitchen remodels in Upstate SC. Home equity lines of credit (HELOCs) typically offer the best rates (currently 7.5-9% in 2026) and tax-deductible interest for loans up to $100,000. Cash-out refinancing works if you can maintain a good mortgage rate. Personal loans through banks like First Citizens or SouthState run 9-14% for credit scores above 700. Some clients use 0% promotional credit cards for smaller projects under $25,000 if they can pay off within 12-18 months. I provide detailed estimates upfront so you can present accurate numbers to lenders. Most lenders require an appraisal or contractor estimate before approving home equity financing.'
  },
];

const relatedPages = [
  {
    title: 'Kitchen Remodel Cost Calculator',
    href: '/calculator/kitchen-remodeling',
    description: 'Estimate your kitchen remodeling project cost'
  },
  {
    title: 'Bathroom Remodeling',
    href: '/bathroom-remodeling',
    description: 'Complete bathroom renovations with custom tile and fixtures'
  },
  {
    title: 'Home Remodeling Services',
    href: '/home-renovations',
    description: 'Whole-home remodeling including multiple rooms'
  },
];

export default function KitchenRemodelingPage() {
  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateServiceSchema({
              serviceName: 'Kitchen Remodeling',
              serviceType: 'KitchenRemodeling',
              description: 'Professional kitchen remodeling services including custom cabinets, countertops, backsplash tile, flooring, lighting, plumbing, and electrical upgrades for homes in Upstate South Carolina.',
              url: absoluteUrl('/kitchen-remodeling'),
              priceRange: '$25,000-$85,000',
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
              { name: 'Kitchen Remodeling', url: absoluteUrl('/kitchen-remodeling') },
            ]),
          ])
        }}
      />

      <UniversalPageTemplate
        title="Kitchen Remodeling Contractor - Upstate SC"
        description="Transform your kitchen with custom cabinets, premium countertops, and expert craftsmanship."
        breadcrumbs={breadcrumbs}
        showAuthor={true}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: 'SC Licensed General Contractor #CLG118679 | 35+ years | 47 kitchens remodeled since 1995',
        }}
        showCredentials={true}
        credentialsVariant="full"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={relatedPages}
        showCTA={true}
        ctaTitle="Ready to Transform Your Kitchen?"
        ctaDescription="Free consultation and detailed estimate. Let's design your dream kitchen within your budget."
      >
        {/* Hero Section */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Professional Kitchen Remodeling in Upstate SC
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              I've remodeled 47 kitchens across Greenville County since 1995 - from simple cabinet and countertop refreshes to complete gut renovations with new layouts, custom cabinetry, and high-end appliances. Every project starts with understanding how you cook and entertain, then designing a functional, beautiful space that fits your budget. I coordinate all trades (electrical, plumbing, tile, countertops) so you work with one contractor from design through final cleanup.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="tel:8647244600" variant="primary" size="lg">
                Call (864) 724-4600 - Free Consultation
              </Button>
              <Button href="/calculator/kitchen-remodeling" variant="outline" size="lg">
                Calculate Your Cost
              </Button>
            </div>
          </div>

          {/* Trust Signals */}
          <EEATSignals variant="full" className="mb-12" />

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$25-45K</div>
              <div className="text-gray-600">Mid-Range Remodel Cost</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$50-85K</div>
              <div className="text-gray-600">High-End Remodel Cost</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">4-7</div>
              <div className="text-gray-600">Weeks Typical Timeline</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">47</div>
              <div className="text-gray-600">Kitchens Remodeled Since 1995</div>
            </Card>
          </div>
        </Section>

        {/* Local Market Context */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Kitchen Remodeling Market in Upstate SC (2026)
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  Kitchen remodeling remains the #1 home improvement project in Greenville County, with contractors completing approximately 3,200 permitted kitchen renovations in 2025 (up 12% from 2024). The average project cost $31,800 across all tiers. Simpsonville averages $28,500 for mid-range remodels while Greenville city projects average $32,200, reflecting newer construction and larger home values.
                </p>
                <p className="mb-4">
                  <strong>What's driving demand?</strong> Many Upstate SC homes built in the 1990s-2000s have original kitchens with oak cabinets, laminate countertops, and fluorescent lighting - all due for updates. Open floor plan conversions are popular (removing wall between kitchen and dining room), adding $6,500-$12,000 to project costs but creating the entertaining spaces buyers want.
                </p>
                <p className="mb-4">
                  <strong>Material trends I'm seeing in 2026:</strong> Quartz has overtaken granite (62% vs 28% of my recent projects) due to lower maintenance and consistent patterns. White and light gray cabinets dominate (78% of projects) with navy or sage green as accent islands. Subway tile backsplash to ceiling is standard, but hexagon and arabesque patterns are gaining ground. Matte black fixtures and hardware replaced brushed nickel as the default finish in 2024.
                </p>
                <p>
                  Most of my Simpsonville and Fountain Inn clients budget $30,000-$45,000 for a complete mid-range remodel. This gets you stock or semi-custom cabinets, quartz countertops, subway or pattern tile backsplash, luxury vinyl plank flooring, new lighting, and mid-grade stainless appliances. Custom cabinets and premium German appliances push projects into the $55,000-$75,000 range, common in Greenville's nicer neighborhoods and homes above $450,000.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* What's Included */}
        <Section background="white" padding="lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Complete Kitchen Remodeling Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Box" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Cabinets & Refacing</h3>
                    <p className="text-gray-600">
                      Stock cabinets (KraftMaid, Diamond), semi-custom (adjustable dimensions), or full custom (local cabinet maker). Soft-close doors and drawers standard on all projects. Cabinet refacing available for budget-conscious updates. I handle all measuring, ordering, and installation with precise leveling and alignment.
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Countertops</h3>
                    <p className="text-gray-600">
                      Quartz (most popular - Cambria, Silestone, MSI), granite, or butcher block. I coordinate templating after cabinet installation for perfect fit. Undermount sink cutouts included. Typical turnaround 7-10 days from template to installation. Edge profiles from basic eased to decorative ogee available.
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Backsplash Tile</h3>
                    <p className="text-gray-600">
                      Subway tile (3x6 classic), hexagon, arabesque, or glass mosaic. I recommend extending to ceiling behind stove for high-impact look. Professional installation with thin-set mortar, precise grout lines, and sealed grout (epoxy grout available for minimal maintenance). Typical cost $15-35/sqft installed depending on tile complexity.
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
                      Luxury vinyl plank (waterproof, looks like hardwood, most popular), tile (ceramic or porcelain), or engineered hardwood. Subfloor prep and leveling compound included as needed. I match existing flooring transitions to adjacent rooms. Typical flooring adds $8-15/sqft to project depending on material choice.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Appliances</h3>
                    <p className="text-gray-600">
                      I coordinate appliance delivery and installation but you purchase directly (better pricing, your choice of retailer). Mid-grade stainless Samsung/LG/Whirlpool packages run $3,500-$5,500. High-end Bosch/KitchenAid/GE Cafe packages $7,000-$12,000. I handle all cutouts, electrical connections, water lines, and gas hookups.
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Lighting Upgrade</h3>
                    <p className="text-gray-600">
                      Recessed LED can lights (most common - energy efficient, clean look), pendant lights over island, under-cabinet LED strip lighting (hardwired, not plug-in), updated switches including dimmers. I upgrade to 20-amp circuits as needed for modern appliances. All work permitted per code.
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Plumbing Updates</h3>
                    <p className="text-gray-600">
                      Sink relocation if changing layout, new faucet installation (you choose finish - matte black, chrome, or brushed nickel most common), dishwasher hookups, disposal installation, ice maker lines. I work with licensed plumbers for gas line work if relocating range. Supply lines replaced with braided stainless.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Electrical Service Upgrade</h3>
                    <p className="text-gray-600">
                      Many 1990s-2000s Upstate SC homes need electrical upgrades for modern kitchens. I add dedicated 20-amp circuits for microwave and disposal, upgrade to 50-amp for electric ranges, add GFCI outlets per current code, and install proper ventilation wiring. Licensed electrician coordinates with building inspections.
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
              Kitchen Remodeling Costs in Upstate SC (2026)
            </h2>
            <div className="space-y-6">
              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Budget Refresh - $15,000-$25,000</h3>
                <p className="text-gray-600 mb-4">
                  Cosmetic update keeping existing cabinet boxes. Includes cabinet painting or refacing, new quartz countertops, peel-and-stick or basic subway tile backsplash, updated hardware and fixtures, new lighting (replace existing fixtures), fresh paint on walls/ceiling. Appliances not included in this tier.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span><strong>Example:</strong> 10x12 kitchen = $18,500 average</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span>Best for functional kitchens needing updated aesthetics</span>
                  </li>
                </ul>
              </Card>

              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mid-Range Remodel - $25,000-$45,000</h3>
                <p className="text-gray-600 mb-4">
                  Complete remodel with new everything. Includes stock or semi-custom cabinets (KraftMaid, Diamond), quartz countertops, subway or pattern tile backsplash to ceiling, luxury vinyl plank flooring, recessed LED lighting plus under-cabinet lights, new sink and faucet, updated electrical outlets and circuits, professional installation throughout.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span><strong>Example:</strong> 12x14 kitchen = $34,000 average</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span>Most popular tier for Simpsonville/Fountain Inn homes</span>
                  </li>
                </ul>
              </Card>

              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">High-End Luxury - $50,000-$85,000+</h3>
                <p className="text-gray-600 mb-4">
                  Premium materials and custom details. Includes full custom cabinets with organizers and specialty storage, premium quartz or exotic stone counters, designer tile backsplash (handmade or glass mosaic), hardwood or high-end tile flooring, custom lighting plan with pendants and chandelier, structural changes for open floor plan, appliance package upgrade allowance, crown molding and trim details.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span><strong>Example:</strong> 14x18 gourmet kitchen = $68,000 average</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span>Common in Greenville area homes $450K+</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Additional Costs to Consider</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Appliances:</strong> $3,500-$12,000 depending on brand and package (you purchase separately)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Structural Work:</strong> $6,500-$12,000 to remove wall for open concept (includes beam, drywall, flooring patch)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Permits:</strong> $350-$650 for electrical and plumbing work in Greenville County</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Windows/Doors:</strong> $800-$2,500 per opening if adding or enlarging windows</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* FAQs */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Common Questions About Kitchen Remodeling
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
              Kitchen Remodeling Across Upstate SC
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              I serve a 30-mile radius from Gray Court, covering all major cities in Greenville and Laurens counties. Click your city for local kitchen remodeling information and recent projects.
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
