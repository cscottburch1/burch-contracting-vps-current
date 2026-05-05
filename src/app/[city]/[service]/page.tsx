import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocalSeoLanding from '@/components/seo/LocalSeoLanding';
import RenovationSeoLanding from '@/components/seo/RenovationSeoLanding';
import { getLocalDominancePage, localDominancePages } from '@/lib/seo/localDominanceData';
import { getRenovationCityPage, renovationCityPages } from '@/lib/seo/renovationSeoData';
import { absoluteUrl } from '@/lib/seo/site';

interface CityServicePageProps {
  params: Promise<{ city: string; service: string }>;
}

export const dynamicParams = true;

export function generateStaticParams() {
  return [...localDominancePages, ...renovationCityPages].map((page) => ({
    city: page.city?.slug ?? '',
    service: page.service.slug,
  }));
}

export async function generateMetadata({ params }: CityServicePageProps): Promise<Metadata> {
  const { city, service } = await params;
  const page = getLocalDominancePage(city, service) ?? getRenovationCityPage(city, service);

  if (!page) {
    return {};
  }

  return {
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
  };
}

export default async function CityServicePage({ params }: CityServicePageProps) {
  const { city, service } = await params;
  const localPage = getLocalDominancePage(city, service);
  const renovationPage = getRenovationCityPage(city, service);

  if (renovationPage) {
    return <RenovationSeoLanding page={renovationPage} />;
  }

  if (!localPage) {
    notFound();
  }

  return <LocalSeoLanding page={localPage} />;
}
