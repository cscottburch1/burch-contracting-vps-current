import type { Metadata } from 'next';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Screened Porch Cost Calculator Simpsonville & Fountain Inn SC | Burch Contracting',
  description:
    'Calculate screened porch costs with competitive local pricing. From screen enclosures to complete outdoor rooms. Transparent 22.5% overhead & profit.',
  alternates: { canonical: absoluteUrl('/calculator/screened-porches') },
  openGraph: {
    title: 'Screened Porch Cost Calculator | Competitive Local Pricing | Burch Contracting',
    description:
      'Get accurate screened porch estimates for Simpsonville, Fountain Inn, and Greenville County with our transparent pricing calculator.',
    url: absoluteUrl('/calculator/screened-porches'),
  },
};

export default function ScreenedPorchesCalculatorPage() {
  return (
    <CompetitivePricingCalculator
      serviceKey="screenedPorches"
      title="Screened Porch Cost Calculator"
      intro="Plan your screened porch or outdoor room with competitive local pricing. From basic screen enclosures to complete outdoor living spaces with premium finishes."
      icon="Home"
      marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
    />
  );
}
