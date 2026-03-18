import type { Metadata } from 'next';
import ProjectCostCalculator from '@/components/calculators/ProjectCostCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Room Addition Cost Calculator Simpsonville & Fountain Inn SC',
  description:
    'Estimate room addition budgets for bonus rooms, bedroom additions, and larger expansion projects in Simpsonville and Fountain Inn, SC.',
  alternates: { canonical: absoluteUrl('/calculator/room-additions') },
  openGraph: {
    title: 'Room Addition Cost Calculator | Burch Contracting',
    description:
      'Plan budget ranges for room additions and expansion projects with local Upstate South Carolina pricing assumptions.',
    url: absoluteUrl('/calculator/room-additions'),
  },
};

export default function RoomAdditionsCalculatorPage() {
  return (
    <ProjectCostCalculator
      title="Room Addition Cost Calculator"
      intro="Estimate square-foot addition costs for bedroom suites, family rooms, home offices, and more before design and permit work begins."
      icon="Construction"
      marketLabel="Simpsonville, Fountain Inn, Greenville County, and Laurens County"
      options={[
        {
          label: 'Small Single-Room Addition',
          unit: 'sq ft',
          defaultQuantity: 220,
          lowRate: 240,
          highRate: 340,
          leadTime: '8 to 12 weeks',
          scope: 'Foundation, framing, roofing tie-in, electrical, insulation, drywall, and standard interior finishes.',
        },
        {
          label: 'Primary Suite Addition',
          unit: 'sq ft',
          defaultQuantity: 380,
          lowRate: 295,
          highRate: 430,
          leadTime: '10 to 16 weeks',
          scope: 'Bedroom plus bathroom addition with HVAC extension, plumbing, tile, and higher finish complexity.',
        },
        {
          label: 'Complex Multi-Room Addition',
          unit: 'sq ft',
          defaultQuantity: 550,
          lowRate: 330,
          highRate: 520,
          leadTime: '14 to 22 weeks',
          scope: 'Larger footprint with structural engineering, utility relocation, and more intensive exterior integration.',
        },
      ]}
    />
  );
}
