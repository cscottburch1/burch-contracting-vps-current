import type { Metadata } from 'next';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'ADU Cost Calculator Simpsonville & Fountain Inn SC | Burch Contracting',
  description:
    'Calculate ADU and accessory dwelling unit costs with competitive local pricing. From garage apartments to backyard cottages. Transparent 22.5% overhead & profit.',
  alternates: { canonical: absoluteUrl('/calculator/adus') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'ADU Cost Calculator | Competitive Local Pricing | Burch Contracting',
    description:
      'Get accurate ADU estimates for Simpsonville, Fountain Inn, and Greenville County with our transparent pricing calculator.',
    url: absoluteUrl('/calculator/adus'),
  },
};

export default function ADUCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/cost' },
    { label: 'ADU Calculator', href: '/calculator/adus' },
  ];

  return (
    <UniversalPageTemplate
      title="ADU Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'C. Scott Burch',
        role: 'Owner & Lead Contractor',
        experience: '30+ years | 12 ADUs built',
      }}
      showCredentials={true}
      credentialsVariant="compact"
      lastUpdated={new Date('2026-04-19')}
      relatedPages={[
        { title: 'ADU Builder', href: '/adu-builder', description: 'Professional ADU construction' },
        { title: 'Garage Builder', href: '/garage-builder', description: 'Garage apartments' },
        { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
      ]}
      showCTA={false}
    >
      <CompetitivePricingCalculator
        serviceKey="adus"
        title="ADU Cost Calculator"
        intro="Plan your accessory dwelling unit project with competitive local pricing. From garage apartments to detached backyard cottages with transparent cost breakdowns for all construction phases."
        icon="Home"
        marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
      />
    </UniversalPageTemplate>
  );
}
