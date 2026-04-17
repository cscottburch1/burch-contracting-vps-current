export interface ProjectSpotlight {
  slug: string;
  title: string;
  city: string;
  serviceType: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  timeline: string;
  budgetBand: string;
  image: string;
  imageAlt: string;
  relatedLocationPath: string;
  relatedCostPath?: string;
  representative: boolean;
}

export const projectSpotlights: ProjectSpotlight[] = [
  {
    slug: 'kitchen-workflow-upgrade-simpsonville',
    title: 'Kitchen Workflow Upgrade in Simpsonville',
    city: 'Simpsonville SC',
    serviceType: 'Kitchen Remodeling',
    summary: 'A planning-first kitchen remodel focused on storage, prep flow, and durable finish choices for a busy household.',
    challenge: 'The existing kitchen had limited prep space, poor appliance workflow, and storage that did not match how the family used the room.',
    approach: 'The project plan prioritized cabinet reconfiguration, improved traffic flow, upgraded counters, and better lighting zones before final finish decisions.',
    outcome: 'The remodeled kitchen improved daily usability, reduced clutter, and created more comfortable entertaining space with cleaner circulation.',
    timeline: '6 to 9 weeks typical construction window',
    budgetBand: '$39,000-$75,000 typical investment range',
    image: '/images/projects/kitchen-workflow-upgrade-simpsonville/kitchen-remodel-simpsonville-sc-1200.webp',
    imageAlt: 'Modern kitchen remodeling in Simpsonville SC with white cabinets, quartz countertops, and stainless appliances by Burch Contracting',
    relatedLocationPath: '/locations/kitchen-remodeling-simpsonville-sc',
    relatedCostPath: '/cost/kitchen-remodel-cost-simpsonville-sc',
    representative: true,
  },
  {
    slug: 'bathroom-renovation-greenville',
    title: 'Primary Bathroom Renovation in Greenville',
    city: 'Greenville SC',
    serviceType: 'Bathroom Remodeling',
    summary: 'A full bathroom renovation strategy balancing comfort upgrades, moisture control, and practical material selections.',
    challenge: 'The existing bathroom lacked storage, had dated finishes, and required better ventilation and shower usability for long-term comfort.',
    approach: 'The plan staged demolition, waterproofing, shower modernization, vanity rework, and fixture upgrades around permit and lead-time constraints.',
    outcome: 'The finished space delivered a cleaner layout, easier maintenance, and stronger day-to-day comfort with better long-term durability.',
    timeline: '3 to 6 weeks typical construction window',
    budgetBand: '$19,000-$42,000 typical investment range',
    image: '/images/projects/bathroom-renovation-greenville/bathroom-renovation-greenville-sc-1200.webp',
    imageAlt: 'Bathroom Renovation Greenville SC by Burch Contracting',
    relatedLocationPath: '/locations/bathroom-remodeling-greenville-sc',
    relatedCostPath: '/cost/bathroom-remodel-cost-greenville-sc',
    representative: true,
  },
  {
    slug: 'room-addition-expansion-greenville',
    title: 'Room Addition Expansion in Greenville',
    city: 'Greenville SC',
    serviceType: 'Room Additions',
    summary: 'A room addition planning model built around structural tie-ins, utility routing, and consistent exterior integration.',
    challenge: 'The homeowners needed more square footage without moving, but wanted the addition to feel original to the home rather than attached later.',
    approach: 'Scope development focused on foundation strategy, roofline integration, HVAC and electrical tie-ins, and interior transition details.',
    outcome: 'The completed expansion added practical living space with strong flow and finish continuity while supporting long-term resale value.',
    timeline: '10 to 16 weeks typical construction window',
    budgetBand: '$99,000-$195,000 typical investment range',
    image: '/images/projects/room-addition-expansion-greenville/room-addition-greenville-sc-1200.webp',
    imageAlt: 'Room addition construction in Greenville SC with expanded living space and seamless interior transitions by Burch Contracting',
    relatedLocationPath: '/locations/room-additions-greenville-sc',
    relatedCostPath: '/cost/room-addition-cost-greenville-sc',
    representative: true,
  },
  {
    slug: 'deck-entertaining-space-simpsonville',
    title: 'Deck Entertaining Space in Simpsonville',
    city: 'Simpsonville SC',
    serviceType: 'Deck Builder',
    summary: 'A custom deck planning profile designed for outdoor entertaining, safer circulation, and lower maintenance ownership.',
    challenge: 'The existing backyard setup lacked a stable transition from the home and did not support comfortable gathering or seasonal use.',
    approach: 'Design and scope planning covered layout, rail and stair safety, material selection, and optional lighting for evening usability.',
    outcome: 'The new deck improved traffic flow, family use, and backyard function while keeping long-term maintenance expectations clear.',
    timeline: '3 to 5 weeks typical construction window',
    budgetBand: '$33,000-$58,000 typical investment range',
    image: '/images/projects/deck-entertaining-space-simpsonville/deck-entertaining-simpsonville-sc-1200.webp',
    imageAlt: 'Deck and outdoor living project in Simpsonville SC with durable finishes and functional entertaining layout by Burch Contracting',
    relatedLocationPath: '/locations/deck-builder-simpsonville-sc',
    relatedCostPath: '/cost/deck-cost-simpsonville-sc',
    representative: true,
  },
  {
    slug: 'basement-living-suite-greenville',
    title: 'Basement Living Suite in Greenville',
    city: 'Greenville SC',
    serviceType: 'Basement Finishing',
    summary: 'A basement finishing model with moisture-aware planning and multi-use zoning for office, rec, and guest flexibility.',
    challenge: 'The lower level was underused and needed a plan that addressed comfort, moisture management, and room functionality together.',
    approach: 'The scope emphasized humidity control, insulation, framing, lighting zones, and a phased finish strategy based on priorities.',
    outcome: 'The finished basement delivered additional living capacity with better comfort, cleaner organization, and stronger long-term performance.',
    timeline: '7 to 12 weeks typical construction window',
    budgetBand: '$56-$85 per sq ft typical range',
    image: '/images/projects/basement-living-suite-greenville/basement-finishing-greenville-sc-1200.webp',
    imageAlt: 'Finished basement remodeling in Greenville SC with coffered ceiling, recessed lighting, and custom living space by Burch Contracting',
    relatedLocationPath: '/locations/basement-finishing-greenville-sc',
    relatedCostPath: '/cost/basement-finishing-cost-greenville-sc',
    representative: true,
  },
  {
    slug: 'screened-porch-family-space-five-forks',
    title: 'Screened Porch Family Space in Five Forks',
    city: 'Five Forks SC',
    serviceType: 'Screened Porch Builder',
    summary: 'A screened porch planning profile focused on comfort, airflow, and low-maintenance outdoor living for family use.',
    challenge: 'The homeowners wanted to use outdoor space more often but needed protection from insects, humidity, and inconsistent weather.',
    approach: 'Planning centered on ventilation, fan placement, material durability, and a layout that supported both dining and casual seating.',
    outcome: 'The screened porch created a more usable outdoor room that extended daily living space and improved overall backyard function.',
    timeline: '4 to 7 weeks typical construction window',
    budgetBand: '$42,000-$70,000 typical investment range',
    image: '/images/projects/screened-porch-family-space-five-forks/screened-porch-five-forks-sc-1200.webp',
    imageAlt: 'Aluminum screened porch installation in Five Forks SC with covered patio and outdoor living space by Burch Contracting',
    relatedLocationPath: '/locations/screened-porch-builder-five-forks-sc',
    representative: true,
  },
  {
    slug: 'basement-finishing-simpsonville',
    title: 'Basement Finishing in Simpsonville',
    city: 'Simpsonville SC',
    serviceType: 'Basement Finishing',
    summary: 'A finished-basement planning profile focused on livable comfort, moisture control, and flexible family-use space in Simpsonville.',
    challenge: 'The existing basement was underused and needed a practical finishing plan that improved comfort, storage, and everyday function.',
    approach: 'Scope planning focused on layout zoning, insulation and moisture management, lighting, and durable finish selections for long-term use.',
    outcome: 'The completed basement plan delivered a brighter, more usable living area with better comfort and clear long-term maintenance expectations.',
    timeline: '7 to 12 weeks typical construction window',
    budgetBand: '$56-$85 per sq ft typical range',
    image: '/images/projects/basement-living-suite-greenville/basement-finishing-simpsonville-sc-1200.webp',
    imageAlt: 'Finished basement remodeling in Simpsonville SC with coffered ceiling, recessed lighting, and custom living space by Burch Contracting',
    relatedLocationPath: '/locations/basement-finishing-simpsonville-sc',
    representative: false,
  },
  {
    slug: 'screened-porch-simpsonville',
    title: 'Screened Porch Installation in Simpsonville',
    city: 'Simpsonville SC',
    serviceType: 'Screened Porch Builder',
    summary: 'A screened-porch project spotlight focused on shade, airflow, and lower-maintenance outdoor living for Simpsonville homeowners.',
    challenge: 'The outdoor area needed weather protection and insect control while preserving comfort for daily use and entertaining.',
    approach: 'The plan prioritized enclosure layout, structural tie-ins, durable materials, and circulation for dining and lounge zones.',
    outcome: 'The finished screened porch created a more usable outdoor room with stronger seasonal comfort and better long-term value.',
    timeline: '4 to 7 weeks typical construction window',
    budgetBand: '$42,000-$70,000 typical investment range',
    image: '/images/projects/screened-porch-family-space-five-forks/screened-porch-simpsonville-sc-1200.webp',
    imageAlt: 'Aluminum screened porch installation in Simpsonville SC with covered patio and outdoor living space by Burch Contracting',
    relatedLocationPath: '/locations/screened-porch-builder-simpsonville-sc',
    representative: false,
  },
  // Additional City-Specific Projects (Phase 6)
  {
    slug: 'garage-construction-fountain-inn-sc',
    title: 'Detached Garage Construction in Fountain Inn',
    city: 'Fountain Inn SC',
    serviceType: 'Garage Builder',
    summary: 'A 2-car detached garage project in Fountain Inn designed for workshop storage, parking, and long-term property value.',
    challenge: 'Limited driveway access and existing site grade required careful foundation planning and material staging coordination.',
    approach: 'Foundation design emphasized drainage management, proper grading, and roofline aesthetics that complement the home architecture.',
    outcome: 'The finished garage provides functional parking, organized storage, and weatherproof workspace while enhancing curb appeal.',
    timeline: '6 to 10 weeks construction window',
    budgetBand: '$60,480-$108,000 typical investment',
    image: '/og-image.webp',
    imageAlt: 'Detached garage construction in Fountain Inn SC with workshop storage and professional installation by Burch Contracting',
    relatedLocationPath: '/fountain-inn-sc/garage-builder',
    relatedCostPath: '/cost/garage-construction-cost-laurens-sc',
    representative: true,
  },
  {
    slug: 'screened-porch-mauldin-sc',
    title: 'Aluminum Screened Porch in Mauldin',
    city: 'Mauldin SC',
    serviceType: 'Screened Porch Builder',
    summary: 'A covered screened porch project in Mauldin focused on outdoor comfort, ventilation, and easy maintenance.',
    challenge: 'Limited backyard depth required efficient layout planning to maximize usable space without overwhelming the property.',
    approach: 'Design emphasized cross-ventilation, afternoon shade management, and durable aluminum screening for long-term performance.',
    outcome: 'The completed porch extended comfortable outdoor living from April through October while protecting furniture from weather.',
    timeline: '4 to 7 weeks construction window',
    budgetBand: '$28,000-$54,000 typical investment',
    image: '/og-image.webp',
    imageAlt: 'Screened porch construction in Mauldin SC with aluminum framing and outdoor living features by Burch Contracting',
    relatedLocationPath: '/mauldin-sc/screened-porches',
    relatedCostPath: '/cost/screened-porch-vs-sunroom-sc',
    representative: true,
  },
  {
    slug: 'room-addition-laurens-sc',
    title: 'Family Room Addition in Laurens',
    city: 'Laurens SC',
    serviceType: 'Room Additions',
    summary: 'A ground-level family room addition in Laurens planned for HVAC integration, roofline matching, and interior flow.',
    challenge: 'Existing crawl space and older home construction required structural assessment and foundation strategy planning.',
    approach: 'Scope development prioritized foundation tie-ins, HVAC capacity verification, and seamless interior transitions.',
    outcome: 'The addition created functional family space that feels original to the home while supporting multigenerational living.',
    timeline: '14 to 20 weeks construction window',
    budgetBand: '$85,000-$145,000 typical investment',
    image: '/og-image.webp',
    imageAlt: 'Room addition construction in Laurens SC with family living space and professional craftsmanship by Burch Contracting',
    relatedLocationPath: '/laurens-sc/room-additions',
    relatedCostPath: '/cost/home-addition-cost-greenville-sc',
    representative: true,
  },
  {
    slug: 'deck-build-woodruff-sc',
    title: 'Composite Deck Build in Woodruff',
    city: 'Woodruff SC',
    serviceType: 'Deck Builder',
    summary: 'A low-maintenance composite deck in Woodruff designed for outdoor entertaining and long-term durability.',
    challenge: 'Sloped backyard grade required multi-level design with proper drainage and stable footing construction.',
    approach: 'Structural planning emphasized proper post depth, composite material selection, and integrated lighting for evening use.',
    outcome: 'The finished deck provides safe outdoor access, comfortable entertaining space, and minimal ongoing maintenance.',
    timeline: '3 to 5 weeks construction window',
    budgetBand: '$38,000-$62,000 typical investment',
    image: '/og-image.webp',
    imageAlt: 'Composite deck construction in Woodruff SC with outdoor entertaining features by Burch Contracting',
    relatedLocationPath: '/woodruff-sc/deck-builder',
    relatedCostPath: '/cost/cost-to-build-a-deck-simpsonville-sc',
    representative: true,
  },
  {
    slug: 'garage-builder-gray-court-sc',
    title: '3-Car Workshop Garage in Gray Court',
    city: 'Gray Court SC',
    serviceType: 'Garage Builder',
    summary: 'A detached 3-car garage with workshop features built for rural property storage and hobbyist workspace needs.',
    challenge: 'Rural site required utility extension planning, longer material delivery coordination, and weather-dependent scheduling.',
    approach: 'Design included upgraded electrical service, enhanced insulation for climate control, and organized storage systems.',
    outcome: 'The garage provides covered parking, professional workspace, and organized storage while complementing the property.',
    timeline: '8 to 12 weeks construction window',
    budgetBand: '$81,600-$134,400 typical investment',
    image: '/og-image.webp',
    imageAlt: '3-car workshop garage construction in Gray Court SC with storage and electrical upgrades by Burch Contracting',
    relatedLocationPath: '/gray-court-sc/garage-builder',
    relatedCostPath: '/cost/garage-construction-cost-laurens-sc',
    representative: true,
  },
];

export function isBrandedProjectImage(image: string) {
  return image === '/images/projects/placeholder.webp';
}

export function getResponsiveProjectImageSet(image: string) {
  if (!image.endsWith('-1200.webp')) {
    return null;
  }

  return {
    mobile: image.replace('-1200.webp', '-800.webp'),
    tablet: image,
    desktop: image.replace('-1200.webp', '-1920.webp'),
  };
}

export function getProjectSpotlightBySlug(slug: string) {
  return projectSpotlights.find((item) => item.slug === slug);
}
