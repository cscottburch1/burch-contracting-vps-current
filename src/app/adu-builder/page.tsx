import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocalSeoLanding from '@/components/seo/LocalSeoLanding';
import { getServiceHubBySlug } from '@/lib/seo/localDominanceData';
import { absoluteUrl } from '@/lib/seo/site';

const page = getServiceHubBySlug('adu-builder');

export const metadata: Metadata = page
  ? {
      title: page.metaTitle,
      description: page.metaDescription,
      alternates: { canonical: absoluteUrl(page.path) },
      openGraph: {
        title: page.metaTitle,
        description: page.metaDescription,
        url: absoluteUrl(page.path),
        type: 'website',
      },
    }
  : {};

export default function AduBuilderPage() {
  if (!page) {
    notFound();
  }

  return <LocalSeoLanding page={page} />;
}
