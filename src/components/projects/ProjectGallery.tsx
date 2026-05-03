'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

export interface ProjectGalleryItem {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  service: string;
  imagePath: string;
  altText: string;
  year?: number;
}

interface ProjectGalleryProps {
  projects: ProjectGalleryItem[];
  title?: string;
  subtitle?: string;
}

function ProjectGalleryImage({ project }: { project: ProjectGalleryItem }) {
  const [imgError, setImgError] = useState(false);
  const fallbackImage = '/images/projects/placeholder.webp';

  return (
    <Image
      src={imgError ? fallbackImage : project.imagePath}
      alt={project.altText}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      onError={() => setImgError(true)}
    />
  );
}

export default function ProjectGallery({ 
  projects, 
  title = "Recent Projects Near You",
  subtitle = "See how we've helped homeowners throughout Upstate SC create beautiful, functional spaces."
}: ProjectGalleryProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-lg text-gray-600">{subtitle}</p>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="group overflow-hidden border border-gray-200 p-0 transition-shadow hover:shadow-xl">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <ProjectGalleryImage project={project} />
              
              {/* City Badge */}
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-md backdrop-blur-sm">
                <Icon name="MapPin" size={14} className="text-blue-600" />
                <span>{project.city}, {project.state}</span>
              </div>

              {/* Year Badge (if available) */}
              {project.year && (
                <div className="absolute right-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                  {project.year}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="mb-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {project.service}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">{project.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{project.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* View More Projects CTA */}
      <div className="flex justify-center">
        <a
          href="/projects"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-600 bg-white px-6 py-3 font-semibold text-blue-700 transition-all hover:bg-blue-600 hover:text-white"
        >
          <span>View All Our Projects</span>
          <Icon name="ArrowRight" size={18} />
        </a>
      </div>
    </div>
  );
}
