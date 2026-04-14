import type { Metadata } from 'next';
import CompetitivePricingCalculator from '@/components/calculators/CompetitivePricingCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Home Addition Cost Calculator Simpsonville & Fountain Inn SC | Burch Contracting',
  description:
    'Calculate home addition costs with competitive local pricing. From basic additions to luxury master suites. Transparent 22.5% overhead & profit.',
  alternates: { canonical: absoluteUrl('/calculator/home-additions') },
  openGraph: {
    title: 'Home Addition Cost Calculator | Competitive Local Pricing | Burch Contracting',
    description:
      'Get accurate home addition estimates for Simpsonville, Fountain Inn, and Greenville County with our transparent pricing calculator.',
    url: absoluteUrl('/calculator/home-additions'),
  },
};

export default function HomeAdditionsCalculatorPage() {
  return (
    <CompetitivePricingCalculator
      serviceKey="homeAdditions"
      title="Home Addition Cost Calculator"
      intro="Plan your home addition project with competitive local pricing. From simple room additions to luxury master suites with transparent cost breakdowns for all factors."
      icon="Construction"
      marketArea="Simpsonville, Fountain Inn, Gray Court & Greenville County"
    />
  );
}
