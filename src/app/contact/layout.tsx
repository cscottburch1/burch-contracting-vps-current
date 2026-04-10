import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Burch Contracting | Free Estimate',
  description: 'Request a free estimate from Burch Contracting in Simpsonville, SC. Call (864) 724-4600 or send us your project details online.',
  keywords: ['contact contractor', 'free estimate', 'home improvement quote', 'Simpsonville contractor', 'Burch Contracting contact', 'request estimate'],
  openGraph: {
    title: 'Contact Burch Contracting | Free Estimate',
    description: 'Request a free estimate for your home repair or remodeling project in Simpsonville and nearby Upstate SC areas.',
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
