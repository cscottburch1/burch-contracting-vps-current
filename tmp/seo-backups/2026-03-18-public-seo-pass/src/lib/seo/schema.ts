import type { ServiceLandingPage, LocationPage } from "@/lib/seo/localSeoData";

const SITE_URL = "https://burchcontracting.com";

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Burch Contracting",
    url: SITE_URL,
    telephone: "(864) 724-4600",
    email: "estimates@burchcontracting.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gray Court",
      addressRegion: "SC",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "Simpsonville SC" },
      { "@type": "City", name: "Fountain Inn SC" },
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
      name: "Burch Contracting",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Gray Court",
        addressRegion: "SC",
      },
    },
    areaServed: page.city,
    name: page.h1,
    description: page.shortDescription,
    url: `${SITE_URL}/services/${page.slug}`,
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
      name: "Burch Contracting",
    },
    url: `${SITE_URL}/locations/${page.slug}`,
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

export function buildReviewSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "LocalBusiness",
      name: "Burch Contracting",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    author: {
      "@type": "Person",
      name: "Verified Homeowner",
    },
    reviewBody:
      "Burch Contracting communicated clearly, delivered high-quality craftsmanship, and kept our remodeling project organized from start to finish.",
  };
}
