export const siteConfig = {
  siteName: 'Burch Contracting',
  siteUrl: 'https://burchcontracting.com',
  defaultOgImage: '/og-image.webp',
  phoneDisplay: '(864) 724-4600',
  phoneHref: 'tel:8647244600',
  primaryCities: ['Simpsonville, SC', 'Mauldin, SC', 'Fountain Inn, SC', 'Woodruff, SC'],
  secondaryAreas: ['Upstate South Carolina'],
  region: 'Upstate South Carolina',
};

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.siteUrl).toString();
}
