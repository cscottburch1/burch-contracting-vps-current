import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Burch Contracting - Free Estimates',
  description: 'Get a free estimate for your home improvement project. Contact Burch Contracting in Simpsonville, SC. Call (864) 724-4600 or fill out our contact form for a quick response.',
  keywords: ['contact contractor', 'free estimate', 'home improvement quote', 'Simpsonville contractor', 'Burch Contracting contact', 'request estimate'],
  openGraph: {
    title: 'Contact Burch Contracting - Free Estimates',
    description: 'Request a free estimate for your home repair or remodeling project. Fast, professional service in Simpsonville, SC.',
    url: 'https://burchcontracting.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
