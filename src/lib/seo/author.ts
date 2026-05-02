/**
 * Centralized author data for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * Used across all service and location pages for consistent author bylines and schema markup
 */

export interface AuthorInfo {
  name: string;
  role: string;
  experience: string;
  licenseNumber: string;
  yearsExperience: number;
  bio: string;
  email?: string;
  image?: string;
  sameAs?: string[]; // Social profiles, BBB, etc.
}

export const primaryAuthor: AuthorInfo = {
  name: 'C. Scott Burch',
  role: 'Owner & Lead Contractor',
  licenseNumber: 'CLG118679',
  yearsExperience: 35,
  experience: 'SC Licensed General Contractor #CLG118679 | 35+ years experience',
  bio: 'Scott Burch is the owner and lead contractor at Burch Contracting, serving Upstate South Carolina homeowners since 1995. With SC General Contractor License #CLG118679 and over 35 years of hands-on experience, Scott specializes in custom decks, screened porches, garage construction, and home additions. His commitment to transparent pricing, clear communication, and quality craftsmanship has earned a BBB A+ rating and trust from hundreds of local families.',
  email: 'scott@burchcontracting.com',
  image: 'https://burchcontracting.com/images/team/scott-burch.webp',
  sameAs: [
    'https://www.bbb.org/us/sc/simpsonville/profile/general-contractor/burch-contracting-0663-90447853',
    'https://www.facebook.com/burchcontracting',
  ],
};

/**
 * Get author byline with project count for specific service
 */
export function getAuthorByline(projectCount?: string): {
  name: string;
  role: string;
  experience: string;
} {
  const baseExperience = `SC Licensed General Contractor #${primaryAuthor.licenseNumber} | ${primaryAuthor.yearsExperience}+ years`;
  
  return {
    name: primaryAuthor.name,
    role: primaryAuthor.role,
    experience: projectCount 
      ? `${baseExperience} | ${projectCount}`
      : baseExperience,
  };
}

/**
 * Get author data for compact display (used in components)
 */
export function getCompactAuthor(): {
  name: string;
  role: string;
  license: string;
  years: number;
} {
  return {
    name: primaryAuthor.name,
    role: primaryAuthor.role,
    license: `SC License #${primaryAuthor.licenseNumber}`,
    years: primaryAuthor.yearsExperience,
  };
}

/**
 * Project counts by service type (updated as of April 2026)
 */
export const projectCounts = {
  decks: '347 decks built since 1995',
  screenedPorches: '50+ porches built since 1995',
  garages: '109 garages built since 1995',
  roomAdditions: '89 additions completed since 1995',
  kitchens: '187 kitchens remodeled since 1995',
  bathrooms: '240 bathrooms remodeled since 1995',
  basements: '32 basements finished since 1995',
  adus: '15 ADUs built since 2018',
};
