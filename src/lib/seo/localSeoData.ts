export interface PriceRange {
  label: string;
  range: string;
  details: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceLandingPage {
  slug: string;
  serviceName: string;
  city: "Simpsonville SC" | "Fountain Inn SC" | "Greenville SC" | "Greer SC" | "Five Forks SC" | "Mauldin SC" | "Gray Court SC" | "Woodruff SC" | "Laurens SC";
  h1: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  keywords: string[];
  priceRanges: PriceRange[];
  faqs: FaqItem[];
}

export interface LocationPage {
  slug: string;
  city: "Simpsonville SC" | "Fountain Inn SC" | "Greenville SC" | "Greer SC" | "Five Forks SC" | "Mauldin SC" | "Gray Court SC" | "Woodruff SC" | "Laurens SC";
  h1: string;
  metaTitle: string;
  metaDescription: string;
  neighborhoods: string[];
  homeownerGoals: string[];
}

export interface TrustPage {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  leadText: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  queryIntent: string;
  serviceType: string;
  cityFocus: string;
  faqs: FaqItem[];
}

const baseFaqs: FaqItem[] = [
  {
    question: "How soon can Burch Contracting start a remodeling project?",
    answer:
      "Most projects start within 2 to 6 weeks after design approval and material selections. Timeline depends on permitting, product lead times, and project complexity.",
  },
  {
    question: "Do you provide written estimates and scope details?",
    answer:
      "Yes. Every proposal includes scope, allowances, timeline expectations, and payment milestones so homeowners can compare options clearly and make informed decisions.",
  },
  {
    question: "Can you help with permits in Simpsonville and Fountain Inn?",
    answer:
      "Yes. We guide homeowners through local permitting requirements across the Upstate and coordinate inspections so work is code-compliant and documented for future resale value.",
  },
];

export const serviceLandingPages: ServiceLandingPage[] = [
  {
    slug: "bathroom-remodeling-simpsonville-sc",
    serviceName: "Bathroom Remodeling",
    city: "Simpsonville SC",
    h1: "Bathroom Remodeling Simpsonville SC",
    metaTitle: "Bathroom Remodeling Simpsonville SC | Burch Contracting",
    metaDescription:
      "Plan a high-value bathroom remodel with Burch Contracting in Simpsonville SC. Pricing, process, timelines, and design guidance for local homeowners.",
    shortDescription:
      "From guest bath refreshes to primary suite transformations, we build bathrooms that improve comfort, storage, and resale appeal.",
    keywords: ["bathroom remodeling Simpsonville SC", "remodeling contractor Simpsonville SC"],
    priceRanges: [
      { label: "Cosmetic Refresh", range: "$9,000-$16,000", details: "New vanity, fixtures, paint, lighting, and flooring updates without moving plumbing." },
      { label: "Mid-Range Full Remodel", range: "$17,000-$32,000", details: "New shower or tub, tile, vanity package, ventilation upgrades, and layout improvements." },
      { label: "Luxury Bathroom", range: "$33,000-$65,000+", details: "Custom tile shower, frameless glass, premium cabinetry, smart controls, and high-end finishes." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "kitchen-remodeling-simpsonville-sc",
    serviceName: "Kitchen Remodeling",
    city: "Simpsonville SC",
    h1: "Kitchen Remodeling Simpsonville SC",
    metaTitle: "Kitchen Remodeling Simpsonville SC | Burch Contracting",
    metaDescription:
      "Kitchen remodeling in Simpsonville SC with clear pricing, staged construction planning, and design-build support from Burch Contracting.",
    shortDescription:
      "We design kitchens that function better for busy families while elevating style, storage, and long-term home value.",
    keywords: ["kitchen remodeling Simpsonville SC", "home remodeling Simpsonville SC"],
    priceRanges: [
      { label: "Kitchen Update", range: "$20,000-$38,000", details: "Cabinet refinishing or replacement, counters, backsplash, and fixture upgrades." },
      { label: "Full Kitchen Remodel", range: "$39,000-$75,000", details: "New cabinetry, countertops, appliance configuration, flooring, and lighting plan." },
      { label: "Custom Designer Kitchen", range: "$76,000-$140,000+", details: "Layout changes, structural updates, premium appliances, and custom millwork." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "room-additions-simpsonville-sc",
    serviceName: "Room Additions",
    city: "Simpsonville SC",
    h1: "Room Additions Simpsonville SC",
    metaTitle: "Room Additions Simpsonville SC | Burch Contracting",
    metaDescription:
      "Build a code-compliant room addition in Simpsonville SC with Burch Contracting. Learn costs, permitting, design strategy, and project phases.",
    shortDescription:
      "Need more square footage without moving? We build family room, bedroom, and office additions with seamless integration.",
    keywords: ["room additions Simpsonville SC", "remodeling contractor Simpsonville SC"],
    priceRanges: [
      { label: "Small Addition", range: "$55,000-$95,000", details: "Single-room bump-out with foundation, framing, electrical, and finish work." },
      { label: "Mid-Size Addition", range: "$96,000-$180,000", details: "Larger footprint plus HVAC integration, roofing tie-in, and full interior finishes." },
      { label: "Complex Addition", range: "$181,000-$320,000+", details: "Multi-room additions with structural engineering and utility relocation." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "screened-porch-builder-simpsonville-sc",
    serviceName: "Screened Porch Builder",
    city: "Simpsonville SC",
    h1: "Screened Porch Builder Simpsonville SC",
    metaTitle: "Screened Porch Builder Simpsonville SC | Burch Contracting",
    metaDescription:
      "Work with a screened porch builder in Simpsonville SC for durable outdoor living spaces designed for humidity, rain, and family use.",
    shortDescription:
      "We build screened porches that extend your lifestyle outdoors while keeping comfort, airflow, and low maintenance in focus.",
    keywords: ["screened porch builder Simpsonville SC", "home remodeling Simpsonville SC"],
    priceRanges: [
      { label: "Basic Screened Porch", range: "$24,000-$38,000", details: "Covered structure, screen walls, and standard finishes for practical outdoor use." },
      { label: "Enhanced Porch", range: "$39,000-$64,000", details: "Improved ceiling treatments, lighting, fans, and premium screening systems." },
      { label: "Luxury Outdoor Room", range: "$65,000-$120,000+", details: "Insulated roof, fireplace, custom details, and four-season upgrades." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "deck-builder-simpsonville-sc",
    serviceName: "Deck Builder",
    city: "Simpsonville SC",
    h1: "Deck Builder Simpsonville SC",
    metaTitle: "Deck Builder Simpsonville SC | Burch Contracting",
    metaDescription:
      "Hire a local deck builder in Simpsonville SC. Compare wood vs composite options, costs, permitting, and installation process.",
    shortDescription:
      "From entertaining decks to safe family spaces, we design and build structures that match your home and daily routines.",
    keywords: ["deck builder Simpsonville SC", "remodeling contractor Simpsonville SC"],
    priceRanges: [
      { label: "Pressure-Treated Deck", range: "$14,000-$28,000", details: "Strong value for homeowners wanting function-first outdoor space." },
      { label: "Composite Deck", range: "$29,000-$58,000", details: "Low-maintenance material, upgraded rail systems, and long-life performance." },
      { label: "Custom Multi-Level Deck", range: "$59,000-$110,000+", details: "Complex design with stairs, lighting, and premium trim details." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "basement-finishing-simpsonville-sc",
    serviceName: "Basement Finishing",
    city: "Simpsonville SC",
    h1: "Basement Finishing Simpsonville SC",
    metaTitle: "Basement Finishing Simpsonville SC | Burch Contracting",
    metaDescription:
      "Basement finishing in Simpsonville SC for media rooms, guest suites, offices, and flexible family space. See process, costs, and scope.",
    shortDescription:
      "We convert unfinished basements into dry, comfortable, and code-compliant living areas built for long-term value.",
    keywords: ["basement finishing Simpsonville SC", "home remodeling Simpsonville SC"],
    priceRanges: [
      { label: "Basic Finish", range: "$35-$55 per sq ft", details: "Framing, insulation, drywall, flooring, and standard electrical package." },
      { label: "Mid-Range Finish", range: "$56-$85 per sq ft", details: "Additional storage, upgraded lighting, and feature walls or custom trim." },
      { label: "Premium Basement", range: "$86-$130+ per sq ft", details: "Theater room, wet bar, full bath, and luxury finish package." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "bathroom-remodeling-fountain-inn-sc",
    serviceName: "Bathroom Remodeling",
    city: "Fountain Inn SC",
    h1: "Bathroom Remodeling Fountain Inn SC",
    metaTitle: "Bathroom Remodeling Fountain Inn SC | Burch Contracting",
    metaDescription:
      "Bathroom remodeling for Fountain Inn SC homeowners. Build a practical budget, understand material choices, and avoid common renovation mistakes.",
    shortDescription:
      "We help Fountain Inn homeowners create bathrooms that feel cleaner, brighter, and easier to maintain.",
    keywords: ["home remodeling Fountain Inn SC", "bathroom remodeling Fountain Inn SC"],
    priceRanges: [
      { label: "Refresh", range: "$8,500-$15,500", details: "Paint, vanity, fixtures, and targeted cosmetic updates." },
      { label: "Standard Remodel", range: "$16,000-$30,000", details: "Shower upgrade, tile package, vanity improvements, and plumbing updates." },
      { label: "Luxury Primary Bath", range: "$31,000-$62,000+", details: "Custom tile, soaking tub, premium storage, and upgraded lighting plan." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "kitchen-remodeling-fountain-inn-sc",
    serviceName: "Kitchen Remodeling",
    city: "Fountain Inn SC",
    h1: "Kitchen Remodeling Fountain Inn SC",
    metaTitle: "Kitchen Remodeling Fountain Inn SC | Burch Contracting",
    metaDescription:
      "Kitchen remodeling in Fountain Inn SC with practical design guidance and transparent budgeting from local contractor Burch Contracting.",
    shortDescription:
      "Our kitchen remodels improve flow, storage, and finishes so your home works better for everyday living and entertaining.",
    keywords: ["kitchen remodeling Fountain Inn SC", "home remodeling Fountain Inn SC"],
    priceRanges: [
      { label: "Kitchen Refresh", range: "$18,000-$35,000", details: "Countertops, fixtures, partial cabinetry updates, and new finishes." },
      { label: "Comprehensive Remodel", range: "$36,000-$72,000", details: "Cabinet replacement, appliances, flooring, and custom lighting design." },
      { label: "Premium Remodel", range: "$73,000-$135,000+", details: "Structural layout changes and high-end custom interior details." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "room-additions-fountain-inn-sc",
    serviceName: "Room Additions",
    city: "Fountain Inn SC",
    h1: "Room Additions Fountain Inn SC",
    metaTitle: "Room Additions Fountain Inn SC | Burch Contracting",
    metaDescription:
      "Plan a room addition in Fountain Inn SC with realistic pricing, design-build guidance, and code-compliant project planning from Burch Contracting.",
    shortDescription:
      "We help Fountain Inn homeowners add bedrooms, family rooms, and flex spaces without losing sight of budget, daily function, or resale value.",
    keywords: ["room additions Fountain Inn SC", "home remodeling Fountain Inn SC"],
    priceRanges: [
      { label: "Compact Addition", range: "$58,000-$98,000", details: "Smaller bedroom, office, or den addition with standard finishes and utility tie-ins." },
      { label: "Mid-Size Family Addition", range: "$99,000-$185,000", details: "Larger footprint with roofing integration, HVAC extension, and more detailed finish work." },
      { label: "Complex Expansion", range: "$186,000-$325,000+", details: "Multi-room additions, structural engineering, or utility relocation for more complex homesites." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "decks-screened-porches-fountain-inn-sc",
    serviceName: "Decks and Screened Porches",
    city: "Fountain Inn SC",
    h1: "Decks and Screened Porches Fountain Inn SC",
    metaTitle: "Decks and Screened Porches Fountain Inn SC | Burch Contracting",
    metaDescription:
      "Plan decks and screened porches in Fountain Inn SC with realistic installed costs, material comparisons, and local outdoor living design guidance.",
    shortDescription:
      "We help Fountain Inn homeowners create comfortable outdoor living spaces with durable deck framing, screened porch protection, and practical layouts.",
    keywords: ["decks and screened porches Fountain Inn SC", "screened porch builder Fountain Inn SC"],
    priceRanges: [
      { label: "Entry Outdoor Build", range: "$16,000-$29,000", details: "Simple deck layout or starter covered porch for grilling and seating." },
      { label: "Family Outdoor Living Space", range: "$30,000-$64,000", details: "Composite decking, stronger railing package, or a screened porch with lighting and fans." },
      { label: "Custom Outdoor Room", range: "$65,000-$125,000+", details: "Large entertaining layouts with premium details, privacy features, and custom finishes." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "basement-finishing-fountain-inn-sc",
    serviceName: "Basement Finishing",
    city: "Fountain Inn SC",
    h1: "Basement Finishing Fountain Inn SC",
    metaTitle: "Basement Finishing Fountain Inn SC | Burch Contracting",
    metaDescription:
      "Basement finishing services in Fountain Inn SC for extra bedrooms, rec rooms, and home offices with efficient planning and predictable outcomes.",
    shortDescription:
      "Turn underused square footage into a true extension of your home with efficient construction and practical design support.",
    keywords: ["home remodeling Fountain Inn SC", "basement finishing Fountain Inn SC"],
    priceRanges: [
      { label: "Utility to Livable", range: "$32-$52 per sq ft", details: "Essential finish scope for family use and visual consistency." },
      { label: "Lifestyle Upgrade", range: "$53-$82 per sq ft", details: "Adds specialty spaces and better acoustic, lighting, and storage planning." },
      { label: "High-End Basement Suite", range: "$83-$125+ per sq ft", details: "Ideal for multi-use living with custom finishes and premium features." },
    ],
    faqs: baseFaqs,
  },

  // Tier 1: Kitchen Remodeling - Additional Cities
  {
    slug: "kitchen-remodeling-greenville-sc",
    serviceName: "Kitchen Remodeling",
    city: "Greenville SC",
    h1: "Kitchen Remodeling Greenville SC",
    metaTitle: "Kitchen Remodeling Greenville SC | Burch Contracting",
    metaDescription:
      "Professional kitchen remodeling in Greenville SC. Custom designs for historic and modern homes in Greenville's finest neighborhoods.",
    shortDescription:
      "From historic homes to modern condos, we design kitchens that enhance Greenville properties with quality craftsmanship and timeless style.",
    keywords: ["kitchen remodeling Greenville SC", "kitchen design Greenville", "home remodeling Greenville SC"],
    priceRanges: [
      { label: "Kitchen Refresh", range: "$19,000-$38,000", details: "Updates to finishes, fixtures, counters without major layout changes." },
      { label: "Comprehensive Remodel", range: "$39,000-$78,000", details: "New cabinetry, appliances, flooring, and light fixtures with improved workflow." },
      { label: "Custom Designer Kitchen", range: "$79,000-$165,000+", details: "High-end custom cabinetry, premium appliances, and specialized finishes for luxury homes." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "kitchen-remodeling-greer-sc",
    serviceName: "Kitchen Remodeling",
    city: "Greer SC",
    h1: "Kitchen Remodeling Greer SC",
    metaTitle: "Kitchen Remodeling Greer SC | Burch Contracting",
    metaDescription:
      "Transform your Greer kitchen with expert remodeling combining quality craftsmanship, fair pricing, and professional service.",
    shortDescription:
      "We bring experience with both historic mill-area homes and modern Greer properties to create kitchens that work and last.",
    keywords: ["kitchen remodeling Greer SC", "kitchen contractor Greer", "home improvement Greer SC"],
    priceRanges: [
      { label: "Kitchen Update", range: "$18,000-$36,000", details: "Cosmetic and functional improvements without structural changes." },
      { label: "Full Kitchen Remodel", range: "$37,000-$74,000", details: "Complete cabinetry replacement with new appliances and finishes." },
      { label: "Premium Kitchen", range: "$75,000-$155,000+", details: "Custom design with layout optimization and high-end selections." },
    ],
    faqs: baseFaqs,
  },

  // Tier 1: Bathroom Remodeling - Additional Cities
  {
    slug: "bathroom-remodeling-greenville-sc",
    serviceName: "Bathroom Remodeling",
    city: "Greenville SC",
    h1: "Bathroom Remodeling Greenville SC",
    metaTitle: "Bathroom Remodeling Greenville SC | Burch Contracting",
    metaDescription:
      "Expert bathroom remodeling in Greenville SC for luxury finishes, spa-like features, and modern design in historic and contemporary homes.",
    shortDescription:
      "Create your dream bathroom in Greenville with expert design, quality materials, and meticulous craftsmanship.",
    keywords: ["bathroom remodeling Greenville SC", "bath renovation Greenville", "tile shower Greenville"],
    priceRanges: [
      { label: "Bathroom Refresh", range: "$9,000-$18,000", details: "Cosmetic updates to finishes, fixtures, and lighting." },
      { label: "Full Bathroom Remodel", range: "$19,000-$42,000", details: "Complete renovation with new shower, tile, vanity, and finishes." },
      { label: "Luxury Bathroom Suite", range: "$43,000-$95,000+", details: "High-end custom tile, premium fixtures, and spa-inspired features." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "bathroom-remodeling-greer-sc",
    serviceName: "Bathroom Remodeling",
    city: "Greer SC",
    h1: "Bathroom Remodeling Greer SC",
    metaTitle: "Bathroom Remodeling Greer SC | Burch Contracting",
    metaDescription:
      "Professional bathroom remodeling in Greer SC with modern design, quality fixtures, and expert craftsmanship from local contractors.",
    shortDescription:
      "Transform your Greer bathroom into a modern, functional space that enhances your daily life and home value.",
    keywords: ["bathroom remodeling Greer SC", "bathroom renovation Greer", "bath remodel Greer"],
    priceRanges: [
      { label: "Cosmetic Refresh", range: "$8,000-$15,000", details: "Updates to finishes, fixtures, and lighting without plumbing changes." },
      { label: "Full Remodel", range: "$16,000-$38,000", details: "New shower or tub, tile, vanity, and all mechanical upgrades." },
      { label: "Premium Bathroom", range: "$39,000-$85,000+", details: "Custom design with luxury fixtures and high-end finishes." },
    ],
    faqs: baseFaqs,
  },

  // Tier 1: Bath to Tile Shower Conversion - High Intent
  {
    slug: "bath-to-tile-shower-simpsonville-sc",
    serviceName: "Bath to Tile Shower Conversion",
    city: "Simpsonville SC",
    h1: "Bath to Tile Shower Conversion Simpsonville SC",
    metaTitle: "Bath to Tile Shower Conversion Simpsonville SC | Burch Contracting",
    metaDescription:
      "Replace your bathtub with a beautiful walk-in tile shower in Simpsonville SC. Aging-in-place options available. Free consultation.",
    shortDescription:
      "Create a luxurious, accessible walk-in shower perfect for modern living and aging in place in your Simpsonville home.",
    keywords: ["bath to shower conversion Simpsonville", "walk-in shower Simpsonville SC", "tile shower conversion"],
    priceRanges: [
      { label: "Standard Conversion", range: "$6,500-$12,000", details: "Remove tub, install base, tile walls, basic fixtures and hardware." },
      { label: "Custom Walk-In Shower", range: "$13,000-$24,000", details: "Premium tile patterns, upgraded fixtures, better ventilation." },
      { label: "Luxury Accessible Shower", range: "$25,000-$48,000+", details: "Zero-threshold, heated floors, frameless glass, spa-like features." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "bath-to-tile-shower-greenville-sc",
    serviceName: "Bath to Tile Shower Conversion",
    city: "Greenville SC",
    h1: "Bath to Tile Shower Conversion Greenville SC",
    metaTitle: "Bath to Tile Shower Conversion Greenville SC | Burch Contracting",
    metaDescription:
      "Professional bath to tile shower conversions in Greenville SC. Modern walk-in showers for every style and accessibility need.",
    shortDescription:
      "Modernize your Greenville bathroom with a custom walk-in tile shower designed for comfort, safety, and style.",
    keywords: ["bath to shower conversion Greenville SC", "walk-in shower Greenville", "shower conversion Greenville"],
    priceRanges: [
      { label: "Modern Walk-In", range: "$7,000-$13,000", details: "Remove tub, install tiled shower with contemporary design." },
      { label: "Premium Shower", range: "$14,000-$26,000", details: "Custom tile work, upgraded fixtures, enhanced accessibility." },
      { label: "Luxury Spa Shower", range: "$27,000-$50,000+", details: "High-end materials, heated floors, body jets, frameless enclosure." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "bath-to-tile-shower-greer-sc",
    serviceName: "Bath to Tile Shower Conversion",
    city: "Greer SC",
    h1: "Bath to Tile Shower Conversion Greer SC",
    metaTitle: "Bath to Tile Shower Conversion Greer SC | Burch Contracting",
    metaDescription:
      "Convert your Greer bathroom tub to a beautiful walk-in shower. Expert craftsmanship, fair pricing. Free consultation.",
    shortDescription:
      "Replace your old tub with a modern, accessible walk-in shower that enhances your Greer home.",
    keywords: ["bath to shower conversion Greer SC", "tub to shower Greer", "walk-in shower Greer SC"],
    priceRanges: [
      { label: "Standard Conversion", range: "$6,000-$11,000", details: "Basic tub-to-shower conversion with tile and standard fixtures." },
      { label: "Custom Shower", range: "$12,000-$22,000", details: "Premium tile design, better ventilation, improved fixtures." },
      { label: "Accessible Luxury", range: "$23,000-$44,000+", details: "Aging-in-place features, heated floors, premium finishes." },
    ],
    faqs: baseFaqs,
  },

  // Tier 1: Room Additions
  {
    slug: "room-additions-greenville-sc",
    serviceName: "Room Additions",
    city: "Greenville SC",
    h1: "Room Additions Greenville SC",
    metaTitle: "Room Additions Greenville SC | Burch Contracting",
    metaDescription:
      "Build room additions in Greenville SC with expert design, permitting guidance, and quality construction. Expand your home professionally.",
    shortDescription:
      "Add valuable square footage to your Greenville home with professionally designed room additions that complement your existing property.",
    keywords: ["room additions Greenville SC", "home addition Greenville", "bedroom addition Greenville"],
    priceRanges: [
      { label: "Single Room Addition", range: "$58,000-$98,000", details: "Modest bedroom or office addition with full utilities and finishes." },
      { label: "Multi-Purpose Addition", range: "$99,000-$195,000", details: "Larger footprint with HVAC, roofing integration, quality finishes." },
      { label: "Complex Addition", range: "$196,000-$375,000+", details: "Multi-room expansion with structural engineering and premium details." },
    ],
    faqs: baseFaqs,
  },

  // Tier 1: Decks and Screened Porches
  {
    slug: "deck-builder-simpsonville-sc",
    serviceName: "Deck Builder",
    city: "Simpsonville SC",
    h1: "Deck Builder Simpsonville SC",
    metaTitle: "Deck Builder Simpsonville SC | Burch Contracting",
    metaDescription:
      "Custom deck builder in Simpsonville SC. Pressure-treated and composite decks with professional installation. Free consultation.",
    shortDescription:
      "Build beautiful outdoor living spaces in Simpsonville with durable decks designed for style, safety, and longevity.",
    keywords: ["deck builder Simpsonville SC", "deck construction Simpsonville", "custom deck Simpsonville"],
    priceRanges: [
      { label: "Pressure-Treated Deck", range: "$18,000-$32,000", details: "Budget-friendly wood deck with standard design for entertaining." },
      { label: "Composite Deck", range: "$33,000-$58,000", details: "Low-maintenance composite with better durability and appearance." },
      { label: "Premium Custom Deck", range: "$59,000-$120,000+", details: "High-end materials, intricate designs, built-in seating and features." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "deck-builder-greenville-sc",
    serviceName: "Deck Builder",
    city: "Greenville SC",
    h1: "Deck Builder Greenville SC",
    metaTitle: "Deck Builder Greenville SC | Burch Contracting",
    metaDescription:
      "Professional deck builder serving Greenville SC with custom deck design, quality construction, and long-lasting materials.",
    shortDescription:
      "Create the perfect outdoor entertaining space in Greenville with a custom-built deck that enhances your home and lifestyle.",
    keywords: ["deck builder Greenville SC", "deck construction Greenville", "outdoor deck Greenville"],
    priceRanges: [
      { label: "Standard Deck", range: "$20,000-$36,000", details: "Traditional wood or composite deck design for outdoor entertaining." },
      { label: "Premium Deck", range: "$37,000-$65,000", details: "Enhanced materials, improved design, built-in features." },
      { label: "Luxury Outdoor Space", range: "$66,000-$135,000+", details: "High-end composite, integrated lighting, premium accessories." },
    ],
    faqs: baseFaqs,
  },

  // Tier 1: Basement Finishing
  {
    slug: "basement-finishing-greenville-sc",
    serviceName: "Basement Finishing",
    city: "Greenville SC",
    h1: "Basement Finishing Greenville SC",
    metaTitle: "Basement Finishing Greenville SC | Burch Contracting",
    metaDescription:
      "Basement finishing in Greenville SC creates beautiful living spaces from unused square footage. Expert design and construction.",
    shortDescription:
      "Transform your Greenville basement into an additional living space with expert finishing that adds comfort and home value.",
    keywords: ["basement finishing Greenville SC", "finished basement Greenville", "basement remodeling Greenville"],
    priceRanges: [
      { label: "Functional Basement", range: "$35-$55 per sq ft", details: "Essential finish work for usable family space." },
      { label: "Quality Living Space", range: "$56-$85 per sq ft", details: "Better design, improved acoustics, specialty room planning." },
      { label: "Premium Basement Suite", range: "$86-$140+ per sq ft", details: "High-end finishes, multi-use spaces, premium features." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "screened-porch-builder-greenville-sc",
    serviceName: "Screened Porch Builder",
    city: "Greenville SC",
    h1: "Screened Porch Builder Greenville SC",
    metaTitle: "Screened Porch Builder Greenville SC | Burch Contracting",
    metaDescription:
      "Build a screened porch in Greenville SC with a contractor focused on airflow, durability, and outdoor living that fits your home.",
    shortDescription:
      "We design screened porches in Greenville that create a comfortable outdoor room without losing the character of your home.",
    keywords: ["screened porch builder Greenville SC", "screened porch Greenville SC", "outdoor living Greenville SC"],
    priceRanges: [
      { label: "Covered Porch", range: "$26,000-$42,000", details: "Roofed porch enclosure with practical finishes and a durable screen system." },
      { label: "Enhanced Porch", range: "$43,000-$72,000", details: "Adds better ceilings, lighting, fans, and upgraded trim details." },
      { label: "Luxury Outdoor Room", range: "$73,000-$145,000+", details: "Premium design with fireplace options, insulation upgrades, and custom finishes." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "screened-porch-builder-greer-sc",
    serviceName: "Screened Porch Builder",
    city: "Greer SC",
    h1: "Screened Porch Builder Greer SC",
    metaTitle: "Screened Porch Builder Greer SC | Burch Contracting",
    metaDescription:
      "Professional screened porch construction in Greer SC for outdoor dining, relaxing, and low-maintenance family use.",
    shortDescription:
      "We build screened porches in Greer that add usable outdoor space while protecting comfort through humid South Carolina seasons.",
    keywords: ["screened porch builder Greer SC", "screened porch Greer SC", "porch contractor Greer SC"],
    priceRanges: [
      { label: "Standard Porch", range: "$24,000-$40,000", details: "Simple covered porch enclosure sized for seating and daily use." },
      { label: "Family Porch", range: "$41,000-$68,000", details: "Adds lighting, fans, upgraded materials, and stronger finish details." },
      { label: "Premium Outdoor Space", range: "$69,000-$140,000+", details: "Custom outdoor room detailing with premium materials and comfort upgrades." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "screened-porch-builder-five-forks-sc",
    serviceName: "Screened Porch Builder",
    city: "Five Forks SC",
    h1: "Screened Porch Builder Five Forks SC",
    metaTitle: "Screened Porch Builder Five Forks SC | Burch Contracting",
    metaDescription:
      "Custom screened porch builder in Five Forks SC for family-friendly outdoor spaces with strong resale appeal.",
    shortDescription:
      "We help Five Forks homeowners create screened porches that make outdoor dining and family time more comfortable year-round.",
    keywords: ["screened porch builder Five Forks SC", "screened porch Five Forks SC", "outdoor room Five Forks SC"],
    priceRanges: [
      { label: "Entry Porch", range: "$25,000-$41,000", details: "Covered screened porch with practical layout and everyday durability." },
      { label: "Enhanced Family Porch", range: "$42,000-$70,000", details: "Better finishes, fan prep, and material upgrades for active households." },
      { label: "Premium Porch Retreat", range: "$71,000-$142,000+", details: "Custom layout, premium trim, and upgraded comfort features." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "screened-porch-builder-mauldin-sc",
    serviceName: "Screened Porch Builder",
    city: "Mauldin SC",
    h1: "Screened Porch Builder Mauldin SC",
    metaTitle: "Screened Porch Builder Mauldin SC | Burch Contracting",
    metaDescription:
      "Screened porch construction in Mauldin SC for established homes that need better outdoor flow and low-maintenance comfort.",
    shortDescription:
      "We build Mauldin screened porches that extend everyday living space while improving outdoor usability and home value.",
    keywords: ["screened porch builder Mauldin SC", "screened porch Mauldin SC", "porch contractor Mauldin SC"],
    priceRanges: [
      { label: "Basic Porch", range: "$24,000-$39,000", details: "Solid screened structure for seating, dining, and light entertaining." },
      { label: "Upgraded Porch", range: "$40,000-$67,000", details: "Better finishes, lighting, and fan provisions for year-round comfort." },
      { label: "Custom Outdoor Room", range: "$68,000-$138,000+", details: "Premium design with more detailed trim, ceiling, and enclosure upgrades." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "kitchen-remodeling-five-forks-sc",
    serviceName: "Kitchen Remodeling",
    city: "Five Forks SC",
    h1: "Kitchen Remodeling Five Forks SC",
    metaTitle: "Kitchen Remodeling Five Forks SC | Burch Contracting",
    metaDescription:
      "Kitchen remodeling in Five Forks SC for busy households that need better storage, flow, and high-value finish choices.",
    shortDescription:
      "We help Five Forks homeowners build kitchens that feel organized, durable, and better suited for modern family routines.",
    keywords: ["kitchen remodeling Five Forks SC", "kitchen remodel Five Forks SC", "home remodeling Five Forks SC"],
    priceRanges: [
      { label: "Kitchen Refresh", range: "$18,000-$36,000", details: "Surface upgrades, counters, and fixture improvements without full structural change." },
      { label: "Full Remodel", range: "$37,000-$74,000", details: "Cabinets, counters, flooring, and layout tuning for better daily workflow." },
      { label: "Custom Kitchen", range: "$75,000-$150,000+", details: "Premium cabinetry, design upgrades, and higher-end appliance integration." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "kitchen-remodeling-mauldin-sc",
    serviceName: "Kitchen Remodeling",
    city: "Mauldin SC",
    h1: "Kitchen Remodeling Mauldin SC",
    metaTitle: "Kitchen Remodeling Mauldin SC | Burch Contracting",
    metaDescription:
      "Kitchen remodeling in Mauldin SC for older homes that need better layouts, updated finishes, and stronger resale appeal.",
    shortDescription:
      "We modernize Mauldin kitchens with practical design decisions that improve prep zones, storage, and everyday comfort.",
    keywords: ["kitchen remodeling Mauldin SC", "kitchen remodel Mauldin SC", "home remodeling Mauldin SC"],
    priceRanges: [
      { label: "Kitchen Update", range: "$19,000-$38,000", details: "Finish, counter, and fixture upgrades with limited layout movement." },
      { label: "Comprehensive Remodel", range: "$39,000-$76,000", details: "Cabinet replacement, flooring, lighting, and better workflow planning." },
      { label: "Premium Kitchen", range: "$77,000-$160,000+", details: "Higher-end design package with premium finishes and major functional upgrades." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "kitchen-remodeling-woodruff-sc",
    serviceName: "Kitchen Remodeling",
    city: "Woodruff SC",
    h1: "Kitchen Remodeling Woodruff SC",
    metaTitle: "Kitchen Remodeling Woodruff SC | Burch Contracting",
    metaDescription:
      "Transform your Woodruff kitchen with a remodeling contractor focused on quality workmanship, practical budgets, and strong design choices.",
    shortDescription:
      "We help Woodruff homeowners update kitchens for better storage, stronger finishes, and more comfortable daily use.",
    keywords: ["kitchen remodeling Woodruff SC", "kitchen remodel Woodruff SC", "home remodeling Woodruff SC"],
    priceRanges: [
      { label: "Kitchen Refresh", range: "$17,000-$35,000", details: "Targeted improvements that update appearance and improve everyday usability." },
      { label: "Full Remodel", range: "$36,000-$72,000", details: "Cabinets, counters, appliances, lighting, and layout improvements." },
      { label: "Custom Premium Kitchen", range: "$73,000-$155,000+", details: "Comprehensive remodel with premium materials and more advanced design changes." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "kitchen-remodeling-laurens-sc",
    serviceName: "Kitchen Remodeling",
    city: "Laurens SC",
    h1: "Kitchen Remodeling Laurens SC",
    metaTitle: "Kitchen Remodeling Laurens SC | Burch Contracting",
    metaDescription:
      "Kitchen remodeling in Laurens SC with realistic pricing, durable finish guidance, and local contractor support from planning through closeout.",
    shortDescription:
      "We design Laurens kitchen remodels around storage, long-term durability, and practical investment choices for homeowners.",
    keywords: ["kitchen remodeling Laurens SC", "kitchen remodel Laurens SC", "home remodeling Laurens SC"],
    priceRanges: [
      { label: "Kitchen Refresh", range: "$17,000-$34,000", details: "Counter, fixture, backsplash, and finish updates without major structural changes." },
      { label: "Full Remodel", range: "$35,000-$70,000", details: "Cabinet replacement, counters, flooring, and improved functional layout planning." },
      { label: "Custom Kitchen", range: "$71,000-$148,000+", details: "Premium finishes, storage upgrades, and higher-end appliance planning." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "bathroom-remodeling-five-forks-sc",
    serviceName: "Bathroom Remodeling",
    city: "Five Forks SC",
    h1: "Bathroom Remodeling Five Forks SC",
    metaTitle: "Bathroom Remodeling Five Forks SC | Burch Contracting",
    metaDescription:
      "Bathroom remodeling in Five Forks SC with better storage, shower planning, and finish guidance for busy family homes.",
    shortDescription:
      "We help Five Forks homeowners build bathrooms that are easier to use, easier to maintain, and better aligned with resale goals.",
    keywords: ["bathroom remodeling Five Forks SC", "bath remodel Five Forks SC", "bathroom renovation Five Forks SC"],
    priceRanges: [
      { label: "Bath Refresh", range: "$8,500-$16,000", details: "Targeted cosmetic upgrades that improve function and visual consistency." },
      { label: "Full Remodel", range: "$17,000-$36,000", details: "New shower or tub, vanity package, tile, and mechanical upgrades." },
      { label: "Premium Bathroom", range: "$37,000-$78,000+", details: "Custom tile shower, premium fixtures, storage upgrades, and spa-like design choices." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "bathroom-remodeling-mauldin-sc",
    serviceName: "Bathroom Remodeling",
    city: "Mauldin SC",
    h1: "Bathroom Remodeling Mauldin SC",
    metaTitle: "Bathroom Remodeling Mauldin SC | Burch Contracting",
    metaDescription:
      "Bathroom remodeling in Mauldin SC for established homes that need updated shower layouts, fixtures, and better storage.",
    shortDescription:
      "We modernize Mauldin bathrooms with smart layout choices, durable materials, and cleaner everyday function.",
    keywords: ["bathroom remodeling Mauldin SC", "bath remodel Mauldin SC", "bathroom renovation Mauldin SC"],
    priceRanges: [
      { label: "Cosmetic Refresh", range: "$8,000-$15,500", details: "Vanity, fixtures, flooring, and finish updates for a stronger everyday experience." },
      { label: "Full Remodel", range: "$16,000-$35,000", details: "A full renovation with better shower planning, tile, ventilation, and storage." },
      { label: "Luxury Bathroom", range: "$36,000-$75,000+", details: "Premium fixtures, custom tile work, and design-driven upgrades." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "room-additions-five-forks-sc",
    serviceName: "Room Additions",
    city: "Five Forks SC",
    h1: "Room Additions Five Forks SC",
    metaTitle: "Room Additions Five Forks SC | Burch Contracting",
    metaDescription:
      "Build room additions in Five Forks SC for growing households that need more space without leaving the neighborhood they want.",
    shortDescription:
      "We build Five Forks room additions that create flexible square footage while keeping design and resale goals aligned.",
    keywords: ["room additions Five Forks SC", "home addition Five Forks SC", "home expansion Five Forks SC"],
    priceRanges: [
      { label: "Single Room Addition", range: "$56,000-$94,000", details: "Office, bedroom, or den addition with standard utility tie-ins and finish work." },
      { label: "Multi-Purpose Addition", range: "$95,000-$185,000", details: "Larger family-focused addition with roof, HVAC, and full interior finishing." },
      { label: "Complex Expansion", range: "$186,000-$360,000+", details: "More advanced additions with structural changes or multi-room planning." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "room-additions-mauldin-sc",
    serviceName: "Room Additions",
    city: "Mauldin SC",
    h1: "Room Additions Mauldin SC",
    metaTitle: "Room Additions Mauldin SC | Burch Contracting",
    metaDescription:
      "Add square footage to your Mauldin home with a room addition planned for existing neighborhoods, utility tie-ins, and long-term value.",
    shortDescription:
      "We help Mauldin homeowners expand without sacrificing flow, curb appeal, or realistic budget planning.",
    keywords: ["room additions Mauldin SC", "home addition Mauldin SC", "room expansion Mauldin SC"],
    priceRanges: [
      { label: "Small Addition", range: "$54,000-$92,000", details: "A smaller addition that delivers more usable living space and better layout options." },
      { label: "Mid-Size Addition", range: "$93,000-$180,000", details: "Family-focused addition with roofing, HVAC, and finish integration." },
      { label: "Complex Addition", range: "$181,000-$355,000+", details: "Larger expansions with engineering, structural work, and premium finishes." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "basement-finishing-five-forks-sc",
    serviceName: "Basement Finishing",
    city: "Five Forks SC",
    h1: "Basement Finishing Five Forks SC",
    metaTitle: "Basement Finishing Five Forks SC | Burch Contracting",
    metaDescription:
      "Basement finishing in Five Forks SC for family rooms, home offices, guest space, and better everyday flexibility.",
    shortDescription:
      "We convert underused Five Forks basements into comfortable, functional living space with practical planning and code-compliant finishes.",
    keywords: ["basement finishing Five Forks SC", "finished basement Five Forks SC", "basement remodeling Five Forks SC"],
    priceRanges: [
      { label: "Functional Basement", range: "$32-$52 per sq ft", details: "Essential finish work that turns unfinished square footage into usable family space." },
      { label: "Quality Living Space", range: "$53-$82 per sq ft", details: "Better lighting, storage, room zoning, and upgraded finish choices." },
      { label: "Premium Suite", range: "$83-$135+ per sq ft", details: "Higher-end finish package with specialty room planning and custom details." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "basement-finishing-mauldin-sc",
    serviceName: "Basement Finishing",
    city: "Mauldin SC",
    h1: "Basement Finishing Mauldin SC",
    metaTitle: "Basement Finishing Mauldin SC | Burch Contracting",
    metaDescription:
      "Professional basement finishing in Mauldin SC for homeowners who want more living space without the cost of moving.",
    shortDescription:
      "We finish Mauldin basements with practical layouts, moisture-aware planning, and durable materials that hold up long-term.",
    keywords: ["basement finishing Mauldin SC", "finished basement Mauldin SC", "basement remodel Mauldin SC"],
    priceRanges: [
      { label: "Utility to Livable", range: "$34-$54 per sq ft", details: "Core finish work that creates flexible living space and better home function." },
      { label: "Lifestyle Upgrade", range: "$55-$84 per sq ft", details: "Adds better lighting, acoustic planning, storage, and specialty room options." },
      { label: "High-End Suite", range: "$85-$138+ per sq ft", details: "Premium finishes for a more complete extension of the main home." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "deck-builder-five-forks-sc",
    serviceName: "Deck Builder",
    city: "Five Forks SC",
    h1: "Deck Builder Five Forks SC",
    metaTitle: "Deck Builder Five Forks SC | Burch Contracting",
    metaDescription:
      "Custom deck builder in Five Forks SC for outdoor entertaining, family use, and low-maintenance backyard upgrades.",
    shortDescription:
      "We design and build Five Forks decks that improve traffic flow, durability, and everyday outdoor usability.",
    keywords: ["deck builder Five Forks SC", "deck construction Five Forks SC", "composite deck Five Forks SC"],
    priceRanges: [
      { label: "Pressure-Treated Deck", range: "$19,000-$34,000", details: "Budget-conscious outdoor space with strong structural planning and practical finishes." },
      { label: "Composite Deck", range: "$35,000-$62,000", details: "Lower-maintenance deck package with upgraded appearance and longevity." },
      { label: "Premium Custom Deck", range: "$63,000-$130,000+", details: "Custom deck layout with more advanced details, lighting, and built-in features." },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "deck-builder-mauldin-sc",
    serviceName: "Deck Builder",
    city: "Mauldin SC",
    h1: "Deck Builder Mauldin SC",
    metaTitle: "Deck Builder Mauldin SC | Burch Contracting",
    metaDescription:
      "Professional deck building in Mauldin SC for homeowners who want stronger outdoor flow, safe access, and better backyard value.",
    shortDescription:
      "We build Mauldin decks that match established homes and support everyday family use, entertaining, and long-term durability.",
    keywords: ["deck builder Mauldin SC", "deck construction Mauldin SC", "custom deck Mauldin SC"],
    priceRanges: [
      { label: "Standard Deck", range: "$20,000-$35,000", details: "Straightforward deck build with quality framing and practical finish choices." },
      { label: "Premium Deck", range: "$36,000-$64,000", details: "Upgraded materials and design details with stronger long-term value." },
      { label: "Luxury Custom Deck", range: "$65,000-$135,000+", details: "More complex design with premium materials and integrated features." },
    ],
    faqs: baseFaqs,
  },
];

export const legacyServiceSlugs = [
  "handyman",
  "remodeling",
  "additions",
  "basement",
] as const;

export const locationPages: LocationPage[] = [
  {
    slug: "simpsonville-sc",
    city: "Simpsonville SC",
    h1: "Remodeling Contractor Simpsonville SC",
    metaTitle: "Remodeling Contractor Simpsonville SC | Burch Contracting",
    metaDescription:
      "Burch Contracting is a local remodeling contractor in Simpsonville SC for kitchens, bathrooms, additions, decks, screened porches, and basements.",
    neighborhoods: ["Five Forks", "Downtown Simpsonville", "Harrison Bridge", "Fox Run", "Morning Mist"],
    homeownerGoals: [
      "Improve resale value before listing",
      "Modernize layouts for open living",
      "Create multigenerational living space",
      "Build outdoor entertaining zones",
    ],
  },
  {
    slug: "fountain-inn-sc",
    city: "Fountain Inn SC",
    h1: "Remodeling Contractor Fountain Inn SC",
    metaTitle: "Remodeling Contractor Fountain Inn SC | Burch Contracting",
    metaDescription:
      "Home remodeling Fountain Inn SC with Burch Contracting. Get local expertise, transparent estimates, and quality craftsmanship.",
    neighborhoods: ["City Center", "Whispering Pines", "Fairview Area", "Jones Mill Corridor", "Durbin Area"],
    homeownerGoals: [
      "Expand living space without moving",
      "Upgrade kitchens and baths for daily comfort",
      "Add deck and porch value for family gatherings",
      "Finish basement or bonus spaces for flexibility",
    ],
  },
  {
    slug: "greenville-sc",
    city: "Greenville SC",
    h1: "Remodeling Contractor Greenville SC",
    metaTitle: "Remodeling Contractor Greenville SC | Burch Contracting",
    metaDescription:
      "Burch Contracting helps Greenville SC homeowners plan kitchens, bathrooms, additions, decks, porches, and basement finishing with clear estimates.",
    neighborhoods: ["North Main", "Augusta Road", "Verdae", "Downtown Greenville", "Overbrook"],
    homeownerGoals: [
      "Modernize outdated kitchens and baths",
      "Improve resale value in strong neighborhoods",
      "Create better outdoor living for entertaining",
      "Add flexible living space without moving",
    ],
  },
  {
    slug: "greer-sc",
    city: "Greer SC",
    h1: "Remodeling Contractor Greer SC",
    metaTitle: "Remodeling Contractor Greer SC | Burch Contracting",
    metaDescription:
      "Greer SC remodeling contractor for kitchens, bathrooms, additions, decks, porches, and practical home updates with transparent planning.",
    neighborhoods: ["Downtown Greer", "Sugar Creek", "Brushy Creek", "Wade Hampton Corridor", "Pelham Falls"],
    homeownerGoals: [
      "Update older homes for modern function",
      "Improve bathrooms for aging-in-place comfort",
      "Add outdoor living and entertaining space",
      "Plan additions for growing households",
    ],
  },
  {
    slug: "five-forks-sc",
    city: "Five Forks SC",
    h1: "Remodeling Contractor Five Forks SC",
    metaTitle: "Remodeling Contractor Five Forks SC | Burch Contracting",
    metaDescription:
      "Five Forks SC remodeling contractor for kitchens, bathrooms, additions, basements, decks, and screened porches built around family living.",
    neighborhoods: ["Five Forks Plantation", "Heritage", "Neely Farm", "Garfield Park", "The Columns"],
    homeownerGoals: [
      "Upgrade kitchens for busy family routines",
      "Finish basements for flexible living space",
      "Create outdoor entertaining areas",
      "Increase resale value before listing",
    ],
  },
  {
    slug: "mauldin-sc",
    city: "Mauldin SC",
    h1: "Remodeling Contractor Mauldin SC",
    metaTitle: "Remodeling Contractor Mauldin SC | Burch Contracting",
    metaDescription:
      "Mauldin SC remodeling contractor for established homes needing kitchen, bath, deck, porch, basement, and addition upgrades.",
    neighborhoods: ["Butler Road", "Murray Drive area", "Sunset Heights", "Mauldin East", "Forrester Woods"],
    homeownerGoals: [
      "Modernize aging kitchens and bathrooms",
      "Add square footage without relocating",
      "Improve curb appeal and backyard usability",
      "Plan updates that protect long-term value",
    ],
  },
  {
    slug: "gray-court-sc",
    city: "Gray Court SC",
    h1: "Remodeling Contractor Gray Court SC",
    metaTitle: "Remodeling Contractor Gray Court SC | Burch Contracting",
    metaDescription:
      "Gray Court SC remodeling contractor for rural homes, additions, decks, porches, and practical renovations with clear scope planning.",
    neighborhoods: ["Town Center", "Highway 14 Corridor", "Rural Acreage", "Durbin Creek area", "Owings community"],
    homeownerGoals: [
      "Improve older homes with durable materials",
      "Add covered outdoor space for country living",
      "Expand homes for multigenerational needs",
      "Plan renovations that fit rural properties",
    ],
  },
  {
    slug: "woodruff-sc",
    city: "Woodruff SC",
    h1: "Remodeling Contractor Woodruff SC",
    metaTitle: "Remodeling Contractor Woodruff SC | Burch Contracting",
    metaDescription:
      "Woodruff SC remodeling contractor for kitchen, bathroom, basement, deck, porch, and addition projects with honest pricing and quality workmanship.",
    neighborhoods: ["Downtown Woodruff", "Cross Anchor Road area", "Kilgore Farms vicinity", "Enoree Road corridor", "West Woodruff"],
    homeownerGoals: [
      "Update kitchens and baths for daily comfort",
      "Improve outdoor living with decks and porches",
      "Finish basements or bonus spaces",
      "Protect value with smart remodeling investments",
    ],
  },
  {
    slug: "laurens-sc",
    city: "Laurens SC",
    h1: "Remodeling Contractor Laurens SC",
    metaTitle: "Remodeling Contractor Laurens SC | Burch Contracting",
    metaDescription:
      "Laurens SC remodeling contractor for kitchen, bath, addition, deck, porch, and basement projects with realistic budgets and quality construction.",
    neighborhoods: ["Downtown Laurens", "West Main area", "Mill Village", "Clinton Road corridor", "Lake Rabon vicinity"],
    homeownerGoals: [
      "Upgrade high-impact rooms before resale",
      "Improve storage and layout in older homes",
      "Add outdoor living for family gatherings",
      "Create more functional square footage",
    ],
  },
];

export const trustPages: TrustPage[] = [
  {
    slug: "customer-reviews",
    h1: "Customer Reviews",
    metaTitle: "Customer Reviews | Burch Contracting",
    metaDescription:
      "Read homeowner feedback about remodeling projects completed by Burch Contracting in Simpsonville and Fountain Inn, SC.",
    leadText:
      "Homeowners choose Burch Contracting for communication, craftsmanship, and predictable project execution from consultation to closeout.",
  },
  {
    slug: "financing-options",
    h1: "Financing Options",
    metaTitle: "Financing Options for Remodeling | Burch Contracting",
    metaDescription:
      "Learn practical financing options for bathroom, kitchen, basement, and outdoor remodeling projects in Simpsonville and Fountain Inn.",
    leadText:
      "A well-structured financing plan helps homeowners start high-impact remodeling projects sooner while protecting monthly cash flow.",
  },
  {
    slug: "remodeling-process",
    h1: "Remodeling Process",
    metaTitle: "Our Remodeling Process | Burch Contracting",
    metaDescription:
      "Understand Burch Contracting's remodeling process, from planning and design through construction, quality control, and final walkthrough.",
    leadText:
      "A documented process is the difference between stressful projects and confident projects. We set expectations clearly before work begins.",
  },
  {
    slug: "warranty-information",
    h1: "Warranty Information",
    metaTitle: "Warranty Information | Burch Contracting",
    metaDescription:
      "Review workmanship and product warranty information for remodeling projects completed by Burch Contracting.",
    leadText:
      "A quality warranty protects your investment and confirms accountability long after construction is complete.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "cost-of-bathroom-remodeling-simpsonville-sc",
    title: "Cost of Bathroom Remodeling Simpsonville SC",
    metaTitle: "Cost of Bathroom Remodeling Simpsonville SC (2026 Guide)",
    metaDescription:
      "Bathroom remodeling cost guide for Simpsonville SC homeowners: price ranges, scope options, hidden costs, and budgeting strategy.",
    queryIntent: "cost",
    serviceType: "Bathroom Remodeling",
    cityFocus: "Simpsonville SC",
    faqs: baseFaqs,
  },
  {
    slug: "kitchen-remodel-cost-fountain-inn-sc",
    title: "Kitchen Remodel Cost Fountain Inn SC",
    metaTitle: "Kitchen Remodel Cost Fountain Inn SC (2026)",
    metaDescription:
      "Understand realistic kitchen remodel costs in Fountain Inn SC, including labor, cabinets, counters, flooring, and contingency planning.",
    queryIntent: "cost",
    serviceType: "Kitchen Remodeling",
    cityFocus: "Fountain Inn SC",
    faqs: baseFaqs,
  },
  {
    slug: "how-much-does-a-screened-porch-cost-in-south-carolina",
    title: "How Much Does a Screened Porch Cost in South Carolina?",
    metaTitle: "How Much Does a Screened Porch Cost in South Carolina?",
    metaDescription:
      "A practical South Carolina screened porch cost guide covering material options, labor, permit factors, and long-term value.",
    queryIntent: "cost",
    serviceType: "Screened Porch Builder",
    cityFocus: "South Carolina",
    faqs: baseFaqs,
  },
  {
    slug: "average-cost-of-basement-finishing-in-south-carolina",
    title: "Average Cost of Basement Finishing in South Carolina",
    metaTitle: "Average Cost of Basement Finishing in South Carolina",
    metaDescription:
      "Break down basement finishing costs in South Carolina with a detailed look at scope levels, permits, materials, and design decisions.",
    queryIntent: "cost",
    serviceType: "Basement Finishing",
    cityFocus: "South Carolina",
    faqs: baseFaqs,
  },
  {
    slug: "deck-building-cost-simpsonville-sc",
    title: "Deck Building Cost Simpsonville SC",
    metaTitle: "Deck Building Cost Simpsonville SC (2026)",
    metaDescription:
      "See realistic deck building costs in Simpsonville SC for pressure-treated and composite decks with pricing and planning tips.",
    queryIntent: "cost",
    serviceType: "Deck Builder",
    cityFocus: "Simpsonville SC",
    faqs: baseFaqs,
  },
  {
    slug: "best-bathroom-tile-options-for-remodels",
    title: "Best Bathroom Tile Options for Remodels",
    metaTitle: "Best Bathroom Tile Options for Remodels",
    metaDescription:
      "Compare ceramic, porcelain, natural stone, and large-format tile options for a durable, style-forward bathroom remodel.",
    queryIntent: "comparison",
    serviceType: "Bathroom Remodeling",
    cityFocus: "Upstate South Carolina",
    faqs: baseFaqs,
  },
  {
    slug: "how-long-does-a-kitchen-remodel-take",
    title: "How Long Does a Kitchen Remodel Take?",
    metaTitle: "How Long Does a Kitchen Remodel Take? Timeline Guide",
    metaDescription:
      "Plan your kitchen remodel timeline with a phase-by-phase guide that helps homeowners avoid avoidable schedule delays.",
    queryIntent: "timeline",
    serviceType: "Kitchen Remodeling",
    cityFocus: "Simpsonville and Fountain Inn SC",
    faqs: baseFaqs,
  },
  {
    slug: "room-addition-cost-in-south-carolina",
    title: "Room Addition Cost in South Carolina",
    metaTitle: "Room Addition Cost in South Carolina (2026)",
    metaDescription:
      "Understand room addition costs in South Carolina by project type, complexity, permitting, and design requirements.",
    queryIntent: "cost",
    serviceType: "Room Additions",
    cityFocus: "South Carolina",
    faqs: baseFaqs,
  },
  {
    slug: "do-you-need-permits-for-remodeling-in-simpsonville-sc",
    title: "Do You Need Permits for Remodeling in Simpsonville SC?",
    metaTitle: "Do You Need Permits for Remodeling in Simpsonville SC?",
    metaDescription:
      "A homeowner guide to remodeling permits in Simpsonville SC including common permit triggers and how to avoid costly mistakes.",
    queryIntent: "permit",
    serviceType: "Remodeling Contractor",
    cityFocus: "Simpsonville SC",
    faqs: baseFaqs,
  },
  {
    slug: "best-home-improvements-for-property-value-in-south-carolina",
    title: "Best Home Improvements for Property Value in South Carolina",
    metaTitle: "Best Home Improvements for Property Value in South Carolina",
    metaDescription:
      "See the highest-impact home improvement projects for South Carolina resale value and buyer appeal.",
    queryIntent: "value",
    serviceType: "Home Remodeling",
    cityFocus: "South Carolina",
    faqs: baseFaqs,
  },
  {
    slug: "bath-to-shower-conversion-cost-south-carolina",
    title: "Bath to Shower Conversion Cost South Carolina",
    metaTitle: "Bath to Shower Conversion Cost South Carolina (2026 Guide)",
    metaDescription:
      "Complete cost guide for converting a tub to a tile walk-in shower in South Carolina. Price ranges, scope options, and what drives the budget.",
    queryIntent: "cost",
    serviceType: "Bath to Shower Conversion",
    cityFocus: "South Carolina",
    faqs: baseFaqs,
  },
  {
    slug: "composite-vs-pressure-treated-deck-which-is-better",
    title: "Composite vs Pressure-Treated Deck: Which Is Better?",
    metaTitle: "Composite vs Pressure-Treated Deck: Which Is Better for SC Homeowners?",
    metaDescription:
      "Compare composite and pressure-treated wood decking for South Carolina homes. Cost, maintenance, lifespan, and which makes sense for your budget.",
    queryIntent: "comparison",
    serviceType: "Deck Builder",
    cityFocus: "Upstate South Carolina",
    faqs: baseFaqs,
  },
  {
    slug: "how-to-plan-a-kitchen-remodel-step-by-step",
    title: "How to Plan a Kitchen Remodel Step by Step",
    metaTitle: "How to Plan a Kitchen Remodel Step by Step (Homeowner Guide)",
    metaDescription:
      "A practical step-by-step planning guide for kitchen remodels covering budget, design decisions, contractor selection, and timeline expectations.",
    queryIntent: "planning",
    serviceType: "Kitchen Remodeling",
    cityFocus: "Simpsonville and Fountain Inn SC",
    faqs: baseFaqs,
  },
  {
    slug: "basement-finishing-ideas-sc",
    title: "Basement Finishing Ideas for South Carolina Homeowners",
    metaTitle: "Basement Finishing Ideas for SC Homeowners (2026)",
    metaDescription:
      "Explore the most popular basement finishing ideas for Upstate SC homes — rec rooms, home offices, in-law suites, and home theaters — with real cost context.",
    queryIntent: "ideas",
    serviceType: "Basement Finishing",
    cityFocus: "South Carolina",
    faqs: baseFaqs,
  },
];

export function getServicePageBySlug(slug: string): ServiceLandingPage | undefined {
  return serviceLandingPages.find((item) => item.slug === slug);
}

export function getLocationBySlug(slug: string): LocationPage | undefined {
  return locationPages.find((item) => item.slug === slug);
}

export function getTrustPageBySlug(slug: string): TrustPage | undefined {
  return trustPages.find((item) => item.slug === slug);
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((item) => item.slug === slug);
}

export function buildServiceContent(page: ServiceLandingPage): string[] {
  const keywordA = page.keywords[0];
  const keywordB = page.keywords[1] ?? `home remodeling ${page.city}`;

  return [
    `${page.h1} starts with planning, not demolition. At Burch Contracting, we help homeowners in ${page.city} clarify what they want to change, how they want the finished space to feel, and what budget range makes sense for their household. Instead of pushing a one-size-fits-all package, we build each project around daily habits, long-term goals, and how the home might need to perform in the next five to ten years. That practical approach is why many homeowners searching for ${keywordA} and ${keywordB} trust our team to guide the process from concept through closeout.`,
    `A successful remodel balances design, durability, and resale performance. We evaluate material options for maintenance requirements, humidity resistance, and real-world wear, because what looks good on a showroom sample does not always perform in a busy family home. During consultation, we compare value-driven choices against premium upgrades so you can prioritize where to invest and where to save. Homeowners in ${page.city} often tell us this decision support is the most helpful part of working with an experienced remodeling contractor.`,
    `Construction quality is only one part of project success. Communication, scheduling discipline, and change management also matter. Our process includes milestone check-ins, clear scope documentation, and regular updates so homeowners understand what is happening each week. If something changes, we discuss impact on schedule and budget before work continues. That level of clarity reduces stress and protects your investment.`,
    `Pricing for ${page.serviceName.toLowerCase()} varies based on scope, selections, and site conditions. Older homes may require code updates, framing adjustments, or utility work that newer homes do not need. We build estimates in layers so you can see core costs, optional upgrades, and contingency recommendations. This helps homeowners make decisions confidently rather than relying on optimistic online averages that ignore local labor and permit realities.`,
    `If you are comparing contractors, focus on process transparency and planning depth, not just total price. A low quote with vague assumptions can become expensive once demolition reveals hidden conditions. A clear proposal should explain trade sequencing, allowances, product lead times, and inspection checkpoints. As a locally owned contractor serving homeowners across the Upstate, we structure projects to prevent surprises and keep momentum through completion.`,
    `When homeowners search for ${keywordA}, they usually want two things: a beautiful finished space and confidence that the project will be handled professionally. Burch Contracting combines design-forward recommendations with practical construction expertise so your remodel looks great on day one and still performs years later. Use the estimate form on this page to share project goals, preferred timeline, and budget range so we can build a tailored plan for your property.`,
  ];
}

export function buildLocationContent(page: LocationPage): string[] {
  const isSimpsonville = page.city === "Simpsonville SC";

  return [
    `${page.h1} projects should reflect how local homeowners actually live. Burch Contracting works with families in ${page.city} who want better function, stronger resale value, and a smoother construction experience. From kitchen and bathroom upgrades to decks, screened porches, room additions, and basement finishing, we focus on practical scope planning that keeps budgets realistic and outcomes durable.`,
    `A strong local remodeling strategy accounts for neighborhood expectations, permit pathways, and buyer preferences. In ${page.city}, many homeowners prioritize open kitchen layouts, modern bathrooms, and outdoor living spaces that support year-round use. Others focus on flexible square footage for home offices, guest needs, and multigenerational living. Our team helps evaluate these priorities so investment decisions support both lifestyle and long-term property value.`,
    `${isSimpsonville ? "Simpsonville homeowners often ask about balancing high-impact upgrades with manageable timelines." : `Homeowners in ${page.city} often ask how to phase improvements while staying in the home.`} We handle project sequencing to reduce daily disruption and keep production organized. That includes clear start milestones, trade coordination, and weekly communication checkpoints so clients always know what comes next.`,
    `The biggest risk in local remodeling is vague scope definition. Without precise planning, homeowners can encounter avoidable change orders, schedule drift, and inconsistent finish quality. We solve this by documenting expectations in detail and aligning selections before major construction begins. As a result, clients receive cleaner execution and a better overall experience from consultation to final walkthrough.`,
    `If you are searching for a dependable contractor in ${page.city}, start with a partner who combines local market context with accountable project management. Burch Contracting is locally owned, brings over 30 years of experience, and serves homeowners across the Upstate with transparent proposals and quality craftsmanship. Request an estimate to begin your project planning conversation.`,
  ];
}

export function buildBlogSections(post: BlogPost): Array<{ heading: string; paragraphs: string[] }> {
  return [
    {
      heading: `What Homeowners Should Know About ${post.title}`,
      paragraphs: [
        `${post.title} is one of the most common search topics we hear from homeowners planning a project in ${post.cityFocus}. The challenge is that internet estimates are often too broad to support real planning. True project costs and timelines are shaped by design choices, labor availability, code requirements, and product lead times. That means two homes in the same neighborhood can produce very different budgets even when the project type sounds similar.`,
        `At Burch Contracting, we coach clients to separate must-haves from nice-to-haves before requesting formal pricing. This step reduces rework and makes early estimates more useful. A homeowner who defines goals up front can compare options more effectively and avoid emotional decisions during construction.`,
        `Local market conditions also matter. Across the Upstate, permit pathways, trade scheduling, and supplier lead times should be considered from day one. Planning around those realities helps avoid timeline frustration and keeps project momentum steady.`,
      ],
    },
    {
      heading: "Building a Practical Budget",
      paragraphs: [
        `A practical remodeling budget includes three layers: core scope, upgrade choices, and contingency reserve. Core scope covers the essential work required to complete the project safely and correctly. Upgrade choices include finishes, fixtures, and optional custom features that affect final look and feel. A contingency reserve protects homeowners when hidden conditions appear after demolition.`,
        `For homeowners researching ${post.serviceType.toLowerCase()}, contingency planning is especially important in older properties where utility routing, framing conditions, and previous remodel quality can vary widely. The reserve does not mean you will spend more. It means you can make sound decisions quickly if conditions change.`,
        `Financing strategy is part of budget planning too. Some clients prefer to complete everything in one phase, while others stage work to balance monthly cash flow. Both strategies can succeed when scope and sequencing are planned intentionally.`,
      ],
    },
    {
      heading: "How to Choose the Right Contractor",
      paragraphs: [
        `Most homeowners compare proposals by total number first. A better method is to compare clarity. The strongest proposals define scope in detail, identify assumptions, explain allowances, and provide schedule checkpoints. This transparency is a leading indicator of how the project will be managed once work begins.`,
        `Look for documented communication practices. You should know who your point of contact is, how often updates are provided, and how change requests are approved. These workflow details are easy to overlook but have major influence on project stress and outcome quality.`,
        `When evaluating a remodeling contractor, prioritize experience with local permitting and inspections. Local knowledge reduces avoidable delays and helps close projects efficiently.`,
      ],
    },
    {
      heading: "Timeline Planning and Risk Reduction",
      paragraphs: [
        `Every remodel has variable risk. Material delays, weather, and hidden conditions are common variables that can shift schedules. A resilient plan includes milestone buffers and a realistic critical path rather than overly optimistic start-to-finish promises.`,
        `Homeowners can reduce delay risk by finalizing selections early, approving change orders quickly, and maintaining access to work zones. These simple habits protect sequencing and keep trade teams moving.`,
        `A consistent update rhythm is also critical. Weekly progress reviews let homeowners make decisions before they become schedule blockers. This structure keeps projects predictable and reduces the uncertainty that often causes remodeling stress.`,
      ],
    },
    {
      heading: "Next Steps for Homeowners",
      paragraphs: [
        `If you are early in planning, start by listing goals, budget comfort range, and timeline preferences. Then gather inspiration images that represent the style and quality level you expect. This gives your contractor a clear baseline to produce a useful estimate.`,
        `Burch Contracting helps homeowners across the Upstate build realistic plans that prioritize value and execution quality. Whether your project is focused on kitchen remodeling, bathroom remodeling, basement finishing, decks, or additions, the same planning fundamentals apply.`,
        `Use our request estimate form to submit project details, property location, and preferred consultation times. Our team will review your goals and provide guidance on scope, investment range, and recommended next steps.`,
      ],
    },
  ];
}
