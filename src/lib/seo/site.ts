export const siteConfig = {
  siteName: 'Burch Contracting',
  siteUrl: 'https://burchcontracting.com',
  defaultOgImage: '/og-image.jpg',
  phoneDisplay: '(864) 724-4600',
  phoneHref: 'tel:8647244600',
  primaryCities: ['Simpsonville, SC', 'Fountain Inn, SC', 'Mauldin, SC'],
  secondaryAreas: ['Gray Court, SC', 'Laurens, SC', 'Woodruff, SC', 'Clinton, SC', 'Ora, SC', 'Joanna, SC'],
};

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.siteUrl).toString();
}
