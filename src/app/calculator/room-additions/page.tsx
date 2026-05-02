import type { Metadata } from 'next';
import Script from 'next/script';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Home Addition Cost Calculator Simpsonville & Fountain Inn SC | Burch Contracting',
  description:
    'Calculate home addition costs with competitive local pricing. From basic additions to luxury master suites. Transparent 22.5% overhead & profit.',
  alternates: { canonical: absoluteUrl('/calculator/room-additions') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Home Addition Cost Calculator | Competitive Local Pricing | Burch Contracting',
    description:
      'Get accurate home addition estimates for Simpsonville, Fountain Inn, and Greenville County with our transparent pricing calculator.',
    url: absoluteUrl('/calculator/room-additions'),
  },
};

export default function RoomAdditionsCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/cost' },
    { label: 'Room Addition Calculator', href: '/calculator/room-additions' },
  ];

  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'Room Addition Cost Calculator',
    description: 'Calculate room addition costs for Simpsonville, Fountain Inn, and Greenville County. Estimate single-story and two-story additions with transparent pricing per square foot.',
    url: absoluteUrl('/calculator/room-additions'),
    serviceName: 'Room Additions',
    minPrice: 45000,
    maxPrice: 180000,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'Room Addition Cost Calculator',
    description: 'Transparent room addition construction pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/room-additions'),
    serviceName: 'Room Additions',
    minPrice: 45000,
    maxPrice: 180000,
    dateModified: '2026-05-02',
  });

  return (
    <>
      <Script
        id="calculator-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      <Script
        id="calculator-dataset-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <UniversalPageTemplate
      title="Room Addition Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'C. Scott Burch',
        role: 'Owner & Lead Contractor',
        experience: '35+ years | 23 room additions completed',
      }}
      showCredentials={true}
      credentialsVariant="compact"
      lastUpdated={new Date('2026-04-17')}
      relatedPages={[
        { title: 'Room Additions', href: '/room-additions', description: 'Professional addition construction' },
        { title: 'Basement Finishing', href: '/basement-finishing', description: 'Alternative to additions' },
        { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
      ]}
      showCTA={false}
    >
      <CompetitivePricingCalculator
        serviceKey="homeAdditions"
        title="Home Addition Cost Calculator"
        intro="Plan your home addition project with competitive local pricing. From simple room additions to luxury master suites with transparent cost breakdowns for all factors."
        icon="Construction"
        marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
      />
    </UniversalPageTemplate>
    </>
  );
}
