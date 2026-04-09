import { query } from './mysql';

type CachedServiceValue = {
  expiresAt: number;
  items: ActiveService[];
};

declare global {
  var __burchServicesCache: Map<string, CachedServiceValue> | undefined;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const servicesCache = globalThis.__burchServicesCache ?? new Map<string, CachedServiceValue>();
const shouldLogServiceLoadErrors = process.env.NODE_ENV !== 'production';

if (!globalThis.__burchServicesCache) {
  globalThis.__burchServicesCache = servicesCache;
}

function isExpectedDatabaseFallbackError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /Access denied for user|ECONNREFUSED|connect ETIMEDOUT|ENOTFOUND|ECONNRESET/i.test(message);
}

async function readCachedServices(key: string, loader: () => Promise<ActiveService[]>): Promise<ActiveService[]> {
  const now = Date.now();
  const cached = servicesCache.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.items;
  }

  try {
    const items = await loader();
    servicesCache.set(key, { items, expiresAt: now + CACHE_TTL_MS });
    return items;
  } catch (error) {
    const fallbackItems = cached?.items ?? [];
    servicesCache.set(key, { items: fallbackItems, expiresAt: now + CACHE_TTL_MS });

    if (shouldLogServiceLoadErrors) {
      if (isExpectedDatabaseFallbackError(error)) {
        console.info(`Service settings unavailable for "${key}". Using static fallback content.`);
      } else {
        console.error(`Error loading services for cache key "${key}":`, error);
      }
    }

    return fallbackItems;
  }
}

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
  return readCachedServices('active-services', async () => {
    const services = await query<ActiveService>(
      `SELECT * FROM service_settings 
       WHERE enabled = TRUE 
       ORDER BY menu_order ASC, service_name ASC`
    );
    return services || [];
  });
}

/**
 * Get services that should appear on the services page
 */
export async function getServicesForPage(): Promise<ActiveService[]> {
  return readCachedServices('services-for-page', async () => {
    const services = await query<ActiveService>(
      `SELECT * FROM service_settings 
       WHERE enabled = TRUE AND show_in_services_page = TRUE 
       ORDER BY menu_order ASC, service_name ASC`
    );
    return services || [];
  });
}

/**
 * Get services that should appear in navigation
 */
export async function getServicesForNavigation(): Promise<ActiveService[]> {
  return readCachedServices('services-for-navigation', async () => {
    const services = await query<ActiveService>(
      `SELECT * FROM service_settings 
       WHERE enabled = TRUE AND show_in_navigation = TRUE 
       ORDER BY menu_order ASC, service_name ASC`
    );
    return services || [];
  });
}

/**
 * Get services that should appear in calculators
 */
export async function getServicesForCalculator(): Promise<ActiveService[]> {
  return readCachedServices('services-for-calculator', async () => {
    const services = await query<ActiveService>(
      `SELECT * FROM service_settings 
       WHERE enabled = TRUE AND show_in_calculator = TRUE 
       ORDER BY menu_order ASC, service_name ASC`
    );
    return services || [];
  });
}

/**
 * Get a single service by slug
 */
export async function getServiceBySlug(slug: string): Promise<ActiveService | null> {
  const services = await readCachedServices(`service-by-slug:${slug}`, async () => {
    return query<ActiveService>(
      `SELECT * FROM service_settings 
       WHERE enabled = TRUE AND service_slug = ? 
       LIMIT 1`,
      [slug]
    );
  });

  return services[0] || null;
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
