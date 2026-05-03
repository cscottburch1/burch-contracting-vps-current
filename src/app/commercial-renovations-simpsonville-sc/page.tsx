import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/schema-builders';
import { UniversalPageTemplate } from '@/components/templates/UniversalPageTemplate';
import { ClickableCityGrid } from '@/components/locations/ClickableCityGrid';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Commercial Tenant Improvements Simpsonville SC | Office Build-Outs & Retail Upfits',
  description: 'Expert commercial tenant improvements in Simpsonville SC. Office build-outs, retail upfits, medical office renovations. 35+ years local experience. SC Licensed. Free estimates.',
  alternates: { canonical: absoluteUrl('/commercial-renovations-simpsonville-sc') },
  openGraph: {
    title: 'Commercial Tenant Improvements Simpsonville SC | Burch Contracting',
    description: 'Professional commercial tenant space renovations in Simpsonville: office build-outs, retail upfits, medical office renovations. Local contractor with 35+ years experience.',
    url: absoluteUrl('/commercial-renovations-simpsonville-sc'),
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
  { label: 'Commercial Renovations', href: '/commercial-renovations' },
  { label: 'Simpsonville SC' },
];

const relatedPages = [
  {
    title: 'Commercial Renovations - All Areas',
    href: '/commercial-renovations',
    description: 'Complete commercial tenant improvement services across Upstate SC'
  },
  {
    title: 'Office Build-Out Calculator',
    href: '/calculator/commercial-renovations',
    description: 'Calculate your commercial project costs instantly'
  },
  {
    title: 'Simpsonville Service Area',
    href: '/service-areas/simpsonville',
    description: 'All construction services in Simpsonville SC'
  },
];

export default function CommercialRenovationsSimpsonvillePage() {
  return (
    <>
      {/* Schema Markup - LocalBusiness for Simpsonville service area */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': absoluteUrl('/#localbusiness'),
            name: 'Burch Contracting - Simpsonville SC',
            url: absoluteUrl('/commercial-renovations-simpsonville-sc'),
            logo: absoluteUrl('/logo-transparent.webp'),
            telephone: '(864) 724-4600',
            email: 'estimates@burchcontracting.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '1095 Water Tank Rd',
              addressLocality: 'Gray Court',
              addressRegion: 'SC',
              postalCode: '29645',
              addressCountry: 'US',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '34.6341746',
              longitude: '-82.0744941',
            },
            areaServed: {
              '@type': 'City',
              name: 'Simpsonville',
              addressRegion: 'SC',
              addressCountry: 'US',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5.0',
              reviewCount: 12,
              bestRating: 5,
              worstRating: 1,
            },
            priceRange: '$$-$$$',
            openingHours: 'Mo-Fr 08:00-17:00',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServiceSchema({
              serviceName: 'Commercial Tenant Improvements - Simpsonville SC',
              serviceType: 'CommercialConstruction',
              description: 'Professional commercial tenant improvements in Simpsonville SC including office build-outs, retail upfits, medical office renovations, and restaurant fit-outs.',
              url: absoluteUrl('/commercial-renovations-simpsonville-sc'),
              priceRange: '$45-$120 per square foot',
              areaServed: [{ city: 'Simpsonville', state: 'SC' }],
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: 'Home', url: absoluteUrl('/') },
              { name: 'Services', url: absoluteUrl('/services') },
              { name: 'Commercial Renovations', url: absoluteUrl('/commercial-renovations') },
              { name: 'Simpsonville SC', url: absoluteUrl('/commercial-renovations-simpsonville-sc') },
            ])
          ),
        }}
      />

      <UniversalPageTemplate
        title="Commercial Tenant Improvements - Simpsonville SC"
        description="Expert commercial tenant improvements serving Simpsonville businesses: office build-outs, retail upfits, medical office renovations."
        breadcrumbs={breadcrumbs}
        showAuthor={true}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: 'SC Licensed #CLG118679 | 35+ years | 12 Simpsonville commercial projects completed',
        }}
        showCredentials={true}
        credentialsVariant="full"
        lastUpdated={new Date('2026-05-02')}
        relatedPages={relatedPages}
        showCTA={true}
        ctaTitle="Ready to Transform Your Simpsonville Commercial Space?"
        ctaDescription="Free on-site consultation in Simpsonville. Expert local contractor with 35+ years experience."
      >
        {/* Hero Section */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Commercial Tenant Improvements in Simpsonville, SC
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              I've completed 12 commercial tenant improvement projects in Simpsonville since 1995, serving businesses along Grandview Drive, Fairview Road, and throughout downtown. From office build-outs near Five Forks to retail upfits in Simpsonville Town Center, I deliver quality commercial construction with minimal disruption to your operations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="tel:8647244600" variant="primary" size="lg">
                <Icon name="Phone" size={20} />
                Call (864) 724-4600
              </Button>
              <Button href="/calculator/commercial-renovations" variant="outline" size="lg">
                <Icon name="Calculator" size={20} />
                Calculate Your Cost
              </Button>
            </div>
          </div>

          {/* Simpsonville-Specific Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card padding="md" className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12+</div>
              <div className="text-sm text-gray-600">Simpsonville Commercial Projects</div>
            </Card>
            <Card padding="md" className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10 min</div>
              <div className="text-sm text-gray-600">From Gray Court Office</div>
            </Card>
            <Card padding="md" className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5.0</div>
              <div className="text-sm text-gray-600">Google Rating</div>
            </Card>
            <Card padding="md" className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">SC Lic</div>
              <div className="text-sm text-gray-600">#CLG118679</div>
            </Card>
          </div>
        </Section>

        {/* Simpsonville Market Overview */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Commercial Construction Serving Simpsonville Businesses
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Simpsonville's commercial real estate market has grown significantly over the past decade. I've worked with tenants, landlords, and property managers throughout <strong>Simpsonville Town Center, Five Forks commercial corridor, and Fairview Road business district</strong> to deliver quality tenant improvements.
              </p>
              <p className="mb-4">
                My Simpsonville commercial projects include office build-outs for professional services firms, retail upfits for boutiques and restaurants along Main Street, and medical office renovations near Hillcrest Hospital. As a <strong>SC Licensed General Contractor (#CLG118679)</strong> with 35+ years experience, I understand Simpsonville building codes, work with local inspectors, and coordinate with major property management firms active in the area.
              </p>
              <p>
                Average commercial tenant improvement costs in Simpsonville: <strong>Office spaces $50-$75/sqft, retail upfits $45-$85/sqft, medical offices $70-$110/sqft</strong>. Most projects receive Tenant Improvement allowances of $15-$25/sqft from landlords, which I help maximize through detailed cost estimates and landlord coordination.
              </p>
            </div>
          </div>
        </Section>

        {/* Simpsonville Service Types */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Commercial Services in Simpsonville
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card padding="lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Icon name="Briefcase" className="text-blue-600" size={24} />
                  Office Build-Outs
                </h3>
                <p className="text-gray-700 mb-4">
                  Professional office construction for Simpsonville businesses: law offices, accounting firms, real estate brokerages, insurance agencies, and corporate spaces near Five Forks.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Private offices and conference rooms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Open workspace layouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Data/electrical infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>HVAC zoning for efficiency</span>
                  </li>
                </ul>
                <p className="text-sm font-semibold text-blue-600 mt-4">
                  Simpsonville pricing: $50-$75/sqft
                </p>
              </Card>

              <Card padding="lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Icon name="ShoppingBag" className="text-blue-600" size={24} />
                  Retail Upfits
                </h3>
                <p className="text-gray-700 mb-4">
                  Retail space renovations in Simpsonville Town Center, Main Street storefronts, and Five Forks retail centers. Boutiques, salons, specialty stores, and service businesses.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Storefront renovations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Display and merchandising areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Customer service counters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Back-office and storage space</span>
                  </li>
                </ul>
                <p className="text-sm font-semibold text-blue-600 mt-4">
                  Simpsonville pricing: $45-$85/sqft
                </p>
              </Card>

              <Card padding="lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Icon name="Heart" className="text-blue-600" size={24} />
                  Medical Office Renovations
                </h3>
                <p className="text-gray-700 mb-4">
                  Medical and dental office tenant improvements near Hillcrest Hospital and throughout Simpsonville. ADA-compliant layouts with specialized systems.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Exam room construction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Medical plumbing and sinks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>HIPAA-compliant layouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Waiting rooms and reception</span>
                  </li>
                </ul>
                <p className="text-sm font-semibold text-blue-600 mt-4">
                  Simpsonville pricing: $70-$110/sqft
                </p>
              </Card>

              <Card padding="lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Icon name="Coffee" className="text-blue-600" size={24} />
                  Restaurant Fit-Outs
                </h3>
                <p className="text-gray-700 mb-4">
                  Restaurant and food service space build-outs along Simpsonville's commercial corridors. Full commercial kitchen installation and health department coordination.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Commercial kitchen equipment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Hood systems and ventilation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>3-compartment sinks, grease traps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>Health department compliance</span>
                  </li>
                </ul>
                <p className="text-sm font-semibold text-blue-600 mt-4">
                  Simpsonville pricing: $85-$120/sqft
                </p>
              </Card>
            </div>
          </div>
        </Section>

        {/* Simpsonville Projects Showcase */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Recent Simpsonville Commercial Projects
            </h2>
            <div className="space-y-6">
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="Briefcase" className="text-blue-600 mt-1 shrink-0" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Law Office Build-Out - Grandview Drive</h3>
                    <p className="text-gray-700 mb-2">
                      2,800 sqft professional office space with 4 private offices, conference room, reception area, and breakroom. Complete electrical/data infrastructure, LED lighting, and commercial-grade carpet tile.
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        Grandview Drive, Simpsonville
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        Completed: October 2025
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        Timeline: 8 weeks
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="ShoppingBag" className="text-blue-600 mt-1 shrink-0" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Boutique Retail Upfit - Main Street</h3>
                    <p className="text-gray-700 mb-2">
                      1,400 sqft retail space renovation including new storefront, display fixtures, customer service counter, dressing rooms, and back-office area. Exposed ceiling with track lighting.
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        Main Street, Downtown Simpsonville
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        Completed: March 2025
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        Timeline: 6 weeks
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="Heart" className="text-blue-600 mt-1 shrink-0" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Medical Practice - Near Hillcrest</h3>
                    <p className="text-gray-700 mb-2">
                      3,200 sqft family practice build-out with 6 exam rooms, lab area, nurse station, reception, and waiting room. ADA-compliant design, specialized medical plumbing, and patient privacy considerations.
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        Near Hillcrest Hospital, Simpsonville
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        Completed: August 2024
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        Timeline: 12 weeks
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* Simpsonville-Specific Benefits */}
        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Simpsonville Businesses Choose Burch Contracting
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="MapPin" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Local Contractor - 10 Minutes from Simpsonville</h3>
                    <p className="text-gray-600">
                      Based in Gray Court, I'm on-site daily for Simpsonville commercial projects. Quick response times for meetings, inspections, and any issues that arise.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="Users" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Relationships with Simpsonville Property Managers</h3>
                    <p className="text-gray-600">
                      Pre-approved contractor for major property management firms active in Simpsonville. Familiar with local landlords and lease requirements.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="FileText" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Simpsonville Building Code Expertise</h3>
                    <p className="text-gray-600">
                      12 commercial projects in Simpsonville means I know local inspectors, understand municipal requirements, and coordinate permits efficiently.
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <Icon name="Clock" className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Minimal Disruption to Five Forks/Town Center Traffic</h3>
                    <p className="text-gray-600">
                      Experience working in active Simpsonville retail and office areas. I coordinate construction access and schedules to minimize impact on your neighbors.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* Calculator CTA */}
        <Section background="gray" padding="lg">
          <div className="max-w-3xl mx-auto">
            <Card padding="lg" className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center">
                <Icon name="Calculator" className="mx-auto text-blue-600 mb-4" size={48} />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Calculate Your Simpsonville Commercial Project Cost
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Get an instant estimate based on Simpsonville market rates and your project scope.
                </p>
                <Button href="/calculator/commercial-renovations" variant="primary" size="lg">
                  <Icon name="Calculator" size={20} />
                  Launch Free Calculator
                </Button>
              </div>
            </Card>
          </div>
        </Section>

        {/* Nearby Service Areas */}
        <Section background="white" padding="lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Also Serving Commercial Clients in Nearby Cities
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              I provide commercial tenant improvement services throughout Greenville County and surrounding areas.
            </p>
            <ClickableCityGrid columns={3} />
          </div>
        </Section>

        {/* Final CTA */}
        <Section background="gray" padding="lg">
          <div className="max-w-4xl mx-auto">
            <Card padding="lg" className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Simpsonville Commercial Project?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Free on-site consultation in Simpsonville. Detailed estimates. Local contractor with 35+ years experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button href="tel:8647244600" variant="primary" size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                  <Icon name="Phone" size={20} />
                  Call (864) 724-4600
                </Button>
                <Button href="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700">
                  <Icon name="Mail" size={20} />
                  Request Free Estimate
                </Button>
              </div>
              <p className="text-sm text-blue-200 mt-6">
                Serving Simpsonville businesses since 1995 • SC Licensed #CLG118679 • BBB A+ • 5.0 Google Rating
              </p>
            </Card>
          </div>
        </Section>
      </UniversalPageTemplate>
    </>
  );
}
