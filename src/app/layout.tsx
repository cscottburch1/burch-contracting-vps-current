import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsEvents from "@/components/AnalyticsEvents";
import DeferredMobileStickyCta from '@/components/DeferredMobileStickyCta';
import { absoluteUrl, siteConfig } from "@/lib/seo/site";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  weight: ['400'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: 'Upstate SC Home Contractor | Burch Contracting',
  description: 'Licensed Upstate SC contractor for additions, garages, outdoor living, remodeling, and commercial upfits. Serving Simpsonville, Mauldin, Fountain Inn, and Woodruff.',
  authors: [{ name: "Burch Contracting" }],
  creator: "Burch Contracting",
  publisher: "Burch Contracting",
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      'en-US': absoluteUrl('/'),
      'x-default': absoluteUrl('/'),
    },
  },
  icons: {
    icon: [
      { url: '/favicon.webp', type: 'image/webp' },
    ],
    shortcut: '/favicon.webp',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Burch Crew',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl('/'),
    siteName: "Burch Contracting",
    title: "Burch Contracting | Upstate SC Additions, Garages & Outdoor Living",
    description: "SC licensed general contractor serving Simpsonville, Mauldin, Fountain Inn and Woodruff with additions, garages, decks, screened porches, remodeling and commercial upfits.",
    images: [
      {
        url: absoluteUrl(siteConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: "Burch Contracting remodeling and home improvement services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burch Contracting | Upstate SC Contractor",
    description: "Additions, garages, outdoor living, remodeling and commercial upfits in Simpsonville, Mauldin, Fountain Inn and Woodruff.",
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  verification: {
    google: "ntiguLhlJqrZC6Iwzu-HD4CGZrBaofiBXgsdc-F8B0w",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical third-party domains for faster script loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preload" href="/basement-finishing.webp" as="image" fetchPriority="high" />
        
        {/* AI/LLM discovery reference */}
        <link rel="llms-txt" href="/llms.txt" type="text/plain" />
        
      </head>
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "LocalBusiness",
                  "@id": "https://burchcontracting.com/#business",
                  "name": "Burch Contracting",
                  "url": "https://burchcontracting.com",
                  "logo": { "@type": "ImageObject", "url": "https://burchcontracting.com/logo-transparent.webp" },
                  "image": "https://burchcontracting.com/og-image.webp",
                  "description": "Licensed SC general contractor (CLG118679) specializing in garage construction, room additions, decks, screened porches, remodeling, and commercial upfits across Upstate South Carolina since 1995.",
                  "telephone": "+18647244600",
                  "email": "estimates@burchcontracting.com",
                  "foundingDate": "1995",
                  "hasCredential": "SC General Contractor License CLG118679",
                  "award": "BBB Accredited Business — A+ Rating since 2014",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "1095 Water Tank Rd",
                    "addressLocality": "Gray Court",
                    "addressRegion": "SC",
                    "postalCode": "29645",
                    "addressCountry": "US"
                  },
                  "geo": { "@type": "GeoCoordinates", "latitude": 34.6341746, "longitude": -82.0744941 },
                  "openingHoursSpecification": [
                    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "17:00" },
                    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "09:00", "closes": "12:00" }
                  ],
                  "areaServed": [
                    {"@type": "City", "name": "Simpsonville", "sameAs": "https://en.wikipedia.org/wiki/Simpsonville,_South_Carolina"},
                    {"@type": "City", "name": "Mauldin"},
                    {"@type": "City", "name": "Fountain Inn"},
                    {"@type": "City", "name": "Woodruff"},
                    {"@type": "City", "name": "Greenville"},
                    {"@type": "City", "name": "Greer"},
                    {"@type": "City", "name": "Five Forks"},
                    {"@type": "City", "name": "Laurens"},
                    {"@type": "City", "name": "Gray Court"}
                  ],
                  "hasMap": "https://www.google.com/maps/place/Burch+Contracting/@34.6341746,-82.0744941,17z",
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Construction Services",
                    "itemListElement": [
                      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Garage Construction", "url": "https://burchcontracting.com/garage-builder"}},
                      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Room Additions", "url": "https://burchcontracting.com/room-additions"}},
                      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Deck Building", "url": "https://burchcontracting.com/outdoor-living/decks"}},
                      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Screened Porch Installation", "url": "https://burchcontracting.com/outdoor-living/screened-porches"}},
                      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Home Remodeling", "url": "https://burchcontracting.com/remodeling"}},
                      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Commercial Tenant Upfits", "url": "https://burchcontracting.com/commercial-upfits"}}
                    ]
                  },
                  "priceRange": "$$$",
                  "currenciesAccepted": "USD",
                  "paymentAccepted": "Cash, Check, Credit Card, Financing",
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "5.0",
                    "bestRating": "5",
                    "worstRating": "1",
                    "ratingCount": "47",
                    "reviewCount": "47"
                  },
                  "sameAs": [
                    "https://www.facebook.com/burchcontracting",
                    "https://www.instagram.com/burchcontracting",
                    "https://www.linkedin.com/company/burch-contracting",
                    "https://www.bbb.org/us/sc/gray-court/profile/home-additions/burch-contracting-llc-0673-90007875",
                    "https://www.houzz.com/professionals/general-contractors/burch-contracting-pfvwus-pf~1385114786"
                  ]
                },
                {
                  "@type": "Person",
                  "@id": "https://burchcontracting.com/#scott-burch",
                  "name": "C. Scott Burch",
                  "jobTitle": "Owner and Lead Contractor",
                  "worksFor": {"@id": "https://burchcontracting.com/#business"},
                  "hasCredential": "SC General Contractor License CLG118679",
                  "knowsAbout": ["garage construction","room additions","deck building","screened porches","home remodeling","commercial upfits"],
                  "url": "https://burchcontracting.com/about"
                },
                {
                  "@type": "WebSite",
                  "@id": "https://burchcontracting.com/#website",
                  "url": "https://burchcontracting.com",
                  "name": "Burch Contracting",
                  "publisher": {"@id": "https://burchcontracting.com/#business"}
                }
              ]
            })
          }}
        />
        <GoogleAnalytics />
        <AnalyticsEvents />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-9999 focus:rounded-md focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <DeferredMobileStickyCta />
        
        {/* Service Worker - Load after page interactive */}
        <Script id="register-sw" strategy="lazyOnload">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
