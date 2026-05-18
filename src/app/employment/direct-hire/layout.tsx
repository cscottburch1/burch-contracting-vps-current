import { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Apply for a Position | Direct Hire | Burch Contracting',
  description: 'Apply for a full-time or part-time position with Burch Contracting in Upstate South Carolina. Carpenters, laborers, project managers & more. Competitive wages and benefits.',
  alternates: {
    canonical: absoluteUrl('/employment/direct-hire'),
  },
  openGraph: {
    title: 'Apply for a Position | Burch Contracting',
    description: 'Apply for direct hire positions with Burch Contracting — competitive wages, benefits, and steady work in Upstate SC.',
    url: absoluteUrl('/employment/direct-hire'),
    type: 'website',
  },
};

export default function DirectHireLayout({ children }: { children: React.ReactNode }) {
  return children;
}
