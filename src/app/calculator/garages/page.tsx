import type { Metadata } from 'next';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Garage Cost Calculator Simpsonville & Fountain Inn SC | Burch Contracting',
  description:
    'Calculate garage costs with competitive local pricing. From attached garages to detached workshops. Transparent 22.5% overhead & profit.',
  alternates: { canonical: absoluteUrl('/calculator/garages') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Garage Cost Calculator | Competitive Local Pricing | Burch Contracting',
    description:
      'Get accurate garage estimates for Simpsonville, Fountain Inn, and Greenville County with our transparent pricing calculator.',
    url: absoluteUrl('/calculator/garages'),
  },
};

export default function GaragesCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/cost' },
    { label: 'Garage Calculator', href: '/calculator/garages' },
  ];

  return (
    <UniversalPageTemplate
      title="Garage Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'C. Scott Burch',
        role: 'Owner & Lead Contractor',
        experience: '35+ years | 27 garages built',
      }}
      showCredentials={true}
      credentialsVariant="compact"
      lastUpdated={new Date('2026-04-17')}
      relatedPages={[
        { title: 'Garage Construction', href: '/garage-builder', description: 'Professional garage building' },
        { title: 'ADU Builder', href: '/adu-builder', description: 'Garage apartments & cottages' },
        { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
      ]}
      showCTA={false}
    >
      <CompetitivePricingCalculator
        serviceKey="garages"
        title="Garage Cost Calculator"
        intro="Plan your garage project with competitive local pricing. Choose from attached garages, detached structures, or upgraded workshop spaces with transparent cost breakdowns."
        icon="Warehouse"
        marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
      />
    </UniversalPageTemplate>
  );
}
