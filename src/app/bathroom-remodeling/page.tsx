import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RenovationSeoLanding from '@/components/seo/RenovationSeoLanding';
import { getRenovationServicePage } from '@/lib/seo/renovationSeoData';
import { absoluteUrl } from '@/lib/seo/site';

const page = getRenovationServicePage('bathroom-remodeling');

export const metadata: Metadata = page
  ? {
      title: page.metaTitle,
      description: page.metaDescription,
      alternates: {
        canonical: absoluteUrl(page.path),
      },
      openGraph: {
        title: page.metaTitle,
        description: page.metaDescription,
        url: absoluteUrl(page.path),
        type: 'website',
      },
    }
  : {};

export default function BathroomRemodelingPage() {
  if (!page) {
    notFound();
  }

  return <RenovationSeoLanding page={page} />;
}
