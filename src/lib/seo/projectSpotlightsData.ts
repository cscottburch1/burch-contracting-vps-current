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
    image: '/images/projects/kitchen-workflow-upgrade-simpsonville.jpg',
    imageAlt: 'Kitchen remodeling planning spotlight in Simpsonville SC',
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
    image: '/og-image.jpg',
    imageAlt: 'Bathroom remodeling planning spotlight in Greenville SC',
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
    image: '/og-image.jpg',
    imageAlt: 'Room addition planning spotlight in Greenville SC',
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
    image: '/og-image.jpg',
    imageAlt: 'Deck building planning spotlight in Simpsonville SC',
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
    image: '/og-image.jpg',
    imageAlt: 'Basement finishing planning spotlight in Greenville SC',
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
    image: '/og-image.jpg',
    imageAlt: 'Screened porch planning spotlight in Five Forks SC',
    relatedLocationPath: '/locations/screened-porch-builder-five-forks-sc',
    representative: true,
  },
];

export function isBrandedProjectImage(image: string) {
  return image === '/images/projects/logo-placeholder.jpg';
}

export function getProjectSpotlightBySlug(slug: string) {
  return projectSpotlights.find((item) => item.slug === slug);
}
