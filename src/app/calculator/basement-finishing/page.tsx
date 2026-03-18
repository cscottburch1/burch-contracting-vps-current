import type { Metadata } from 'next';
import ProjectCostCalculator from '@/components/calculators/ProjectCostCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Basement Finishing Cost Calculator Simpsonville & Fountain Inn SC',
  description:
    'Estimate basement finishing budgets for rec rooms, home offices, guest suites, and premium basement projects in the Upstate South Carolina market.',
  alternates: { canonical: absoluteUrl('/calculator/basement-finishing') },
  openGraph: {
    title: 'Basement Finishing Cost Calculator | Burch Contracting',
    description:
      'Budget basement remodeling investments for homes in Simpsonville and Fountain Inn, SC with local installed pricing ranges.',
    url: absoluteUrl('/calculator/basement-finishing'),
  },
};

export default function BasementFinishingCalculatorPage() {
  return (
    <ProjectCostCalculator
      title="Basement Finishing Cost Calculator"
      intro="Estimate the cost of converting unfinished square footage into a comfortable family room, office, guest suite, or premium entertainment level."
      icon="Sofa"
      marketLabel="Simpsonville, Fountain Inn, Greenville County, and Laurens County"
      options={[
        {
          label: 'Basic Basement Finish',
          unit: 'sq ft',
          defaultQuantity: 700,
          lowRate: 42,
          highRate: 60,
          leadTime: '5 to 8 weeks',
          scope: 'Framing, insulation, drywall, flooring, trim, standard electrical, and code-compliant finishes.',
        },
        {
          label: 'Lifestyle Upgrade Basement',
          unit: 'sq ft',
          defaultQuantity: 850,
          lowRate: 61,
          highRate: 88,
          leadTime: '6 to 10 weeks',
          scope: 'Adds custom storage, upgraded lighting, feature walls, or flexible rec room / office planning.',
        },
        {
          label: 'Premium Basement Suite',
          unit: 'sq ft',
          defaultQuantity: 1000,
          lowRate: 89,
          highRate: 132,
          leadTime: '8 to 14 weeks',
          scope: 'Home theater, wet bar, bath addition, guest suite elements, and higher-end finish package.',
        },
      ]}
    />
  );
}
