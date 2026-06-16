import type { Metadata } from 'next';
import Script from 'next/script';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema, buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Home Addition Cost Calculator Simpsonville & Fountain Inn SC | Burch Contracting',
  description:
    'Calculate home addition costs with competitive local pricing. From basic additions to luxury master suites. Transparent 22.5% overhead & profit.',
  alternates: { canonical: absoluteUrl('/calculator/home-additions') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Home Addition Cost Calculator | Competitive Local Pricing | Burch Contracting',
    description:
      'Get accurate home addition estimates for Simpsonville, Fountain Inn, and Greenville County with our transparent pricing calculator.',
    url: absoluteUrl('/calculator/home-additions'),
  },
};

export default function HomeAdditionsCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Home Addition Calculator', href: '/calculator/home-additions' },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(
    breadcrumbs.map((b) => ({ name: b.label, url: absoluteUrl(b.href!) }))
  );

  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'Home Addition Cost Calculator',
    description: 'Calculate home addition costs for Simpsonville, Fountain Inn, and Greenville County. Estimate master suites, sunrooms, and multi-story additions with transparent pricing.',
    url: absoluteUrl('/calculator/home-additions'),
    serviceName: 'Home Additions',
    minPrice: 45000,
    maxPrice: 180000,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'Home Addition Cost Calculator',
    description: 'Transparent home addition construction pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/home-additions'),
    serviceName: 'Home Additions',
    minPrice: 45000,
    maxPrice: 180000,
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
      title="Home Addition Cost Calculator - Simpsonville & Upstate SC"
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
        { title: 'ADU Builder', href: '/adu-builder', description: 'Detached living spaces' },
        { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
      ]}
      showCTA={false}
      hideTitle={true}
      rawContent={true}
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
