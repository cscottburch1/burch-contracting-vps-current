import type { ServiceLandingPage, LocationPage } from "@/lib/seo/localSeoData";
import { absoluteUrl, siteConfig } from "@/lib/seo/site";

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl('/#localbusiness'),
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    image: absoluteUrl(siteConfig.defaultOgImage),
    telephone: siteConfig.phoneDisplay,
    email: "estimates@burchcontracting.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Simpsonville",
      addressRegion: "SC",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "Simpsonville SC" },
      { "@type": "City", name: "Fountain Inn SC" },
      { "@type": "City", name: "Greenville SC" },
      { "@type": "City", name: "Greer SC" },
      { "@type": "City", name: "Five Forks SC" },
      { "@type": "City", name: "Mauldin SC" },
      { "@type": "City", name: "Gray Court SC" },
      { "@type": "City", name: "Woodruff SC" },
      { "@type": "City", name: "Laurens SC" },
    ],
    sameAs: [
      "https://www.bbb.org/us/sc/gray-court/profile/home-additions/burch-contracting-llc-0673-90007875",
      "https://www.google.com/maps/place/Burch+Contracting/@34.6341746,-82.0744941,17z",
    ],
    priceRange: "$$-$$$",
    openingHours: "Mo-Fr 08:00-17:00",
  };
}

export function buildServiceSchema(page: ServiceLandingPage) {
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
    url: absoluteUrl(`/locations/${page.slug}`),
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
        url: absoluteUrl("/logo-transparent.png"),
      },
    },
    mainEntityOfPage: opts.url,
  };
}
