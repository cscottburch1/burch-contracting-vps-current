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
import { generateLocalBusinessSchema } from '@/lib/schema-builders';

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
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: 'Burch Contracting | Upstate SC Garage & Addition Contractor',
  description: "Burch is an Upstate SC garage, addition, porch, deck, and ADU contractor with clear estimates and local expertise.",
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
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
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
    title: "Burch Contracting | Upstate SC Garage & Addition Contractor",
    description: "Burch is an Upstate SC garage, addition, porch, deck, and ADU contractor for homeowners across the region.",
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
    title: "Burch Contracting | Upstate SC Garage & Addition Contractor",
    description: "Free estimates from an Upstate SC garage, addition, porch, deck, and ADU contractor.",
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
        {/* Resource hints for analytics only; Geist is self-hosted by Next.js */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* AI/LLM discovery reference */}
        <link rel="llms-txt" href="/llms.txt" type="text/plain" />
        {/* LocalBusiness Schema - Sitewide */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLocalBusinessSchema())
          }}
        />
      </head>
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <AnalyticsEvents />
        <Header />
        <main>{children}</main>
        <Footer />
        <DeferredMobileStickyCta />
        <Script id="register-sw" strategy="lazyOnload">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(reg => console.log('Service Worker registered'))
                  .catch(err => console.log('Service Worker registration failed:', err));
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
