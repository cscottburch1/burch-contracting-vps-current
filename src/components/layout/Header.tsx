'use client';

import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { businessConfig } from '@/config/business';
import { analytics } from '@/lib/analytics';

interface Service {
  service_slug: string;
  service_name: string;
  menu_label: string;
}

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const services: Service[] = businessConfig.services.map((service) => ({
    service_slug: service.id,
    service_name: service.title,
    menu_label: service.title,
  }));

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services', hasDropdown: services.length > 0 },
    { label: 'Employment', href: '/employment', hasDropdown: true },
    { label: 'Customer Portal', href: '/portal' },
    { label: 'Contact', href: '/contact' },
    { label: 'Admin', href: '/admin' }
  ];

  const [employmentOpen, setEmploymentOpen] = useState(false);
  const employmentLinks = [
    { label: 'Subcontractors', href: '/subcontractors/join' },
    { label: 'Direct Hire Employees', href: '/employment/direct-hire' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <a 
              href={`tel:${businessConfig.contact.phone}`} 
              className="flex items-center gap-2"
              onClick={() => analytics.trackPhoneClick()}
            >
              <Icon name="Phone" size={16} />
              <span>{businessConfig.contact.phone}</span>
            </a>
            <span className="hidden sm:inline">{businessConfig.serviceArea.description}</span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo variant="header" />

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.label === 'Services') {
                return (
                  <div key={link.href} className="relative group">
                    <a 
                      href={link.href} 
                      className="text-gray-800 hover:text-blue-600 font-semibold flex items-center gap-1"
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      {link.label}
                      <Icon name="ChevronDown" size={16} />
                    </a>
                    {servicesOpen && services.length > 0 && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 z-50"
                        onMouseEnter={() => setServicesOpen(true)}
                        onMouseLeave={() => setServicesOpen(false)}
                      >
                        {services.map((service) => (
                          <a
                            key={service.service_slug}
                            href={`/services/${service.service_slug}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {service.menu_label || service.service_name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else if (link.label === 'Employment') {
                return (
                  <div key={link.href} className="relative group">
                    <a 
                      href={link.href} 
                      className="text-gray-800 hover:text-blue-600 font-semibold flex items-center gap-1"
                      onMouseEnter={() => setEmploymentOpen(true)}
                      onMouseLeave={() => setEmploymentOpen(false)}
                    >
                      {link.label}
                      <Icon name="ChevronDown" size={16} />
                    </a>
                    {employmentOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50"
                        onMouseEnter={() => setEmploymentOpen(true)}
                        onMouseLeave={() => setEmploymentOpen(false)}
                      >
                        {employmentLinks.map((empLink) => (
                          <a
                            key={empLink.href}
                            href={empLink.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {empLink.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <a key={link.href} href={link.href} className="text-gray-800 hover:text-blue-600 font-semibold">
                    {link.label}
                  </a>
                );
              }
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="primary" size="sm" href="/contact">
              Free Estimate
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-900"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={28} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                if (link.label === 'Services') {
                  return (
                    <div key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-black font-semibold py-2 text-lg block"
                      >
                        {link.label}
                      </a>
                      {services.length > 0 && (
                        <div className="ml-4 mt-2 space-y-2">
                          {services.map((service) => (
                            <a
                              key={service.service_slug}
                              href={`/services/${service.service_slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-gray-600 py-1 text-base block"
                            >
                              {service.menu_label || service.service_name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                } else if (link.label === 'Employment') {
                  return (
                    <div key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-black font-semibold py-2 text-lg block"
                      >
                        {link.label}
                      </a>
                      <div className="ml-4 mt-2 space-y-2">
                        {employmentLinks.map((empLink) => (
                          <a
                            key={empLink.href}
                            href={empLink.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-gray-600 py-1 text-base block"
                          >
                            {empLink.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-black font-semibold py-2 text-lg block"
                      >
                        {link.label}
                      </a>
                    </div>
                  );
                }
              })}
              <Button variant="primary" size="md" href="/contact" fullWidth onClick={() => setMobileMenuOpen(false)}>
                Free Estimate
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
