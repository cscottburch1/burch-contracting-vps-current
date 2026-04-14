import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Icon, { type IconName } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { businessConfig } from '@/config/business';
import { ServiceCard } from '@/components/ui/ServiceCard';
import Script from 'next/script';
import { getServicesForPage, mapToBusinessConfigFormat } from '@/lib/services';
import { serviceLandingPages } from '@/lib/seo/localSeoData';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import { absoluteUrl } from '@/lib/seo/site';
import TrustBar from '@/components/TrustBar';

// City-specific content with rich history and modern context
const cityContent: Record<string, {
  name: string;
  displayName: string;
  tagline: string;
  history: string;
  modernDay: {
    population: string;
    growth: string;
    characteristics: string[];
  };
  neighborhoods: {
    name: string;
    description: string;
    homeTypes: string;
  }[];
  whyChooseUs: string[];
  localInsights: string[];
  servicesIntro: string;
}> = {
  simpsonville: {
    name: "Simpsonville",
    displayName: "Simpsonville, SC",
    tagline: "Expert Deck Builder, Garage Contractor & Home Addition Specialist in Simpsonville, SC",
    history: "Simpsonville has grown from a small railroad town into one of Upstate South Carolina's most desirable communities. With a thriving downtown, excellent schools, and a perfect balance of suburban convenience and small-town charm, Simpsonville attracts families seeking quality of life. The city's continued growth means homeowners regularly invest in outdoor living spaces, garage additions, and home expansions.",
    modernDay: {
      population: "Over 24,000 residents",
      growth: "One of South Carolina's fastest-growing cities",
      characteristics: [
        "Mix of established neighborhoods and new construction",
        "Highly-rated Greenville County schools",
        "Vibrant downtown with local businesses and events",
        "Strong real estate market with consistent appreciation",
        "Family-oriented community with excellent amenities"
      ]
    },
    neighborhoods: [
      {
        name: "Downtown Simpsonville",
        description: "Historic core with renovated homes and walkable streets",
        homeTypes: "Craftsman, bungalow, and traditional homes (1920s-1960s)"
      },
      {
        name: "Five Forks Area",
        description: "Family-friendly master-planned communities",
        homeTypes: "Contemporary single-family homes (1990s-present)"
      },
      {
        name: "Hillcrest & Southeast Simpsonville",
        description: "Established neighborhoods with mature landscaping",
        homeTypes: "Ranch, split-level, and traditional designs (1970s-2000s)"
      }
    ],
    whyChooseUs: [
      "Deck builder Simpsonville SC - Custom wood and composite decks designed for outdoor entertaining and family gatherings",
      "Garage builder Simpsonville - Attached and detached garage construction with expert craftsmanship and attention to detail",
      "Screened porch contractor Simpsonville SC - Beautiful aluminum screened porches for bug-free outdoor living year-round",
      "Home addition specialist Simpsonville - Professional room additions, bump-outs, and second-story expansions that add valuable square footage",
      "Local contractor serving Simpsonville for 30+ years with BBB A+ rating and proven track record",
      "Licensed and insured with comprehensive liability coverage for your protection",
      "Free estimates with detailed scope of work and transparent pricing"
    ],
    localInsights: [
      "Heritage Park hosts community events and farmer's markets",
      "Excellent Greenville County school system attracts families",
      "Growing downtown district with unique shops and restaurants",
      "Strong sense of community with active neighborhood associations",
      "Convenient access to Greenville while maintaining small-town charm",
      "Continued residential growth drives demand for home improvements"
    ],
    servicesIntro: "Burch Contracting delivers expert deck building, garage construction, screened porch installation, and home addition services throughout Simpsonville, SC. Our professional contractors specialize in outdoor living spaces and structural additions with quality craftsmanship, premium materials, and reliable service."
  },
  greenville: {
    name: "Greenville",
    displayName: "Greenville, SC",
    tagline: "Premier Contracting Services for Greenville's Vibrant Community",
    history: "Greenville's history dates back to 1797 when it was established as Pleasantburg. By the late 1800s, it had become a textile manufacturing powerhouse that defined the region. The city's transformation from an industrial center to a thriving cultural and economic hub is one of the South's great success stories. Downtown Greenville's revitalization, centered around Falls Park and Main Street, has made it a model for urban renewal nationwide.",
    modernDay: {
      population: "Over 70,000 in the city, 500,000+ in the metro area",
      growth: "Consistent 15%+ growth over the past decade, recognized as one of America's fastest-growing cities",
      characteristics: [
        "Diverse housing stock from historic mansions to modern luxury condos",
        "Thriving downtown with award-winning restaurants and cultural venues",
        "Strong corporate presence including Michelin, BMW, and GE",
        "Nationally recognized for quality of life and business climate",
        "Extensive historic districts alongside contemporary developments"
      ]
    },
    neighborhoods: [
      {
        name: "Downtown & West End",
        description: "Historic urban core with converted lofts, modern condos, and restored historic homes",
        homeTypes: "Historic mills converted to lofts, luxury condominiums, Victorian and Craftsman homes"
      },
      {
        name: "North Main & Hampton-Pinckney",
        description: "Prestigious historic districts with grand estates and tree-lined streets",
        homeTypes: "Historic mansions, Colonial Revival estates, Tudor and Mediterranean styles (1900s-1940s)"
      },
      {
        name: "Augusta Road & Greenville Country Club",
        description: "Upscale established neighborhoods with mid-century to contemporary homes",
        homeTypes: "Ranch, Contemporary, and Traditional designs (1950s-1990s)"
      },
      {
        name: "Verdae & Pelham",
        description: "Modern mixed-use communities with new construction and luxury amenities",
        homeTypes: "Contemporary single-family homes, townhomes, luxury apartments (2000s-present)"
      }
    ],
    whyChooseUs: [
      "Historic homes in protected districts require skilled craftsmen familiar with preservation standards",
      "High-value properties demand premium quality workmanship and attention to detail",
      "Active luxury home market needs contractors who understand upscale finishes",
      "Urban living spaces require creative solutions for remodeling in compact footprints",
      "Growing population of young professionals and families seeking home customization",
      "Strong rental market means property owners invest in quality improvements"
    ],
    localInsights: [
      "Falls Park on the Reedy is one of America's best urban parks",
      "Peace Center brings world-class entertainment to the region",
      "Greenville's restaurant scene rivals major metropolitan areas",
      "Saturday Market downtown is the Southeast's largest outdoor market",
      "Strong emphasis on preserving historic character while encouraging innovation",
      "Swamp Rabbit Trail connects city neighborhoods and attracts outdoor enthusiasts"
    ],
    servicesIntro: "From historic North Main estates requiring careful restoration to modern downtown condos needing contemporary updates, we bring the expertise Greenville homeowners expect."
  },
  "five-forks": {
    name: "Five Forks",
    displayName: "Five Forks, SC",
    tagline: "Trusted Home Services for Five Forks' Family-Friendly Neighborhoods",
    history: "Five Forks gets its name from the historic five-way intersection that has served as a community gathering point since the 1800s. What was once rural farmland has transformed into one of the Upstate's most desirable suburban areas. The community has carefully balanced growth with preserving its neighborhood feel, making it a top choice for families relocating to the Greenville area.",
    modernDay: {
      population: "Over 18,000 residents in the Five Forks area",
      growth: "Rapid growth since the 1990s, with major residential development continuing",
      characteristics: [
        "Primarily newer construction (1990s-present)",
        "Master-planned communities with amenities like pools and playgrounds",
        "Highly-rated Greenville County schools draw families",
        "Strong sense of community with active HOAs and neighborhood events",
        "Convenient access to Greenville and I-385"
      ]
    },
    neighborhoods: [
      {
        name: "Five Forks Plantation",
        description: "Established upscale community with diverse home styles and sizes",
        homeTypes: "Traditional single-family homes, executive estates (1990s-2010s)"
      },
      {
        name: "Heritage",
        description: "Popular family neighborhood with excellent amenities and schools",
        homeTypes: "Contemporary and Traditional designs, ranch and two-story homes (2000s-present)"
      },
      {
        name: "Garfield Park",
        description: "Well-maintained community with mature landscaping",
        homeTypes: "Single-family homes, variety of sizes and layouts (1990s-2000s)"
      },
      {
        name: "Neely Farm & Neely Station",
        description: "Newer developments with modern home designs and community features",
        homeTypes: "Contemporary single-family homes, open floor plans (2010s-present)"
      }
    ],
    whyChooseUs: [
      "Newer homes still need regular maintenance and occasional repairs",
      "Growing families require home modifications like finished basements or deck additions",
      "Active lifestyle means outdoor living spaces need expansion and upkeep",
      "Many homes reaching 15-25 years old need kitchen and bathroom updates",
      "Strong real estate market means homeowners invest in improvements before selling",
      "HOA standards require maintaining home exteriors and curb appeal"
    ],
    localInsights: [
      "Five Forks Library serves as a community hub",
      "Excellent school districts make it a top choice for families",
      "Parks and greenways encourage outdoor activities",
      "Strong community identity despite being unincorporated",
      "Convenient to both Greenville amenities and Simpsonville's hometown feel",
      "Active neighborhood associations foster community connections"
    ],
    servicesIntro: "Five Forks homeowners value quality, reliability, and responsive service. We understand the needs of this family-focused community and deliver the professionalism you expect."
  },
  woodruff: {
    name: "Woodruff",
    displayName: "Woodruff, SC",
    tagline: "Trusted Deck Builder, Garage Contractor & Home Addition Services in Woodruff, SC",
    history: "Woodruff is a small town with deep roots in South Carolina's textile heritage. Founded in the late 1800s, it served as a mill town that provided employment and community for generations. Today, Woodruff maintains its small-town character while offering affordable housing and a peaceful lifestyle convenient to both Spartanburg and Greenville.",
    modernDay: {
      population: "Approximately 4,000 residents",
      growth: "Stable community with selective new development",
      characteristics: [
        "Small-town atmosphere with friendly neighbors",
        "Affordable housing compared to larger cities",
        "Mix of historic homes and newer construction",
        "Convenient to I-26 and both Greenville and Spartanburg",
        "Strong community pride and local traditions"
      ]
    },
    neighborhoods: [
      {
        name: "Historic Downtown",
        description: "Original town center with historic character",
        homeTypes: "Historic homes, mill houses (1900s-1940s)"
      },
      {
        name: "Residential Woodruff",
        description: "Established neighborhoods with mature trees",
        homeTypes: "Ranch, traditional, and modest homes (1950s-1990s)"
      },
      {
        name: "Rural Woodruff",
        description: "Properties with acreage outside town limits",
        homeTypes: "Homes on larger lots, some with outbuildings"
      }
    ],
    whyChooseUs: [
      "Deck contractor Woodruff SC - Quality deck building with composite and pressure-treated wood options",
      "Garage builder Woodruff - Professional garage construction for storage and vehicle protection",
      "Screened porch contractor Woodruff SC - Custom screened porches for comfortable outdoor relaxation",
      "Room addition specialist Woodruff - Expert home expansions and room additions built to code",
      "Serving Woodruff and surrounding areas for 30+ years",
      "BBB A+ rated with proven track record of customer satisfaction",
      "Honest pricing and transparent communication throughout your project"
    ],
    localInsights: [
      "Small-town charm with lower cost of living than larger cities",
      "Historic downtown maintains community character",
      "Convenient access to both Greenville and Spartanburg employment",
      "Strong community connections and local events",
      "Affordable property values attract first-time homebuyers",
      "Rural setting with modern conveniences nearby"
    ],
    servicesIntro: "Serving Woodruff homeowners with professional deck construction, garage building, screened porch installation, and room addition services. Burch Contracting delivers honest pricing, quality craftsmanship, and dependable service to every project."
  },
  "gray-court": {
    name: "Gray Court",
    displayName: "Gray Court, SC",
    tagline: "Reliable Home Services for Gray Court's Rural Community",
    history: "Gray Court's history reflects rural South Carolina's agricultural heritage. Originally a farming community, the town developed around the railroad in the late 1800s. Gray Court has maintained its small-town character while serving as a quiet residential area for those who work in nearby Laurens, Clinton, and Greenville. The community values its peaceful, country lifestyle while remaining connected to larger employment centers.",
    modernDay: {
      population: "Approximately 800 residents in town, several thousand in surrounding area",
      growth: "Modest growth with some new rural residential development",
      characteristics: [
        "Rural community with larger lots and country living",
        "Mix of historic homes and newer construction on acreage",
        "Lower cost of living and affordable property",
        "Quiet lifestyle while maintaining access to Interstate 26",
        "Strong agricultural heritage still present in surrounding areas"
      ]
    },
    neighborhoods: [
      {
        name: "Town Center",
        description: "Original residential area with older established homes",
        homeTypes: "Historic homes, modest single-family residences (1920s-1960s)"
      },
      {
        name: "Highway 14 Corridor",
        description: "Newer development along main roads with larger lots",
        homeTypes: "Ranch homes, manufactured homes, newer construction on acreage (1970s-present)"
      },
      {
        name: "Rural Acreage",
        description: "Country properties with land for farming, gardening, or horses",
        homeTypes: "Single-family homes on multiple acres, farmhouses, custom builds"
      }
    ],
    whyChooseUs: [
      "Rural properties require contractors willing to travel and work on larger projects",
      "Older homes need experienced maintenance and repair services",
      "Country properties often need outbuilding repairs, deck additions, and exterior work",
      "Homeowners value contractors who understand rural living and property needs",
      "Growing number of people moving from cities need help customizing country properties",
      "Limited local contractors means reliable, quality service is highly valued"
    ],
    localInsights: [
      "Peaceful rural setting attracts those seeking country lifestyle",
      "Close to Lake Greenwood for recreational activities",
      "Strong community ties with local churches as gathering places",
      "Affordable property attracts first-time homebuyers and retirees",
      "Convenient access to Laurens, Clinton, and Greenville for work",
      "Growing interest in hobby farming and sustainable living"
    ],
    servicesIntro: "Gray Court homeowners need contractors who understand rural properties and country living. We're experienced with the unique challenges and opportunities of homes on acreage."
  },
  "fountain-inn": {
    name: "Fountain Inn",
    displayName: "Fountain Inn, SC",
    tagline: "Professional Deck Builder, Garage Contractor & Screened Porch Specialist in Fountain Inn, SC",
    history: "Fountain Inn's history dates back to the 1830s when it served as a stagecoach stop. The town grew around textile mills and manufacturing, developing a strong working-class community. Today, Fountain Inn balances its historic downtown charm with modern growth, attracting families and young professionals who value its tight-knit community and convenient location between Greenville and Laurens.",
    modernDay: {
      population: "Over 10,000 residents",
      growth: "Steady residential and commercial expansion",
      characteristics: [
        "Historic downtown with local businesses and community events",
        "Mix of historic homes and modern developments",
        "Family-friendly atmosphere with strong schools",
        "Active parks and recreation programs",
        "Growing retail and dining options"
      ]
    },
    neighborhoods: [
      {
        name: "Historic Downtown",
        description: "Original town center with restored historic homes",
        homeTypes: "Victorian, craftsman, and traditional homes (1900s-1950s)"
      },
      {
        name: "North Fountain Inn",
        description: "Newer developments with family-oriented amenities",
        homeTypes: "Contemporary single-family homes (1990s-present)"
      },
      {
        name: "East & West Residential",
        description: "Established neighborhoods with mature trees",
        homeTypes: "Ranch, split-level, and traditional designs (1960s-1990s)"
      }
    ],
    whyChooseUs: [
      "Deck builder Fountain Inn SC - Expert composite and wood deck construction for outdoor living and entertaining",
      "Garage contractor Fountain Inn - Quality attached and detached garage construction with professional craftsmanship",
      "Screened porch builder Fountain Inn SC - Custom aluminum screened porches for comfortable outdoor enjoyment",
      "Home addition contractor Fountain Inn - Professional room additions and home expansions built to last",
      "Serving Fountain Inn for 30+ years with BBB A+ rating and proven reliability",
      "Licensed, insured, and bonded for your complete protection",
      "Free consultations with detailed estimates and honest pricing"
    ],
    localInsights: [
      "Annual Younts Center Ice Cream Social brings community together",
      "Historic downtown features local shops and restaurants",
      "Strong sense of community with active civic organizations",
      "Convenient access to both Greenville and Laurens",
      "Growing residential areas drive demand for home improvements",
      "Family-friendly parks and recreation facilities"
    ],
    servicesIntro: "Serving Fountain Inn homeowners with professional deck building, garage construction, screened porch installation, and room addition services. Burch Contracting brings 30+ years of experience, quality craftsmanship, and reliable service to every project."
  },
  mauldin: {
    name: "Mauldin",
    displayName: "Mauldin, SC",
    tagline: "Trusted Contracting Services for Mauldin's Established Community",
    history: "Incorporated in 1960, Mauldin is one of the Upstate's younger municipalities, though the area has been settled since the 1700s. Named after the Mauldin family who were early settlers, the city grew rapidly in the post-WWII suburban boom. Mauldin developed as a bedroom community for Greenville, with most growth occurring from the 1960s through the 1990s. The city has maintained a strong sense of community identity despite being surrounded by larger municipalities.",
    modernDay: {
      population: "Over 25,000 residents",
      growth: "Stable community with selective infill development",
      characteristics: [
        "Primarily 1960s-2000s suburban development",
        "Well-established neighborhoods with mature landscaping",
        "Strong city services and community amenities",
        "Convenient access to downtown Greenville",
        "Mix of original homeowners and new families"
      ]
    },
    neighborhoods: [
      {
        name: "Historic Mauldin",
        description: "Original residential areas from the 1960s-70s suburban expansion",
        homeTypes: "Ranch homes, split-levels, modest single-family homes (1960s-1980s)"
      },
      {
        name: "Butler Road Area",
        description: "Established neighborhoods with convenient access to shopping",
        homeTypes: "Traditional suburban homes, varied architectural styles (1970s-1990s)"
      },
      {
        name: "Eastern Mauldin",
        description: "Later development with larger lots and homes",
        homeTypes: "Contemporary and traditional designs (1990s-2010s)"
      }
    ],
    whyChooseUs: [
      "Deck builder Mauldin SC - Quality deck construction for established neighborhoods with mature landscaping",
      "Garage contractor Mauldin - Expert garage additions providing valuable storage and vehicle protection",
      "Screened porch builder Mauldin SC - Custom screened porches perfect for outdoor living in established communities",
      "Home addition specialist Mauldin - Professional room additions that complement existing home architecture",
      "Experience working with 30-60 year old homes and established neighborhoods",
      "Understanding of aging-in-place modifications and accessibility needs",
      "Licensed and insured with BBB A+ rating since 2014"
    ],
    localInsights: [
      "Mauldin Cultural Center hosts community events year-round",
      "Mauldin Sports Center draws families from across the region",
      "Excellent city services including recreation programs",
      "Strong neighborhood associations and community pride",
      "Convenient to Greenville employment and entertainment",
      "Family-friendly atmosphere with good schools"
    ],
    servicesIntro: "Mauldin homeowners need contractors who understand the unique opportunities of established homes while maintaining their character and value. Burch Contracting specializes in deck construction, garage additions, screened porches, and room additions tailored to established neighborhoods."
  },
  laurens: {
    name: "Laurens",
    displayName: "Laurens, SC",
    tagline: "Expert Deck Builder, Garage Contractor & Home Addition Specialist in Laurens, SC",
    history: "Laurens, the county seat of Laurens County, was established in 1785 and named after Revolutionary War hero Henry Laurens. The city has a rich history in textile manufacturing and agriculture. Today, Laurens maintains its historic downtown square while serving as a regional hub for Laurens County, offering a mix of historic charm and modern amenities.",
    modernDay: {
      population: "Over 9,000 residents in the city",
      growth: "Stable community with historic preservation focus",
      characteristics: [
        "Historic downtown square with local businesses",
        "County government center and regional services",
        "Mix of historic homes and modern developments",
        "Affordable cost of living compared to Greenville",
        "Strong sense of community and local pride"
      ]
    },
    neighborhoods: [
      {
        name: "Historic District",
        description: "Downtown area with preserved historic homes",
        homeTypes: "Victorian, colonial revival, historic homes (1800s-1930s)"
      },
      {
        name: "Residential Laurens",
        description: "Established neighborhoods surrounding downtown",
        homeTypes: "Ranch, traditional, and split-level homes (1950s-1990s)"
      },
      {
        name: "Suburban Laurens",
        description: "Newer developments on city outskirts",
        homeTypes: "Contemporary single-family homes (1990s-present)"
      }
    ],
    whyChooseUs: [
      "Deck builder Laurens SC - Professional deck construction with wood and composite materials for lasting outdoor spaces",
      "Garage contractor Laurens - Expert garage building for additional storage and vehicle protection",
      "Screened porch builder Laurens SC - Custom screened porches designed for comfortable outdoor living",
      "Home addition contractor Laurens - Quality room additions and home expansions built to your specifications",
      "Serving Laurens County for 30+ years with proven reliability",
      "Licensed, insured, and BBB A+ rated for your protection",
      "Competitive pricing with detailed estimates and no hidden costs"
    ],
    localInsights: [
      "Historic courthouse square is the heart of downtown",
      "Annual festivals and events celebrate community heritage",
      "Affordable property values attract families and retirees",
      "Close to Lake Greenwood for recreational opportunities",
      "County seat provides employment and services",
      "Strong community connections and local traditions"
    ],
    servicesIntro: "Serving Laurens and Laurens County with professional deck building, garage construction, screened porch installation, and room addition services. Burch Contracting delivers 30+ years of experience, quality materials, and honest service to every project."
  },
  greer: {
    name: "Greer",
    displayName: "Greer, SC",
    tagline: "Professional Deck Builder, Garage Contractor & Home Addition Services in Greer, SC",
    history: "Greer began as a textile mill town in the late 1800s, founded by William and James Greer. The town developed as one of South Carolina's most successful mill communities, with multiple textile operations providing employment and community identity. Though the traditional textile industry has diminished, Greer has successfully transformed into a diverse industrial and residential hub. The city retains pride in its manufacturing heritage while embracing modern growth and development.",
    modernDay: {
      population: "Over 30,000 residents",
      growth: "Consistent steady growth with commercial and residential development",
      characteristics: [
        "Mix of historic mill-era homes and modern residential areas",
        "Strong industrial base with diverse manufacturing and distribution",
        "Well-maintained neighborhoods with community pride",
        "Convenient access to Greenville and I-85",
        "Growing retail and dining options along Wade Hampton Boulevard"
      ]
    },
    neighborhoods: [
      {
        name: "Historic Downtown",
        description: "Original textile mill area with converted historic homes and commercial buildings",
        homeTypes: "Historic millworker cottages, Victorian homes, renovated historic residences (1890s-1940s)"
      },
      {
        name: "Residential Districts",
        description: "Established neighborhoods developed from 1950s onward",
        homeTypes: "Ranch homes, colonial revival, mid-century designs (1950s-1990s)"
      },
      {
        name: "Wade Hampton Corridor",
        description: "Commercial and residential growth along major thoroughfare",
        homeTypes: "Contemporary homes, newer family neighborhoods (1990s-present)"
      }
    ],
    whyChooseUs: [
      "Deck builder Greer SC - Expert deck construction with composite and wood materials for lasting outdoor spaces",
      "Garage contractor Greer - Professional garage building for vehicle storage and additional space",
      "Screened porch builder Greer SC - Custom screened porches for comfortable year-round outdoor living",
      "Home addition specialist Greer - Quality room additions and home expansions tailored to your needs",
      "Serving Greer for 30+ years with BBB A+ rating and proven customer satisfaction",
      "Historic property expertise combined with modern building techniques",
      "Licensed and insured with comprehensive coverage for your protection"
    ],
    localInsights: [
      "Strong community pride rooted in mill heritage",
      "Growing shopping and dining options along Wade Hampton",
      "Excellent access to both Greenville amenities and rural charm",
      "Highly-rated schools attract families to the area",
      "Manufacturing provides strong local employment base",
      "City invests in community improvements and parks"
    ],
    servicesIntro: "Greer homeowners deserve quality craftsmanship from contractors who understand both historic properties and modern family needs. Burch Contracting brings expertise in deck building, garage construction, screened porches, and home additions to this growing community."
  }
};

interface ServiceAreaPageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return [
    { city: 'simpsonville' },
    { city: 'greenville' },
    { city: 'five-forks' },
    { city: 'fountain-inn' },
    { city: 'mauldin' },
    { city: 'laurens' },
    { city: 'woodruff' },
    { city: 'gray-court' },
    { city: 'greer' }
  ];
}

export async function generateMetadata({ params }: ServiceAreaPageProps): Promise<Metadata> {
  const { city } = await params;
  const content = cityContent[city];
  
  if (!content) {
    return {
      title: 'Service Area Not Found',
    };
  }

  // City-specific metadata optimized for target markets
  const cityMetadata: Record<string, { title: string; description: string; keywords: string }> = {
    simpsonville: {
      title: 'Deck Builder, Garage Contractor & Home Additions Simpsonville SC | Burch Contracting',
      description: 'Expert deck building, garage construction, screened porch installation, and home additions in Simpsonville SC. Licensed, insured, BBB A+ rated contractor serving Simpsonville for 30+ years. Professional craftsmanship, free estimates!',
      keywords: 'deck builder Simpsonville SC, garage contractor Simpsonville, screened porch Simpsonville SC, home additions Simpsonville, room additions Simpsonville, deck construction Simpsonville, garage builder Simpsonville, contractor Simpsonville SC'
    },
    'fountain-inn': {
      title: 'Deck Builder, Garage & Screened Porch Contractor Fountain Inn SC | Burch Contracting',
      description: 'Professional deck construction, garage building, screened porches, and room additions in Fountain Inn SC. Licensed contractor with 30+ years serving Fountain Inn. Quality craftsmanship, honest pricing, free estimates. Call today!',
      keywords: 'deck builder Fountain Inn SC, garage contractor Fountain Inn, screened porch Fountain Inn SC, home additions Fountain Inn, room additions Fountain Inn, deck construction Fountain Inn, garage builder Fountain Inn, contractor Fountain Inn SC'
    },
    woodruff: {
      title: 'Deck Builder, Garage Contractor & Home Additions Woodruff SC | Burch Contracting',
      description: 'Trusted deck building, garage construction, screened porch installation, and room additions in Woodruff SC. Licensed, insured contractor serving Woodruff with honest pricing and quality work. Free consultations!',
      keywords: 'deck builder Woodruff SC, garage contractor Woodruff, screened porch Woodruff SC, home additions Woodruff, room additions Woodruff, deck construction Woodruff, contractor Woodruff SC'
    },
    laurens: {
      title: 'Deck Builder, Garage Contractor & Home Additions Laurens SC | Burch Contracting',
      description: 'Expert deck construction, garage building, screened porches, and room additions in Laurens SC. Professional contractor serving Laurens with 30+ years experience. Licensed, insured, BBB A+ rated. Free estimates!',
      keywords: 'deck builder Laurens SC, garage contractor Laurens, screened porch Laurens SC, home additions Laurens, room additions Laurens, deck construction Laurens, contractor Laurens SC'
    },
    greer: {
      title: 'Deck Builder, Garage & Screened Porch Contractor Greer SC | Burch Contracting',
      description: 'Professional deck building, garage construction, screened porch installation, and room additions in Greer SC. Licensed contractor with 30+ years experience serving Greer homeowners. Quality craftsmanship, free estimates. Call today!',
      keywords: 'deck builder Greer SC, garage contractor Greer, screened porch Greer SC, home additions Greer, room additions Greer, deck construction Greer, contractor Greer SC'
    }
  };

  const meta = cityMetadata[city] || {
    title: `${content.name} Contracting Services | Handyman, Remodeling & Home Repair | Burch Contracting`,
    description: `Professional home repair, remodeling, and handyman services in ${content.displayName}. Local contractors serving ${content.name}. Licensed, insured, and trusted.`,
    keywords: `${content.name} contractor, ${content.name} handyman, ${content.name} remodeling, home repair ${content.name}, kitchen remodeling ${content.name}, bathroom renovation ${content.name}, deck builder ${content.name}`
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: absoluteUrl(`/service-areas/${city}`),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: absoluteUrl(`/service-areas/${city}`),
      siteName: 'Burch Contracting',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function ServiceAreaPage({ params }: ServiceAreaPageProps) {
  const { city } = await params;
  const content = cityContent[city];
  
  if (!content) {
    notFound();
  }

  // Fetch active services from database
  const dbServices = await getServicesForPage();
  const services = dbServices.length > 0 
    ? dbServices.map(mapToBusinessConfigFormat)
    : businessConfig.services;
  const relatedLocationPages = serviceLandingPages.filter((page) => page.city.toLowerCase().startsWith(content.name.toLowerCase())).slice(0, 6);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Service Areas', url: absoluteUrl('/services') },
    { name: content.displayName, url: absoluteUrl(`/service-areas/${city}`) },
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Burch Contracting",
    "image": "https://burchcontracting.com/logo-transparent.webp",
    "description": `Professional contracting services in ${content.displayName}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": content.name,
      "addressRegion": "SC"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "addressLocality": content.name
    },
    "areaServed": {
      "@type": "City",
      "name": content.name
    },
    "telephone": businessConfig.contact.phone,
    "priceRange": "$$"
  };

  return (
    <>
      <Script
        id="service-area-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="service-area-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-blue-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <Badge variant="blue" className="text-base px-4 py-2 mb-6">
              Service Area: {content.displayName}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {content.tagline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              {content.servicesIntro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" href="/contact">
                Get Free Estimate
                <Icon name="ArrowRight" size={20} />
              </Button>
              <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="glass border-white/30 text-white hover:bg-white hover:text-gray-900">
                <Icon name="Phone" size={20} />
                {businessConfig.contact.phone}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* History Section - Only show if content exists */}
      {content.history && (
      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About <span className="gradient-text">{content.name}</span>
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {content.history}
          </p>
          {content.modernDay.population && (
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {content.name} Today
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-1">Population</p>
                <p className="text-gray-800">{content.modernDay.population}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-1">Growth</p>
                <p className="text-gray-800">{content.modernDay.growth}</p>
              </div>
            </div>
            {content.modernDay.characteristics.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-blue-600 mb-2">Community Characteristics</p>
              <ul className="space-y-2">
                {content.modernDay.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <Icon name="CheckCircle2" size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </div>
            )}
          </div>
          )}
        </div>
      </Section>
      )}

      {/* Neighborhoods Section - Only show if content exists */}
      {content.neighborhoods.length > 0 && (
      <Section background="gray" padding="lg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Neighborhoods We Serve in {content.name}
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Understanding the unique character of {content.name}&apos;s diverse neighborhoods
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {content.neighborhoods.map((neighborhood, index) => (
              <Card key={index} className="hover-lift">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{neighborhood.name}</h3>
                <p className="text-gray-700 mb-4">{neighborhood.description}</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-600 mb-2">Common Home Types:</p>
                  <p className="text-gray-700 text-sm">{neighborhood.homeTypes}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
      )}

      {/* Why Choose Us for This City */}
      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            {content.history ? `Why ${content.name} Homeowners Choose Us` : `Professional Home Remodeling Services in ${content.name}`}
          </h2>
          <div className="grid gap-4">
            {content.whyChooseUs.map((reason, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg hover-lift">
                <Icon name="Home" className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-lg text-gray-800">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Local Insights - Only show if content exists */}
      {content.localInsights.length > 0 && (
      <Section background="gray" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Local Insights
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-md">
            <ul className="space-y-4">
              {content.localInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Icon name="MapPin" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      )}

      {/* Services */}
      <Section background="white" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services in {content.name}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive home improvement solutions for every neighborhood
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={<Icon name={service.icon as IconName} size={40} className="text-blue-600" />}
              href={`/services/${service.id}`}
            />
          ))}
        </div>
      </Section>

      {relatedLocationPages.length > 0 && (
        <Section background="gray" padding="lg">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular {content.name} Service Pages</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Start with a focused service page if you already know the type of project you want to build.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedLocationPages.map((page) => (
                <Card key={page.slug} className="hover-lift">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{page.h1}</h3>
                  <p className="text-gray-600 mb-5">{page.shortDescription}</p>
                  <Button variant="outline" href={`/locations/${page.slug}`}>Read Local Page</Button>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section background="dark" padding="lg">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your {content.name} Home Project?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
            Contact us today for a free consultation. We&apos;re proud to serve {content.displayName} with quality craftsmanship and reliable service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href="/contact" className="shadow-2xl">
              Request Free Estimate
              <Icon name="ArrowRight" size={20} />
            </Button>
            <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="border-white text-white hover:bg-white hover:text-gray-900 shadow-2xl">
              <Icon name="Phone" size={20} />
              Call Now
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
