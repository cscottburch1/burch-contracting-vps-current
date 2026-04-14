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

export const metadata: Metadata = {
  title: 'Construction Renovations and Remodeling | Greenville County and Laurens County Contractor',
  description:
    'Burch is an Upstate SC garage, room addition, screened porch, and deck contractor offering free estimates and clear planning.',
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
    title: 'Burch | Upstate SC Garage, Room Addition & Porch Contractor',
    description:
      'Burch is an Upstate SC garage, room addition, screened porch, and deck contractor offering free estimates.',
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
  const services = dbServices.length > 0 
    ? dbServices.map(mapToBusinessConfigFormat)
    : businessConfig.services;

  const localBusinessSchema = buildLocalBusinessSchema({
    description:
      'Trusted Upstate South Carolina contractor for garages, room additions, screened porches, and decks with clear estimates.',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Home Improvement Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Garage Construction',
            description: 'Custom attached and detached garage construction with clear planning and pricing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Room Additions',
            description: 'Bedroom, family room, and flex-space additions built for long-term value',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Screened Porches',
            description: 'Low-maintenance aluminum screened porch construction for Upstate homes',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Deck Building',
            description: 'Custom wood and composite deck construction with code-ready details',
          },
        },
      ],
    },
  });

  const homeSchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [buildWebsiteSchema(), buildOrganizationSchema(), localBusinessSchema],
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What areas does Burch Contracting serve in South Carolina?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We proudly serve Simpsonville, Fountain Inn, Mauldin, Gray Court, Laurens, Woodruff, Clinton, Ora, and Joanna throughout the Upstate SC region."
        }
      },
      {
        "@type": "Question",
        "name": "Is Burch Contracting licensed and insured?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Burch Contracting is fully licensed and insured with an A+ BBB rating since 2014. We've been serving the Upstate SC area for over 30 years with professional, reliable service."
        }
      },
      {
        "@type": "Question",
        "name": "What types of home improvement services do you offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We specialize in garage construction, room additions, aluminum screened porches, and deck building for Upstate South Carolina homeowners."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer free estimates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We provide free, no-obligation estimates for all services. Contact us at (864) 724-4600 or through our website to schedule your free consultation."
        }
      },
      {
        "@type": "Question",
        "name": "How long does a typical kitchen remodel take in Simpsonville?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most kitchen remodels take 4-6 weeks depending on scope. A cabinet and countertop refresh takes 2-3 weeks, while a complete gut renovation takes 8-12 weeks. We provide detailed timelines during your free consultation."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer same-day handyman services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer same-day handyman service when you call by noon. Perfect for urgent repairs like door fixes, leaky faucets, drywall patches, and fixture installations throughout Simpsonville and surrounding areas."
        }
      }
    ]
  };

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
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <section className="relative overflow-hidden py-24 text-white md:py-40">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/projects/2-car-garage-concept-image.webp')" }}
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/72 via-slate-900/60 to-blue-950/50" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up"
              aria-label="Garage Builders, Room Additions, Screened Porches and Decks"
            >
              Garage Builders, Additions & <span className="gradient-text">Screened Porches and Decks</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed animate-fade-in-up stagger-1 opacity-0">
              Serving Simpsonville, Fountain Inn, Mauldin, Gray Court, Laurens, Woodruff, Clinton, Ora, and Joanna with clear estimates, better planning, and dependable craftsmanship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up stagger-2 opacity-0">
              <Button variant="primary" size="lg" href="/contact" className="group">
                Request Free Estimate
                <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="glass border-white/30 text-white hover:bg-white hover:text-gray-900">
                <Icon name="Phone" size={20} />
                {businessConfig.contact.phone}
              </Button>
              <Button variant="outline" size="lg" href="/locations" className="glass border-cyan-300/60 text-cyan-100 hover:bg-white hover:text-gray-900">
                <Icon name="MapPinned" size={20} />
                Browse Local Pages
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 md:gap-8 text-base animate-fade-in-up stagger-3 opacity-0">
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
                <div className="bg-blue-900 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs">
                  A+
                </div>
                <span className="font-medium">BBB A+ Rated</span>
              </div>
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
                <Icon name="Star" size={24} className="text-yellow-400" />
                <span className="font-medium">5.0 Google Rating</span>
              </div>
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
                <Icon name="ShieldCheck" size={24} className="text-green-400" />
                <span className="font-medium">30 Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="mb-16 grid gap-6 rounded-3xl bg-slate-950 p-8 text-white lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="mb-4 text-4xl font-bold">Free estimate planning for the projects homeowners ask about most</h2>
            <p className="max-w-2xl text-lg text-slate-300">
              Start with the service-location page that matches your project, then use a calculator to set expectations before you schedule a walkthrough.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {featuredLocalPages.slice(0, 4).map((page) => (
              <a
                key={page.slug}
                href={page.path}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-cyan-300 hover:bg-white/10"
              >
                <div className="text-sm uppercase tracking-wide text-cyan-200">{page.city?.displayName ?? 'Upstate SC'}</div>
                <div className="mt-1 font-semibold text-white">{page.h1}</div>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="gradient-text">{businessConfig.name}</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re committed to delivering exceptional service and quality workmanship on every project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {businessConfig.features.map((feature, index) => (
            <div key={feature.title} className={`animate-scale-in opacity-0 stagger-${index + 1}`}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon as IconName}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            High-value remodeling and outdoor living services tailored to how Upstate families actually live
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={service.id} className={`animate-fade-in-up opacity-0 stagger-${(index % 3) + 1} hover-lift`}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={<Icon name={service.icon as IconName} size={40} className="text-blue-600" />}
                href={`/services/${service.id}`}
                compact
              />
            </div>
          ))}
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Popular Remodeling Pages by City</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            These localized pages target the exact service and city combinations homeowners search before they call.
          </p>
        </div>

        <div className="mb-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredLocalPages.map((page) => (
            <Card key={page.slug} className="h-full">
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">{page.city?.displayName ?? 'Upstate SC'}</div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">{page.h1}</h3>
              <p className="mb-5 text-gray-600">{page.shortDescription}</p>
              <Button href={page.path}>View Local Guide</Button>
            </Card>
          ))}
        </div>

        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">Service Areas</span> We&apos;re Proud to Serve
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Delivering quality home services throughout the Upstate. Click on your city to learn more about our local expertise.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <Link href="/service-areas/simpsonville" className="group" aria-label="Simpsonville service area - Our home base">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-blue-600">
              <Icon name="MapPin" size={32} className="text-blue-600 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Simpsonville</h3>
              <p className="text-sm text-gray-600 mb-3">Our Home Base</p>
              <div className="flex items-center justify-center text-blue-600 text-sm font-semibold">
                Simpsonville Services
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </div>
          </Link>

          <Link href="/service-areas/greenville" className="group" aria-label="Greenville service area - Upstate&apos;s hub">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-green-600">
              <Icon name="MapPin" size={32} className="text-green-600 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Greenville</h3>
              <p className="text-sm text-gray-600 mb-3">Upstate&apos;s Hub</p>
              <div className="flex items-center justify-center text-green-600 text-sm font-semibold">
                Greenville Services
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </div>
          </Link>

          <Link href="/service-areas/five-forks" className="group" aria-label="Five Forks service area - Family friendly">
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-sky-600">
              <Icon name="MapPin" size={32} className="text-sky-600 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Five Forks</h3>
              <p className="text-sm text-gray-600 mb-3">Family Friendly</p>
              <div className="flex items-center justify-center text-sky-600 text-sm font-semibold">
                Five Forks Services
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </div>
          </Link>

          <Link href="/service-areas/woodruff" className="group" aria-label="Woodruff service area - Historic charm">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-orange-600">
              <Icon name="MapPin" size={32} className="text-orange-600 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Woodruff</h3>
              <p className="text-sm text-gray-600 mb-3">Historic Charm</p>
              <div className="flex items-center justify-center text-orange-600 text-sm font-semibold">
                Woodruff Services
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </div>
          </Link>

          <Link href="/service-areas/gray-court" className="group" aria-label="Gray Court service area - Rural living">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-teal-600">
              <Icon name="MapPin" size={32} className="text-teal-600 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Gray Court</h3>
              <p className="text-sm text-gray-600 mb-3">Rural Living</p>
              <div className="flex items-center justify-center text-teal-600 text-sm font-semibold">
                Gray Court Services
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </div>
          </Link>

          <Link href="/service-areas/fountain-inn" className="group">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-red-600">
              <Icon name="MapPin" size={32} className="text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Fountain Inn</h3>
              <p className="text-sm text-gray-600 mb-3">Historic Town</p>
              <div className="flex items-center justify-center text-red-600 text-sm font-semibold">
                Fountain Inn Services
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/service-areas/mauldin" className="group">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-cyan-600">
              <Icon name="MapPin" size={32} className="text-cyan-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Mauldin</h3>
              <p className="text-sm text-gray-600 mb-3">Established</p>
              <div className="flex items-center justify-center text-cyan-600 text-sm font-semibold">
                Mauldin Services
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/service-areas/laurens" className="group">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-amber-600">
              <Icon name="MapPin" size={32} className="text-amber-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Laurens</h3>
              <p className="text-sm text-gray-600 mb-3">County Seat</p>
              <div className="flex items-center justify-center text-amber-600 text-sm font-semibold">
                Laurens Services
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Serving the greater Greenville-Spartanburg area and surrounding communities
          </p>
          <Button variant="outline" href="/contact">
            <Icon name="Phone" size={20} />
            Call for Service Availability
          </Button>
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Project Cost Calculators</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Use local market pricing as a starting point, then request a site-specific estimate for accurate scope and scheduling.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="outline" href="/cost">Browse Cost Guides</Button>
          <Button variant="outline" href="/projects">Browse Project Spotlights</Button>
          <Button variant="outline" href="/blog">Read Planning Articles</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {calculatorCards.map((card) => (
            <Card key={card.href} className="h-full text-left">
              <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-3">
                <Icon name={card.icon} size={24} className="text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{card.title}</h3>
              <p className="mb-5 text-gray-600">{card.text}</p>
              <Button href={card.href}>Open Calculator</Button>
            </Card>
          ))}
        </div>
      </Section>

      {/* Recent Projects - Server-Side Rendered for full crawlability */}
      <RecentProjectsSSR />

      <Section background="white" padding="lg">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Don&apos;t just take our word for it - hear from homeowners we&apos;ve helped
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {/* BBB A+ Badge */}
            <a 
              href="https://www.bbb.org/us/sc/gray-court/profile/home-additions/burch-contracting-llc-0673-90007875"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white border-2 border-gray-200 rounded-lg px-6 py-4 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-2">
                <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  A+
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">A+ BBB</div>
                  <div className="text-xs text-gray-600">Rating Since 2014</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Google Reviews Badge */}
            <a 
              href="https://www.google.com/maps/place/Burch+Contracting/@34.6341746,-82.0744941,17z/data=!4m7!3m6!1s0x88578d1a6ee3c001:0x147295d161e89612!8m2!3d34.6341746!4d-82.0744941!16s%2Fg%2F11bbrjh0dt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white border-2 border-gray-200 rounded-lg px-6 py-4 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">5.0 Rating</div>
                  <div className="text-xs text-gray-600">Google Reviews</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {businessConfig.testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className={`animate-fade-in-up opacity-0 stagger-${index + 1} hover-lift`}>
              <TestimonialCard
                name={testimonial.name}
                location={testimonial.location}
                text={testimonial.text}
                rating={testimonial.rating}
                project={testimonial.project}
              />
            </div>
          ))}
        </div>

        {/* Google Reviews Embed */}
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">See All Our Google Reviews</h3>
              <p className="text-gray-600">Read what our customers are saying about their experience with Burch Contracting</p>
            </div>
            
            {/* Google Reviews iframe */}
            <div className="relative w-full overflow-hidden rounded-xl bg-white shadow-lg" style={{ minHeight: '450px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.6779645891234!2d-82.07669228475948!3d34.63417468045845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88578d1a6ee3c001%3A0x147295d161e89612!2sBurch%20Contracting!5e0!3m2!1sen!2sus!4v1735325000000!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Burch Contracting Google Reviews and Location"
              ></iframe>
            </div>
            
            <div className="mt-6 text-center">
              <a
                href="https://g.page/r/ERI2mdFh0pJE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Leave Us a Review on Google
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Get a free, no-obligation estimate for your home improvement project. We&apos;ll help you compare scope options, pricing tiers, and realistic timelines before work begins.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-1 opacity-0">
            <Button variant="primary" size="lg" href="/contact" className="group shadow-2xl">
              Get Your Free Estimate
              <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="border-white text-white hover:bg-white hover:text-gray-900 shadow-2xl">
              <Icon name="Phone" size={20} />
              Call Now
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
