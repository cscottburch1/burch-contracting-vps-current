import type { Metadata } from 'next';
import Script from 'next/script';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import ProjectCostCalculator from '@/components/calculators/ProjectCostCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema, buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Basement Finishing Cost Calculator Simpsonville & Fountain Inn SC',
  description:
    'Estimate basement finishing budgets for rec rooms, home offices, guest suites, and premium basement projects in the Upstate South Carolina market.',
  alternates: { canonical: absoluteUrl('/calculator/basement-finishing') },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Basement Finishing Cost Calculator | Burch Contracting',
    description:
      'Budget basement remodeling investments for homes in Simpsonville and Fountain Inn, SC with local installed pricing ranges.',
    url: absoluteUrl('/calculator/basement-finishing'),
  },
};

export default function BasementFinishingCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Basement Finishing Calculator', href: '/calculator/basement-finishing' },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(
    breadcrumbs.map((b) => ({ name: b.label, url: absoluteUrl(b.href!) }))
  );

  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'Basement Finishing Cost Calculator',
    description: 'Calculate basement finishing costs for Simpsonville, Fountain Inn, and Greenville County. Estimate rec rooms, home offices, and entertainment spaces with transparent pricing per square foot.',
    url: absoluteUrl('/calculator/basement-finishing'),
    serviceName: 'Basement Finishing',
    minPrice: 25000,
    maxPrice: 75000,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'Basement Finishing Cost Calculator',
    description: 'Transparent basement finishing pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/basement-finishing'),
    serviceName: 'Basement Finishing',
    minPrice: 25000,
    maxPrice: 75000,
    dateModified: '2026-05-02',
  });

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
      title="Basement Finishing Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'C. Scott Burch',
        role: 'Owner & Lead Contractor',
        experience: '35+ years | 32 basements finished',
      }}
      showCredentials={true}
      credentialsVariant="compact"
      lastUpdated={new Date('2026-04-17')}
      relatedPages={[
        { title: 'Basement Finishing', href: '/basement-finishing', description: 'Professional basement finishing' },
        { title: 'Room Additions', href: '/room-additions', description: 'Alternative to basement finishing' },
        { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
      ]}
      showCTA={false}
      hideTitle={true}
      rawContent={true}
    >
      <ProjectCostCalculator
        title="Basement Finishing Cost Calculator"
        intro="Estimate the cost of converting unfinished square footage into a comfortable family room, office, guest suite, or premium entertainment level."
        icon="Sofa"
        marketLabel="Simpsonville, Fountain Inn, Greenville County, and Laurens County"
        options={[
          {
            label: 'Basic Basement Finish',
            unit: 'sq ft',
            defaultQuantity: 700,
            lowRate: 42,
            highRate: 60,
            leadTime: '5 to 8 weeks',
            scope: 'Framing, insulation, drywall, flooring, trim, standard electrical, and code-compliant finishes.',
          },
          {
            label: 'Lifestyle Upgrade Basement',
            unit: 'sq ft',
            defaultQuantity: 850,
            lowRate: 61,
            highRate: 88,
            leadTime: '6 to 10 weeks',
            scope: 'Adds custom storage, upgraded lighting, feature walls, or flexible rec room / office planning.',
          },
          {
            label: 'Premium Basement Suite',
            unit: 'sq ft',
            defaultQuantity: 950,
            lowRate: 89,
            highRate: 135,
            leadTime: '8 to 14 weeks',
            scope: 'Wet bar, full bath, theater wiring, luxury finishes, and engineered HVAC zoning.',
          },
        ]}
      />
    </UniversalPageTemplate>
    </>
  );
}
