import { Section } from '@/components/ui/Section';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { businessConfig } from '@/config/business';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Services in Simpsonville, SC | Kitchen, Bath, Deck, Basement, Handyman | (864) 724-4600',
  description: '#1 rated home services in Simpsonville, SC. Professional kitchen & bathroom remodeling, basement finishing, custom decks, screened porches, handyman services. Licensed, insured, BBB A+ rated. Serving Simpsonville, Fountain Inn, Gray Court, Woodruff, Laurens County. 30+ years experience. Free estimates.',
  keywords: ['home services Simpsonville SC', 'contractor Simpsonville', 'kitchen remodeling Simpsonville SC', 'bathroom remodeling Simpsonville', 'basement finishing Simpsonville', 'handyman Simpsonville', 'deck builder Simpsonville', 'screened porch Simpsonville', 'home repair Fountain Inn', 'remodeling contractor Gray Court', 'basement contractor Woodruff', 'licensed contractor Laurens County'],
  openGraph: {
    title: 'Professional Home Services | Burch Contracting - Simpsonville, SC',
    description: '#1 rated contractor in Simpsonville, SC. Kitchen & bath remodeling, basement finishing, decks, handyman services. Licensed, insured, BBB A+ rated. Serving southeast Greenville & Laurens Counties.',
    url: 'https://burchcontracting.com/services',
    type: 'website',
    images: [{
      url: 'https://burchcontracting.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Burch Contracting - Home Services in Simpsonville, SC'
    }]
  },
  alternates: {
    canonical: 'https://burchcontracting.com/services'
  }
};

export default function ServicesPage() {
  const services = businessConfig.services;

  return (
    <>
      <section className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-blue-900 text-white py-20 md:py-28 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Simpsonville's <span className="gradient-text">#1 Rated</span> Home Services
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up stagger-1 opacity-0 mb-6">
            Professional kitchen & bathroom remodeling, basement finishing, custom decks, screened porches, and handyman services throughout Simpsonville, Fountain Inn, Gray Court, Woodruff, and Laurens County. Licensed, insured, and BBB A+ rated with 30+ years experience.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up stagger-2 opacity-0">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Icon name="Star" size={20} className="text-yellow-400" />
              <span className="font-semibold">BBB A+ Rated</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Icon name="ShieldCheck" size={20} className="text-green-400" />
              <span className="font-semibold">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Icon name="MapPin" size={20} className="text-blue-400" />
              <span className="font-semibold">Serving Southeast SC</span>
            </div>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={service.id} className={`animate-scale-in opacity-0 stagger-${(index % 3) + 1} hover-lift`}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={<Icon name={service.icon as any} size={48} className="text-blue-600" />}
                href={`/services/${service.id}`}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 animate-fade-in-up stagger-1 opacity-0">
            Contact us today for a free consultation and estimate. We'll discuss your project needs and provide a detailed quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2 opacity-0">
            <Button variant="primary" size="lg" href="/contact" className="shadow-2xl">
              Request Free Estimate
              <Icon name="ArrowRight" size={20} />
            </Button>
            <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="border-white text-white hover:bg-white hover:text-gray-900">
              <Icon name="Phone" size={20} />
              {businessConfig.contact.phone}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}