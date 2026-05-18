import { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Join as a Subcontractor | Burch Contracting Upstate SC',
  description: 'Partner with Burch Contracting as a licensed subcontractor in Upstate South Carolina. Access project bids, scheduling tools, and documentation portal. Apply today.',
  alternates: {
    canonical: absoluteUrl('/subcontractors/join'),
  },
  openGraph: {
    title: 'Join as a Subcontractor | Burch Contracting',
    description: 'Partner with Burch Contracting as a subcontractor. Project bids, scheduling, and documentation tools in Upstate SC.',
    url: absoluteUrl('/subcontractors/join'),
    type: 'website',
  },
};

export default function SubcontractorJoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
