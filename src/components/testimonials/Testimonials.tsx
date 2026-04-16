'use client';

import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import Script from 'next/script';

export interface TestimonialData {
  id: string;
  name: string;
  location: string; // City, State format
  rating: 5 | 4.5 | 4 | 3.5 | 3;
  date: string; // ISO date string
  service: string;
  review: string;
  projectType?: string;
  verified?: boolean;
}

interface TestimonialsProps {
  testimonials: TestimonialData[];
  title?: string;
  subtitle?: string;
  showSchema?: boolean;
}

export default function Testimonials({ 
  testimonials,
  title = "What Our Customers Say",
  subtitle = "Real feedback from real homeowners throughout Upstate SC.",
  showSchema = true
}: TestimonialsProps) {
  
  // Generate JSON-LD Review Schema
  const generateReviewSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Burch Contracting",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": calculateAverageRating(),
        "reviewCount": testimonials.length,
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": testimonials.map(t => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": t.name
        },
        "datePublished": t.date,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": t.rating.toString(),
          "bestRating": "5",
          "worstRating": "1"
        },
        "reviewBody": t.review,
        "itemReviewed": {
          "@type": "Service",
          "name": t.service,
          "provider": {
            "@type": "Organization",
            "name": "Burch Contracting"
          }
        }
      }))
    };
  };

  const calculateAverageRating = (): string => {
    if (testimonials.length === 0) return "5.0";
    const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
    return (sum / testimonials.length).toFixed(1);
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? "Star" : star - 0.5 === rating ? "StarHalf" : "Star"}
            size={18}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* JSON-LD Schema */}
      {showSchema && testimonials.length > 0 && (
        <Script
          id="testimonials-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateReviewSchema())
          }}
        />
      )}

      <div className="space-y-8">
        {/* Header */}
        <div className="max-w-3xl text-center mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-3 text-lg text-gray-600">{subtitle}</p>
          )}
          
          {/* Overall Rating Summary */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              {renderStars(parseFloat(calculateAverageRating()))}
              <span className="text-2xl font-bold text-gray-900">
                {calculateAverageRating()}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              Based on {testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="flex flex-col border border-gray-200 p-6 transition-shadow hover:shadow-xl"
            >
              {/* Header: Stars + Verified Badge */}
              <div className="mb-4 flex items-start justify-between">
                {renderStars(testimonial.rating)}
                {testimonial.verified && (
                  <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    <Icon name="CheckCircle2" size={12} />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Review Text */}
              <blockquote className="mb-4 flex-1 text-sm leading-relaxed text-gray-700">
                "{testimonial.review}"
              </blockquote>

              {/* Service Badge */}
              <div className="mb-3 inline-block self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {testimonial.service}
              </div>

              {/* Footer: Author Info */}
              <div className="mt-auto border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Icon name="MapPin" size={12} />
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {formatDate(testimonial.date)}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA: Leave a Review */}
        <div className="mt-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
          <h3 className="mb-2 text-2xl font-bold">Had a Great Experience?</h3>
          <p className="mb-5 text-blue-100">
            We'd love to hear about your project! Your feedback helps us improve and helps other homeowners make informed decisions.
          </p>
          <a
            href="/contact?subject=review"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition-all hover:bg-blue-50"
          >
            <Icon name="MessageSquare" size={18} />
            <span>Leave Us a Review</span>
          </a>
        </div>
      </div>
    </>
  );
}

// Sample testimonials generator for placeholder content
export function generateSampleTestimonials(count: number = 6): TestimonialData[] {
  const names = ['John Martinez', 'Sarah Thompson', 'Mike Davis', 'Jennifer Lee', 'Robert Wilson', 'Emily Brown', 'David Anderson', 'Lisa Garcia'];
  const locations = ['Simpsonville, SC', 'Fountain Inn, SC', 'Greenville, SC', 'Mauldin, SC', 'Gray Court, SC', 'Laurens, SC'];
  const services = ['Custom Deck', 'Screened Porch', 'Garage Addition', 'Home Addition', 'Kitchen Remodeling', 'Basement Finishing'];
  const reviews = [
    'Burch Contracting exceeded our expectations! The crew was professional, punctual, and the quality of work was outstanding. Our deck is absolutely beautiful.',
    'From design to completion, the entire process was smooth. They listened to our needs and delivered exactly what we wanted. Highly recommend!',
    'We could not be happier with our new garage. The attention to detail and craftsmanship is top-notch. Worth every penny.',
    'Professional, reliable, and skilled. Our screened porch has become our favorite room in the house. Thank you Burch Contracting!',
    'Transparent pricing, quality materials, and excellent communication throughout the project. We will definitely use them again for future projects.',
    'The team was respectful of our property, cleaned up daily, and finished on schedule. Our addition looks like it was always part of the house.'
  ];

  const getRandomDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  return Array.from({ length: Math.min(count, 8) }, (_, i) => ({
    id: `testimonial-${i + 1}`,
    name: names[i % names.length],
    location: locations[i % locations.length],
    rating: (i % 2 === 0 ? 5 : 4.5) as 5 | 4.5,
    date: getRandomDate((i + 1) * 30),
    service: services[i % services.length],
    review: reviews[i % reviews.length],
    verified: i % 3 === 0
  }));
}
