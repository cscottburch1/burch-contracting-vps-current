import type { Metadata } from 'next';
import Script from 'next/script';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema } from '@/lib/seo/schema';

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
    { label: 'Calculators', href: '/calculators' },
    { label: 'Garage Calculator', href: '/calculator/garages' },
  ];

  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'Garage Cost Calculator',
    description: 'Calculate garage construction costs for Simpsonville, Fountain Inn, and Greenville County. Estimate 2-car, 3-car, and workshop garage pricing with transparent contractor markup.',
    url: absoluteUrl('/calculator/garages'),
    serviceName: 'Garage Construction',
    minPrice: 25000,
    maxPrice: 75000,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'Garage Construction Cost Calculator',
    description: 'Transparent garage construction pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/garages'),
    serviceName: 'Garage Construction',
    minPrice: 25000,
    maxPrice: 75000,
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
      title="Garage Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'C. Scott Burch',
        role: 'Owner & Lead Contractor',
        experience: '35+ years experience',
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
      hideTitle={true}
      rawContent={true}
    >
      <CompetitivePricingCalculator
        serviceKey="garages"
        title="Garage Cost Calculator"
        intro="Plan your garage project with competitive local pricing. Choose from attached garages, detached structures, or upgraded workshop spaces with transparent cost breakdowns."
        icon="Warehouse"
        marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
      />
    </UniversalPageTemplate>
    </>
  );
}
