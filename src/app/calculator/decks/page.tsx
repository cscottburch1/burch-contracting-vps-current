import type { Metadata } from 'next';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import EEATSignals from '@/components/seo/EEATSignals';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Deck Cost Calculator Simpsonville & Fountain Inn SC | Burch Contracting',
  description:
    'Calculate deck costs with competitive local pricing for pressure-treated, composite, and premium decks. Transparent 22.5% overhead & profit.',
  alternates: { canonical: absoluteUrl('/calculator/decks') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Deck Cost Calculator | Competitive Local Pricing | Burch Contracting',
    description:
      'Get accurate deck estimates for Simpsonville, Fountain Inn, and Greenville County with our transparent pricing calculator.',
    url: absoluteUrl('/calculator/decks'),
  },
};

export default function DecksCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/cost' },
    { label: 'Deck Cost Calculator', href: '/calculator/decks' },
  ];

  return (
    <UniversalPageTemplate
      title="Deck Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'C. Scott Burch',
        role: 'Owner & Lead Carpenter',
        experience: '30+ years | 87 decks built',
      }}
      showCredentials={true}
      credentialsVariant="compact"
      lastUpdated={new Date('2026-04-17')}
      relatedPages={[
        { title: 'Custom Decks', href: '/deck-builder', description: 'Professional deck construction service' },
        { title: 'Screened Porches', href: '/screened-porches', description: 'Convert your deck to screened porch' },
        { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
      ]}
      showCTA={false}
    >
      <EEATSignals variant="compact" />
      
      <CompetitivePricingCalculator
        serviceKey="decks"
        title="Deck Cost Calculator"
        intro="Plan your deck project with competitive local pricing. Choose from pressure-treated, composite, or premium materials and see transparent cost breakdowns with all factors included."
        icon="Trees"
        marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
      />
    </UniversalPageTemplate>
  );
}
