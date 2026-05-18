import type { Metadata } from 'next';
import Script from 'next/script';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema, buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Screened Porch Cost Calculator Simpsonville & Fountain Inn SC | Burch Contracting',
  description:
    'Calculate screened porch costs with competitive local pricing. From screen enclosures to complete outdoor rooms. Transparent 22.5% overhead & profit.',
  alternates: { canonical: absoluteUrl('/calculator/screened-porches') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Screened Porch Cost Calculator | Competitive Local Pricing | Burch Contracting',
    description:
      'Get accurate screened porch estimates for Simpsonville, Fountain Inn, and Greenville County with our transparent pricing calculator.',
    url: absoluteUrl('/calculator/screened-porches'),
  },
};

export default function ScreenedPorchesCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Screened Porch Calculator', href: '/calculator/screened-porches' },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(
    breadcrumbs.map((b) => ({ name: b.label, url: absoluteUrl(b.href!) }))
  );

  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'Screened Porch Cost Calculator',
    description: 'Calculate screened porch construction costs for Simpsonville, Fountain Inn, and Greenville County with transparent pricing for screen enclosures and outdoor living spaces.',
    url: absoluteUrl('/calculator/screened-porches'),
    serviceName: 'Screened Porch Construction',
    minPrice: 15000,
    maxPrice: 55000,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'Screened Porch Cost Calculator',
    description: 'Transparent screened porch construction pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/screened-porches'),
    serviceName: 'Screened Porch Construction',
    minPrice: 15000,
    maxPrice: 55000,
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
      title="Screened Porch Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'C. Scott Burch',
        role: 'Owner & Lead Contractor',
        experience: '35+ years | 50+ screened porches built',
      }}
      showCredentials={true}
      credentialsVariant="compact"
      lastUpdated={new Date('2026-04-17')}
      relatedPages={[
        { title: 'Screened Porches', href: '/screened-porches', description: 'Professional porch construction' },
        { title: 'Custom Decks', href: '/deck-builder', description: 'Build a deck first' },
        { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
      ]}
      showCTA={false}
      hideTitle={true}
      rawContent={true}
    >
      <CompetitivePricingCalculator
        serviceKey="screenedPorches"
        title="Screened Porch Cost Calculator"
        intro="Plan your screened porch or outdoor room with competitive local pricing. From basic screen enclosures to complete outdoor living spaces with premium finishes."
        icon="Home"
        marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
      />
    </UniversalPageTemplate>
    </>
  );
}
