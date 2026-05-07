import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import Icon, { type IconName } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { businessConfig } from '@/config/business';
import Link from 'next/link';
import RecentProjectsSSR from '@/components/RecentProjectsSSR';
import { getServicesForPage, mapToBusinessConfigFormat } from '@/lib/services';
import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema, buildLocalBusinessSchema, buildOrganizationSchema, buildWebsiteSchema } from '@/lib/seo/schema';
import { localDominancePages } from '@/lib/seo/localDominanceData';
import CitiesGrid from '@/components/locations/CitiesGrid';
import { ClickableCityGrid } from '@/components/locations/ClickableCityGrid';
import { EEATSignals } from '@/components/seo/EEATSignals';
import Testimonials from '@/components/testimonials/Testimonials';
import { generateSampleTestimonials } from '@/lib/sampleData';
import { generateHowToSchema } from '@/lib/schema-builders';

export const metadata: Metadata = {
  title: 'Additions, Garages & Outdoor Living Contractor in Upstate SC | Burch Contracting',
  description:
    'Expert home addition contractor, garage builder, and outdoor living specialist in Upstate SC. Serving Simpsonville, Mauldin, Fountain Inn & Woodruff. Licensed, insured. Free estimates.',
  keywords: [
    'Upstate SC contractor',
    'garage contractor Upstate SC',
    'room addition contractor Upstate SC',
    'screened porch contractor Upstate SC',
    'deck builder Upstate SC',
  ],
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      'en-US': absoluteUrl('/'),
      'x-default': absoluteUrl('/'),
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Burch Contracting | Upstate SC Additions, Garages & Outdoor Living Contractor',
    description:
      'Upstate SC Additions, Garages & Outdoor Living Contractor.',
    url: absoluteUrl('/'),
    siteName: 'Burch Contracting',
    images: [
      {
        url: absoluteUrl(siteConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: 'Burch Contracting - Upstate SC garage, addition, screened porch, and deck contractor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burch Contracting | Upstate SC Garage & Addition Contractor',
    description: 'Free estimates from an Upstate SC garage, addition, screened porch, and deck contractor.',
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
};

export default async function HomePage() {
  // Fetch active services from database
  const dbServices = await getServicesForPage();
  const allServices = dbServices.length > 0 
    ? dbServices.map(mapToBusinessConfigFormat)
    : businessConfig.services;
  
  // Filter to only show core services (decks, porches, garages, additions)
  // Exclude: handyman, remodeling, basement, ADU
  const coreServiceSlugs = ['additions', 'decks', 'porches', 'screened-porches', 'garages', 'garage-builder', 'deck-builder', 'room-additions'];
  const services = allServices.filter(service => 
    coreServiceSlugs.includes(service.id) || 
    service.id === 'additions' // Keep the additions service as it covers multiple core services
  );

  const localBusinessSchema = buildLocalBusinessSchema({
    description:
      'Trusted Upstate SC Additions, Garages & Outdoor Living Contractor.',
  });

  const homeSchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [buildWebsiteSchema(), buildOrganizationSchema(), localBusinessSchema],
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
  ]);

  const featuredLocalPages = localDominancePages.slice(0, 10);
  const calculatorCards = [
    { title: 'Garage Build Budget', href: '/calculator/garages', icon: 'Warehouse' as const, text: 'Estimate attached and detached garage construction costs.' },
    { title: 'Room Addition Budget', href: '/calculator/room-additions', icon: 'Construction' as const, text: 'Plan square-foot expansion costs before design and permitting.' },
    { title: 'Deck and Porch Budget', href: '/calculator/decks-screened-porches', icon: 'Trees' as const, text: 'Model deck, composite, and screened porch investment ranges.' },
  ];

  return (
    <>
      <script
        id="home-schema-graph"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchemaGraph) }}
      />
      <script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateHowToSchema()) }}
      />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* SECTION 1 — HERO (ABOVE THE FOLD) */}
      <section className="relative overflow-hidden py-24 text-white md:py-40">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/public/basement-finishing.webp')" }}
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/85 via-slate-900/75 to-blue-950/60" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              aria-label="Upstate SC Additions, Garages & Outdoor Living Contractor"
            >
              Upstate SC Additions, Garages &amp; Outdoor Living Contractor
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto">
              SC Licensed General Contractor #CLG118679 | Serving Simpsonville, Mauldin, Fountain Inn & Woodruff with custom garages, home additions, decks, screened porches, remodeling, and light commercial upfits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="primary" size="lg" href="/contact" className="group shadow-2xl text-lg px-10 py-5">
                Get My Free Estimate
                <Icon name="ArrowRight" size={22} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" href="/projects" className="glass border-white/50 text-white hover:bg-white hover:text-gray-900 shadow-xl text-lg px-10 py-5">
                View Recent Projects
              </Button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm md:text-base text-gray-200">
              <div className="flex items-center gap-2">
                <Icon name="ShieldCheck" size={20} className="text-green-400" />
                <span className="font-medium">Licensed & Insured</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-2">
                <Icon name="Award" size={20} className="text-yellow-400" />
                <span className="font-medium">30+ Years Experience</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={20} className="text-blue-400" />
                <span className="font-medium">Local Contractor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E-E-A-T SIGNALS (Trust Badges) */}
      <section className="py-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EEATSignals variant="compact" />
        </div>
      </section>

      {/* SECTION 2 — CORE SERVICES (4 BLOCKS ONLY) */}
      <Section background="white" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Link href="/outdoor-living/decks" className="group block">
            <Card className="h-full text-center hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-600">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Icon name="Trees" size={40} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                Decks
              </h3>
              <p className="text-gray-600 mb-4">
                Custom wood and composite decks for outdoor living and entertaining
              </p>
              <div className="inline-flex items-center text-blue-600 font-semibold">
                Learn More
                <Icon name="ArrowRight" size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link href="/outdoor-living/screened-porches" className="group block">
            <Card className="h-full text-center hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-600">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <Icon name="Home" size={40} className="text-green-600 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                Screened Porches
              </h3>
              <p className="text-gray-600 mb-4">
                Bug-free outdoor comfort with aluminum screened porch construction
              </p>
              <div className="inline-flex items-center text-green-600 font-semibold">
                Learn More
                <Icon name="ArrowRight" size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link href="/garages" className="group block">
            <Card className="h-full text-center hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-600">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto bg-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <Icon name="Warehouse" size={40} className="text-orange-600 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                Garages
              </h3>
              <p className="text-gray-600 mb-4">
                Attached and detached garage construction for vehicle protection and storage
              </p>
              <div className="inline-flex items-center text-orange-600 font-semibold">
                Learn More
                <Icon name="ArrowRight" size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link href="/additions" className="group block">
            <Card className="h-full text-center hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-600">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <Icon name="Construction" size={40} className="text-purple-600 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                Home Additions
              </h3>
              <p className="text-gray-600 mb-4">
                Room additions and expansions that add valuable square footage to your home
              </p>
              <div className="inline-flex items-center text-purple-600 font-semibold">
                Learn More
                <Icon name="ArrowRight" size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>
      </Section>

      {/* SECTION 3 — WHY CHOOSE US */}
      <Section background="gray" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Homeowners Choose <span className="gradient-text">Burch Contracting</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <Icon name="Check" size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">30+ Years Experience in Upstate SC</h3>
                <p className="text-gray-600">Serving local homeowners since 1995 with proven expertise and craftsmanship</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <Icon name="Check" size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Local, Licensed & Insured Contractor</h3>
                <p className="text-gray-600">BBB A+ rating and fully insured for your complete protection</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <Icon name="Check" size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">No Shortcuts – Built to Last</h3>
                <p className="text-gray-600">Quality materials and proper construction methods, every time</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <Icon name="Check" size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Clear Pricing & Communication</h3>
                <p className="text-gray-600">Honest estimates and transparent communication throughout your project</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <Icon name="Check" size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Real Project Experience (Not Just Sales)</h3>
                <p className="text-gray-600">Working contractor who understands construction, not just selling it</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 4 — OUR SIMPLE PROCESS */}
      <Section background="white" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Simple Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From first contact to project completion, we make the process straightforward
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          <Card className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                1
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Request Your Free Estimate</h3>
            <p className="text-gray-600">
              Call us or fill out our contact form to get started
            </p>
          </Card>

          <Card className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                2
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">On-Site Visit & Project Review</h3>
            <p className="text-gray-600">
              We visit your property to understand your vision and site conditions
            </p>
          </Card>

          <Card className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                3
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Scope & Pricing</h3>
            <p className="text-gray-600">
              Receive a detailed estimate with transparent pricing and timeline
            </p>
          </Card>

          <Card className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                4
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Construction</h3>
            <p className="text-gray-600">
              We build your project with quality craftsmanship and attention to detail
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="primary" size="lg" href="/contact">
            <Icon name="Phone" size={20} />
            Schedule My Estimate
          </Button>
        </div>
      </Section>

      {/* SECTION 5 — FEATURED PROJECTS */}
      <RecentProjectsSSR />

      {/* SECTION 5.5 — TESTIMONIALS (NEW) */}
      <Section background="gray" padding="lg">
        <Testimonials 
          testimonials={generateSampleTestimonials(6)}
          title="What Our Customers Say"
          subtitle="Real feedback from real homeowners throughout Upstate SC"
          showSchema={true}
        />
      </Section>

      {/* SECTION 6 — SERVICE AREA (ENHANCED) */}
      <Section background="white" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Proudly Serving Upstate South Carolina
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted construction services throughout Greenville, Laurens, and Spartanburg Counties
          </p>
        </div>
        <ClickableCityGrid columns={3} compact={true} />
      </Section>

      {/* SECTION 7 — COST + VALUE HOOK */}
      <Section background="gray" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Does Your Project Cost?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use our planning calculators to get a realistic price range for your project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          <Card className="text-center">
            <div className="mb-4">
              <Icon name="Trees" size={40} className="text-blue-600 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Deck Calculator</h3>
            <p className="text-gray-600 mb-4">
              Estimate custom deck costs by size and material
            </p>
            <Button href="/calculator/decks" className="w-full">
              Calculate Deck Cost
            </Button>
          </Card>

          <Card className="text-center">
            <div className="mb-4">
              <Icon name="Warehouse" size={40} className="text-orange-600 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Garage Calculator</h3>
            <p className="text-gray-600 mb-4">
              Plan garage construction budget and options
            </p>
            <Button href="/calculator/garages" className="w-full">
              Calculate Garage Cost
            </Button>
          </Card>

          <Card className="text-center">
            <div className="mb-4">
              <Icon name="Home" size={40} className="text-green-600 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Porch Calculator</h3>
            <p className="text-gray-600 mb-4">
              Model screened porch investment ranges
            </p>
            <Button href="/calculator/decks-screened-porches" className="w-full">
              Calculate Porch Cost
            </Button>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="outline" href="/cost">
            View All Cost Guides
          </Button>
        </div>
      </Section>

      {/* SECTION 8 — FINAL CTA (CLOSING) */}
      <Section background="dark" padding="lg">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
            Get a clear estimate from a trusted local contractor
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="primary" size="lg" href="/contact" className="group shadow-2xl text-lg px-10 py-5">
              Get My Free Estimate
              <Icon name="ArrowRight" size={22} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3 text-gray-300">
            <Icon name="Phone" size={24} className="text-white" />
            <span className="text-xl">Call:</span>
            <a href={`tel:${businessConfig.contact.phone}`} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
              {businessConfig.contact.phone}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
