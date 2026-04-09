import type { Metadata } from 'next';
import HomeRenovationsHub from '@/components/seo/HomeRenovationsHub';
import { homeRenovationsHub } from '@/lib/seo/renovationSeoData';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: homeRenovationsHub.metaTitle,
  description: homeRenovationsHub.metaDescription,
  alternates: {
    canonical: absoluteUrl(homeRenovationsHub.path),
  },
  openGraph: {
    title: homeRenovationsHub.metaTitle,
    description: homeRenovationsHub.metaDescription,
    url: absoluteUrl(homeRenovationsHub.path),
    type: 'website',
  },
};

export default function HomeRenovationsPage() {
  return <HomeRenovationsHub />;
}
