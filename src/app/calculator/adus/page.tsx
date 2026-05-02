import type { Metadata } from 'next';
import Script from 'next/script';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import ProjectCostCalculator from '@/components/calculators/ProjectCostCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'ADU Cost Calculator Simpsonville & Fountain Inn SC | Burch Contracting',
  description:
    'Calculate ADU and accessory dwelling unit costs with local pricing. From garage apartments to backyard cottages. Licensed contractor estimates.',
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

  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'ADU Cost Calculator',
    description: 'Calculate ADU and accessory dwelling unit costs for Simpsonville, Fountain Inn, and Greenville County. Estimate garage apartments and backyard cottages with transparent pricing.',
    url: absoluteUrl('/calculator/adus'),
    serviceName: 'ADU Construction',
    minPrice: 50000,
    maxPrice: 180000,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'ADU Cost Calculator',
    description: 'Transparent ADU construction pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/adus'),
    serviceName: 'ADU Construction',
    minPrice: 50000,
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
      title="ADU Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'C. Scott Burch',
        role: 'Owner & Lead Contractor',
        experience: '35+ years | 12 ADUs built',
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
      <ProjectCostCalculator
        title="ADU Cost Calculator"
        intro="Estimate the cost of building an accessory dwelling unit (ADU) - from simple garage apartments to fully detached backyard cottages with kitchen, bath, and living space."
        icon="Home"
        marketLabel="Simpsonville, Fountain Inn, Gray Court & Greenville County"
        options={[
          {
            label: 'Garage Apartment (Above Existing Garage)',
            unit: 'sq ft',
            defaultQuantity: 550,
            lowRate: 95,
            highRate: 135,
            leadTime: '8 to 12 weeks',
            scope: 'Finish space above existing garage with kitchenette, bath, and living area. Includes stairs, utilities, and finishes.',
          },
          {
            label: 'Basic Detached ADU',
            unit: 'sq ft',
            defaultQuantity: 650,
            lowRate: 165,
            highRate: 215,
            leadTime: '12 to 18 weeks',
            scope: 'Complete new construction ADU with foundation, framing, roof, basic kitchen, bath, HVAC, and standard finishes.',
          },
          {
            label: 'Premium Backyard Cottage',
            unit: 'sq ft',
            defaultQuantity: 800,
            lowRate: 220,
            highRate: 295,
            leadTime: '16 to 24 weeks',
            scope: 'High-end ADU with custom design, full kitchen, luxury bath, upgraded finishes, covered porch, and landscaping.',
          },
        ]}
      />
    </UniversalPageTemplate>
    </>
  );
}
