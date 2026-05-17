/**
 * Central Pricing Configuration for Burch Contracting
 * Reference: burch_pricing_calculator_system.xlsx
 * 
 * Formula: (Direct Cost × Location × Material × Complexity × Site + Adders) × (1 + O&P)
 * Default O&P: 22.5% (range: 20-25%)
 */

export const PRICING_LAST_UPDATED = '2026-05-02';

export const PRICING_CONFIG = {
  // Overhead & Profit
  defaultOverheadAndProfit: 0.225, // 22.5%
  oAndPRange: {
    min: 0.20,
    max: 0.25,
  },

  // Location Factors (Upstate South Carolina)
  locationFactors: {
    grayCourtArea: {
      name: 'Gray Court & Surrounding Area',
      factor: 0.98,
      cities: ['Gray Court', 'Enoree', 'Woodruff'],
    },
    fountainInnArea: {
      name: 'Fountain Inn & Surrounding Area',
      factor: 1.02,
      cities: ['Fountain Inn', 'Simpsonville (South)', 'Mauldin (South)'],
    },
    simpsonvilleArea: {
      name: 'Simpsonville & Greenville County',
      factor: 1.07,
      cities: ['Simpsonville', 'Mauldin', 'Greenville', 'Five Forks', 'Taylors'],
    },
  },

  // Output Range Modifiers
  outputRanges: {
    budgetLow: 0.93,     // "Budget-Conscious" (Final × 0.93)
    mostCommon: 1.0,      // "Most Common" (Final × 1.0)
    customHigh: 1.12,     // "Custom/High-End" (Final × 1.12)
  },

  // Service-Specific Configurations
  services: {
    decks: {
      name: 'Decks',
      baseRates: {
        pressureTreated: {
          label: 'Pressure-Treated Wood Deck',
          directCost: 34, // $/SF
          description: 'Standard PT lumber, code-compliant framing, basic railing',
        },
        compositeLowMaintenance: {
          label: 'Composite Low-Maintenance Deck',
          directCost: 52, // $/SF
          description: 'Composite decking, aluminum railing, hidden fasteners',
        },
        premiumComposite: {
          label: 'Premium Composite + Custom Features',
          directCost: 67, // $/SF
          description: 'Premium composite, custom railing, built-in features, lighting',
        },
      },
      materialFactors: {
        standard: 1.0,
        upgraded: 1.15,
        premium: 1.35,
      },
      complexityFactors: {
        simple: 1.0,        // Rectangle, one level, standard stairs
        moderate: 1.12,     // Multi-level, angles, custom railing
        complex: 1.28,      // Multiple levels, curves, built-ins, pergola
      },
      siteConditionFactors: {
        flat: 1.0,
        slope: 1.08,        // Sloped yard requiring retaining wall consideration
        challenging: 1.18,  // Steep slope, difficult access, extensive site work
      },
      adders: [
        { label: 'Built-in Bench Seating', cost: 85, unit: 'linear foot' },
        { label: 'Pergola or Shade Structure', cost: 2500, unit: 'per structure' },
        { label: 'Deck Lighting Package', cost: 1200, unit: 'per deck' },
        { label: 'Privacy Screen or Lattice', cost: 45, unit: 'linear foot' },
      ],
    },

    screenedPorches: {
      name: 'Screened Porches',
      baseRates: {
        enclosureOnly: {
          label: 'Screen Enclosure Only (existing deck/porch)',
          directCost: 18, // $/SF
          description: 'Frame and screen existing covered space',
        },
        newScreenedPorch: {
          label: 'New Screened Porch (roof, floor, screening)',
          directCost: 62, // $/SF
          description: 'Complete structure, roof, screening, basic finishes',
        },
        upgradedOutdoorRoom: {
          label: 'Upgraded Outdoor Room (premium finishes)',
          directCost: 82, // $/SF
          description: 'Premium materials, ceiling fans, lighting, finished trim',
        },
      },
      materialFactors: {
        standard: 1.0,
        upgraded: 1.12,
        premium: 1.25,
      },
      complexityFactors: {
        simple: 1.0,        // Basic rectangle, standard screening
        moderate: 1.10,     // Custom door, electrical rough-in
        complex: 1.22,      // Multiple doors, ceiling details, custom features
      },
      siteConditionFactors: {
        existingStructure: 1.0,      // Adding to existing deck/patio
        newConstruction: 1.15,        // Building from ground up
        structuralChallenges: 1.28,   // Roof tie-in challenges, foundation issues
      },
      adders: [
        { label: 'Ceiling Fan with Light', cost: 450, unit: 'per fan' },
        { label: 'Recessed Can Lighting', cost: 180, unit: 'per fixture' },
        { label: 'Retractable Screen System', cost: 650, unit: 'per opening' },
        { label: 'Finished Tongue & Groove Ceiling', cost: 8, unit: 'per SF' },
      ],
    },

    garages: {
      name: 'Garages',
      baseRates: {
        attachedBasic: {
          label: 'Attached Garage (basic finish)',
          directCost: 60, // $/SF
          description: 'Standard 2-car attached, basic finishes, slab foundation',
        },
        detachedStandard: {
          label: 'Detached Garage (standard finish)',
          directCost: 89, // $/SF
          description: 'Detached 2-car, standard finishes, electrical, garage door',
        },
        upgradedWorkshop: {
          label: 'Upgraded Workshop/Carriage House',
          directCost: 119, // $/SF
          description: 'Premium finishes, finished walls, upgraded electrical, upgraded door',
        },
      },
      materialFactors: {
        standard: 1.0,
        upgraded: 1.10,
        premium: 1.22,
      },
      complexityFactors: {
        simple: 1.0,        // Standard 2-car, slab, basic finishes
        moderate: 1.12,     // 3-car, or 2-car with storage area
        complex: 1.25,      // Multi-bay, second floor, or challenging roof tie-in
      },
      siteConditionFactors: {
        flat: 1.0,
        slope: 1.12,        // Sloped lot requiring grading
        challenging: 1.25,  // Significant grading, retaining walls, or access issues
      },
      adders: [
        { label: 'Insulated Garage Doors (×2)', cost: 2160, unit: 'per pair' },
        { label: 'Second Floor Storage/Bonus', cost: 54, unit: 'per SF' },
        { label: 'Upgraded Electrical Panel', cost: 1440, unit: 'per garage' },
        { label: 'Finished Interior Walls', cost: 7.2, unit: 'per SF' },
      ],
    },

    homeAdditions: {
      name: 'Home Additions',
      baseRates: {
        basicFinish: {
          label: 'Basic Finish Addition',
          directCost: 172, // $/SF
          description: 'Standard finishes, functional layout, code-compliant',
        },
        standardLivingSpace: {
          label: 'Standard Living Space Addition',
          directCost: 218, // $/SF
          description: 'Quality finishes, HVAC, updated fixtures, good flow',
        },
        premiumCustom: {
          label: 'Premium Custom Addition',
          directCost: 278, // $/SF
          description: 'High-end finishes, custom features, premium materials',
        },
        luxuryMasterSuite: {
          label: 'Luxury Master Suite (300+ SF)',
          directCost: 310, // $/SF
          description: 'Luxury master bedroom, spa bath, custom closet, premium everything',
        },
      },
      materialFactors: {
        builder: 1.0,
        standard: 1.08,
        upgraded: 1.18,
        premium: 1.32,
      },
      complexityFactors: {
        simple: 1.0,        // Bump-out, simple floor plan
        moderate: 1.12,     // Multi-room, plumbing/electrical challenges
        complex: 1.25,      // Second story, structural challenges, complex roof
      },
      siteConditionFactors: {
        straightforward: 1.0,
        moderate: 1.10,     // Foundation challenges, sloped lot
        difficult: 1.22,    // Major structural work, challenging access, extensive site prep
      },
      adders: [
        { label: 'Bathroom (Full)', cost: 15000, unit: 'per bathroom' },
        { label: 'Bathroom (Half)', cost: 8000, unit: 'per bathroom' },
        { label: 'Custom Kitchen Extension', cost: 25000, unit: 'per extension' },
        { label: 'Second Story Addition Premium', cost: 35, unit: 'per SF' },
      ],
    },
  },
} as const;

// Helper type exports
export type LocationKey = keyof typeof PRICING_CONFIG.locationFactors;
export type ServiceKey = keyof typeof PRICING_CONFIG.services;
