import React from 'react';
import { MapPin, Phone, ArrowRight } from 'lucide-react';

const ServiceAreas: React.FC = () => {
  const areas = [
    { name: 'Simpsonville', tagline: 'Our Home Base', description: 'Proudly headquartered here since 1994' },
    { name: 'Greenville', tagline: "Upstate's Hub", description: 'Serving the greater Greenville metro' },
    { name: 'Five Forks', tagline: 'Family Friendly', description: 'Quality homes deserve quality work' },
    { name: 'Woodruff', tagline: 'Historic Charm', description: 'Preserving and enhancing local homes' },
    { name: 'Gray Court', tagline: 'Rural Living', description: 'Country homes, city-quality service' },
    { name: 'Fountain Inn', tagline: 'Historic Town', description: 'Trusted by local homeowners' },
    { name: 'Mauldin', tagline: 'Established', description: 'Growing community, growing trust' },
    { name: 'Laurens', tagline: 'County Seat', description: 'Serving Laurens County residents' },
  ];

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="areas" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Service Areas
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Service Areas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              We're Proud to Serve
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Delivering quality home services throughout the Upstate. Click on your city to learn more about our local expertise.
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {areas.map((area, index) => (
            <div
              key={area.name}
              className="group relative bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-orange-200/50 transition-all duration-300 border border-slate-100 hover:border-orange-200 cursor-pointer hover:-translate-y-1"
              onClick={scrollToContact}
            >
              {/* Location Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/25">
                <MapPin className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                {area.name}
              </h3>
              <p className="text-sm text-orange-600 font-medium mb-2">{area.tagline}</p>
              <p className="text-sm text-slate-500">{area.description}</p>

              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="grid lg:grid-cols-2">
            {/* Map Embed */}
            <div className="h-80 lg:h-auto min-h-[400px] bg-slate-100 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104899.45396012!2d-82.2!3d34.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88578d1a6ee3c001%3A0x147295d161e89612!2sBurch%20Contracting!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Burch Contracting Service Area Map"
              />
            </div>

            {/* Info Panel */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Serving the Greater Greenville-Spartanburg Area
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                From our home base in Gray Court, we proudly serve homeowners throughout the Upstate SC region. 
                Our service area includes Simpsonville, Greenville, Mauldin, Fountain Inn, and surrounding communities.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">1095 Water Tank Rd</p>
                    <p className="text-slate-600">Gray Court, SC 29645</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">(864) 724-4600</p>
                    <p className="text-slate-600">Mon-Fri: 8AM-5PM, Sat: 9AM-2PM</p>
                  </div>
                </div>
              </div>

              <button
                onClick={scrollToContact}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25"
              >
                Call for Service Availability
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
