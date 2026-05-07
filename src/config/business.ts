export const businessConfig = {
  name: "Burch Contracting",
  tagline: "Additions, Garages & Outdoor Living Contractor | Upstate SC",
  description: "Custom home additions, garage construction, outdoor living spaces, and remodeling across Simpsonville, Mauldin, Fountain Inn & Woodruff SC.",

  credentials: {
    bbbRating: "A+",
    bbbSince: "2014",
    yearsInBusiness: 30,
    established: "1995",
    bbbUrl: "https://www.bbb.org/us/sc/gray-court/profile/home-additions/burch-contracting-llc-0673-90007875",
    googleRating: "5.0",
    googleUrl: "https://www.google.com/maps/place/Burch+Contracting/@34.6341746,-82.0744941,17z/data=!4m7!3m6!1s0x88578d1a6ee3c001:0x147295d161e89612!8m2!3d34.6341746!4d-82.0744941!16s%2Fg%2F11bbrjh0dt",
    licensed: true,
    insured: true
  },

  contact: {
    phone: "(864) 724-4600",
    email: "estimates@burchcontracting.com",
    address: "1095 Water Tank Rd",
    city: "Gray Court",
    state: "SC",
    zip: "29645",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM\nSaturday: By Appt Only\nSunday: Closed"
  },

  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    linkedin: "#"
  },

  serviceArea: {
    description: "Proudly serving Simpsonville, Mauldin, Fountain Inn, Woodruff and surrounding Upstate SC communities",
    locations: ["Simpsonville", "Mauldin", "Fountain Inn", "Woodruff", "Gray Court"]
  },

  services: [
    {
      id: "additions",
      title: "Home Additions",
      icon: "Construction",
      description: "Room additions and home expansions that add valuable square footage",
      tasks: ["Addition planning", "Design services", "Expert construction"]
    },
    {
      id: "garages",
      title: "Custom Garages",
      icon: "Warehouse",
      description: "Attached and detached garage construction for vehicle protection and storage",
      tasks: ["Garage construction", "Custom designs", "Attached & detached"]
    },
    {
      id: "outdoor-living",
      title: "Outdoor Living",
      icon: "Trees",
      description: "Decks, screened porches, and covered patios for year-round outdoor enjoyment",
      tasks: ["Custom decks", "Screened porches", "Covered patios"]
    },
    {
      id: "outdoor-living/decks",
      title: "Decks",
      icon: "Trees",
      description: "Composite, pressure-treated, and hardwood deck construction",
      tasks: ["Composite decks", "Pressure-treated", "Multi-level designs"]
    },
    {
      id: "outdoor-living/screened-porches",
      title: "Screened Porches",
      icon: "Grid",
      description: "Aluminum and wood framed screened porch construction",
      tasks: ["Aluminum framing", "Wood framing", "Deck conversions"]
    },
    {
      id: "outdoor-living/covered-patios",
      title: "Covered Patios",
      icon: "Home",
      description: "Covered patio structures for year-round outdoor living",
      tasks: ["Solid roof covers", "Pergolas", "Attached covers"]
    },
    {
      id: "remodeling",
      title: "Remodeling",
      icon: "Hammer",
      description: "Kitchen, bath, and whole-home remodeling services",
      tasks: ["Kitchen remodeling", "Bathroom remodeling", "Whole-home renovations"]
    },
    {
      id: "commercial-upfits",
      title: "Commercial Upfits",
      icon: "Briefcase",
      description: "Commercial tenant improvements, office build-outs, and retail upfits",
      tasks: ["Office build-outs", "Retail upfits", "Medical offices"]
    }
  ],

  features: [
    { title: "Licensed & Insured", description: "Fully licensed and insured", icon: "ShieldCheck" },
    { title: "Clear Communication", description: "We keep you informed", icon: "MessageSquare" },
    { title: "Quality Workmanship", description: "Attention to detail", icon: "Award" },
    { title: "On-Time & On-Budget", description: "Reliable scheduling", icon: "Clock" }
  ],

  values: [
    { title: "Integrity", description: "We do what we say" },
    { title: "Quality", description: "Meticulous attention to detail" }
  ],

  testimonials: [
    { name: "Sarah M.", location: "Simpsonville", text: "Excellent work!", rating: 5, project: "Kitchen" },
    { name: "John D.", location: "Fountain Inn", text: "Highly recommend!", rating: 5, project: "Deck" },
    { name: "Maria L.", location: "Simpsonville", text: "Professional service!", rating: 5, project: "Repairs" }
  ],

  projects: [
    { id: 1, title: "Modern Kitchen", category: "Kitchen", description: "Complete renovation", scope: "Full remodel", timeline: "4 weeks", testimonial: "Amazing!" },
    { id: 2, title: "Master Bath", category: "Bath", description: "Luxury bathroom", scope: "Complete renovation", timeline: "3 weeks", testimonial: "Beautiful!" }
  ],

  process: [
    { step: 1, title: "Contact", description: "Reach out to us" },
    { step: 2, title: "Consultation", description: "We visit your property" },
    { step: 3, title: "Estimate", description: "Detailed written estimate" },
    { step: 4, title: "Execution", description: "Complete your project" },
    { step: 5, title: "Walkthrough", description: "Review completed work" }
  ],

  seo: {
    baseUrl: "https://www.burchcontracting.com",
    defaultTitle: "Burch Contracting | Deck, Garage, Porch & Addition Contractor",
    defaultDescription: "Expert deck building, garage construction, screened porch installation, and home additions in Simpsonville, SC and Upstate SC.",
    keywords: "deck builder, garage builder, screened porch contractor, home additions, Simpsonville SC, Upstate SC"
  }
};
