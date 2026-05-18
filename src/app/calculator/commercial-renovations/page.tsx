import type { Metadata } from 'next';
import Script from 'next/script';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import CommercialRenovationsClientCalculator from './_ClientCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema, buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Commercial Renovation Cost Calculator | Simpsonville & Greenville SC',
  description:
    'Estimate commercial renovation costs for office, retail, restaurant, medical, and warehouse spaces with local pricing for Simpsonville, Fountain Inn, and Greenville County, SC.',
  alternates: { canonical: absoluteUrl('/calculator/commercial-renovations') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Commercial Renovation Cost Calculator | Burch Contracting',
    description:
      'Plan your commercial build-out or renovation with transparent local pricing for Simpsonville and Upstate SC.',
    url: absoluteUrl('/calculator/commercial-renovations'),
  },
};

export default function CommercialRenovationsCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Commercial Renovations Calculator', href: '/calculator/commercial-renovations' },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(
    breadcrumbs.map((b) => ({ name: b.label, url: absoluteUrl(b.href!) }))
  );

  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'Commercial Renovation Cost Calculator',
    description:
      'Estimate office, retail, restaurant, medical, and warehouse renovation costs in Simpsonville, Fountain Inn, and Greenville County, SC.',
    url: absoluteUrl('/calculator/commercial-renovations'),
    serviceName: 'Commercial Renovations',
    minPrice: 9000,
    maxPrice: 200000,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'Commercial Renovation Cost Data',
    description: 'Transparent commercial renovation pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/commercial-renovations'),
    serviceName: 'Commercial Renovations',
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
        title="Commercial Renovation Cost Calculator"
        breadcrumbs={breadcrumbs}
        showAuthor={true}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: '35+ years | Commercial renovations specialist',
        }}
        showCredentials={true}
        credentialsVariant="compact"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={[
          { title: 'Commercial Services', href: '/commercial', description: 'Full commercial renovation services' },
          { title: 'Contact Us', href: '/contact', description: 'Schedule an on-site consultation' },
          { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
        ]}
        showCTA={false}
        hideTitle={true}
        rawContent={true}
      >
        <CommercialRenovationsClientCalculator />
      </UniversalPageTemplate>
    </>
  );
}
