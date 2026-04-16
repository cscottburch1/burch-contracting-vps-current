'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

export interface CityData {
  name: string;
  slug: string;
  county: string;
  population?: string;
  distance?: string; // Distance from Gray Court
  featured?: boolean;
}

interface CitiesGridProps {
  title?: string;
  subtitle?: string;
  serviceSlug?: string; // Optional: link to service-specific city pages
  columns?: 2 | 3 | 4 | 5;
}

export default function CitiesGrid({ 
  title = "Proudly Serving Upstate South Carolina",
  subtitle = "We serve homeowners throughout the Upstate with quality craftsmanship and reliable service.",
  serviceSlug,
  columns = 4
}: CitiesGridProps) {
  const cities: CityData[] = [
    {
      name: 'Simpsonville',
      slug: 'simpsonville',
      county: 'Greenville County',
      population: '25,000+',
      distance: '8 miles',
      featured: true
    },
    {
      name: 'Fountain Inn',
      slug: 'fountain-inn',
      county: 'Greenville County',
      population: '10,000+',
      distance: '6 miles',
      featured: true
    },
    {
      name: 'Gray Court',
      slug: 'gray-court',
      county: 'Laurens County',
      population: '1,000+',
      distance: 'Home Base',
      featured: true
    },
    {
      name: 'Greenville',
      slug: 'greenville',
      county: 'Greenville County',
      population: '70,000+',
      distance: '20 miles',
      featured: true
    },
    {
      name: 'Mauldin',
      slug: 'mauldin',
      county: 'Greenville County',
      population: '25,000+',
      distance: '12 miles',
      featured: false
    },
    {
      name: 'Laurens',
      slug: 'laurens',
      county: 'Laurens County',
      population: '9,000+',
      distance: '10 miles',
      featured: false
    },
    {
      name: 'Woodruff',
      slug: 'woodruff',
      county: 'Spartanburg County',
      population: '4,000+',
      distance: '15 miles',
      featured: false
    },
    {
      name: 'Five Forks',
      slug: 'five-forks',
      county: 'Greenville County',
      population: '18,000+',
      distance: '10 miles',
      featured: false
    },
    {
      name: 'Greer',
      slug: 'greer',
      county: 'Greenville County',
      population: '35,000+',
      distance: '18 miles',
      featured: false
    },
    {
      name: 'Travelers Rest',
      slug: 'travelers-rest',
      county: 'Greenville County',
      population: '7,000+',
      distance: '25 miles',
      featured: false
    },
    {
      name: 'Duncan',
      slug: 'duncan',
      county: 'Spartanburg County',
      population: '3,500+',
      distance: '12 miles',
      featured: false
    },
    {
      name: 'Taylors',
      slug: 'taylors',
      county: 'Greenville County',
      population: '22,000+',
      distance: '16 miles',
      featured: false
    }
  ];

  const gridColsClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
    5: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
  }[columns];

  const buildCityLink = (citySlug: string) => {
    if (serviceSlug) {
      return `/${serviceSlug}/${citySlug}`;
    }
    return `/locations/${citySlug}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-3xl text-center mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-lg text-gray-600">{subtitle}</p>
        )}
      </div>

      {/* Cities Grid */}
      <div className={`grid gap-4 ${gridColsClass}`}>
        {cities.map((city) => (
          <Link 
            key={city.slug} 
            href={buildCityLink(city.slug)}
            className="group"
          >
            <Card className={`
              h-full p-5 transition-all duration-200 
              hover:shadow-xl hover:scale-105 hover:border-blue-500
              ${city.featured ? 'border-2 border-blue-200 bg-blue-50/30' : 'border border-gray-200'}
            `}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon 
                      name="MapPin" 
                      size={20} 
                      className={city.featured ? 'text-blue-600' : 'text-gray-600'}
                    />
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700">
                      {city.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{city.county}</p>
                  
                  {city.population && (
                    <p className="text-xs text-gray-500">Pop: {city.population}</p>
                  )}
                  
                  {city.distance && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                      <Icon name="Navigation" size={12} />
                      <span>{city.distance}</span>
                    </div>
                  )}
                </div>
                
                <Icon 
                  name="ArrowRight" 
                  size={18} 
                  className="text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-blue-600" 
                />
              </div>

              {city.featured && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                    Primary Service Area
                  </span>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {/* Service Areas Note */}
      <div className="mt-8 rounded-lg bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-700">
          <Icon name="MapPin" size={16} className="inline-block mr-1 text-blue-600" />
          <strong>Based in Gray Court, SC</strong> — We serve all of Greenville, Laurens, and Spartanburg Counties.
          Don't see your city? <Link href="/contact" className="font-semibold text-blue-700 hover:underline">Contact us</Link> to check if we serve your area.
        </p>
      </div>
    </div>
  );
}
