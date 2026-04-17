// Utility functions for generating sample data
// These can be called from server components

export interface TestimonialData {
  id: string;
  name: string;
  location: string;
  rating: 5 | 4.5 | 4 | 3.5 | 3;
  date: string;
  service: string;
  review: string;
  projectType?: string;
  verified?: boolean;
}

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

export function generateSampleProjects(service: string, count: number = 6): ProjectGalleryItem[] {
  const cities = [
    { name: 'Simpsonville', state: 'SC' },
    { name: 'Fountain Inn', state: 'SC' },
    { name: 'Mauldin', state: 'SC' },
    { name: 'Gray Court', state: 'SC' },
    { name: 'Greenville', state: 'SC' },
    { name: 'Laurens', state: 'SC' },
  ];

  const serviceDescriptions: Record<string, { titles: string[]; descriptions: string[] }> = {
    'deck': {
      titles: ['Custom Composite Deck', 'Multi-Level Wood Deck', 'Premium Trex Deck', 'Backyard Entertainment Deck'],
      descriptions: [
        'Beautiful composite deck with privacy screens and built-in lighting',
        'Two-level pressure-treated deck perfect for entertaining',
        'Low-maintenance Trex deck with modern railing system',
        'Spacious deck designed for outdoor living and dining'
      ]
    },
    'garage': {
      titles: ['2-Car Attached Garage', 'Detached Workshop Garage', '3-Car Garage Addition', 'Custom Storage Garage'],
      descriptions: [
        'Attached 2-car garage with matching roof and siding',
        'Detached garage with workshop space and storage loft',
        'Spacious 3-car garage with ample storage space',
        'Custom garage designed for vehicles and yard equipment'
      ]
    },
    'porch': {
      titles: ['Aluminum Screened Porch', 'Covered Front Porch', 'Three-Season Room', 'Outdoor Living Space'],
      descriptions: [
        'Bug-free outdoor living with aluminum framing and ceiling fan',
        'Welcoming covered porch with stone columns',
        'Year-round comfort with screens and optional windows',
        'Perfect for dining and relaxing in the fresh air'
      ]
    }
  };

  const serviceKey = service.toLowerCase().includes('deck') ? 'deck' 
    : service.toLowerCase().includes('garage') ? 'garage' 
    : 'porch';

  const data = serviceDescriptions[serviceKey];
  const currentYear = new Date().getFullYear();

  return Array.from({ length: Math.min(count, 6) }, (_, i) => ({
    id: `project-${service}-${i + 1}`,
    title: data.titles[i % data.titles.length],
    description: data.descriptions[i % data.descriptions.length],
    city: cities[i % cities.length].name,
    state: cities[i % cities.length].state,
    service: service,
    imagePath: `/images/placeholder-project-${(i % 3) + 1}.jpg`,
    altText: `${data.titles[i % data.titles.length]} in ${cities[i % cities.length].name}, ${cities[i % cities.length].state}`,
    year: currentYear - (i % 3)
  }));
}
