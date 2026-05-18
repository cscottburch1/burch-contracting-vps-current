import { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Get a Free Estimate | Simpsonville SC Contractor | Burch Contracting',
  description: 'Request a free estimate from Burch Contracting. Garages, additions, decks, screened porches & remodeling. Serving Simpsonville, Mauldin, Fountain Inn & Woodruff SC. Call (864) 724-4600.',
  alternates: {
    canonical: absoluteUrl('/contact'),
  },
  openGraph: {
    title: 'Get a Free Estimate | Burch Contracting',
    description: 'Request a free estimate for additions, garages, outdoor living & remodeling in Upstate SC.',
    url: absoluteUrl('/contact'),
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
