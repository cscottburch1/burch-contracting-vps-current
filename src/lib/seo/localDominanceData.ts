export type TargetCitySlug =
  | 'simpsonville-sc'
  | 'fountain-inn-sc'
  | 'mauldin-sc'
  | 'gray-court-sc'
  | 'laurens-sc'
  | 'woodruff-sc'
  | 'clinton-sc'
  | 'ora-sc'
  | 'joanna-sc';

export type TargetServiceSlug =
  | 'garage-builder'
  | 'room-additions'
  | 'screened-porches'
  | 'deck-builder'
  | 'adu-builder';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AuthorityLink {
  label: string;
  url: string;
}

export interface TargetCity {
  slug: TargetCitySlug;
  name: string;
  displayName: string;
  county: string;
  permitOffice: string;
  permitUrl: string;
  neighborhoods: string[];
  intro: string;
  proofNotes: string[];
  timelineNote: string;
}

export interface TargetService {
  slug: TargetServiceSlug;
  serviceName: string;
  navLabel: string;
  h1Label: string;
  titleLabel: string;
  primaryKeywordBase: string;
  shortIntro: string;
  ctaSummary: string;
  deliverables: string[];
  costFactors: string[];
  authorityLinks: AuthorityLink[];
  imageAltBase: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export interface HighlightCard {
  title: string;
  summary: string;
  image: string;
  alt: string;
}

export interface BenefitCard {
  title: string;
  text: string;
}

export interface SeoLandingPageData {
  id: string;
  path: string;
  kind: 'service-hub' | 'city-service';
  slug: string;
  city?: TargetCity;
  service: TargetService;
  primaryKeyword: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  leadParagraphs: string[];
  whyChoose: BenefitCard[];
  planningSection: {
    title: string;
    paragraphs: string[];
    bullets: string[];
  };
  localExperienceSection: {
    title: string;
    paragraphs: string[];
  };
  projectHighlights: HighlightCard[];
  faqItems: FaqItem[];
  relatedLinks: RelatedLink[];
  authorityLinks: AuthorityLink[];
}

export const targetCities: TargetCity[] = [
  {
    slug: 'simpsonville-sc',
    name: 'Simpsonville',
    displayName: 'Simpsonville, SC',
    county: 'Greenville County',
    permitOffice: 'City of Simpsonville / Greenville County Planning & Code Compliance',
    permitUrl: 'https://www.greenvillecounty.org/PlanningAndCodeCompliance/',
    neighborhoods: ['Five Forks', 'Downtown Simpsonville', 'Harrison Bridge Road', 'Fairview Road corridor'],
    intro:
      'Simpsonville homeowners typically want added square footage and outdoor living that feels original to the home, not like a rushed add-on. We plan around HOA reviews, drainage, and fast-moving neighborhood resale expectations from the start.',
    proofNotes: [
      'Detached two-car garage planning near Five Forks with attic storage and upgraded slab prep.',
      'Family room and bedroom expansion scope framed around Fairview Road lot setbacks and utility tie-ins.',
      'Outdoor living layouts designed for shaded afternoon use in neighborhoods along Harrison Bridge Road.',
    ],
    timelineNote:
      'Spring projects in Simpsonville move fastest when HOA review and permit prep begin before material selections are finalized.',
  },
  {
    slug: 'fountain-inn-sc',
    name: 'Fountain Inn',
    displayName: 'Fountain Inn, SC',
    county: 'Greenville County',
    permitOffice: 'City of Fountain Inn / Greenville County building review',
    permitUrl: 'https://www.fountaininn.org/',
    neighborhoods: ['Downtown Fountain Inn', 'Jones Mill Road corridor', 'Highway 418 growth area', 'I-385 residential neighborhoods'],
    intro:
      'Fountain Inn has a mix of established homes near downtown and new subdivisions closer to I-385, which means every project needs a site-specific plan for setbacks, access, and long-term value. We keep the scope practical, code-ready, and tied to how the property is actually used.',
    proofNotes: [
      'Garage and workshop concepts for larger rear lots near Jones Mill Road.',
      'Outdoor living upgrades for newer family neighborhoods off Highway 418.',
      'Guest house and addition layouts that keep construction disruption manageable while the family stays in the home.',
    ],
    timelineNote:
      'Fountain Inn scopes usually benefit from early material ordering because outdoor and addition work spikes heavily before summer.',
  },
  {
    slug: 'mauldin-sc',
    name: 'Mauldin',
    displayName: 'Mauldin, SC',
    county: 'Greenville County',
    permitOffice: 'City of Mauldin building and code review',
    permitUrl: 'https://cityofmauldin.org/',
    neighborhoods: ['Butler Road', 'East Butler corridor', 'BridgeWay Station area', 'Murray Drive neighborhoods'],
    intro:
      'Mauldin projects often involve maximizing modest lot depth while keeping the finished build visually clean from the street. That makes layout efficiency, permitting, and neighbor-facing design choices especially important.',
    proofNotes: [
      'Deck and screened porch planning for tighter backyard footprints off Butler Road.',
      'Garage expansion studies where driveway geometry and roof tie-ins affect the budget early.',
      'ADU concepts designed to preserve privacy on infill-style lots near the city core.',
    ],
    timelineNote:
      'In Mauldin, the best schedules come from resolving access, staging, and drainage details before final pricing is approved.',
  },
  {
    slug: 'gray-court-sc',
    name: 'Gray Court',
    displayName: 'Gray Court, SC',
    county: 'Laurens County',
    permitOffice: 'Laurens County building and planning office',
    permitUrl: 'https://www.laurenscounty.us/',
    neighborhoods: ['Gray Court town center', 'Highway 14 corridor', 'Durbin Creek area', 'surrounding rural acreage'],
    intro:
      'Gray Court homeowners often have more lot flexibility but also more site variation, including slope, drainage, and utility distance. We scope projects around those realities so budgets stay grounded and buildable.',
    proofNotes: [
      'Detached garages and workshop structures planned for larger rural homesites.',
      'Room additions designed around crawlspace transitions and simpler roofline tie-ins.',
      'Deck and porch layouts shaped for wooded lots and long backyard views.',
    ],
    timelineNote:
      'Gray Court projects move best when site conditions, utility routes, and inspections are mapped before the first estimate revision.',
  },
  {
    slug: 'laurens-sc',
    name: 'Laurens',
    displayName: 'Laurens, SC',
    county: 'Laurens County',
    permitOffice: 'City of Laurens / Laurens County permit coordination',
    permitUrl: 'https://www.cityoflaurenssc.com/',
    neighborhoods: ['Downtown Laurens', 'West Main corridor', 'East Main neighborhoods', 'Lake Rabon vicinity'],
    intro:
      'Laurens homeowners typically want improvements that add function without overbuilding the neighborhood, especially when updating older homes or planning multigenerational space. We keep designs practical, durable, and easy to phase.',
    proofNotes: [
      'Addition and ADU concepts for families needing independent living space close to town.',
      'Garage and deck plans that improve storage and entertaining value without sacrificing yard flow.',
      'Screened porch designs built around comfort, airflow, and low-maintenance finishes.',
    ],
    timelineNote:
      'Laurens projects often benefit from phased scopes so homeowners can lock in structural work first and finish upgrades on their own timeline.',
  },
  {
    slug: 'woodruff-sc',
    name: 'Woodruff',
    displayName: 'Woodruff, SC',
    county: 'Spartanburg County',
    permitOffice: 'City of Woodruff / Spartanburg County code compliance',
    permitUrl: 'https://www.cityofwoodruff.com/',
    neighborhoods: ['Downtown Woodruff', 'Highway 101 corridor', 'Cross Anchor Road area', 'growing residential neighborhoods'],
    intro:
      'Woodruff is growing quickly, which means good projects need to respect both current lifestyle needs and rising resale expectations. We focus on clean design, dependable communication, and scope choices that hold long-term value.',
    proofNotes: [
      'Deck and porch concepts sized for family entertaining near the Highway 101 growth corridor.',
      'Garage planning for homes needing better storage and workshop flexibility.',
      'Guest house and room addition options for households preparing for multigenerational needs.',
    ],
    timelineNote:
      'Woodruff demand is rising, so permit-ready plans and early product approvals help avoid peak-season scheduling delays.',
  },
  {
    slug: 'clinton-sc',
    name: 'Clinton',
    displayName: 'Clinton, SC',
    county: 'Laurens County',
    permitOffice: 'City of Clinton / Laurens County permit review',
    permitUrl: 'https://www.cityofclintonsc.com/',
    neighborhoods: ['Downtown Clinton', 'Presbyterian College area', 'Highway 56 corridor', 'surrounding established neighborhoods'],
    intro:
      'Clinton projects frequently center on making an existing home work better for a growing family or aging parents. We help homeowners weigh cost, timeline, and resale impact before construction begins.',
    proofNotes: [
      'ADU and guest house layouts for multigenerational living near the Presbyterian College area.',
      'Room additions and garages scoped around existing driveways and older utility layouts.',
      'Outdoor living spaces designed for easy upkeep and year-round use.',
    ],
    timelineNote:
      'Clinton builds stay on schedule when we confirm utility capacity and inspection timing before ordering major materials.',
  },
  {
    slug: 'ora-sc',
    name: 'Ora',
    displayName: 'Ora, SC',
    county: 'Laurens County',
    permitOffice: 'Laurens County planning and inspections',
    permitUrl: 'https://www.laurenscounty.us/',
    neighborhoods: ['Highway 76 corridor', 'rural family properties', 'country homesites', 'surrounding agricultural acreage'],
    intro:
      'Ora homeowners usually have more room to build, but rural site access, utility runs, and grading can shape both schedule and budget. We handle the front-end planning so the build is efficient and realistic.',
    proofNotes: [
      'Detached garages and workshop concepts sized for larger country parcels.',
      'Decks, screened porches, and additions designed for longer views and open-lot privacy.',
      'Guest house planning that keeps utility routing and driveway access straightforward.',
    ],
    timelineNote:
      'Ora projects work best when utility layout, grading, and material delivery access are reviewed before final scope approval.',
  },
  {
    slug: 'joanna-sc',
    name: 'Joanna',
    displayName: 'Joanna, SC',
    county: 'Laurens County',
    permitOffice: 'Laurens County inspections and code office',
    permitUrl: 'https://www.laurenscounty.us/',
    neighborhoods: ['Joanna mill village area', 'Highway 76 corridor', 'historic homesites', 'nearby rural neighborhoods'],
    intro:
      'Joanna homeowners often need improvements that respect an older home footprint while adding better storage, outdoor living, or guest space. Our job is to make the new work feel planned and proportional, not oversized or disconnected.',
    proofNotes: [
      'Room additions and ADUs planned around older home layouts and tighter utility tie-ins.',
      'Garage and deck concepts that improve functionality without overpowering the lot.',
      'Screened porch projects built for airflow, shade, and easy maintenance in warm seasons.',
    ],
    timelineNote:
      'Joanna scopes stay cleaner when we confirm structural tie-ins and staging before the final contract is approved.',
  },
];

export const localDominanceServices: TargetService[] = [
  {
    slug: 'garage-builder',
    serviceName: 'Garage Construction',
    navLabel: 'Garage Construction',
    h1Label: 'Garage Builder',
    titleLabel: 'Garage Builder',
    primaryKeywordBase: 'garage builder',
    shortIntro:
      'We design and build attached garages, detached garages, hobby workshops, and storage-ready spaces that feel like a natural extension of the property.',
    ctaSummary:
      'If you need better parking, storage, workshop space, or a cleaner resale-ready footprint, we can map the right garage scope and budget.',
    deliverables: ['attached garages', 'detached garages', 'workshop garages', 'garage storage planning'],
    costFactors: ['foundation and slab size', 'roofline tie-in or detached framing', 'garage doors and window package', 'electrical and storage upgrades'],
    authorityLinks: [
      { label: 'South Carolina Contractor Licensing Board', url: 'https://llr.sc.gov/clb/' },
      { label: 'Greenville County planning and code resources', url: 'https://www.greenvillecounty.org/PlanningAndCodeCompliance/' },
    ],
    imageAltBase: 'custom garage construction',
  },
  {
    slug: 'room-additions',
    serviceName: 'Room Additions',
    navLabel: 'Room Additions',
    h1Label: 'Room Additions',
    titleLabel: 'Room Additions',
    primaryKeywordBase: 'room additions',
    shortIntro:
      'We build bedrooms, family room expansions, sunroom conversions, and footprint extensions that match the existing home instead of looking tacked on.',
    ctaSummary:
      'When moving is not the right answer, a well-planned addition can unlock the square footage your family needs without sacrificing design quality.',
    deliverables: ['bedroom additions', 'family room expansions', 'home office additions', 'sunroom and flex-space conversions'],
    costFactors: ['foundation design', 'roofline integration', 'HVAC and electrical capacity', 'interior finish level'],
    authorityLinks: [
      { label: 'Energy Saver remodeling guidance', url: 'https://www.energy.gov/energysaver/design/remodeling-home' },
      { label: 'South Carolina Contractor Licensing Board', url: 'https://llr.sc.gov/clb/' },
    ],
    imageAltBase: 'room addition contractor',
  },
  {
    slug: 'screened-porches',
    serviceName: 'Screened Porches',
    navLabel: 'Screened Porches',
    h1Label: 'Screened Porch Contractor',
    titleLabel: 'Screened Porch Contractor',
    primaryKeywordBase: 'screened porch contractor',
    shortIntro:
      'Our aluminum-focused screened porch builds are designed for airflow, shade, low maintenance, and a polished transition from indoor to outdoor living.',
    ctaSummary:
      'We help homeowners compare aluminum framing, roof style, fans, lighting, and screen systems so the porch works in real Upstate weather.',
    deliverables: ['aluminum screened porches', 'covered porches', 'outdoor dining spaces', 'ceiling fan and lighting packages'],
    costFactors: ['roof style and structural tie-in', 'screen system and aluminum details', 'ceiling finishes and lighting', 'steps, landings, and concrete or deck tie-ins'],
    authorityLinks: [
      { label: 'Lowes outdoor building resources', url: 'https://www.lowes.com/n/how-to' },
      { label: 'South Carolina Contractor Licensing Board', url: 'https://llr.sc.gov/clb/' },
    ],
    imageAltBase: 'custom aluminum screened porch',
  },
  {
    slug: 'deck-builder',
    serviceName: 'Deck Building',
    navLabel: 'Deck Building',
    h1Label: 'Deck Builder',
    titleLabel: 'Deck Builder',
    primaryKeywordBase: 'deck builder',
    shortIntro:
      'We build wood and composite decks that improve backyard flow, entertaining space, and long-term durability without overspending on the wrong details.',
    ctaSummary:
      'From compact grilling decks to larger multi-level layouts, we plan the structure around traffic flow, drainage, and future maintenance.',
    deliverables: ['composite decks', 'pressure-treated decks', 'stairs and rail systems', 'lighting and privacy features'],
    costFactors: ['decking material', 'height and stair count', 'railing system', 'site grading and footing access'],
    authorityLinks: [
      { label: 'Trex deck planning guides', url: 'https://www.trex.com/academy/' },
      { label: 'Lowes deck-building resources', url: 'https://www.lowes.com/n/how-to/build-a-deck' },
    ],
    imageAltBase: 'custom deck building',
  },
  {
    slug: 'adu-builder',
    serviceName: 'ADU / Guest Houses / Granny Pods',
    navLabel: 'ADU Builder',
    h1Label: 'ADU Builder',
    titleLabel: 'ADU Builder',
    primaryKeywordBase: 'adu builder',
    shortIntro:
      'We plan accessory dwelling units, guest houses, and granny pods with realistic utility, privacy, and permitting strategies for multigenerational living.',
    ctaSummary:
      'If you need independent living space for parents, guests, or long-term flexibility, we can outline a code-ready ADU plan and estimate.',
    deliverables: ['accessory dwelling units', 'guest houses', 'granny pods', 'in-law suites'],
    costFactors: ['site utilities', 'bathroom and kitchenette scope', 'foundation and access', 'privacy planning and finish package'],
    authorityLinks: [
      { label: 'HUD accessory dwelling unit overview', url: 'https://www.huduser.gov/' },
      { label: 'South Carolina Contractor Licensing Board', url: 'https://llr.sc.gov/clb/' },
    ],
    imageAltBase: 'adu builder',
  },
];

export const allTargetCityNames = targetCities.map((city) => city.displayName);
export const allTargetServicePaths = localDominanceServices.map((service) => `/${service.slug}`);

function buildMetaDescription(service: TargetService, cityName: string) {
  const descriptions: Record<TargetServiceSlug, string> = {
    'garage-builder': `Trusted garage builders in ${cityName}. Burch Contracting plans attached and detached garages with clear pricing, code guidance, and free estimates.`,
    'room-additions': `Expert room additions in ${cityName}. Burch Contracting expands homes with clear planning, quality craftsmanship, and a free estimate today.`,
    'screened-porches': `Need a screened porch contractor in ${cityName}? We build low-maintenance aluminum porches with solid planning and free estimates.`,
    'deck-builder': `Top-rated deck builders in ${cityName}. Burch Contracting designs durable wood and composite decks with clear pricing and a free estimate.`,
    'adu-builder': `Experienced ADU builders in ${cityName}. Plan a guest house or granny pod with Burch Contracting and request your free estimate today.`,
  };

  return descriptions[service.slug];
}

function buildHubMetaDescription(service: TargetService) {
  const descriptions: Record<TargetServiceSlug, string> = {
    'garage-builder': 'Expert garage builders in Simpsonville, SC. Burch Contracting designs custom attached and detached garages. Call today for a free estimate.',
    'room-additions': 'Trusted room additions in Simpsonville, SC. Burch Contracting expands homes with clear planning and quality craftsmanship. Get a free estimate.',
    'screened-porches': 'Aluminum screened porch contractor in Simpsonville, SC. Burch Contracting builds durable outdoor living spaces. Get a free estimate today.',
    'deck-builder': 'Professional deck builders in Simpsonville, SC. We build code-ready wood and composite decks with clear pricing. Call for a free estimate.',
    'adu-builder': 'ADU builders in Simpsonville, SC. Plan guest houses and granny pods with Burch Contracting. Call now for a free estimate and local guidance.',
  };

  return descriptions[service.slug];
}

function buildFaqs(service: TargetService, cityName: string): FaqItem[] {
  return [
    {
      question: `How soon can a ${service.h1Label.toLowerCase()} project start in ${cityName}?`,
      answer:
        'Most projects start after scope approval, material selections, and permit review are in place. We outline the critical path early so you know what affects the schedule before work begins.',
    },
    {
      question: `Do you provide a written estimate for ${service.serviceName.toLowerCase()}?`,
      answer:
        'Yes. Every proposal includes a written scope, budget guidance, timeline expectations, and notes on what can change pricing so you can compare options clearly.',
    },
    {
      question: `Can Burch Contracting handle local permitting and code coordination in ${cityName}?`,
      answer:
        'Yes. We help plan around county and city review requirements, inspection sequencing, and practical site considerations so the work stays documented and code-ready.',
    },
    {
      question: `What makes your ${service.navLabel.toLowerCase()} process different?`,
      answer:
        'We focus on front-end planning, realistic allowances, and communication that helps homeowners avoid rushed decisions. That keeps the finished project cleaner and more predictable.',
    },
  ];
}

function buildHubFaqs(service: TargetService): FaqItem[] {
  return [
    {
      question: `What cities do you serve for ${service.serviceName.toLowerCase()}?`,
      answer: `We serve ${allTargetCityNames.join(', ')} with estimates, planning support, and construction tailored to each property.`,
    },
    {
      question: `Do you provide written estimates for ${service.navLabel.toLowerCase()} work?`,
      answer:
        'Yes. We provide written estimates with scope, budget allowances, and timeline notes so you can make the right decision before construction begins.',
    },
    {
      question: 'Can you help with permits and inspection planning?',
      answer:
        'Yes. We review permitting needs, likely inspection milestones, and the practical site issues that affect schedule and budget before production starts.',
    },
    {
      question: 'How do you keep the project aligned with resale value?',
      answer:
        'We recommend scope and finish decisions that improve function first, fit the neighborhood, and avoid overspending on details that do not move long-term value.',
    },
  ];
}

function getNearbyCityLinks(currentCitySlug: TargetCitySlug, service: TargetService): RelatedLink[] {
  return targetCities
    .filter((city) => city.slug !== currentCitySlug)
    .slice(0, 3)
    .map((city) => ({
      label: `${service.navLabel} in ${city.displayName}`,
      href: `/${city.slug}/${service.slug}`,
      description: `Compare ${service.navLabel.toLowerCase()} planning details for ${city.displayName}.`,
    }));
}

function getSameCityServiceLinks(city: TargetCity, currentServiceSlug: TargetServiceSlug): RelatedLink[] {
  return localDominanceServices
    .filter((service) => service.slug !== currentServiceSlug)
    .slice(0, 3)
    .map((service) => ({
      label: `${service.navLabel} in ${city.displayName}`,
      href: `/${city.slug}/${service.slug}`,
      description: `See how we plan ${service.navLabel.toLowerCase()} projects for ${city.name} homeowners.`,
    }));
}

function buildProjectHighlights(service: TargetService, city: TargetCity): HighlightCard[] {
  return city.proofNotes.map((note, index) => ({
    title: `${service.navLabel} Project ${index + 1}`,
    summary: note,
    image: '/og-image.jpg',
    alt: `${service.imageAltBase} ${city.name} SC`,
  }));
}

function buildWhyChoose(service: TargetService, city?: TargetCity): BenefitCard[] {
  const locationLabel = city ? city.displayName : 'the Upstate';

  return [
    {
      title: `Why Choose Burch Contracting in ${city?.name ?? 'the Upstate'}`,
      text: `We plan ${service.navLabel.toLowerCase()} work around your lot, your home, and your long-term goals instead of forcing a one-size-fits-all scope in ${locationLabel}.`,
    },
    {
      title: 'Clear scope and budget guidance',
      text: 'You get realistic pricing factors, written scope notes, and milestone expectations before production begins so there is less guesswork during the job.',
    },
    {
      title: 'Local building experience',
      text: city
        ? `We understand how neighborhood standards, county review, drainage, access, and scheduling affect ${service.navLabel.toLowerCase()} work in ${city.displayName}.`
        : `We build across ${allTargetCityNames.join(', ')} and tailor every scope to the property instead of recycling generic plans.`,
    },
    {
      title: 'Lead-generation focused support',
      text: 'Fast callbacks, free estimates, click-to-call access, and practical next-step guidance make it easier for homeowners to move from research to action.',
    },
  ];
}

function buildPlanningSection(service: TargetService, city?: TargetCity) {
  const location = city?.displayName ?? 'Simpsonville, SC';
  const keyword = `${service.primaryKeywordBase} ${city?.name ?? 'Simpsonville'} SC`;

  return {
    title: `Planning for ${keyword}`,
    paragraphs: [
      `${keyword} projects work best when the scope is built around site access, drainage, utility routing, and the finish level you actually want to live with long term. We review those items before final pricing so the budget reflects real conditions instead of optimistic assumptions.`,
      `${service.ctaSummary} We also compare the biggest budget levers early — ${service.costFactors.join(', ')} — so you know where to invest and where to stay disciplined.`
    ],
    bullets: service.costFactors,
  };
}

function buildLocalExperienceSection(service: TargetService, city?: TargetCity) {
  if (!city) {
    return {
      title: 'Service area coverage across Upstate South Carolina',
      paragraphs: [
        `Burch Contracting serves ${allTargetCityNames.join(', ')} with a tighter keyword hierarchy and location-specific planning for ${service.navLabel.toLowerCase()} projects.`,
        `That means homeowners can move from a broad service page to the exact city-service page that matches their search intent, estimate needs, and local permitting context.`,
      ],
    };
  }

  return {
    title: `Local Building Experience in ${city.name}`,
    paragraphs: [
      `${city.intro} Our planning conversations often reference ${city.neighborhoods.join(', ')}, because those local conditions shape the right footprint, materials, and phasing for the project.`,
      `${city.timelineNote} We also coordinate around ${city.permitOffice} so inspections and documentation stay aligned with the job schedule.`
    ],
  };
}

function buildLocalLandingPage(city: TargetCity, service: TargetService): SeoLandingPageData {
  const primaryKeyword = `${service.primaryKeywordBase} ${city.name} SC`;

  return {
    id: `${city.slug}-${service.slug}`,
    path: `/${city.slug}/${service.slug}`,
    kind: 'city-service',
    slug: `${city.slug}-${service.slug}`,
    city,
    service,
    primaryKeyword,
    h1: `${service.h1Label} in ${city.displayName}`,
    metaTitle: `${service.titleLabel} in ${city.displayName} | Burch Contracting`,
    metaDescription: buildMetaDescription(service, city.displayName),
    shortDescription: `${service.navLabel} for ${city.displayName} homeowners who need local planning, clear pricing, and a free estimate.`,
    leadParagraphs: [
      `${primaryKeyword} is the focus of this page, and that matters because homeowners in ${city.displayName} are not looking for generic contractor copy. They need a plan that respects the lot, the neighborhood, the permit path, and the way the finished space will be used every day.`,
      `${service.shortIntro} Burch Contracting works with homeowners across ${city.county} to compare scope, timeline, cost, and finish level before construction begins, which helps reduce change orders and keeps decision-making clearer from day one.`,
      `From ${city.neighborhoods.join(', ')}, we see the same questions come up again and again: what can be built on the property, what needs a permit, how long the job will take, and which upgrades truly add value. This page answers those questions for ${service.navLabel.toLowerCase()} in ${city.displayName} with strong local references, conversion-focused calls to action, and links to related city and service pages.`,
    ],
    whyChoose: buildWhyChoose(service, city),
    planningSection: buildPlanningSection(service, city),
    localExperienceSection: buildLocalExperienceSection(service, city),
    projectHighlights: buildProjectHighlights(service, city),
    faqItems: buildFaqs(service, city.displayName),
    relatedLinks: [
      ...getSameCityServiceLinks(city, service.slug),
      ...getNearbyCityLinks(city.slug, service),
      { label: `${service.navLabel} service page`, href: `/${service.slug}`, description: `Review the main ${service.navLabel.toLowerCase()} page and city coverage map.` },
      { label: 'All service areas', href: '/locations', description: 'Browse every city + service page in the Upstate SEO structure.' },
    ],
    authorityLinks: [
      { label: `${city.permitOffice}`, url: city.permitUrl },
      ...service.authorityLinks,
    ],
  };
}

function buildServiceHubPage(service: TargetService): SeoLandingPageData {
  const primaryKeyword = `${service.primaryKeywordBase} Simpsonville SC`;

  return {
    id: service.slug,
    path: `/${service.slug}`,
    kind: 'service-hub',
    slug: service.slug,
    service,
    primaryKeyword,
    h1: `${service.h1Label} in Simpsonville, SC`,
    metaTitle: `${service.titleLabel} in Simpsonville & Upstate SC | Burch Contracting`,
    metaDescription: buildHubMetaDescription(service),
    shortDescription: `${service.navLabel} across Simpsonville, Fountain Inn, Mauldin, Gray Court, Laurens, Woodruff, Clinton, Ora, and Joanna.`,
    leadParagraphs: [
      `${primaryKeyword} is the main search theme for this service page, but the work itself reaches far beyond one ZIP code. Burch Contracting uses this page as the master hub for ${service.navLabel.toLowerCase()} across the Upstate so homeowners can move from a broad service overview to the exact city-service page that matches their search.`,
      `${service.shortIntro} Every project starts with scope clarity, local permitting awareness, and practical guidance on the biggest cost drivers so the estimate stays useful after the first conversation.`,
      `We currently prioritize Simpsonville, Fountain Inn, Mauldin, Gray Court, Laurens, Woodruff, Clinton, Ora, and Joanna. That strict location hierarchy helps search engines understand which page should rank for each local intent phrase while also giving homeowners a cleaner path to the right content and CTA.`,
    ],
    whyChoose: buildWhyChoose(service),
    planningSection: buildPlanningSection(service),
    localExperienceSection: buildLocalExperienceSection(service),
    projectHighlights: targetCities.slice(0, 3).map((city, index) => ({
      title: `${city.name} ${service.navLabel}`,
      summary: city.proofNotes[index] ?? city.proofNotes[0],
      image: '/og-image.jpg',
      alt: `${service.imageAltBase} ${city.name} SC`,
    })),
    faqItems: buildHubFaqs(service),
    relatedLinks: [
      ...targetCities.slice(0, 6).map((city) => ({
        label: `${service.navLabel} in ${city.displayName}`,
        href: `/${city.slug}/${service.slug}`,
        description: `Go straight to the ${city.displayName} landing page for ${service.navLabel.toLowerCase()}.`,
      })),
      { label: 'All services', href: '/services', description: 'Browse the full service hierarchy and internal linking structure.' },
      { label: 'All locations', href: '/locations', description: 'Review every city page in the local SEO rebuild.' },
    ],
    authorityLinks: service.authorityLinks,
  };
}

export const localDominancePages: SeoLandingPageData[] = targetCities.flatMap((city) =>
  localDominanceServices.map((service) => buildLocalLandingPage(city, service))
);

export const serviceHubPages: SeoLandingPageData[] = localDominanceServices.map((service) => buildServiceHubPage(service));

export function getServiceHubBySlug(slug: string) {
  return serviceHubPages.find((page) => page.slug === slug);
}

export function getLocalDominancePage(citySlug: string, serviceSlug: string) {
  return localDominancePages.find((page) => page.city?.slug === citySlug && page.service.slug === serviceSlug);
}

export function getLocalPagesForCity(citySlug: string) {
  return localDominancePages.filter((page) => page.city?.slug === citySlug);
}

export function getLocalPagesForService(serviceSlug: string) {
  return localDominancePages.filter((page) => page.service.slug === serviceSlug);
}
