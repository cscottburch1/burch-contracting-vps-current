import type { Metadata } from 'next';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Deck Cost Calculator Simpsonville & Fountain Inn SC | Burch Contracting',
  description:
    'Calculate deck costs with competitive local pricing for pressure-treated, composite, and premium decks. Transparent 22.5% overhead & profit.',
  alternates: { canonical: absoluteUrl('/calculator/decks') },
  openGraph: {
    title: 'Deck Cost Calculator | Competitive Local Pricing | Burch Contracting',
    description:
      'Get accurate deck estimates for Simpsonville, Fountain Inn, and Greenville County with our transparent pricing calculator.',
    url: absoluteUrl('/calculator/decks'),
  },
};

export default function DecksCalculatorPage() {
  return (
    <CompetitivePricingCalculator
      serviceKey="decks"
      title="Deck Cost Calculator"
      intro="Plan your deck project with competitive local pricing. Choose from pressure-treated, composite, or premium materials and see transparent cost breakdowns with all factors included."
      icon="Trees"
      marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
    />
  );
}
