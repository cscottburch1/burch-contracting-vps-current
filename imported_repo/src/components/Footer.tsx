import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, ExternalLink, Shield, Award, Star } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Handyman Services', href: '#services' },
    { name: 'Kitchen Remodeling', href: '#services' },
    { name: 'Bathroom Remodeling', href: '#services' },
    { name: 'Deck & Porch Construction', href: '#services' },
    { name: 'Room Additions', href: '#services' },
    { name: 'Basement Finishing', href: '#services' },
  ];

  const serviceAreas = [
    'Simpsonville', 'Greenville', 'Five Forks', 'Woodruff',
    'Gray Court', 'Fountain Inn', 'Mauldin', 'Laurens',
  ];

  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Our Services', href: '#services' },
    { name: 'Recent Projects', href: '#projects' },
    { name: 'Service Areas', href: '#areas' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'Customer Portal', href: 'https://burchcontracting.com/portal' },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Burch Contracting</h3>
                <p className="text-slate-400 text-sm">Quality Since 1994</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Professional residential and light commercial contracting services. 
              Quality craftsmanship you can trust.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A+</span>
                </div>
                <span className="text-sm text-slate-300">BBB Rated</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm text-slate-300">5.0 Google</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <button
                    onClick={() => scrollToSection(service.href)}
                    className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Service Areas</h4>
            <ul className="space-y-3">
              {serviceAreas.map((area) => (
                <li key={area}>
                  <button
                    onClick={() => scrollToSection('#areas')}
                    className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                  >
                    {area}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-slate-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-1"
                  >
                    {link.name}
                    {!link.href.startsWith('#') && <ExternalLink className="w-3 h-3" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:8647244600" className="flex items-start gap-3 text-slate-400 hover:text-orange-400 transition-colors">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">(864) 724-4600</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@burchcontracting.com" className="flex items-start gap-3 text-slate-400 hover:text-orange-400 transition-colors">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">info@burchcontracting.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-slate-400">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">1095 Water Tank Rd<br />Gray Court, SC 29645</span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-slate-400">
                  <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Mon-Fri: 8AM-5PM<br />Sat: 9AM-2PM</span>
                </div>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <span>&copy; {currentYear} Burch Contracting LLC. All rights reserved.</span>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Licensed & Insured</span>
              </div>
              <span>|</span>
              <span>SC Contractor License</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
