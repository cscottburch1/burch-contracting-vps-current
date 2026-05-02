import type { Metadata } from 'next';
import Script from 'next/script';
import ProjectCostCalculator from '@/components/calculators/ProjectCostCalculator';
import { absoluteUrl } from '@/lib/seo/site';
import { buildCalculatorSoftwareApplicationSchema, buildCalculatorDatasetSchema } from '@/lib/seo/schema';

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
  const calculatorSchema = buildCalculatorSoftwareApplicationSchema({
    name: 'Deck and Screened Porch Cost Calculator',
    description: 'Compare deck and screened porch costs for Simpsonville, Fountain Inn, and Greenville County. Estimate pressure-treated, composite decks, and screened porches with transparent pricing.',
    url: absoluteUrl('/calculator/decks-screened-porches'),
    serviceName: 'Deck and Screened Porch Construction',
    minPrice: 12000,
    maxPrice: 60000,
    dateModified: '2026-05-02',
  });

  const datasetSchema = buildCalculatorDatasetSchema({
    name: 'Deck and Screened Porch Cost Calculator',
    description: 'Transparent deck and screened porch construction pricing data for Upstate South Carolina',
    url: absoluteUrl('/calculator/decks-screened-porches'),
    serviceName: 'Deck and Screened Porch Construction',
    minPrice: 12000,
    maxPrice: 60000,
    dateModified: '2026-05-02',
  });

  return (
    <>
      <Script
        id="calculator-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      <Script
        id="calculator-dataset-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <ProjectCostCalculator
      title="Deck and Screened Porch Cost Calculator"
      intro="Compare the cost of building a new deck, converting to low-maintenance composite, or adding a screened porch for more usable outdoor living space."
      icon="Trees"
      marketLabel="Simpsonville, Fountain Inn, Greenville County, and Laurens County"
      disclaimer="Outdoor living project estimates include 20% contractor markup for site supervision and warranty coverage. Final costs depend on ground conditions, required footings depth, deck board material selection (pressure-treated vs composite), railing system complexity, stair configuration, permit requirements, and existing structure attachments. Site-specific factors like slope and access affect labor hours significantly."
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
    </>
  );
}
