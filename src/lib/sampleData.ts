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
  // Real Google Business reviews - all 5-star ratings
  const realTestimonials: TestimonialData[] = [
    {
      id: 'testimonial-1',
      name: 'Debra Lee',
      location: 'Greenville, SC',
      rating: 5,
      date: '2026-03-13', // 5 weeks ago from April 17, 2026
      service: 'Bathroom Remodeling',
      review: "I'm so proud of the shower replacement they did—an outstanding job! Great work. Great price.",
      verified: true
    },
    {
      id: 'testimonial-2',
      name: 'Tanya Towne',
      location: 'Simpsonville, SC',
      rating: 5,
      date: '2026-01-23', // 13 weeks ago
      service: 'Flooring Installation',
      review: 'The owner was very professional and understood what I needed. The work was done in a timely manner with no complaints. His employees were polite and respectful. They cleaned up behind themselves and I was very impressed. If I need work done again, I will call them! Thank you for the great service! Reasonable price.',
      verified: true
    },
    {
      id: 'testimonial-3',
      name: 'Denise Majewski',
      location: 'Fountain Inn, SC',
      rating: 5,
      date: '2026-01-23', // 13 weeks ago
      service: 'Bathroom Remodeling',
      review: "Scott's team took out our big bathtub and made it into a step-in shower. This included demolition, retiling, new plumbing fixtures, etc. They did a fabulous job. On time every day, good follow-up, cleaned up every day, nice people to work with. The price was very fair and Scott was great to work with from the proposal to completion. Thanks guys!!! Reasonable price.",
      verified: true
    },
    {
      id: 'testimonial-4',
      name: 'Joanie M Neely',
      location: 'Greenville, SC',
      rating: 5,
      date: '2025-01-30',
      service: 'Flood Restoration',
      review: 'My family recently had a flood in our home that impacted 2 levels. I reached out to several contractors and everyone was either too busy or not interested, then I found Burch Contracting. Scott told me he was really busy but eager to help. He and his team worked quickly and efficiently to get us back home. He was very patient with me and my insurance company. When the hurricane came in September, I had lost some siding and had a roof leak, and Scott sent his team out to fix it—we didn\'t know until it was already done that he had taken care of it. Super high quality, fairness, and professionalism is what you get when you work with him.',
      verified: true
    },
    {
      id: 'testimonial-5',
      name: 'Gary Krause',
      location: 'Mauldin, SC',
      rating: 5,
      date: '2025-01-20',
      service: 'Home Remodeling',
      review: 'This company was very professional and the timeline was amazing. Very pleased with everything. I would highly recommend them for any work you need done. I will use them again when needed. Thank you Scott and crew.',
      verified: true
    },
    {
      id: 'testimonial-6',
      name: 'Cindy Miler',
      location: 'Simpsonville, SC',
      rating: 5,
      date: '2024-06-26',
      service: 'Kitchen Remodeling',
      review: "We had the best experience with Burch Contracting! Scott sent his guys over to make some improvements to our kitchen and we couldn't be happier. They all went above and beyond to make sure everything was perfect. We love our 'new' kitchen and look forward to more projects with them. Highly recommend!!",
      verified: true
    },
    {
      id: 'testimonial-7',
      name: 'Kelli Stevenson',
      location: 'Greenville, SC',
      rating: 5,
      date: '2024-03-18',
      service: 'Bathroom Remodeling',
      review: 'My husband and I could not recommend this company enough!! From pricing, to communication, to work ethic... they literally delivered it all! We are so happy with our 2 new custom bathrooms and we strongly recommend Scott and his crew to everyone!!',
      verified: true
    },
    {
      id: 'testimonial-8',
      name: 'Chris Sutton',
      location: 'Gray Court, SC',
      rating: 5,
      date: '2019-07-14',
      service: 'Concrete Patio',
      review: "I've used Scott on several projects on our home with the last one being a huge concrete patio. Scott and his guys have always been very professional and courteous to our needs. I often get a couple of quotes and his prices are always in line, but it's the great customer service that we have experienced that always brings us back to Scott.",
      verified: true
    }
  ];

  return realTestimonials.slice(0, Math.min(count, realTestimonials.length));
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
