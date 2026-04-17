import type { Metadata } from 'next';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import EEATSignals from '@/components/seo/EEATSignals';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';

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
    { label: 'Calculators', href: '/cost' },
    { label: 'Screened Porch Calculator', href: '/calculator/screened-porches' },
  ];

  return (
    <UniversalPageTemplate
      title="Screened Porch Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'Robert Burch',
        role: 'Owner & Lead Contractor',
        experience: '30+ years | 200+ screened porches',
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
    >
      <EEATSignals variant="compact" />
      
      <CompetitivePricingCalculator
        serviceKey="screenedPorches"
        title="Screened Porch Cost Calculator"
        intro="Plan your screened porch or outdoor room with competitive local pricing. From basic screen enclosures to complete outdoor living spaces with premium finishes."
        icon="Home"
        marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
      />
    </UniversalPageTemplate>
  );
}
