import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request an Estimate | Burch Contracting',
  description: 'Request a free estimate from Burch Contracting. Serving Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Call (864) 724-4600 or send us your project details.',
  alternates: {
    canonical: 'https://burchcontracting.com/contact',
  },
  openGraph: {
    title: 'Request an Estimate | Burch Contracting',
    description: 'Request a free estimate for additions, garages, outdoor living & remodeling in Upstate SC.',
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
