import type { Metadata } from 'next';
import Script from 'next/script';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import HandymanClientCalculator from './_ClientCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Handyman Services Cost Calculator | Simpsonville & Fountain Inn SC',
  description:
    'Estimate handyman service costs — plumbing, electrical, carpentry, painting, and more — with local installed pricing for Simpsonville, Fountain Inn, and Greenville County, SC.',
  alternates: { canonical: absoluteUrl('/calculator/handyman') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Handyman Services Cost Calculator | Burch Contracting',
    description:
      'Get instant estimates for common handyman tasks with transparent local pricing for Simpsonville and Upstate SC.',
    url: absoluteUrl('/calculator/handyman'),
  },
};

export default function HandymanCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Handyman Services Calculator', href: '/calculator/handyman' },
  ];

  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'Handyman Services Cost Calculator',
    description:
      'Estimate plumbing, electrical, carpentry, and painting handyman service costs in Simpsonville, Fountain Inn, and Greenville County, SC.',
    url: absoluteUrl('/calculator/handyman'),
    serviceName: 'Handyman Services',
    minPrice: 125,
    maxPrice: 4400,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'Handyman Services Cost Data',
    description: 'Transparent handyman service pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/handyman'),
    serviceName: 'Handyman Services',
    minPrice: 125,
    maxPrice: 4400,
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
        title="Handyman Services Cost Calculator"
        breadcrumbs={breadcrumbs}
        showAuthor={true}
        author={{
          name: 'C. Scott Burch',
          role: 'Owner & Lead Contractor',
          experience: '35+ years | Handyman & home repair specialist',
        }}
        showCredentials={true}
        credentialsVariant="compact"
        lastUpdated={new Date('2026-04-17')}
        relatedPages={[
          { title: 'Handyman Services', href: '/handyman', description: 'Full handyman service offerings' },
          { title: 'Home Remodeling', href: '/remodeling', description: 'Larger renovation projects' },
          { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
        ]}
        showCTA={false}
        hideTitle={true}
        rawContent={true}
      >
        <HandymanClientCalculator />
      </UniversalPageTemplate>
    </>
  );
}
