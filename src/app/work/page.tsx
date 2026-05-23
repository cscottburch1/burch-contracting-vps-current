import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { projectSpotlights } from '@/lib/seo/projectSpotlightsData';
import { absoluteUrl } from '@/lib/seo/site';
import RecentProjectsSSR from '@/components/RecentProjectsSSR';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Recent Work & Project Gallery | Burch Contracting',
  description:
    'View real project photos from garages, additions, decks, and screened porches built across Upstate South Carolina.',
  alternates: { canonical: absoluteUrl('/projects') },
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Recent Work | Burch Contracting',
    description: 'Browse real projects: garages, additions, decks, and screened porches.',
    url: absoluteUrl('/projects'),
  },
};

export default function WorkPage() {
  const coreServiceTypes = ['Deck Builder', 'Screened Porch Builder', 'Garage Builder', 'Room Additions'];
  const coreProjects = projectSpotlights.filter(project => 
    coreServiceTypes.includes(project.serviceType)
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Our Work', url: absoluteUrl('/projects') },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">Our Work</h1>
            <p className="text-lg text-blue-100 md:text-xl">
              Real projects built across Upstate South Carolina. See what we've built for homeowners in Simpsonville, Mauldin, Fountain Inn, and Woodruff.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Projects Gallery */}
      <Section background="white" padding="lg">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">Recent Projects</h2>
          <p className="text-lg text-gray-600">
            Browse completed garages, additions, decks, and screened porches with photos, locations, and what was built.
          </p>
        </div>
        <RecentProjectsSSR />
      </Section>

      {/* Project Spotlights */}
      <Section background="gray" padding="lg">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">Project Spotlights</h2>
          <p className="text-lg text-gray-600">
            Representative project scenarios showing typical scope, timeline, and investment ranges.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreProjects.map((project) => (
            <Card key={project.slug} className="hover-lift h-full">
              <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">{project.city}</div>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">{project.title}</h3>
              <p className="mt-3 text-gray-600">{project.summary}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Icon name="Clock" size={16} />
                {project.timeline}
              </div>
              <div className="mt-2 text-sm font-semibold text-gray-700">{project.budgetBand}</div>
              <div className="mt-5">
                <Button href={`/projects/${project.slug}`}>Read Spotlight</Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="blue" padding="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to Start Your Project?</h2>
          <p className="text-white text-lg mb-8">
            Get a free, no-obligation estimate for your garage, addition, deck, or screened porch.
          </p>
          <Button variant="ctaLight" size="lg" href="/contact">
            Get Free Estimate
          </Button>
        </div>
      </Section>
    </>
  );
}
