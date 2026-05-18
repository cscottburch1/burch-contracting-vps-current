import { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Employment Opportunities | Burch Contracting Upstate SC',
  description: 'Join the Burch Contracting team in Upstate South Carolina. Positions for carpenters, laborers, project managers & subcontractor partnerships. Competitive wages, steady work.',
  alternates: {
    canonical: absoluteUrl('/employment'),
  },
  openGraph: {
    title: 'Employment Opportunities | Burch Contracting',
    description: 'Join the Burch Contracting team in Upstate SC. Direct hire and subcontractor opportunities available.',
    url: absoluteUrl('/employment'),
    type: 'website',
  },
};

export default function EmploymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
