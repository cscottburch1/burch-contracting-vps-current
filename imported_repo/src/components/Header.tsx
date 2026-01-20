import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { name: 'Handyman Services', href: '#services' },
    { name: 'Kitchen & Bath Remodeling', href: '#services' },
    { name: 'Decks, Porches & Additions', href: '#services' },
    { name: 'Basement Finishing', href: '#services' },
  ];

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Service Areas', href: '#areas' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Proudly serving Simpsonville and the Upstate SC community</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:8647244600" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
              <Phone className="w-4 h-4" />
              (864) 724-4600
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#hero" onClick={() => scrollToSection('#hero')} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900">Burch Contracting</h1>
                <p className="text-xs text-slate-500">Quality Craftsmanship Since 1994</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, 2).map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="px-4 py-2 text-slate-700 hover:text-orange-600 font-medium transition-colors rounded-lg hover:bg-slate-50"
                >
                  {link.name}
                </button>
              ))}

              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  className="px-4 py-2 text-slate-700 hover:text-orange-600 font-medium transition-colors rounded-lg hover:bg-slate-50 flex items-center gap-1"
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {servicesDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    {services.map((service) => (
                      <button
                        key={service.name}
                        onClick={() => scrollToSection(service.href)}
                        className="w-full text-left px-4 py-3 text-slate-700 hover:text-orange-600 hover:bg-slate-50 transition-colors"
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.slice(2).map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="px-4 py-2 text-slate-700 hover:text-orange-600 font-medium transition-colors rounded-lg hover:bg-slate-50"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:8647244600"
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-orange-600 font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">(864) 724-4600</span>
              </a>
              <button
                onClick={() => scrollToSection('#contact')}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
              >
                Free Estimate
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-200">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left px-4 py-3 text-slate-700 hover:text-orange-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="px-4 text-sm text-slate-500 mb-2">Our Services</p>
                {services.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => scrollToSection(service.href)}
                    className="block w-full text-left px-4 py-2 text-slate-600 hover:text-orange-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {service.name}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                <a
                  href="tel:8647244600"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (864) 724-4600
                </a>
                <button
                  onClick={() => scrollToSection('#contact')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Get Free Estimate
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
