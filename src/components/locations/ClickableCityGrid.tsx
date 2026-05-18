'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';

interface CityData {
  name: string;
  slug: string;
  displayName: string;
  county: string;
  population: string;
  description: string;
  distance: string;
  colorClass: string;
}

const cities: CityData[] = [
  {
    name: 'Simpsonville',
    slug: 'simpsonville',
    displayName: 'Simpsonville, SC',
    county: 'Greenville County',
    population: '24,000+',
    description: 'Our Home Base',
    distance: '15 min',
    colorClass: 'from-blue-50 to-blue-100 border-blue-600 group-hover:border-blue-600'
  },
  {
    name: 'Fountain Inn',
    slug: 'fountain-inn',
    displayName: 'Fountain Inn, SC',
    county: 'Greenville County',
    population: '10,000+',
    description: 'Historic Downtown',
    distance: '10 min',
    colorClass: 'from-green-50 to-green-100 border-green-600 group-hover:border-green-600'
  },
  {
    name: 'Mauldin',
    slug: 'mauldin',
    displayName: 'Mauldin, SC',
    county: 'Greenville County',
    population: '25,000+',
    description: 'Established Community',
    distance: '20 min',
    colorClass: 'from-cyan-50 to-cyan-100 border-cyan-600 group-hover:border-cyan-600'
  },
  {
    name: 'Greenville',
    slug: 'greenville',
    displayName: 'Greenville, SC',
    county: 'Greenville County',
    population: '70,000+',
    description: 'Upstate Hub',
    distance: '25 min',
    colorClass: 'from-purple-50 to-purple-100 border-purple-600 group-hover:border-purple-600'
  },
  {
    name: 'Greer',
    slug: 'greer',
    displayName: 'Greer, SC',
    county: 'Greenville County',
    population: '35,000+',
    description: 'Growing City',
    distance: '30 min',
    colorClass: 'from-orange-50 to-orange-100 border-orange-600 group-hover:border-orange-600'
  },
  {
    name: 'Five Forks',
    slug: 'five-forks',
    displayName: 'Five Forks, SC',
    county: 'Greenville County',
    population: '18,000+',
    description: 'Family Friendly',
    distance: '18 min',
    colorClass: 'from-sky-50 to-sky-100 border-sky-600 group-hover:border-sky-600'
  },
  {
    name: 'Woodruff',
    slug: 'woodruff',
    displayName: 'Woodruff, SC',
    county: 'Spartanburg County',
    population: '4,000+',
    description: 'Historic Charm',
    distance: '20 min',
    colorClass: 'from-amber-50 to-amber-100 border-amber-600 group-hover:border-amber-600'
  },
  {
    name: 'Laurens',
    slug: 'laurens',
    displayName: 'Laurens, SC',
    county: 'Laurens County',
    population: '9,000+',
    description: 'County Seat',
    distance: '25 min',
    colorClass: 'from-red-50 to-red-100 border-red-600 group-hover:border-red-600'
  },
  {
    name: 'Gray Court',
    slug: 'gray-court',
    displayName: 'Gray Court, SC',
    county: 'Laurens County',
    population: '2,000+',
    description: 'Our Office Location',
    distance: '0 min',
    colorClass: 'from-teal-50 to-teal-100 border-teal-600 group-hover:border-teal-600'
  }
];

interface ClickableCityGridProps {
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;
  showDistance?: boolean;
  showPopulation?: boolean;
  compact?: boolean;
}

export const ClickableCityGrid: React.FC<ClickableCityGridProps> = ({
  title = 'Proudly Serving Upstate South Carolina',
  description = 'Click on your city to see local services, projects, and pricing',
  columns = 3,
  showDistance = true,
  showPopulation = false,
  compact = false
}) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }[columns];

  return (
    <div className="w-full">
      {!compact && (
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      )}

      <div className={`grid ${gridClass} gap-4 md:gap-6`}>
        {cities.map((city) => (
          <Link 
            key={city.slug}
            href={`/service-areas/${city.slug}`}
            className="group block"
            aria-label={`View ${city.displayName} services and projects`}
          >
            <Card className={`h-full bg-linear-to-br ${city.colorClass} border-2 border-transparent transition-all duration-200 hover:shadow-xl hover:-translate-y-1`}>
              <div className="flex flex-col items-center text-center p-4">
                {/* Map Pin Icon */}
                <div className="mb-3">
                  <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon 
                      name="MapPin" 
                      size={24} 
                      className="text-gray-700" 
                    />
                  </div>
                </div>

                {/* City Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {city.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-2">
                  {city.description}
                </p>

                {/* County */}
                <p className="text-xs text-gray-500 mb-2">
                  {city.county}
                </p>

                {/* Optional Info */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 mt-2">
                  {showPopulation && (
                    <div className="flex items-center gap-1">
                      <Icon name="Users" size={14} />
                      <span>{city.population}</span>
                    </div>
                  )}
                  {showDistance && (
                    <div className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      <span>{city.distance} from office</span>
                    </div>
                  )}
                </div>

                {/* CTA Arrow */}
                <div className="mt-3 flex items-center text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                  View Services
                  <Icon 
                    name="ArrowRight" 
                    size={16} 
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Service Area Statement */}
      {!compact && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Serving the greater Greenville-Spartanburg area and surrounding Upstate SC communities since 1995
          </p>
          <p className="text-xs text-gray-500 mt-2">
            All services available in Greenville County, Laurens County, and Spartanburg County
          </p>
        </div>
      )}
    </div>
  );
};

export default ClickableCityGrid;
