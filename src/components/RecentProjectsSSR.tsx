import Link from 'next/link';
import { query } from '@/lib/mysql';
import { ProjectCardImage } from './ProjectCardImage';

interface DbProject {
  id: number;
  title: string;
  category: string;
  short_description: string | null;
  image_url: string | null;
  completion_date: string | null;
  project_duration: string | null;
  location: string | null;
  featured: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  'garages': 'Garage Construction',
  'decks': 'Deck Building',
  'screened-porches': 'Screened Porch',
  'room-additions': 'Room Addition',
  // legacy values — safe to keep during transition
  'handyman': 'Handyman',
  'remodeling': 'Remodeling',
  'additions': 'Additions',
};

async function getProjects(): Promise<DbProject[]> {
  try {
    return await query<DbProject>(
      `SELECT id, title, category, short_description, image_url,
              completion_date, project_duration, location, featured
       FROM recent_projects
       WHERE is_active = TRUE
       ORDER BY display_order ASC, completion_date DESC
       LIMIT 6`
    );
  } catch {
    return [];
  }
}

/**
 * Server-rendered recent projects section.
 * Reads from the recent_projects DB table managed via admin/tools/projects.
 * Returns null (section hidden) when no active projects exist yet.
 */
export default async function RecentProjectsSSR() {
  const projects = await getProjects();

  if (projects.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Projects</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Recent deck, garage, screened porch, and home addition projects across Upstate SC
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                {project.image_url ? (
                  <ProjectCardImage
                    src={project.image_url}
                    alt={`${project.title} — Burch Contracting`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No photo
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
                    {CATEGORY_LABELS[project.category] ?? project.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {project.title}
                </h3>

                {project.short_description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.short_description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  {project.location && (
                    <span className="flex items-center gap-1">
                      <span aria-hidden="true">📍</span>
                      {project.location}
                    </span>
                  )}
                  {project.project_duration && (
                    <span className="text-gray-600">{project.project_duration}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-gray-600">
            Browse full project spotlights or request a free estimate for your next project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              View All Projects
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
            >
              Request Free Estimate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
