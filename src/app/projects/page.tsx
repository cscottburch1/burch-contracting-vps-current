import type { Metadata } from 'next';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { projectSpotlights } from '@/lib/seo/projectSpotlightsData';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Project Spotlights | Burch Contracting',
  description:
    'Browse project spotlight pages for kitchen remodeling, bathroom renovations, additions, decks, screened porches, and basement finishing across Upstate South Carolina.',
  alternates: { canonical: absoluteUrl('/projects') },
  openGraph: {
    title: 'Project Spotlights | Burch Contracting',
    description: 'Explore project spotlight pages to understand scope, process, timeline ranges, and typical budget bands.',
    url: absoluteUrl('/projects'),
  },
};

const projectsItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Project Spotlights',
  itemListElement: projectSpotlights.map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: absoluteUrl(`/projects/${project.slug}`),
    name: project.title,
  })),
};

export default function ProjectsIndexPage() {
  return (
    <>
      <Script id="projects-item-list-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsItemListSchema) }} />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">Project Spotlights</h1>
            <p className="text-lg text-blue-100 md:text-xl">
              Review representative project scenarios to understand planning decisions, timeline ranges, and investment bands before you request a written estimate.
            </p>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="mx-auto mb-10 max-w-5xl rounded-2xl border border-blue-100 bg-blue-50 p-6 text-blue-900">
          These spotlights are representative planning profiles based on common project types and scope patterns. They are intended for education and budgeting guidance, not as claims about specific customer jobs.
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectSpotlights.map((project) => (
            <Card key={project.slug} className="hover-lift h-full">
              <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">{project.city}</div>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">{project.title}</h2>
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
    </>
  );
}
