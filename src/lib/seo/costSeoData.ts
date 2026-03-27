export interface CostRange {
  label: string;
  range: string;
  details: string;
}

export interface CostLandingPage {
  slug: string;
  serviceName: string;
  city: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  ranges: CostRange[];
  costDrivers: string[];
  faqs: Array<{ question: string; answer: string }>;
  calculatorPath: string;
  relatedLocationPath: string;
  relatedServicePath: string;
}

const baseFaqs = [
  {
    question: 'How accurate are online remodeling cost ranges?',
    answer:
      'Online ranges are useful for early planning, but the final number depends on layout changes, product selections, site conditions, and permit requirements. We use them as a starting point, not a final proposal.',
  },
  {
    question: 'Do permits and inspections affect remodeling cost?',
    answer:
      'Yes. Permit requirements, inspection sequencing, and code upgrades can all influence cost. We account for those items early so homeowners can plan around realistic numbers.',
  },
  {
    question: 'Can you give a written estimate after a consultation?',
    answer:
      'Yes. After learning more about your scope, we provide a written estimate with allowances, scope detail, and clear next steps for design and construction planning.',
  },
];

export const costLandingPages: CostLandingPage[] = [
  {
    slug: 'kitchen-remodel-cost-simpsonville-sc',
    serviceName: 'Kitchen Remodeling',
    city: 'Simpsonville SC',
    h1: 'How Much Does Kitchen Remodeling Cost in Simpsonville SC?',
    metaTitle: 'Kitchen Remodel Cost Simpsonville SC | Burch Contracting',
    metaDescription: 'See realistic kitchen remodel cost ranges in Simpsonville SC with guidance on cabinets, counters, layout changes, and allowances.',
    intro:
      'Kitchen remodeling cost in Simpsonville depends on cabinet scope, countertop material, appliance changes, flooring, lighting, and whether the layout stays in place. The ranges below are designed to help homeowners create a practical planning budget before requesting a written estimate.',
    ranges: [
      { label: 'Kitchen Refresh', range: '$20,000-$38,000', details: 'Countertops, backsplash, fixtures, paint, and selective cabinet updates without major utility movement.' },
      { label: 'Full Kitchen Remodel', range: '$39,000-$75,000', details: 'New cabinetry, counters, flooring, lighting, and a more coordinated appliance and storage plan.' },
      { label: 'Custom Kitchen', range: '$76,000-$140,000+', details: 'Layout rework, premium appliances, custom millwork, structural changes, and high-end finishes.' },
    ],
    costDrivers: ['Cabinet construction and storage upgrades', 'Countertop material and edge detail', 'Appliance package and ventilation changes', 'Flooring replacement and subfloor prep', 'Wall removal or utility relocation'],
    faqs: baseFaqs,
    calculatorPath: '/calculator/kitchen-remodeling',
    relatedLocationPath: '/locations/kitchen-remodeling-simpsonville-sc',
    relatedServicePath: '/services/remodeling',
  },
  {
    slug: 'kitchen-remodel-cost-greenville-sc',
    serviceName: 'Kitchen Remodeling',
    city: 'Greenville SC',
    h1: 'How Much Does Kitchen Remodeling Cost in Greenville SC?',
    metaTitle: 'Kitchen Remodel Cost Greenville SC | Burch Contracting',
    metaDescription: 'Explore realistic kitchen remodel costs in Greenville SC for historic homes, newer homes, and premium design-build projects.',
    intro:
      'Greenville kitchen remodel budgets vary widely based on home age, neighborhood expectations, design complexity, and finish level. These ranges give homeowners a realistic planning framework before deciding whether to phase work or complete everything at once.',
    ranges: [
      { label: 'Kitchen Update', range: '$22,000-$40,000', details: 'Surface updates, selective cabinet improvements, and finish replacements with minimal structural change.' },
      { label: 'Comprehensive Remodel', range: '$41,000-$82,000', details: 'Cabinets, appliances, counters, lighting, flooring, and more intentional workflow planning.' },
      { label: 'Premium Greenville Kitchen', range: '$83,000-$165,000+', details: 'Custom cabinetry, layout redesign, premium appliances, and upscale finish choices for higher-value homes.' },
    ],
    costDrivers: ['Historic-home constraints and code updates', 'Cabinet quality and custom storage', 'Appliance package complexity', 'Lighting and electrical upgrades', 'Finish level and installation detail'],
    faqs: baseFaqs,
    calculatorPath: '/calculator/kitchen-remodeling',
    relatedLocationPath: '/locations/kitchen-remodeling-greenville-sc',
    relatedServicePath: '/services/remodeling',
  },
  {
    slug: 'bathroom-remodel-cost-greenville-sc',
    serviceName: 'Bathroom Remodeling',
    city: 'Greenville SC',
    h1: 'How Much Does Bathroom Remodeling Cost in Greenville SC?',
    metaTitle: 'Bathroom Remodel Cost Greenville SC | Burch Contracting',
    metaDescription: 'Review bathroom remodel cost ranges in Greenville SC for guest baths, primary baths, shower conversions, and premium upgrades.',
    intro:
      'Bathroom remodeling cost in Greenville depends on whether you are refreshing fixtures, rebuilding the shower, improving storage, or reworking the layout. A realistic budget should separate necessary scope from finish upgrades so you can compare options clearly.',
    ranges: [
      { label: 'Bathroom Refresh', range: '$9,000-$18,000', details: 'Vanity, fixtures, lighting, paint, and flooring updates without moving plumbing.' },
      { label: 'Full Bathroom Remodel', range: '$19,000-$42,000', details: 'New tile, shower or tub changes, ventilation improvements, and storage upgrades.' },
      { label: 'Luxury Bathroom', range: '$43,000-$95,000+', details: 'Custom shower system, frameless glass, premium fixtures, and design-forward materials.' },
    ],
    costDrivers: ['Tile complexity and waterproofing requirements', 'Fixture selection and plumbing relocation', 'Shower conversion scope', 'Ventilation and code upgrades', 'Storage and vanity customization'],
    faqs: baseFaqs,
    calculatorPath: '/calculator/bathroom-remodeling',
    relatedLocationPath: '/locations/bathroom-remodeling-greenville-sc',
    relatedServicePath: '/services/remodeling',
  },
  {
    slug: 'room-addition-cost-greenville-sc',
    serviceName: 'Room Additions',
    city: 'Greenville SC',
    h1: 'How Much Does a Room Addition Cost in Greenville SC?',
    metaTitle: 'Room Addition Cost Greenville SC | Burch Contracting',
    metaDescription: 'See realistic room addition cost ranges in Greenville SC, including foundation, framing, HVAC, roofing, and finish work.',
    intro:
      'Room addition pricing in Greenville is shaped by foundation type, roof tie-ins, HVAC integration, finishes, and how closely the new square footage must blend into the existing home. These ranges help homeowners plan for realistic investment levels before design development begins.',
    ranges: [
      { label: 'Small Addition', range: '$58,000-$98,000', details: 'Single-room addition with standard structure, utilities, insulation, drywall, and finish work.' },
      { label: 'Mid-Size Addition', range: '$99,000-$195,000', details: 'Larger family room, bedroom, or office addition with full system integration and better finish scope.' },
      { label: 'Complex Expansion', range: '$196,000-$375,000+', details: 'Multi-room addition, structural engineering, advanced roofing tie-ins, and premium finishes.' },
    ],
    costDrivers: ['Foundation and site conditions', 'Roofline integration and exterior finish matching', 'HVAC, electrical, and plumbing tie-ins', 'Window and door package', 'Interior finish level and trim detail'],
    faqs: baseFaqs,
    calculatorPath: '/calculator/room-additions',
    relatedLocationPath: '/locations/room-additions-greenville-sc',
    relatedServicePath: '/services/additions',
  },
  {
    slug: 'deck-cost-simpsonville-sc',
    serviceName: 'Deck Builder',
    city: 'Simpsonville SC',
    h1: 'How Much Does a Deck Cost in Simpsonville SC?',
    metaTitle: 'Deck Cost Simpsonville SC | Burch Contracting',
    metaDescription: 'Compare deck building cost in Simpsonville SC for pressure-treated decks, composite decks, rail upgrades, and stairs.',
    intro:
      'Deck cost in Simpsonville depends on size, framing complexity, railing package, stairs, material choice, and whether the build must solve access or grading issues. Planning around those factors early helps homeowners compare wood and composite options more realistically.',
    ranges: [
      { label: 'Pressure-Treated Deck', range: '$18,000-$32,000', details: 'Straightforward layout with pressure-treated framing and finish materials.' },
      { label: 'Composite Deck', range: '$33,000-$58,000', details: 'Lower-maintenance decking, upgraded rail systems, and better long-term durability.' },
      { label: 'Custom Deck Build', range: '$59,000-$120,000+', details: 'Multi-level layouts, lighting, stairs, built-ins, and more advanced finish details.' },
    ],
    costDrivers: ['Material selection: wood vs composite', 'Guard rail and stair requirements', 'Site grading and access constraints', 'Lighting, privacy screens, and built-ins', 'Permit and inspection requirements'],
    faqs: baseFaqs,
    calculatorPath: '/calculator/decks-screened-porches',
    relatedLocationPath: '/locations/deck-builder-simpsonville-sc',
    relatedServicePath: '/services/additions',
  },
  {
    slug: 'basement-finishing-cost-greenville-sc',
    serviceName: 'Basement Finishing',
    city: 'Greenville SC',
    h1: 'How Much Does Basement Finishing Cost in Greenville SC?',
    metaTitle: 'Basement Finishing Cost Greenville SC | Burch Contracting',
    metaDescription: 'Understand basement finishing cost in Greenville SC for rec rooms, guest suites, offices, baths, and premium lower-level upgrades.',
    intro:
      'Basement finishing cost in Greenville depends on moisture prep, room count, bathroom additions, insulation strategy, lighting, and finish level. A good budget accounts for both core finish work and the specialty spaces that make a basement feel like a true extension of the home.',
    ranges: [
      { label: 'Basic Finish', range: '$35-$55 per sq ft', details: 'Framing, insulation, drywall, flooring, standard electrical, and practical finish scope.' },
      { label: 'Mid-Range Finish', range: '$56-$85 per sq ft', details: 'Adds storage, specialty areas, upgraded lighting, and more intentional room planning.' },
      { label: 'Premium Basement', range: '$86-$140+ per sq ft', details: 'Guest suite, media room, bath, wet bar, or more advanced finish and comfort upgrades.' },
    ],
    costDrivers: ['Moisture control and insulation strategy', 'Bathroom or wet-bar scope', 'Lighting, HVAC, and ceiling conditions', 'Room count and partition complexity', 'Finish level and specialty features'],
    faqs: baseFaqs,
    calculatorPath: '/calculator/basement-finishing',
    relatedLocationPath: '/locations/basement-finishing-greenville-sc',
    relatedServicePath: '/services/basement',
  },
];

export function getCostLandingPageBySlug(slug: string) {
  return costLandingPages.find((page) => page.slug === slug);
}
