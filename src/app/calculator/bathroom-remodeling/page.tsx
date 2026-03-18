import type { Metadata } from 'next';
import ProjectCostCalculator from '@/components/calculators/ProjectCostCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Bathroom Remodel Cost Calculator Simpsonville & Fountain Inn SC',
  description:
    'Estimate bathroom renovation budgets for Simpsonville and Fountain Inn properties with local labor, material, and markup assumptions built in.',
  alternates: { canonical: absoluteUrl('/calculator/bathroom-remodeling') },
  openGraph: {
    title: 'Bathroom Remodel Cost Calculator | Burch Contracting',
    description:
      'Compare cosmetic, standard, and premium bathroom remodeling budgets for homes in Simpsonville and Fountain Inn, SC.',
    url: absoluteUrl('/calculator/bathroom-remodeling'),
  },
};

export default function BathroomRemodelingCalculatorPage() {
  return (
    <ProjectCostCalculator
      title="Bathroom Remodeling Cost Calculator"
      intro="Estimate the cost of updating a guest bath, primary bathroom, or walk-in shower conversion using local Upstate South Carolina pricing ranges."
      icon="Bath"
      marketLabel="Simpsonville, Fountain Inn, Greenville County, and Laurens County"
      options={[
        {
          label: 'Cosmetic Bathroom Refresh',
          unit: 'project',
          defaultQuantity: 1,
          lowRate: 9000,
          highRate: 16000,
          leadTime: '2 to 3 weeks',
          scope: 'Paint, vanity, plumbing fixture, lighting, mirror, and flooring updates without major plumbing relocation.',
        },
        {
          label: 'Standard Full Bathroom Remodel',
          unit: 'project',
          defaultQuantity: 1,
          lowRate: 17000,
          highRate: 32000,
          leadTime: '3 to 5 weeks',
          scope: 'New shower or tub, tile package, vanity, fixtures, and ventilation upgrades.',
        },
        {
          label: 'Luxury Primary Bath',
          unit: 'project',
          defaultQuantity: 1,
          lowRate: 33000,
          highRate: 65000,
          leadTime: '5 to 8 weeks',
          scope: 'Custom tile shower, frameless glass, premium cabinetry, layout changes, and high-end finish selections.',
        },
      ]}
    />
  );
}
