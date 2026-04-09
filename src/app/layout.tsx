import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";
import dynamic from 'next/dynamic';
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsEvents from "@/components/AnalyticsEvents";
import { absoluteUrl, siteConfig } from "@/lib/seo/site";

// Dynamic import for non-critical interactive components
const MobileStickyCta = dynamic(() => import('@/components/MobileStickyCta'));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  weight: ['400'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: 'Burch Contracting | Garage Builders, Room Additions, Screened Porches, Decks & ADUs in Upstate SC',
  description: "Burch Contracting helps homeowners across Upstate South Carolina plan garage construction, room additions, screened porches, deck building, and ADUs with clear estimates and local expertise.",
  authors: [{ name: "Burch Contracting" }],
  creator: "Burch Contracting",
  publisher: "Burch Contracting",
  alternates: {
    canonical: absoluteUrl('/'),
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
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
    title: "Burch Contracting | Garage Builders, Room Additions, Screened Porches, Decks & ADUs in Upstate SC",
    description: "Garage construction, room additions, screened porches, deck building, and ADU planning for homeowners across Simpsonville, Fountain Inn, Mauldin, Laurens, and nearby Upstate communities.",
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
    title: "Burch Contracting | Local Garage, Addition, Porch, Deck & ADU Contractor",
    description: "Request a free estimate for garage construction, room additions, aluminum screened porches, deck building, and ADU projects across Upstate South Carolina.",
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
        {/* Resource hints for faster CSS/font loading */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <AnalyticsEvents />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileStickyCta />
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
