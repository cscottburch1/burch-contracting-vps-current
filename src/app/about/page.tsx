import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'About Burch Contracting | Upstate SC Contractor',
  description:
    'Learn about Burch Contracting, an Upstate SC contractor serving Simpsonville, Fountain Inn, and nearby homeowners.',
  alternates: {
    canonical: absoluteUrl('/about'),
  },
};

const trustPoints = [
  '30+ years serving Upstate South Carolina homeowners',
  'Licensed and insured residential remodeling team',
  'Clear communication from estimate through final walkthrough',
  'Focused on kitchens, bathrooms, additions, decks, porches, basements, and handyman work',
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">About Burch Contracting</h1>
            <p className="text-lg text-blue-100 md:text-xl">
              We help homeowners in Simpsonville, Fountain Inn, Greenville County, and Laurens County plan and build high-value remodeling projects with clear scope and dependable craftsmanship.
            </p>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">What Homeowners Can Expect</h2>
            <p className="mb-5 leading-relaxed text-gray-700">
              Every project starts with practical planning. We focus on realistic budgets, transparent timelines, and scope decisions that match your goals, so you can move forward with confidence.
            </p>
            <div className="space-y-3">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-lg bg-blue-50 p-3 text-gray-700">
                  <Icon name="BadgeCheck" size={18} className="mt-0.5 text-blue-700" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Start With a Free Estimate</h2>
            <p className="mb-5 text-gray-700">
              If you are planning a kitchen remodel, bathroom renovation, room addition, deck, screened porch, basement finish, or handyman project, we are ready to help.
            </p>
            <div className="space-y-3">
              <Button variant="primary" href="/contact" fullWidth>
                <Icon name="ClipboardEdit" size={18} />
                Request Free Estimate
              </Button>
              <Button variant="outline" href="tel:(864) 724-4600" fullWidth>
                <Icon name="Phone" size={18} />
                Call (864) 724-4600
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
