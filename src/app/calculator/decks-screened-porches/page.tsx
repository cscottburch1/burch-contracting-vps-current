import type { Metadata } from 'next';
import ProjectCostCalculator from '@/components/calculators/ProjectCostCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Deck and Screened Porch Cost Calculator Simpsonville & Fountain Inn SC',
  description:
    'Estimate deck and screened porch costs with local installed pricing for pressure-treated, composite, and covered outdoor living projects.',
  alternates: { canonical: absoluteUrl('/calculator/decks-screened-porches') },
  openGraph: {
    title: 'Deck and Screened Porch Cost Calculator | Burch Contracting',
    description:
      'Compare outdoor living project budgets for decks, porches, and covered spaces in Simpsonville and Fountain Inn, SC.',
    url: absoluteUrl('/calculator/decks-screened-porches'),
  },
};

export default function DecksAndPorchesCalculatorPage() {
  return (
    <ProjectCostCalculator
      title="Deck and Screened Porch Cost Calculator"
      intro="Compare the cost of building a new deck, converting to low-maintenance composite, or adding a screened porch for more usable outdoor living space."
      icon="Trees"
      marketLabel="Simpsonville, Fountain Inn, Greenville County, and Laurens County"
      options={[
        {
          label: 'Pressure-Treated Deck',
          unit: 'sq ft',
          defaultQuantity: 240,
          lowRate: 58,
          highRate: 88,
          leadTime: '2 to 4 weeks',
          scope: 'Straightforward deck with standard railing, stairs, and permit-ready framing.',
        },
        {
          label: 'Composite Family Deck',
          unit: 'sq ft',
          defaultQuantity: 280,
          lowRate: 92,
          highRate: 148,
          leadTime: '3 to 5 weeks',
          scope: 'Low-maintenance composite boards, upgraded railing package, and stronger long-term durability.',
        },
        {
          label: 'Screened Porch Outdoor Room',
          unit: 'sq ft',
          defaultQuantity: 220,
          lowRate: 125,
          highRate: 240,
          leadTime: '4 to 8 weeks',
          scope: 'Roof structure, screening system, finished ceiling, fan and lighting rough-ins, and trim package.',
        },
      ]}
    />
  );
}
