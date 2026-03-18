export const siteConfig = {
  siteName: 'Burch Contracting',
  siteUrl: 'https://burchcontracting.com',
  defaultOgImage: '/og-image.jpg',
  phoneDisplay: '(864) 724-4600',
  phoneHref: 'tel:8647244600',
  primaryCities: ['Simpsonville, SC', 'Fountain Inn, SC'],
  secondaryAreas: ['Greenville County, SC', 'Laurens County, SC'],
};

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.siteUrl).toString();
}
