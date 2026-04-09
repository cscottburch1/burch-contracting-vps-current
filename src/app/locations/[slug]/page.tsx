import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import {
  buildServiceContent,
  getServicePageBySlug,
  serviceLandingPages,
  type FaqItem,
} from '@/lib/seo/localSeoData';
import { costLandingPages } from '@/lib/seo/costSeoData';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
} from '@/lib/seo/schema';
import { isBrandedProjectImage } from '@/lib/seo/projectSpotlightsData';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import TrustBar from '@/components/TrustBar';

interface LocalServicePageProps {
  params: Promise<{ slug: string }>;
}

interface LocalTestimonial {
  quote: string;
  homeowner: string;
  neighborhood: string;
  projectType: string;
}

interface LocalProjectSnapshot {
  title: string;
  scope: string;
  timeline: string;
  image: string;
  imageAlt: string;
}

const cityLinks: Record<string, string> = {
  'Simpsonville SC': '/service-areas/simpsonville',
  'Fountain Inn SC': '/service-areas/fountain-inn',
  'Greenville SC': '/service-areas/greenville',
  'Greer SC': '/service-areas/greer',
  'Five Forks SC': '/service-areas/five-forks',
  'Mauldin SC': '/service-areas/mauldin',
  'Gray Court SC': '/service-areas/gray-court',
  'Woodruff SC': '/service-areas/woodruff',
  'Laurens SC': '/service-areas/laurens',
};

const serviceSlugs: Record<string, string> = {
  'Kitchen Remodeling': 'remodeling',
  'Bathroom Remodeling': 'remodeling',
  'Bath to Tile Shower Conversion': 'remodeling',
  'Room Additions': 'additions',
  'Deck Builder': 'additions',
  'Screened Porch Builder': 'additions',
  'Decks and Screened Porches': 'additions',
  'Basement Finishing': 'basement',
};

const calculatorLinks: Record<string, string> = {
  'Kitchen Remodeling': '/calculator/kitchen-remodeling',
  'Bathroom Remodeling': '/calculator/bathroom-remodeling',
  'Bath to Tile Shower Conversion': '/calculator/bathroom-remodeling',
  'Room Additions': '/calculator/room-additions',
  'Deck Builder': '/calculator/decks-screened-porches',
  'Screened Porch Builder': '/calculator/decks-screened-porches',
  'Decks and Screened Porches': '/calculator/decks-screened-porches',
  'Basement Finishing': '/calculator/basement-finishing',
};

function getGeoReferences(city: string) {
  const references: Record<string, string[]> = {
    'Simpsonville SC': ['Five Forks', 'Harrison Bridge', 'Downtown Simpsonville', 'Fairview Road corridor'],
    'Fountain Inn SC': ['Downtown Fountain Inn', 'Jones Mill Road corridor', 'Fairview area', 'growing residential neighborhoods near I-385'],
    'Greenville SC': ['North Main', 'Augusta Road', 'Downtown Greenville', 'Verdae corridor'],
    'Greer SC': ['Downtown Greer', 'Wade Hampton corridor', 'Brushy Creek', 'East Suber Road area'],
    'Five Forks SC': ['Five Forks Plantation', 'Heritage', 'Neely Farm', 'Woodruff Road corridor'],
    'Mauldin SC': ['Butler Road', 'East Butler corridor', 'Forrester area', 'Murray Drive neighborhoods'],
    'Gray Court SC': ['Town Center', 'Highway 14 corridor', 'Durbin Creek area', 'surrounding rural acreage'],
    'Woodruff SC': ['Downtown Woodruff', 'Cross Anchor Road area', 'Enoree corridor', 'growing residential neighborhoods'],
    'Laurens SC': ['Downtown Laurens', 'West Main corridor', 'Mill Village area', 'Lake Rabon vicinity'],
  };

  return references[city] ?? ['nearby neighborhoods', 'established residential areas', 'main commercial corridors', 'surrounding communities'];
}

function getTrustSignals(serviceName: string) {
  return [
    '30+ years serving Upstate South Carolina homeowners',
    'Licensed, insured, and BBB A+ rated',
    `Clear scope planning for ${serviceName.toLowerCase()} projects`,
    'Written estimates with realistic allowances and sequencing',
  ];
}

function getServiceFaqs(serviceName: string, city: string): FaqItem[] {
  const key = `${serviceName}|${city}`;

  const faqMap: Record<string, FaqItem[]> = {
    'Bathroom Remodeling|Simpsonville SC': [
      { question: 'What is the most common bathroom upgrade in Simpsonville homes?', answer: 'Most homeowners start with shower modernization, better lighting, and a vanity layout that improves storage. We usually phase these upgrades so families keep at least one usable bath during construction.' },
      { question: 'How long does a full primary bath remodel usually take?', answer: 'Most full primary bath remodels in Simpsonville run 3 to 6 weeks depending on tile complexity, fixture lead times, and whether plumbing locations change.' },
      { question: 'Can you plan around aging-in-place needs?', answer: 'Yes. We routinely plan curbless showers, grab-bar backing, safer flooring, and improved clearances while still keeping the space design-forward.' },
    ],
    'Kitchen Remodeling|Simpsonville SC': [
      { question: 'Do most Simpsonville kitchen projects require layout changes?', answer: 'Not always. Many successful projects keep core plumbing in place while improving workflow with better cabinet configuration, island planning, and storage upgrades.' },
      { question: 'What drives kitchen budget swings the most?', answer: 'Cabinet construction, countertop material, appliance package, and whether walls or utilities move are the largest cost drivers in most kitchen scopes.' },
      { question: 'Can we live in the home during construction?', answer: 'Usually yes. We set up a temporary kitchen zone, protect adjacent floors, and sequence disruptive tasks to keep daily life manageable.' },
    ],
    'Room Additions|Simpsonville SC': [
      { question: 'Do room additions require structural engineering?', answer: 'Some do, especially for larger spans, roofline changes, or complex tie-ins. We identify that early and include it in the planning phase.' },
      { question: 'How do you match an addition to the existing home?', answer: 'We plan roof transitions, exterior materials, trim proportions, and interior floor transitions so the addition feels original to the home.' },
      { question: 'Can additions be phased to spread budget?', answer: 'Yes. In many cases we phase interior finish upgrades after the core shell and utility work are complete to control budget timing.' },
    ],
    'Screened Porch Builder|Simpsonville SC': [
      { question: 'What makes screened porches comfortable in summer humidity?', answer: 'Cross-ventilation planning, correct fan placement, durable screen systems, and shade orientation all matter for comfort in Upstate humidity.' },
      { question: 'Can a screened porch be converted to a 3-season room later?', answer: 'Yes. We can frame with future upgrades in mind so enclosure options are easier if your needs change later.' },
      { question: 'How long does a typical screened porch build take?', answer: 'Most projects run 3 to 6 weeks depending on foundation work, roofing tie-ins, and finish complexity.' },
    ],
    'Deck Builder|Simpsonville SC': [
      { question: 'Should we choose pressure-treated or composite decking?', answer: 'Pressure-treated is budget-friendly upfront, while composite reduces long-term maintenance. We compare total ownership cost during planning.' },
      { question: 'Do you handle permits and inspections for deck work?', answer: 'Yes. We coordinate local permitting and inspections so framing, guards, and stair geometry are code-compliant.' },
      { question: 'Can you include lighting and privacy features?', answer: 'Absolutely. Many Simpsonville projects include post lighting, stair lights, privacy screens, and built-in seating.' },
    ],
    'Basement Finishing|Simpsonville SC': [
      { question: 'How do you handle moisture risk before finishing?', answer: 'We evaluate drainage, wall condition, humidity control, and insulation strategy before finalizing finish scope to protect long-term performance.' },
      { question: 'Can a basement include an office and media zone together?', answer: 'Yes. We commonly design multi-use layouts with acoustic planning, lighting zones, and flexible storage.' },
      { question: 'What inspections are typical for basement projects?', answer: 'Framing, electrical, plumbing (if included), and final inspections are common. We coordinate these with the local jurisdiction.' },
    ],
    'Bathroom Remodeling|Fountain Inn SC': [
      { question: 'What upgrades provide the strongest value in Fountain Inn bathrooms?', answer: 'Shower modernization, ventilation improvements, durable tile choices, and better vanity storage usually provide the best day-to-day and resale impact.' },
      { question: 'Can you complete a guest bath quickly?', answer: 'Yes. Guest bath refresh scopes are often completed in 2 to 3 weeks when major plumbing relocation is not required.' },
      { question: 'Do you provide material guidance before demolition?', answer: 'Yes. We lock in fixture and finish selections early to reduce schedule drift and avoid avoidable change orders.' },
    ],
    'Kitchen Remodeling|Fountain Inn SC': [
      { question: 'How do you improve kitchen flow without full structural changes?', answer: 'We often improve prep and storage zones with cabinet reconfiguration, appliance strategy, and better traffic paths while keeping major structure intact.' },
      { question: 'Are appliance lead times included in planning?', answer: 'Yes. We account for appliance and cabinet lead times upfront so the construction schedule is realistic.' },
      { question: 'Can you help compare finish tiers?', answer: 'Absolutely. We provide value, standard, and premium path comparisons so budget choices are easier before construction starts.' },
    ],
    'Room Additions|Fountain Inn SC': [
      { question: 'What are the first steps for planning a Fountain Inn room addition?', answer: 'We begin with site constraints, utility tie-in review, and layout goals so scope decisions are grounded in real conditions and budget targets.' },
      { question: 'Do additions require HVAC and electrical upgrades?', answer: 'In many projects, yes. We include HVAC and electrical integration planning early to avoid late-stage pricing surprises.' },
      { question: 'Can you keep disruption manageable while we stay in the home?', answer: 'Yes. We stage work, protect interior routes, and sequence tie-ins to reduce day-to-day disruption as much as possible.' },
    ],
    'Decks and Screened Porches|Fountain Inn SC': [
      { question: 'Can one project include both a deck and screened porch?', answer: 'Yes. Many Fountain Inn homeowners choose a combined layout for grilling, dining, and weather-protected seating in one coordinated build.' },
      { question: 'What details improve long-term durability?', answer: 'Proper flashing, moisture control at attachment points, code-correct guard details, and material-specific fasteners all improve long-term performance.' },
      { question: 'Do you offer low-maintenance finish options?', answer: 'Yes. We frequently specify composite decking, durable screen systems, and finish packages designed for lower upkeep.' },
    ],
    'Basement Finishing|Fountain Inn SC': [
      { question: 'What basement projects are most common in Fountain Inn?', answer: 'Rec rooms, guest suites, and office-flex layouts are most common, often paired with storage and utility-area upgrades.' },
      { question: 'How is basement budgeting handled for unknown conditions?', answer: 'We use layered estimates with contingency guidance so homeowners understand base scope, upgrades, and risk allowances before work begins.' },
      { question: 'Can basement work be staged over phases?', answer: 'Yes. We can phase finishes or specialty spaces to align with budget while preserving overall layout strategy.' },
    ],
  };

  return faqMap[key] ?? [
    { question: `How soon can ${serviceName.toLowerCase()} work begin in ${city}?`, answer: 'Most projects begin 2 to 6 weeks after design approval and material selections are finalized.' },
    { question: 'Do you provide written estimates and scope documentation?', answer: 'Yes. Proposals include scope, allowances, milestone timing, and payment structure for clear comparison.' },
    { question: 'Can Burch Contracting handle permitting and inspections?', answer: 'Yes. We support permitting and inspection coordination so work stays code-compliant and documented.' },
  ];
}

function getLocalTestimonials(serviceName: string, city: string): LocalTestimonial[] {
  const neighborhoodByCity: Record<string, string> = {
    'Simpsonville SC': 'Five Forks area',
    'Fountain Inn SC': 'Downtown Fountain Inn area',
    'Greenville SC': 'Augusta Road area',
    'Greer SC': 'Downtown Greer area',
    'Five Forks SC': 'Heritage area',
    'Mauldin SC': 'Butler Road area',
    'Gray Court SC': 'Highway 14 area',
    'Woodruff SC': 'Downtown Woodruff area',
    'Laurens SC': 'West Main area',
  };

  const byService: Record<string, Array<Omit<LocalTestimonial, 'neighborhood'>>> = {
    'Kitchen Remodeling': [
      { homeowner: 'Harrison Family', projectType: 'Kitchen Remodel', quote: 'We finally have a kitchen that flows for weeknights and entertaining. The planning process helped us avoid expensive last-minute decisions.' },
      { homeowner: 'Miller Home', projectType: 'Kitchen Update', quote: 'Communication was clear every week, and the final finish quality feels like a much higher price point.' },
    ],
    'Bathroom Remodeling': [
      { homeowner: 'Roberts Family', projectType: 'Primary Bath Remodel', quote: 'The new layout and storage solved issues we had lived with for years, and the project stayed organized from start to finish.' },
      { homeowner: 'Taylor Home', projectType: 'Guest Bath Refresh', quote: 'The team moved quickly, protected the rest of the house, and delivered exactly what we scoped.' },
    ],
    'Room Additions': [
      { homeowner: 'Nelson Family', projectType: 'Bedroom Addition', quote: 'Our addition looks original to the home, not tacked on. The schedule and milestone updates were easy to follow.' },
      { homeowner: 'Adams Home', projectType: 'Family Room Expansion', quote: 'We gained usable space without moving, and the scope guidance helped us prioritize the right upgrades.' },
    ],
    'Deck Builder': [
      { homeowner: 'Bryant Home', projectType: 'Composite Deck', quote: 'The layout feels custom to our yard, and the build quality gave us confidence from day one.' },
      { homeowner: 'Walker Family', projectType: 'Backyard Deck Build', quote: 'The team handled permitting and details professionally, and the result is our favorite part of the house.' },
    ],
    'Screened Porch Builder': [
      { homeowner: 'Evans Family', projectType: 'Screened Porch Build', quote: 'We use the porch almost every day now. Ventilation and fan placement made a big comfort difference.' },
      { homeowner: 'Carter Home', projectType: 'Outdoor Living Upgrade', quote: 'Great communication and clean execution. The porch feels like a true extension of our home.' },
    ],
    'Decks and Screened Porches': [
      { homeowner: 'Gibson Family', projectType: 'Deck and Porch Combo', quote: 'Combining both spaces was the right call. We got flexibility for weather and much better hosting space.' },
      { homeowner: 'Parker Home', projectType: 'Outdoor Room Project', quote: 'Durability details were explained clearly and the final result matches the plan exactly.' },
    ],
    'Basement Finishing': [
      { homeowner: 'Reed Family', projectType: 'Basement Finish', quote: 'Our basement now works as a media room and office zone with better lighting and storage than we expected.' },
      { homeowner: 'Morgan Home', projectType: 'Guest Suite Basement', quote: 'The phased planning made budgeting easier, and the workmanship has held up exceptionally well.' },
    ],
  };

  const neighborhood = neighborhoodByCity[city] ?? 'nearby neighborhood';
  const templates = byService[serviceName] ?? byService['Kitchen Remodeling'];

  return templates.map((item) => ({ ...item, neighborhood: `${neighborhood}, ${city}` }));
}

function getProjectSnapshots(serviceName: string, city: string): LocalProjectSnapshot[] {
  const cityToken = city.toLowerCase().replace(/\s+/g, '-');

  const fallback: LocalProjectSnapshot[] = [
    {
      title: `${serviceName} Planning Package`,
      scope: 'Scope, allowances, and sequence review before production start.',
      timeline: '2 to 4 week preconstruction planning',
      image: '/images/projects/placeholder.jpg',
      imageAlt: `${serviceName} planning in ${city}`,
    },
  ];

  const byService: Record<string, LocalProjectSnapshot[]> = {
    'Kitchen Remodeling': [
      {
        title: 'Family Kitchen Workflow Upgrade',
        scope: 'Cabinet reconfiguration, island optimization, and lighting plan updates.',
        timeline: '6 to 9 week construction window',
        image: '/og-image.jpg',
        imageAlt: `Kitchen remodeling project in ${city}`,
      },
      {
        title: 'Cabinet + Countertop Modernization',
        scope: 'New storage layout, countertop replacement, and fixture package.',
        timeline: '4 to 7 week construction window',
        image: '/og-image.jpg',
        imageAlt: `${cityToken} kitchen renovation planning snapshot`,
      },
    ],
    'Bathroom Remodeling': [
      {
        title: 'Primary Bath Comfort Upgrade',
        scope: 'Shower conversion, vanity improvements, and ventilation correction.',
        timeline: '3 to 6 week construction window',
        image: '/og-image.jpg',
        imageAlt: `Bathroom remodeling project in ${city}`,
      },
      {
        title: 'Guest Bath Refresh Scope',
        scope: 'Targeted layout, fixture, and finish updates for higher daily usability.',
        timeline: '2 to 4 week construction window',
        image: '/og-image.jpg',
        imageAlt: `${cityToken} bathroom renovation scope`,
      },
    ],
    'Room Additions': [
      {
        title: 'Bedroom + Flex Space Addition',
        scope: 'Foundation, framing, utility tie-ins, and complete interior finish package.',
        timeline: '10 to 16 week construction window',
        image: '/og-image.jpg',
        imageAlt: `Room addition project in ${city}`,
      },
      {
        title: 'Family Room Expansion',
        scope: 'Roof integration, HVAC extension, and finished living area expansion.',
        timeline: '9 to 14 week construction window',
        image: '/og-image.jpg',
        imageAlt: `${cityToken} home expansion planning`,
      },
    ],
    'Screened Porch Builder': [
      {
        title: 'Screened Porch Comfort Build',
        scope: 'Roofed porch enclosure, fan and lighting prep, and trim detailing.',
        timeline: '4 to 7 week construction window',
        image: '/og-image.jpg',
        imageAlt: `Screened porch project in ${city}`,
      },
      {
        title: 'Outdoor Seating Extension',
        scope: 'Traffic flow, screen durability upgrades, and weather-protected layout planning.',
        timeline: '3 to 6 week construction window',
        image: '/og-image.jpg',
        imageAlt: `${cityToken} screened porch layout`,
      },
    ],
    'Deck Builder': [
      {
        title: 'Composite Deck Entertaining Plan',
        scope: 'Deck framing, railing package, and integrated stair transitions.',
        timeline: '3 to 5 week construction window',
        image: '/og-image.jpg',
        imageAlt: `Deck project in ${city}`,
      },
      {
        title: 'Backyard Access Deck Upgrade',
        scope: 'Safer circulation, material durability, and low-maintenance detailing.',
        timeline: '2 to 4 week construction window',
        image: '/og-image.jpg',
        imageAlt: `${cityToken} deck build scope`,
      },
    ],
    'Decks and Screened Porches': [
      {
        title: 'Combined Deck + Screened Porch Plan',
        scope: 'Dual-zone outdoor living for cooking, dining, and weather-protected seating.',
        timeline: '5 to 9 week construction window',
        image: '/og-image.jpg',
        imageAlt: `Deck and screened porch project in ${city}`,
      },
      {
        title: 'Outdoor Room Durability Upgrade',
        scope: 'Moisture management details, improved circulation, and low-maintenance materials.',
        timeline: '4 to 8 week construction window',
        image: '/og-image.jpg',
        imageAlt: `${cityToken} outdoor living scope`,
      },
    ],
    'Basement Finishing': [
      {
        title: 'Multi-Use Basement Conversion',
        scope: 'Office + rec-room zoning with storage and code-compliant finish systems.',
        timeline: '7 to 12 week construction window',
        image: '/og-image.jpg',
        imageAlt: `Basement finishing project in ${city}`,
      },
      {
        title: 'Guest Suite Basement Planning',
        scope: 'Comfort upgrades, lighting strategy, and flexible living layout priorities.',
        timeline: '8 to 14 week construction window',
        image: '/og-image.jpg',
        imageAlt: `${cityToken} basement remodel planning`,
      },
    ],
  };

  return byService[serviceName] ?? fallback;
}

export async function generateStaticParams() {
  return serviceLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: LocalServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePageBySlug(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: absoluteUrl(`/locations/${page.slug}`) },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: absoluteUrl(`/locations/${page.slug}`),
      type: 'article',
      images: [{ url: absoluteUrl(siteConfig.defaultOgImage), width: 1200, height: 630, alt: page.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: [absoluteUrl(siteConfig.defaultOgImage)],
    },
  };
}

export default async function LocalServicePage({ params }: LocalServicePageProps) {
  const { slug } = await params;
  const page = getServicePageBySlug(slug);

  if (!page) {
    notFound();
  }

  const contentBlocks = buildServiceContent(page);
  const serviceSlug = serviceSlugs[page.serviceName] ?? 'services';
  const calculatorLink = calculatorLinks[page.serviceName] ?? '/contact';
  const areaLink = cityLinks[page.city] ?? '/services';
  const geoReferences = getGeoReferences(page.city);
  const trustSignals = getTrustSignals(page.serviceName);
  const uniqueFaqs = getServiceFaqs(page.serviceName, page.city);
  const localTestimonials = getLocalTestimonials(page.serviceName, page.city);
  const projectSnapshots = getProjectSnapshots(page.serviceName, page.city);
  const relatedPages = serviceLandingPages.filter((item) => item.city === page.city && item.slug !== page.slug).slice(0, 3);
  const relatedCostGuide = costLandingPages.find((item) => item.city === page.city && item.serviceName === page.serviceName);
  const relatedCityPages = serviceLandingPages.filter((item) => item.serviceName === page.serviceName && item.slug !== page.slug).slice(0, 3);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Locations', url: absoluteUrl('/locations') },
    { name: page.h1, url: absoluteUrl(`/locations/${page.slug}`) },
  ]);

  const serviceSchema = buildServiceSchema(page);
  const faqSchema = buildFaqSchema(uniqueFaqs);
  const localBusinessSchema = buildLocalBusinessSchema();

  return (
    <>
      <Script id={`local-service-breadcrumb-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id={`local-service-schema-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id={`local-service-faq-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id={`local-business-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_top_left,_white_0,_transparent_45%)]"></div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <Badge variant="blue" className="mb-5 inline-flex px-4 py-2 text-sm">
              {page.city} Remodeling and Outdoor Living
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">{page.h1}</h1>
            <p className="mb-8 text-lg text-blue-100 md:text-xl">{page.shortDescription}</p>
            <div className="mb-8 flex flex-wrap gap-3 text-sm text-blue-50">
              {geoReferences.map((item) => (
                <span key={item} className="rounded-full border border-white/20 bg-white/10 px-3 py-2">
                  Near {item}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" size="lg" href="/contact">
                <Icon name="ClipboardEdit" size={20} />
                Get Free Estimate
              </Button>
              <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-gray-900">
                <Icon name="Phone" size={20} />
                {siteConfig.phoneDisplay}
              </Button>
              <Button variant="outline" size="lg" href={calculatorLink} className="border-cyan-300 text-cyan-100 hover:bg-cyan-50 hover:text-blue-900">
                <Icon name="Calculator" size={20} />
                View Cost Calculator
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <Section background="white" padding="lg">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Planning {page.serviceName.toLowerCase()} in {page.city}</h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                {contentBlocks.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {page.cityContext && (
              <div className="rounded-2xl border-l-4 border-blue-600 bg-blue-50 p-6 space-y-5">
                <h2 className="text-2xl font-bold text-gray-900">Local Context for {page.city}</h2>
                <div>
                  <p className="text-gray-800 leading-relaxed">{page.cityContext.intro}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-white p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="ClipboardList" size={16} className="text-blue-600" />
                      <span className="text-xs font-bold uppercase tracking-wide text-blue-700">Permitting</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{page.cityContext.permittingNote}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="DollarSign" size={16} className="text-blue-600" />
                      <span className="text-xs font-bold uppercase tracking-wide text-blue-700">Pricing Nuance</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{page.cityContext.pricingNuance}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Clock" size={16} className="text-blue-600" />
                      <span className="text-xs font-bold uppercase tracking-wide text-blue-700">Timeline</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{page.cityContext.timelineNote}</p>
                  </div>
                </div>
              </div>
            )}

            <Card>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Typical Investment Ranges</h2>
              <p className="mb-4 text-sm text-gray-500">
                Based on current Simpsonville / Greenville County market rates. Each project may vary due to existing conditions, finish selections, and scope changes.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {page.priceRanges.map((range) => (
                  <div key={range.label} className="rounded-2xl border border-gray-200 p-5">
                    <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">{range.label}</div>
                    <div className="mt-2 text-xl font-bold leading-tight text-gray-900 sm:text-2xl [overflow-wrap:anywhere]">
                      {range.range.replace(/-/g, ' - ')}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{range.details}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Local Project Snapshots</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {projectSnapshots.map((snapshot) => (
                  <div key={snapshot.title} className="rounded-2xl border border-gray-200 overflow-hidden">
                    <div className={isBrandedProjectImage(snapshot.image) ? 'bg-white p-3' : ''}>
                      <Image
                        src={snapshot.image}
                        alt={snapshot.imageAlt}
                        width={960}
                        height={540}
                        className={isBrandedProjectImage(snapshot.image) ? 'h-40 w-full object-contain' : 'h-40 w-full object-cover'}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900">{snapshot.title}</h3>
                      <p className="mt-2 text-sm text-gray-700">{snapshot.scope}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-700">Typical timeline: {snapshot.timeline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Why Homeowners Call Burch Contracting</h2>
              <div className="space-y-3">
                {trustSignals.map((signal) => (
                  <div key={signal} className="flex gap-3 rounded-xl bg-blue-50 p-3 text-gray-700">
                    <Icon name="BadgeCheck" size={20} className="mt-0.5 text-blue-600" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Internal Links for Project Research</h2>
              <div className="space-y-3 text-sm">
                <a href={`/services/${serviceSlug}`} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Explore our main {page.serviceName.toLowerCase()} service page
                </a>
                <a href={areaLink} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Read our {page.city} service area page
                </a>
                <a href={calculatorLink} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Use the {page.serviceName.toLowerCase()} cost calculator
                </a>
                {relatedCostGuide ? (
                  <a href={`/cost/${relatedCostGuide.slug}`} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                    Read the {page.city} {page.serviceName.toLowerCase()} cost guide
                  </a>
                ) : null}
                {relatedCityPages.length > 0 && (
                  <>
                    <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Same Service, Other Cities</p>
                    {relatedCityPages.map((item) => (
                      <a key={item.slug} href={`/locations/${item.slug}`} className="block rounded-lg border border-gray-200 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                        {item.serviceName} in {item.city}
                      </a>
                    ))}
                  </>
                )}
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Recent Homeowner Feedback</h2>
              <div className="space-y-4">
                {localTestimonials.map((item) => (
                  <div key={`${item.homeowner}-${item.projectType}`} className="rounded-xl border border-gray-200 p-4">
                    <p className="text-gray-700">&ldquo;{item.quote}&rdquo;</p>
                    <div className="mt-3 text-sm font-semibold text-gray-900">{item.homeowner} - {item.projectType}</div>
                    <div className="text-xs uppercase tracking-wide text-blue-700">{item.neighborhood}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section background="blue" padding="md">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            Ready to plan your {page.serviceName.toLowerCase()} in {page.city}?
          </h2>
          <p className="mb-6 text-blue-100">
            Get a written estimate with scope, allowances, and a realistic timeline — no pressure, no obligation.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" href="/contact" className="bg-white text-blue-900 hover:bg-blue-50">
              <Icon name="ClipboardEdit" size={18} />
              Request Free Estimate
            </Button>
            <Button variant="outline" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-blue-900">
              <Icon name="Phone" size={18} />
              {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {uniqueFaqs.map((faq) => (
              <Card key={faq.question}>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{faq.question}</h3>
                <p className="leading-relaxed text-gray-700">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {relatedPages.length > 0 && (
        <Section background="white" padding="lg">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">More {page.city} planning guides</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {relatedPages.map((item) => (
                <Card key={item.slug}>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">{item.h1}</h3>
                  <p className="mb-5 text-gray-600">{item.shortDescription}</p>
                  <Button href={`/locations/${item.slug}`}>Read This Guide</Button>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Talk Through Your {page.city} Project</h2>
          <p className="mb-8 text-lg text-gray-300">
            If you are comparing timelines, design options, or budget ranges, we can help you narrow the scope before demolition starts.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" href="/contact">Request Free Estimate</Button>
            <Button variant="outline" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-gray-900">
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
