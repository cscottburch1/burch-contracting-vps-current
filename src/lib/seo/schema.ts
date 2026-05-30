import type { LocationPage } from "@/lib/seo/localSeoData";
import { absoluteUrl, siteConfig } from "@/lib/seo/site";
import { businessConfig } from "@/config/business";

type ServiceSchemaPage = {
  slug: string;
  serviceName: string;
  city: string;
  h1: string;
  shortDescription: string;
  path?: string;
};

type LocalBusinessSchemaOverrides = {
  description?: string;
  hasOfferCatalog?: {
    "@type": "OfferCatalog";
    name: string;
    itemListElement: Array<{
      "@type": "Offer";
      itemOffered: {
        "@type": "Service";
        name: string;
        description: string;
      };
    }>;
  };
};

const sharedAreaServed = [
  { "@type": "City", name: "Simpsonville SC" },
  { "@type": "City", name: "Mauldin SC" },
  { "@type": "City", name: "Fountain Inn SC" },
  { "@type": "City", name: "Woodruff SC" },
  { "@type": "State", name: "Upstate South Carolina" },
];

const sharedSameAs = [
  "https://www.bbb.org/us/sc/gray-court/profile/home-additions/burch-contracting-llc-0673-90007875",
  "https://www.google.com/maps/place/Burch+Contracting/@34.6341746,-82.0744941,17z",
  "https://www.facebook.com/burchcontracting",
  "https://www.instagram.com/burchcontracting",
  "https://www.linkedin.com/company/burch-contracting",
  "https://www.youtube.com/@burchcontracting",
];

export function buildLocalBusinessSchema(overrides: LocalBusinessSchemaOverrides = {}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "GeneralContractor", "HomeAndConstructionBusiness"],
    "@id": absoluteUrl('/#localbusiness'),
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    logo: absoluteUrl('/logo-transparent.webp'),
    image: absoluteUrl(siteConfig.defaultOgImage),
    telephone: siteConfig.phoneDisplay,
    email: businessConfig.contact.email,
    foundingDate: businessConfig.credentials.established,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessConfig.contact.address,
      addressLocality: businessConfig.contact.city,
      addressRegion: businessConfig.contact.state,
      postalCode: businessConfig.contact.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "34.6341746",
      longitude: "-82.0744941",
    },
    areaServed: sharedAreaServed,
    sameAs: sharedSameAs,
    hasMap: "https://www.google.com/maps/place/Burch+Contracting/@34.6341746,-82.0744941,17z",
    priceRange: "$$-$$$",
    openingHours: "Mo-Fr 08:00-17:00",
    award: "BBB A+ Rating since 2014",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "6",
      reviewCount: "6",
    },
    inLanguage: "en-US",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: siteConfig.phoneDisplay,
      email: businessConfig.contact.email,
      areaServed: ["US-SC"],
      availableLanguage: ["English"],
    },
    knowsAbout: [
      "Home Additions",
      "Garage Construction",
      "Outdoor Living",
      "Custom Decks",
      "Screened Porches",
      "Covered Patios",
      "Home Remodeling",
      "Commercial Tenant Upfits"
    ],
  };

  if (overrides.description) {
    return {
      ...schema,
      description: overrides.description,
      ...(overrides.hasOfferCatalog ? { hasOfferCatalog: overrides.hasOfferCatalog } : {}),
    };
  }

  if (overrides.hasOfferCatalog) {
    return {
      ...schema,
      hasOfferCatalog: overrides.hasOfferCatalog,
    };
  }

  return schema;
}

export function buildServiceSchema(page: ServiceSchemaPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: page.serviceName,
    provider: {
      "@type": "LocalBusiness",
      "@id": absoluteUrl('/#localbusiness'),
      name: siteConfig.siteName,
      address: {
        "@type": "PostalAddress",
        streetAddress: businessConfig.contact.address,
        addressLocality: businessConfig.contact.city,
        addressRegion: businessConfig.contact.state,
        postalCode: businessConfig.contact.zip,
        addressCountry: "US",
      },
    },
    areaServed: page.city,
    name: page.h1,
    description: page.shortDescription,
    url: absoluteUrl(page.path ?? `/locations/${page.slug}`),
  };
}

export function buildAreaServedSchema(page: LocationPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Home Remodeling ${page.city}`,
    areaServed: {
      "@type": "City",
      name: page.city,
    },
    provider: {
      "@type": "LocalBusiness",
      "@id": absoluteUrl('/#localbusiness'),
      name: siteConfig.siteName,
    },
    url: absoluteUrl(`/locations/${page.slug}`),
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl('/#organization'),
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    logo: absoluteUrl('/logo-transparent.webp'),
    image: absoluteUrl(siteConfig.defaultOgImage),
    email: "estimates@burchcontracting.com",
    telephone: siteConfig.phoneDisplay,
    foundingDate: "1995",
    sameAs: sharedSameAs,
    areaServed: sharedAreaServed,
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl('/#website'),
    url: siteConfig.siteUrl,
    name: siteConfig.siteName,
    inLanguage: "en-US",
    publisher: {
      "@id": absoluteUrl('/#organization'),
    },
  };
}

export function buildArticleSchema(opts: { title: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: [absoluteUrl(siteConfig.defaultOgImage)],
    author: {
      "@type": "Person",
      name: "Scott Burch",
      jobTitle: "SC Licensed General Contractor #CLG118679",
      url: absoluteUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-transparent.webp"),
      },
    },
    mainEntityOfPage: opts.url,
  };
}

export function buildContactPointSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "Organization",
      "@id": absoluteUrl('/#organization'),
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: siteConfig.phoneDisplay,
        areaServed: ["US-SC"],
        availableLanguage: ["English"],
      },
      areaServed: [
        { "@type": "City", name: "Simpsonville SC" },
        { "@type": "City", name: "Fountain Inn SC" },
        { "@type": "City", name: "Mauldin SC" },
        { "@type": "City", name: "Gray Court SC" },
        { "@type": "City", name: "Laurens SC" },
        { "@type": "City", name: "Woodruff SC" },
        { "@type": "City", name: "Clinton SC" },
        { "@type": "City", name: "Ora SC" },
        { "@type": "City", name: "Joanna SC" },
      ],
    },
  };
}

type CalculatorSchemaOptions = {
  name: string;
  description: string;
  url: string;
  serviceName: string;
  minPrice?: number;
  maxPrice?: number;
  priceCurrency?: string;
  datePublished?: string;
  dateModified?: string;
};

/**
 * Build SoftwareApplication schema for cost calculators
 * Helps AI engines understand and cite calculator tools
 */
export function buildCalculatorSoftwareApplicationSchema(opts: CalculatorSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: "FinanceApplication",
    applicationSubCategory: "Cost Calculator",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: opts.priceCurrency || "USD",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "LocalBusiness",
      "@id": absoluteUrl('/#localbusiness'),
      name: siteConfig.siteName,
      telephone: siteConfig.phoneDisplay,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Homeowners planning renovation projects",
      geographicArea: {
        "@type": "AdministrativeArea",
        name: "Greenville County, Laurens County, Spartanburg County, South Carolina",
      },
    },
    about: {
      "@type": "Service",
      serviceType: opts.serviceName,
      provider: {
        "@type": "LocalBusiness",
        "@id": absoluteUrl('/#localbusiness'),
      },
    },
    datePublished: opts.datePublished || "2026-04-01",
    dateModified: opts.dateModified || "2026-05-02",
    inLanguage: "en-US",
  };
}

/**
 * Build Dataset schema for calculator pricing data
 * Documents the original research and pricing methodology
 */
export function buildCalculatorDatasetSchema(opts: CalculatorSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${opts.serviceName} Cost Data - Upstate South Carolina (2026)`,
    description: `Transparent pricing dataset for ${opts.serviceName.toLowerCase()} projects in Simpsonville, Fountain Inn, and Greenville County. Includes material costs, labor rates, and 22.5% contractor overhead & profit based on 35+ years of project data.`,
    url: opts.url,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      "@id": absoluteUrl('/#organization'),
      name: siteConfig.siteName,
      email: businessConfig.contact.email,
    },
    publisher: {
      "@type": "Organization",
      "@id": absoluteUrl('/#organization'),
      name: siteConfig.siteName,
    },
    datePublished: opts.datePublished || "2026-04-01",
    dateModified: opts.dateModified || "2026-05-02",
    spatialCoverage: {
      "@type": "Place",
      geo: {
        "@type": "GeoShape",
        box: "34.4 -82.4 35.0 -81.8",
      },
      name: "Upstate South Carolina (Greenville, Laurens, Spartanburg Counties)",
    },
    temporalCoverage: "2026",
    variableMeasured: [
      "Material costs per square foot",
      "Labor costs per hour",
      "Contractor overhead and profit percentage",
      "Project timeline estimates",
      "Quality tier pricing (Value, Standard, Premium)",
    ],
    ...(opts.minPrice && opts.maxPrice ? {
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "text/html",
        contentUrl: opts.url,
        description: `Interactive calculator showing cost range ${opts.priceCurrency || "USD"} $${opts.minPrice.toLocaleString()}-$${opts.maxPrice.toLocaleString()}`,
      },
    } : {}),
    isAccessibleForFree: true,
    keywords: [
      opts.serviceName,
      "cost calculator",
      "pricing data",
      "Upstate South Carolina",
      "Simpsonville",
      "Fountain Inn",
      "Greenville County",
      "contractor pricing",
      "transparent pricing",
      "2026 construction costs",
    ],
  };
}

/**
 * Build ItemList schema for the calculators hub page
 */
export function buildCalculatorItemListSchema(
  calculators: Array<{ name: string; url: string; description: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free Construction Cost Calculators — Upstate South Carolina",
    description:
      "Interactive cost estimators for home and commercial construction in Simpsonville, Fountain Inn, Greenville County, and Laurens County, SC.",
    url: absoluteUrl("/calculators"),
    numberOfItems: calculators.length,
    itemListElement: calculators.map((calc, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: calc.name,
      url: absoluteUrl(calc.url),
      description: calc.description,
    })),
  };
}

/**
 * Build Person schema for author bylines
 * Boosts E-E-A-T signals for content authorship
 */
export function buildPersonSchema(opts: {
  name: string;
  jobTitle: string;
  description: string;
  email?: string;
  image?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl('/#author'),
    name: opts.name,
    jobTitle: opts.jobTitle,
    description: opts.description,
    url: absoluteUrl('/about'),
    ...(opts.email ? { email: opts.email } : {}),
    ...(opts.image ? { 
      image: {
        "@type": "ImageObject",
        url: opts.image,
      } 
    } : {}),
    ...(opts.sameAs && opts.sameAs.length > 0 ? { sameAs: opts.sameAs } : {}),
    worksFor: {
      "@type": "Organization",
      "@id": absoluteUrl('/#organization'),
      name: siteConfig.siteName,
    },
    knowsAbout: [
      "General contracting",
      "Deck construction",
      "Garage building",
      "Screened porch installation",
      "Home additions",
      "Kitchen remodeling",
      "Bathroom remodeling",
      "Basement finishing",
      "ADU construction",
      "South Carolina building codes",
      "Residential construction",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Professional License",
      recognizedBy: {
        "@type": "Organization",
        name: "South Carolina Department of Labor, Licensing and Regulation",
      },
      about: "SC General Contractor License #CLG118679",
    },
  };
}
