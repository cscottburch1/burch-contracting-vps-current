/**
 * Script to generate service + city landing page data
 * Creates comprehensive SEO-optimized landing pages for all service/city combinations
 * 
 * Usage: npx ts-node scripts/generate-service-city-pages.ts
 */

interface CityInfo {
  name: string;
  displayName: string;
  slug: string;
  characteristics: string[];
}

interface ServiceInfo {
  name: string;
  slug: string;
  keywords: string[];
  priceRanges: {
    label: string;
    range: string;
    details: string;
  }[];
}

// Define all 9 target cities
const cities: CityInfo[] = [
  {
    name: "Simpsonville",
    displayName: "Simpsonville, SC",
    slug: "simpsonville",
    characteristics: ["family-friendly", "growing", "suburban"]
  },
  {
    name: "Fountain Inn",
    displayName: "Fountain Inn, SC",
    slug: "fountain-inn",
    characteristics: ["convenient", "growing", "established"]
  },
  {
    name: "Greenville",
    displayName: "Greenville, SC",
    slug: "greenville",
    characteristics: ["urban", "upscale", "vibrant"]
  },
  {
    name: "Greer",
    displayName: "Greer, SC",
    slug: "greer",
    characteristics: ["historic", "industrial", "growing"]
  },
  {
    name: "Five Forks",
    displayName: "Five Forks, SC",
    slug: "five-forks",
    characteristics: ["family-friendly", "planned", "upscale"]
  },
  {
    name: "Mauldin",
    displayName: "Mauldin, SC",
    slug: "mauldin",
    characteristics: ["established", "mature", "community-focused"]
  },
  {
    name: "Gray Court",
    displayName: "Gray Court, SC",
    slug: "gray-court",
    characteristics: ["rural", "peaceful", "affordable"]
  },
  {
    name: "Woodruff",
    displayName: "Woodruff, SC",
    slug: "woodruff",
    characteristics: ["industrial", "growing", "accessible"]
  },
  {
    name: "Laurens",
    displayName: "Laurens, SC",
    slug: "laurens",
    characteristics: ["historic", "small-town", "community"]
  }
];

// Define all 7 core services with tiered pricing
const services: ServiceInfo[] = [
  {
    name: "Kitchen Remodeling",
    slug: "kitchen-remodeling",
    keywords: ["kitchen remodeling", "custom cabinets", "granite countertops", "modern kitchen"],
    priceRanges: [
      { label: "Kitchen Refresh", range: "$18,000-$36,000", details: "Countertops, fixtures, and finish updates without moving plumbing." },
      { label: "Full Kitchen Remodel", range: "$37,000-$75,000", details: "New cabinetry, appliances, flooring, and lighting improvements." },
      { label: "Premium Custom Kitchen", range: "$76,000-$150,000+", details: "Layout redesign, structural updates, premium materials, and high-end finishes." }
    ]
  },
  {
    name: "Bathroom Remodeling",
    slug: "bathroom-remodeling",
    keywords: ["bathroom remodeling", "bath renovation", "tile shower", "bathroom update"],
    priceRanges: [
      { label: "Bathroom Refresh", range: "$8,000-$16,000", details: "Cosmetic updates: paint, fixtures, vanity, and lighting." },
      { label: "Full Bathroom Remodel", range: "$17,000-$35,000", details: "New shower, tile, vanity, ventilation, and flooring improvements." },
      { label: "Luxury Bathroom", range: "$36,000-$80,000+", details: "Custom tile work, frameless glass, premium fixtures, and specialty features." }
    ]
  },
  {
    name: "Bath to Tile Shower Conversion",
    slug: "bath-to-tile-shower",
    keywords: ["bath to shower conversion", "walk-in shower", "tile shower", "shower conversion"],
    priceRanges: [
      { label: "Standard Conversion", range: "$6,000-$12,000", details: "Remove tub, install shower base, tile walls, basic fixtures." },
      { label: "Upgraded Shower", range: "$13,000-$22,000", details: "Custom tile patterns, ventilation upgrade, premium fixtures." },
      { label: "Premium Walk-In", range: "$23,000-$45,000+", details: "Zero-threshold, frameless glass, heated floors, spa-like features." }
    ]
  },
  {
    name: "Room Additions",
    slug: "room-additions",
    keywords: ["room additions", "bedroom addition", "home expansion", "sunroom"],
    priceRanges: [
      { label: "Single Room Addition", range: "$50,000-$95,000", details: "Modest bedroom or office with foundation, framing, utilities, finish." },
      { label: "Multi-Purpose Addition", range: "$96,000-$185,000", details: "Larger space with HVAC integration, roofing tie-in, full finishes." },
      { label: "Complex Expansion", range: "$186,000-$350,000+", details: "Multi-room, structural engineering, utility relocation, premium finishes." }
    ]
  },
  {
    name: "Decks and Screened Porches",
    slug: "decks-screened-porches",
    keywords: ["deck builder", "screened porch", "outdoor living", "deck construction"],
    priceRanges: [
      { label: "Basic Outdoor Space", range: "$16,000-$30,000", details: "Pressure-treated deck or simple screened porch for entertaining." },
      { label: "Enhanced Outdoor Living", range: "$31,000-$65,000", details: "Composite decking, upgraded screening, lighting, ceiling treatments." },
      { label: "Custom Outdoor Room", range: "$66,000-$135,000+", details: "Premium materials, fireplace options, insulated ceilings, luxury details." }
    ]
  },
  {
    name: "Basement Finishing",
    slug: "basement-finishing",
    keywords: ["basement finishing", "basement remodeling", "finished basement", "basement space"],
    priceRanges: [
      { label: "Utility to Livable", range: "$32-$52 per sq ft", details: "Essential finish: framing, drywall, flooring, paint for usable space." },
      { label: "Lifestyle Upgrade", range: "$53-$82 per sq ft", details: "Improved acoustics, specialty rooms, lighting zones, storage design." },
      { label: "High-End Suite", range: "$83-$130+ per sq ft", details: "Multi-use living space with premium finishes, entertainment features." }
    ]
  },
  {
    name: "Room Additions and Expansions",
    slug: "room-additions-expansions",
    keywords: ["home addition", "room expansion", "house addition", "space expansion"],
    priceRanges: [
      { label: "Modest Addition", range: "$48,000-$92,000", details: "Smaller footprint with standard construction and finishes." },
      { label: "Standard Family Addition", range: "$93,000-$180,000", details: "Medium-sized addition with proper utility integration." },
      { label: "Major Expansion", range: "$181,000-$360,000+", details: "Significant footprint, complex tie-ins, premium specifications." }
    ]
  }
];

// High-priority combinations (Tier 1) - These should be prioritized
const tier1Combinations = [
  // Kitchen - all primary markets
  { service: 0, city: 0 }, // Kitchen Remodeling - Simpsonville
  { service: 0, city: 1 }, // Kitchen Remodeling - Fountain Inn
  { service: 0, city: 2 }, // Kitchen Remodeling - Greenville
  { service: 0, city: 3 }, // Kitchen Remodeling - Greer

  // Bathroom - all primary markets
  { service: 1, city: 0 }, // Bathroom Remodeling - Simpsonville
  { service: 1, city: 1 }, // Bathroom Remodeling - Fountain Inn
  { service: 1, city: 2 }, // Bathroom Remodeling - Greenville
  { service: 1, city: 3 }, // Bathroom Remodeling - Greer

  // Bath to Shower - high intent
  { service: 2, city: 0 }, // Bath to Shower - Simpsonville
  { service: 2, city: 2 }, // Bath to Shower - Greenville
  { service: 2, city: 3 }, // Bath to Shower - Greer

  // Room Additions - primary markets
  { service: 3, city: 2 }, // Room Additions - Greenville
  { service: 3, city: 0 }, // Room Additions - Simpsonville

  // Decks & Porches - primary markets
  { service: 4, city: 0 }, // Decks - Simpsonville
  { service: 4, city: 2 }, // Decks - Greenville

  // Basement - primary markets
  { service: 5, city: 2 }, // Basement - Greenville
];

// Generate slug for service + city combination
function generateSlug(service: ServiceInfo, city: CityInfo): string {
  return `${service.slug}-${city.slug}-sc`;
}

// Generate title
function generateTitle(service: ServiceInfo, city: CityInfo): string {
  return `${service.name} ${city.displayName}`;
}

// Generate meta title (SEO optimized, 50-60 chars)
function generateMetaTitle(service: ServiceInfo, city: CityInfo): string {
  return `${service.name} ${city.displayName} | Burch Contracting`;
}

// Generate meta description (150-160 chars)
function generateMetaDescription(service: ServiceInfo, city: CityInfo): string {
  const serviceType = service.name.toLowerCase();
  return `Professional ${serviceType} in ${city.displayName}. Expert craftsmanship, transparent pricing, free consultation. Licensed & insured contractor. Call today!`;
}

// Generate short description
function generateShortDescription(service: ServiceInfo, city: CityInfo): string {
  const descriptions: Record<string, string> = {
    "kitchen-remodeling": `Transform your ${city.displayName} kitchen into a functional, beautiful space with expert remodeling and thoughtful design.`,
    "bathroom-remodeling": `Modernize your ${city.displayName} bathroom with quality fixtures, beautiful tile work, and updated layouts.`,
    "bath-to-tile-shower": `Replace your old tub with a luxurious walk-in tile shower in ${city.displayName} designed for comfort and accessibility.`,
    "room-additions": `Expand your ${city.displayName} home with professionally built room additions designed to match existing architecture.`,
    "decks-screened-porches": `Create outdoor living spaces in ${city.displayName} with custom decks and screened porches built to last.`,
    "basement-finishing": `Transform your ${city.displayName} basement into beautiful, functional living space for your family.`,
    "room-additions-expansions": `Add valuable square footage to your ${city.displayName} home with expert room additions and expansions.`
  };
  return descriptions[service.slug] || `Professional ${service.name.toLowerCase()} services in ${city.displayName}.`;
}

// Generate keywords
function generateKeywords(service: ServiceInfo, city: CityInfo): string[] {
  const baseKeywords = service.keywords;
  const localized = baseKeywords.map(kw => `${kw} ${city.displayName}`);
  const additional = [
    `${service.name} ${city.name}`,
    `${service.name} ${city.slug}`,
    `Burch Contracting ${city.name}`,
    `contractor ${city.displayName}`
  ];
  return [...localized, ...additional];
}

// Main generator
function generateServiceCityPages() {
  const output: any[] = [];

  tier1Combinations.forEach(combo => {
    const service = services[combo.service];
    const city = cities[combo.city];

    output.push({
      slug: generateSlug(service, city),
      serviceName: service.name,
      city: `${city.displayName}`,
      h1: generateTitle(service, city),
      metaTitle: generateMetaTitle(service, city),
      metaDescription: generateMetaDescription(service, city),
      shortDescription: generateShortDescription(service, city),
      keywords: generateKeywords(service, city),
      priceRanges: service.priceRanges,
      faqs: [] // Base FAQs to be added
    });
  });

  return output;
}

// Execute and output
const generatedPages = generateServiceCityPages();

console.log("Generated Service + City Pages:");
console.log("==============================");
console.log(`Total combinations: ${generatedPages.length}`);
console.log("\nFirst 3 examples:");
generatedPages.slice(0, 3).forEach(page => {
  console.log(`\n- ${page.slug}`);
  console.log(`  Title: ${page.metaTitle}`);
  console.log(`  H1: ${page.h1}`);
});

// Export for use in TypeScript
export const generatedServiceCityPages = generatedPages;
