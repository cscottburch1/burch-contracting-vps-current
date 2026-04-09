import type { LocationPage } from "@/lib/seo/localSeoData";
import { absoluteUrl, siteConfig } from "@/lib/seo/site";

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
  { "@type": "City", name: "Fountain Inn SC" },
  { "@type": "City", name: "Mauldin SC" },
  { "@type": "City", name: "Gray Court SC" },
  { "@type": "City", name: "Laurens SC" },
  { "@type": "City", name: "Woodruff SC" },
  { "@type": "City", name: "Clinton SC" },
  { "@type": "City", name: "Ora SC" },
  { "@type": "City", name: "Joanna SC" },
];

const sharedSameAs = [
  "https://www.bbb.org/us/sc/gray-court/profile/home-additions/burch-contracting-llc-0673-90007875",
  "https://www.google.com/maps/place/Burch+Contracting/@34.6341746,-82.0744941,17z",
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
    email: "estimates@burchcontracting.com",
    foundingDate: "1995",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Simpsonville",
      addressRegion: "SC",
      postalCode: "29681",
      addressCountry: "US",
    },
    areaServed: sharedAreaServed,
    sameAs: sharedSameAs,
    hasMap: "https://www.google.com/maps/place/Burch+Contracting/@34.6341746,-82.0744941,17z",
    priceRange: "$$-$$$",
    openingHours: "Mo-Fr 08:00-17:00",
    award: "Better Business Bureau A+ rating",
    inLanguage: "en-US",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: siteConfig.phoneDisplay,
      email: "estimates@burchcontracting.com",
      areaServed: ["US-SC"],
      availableLanguage: ["English"],
    },
    knowsAbout: [
      "Garage construction",
      "Room additions",
      "Screened porches",
      "Deck building",
      "ADU planning",
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
        addressLocality: "Simpsonville",
        addressRegion: "SC",
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

export function buildFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
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
      "@type": "Organization",
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
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
