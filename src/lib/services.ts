import { query } from './mysql';

export interface ActiveService {
  id: number;
  service_name: string;
  service_slug: string;
  description: string;
  menu_label: string;
  menu_order: number;
  page_title: string;
  page_content: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  hero_image: string;
  featured_image: string;
  call_to_action_text: string;
  call_to_action_url: string;
  show_in_calculator: boolean;
  show_in_services_page: boolean;
  show_in_navigation: boolean;
}

/**
 * Get all enabled services from the database
 */
export async function getActiveServices(): Promise<ActiveService[]> {
  try {
    const services = await query<ActiveService>(
      `SELECT * FROM service_settings 
       WHERE enabled = TRUE 
       ORDER BY menu_order ASC, service_name ASC`
    );
    return services || [];
  } catch (error) {
    console.error('Error fetching active services:', error);
    // Return empty array to prevent site breaking
    return [];
  }
}

/**
 * Get services that should appear on the services page
 */
export async function getServicesForPage(): Promise<ActiveService[]> {
  try {
    const services = await query<ActiveService>(
      `SELECT * FROM service_settings 
       WHERE enabled = TRUE AND show_in_services_page = TRUE 
       ORDER BY menu_order ASC, service_name ASC`
    );
    return services || [];
  } catch (error) {
    console.error('Error fetching services for page:', error);
    return [];
  }
}

/**
 * Get services that should appear in navigation
 */
export async function getServicesForNavigation(): Promise<ActiveService[]> {
  try {
    const services = await query<ActiveService>(
      `SELECT * FROM service_settings 
       WHERE enabled = TRUE AND show_in_navigation = TRUE 
       ORDER BY menu_order ASC, service_name ASC`
    );
    return services || [];
  } catch (error) {
    console.error('Error fetching services for navigation:', error);
    return [];
  }
}

/**
 * Get services that should appear in calculators
 */
export async function getServicesForCalculator(): Promise<ActiveService[]> {
  try {
    const services = await query<ActiveService>(
      `SELECT * FROM service_settings 
       WHERE enabled = TRUE AND show_in_calculator = TRUE 
       ORDER BY menu_order ASC, service_name ASC`
    );
    return services || [];
  } catch (error) {
    console.error('Error fetching services for calculator:', error);
    return [];
  }
}

/**
 * Get a single service by slug
 */
export async function getServiceBySlug(slug: string): Promise<ActiveService | null> {
  try {
    const services = await query<ActiveService>(
      `SELECT * FROM service_settings 
       WHERE enabled = TRUE AND service_slug = ? 
       LIMIT 1`,
      [slug]
    );
    return services[0] || null;
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    return null;
  }
}

/**
 * Map database service to businessConfig format for backward compatibility
 */
export function mapToBusinessConfigFormat(service: ActiveService) {
  return {
    id: service.service_slug,
    title: service.service_name,
    icon: getIconForService(service.service_slug),
    description: service.description,
    tasks: [] // Can be populated from additional table if needed
  };
}

/**
 * Get icon name based on service slug
 */
function getIconForService(slug: string): string {
  const iconMap: Record<string, string> = {
    'handyman': 'Wrench',
    'remodeling': 'Home',
    'additions': 'Paintbrush',
    'basement': 'Building'
  };
  return iconMap[slug] || 'Briefcase';
}
