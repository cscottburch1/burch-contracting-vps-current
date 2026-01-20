import React from 'react';
import { Wrench, Home, Hammer, Building, ArrowRight, CheckCircle } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Wrench,
      title: 'Professional Handyman Services',
      description: 'Same-day repairs, installations & maintenance for homes in Simpsonville, Fountain Inn, Gray Court & Woodruff. Licensed & insured.',
      features: ['Minor repairs & fixes', 'Fixture installations', 'Door & window repairs', 'Drywall patching', 'General maintenance'],
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Home,
      title: 'Kitchen & Bathroom Remodeling',
      description: 'Complete kitchen & bath renovations with custom cabinets, granite countertops & tile work throughout the Upstate SC region.',
      features: ['Custom cabinetry', 'Countertop installation', 'Tile & flooring', 'Plumbing updates', 'Lighting upgrades'],
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Hammer,
      title: 'Decks, Porches & Room Additions',
      description: 'Expert deck builders & porch contractors serving Simpsonville to Laurens. Custom composite & wood decks, screened porches, room additions.',
      features: ['Custom deck design', 'Screened porches', 'Room additions', 'Sunrooms', 'Outdoor living spaces'],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Building,
      title: 'Basement Finishing & Renovations',
      description: 'Transform unfinished basements into beautiful living spaces. Rec rooms, home theaters, offices & in-law suites in Simpsonville & Laurens County.',
      features: ['Basement finishing', 'Home theaters', 'Home offices', 'In-law suites', 'Recreation rooms'],
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Comprehensive Home Improvement{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Solutions
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            From minor repairs to major renovations, we offer a full range of contracting services 
            tailored to your needs and budget.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 border border-slate-100"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                
                {/* Icon Badge */}
                <div className={`absolute top-4 left-4 w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title on Image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={scrollToContact}
                  className={`group/btn w-full py-3 bg-gradient-to-r ${service.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                >
                  Get Free Quote
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">
            Not sure which service you need? We're happy to help you figure it out.
          </p>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
          >
            Schedule a Free Consultation
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
