import type { Metadata } from 'next';
import Script from 'next/script';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import RemodelingClientCalculator from './_ClientCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema, buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Home Remodeling Cost Calculator | Kitchen & Bathroom Simpsonville & Fountain Inn SC',
  description:
    'Estimate kitchen remodel, bathroom renovation, flooring, and painting costs with local installed pricing for Simpsonville, Fountain Inn, and Greenville County, SC.',
  alternates: { canonical: absoluteUrl('/calculator/remodeling') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Home Remodeling Cost Calculator | Burch Contracting',
    description:
      'Plan your kitchen or bathroom remodel with transparent local pricing for Simpsonville and Upstate SC.',
    url: absoluteUrl('/calculator/remodeling'),
  },
};

export default function RemodelingCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Home Remodeling Calculator', href: '/calculator/remodeling' },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(
    breadcrumbs.map((b) => ({ name: b.label, url: absoluteUrl(b.href!) }))
  );

  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'Home Remodeling Cost Calculator',
    description:
      'Estimate kitchen, bathroom, flooring, and painting remodeling costs in Simpsonville, Fountain Inn, and Greenville County, SC.',
    url: absoluteUrl('/calculator/remodeling'),
    serviceName: 'Home Remodeling',
    minPrice: 3000,
    maxPrice: 150000,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'Home Remodeling Cost Data',
    description: 'Transparent home remodeling pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/remodeling'),
    serviceName: 'Home Remodeling',
    minPrice: 3000,
    maxPrice: 150000,
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
        title="Home Remodeling Cost Calculator"
        breadcrumbs={breadcrumbs}
        showAuthor={true}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: '35+ years | Kitchen & bathroom remodeling',
        }}
        showCredentials={true}
        credentialsVariant="compact"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={[
          { title: 'Kitchen Remodeling', href: '/kitchen-remodeling', description: 'Full kitchen renovation services' },
          { title: 'Bathroom Remodeling', href: '/bathroom-remodeling', description: 'Bath renovation services' },
          { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
        ]}
        showCTA={false}
        hideTitle={true}
        rawContent={true}
      >
        <RemodelingClientCalculator />
      </UniversalPageTemplate>
    </>
  );
}
