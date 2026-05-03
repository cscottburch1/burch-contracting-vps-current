'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { getResponsiveProjectImageSet, isBrandedProjectImage, projectSpotlights } from '@/lib/seo/projectSpotlightsData';

interface ProjectImageProps {
  project: typeof projectSpotlights[0];
}

function ProjectImage({ project }: ProjectImageProps) {
  const [imgError, setImgError] = useState(false);
  const responsiveImage = getResponsiveProjectImageSet(project.image);
  const fallbackImage = '/images/projects/placeholder.webp';

  // Use fallback if image failed to load
  const imageSrc = imgError ? fallbackImage : (responsiveImage ? responsiveImage.mobile : project.image);

  if (isBrandedProjectImage(project.image) || imgError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-4">
        <Image
          src={imageSrc}
          alt={project.imageAlt}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
          width={600}
          height={336}
          onError={() => setImgError(true)}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMzNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
        />
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={project.imageAlt}
      title={project.imageAlt}
      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      width={600}
      height={336}
      onError={() => setImgError(true)}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMzNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
    />
  );
}

/**
 * Server-rendered recent projects section.
 * Uses static projectSpotlights data so the HTML is fully crawlable
 * without waiting for any client-side fetch.
 */
export default function RecentProjectsSSR() {
  const featured = projectSpotlights.filter((p) => p.representative).slice(0, 6);

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
          {featured.map((project) => (
            <article
              key={project.slug}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                <ProjectImage project={project} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
                    {project.serviceType}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {project.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.summary}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">📍</span>
                    {project.city}
                  </span>
                  <span className="text-gray-600">{project.timeline}</span>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                >
                  View Project Details
                  <span aria-hidden="true" className="ml-1">→</span>
                </Link>
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
