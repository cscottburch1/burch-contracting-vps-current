import type { Metadata } from 'next';
import Script from 'next/script';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import AdditionsClientCalculator from './_ClientCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema, buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Home Additions & Outdoor Living Cost Calculator | Simpsonville & Fountain Inn SC',
  description:
    'Estimate costs for room additions, screened porches, decks, garages, and outdoor living projects in Simpsonville, Fountain Inn, and Greenville County, SC. Local installed pricing from Burch Contracting.',
  alternates: { canonical: absoluteUrl('/calculator/additions') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Home Additions Cost Calculator | Burch Contracting',
    description:
      'Plan your room addition, deck, screened porch, or garage with transparent local pricing for Simpsonville and Upstate SC.',
    url: absoluteUrl('/calculator/additions'),
  },
};

export default function AdditionsCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Additions & Outdoor Living Calculator', href: '/calculator/additions' },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(
    breadcrumbs.map((b) => ({ name: b.label, url: absoluteUrl(b.href!) }))
  );

  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'Home Additions & Outdoor Living Cost Calculator',
    description:
      'Estimate costs for room additions, screened porches, decks, garages, and outdoor living spaces in Simpsonville, Fountain Inn, and Greenville County, SC.',
    url: absoluteUrl('/calculator/additions'),
    serviceName: 'Home Additions & Outdoor Living Construction',
    minPrice: 9000,
    maxPrice: 200000,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'Home Additions & Outdoor Living Cost Data',
    description: 'Transparent home addition and outdoor living pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/additions'),
    serviceName: 'Home Additions & Outdoor Living Construction',
    minPrice: 9000,
    maxPrice: 200000,
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
        title="Home Additions & Outdoor Living Cost Calculator"
        breadcrumbs={breadcrumbs}
        showAuthor={true}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: '35+ years | Additions, decks & porches specialist',
        }}
        showCredentials={true}
        credentialsVariant="compact"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={[
          { title: 'Screened Porches', href: '/screened-porches', description: 'Professional porch construction' },
          { title: 'Custom Decks', href: '/deck-builder', description: 'Deck design and building' },
          { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
        ]}
        showCTA={false}
        hideTitle={true}
        rawContent={true}
      >
        <AdditionsClientCalculator />
      </UniversalPageTemplate>
    </>
  );
}
