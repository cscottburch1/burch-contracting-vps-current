import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";
import AIChat from "@/components/AIChat";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "#1 Contractor in Simpsonville, SC | Kitchen, Bath, Decks, Handyman | Burch Contracting",
  description: "Simpsonville's #1 rated contractor for 30+ years! Licensed, insured, BBB A+ rated. Kitchen & bathroom remodeling, handyman, decks, porches, basement finishing. Serving the Upstate SC: Greenville County & Laurens County. Same-day handyman available. Free estimates! Call (864) 724-4600",
  keywords: ["contractor Simpsonville SC", "kitchen remodeling Simpsonville", "bathroom remodeling Simpsonville", "handyman Simpsonville SC", "deck builder Simpsonville", "basement finishing Simpsonville", "home remodeling Upstate SC", "licensed contractor Greenville County", "BBB A+ contractor", "Fountain Inn contractor", "Gray Court contractor", "Woodruff contractor", "Five Forks contractor", "screened porch builder", "room additions Simpsonville", "home repair Laurens County SC"],
  authors: [{ name: "Burch Contracting" }],
  creator: "Burch Contracting",
  publisher: "Burch Contracting",
  icons: {
    icon: '/favicon.webp',
    apple: '/favicon.webp',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://burchcontracting.com",
    siteName: "Burch Contracting - Simpsonville's #1 Rated Contractor",
    title: "#1 Contractor in Simpsonville, SC | Kitchen, Bath, Decks, Handyman | (864) 724-4600",
    description: "Simpsonville's most trusted contractor for 30+ years. Licensed, insured, BBB A+ rated. Kitchen & bathroom remodeling, handyman services, decks, porches, basement finishing. Serving the Upstate SC: Greenville County & Laurens County. Free estimates!",
    images: [
      {
        url: "https://burchcontracting.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Burch Contracting - Professional Home Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burch Contracting | Reliable Home Repair & Remodeling",
    description: "Professional residential and light commercial contracting services in Simpsonville, SC.",
    images: ["https://burchcontracting.com/og-image.jpg"],
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
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <Header />
        <main>{children}</main>
        <Footer />
        <AIChat />
        {recaptchaSiteKey && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
