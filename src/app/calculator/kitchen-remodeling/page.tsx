import type { Metadata } from 'next';
import UniversalPageTemplate from '@/components/templates/UniversalPageTemplate';
import ProjectCostCalculator from '@/components/calculators/ProjectCostCalculator';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Kitchen Remodel Cost Calculator Simpsonville & Fountain Inn SC',
  description:
    'Estimate kitchen remodeling budgets for Simpsonville and Fountain Inn homes using installed local market pricing, contractor markup, and finish-level ranges.',
  alternates: { canonical: absoluteUrl('/calculator/kitchen-remodeling') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Kitchen Remodel Cost Calculator | Burch Contracting',
    description:
      'Plan cabinet, countertop, and full kitchen renovation budgets for Simpsonville and Fountain Inn, SC.',
    url: absoluteUrl('/calculator/kitchen-remodeling'),
  },
};

export default function KitchenRemodelingCalculatorPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/cost' },
    { label: 'Kitchen Remodeling Calculator', href: '/calculator/kitchen-remodeling' },
  ];

  return (
    <UniversalPageTemplate
      title="Kitchen Remodeling Cost Calculator - Simpsonville & Upstate SC"
      breadcrumbs={breadcrumbs}
      showAuthor={true}
      author={{
        name: 'C. Scott Burch',
        role: 'Owner & Lead Contractor',
        experience: '30+ years | 47 kitchens remodeled',
      }}
      showCredentials={true}
      credentialsVariant="compact"
      lastUpdated={new Date('2026-04-17')}
      relatedPages={[
        { title: 'Kitchen Remodeling', href: '/kitchen-remodeling', description: 'Professional kitchen renovation' },
        { title: 'Bathroom Remodeling', href: '/bathroom-remodeling', description: 'Update your bathroom' },
        { title: 'Free Estimate', href: '/contact', description: 'Get a detailed quote' },
      ]}
      showCTA={false}
    >
      <ProjectCostCalculator
        title="Kitchen Remodeling Cost Calculator"
        intro="Build a realistic kitchen remodel budget for Simpsonville and Fountain Inn homes before you request bids. Compare refresh, full remodel, and custom kitchen investment ranges."
        icon="ChefHat"
        marketLabel="Simpsonville, Fountain Inn, Greenville County, and Laurens County"
        disclaimer="Kitchen remodeling costs include 20% contractor markup covering project management, insurance, and warranty. Final pricing varies based on cabinet selections, countertop materials (granite vs quartz), plumbing fixture upgrades, electrical panel capacity for new appliances, structural modifications for open-concept layouts, and finish-level choices. Schedule a site visit for exact pricing."
        options={[
          {
            label: 'Kitchen Refresh',
            unit: 'project',
            defaultQuantity: 1,
            lowRate: 22000,
            highRate: 38000,
            leadTime: '3 to 5 weeks',
            scope: 'Cabinet refinishing or selective replacement, new counters, backsplash, paint, and fixture upgrades.',
          },
          {
            label: 'Full Kitchen Remodel',
            unit: 'project',
            defaultQuantity: 1,
            lowRate: 42000,
            highRate: 76000,
            leadTime: '6 to 10 weeks',
            scope: 'New cabinetry, countertops, appliances, flooring, lighting, and improved layout flow within existing footprint.',
          },
          {
            label: 'Custom Design-Build Kitchen',
            unit: 'project',
            defaultQuantity: 1,
            lowRate: 78000,
            highRate: 145000,
            leadTime: '10 to 16 weeks',
            scope: 'Structural work, custom cabinets, premium appliances, specialty lighting, and detailed trim or storage features.',
          },
        ]}
      />
    </UniversalPageTemplate>
  );
}
