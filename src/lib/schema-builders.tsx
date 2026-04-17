import { businessConfig } from '@/config/business';

interface ServiceSchemaOptions {
  serviceName: string;
  serviceType: string;
  description: string;
  url: string;
  serviceArea?: string[];
  priceRange?: string;
  areaServed?: {
    city: string;
    state: string;
  }[];
  availableChannel?: {
    url: string;
    name: string;
  }[];
}

interface FAQSchemaItem {
  question: string;
  answer: string;
}

interface ReviewSchemaItem {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}

interface ProjectSchemaOptions {
  name: string;
  description: string;
  url: string;
  image?: string[];
  startDate?: string;
  endDate?: string;
  location?: {
    city: string;
    state: string;
  };
  client?: string;
}

/**
 * Generate LocalBusiness schema with all E-E-A-T signals
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${businessConfig.seo.baseUrl}#business`,
    name: businessConfig.name,
    alternateName: 'Burch Contracting',
    description: businessConfig.tagline,
    url: businessConfig.seo.baseUrl,
    logo: `${businessConfig.seo.baseUrl}/logo.png`,
    image: `${businessConfig.seo.baseUrl}/images/office-exterior.jpg`,
    
    // Contact information
    telephone: businessConfig.contact.phone,
    email: businessConfig.contact.email,
    
    // Address
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessConfig.contact.address,
      addressLocality: businessConfig.contact.city,
      addressRegion: businessConfig.contact.state,
      postalCode: businessConfig.contact.zip,
      addressCountry: 'US'
    },
    
    // Geo coordinates
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.6341746,
      longitude: -82.0744941
    },
    
    // Service area
    areaServed: businessConfig.serviceArea.locations.map(area => ({
      '@type': 'City',
      name: area,
      addressRegion: 'SC',
      addressCountry: 'US'
    })),
    
    // Business hours
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '12:00'
      }
    ],
    
    // Ratings & reviews
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '247',
      bestRating: '5',
      worstRating: '1'
    },
    
    // Price range
    priceRange: '$$-$$$',
    
    // Credentials
    slogan: businessConfig.tagline,
    foundingDate: '1995',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '12'
    },
    
    // Same as (social/external profiles)
    sameAs: [
      businessConfig.credentials.bbbUrl,
      businessConfig.credentials.googleUrl,
      `${businessConfig.seo.baseUrl}/about`
    ],
    
    // Services offered
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Construction Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Deck Building',
            description: 'Professional custom deck construction and installation'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Screened Porch Construction',
            description: 'Expert screened porch design and building services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Garage Construction',
            description: 'Custom garage building and detached garage construction'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Home Additions',
            description: 'Room additions, bump-outs, and home expansions'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Kitchen Remodeling',
            description: 'Complete kitchen renovation and remodeling services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Bathroom Remodeling',
            description: 'Professional bathroom renovation and updates'
          }
        }
      ]
    }
  };
}

/**
 * Generate Service schema for specific service pages
 */
export function generateServiceSchema(options: ServiceSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: options.serviceType,
    name: options.serviceName,
    description: options.description,
    url: options.url,
    
    provider: {
      '@type': 'GeneralContractor',
      name: businessConfig.name,
      telephone: businessConfig.contact.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: businessConfig.contact.address,
        addressLocality: businessConfig.contact.city,
        addressRegion: businessConfig.contact.state,
        postalCode: businessConfig.contact.zip
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '247'
      }
    },
    
    areaServed: options.areaServed || businessConfig.serviceArea.locations.map(area => ({
      '@type': 'City',
      name: area,
      addressRegion: 'SC'
    })),
    
    availableChannel: options.availableChannel || [
      {
        '@type': 'ServiceChannel',
        serviceUrl: businessConfig.seo.baseUrl + '/contact',
        servicePhone: businessConfig.contact.phone
      }
    ],
    
    ...(options.priceRange && { priceRange: options.priceRange }),
    
    brand: {
      '@type': 'Brand',
      name: businessConfig.name
    },
    
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: options.serviceName + ' Services',
      itemListElement: [{
        '@type': 'Offer',
        price: options.priceRange || 'Contact for quote',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString()
      }]
    }
  };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: FAQSchemaItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate Review schema
 */
export function generateReviewSchema(reviews: ReviewSchemaItem[]) {
  return reviews.map(review => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'GeneralContractor',
      name: businessConfig.name
    },
    author: {
      '@type': 'Person',
      name: review.author
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: '5',
      worstRating: '1'
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'Google'
    }
  }));
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

/**
 * Generate Organization schema with detailed E-E-A-T signals
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': businessConfig.seo.baseUrl + '#organization',
    name: businessConfig.name,
    url: businessConfig.seo.baseUrl,
    logo: businessConfig.seo.baseUrl + '/logo.png',
    
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: businessConfig.contact.phone,
      contactType: 'Customer Service',
      areaServed: 'US-SC',
      availableLanguage: 'English'
    },
    
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessConfig.contact.address,
      addressLocality: businessConfig.contact.city,
      addressRegion: businessConfig.contact.state,
      postalCode: businessConfig.contact.zip,
      addressCountry: 'US'
    },
    
    founder: {
      '@type': 'Person',
      name: 'Robert Burch',
      jobTitle: 'Owner & Lead Contractor'
    },
    
    foundingDate: '1995',
    
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '12'
    },
    
    award: [
      'BBB A+ Rating',
      'Google 5.0 Star Rating',
      '30+ Years in Business'
    ],
    
    sameAs: [
      businessConfig.credentials.bbbUrl,
      businessConfig.credentials.googleUrl
    ]
  };
}

/**
 * Generate Project/CreativeWork schema for portfolio items
 */
export function generateProjectSchema(options: ProjectSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: options.name,
    description: options.description,
    url: options.url,
    ...(options.image && { image: options.image }),
    
    creator: {
      '@type': 'GeneralContractor',
      name: businessConfig.name
    },
    
    ...(options.startDate && { dateCreated: options.startDate }),
    ...(options.endDate && { datePublished: options.endDate }),
    
    ...(options.location && {
      locationCreated: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: options.location.city,
          addressRegion: options.location.state
        }
      }
    }),
    
    ...(options.client && {
      sponsor: {
        '@type': 'Person',
        name: options.client
      }
    })
  };
}

/**
 * Helper to inject schema into page head
 */
export function injectSchema(schema: any) {
  if (typeof window === 'undefined') {
    // Server-side: return script tag
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }
  return null;
}

/**
 * Generate HowTo schema for project process
 * Used for "Our Simple Process" sections
 */
export function generateHowToSchema(options?: {
  name?: string;
  description?: string;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: options?.name || 'How to Work with Burch Contracting',
    description: options?.description || 'Our simple 4-step process from consultation to project completion for home renovation projects in Upstate SC.',
    url: options?.url || businessConfig.seo.baseUrl,
    image: `${businessConfig.seo.baseUrl}/images/process-overview.jpg`,
    
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: 'Varies by project'
    },
    
    totalTime: 'PT2W',  // Varies, but average ~2 weeks for typical projects
    
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Request Your Free Estimate',
        text: 'Call us at (864) 724-4600 or fill out our contact form to get started with your home improvement project.',
        url: `${businessConfig.seo.baseUrl}/contact`,
        image: `${businessConfig.seo.baseUrl}/images/step-1-contact.jpg`
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'On-Site Visit & Project Review',
        text: 'We visit your property to understand your vision and assess site conditions. Typical consultation takes 30-45 minutes.',
        url: `${businessConfig.seo.baseUrl}/contact`,
        image: `${businessConfig.seo.baseUrl}/images/step-2-consultation.jpg`
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Clear Scope & Pricing',
        text: 'Receive a detailed written estimate within 3-5 business days with transparent pricing, timeline, and scope breakdown.',
        url: `${businessConfig.seo.baseUrl}/services`,
        image: `${businessConfig.seo.baseUrl}/images/step-3-estimate.jpg`
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Professional Construction',
        text: 'We build your project with quality, craftsmanship and attention to detail, with regular progress updates throughout construction.',
        url: `${businessConfig.seo.baseUrl}/projects`,
        image: `${businessConfig.seo.baseUrl}/images/step-4-construction.jpg`
      }
    ],
    
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Cost Calculator'
      },
      {
        '@type': 'HowToTool',
        name: 'Free Consultation'
      }
    ]
  };
}
