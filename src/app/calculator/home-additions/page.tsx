import type { Metadata } from 'next';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import EEATSignals from '@/components/seo/EEATSignals';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';

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
    { label: 'Calculators', href: '/cost' },
    { label: 'Home Addition Calculator', href: '/calculator/home-additions' },
  ];

  return (
    <UniversalPageTemplate
      title="Home Addition Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'Robert Burch',
        role: 'Owner & Lead Contractor',
        experience: '30+ years | 93 additions built',
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
    >
      <EEATSignals variant="compact" />
      
      <CompetitivePricingCalculator
        serviceKey="homeAdditions"
        title="Home Addition Cost Calculator"
        intro="Plan your home addition project with competitive local pricing. From simple room additions to luxury master suites with transparent cost breakdowns for all factors."
        icon="Construction"
        marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
      />
    </UniversalPageTemplate>
  );
}
