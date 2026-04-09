import type {
  AuthorityLink,
  BenefitCard,
  FaqItem,
  HighlightCard,
  RelatedLink,
  TargetCity,
} from '@/lib/seo/localDominanceData';
import { targetCities } from '@/lib/seo/localDominanceData';

export type RenovationServiceSlug = 'kitchen-remodeling' | 'bathroom-remodeling';

export interface RenovationCostRange {
  label: string;
  range: string;
  note: string;
}

export interface RenovationService {
  slug: RenovationServiceSlug;
  serviceName: string;
  navLabel: string;
  titleLabel: string;
  primaryKeywordBase: string;
  shortIntro: string;
  ctaSummary: string;
  designFocus: string[];
  materialFocus: string[];
  costRanges: RenovationCostRange[];
  processSteps: string[];
  authorityLinks: AuthorityLink[];
  imageAltBase: string;
}

export interface RenovationPageData {
  id: string;
  path: string;
  kind: 'renovation-service' | 'renovation-city';
  slug: string;
  city?: TargetCity;
  service: RenovationService;
  primaryKeyword: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  leadParagraphs: string[];
  whyChoose: BenefitCard[];
  designSection: {
    title: string;
    paragraphs: string[];
    bullets: string[];
  };
  finishesSection: {
    title: string;
    paragraphs: string[];
    bullets: string[];
  };
  costSection: {
    title: string;
    intro: string;
    ranges: RenovationCostRange[];
    summary: string;
  };
  timelineSection: {
    title: string;
    paragraphs: string[];
    bullets: string[];
  };
  permitsSection: {
    title: string;
    paragraphs: string[];
    bullets: string[];
  };
  projectHighlights: HighlightCard[];
  faqItems: FaqItem[];
  relatedLinks: RelatedLink[];
  authorityLinks: AuthorityLink[];
}

export interface HomeRenovationsHubData {
  path: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  introParagraphs: string[];
  serviceCards: Array<{
    title: string;
    href: string;
    description: string;
    bullets: string[];
  }>;
  whyChoose: BenefitCard[];
  cityCards: Array<{
    city: string;
    summary: string;
    kitchenHref: string;
    bathroomHref: string;
  }>;
  lightLinks: RelatedLink[];
}

export const renovationServices: RenovationService[] = [
  {
    slug: 'kitchen-remodeling',
    serviceName: 'Kitchen Remodeling',
    navLabel: 'Kitchen Remodeling',
    titleLabel: 'Kitchen Remodeling',
    primaryKeywordBase: 'kitchen remodeling',
    shortIntro:
      'We redesign kitchens for better flow, storage, lighting, and everyday usability with planning that stays grounded in budget and real construction details.',
    ctaSummary:
      'If your kitchen feels dated, cramped, or inefficient, we can map the right renovation scope, finish level, and schedule before construction begins.',
    designFocus: ['open-concept layout planning', 'island and peninsula redesign', 'appliance workflow updates', 'lighting and storage improvements'],
    materialFocus: ['semi-custom and custom cabinets', 'quartz and granite countertops', 'tile backsplash and durable flooring', 'sink, faucet, and finish package upgrades'],
    costRanges: [
      {
        label: 'Targeted Kitchen Update',
        range: '$20,000-$38,000',
        note: 'Cabinet refinishing or replacement, counters, backsplash, sink upgrades, and lighting improvements without major layout changes.',
      },
      {
        label: 'Full Kitchen Remodel',
        range: '$39,000-$75,000',
        note: 'New cabinetry, countertops, flooring, appliance configuration changes, and more complete electrical and plumbing coordination.',
      },
      {
        label: 'Custom Designer Kitchen',
        range: '$76,000-$140,000+',
        note: 'Structural layout work, premium appliances, custom millwork, upgraded lighting plans, and higher-end finish packages.',
      },
    ],
    processSteps: ['planning and measurements', 'design selections and allowances', 'demo and rough-in coordination', 'finish installation and walkthrough'],
    authorityLinks: [
      { label: 'NKBA kitchen planning resources', url: 'https://nkba.org/' },
      { label: 'South Carolina Contractor Licensing Board', url: 'https://llr.sc.gov/clb/' },
    ],
    imageAltBase: 'kitchen remodeling',
  },
  {
    slug: 'bathroom-remodeling',
    serviceName: 'Bathroom Remodeling',
    navLabel: 'Bathroom Remodeling',
    titleLabel: 'Bathroom Remodeling',
    primaryKeywordBase: 'bathroom remodeling',
    shortIntro:
      'We remodel bathrooms for better comfort, cleaner storage, and durable finishes while keeping plumbing, waterproofing, and scheduling under control.',
    ctaSummary:
      'From guest bath updates to full primary suite remodels, we help homeowners compare the right layout, finish package, and investment level early.',
    designFocus: ['shower and tub layout improvements', 'vanity and storage planning', 'lighting and ventilation upgrades', 'accessibility and aging-in-place options'],
    materialFocus: ['tile shower systems', 'vanities and countertop packages', 'waterproof flooring and trim details', 'glass, fixtures, and hardware selections'],
    costRanges: [
      {
        label: 'Cosmetic Bathroom Refresh',
        range: '$9,000-$16,000',
        note: 'Paint, fixtures, vanity, lighting, and flooring upgrades when plumbing locations stay mostly in place.',
      },
      {
        label: 'Mid-Range Full Bathroom Remodel',
        range: '$17,000-$32,000',
        note: 'New shower or tub, tile, vanity package, updated ventilation, and improved storage with stronger finish coordination.',
      },
      {
        label: 'Premium Bathroom Remodel',
        range: '$33,000-$65,000+',
        note: 'Custom tile shower systems, frameless glass, premium cabinetry, upgraded fixtures, and more involved plumbing or layout work.',
      },
    ],
    processSteps: ['scope and moisture review', 'fixture and tile selections', 'demo, waterproofing, and rough-in', 'finish installation and final punch list'],
    authorityLinks: [
      { label: 'EPA healthy indoor remodeling guidance', url: 'https://www.epa.gov/indoor-air-quality-iaq' },
      { label: 'South Carolina Contractor Licensing Board', url: 'https://llr.sc.gov/clb/' },
    ],
    imageAltBase: 'bathroom remodeling',
  },
];

const allRenovationCityNames = targetCities.map((city) => city.displayName).join(', ');

function buildCityMetaDescription(service: RenovationService, city: TargetCity) {
  const descriptions: Record<RenovationServiceSlug, string> = {
    'kitchen-remodeling': `Kitchen remodeling in ${city.displayName} by Burch Contracting. Smart layouts, trusted craftsmanship, clear pricing, and free estimates. Call today.`,
    'bathroom-remodeling': `Bathroom remodeling in ${city.displayName} by Burch Contracting. Durable finishes, trusted workmanship, clear pricing, and free estimates.`,
  };

  return descriptions[service.slug];
}

function buildServiceMetaDescription(service: RenovationService) {
  const descriptions: Record<RenovationServiceSlug, string> = {
    'kitchen-remodeling': 'Kitchen remodeling in Simpsonville and Upstate SC by Burch Contracting. Custom layouts, clear pricing, trusted craftsmanship, and free estimates.',
    'bathroom-remodeling': 'Bathroom remodeling in Simpsonville and Upstate SC by Burch Contracting. Durable finishes, clear pricing, trusted workmanship, and free estimates.',
  };

  return descriptions[service.slug];
}

function buildHubCardDescription(service: RenovationService) {
  return service.slug === 'kitchen-remodeling'
    ? 'Plan a smarter kitchen layout with upgraded cabinetry, counters, lighting, and a realistic remodeling budget.'
    : 'Upgrade comfort and resale value with better shower systems, vanities, tile details, and a cleaner bathroom plan.';
}

function buildWhyChoose(service: RenovationService, city?: TargetCity): BenefitCard[] {
  const locationText = city ? city.displayName : 'Simpsonville and the Upstate';

  return [
    {
      title: `Why homeowners in ${city?.name ?? 'the Upstate'} choose us`,
      text: `We plan ${service.navLabel.toLowerCase()} around how the home is actually used, the real site conditions, and the budget decisions that matter most in ${locationText}.`,
    },
    {
      title: 'Clear scope and allowances',
      text: 'You get realistic pricing ranges, written scope guidance, and a smoother decision-making process before production starts.',
    },
    {
      title: 'Local remodeling experience',
      text: city
        ? `We understand how property age, neighborhood standards, county review, and scheduling affect ${service.navLabel.toLowerCase()} in ${city.displayName}.`
        : `We build across ${allRenovationCityNames} with location-specific planning rather than one-size-fits-all remodeling copy.`,
    },
    {
      title: 'Fast lead-to-estimate support',
      text: 'Free estimates, click-to-call access, and practical next-step advice help homeowners move from research into a real project plan quickly.',
    },
  ];
}

function buildDesignSection(service: RenovationService, city?: TargetCity) {
  const locationText = city?.displayName ?? 'Simpsonville and Upstate SC';

  return {
    title: `Design & layout options for ${service.navLabel.toLowerCase()} in ${locationText}`,
    paragraphs: service.slug === 'kitchen-remodeling'
      ? [
          `Kitchen remodeling in ${locationText} usually starts with layout clarity: where prep happens, how traffic moves, whether an island fits, and what storage problems need to be solved first. We help homeowners compare simple refresh options against more ambitious redesigns so the plan matches the way the kitchen is actually used every day.`,
          `That design-first approach keeps the renovation grounded. Instead of jumping straight to finishes, we look at workflow, appliance placement, pantry access, lighting, and how the kitchen connects to nearby living spaces before the budget is finalized.`,
        ]
      : [
          `Bathroom remodeling in ${locationText} works best when comfort, storage, ventilation, and waterproofing are planned together. We help homeowners compare tub-to-shower conversions, vanity upgrades, tile layouts, and accessibility improvements before production begins.`,
          `That keeps the scope practical. The right bathroom plan balances visual upgrades with durable construction details so the finished room is easier to maintain and more comfortable to use long after the project wraps up.`,
        ],
    bullets: service.designFocus,
  };
}

function buildFinishesSection(service: RenovationService, city?: TargetCity) {
  const locationText = city?.displayName ?? 'the Upstate';

  return {
    title: service.slug === 'kitchen-remodeling' ? 'Cabinets, countertops & flooring' : 'Showers, vanities & tile',
    paragraphs: service.slug === 'kitchen-remodeling'
      ? [
          `Material selections drive a large share of the kitchen remodeling budget in ${locationText}. Cabinet line, countertop material, backsplash scope, sink choices, flooring durability, and lighting details all influence both cost and long-term value.`,
          `We guide those decisions in the right order so you can see what truly changes the price and what simply improves the finished look. That helps homeowners avoid overspending on the wrong items while still getting a kitchen that feels custom and complete.`,
        ]
      : [
          `Bathroom remodeling costs in ${locationText} often swing on shower system complexity, waterproofing method, tile coverage, vanity package, and fixture quality. We compare those finish options with durability and maintenance in mind, not just style.`,
          `That means your bathroom can look better and hold up longer. We help homeowners balance moisture control, storage, accessibility, and design so the finished room feels polished instead of pieced together.`,
        ],
    bullets: service.materialFocus,
  };
}

function buildCostSection(service: RenovationService, city?: TargetCity) {
  const locationText = city?.name ?? 'Simpsonville';

  return {
    title: `Cost of ${service.serviceName} in ${locationText}`,
    intro:
      service.slug === 'kitchen-remodeling'
        ? `Kitchen remodeling cost depends on cabinet scope, countertop material, appliance changes, electrical updates, and whether the layout stays mostly in place or gets reworked. We outline those ranges clearly so the estimate is useful before decisions are locked in.`
        : `Bathroom remodeling cost depends on shower or tub scope, tile coverage, waterproofing, plumbing changes, vanity package, and fixture quality. We explain the biggest price drivers early so you can budget with more confidence.`,
    ranges: service.costRanges,
    summary: `Every estimate includes written scope guidance, practical allowances, and notes on what can move the final investment up or down in ${city?.displayName ?? 'Simpsonville and surrounding Upstate communities'}.`,
  };
}

function buildTimelineSection(service: RenovationService, city?: TargetCity) {
  const locationText = city?.displayName ?? 'Simpsonville and the Upstate';

  return {
    title: 'How long does a remodel take?',
    paragraphs: service.slug === 'kitchen-remodeling'
      ? [
          `Most kitchen remodeling projects in ${locationText} move through planning, selections, demo, rough-ins, installation, and finish work over several coordinated stages. Simpler upgrades can wrap faster, while structural changes and custom materials naturally extend the schedule.`,
          `We keep the timeline cleaner by making the key scope and allowance decisions early. That reduces surprises, helps trades stay coordinated, and gives homeowners a clearer path from estimate to production.`,
        ]
      : [
          `Bathroom remodeling timelines in ${locationText} depend on the amount of demo, the waterproofing system, tile scope, plumbing changes, and product lead times. Guest bath refreshes move faster than full primary suite transformations with custom shower work.`,
          `We plan the schedule around material readiness, inspections, and clean sequencing so the project can move from demolition into finished details with fewer avoidable delays.`,
        ],
    bullets: service.processSteps,
  };
}

function buildPermitsSection(service: RenovationService, city?: TargetCity) {
  const locationName = city?.displayName ?? 'Simpsonville, SC';
  const permitOffice = city?.permitOffice ?? 'local permitting and inspections offices';

  return {
    title: `Permits in ${locationName}`,
    paragraphs: [
      `${service.serviceName} in ${locationName} may require permitting when electrical, plumbing, structural, or layout changes reach beyond simple finish replacements. We review that scope early so homeowners know what documentation and inspections may be involved.`,
      `For projects in ${locationName}, we help plan around ${permitOffice} and the practical code steps that keep the job documented, buildable, and easier to schedule.`,
    ],
    bullets: ['electrical and plumbing changes', 'structural or framing updates', 'inspection coordination', 'code-ready scope planning'],
  };
}

function buildProjectHighlights(service: RenovationService, city: TargetCity): HighlightCard[] {
  return city.proofNotes.map((note, index) => ({
    title: `${city.name} ${service.serviceName} Project ${index + 1}`,
    summary: note,
    image: '/basement-finishing.webp',
    alt: `${service.imageAltBase} ${city.name} SC`,
  }));
}

function buildCityFaqs(service: RenovationService, city: TargetCity): FaqItem[] {
  return [
    {
      question: `How much does ${service.serviceName.toLowerCase()} cost in ${city.displayName}?`,
      answer: `Cost depends on scope, finish level, trade complexity, and whether layout changes are involved. We provide a written estimate with realistic allowances so homeowners in ${city.displayName} can compare options clearly.`,
    },
    {
      question: `How long does ${service.serviceName.toLowerCase()} take in ${city.displayName}?`,
      answer: `Timeline depends on product lead times, permit needs, and how involved the demolition and finish work will be. We outline the critical path before production starts so you know what affects the schedule.`,
    },
    {
      question: `Do you help with permits for ${service.serviceName.toLowerCase()} in ${city.displayName}?`,
      answer: `Yes. We help plan around local review requirements, inspection sequencing, and practical site conditions so the work stays documented and code-ready.`,
    },
    {
      question: `Can I get a free estimate for ${service.primaryKeywordBase} ${city.name} SC?`,
      answer: 'Yes. Use the quick form or click-to-call button to request pricing guidance, timeline expectations, and next-step recommendations for your project.',
    },
  ];
}

function buildServiceFaqs(service: RenovationService): FaqItem[] {
  return [
    {
      question: `What areas do you serve for ${service.serviceName.toLowerCase()}?`,
      answer: `We currently prioritize ${allRenovationCityNames} with city-specific remodeling pages and free estimate support.`,
    },
    {
      question: `Do you provide written estimates and scope guidance?`,
      answer: 'Yes. Every proposal includes scope notes, pricing guidance, and timeline expectations so you can compare remodeling options with confidence.',
    },
    {
      question: `Can you help with permits and inspection planning?`,
      answer: 'Yes. We review when permits may apply, how inspections affect the schedule, and which decisions should be resolved before production begins.',
    },
    {
      question: `How do you keep remodeling aligned with budget and resale value?`,
      answer: 'We focus on layout function first, practical allowances, and finish selections that improve everyday use without overspending on the wrong upgrades.',
    },
  ];
}

function buildCityPage(city: TargetCity, service: RenovationService): RenovationPageData {
  const primaryKeyword = `${service.primaryKeywordBase} ${city.name} SC`;

  return {
    id: `${city.slug}-${service.slug}`,
    path: `/${city.slug}/${service.slug}`,
    kind: 'renovation-city',
    slug: `${city.slug}-${service.slug}`,
    city,
    service,
    primaryKeyword,
    h1: `${service.serviceName} in ${city.displayName}`,
    metaTitle: `${service.titleLabel} in ${city.displayName} | Burch Contracting`,
    metaDescription: buildCityMetaDescription(service, city),
    shortDescription: `${service.serviceName} for ${city.displayName} homeowners who need trusted local planning, clear pricing, and a free estimate.`,
    leadParagraphs: [
      `${service.serviceName} in ${city.displayName} should start with a plan that fits the home, the neighborhood, and the budget. Burch Contracting helps local homeowners compare scope, finishes, timeline, and permit considerations before construction begins so the project stays grounded from the start.`,
      `${service.shortIntro} In ${city.name}, we regularly see questions about cost, schedule, design choices, and how much disruption a remodel will create while the family continues living in the home. This page addresses those questions directly with city-specific guidance and strong conversion paths.`,
      `${city.intro} From ${city.neighborhoods.join(', ')}, remodeling goals often come down to better function, better storage, and better long-term value. We shape the scope around those realities instead of pushing a generic plan.`,
    ],
    whyChoose: buildWhyChoose(service, city),
    designSection: buildDesignSection(service, city),
    finishesSection: buildFinishesSection(service, city),
    costSection: buildCostSection(service, city),
    timelineSection: buildTimelineSection(service, city),
    permitsSection: buildPermitsSection(service, city),
    projectHighlights: buildProjectHighlights(service, city),
    faqItems: buildCityFaqs(service, city),
    relatedLinks: [],
    authorityLinks: [{ label: city.permitOffice, url: city.permitUrl }, ...service.authorityLinks],
  };
}

function buildServicePage(service: RenovationService): RenovationPageData {
  const primaryKeyword = `${service.primaryKeywordBase} Simpsonville SC`;

  return {
    id: service.slug,
    path: `/${service.slug}`,
    kind: 'renovation-service',
    slug: service.slug,
    service,
    primaryKeyword,
    h1: `${service.serviceName} in Simpsonville & Upstate SC`,
    metaTitle: `${service.titleLabel} in Simpsonville & Upstate SC | Burch Contracting`,
    metaDescription: buildServiceMetaDescription(service),
    shortDescription: `${service.serviceName} across Simpsonville, Fountain Inn, Mauldin, Gray Court, Laurens, Woodruff, Clinton, Ora, and Joanna.`,
    leadParagraphs: [
      `${primaryKeyword} is the focus of this page, but the work itself serves homeowners across the Upstate. This service hub gives kitchen and bathroom prospects a clean path from one primary search term into the exact city page that matches their project.`,
      `${service.shortIntro} Every estimate starts with scope clarity, design priorities, cost ranges, and practical recommendations on what to tackle first so the remodel feels intentional instead of reactive.`,
      `We currently prioritize Simpsonville, Fountain Inn, Mauldin, Gray Court, Laurens, Woodruff, Clinton, Ora, and Joanna with dedicated city pages for ${service.serviceName.toLowerCase()}. That separate silo structure helps the site rank for interior renovation intent without disrupting the existing garage, deck, porch, and addition hierarchy.`,
    ],
    whyChoose: buildWhyChoose(service),
    designSection: buildDesignSection(service),
    finishesSection: buildFinishesSection(service),
    costSection: buildCostSection(service),
    timelineSection: buildTimelineSection(service),
    permitsSection: buildPermitsSection(service),
    projectHighlights: targetCities.slice(0, 3).map((city, index) => ({
      title: `${city.name} ${service.serviceName}`,
      summary: city.proofNotes[index] ?? city.proofNotes[0],
      image: '/basement-finishing.webp',
      alt: `${service.imageAltBase} ${city.name} SC`,
    })),
    faqItems: buildServiceFaqs(service),
    relatedLinks: [],
    authorityLinks: service.authorityLinks,
  };
}

function buildCityRelatedLinks(page: RenovationPageData): RelatedLink[] {
  if (!page.city) {
    return [];
  }

  const nearbyCityLinks = targetCities
    .filter((city) => city.slug !== page.city?.slug)
    .slice(0, 3)
    .map((city) => ({
      label: `${page.service.serviceName} in ${city.displayName}`,
      href: `/${city.slug}/${page.service.slug}`,
      description: `Compare ${page.service.serviceName.toLowerCase()} planning details for ${city.displayName}.`,
    }));

  return [
    {
      label: `${page.service.serviceName} service page`,
      href: `/${page.service.slug}`,
      description: `Review the main ${page.service.serviceName.toLowerCase()} page and cost overview.`,
    },
    ...nearbyCityLinks,
    {
      label: 'Home Renovations hub',
      href: '/home-renovations',
      description: 'Browse the full kitchen and bathroom remodeling SEO silo.',
    },
    {
      label: 'Main service hub',
      href: '/services',
      description: 'See the broader Burch Contracting service structure without leaving this silo completely disconnected.',
    },
  ];
}

function buildServiceRelatedLinks(page: RenovationPageData): RelatedLink[] {
  return [
    ...targetCities.map((city) => ({
      label: `${page.service.serviceName} in ${city.displayName}`,
      href: `/${city.slug}/${page.service.slug}`,
      description: `Go straight to the ${city.displayName} page for ${page.service.serviceName.toLowerCase()}.`,
    })),
    {
      label: 'Home Renovations hub',
      href: '/home-renovations',
      description: 'Return to the main home renovations hub page.',
    },
    {
      label: 'Main service hub',
      href: '/services',
      description: 'Lightly connect this silo to the broader service structure.',
    },
  ];
}

const baseRenovationCityPages = targetCities.flatMap((city) => renovationServices.map((service) => buildCityPage(city, service)));
const baseRenovationServicePages = renovationServices.map((service) => buildServicePage(service));

export const renovationCityPages: RenovationPageData[] = baseRenovationCityPages.map((page) => ({
  ...page,
  relatedLinks: buildCityRelatedLinks(page),
}));

export const renovationServicePages: RenovationPageData[] = baseRenovationServicePages.map((page) => ({
  ...page,
  relatedLinks: buildServiceRelatedLinks(page),
}));

export const homeRenovationsHub: HomeRenovationsHubData = {
  path: '/home-renovations',
  h1: 'Home Renovations in Simpsonville, SC',
  metaTitle: 'Home Renovations in Simpsonville, SC | Burch Contracting',
  metaDescription:
    'Home renovations in Simpsonville, SC by Burch Contracting. Explore kitchen and bathroom remodeling, trusted craftsmanship, and free estimates.',
  introParagraphs: [
    'This new home renovations silo is built specifically for interior remodeling intent and lead generation. It gives kitchen and bathroom prospects a focused path without disrupting the existing garage, deck, porch, and exterior service hierarchy.',
    'Use this hub to compare kitchen remodeling and bathroom remodeling, then jump to the exact city page that matches your project. Every page includes one primary keyword target, local references, CTAs, schema, and internal links that stay inside the renovation silo first.',
  ],
  serviceCards: renovationServices.map((service) => ({
    title: service.serviceName,
    href: `/${service.slug}`,
    description: buildHubCardDescription(service),
    bullets: service.slug === 'kitchen-remodeling'
      ? ['design & layout options', 'cabinet, countertop, and flooring upgrades', 'cost ranges and timelines']
      : ['shower, vanity, and tile upgrades', 'waterproofing and ventilation details', 'cost ranges and timelines'],
  })),
  whyChoose: [
    {
      title: 'Separated renovation SEO structure',
      text: 'This silo keeps interior remodeling keywords isolated from the existing exterior and addition service pages so search intent stays cleaner and more focused.',
    },
    {
      title: 'Local authority across target cities',
      text: `We now support renovation intent across ${allRenovationCityNames} with city-specific kitchen and bathroom pages tied together through a structured internal-link web.`,
    },
    {
      title: 'Lead-generation ready content',
      text: 'Every page includes a top CTA, click-to-call button, short estimate form, and trust-building content around cost, schedule, permits, and local fit.',
    },
    {
      title: 'Light connection to the main site',
      text: 'The silo remains separate but still links lightly to the broader service and location structure so users can move through the site naturally.',
    },
  ],
  cityCards: targetCities.map((city) => ({
    city: city.displayName,
    summary: city.intro,
    kitchenHref: `/${city.slug}/kitchen-remodeling`,
    bathroomHref: `/${city.slug}/bathroom-remodeling`,
  })),
  lightLinks: [
    { label: 'Main service hub', href: '/services', description: 'Browse the broader contractor services offered by Burch Contracting.' },
    { label: 'Local pages hub', href: '/locations', description: 'View the existing city-and-service content structure outside this renovation silo.' },
  ],
};

export function getRenovationServicePage(slug: string) {
  return renovationServicePages.find((page) => page.slug === slug);
}

export function getRenovationCityPage(citySlug: string, serviceSlug: string) {
  return renovationCityPages.find((page) => page.city?.slug === citySlug && page.service.slug === serviceSlug);
}
