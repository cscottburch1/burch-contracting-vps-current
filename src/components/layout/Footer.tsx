'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { businessConfig } from '@/config/business';
import { analytics } from '@/lib/analytics';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-6">
              <Logo variant="footer" />
            </div>
            <p className="text-gray-400 mb-4">{businessConfig.description}</p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm">5.0 Rating</span>
              </div>
              <a 
                href={businessConfig.credentials.bbbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <div className="bg-blue-700 text-white rounded w-7 h-7 flex items-center justify-center font-bold text-xs">
                  A+
                </div>
                <span className="text-sm">BBB</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <Icon name="MapPin" size={18} className="mt-1 shrink-0" />
                <a 
                  href={businessConfig.credentials.googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  {businessConfig.contact.address}<br />
                  {businessConfig.contact.city}, {businessConfig.contact.state} {businessConfig.contact.zip}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Phone" size={18} className="mt-1 shrink-0" />
                <a 
                  href={`tel:${businessConfig.contact.phone}`} 
                  className="hover:text-white"
                  onClick={() => analytics.trackPhoneClick()}
                >
                  {businessConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Mail" size={18} className="mt-1 shrink-0" />
                <a 
                  href={`mailto:${businessConfig.contact.email}`} 
                  className="hover:text-white"
                  onClick={() => analytics.trackEmailClick()}
                >
                  {businessConfig.contact.email}
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Business Hours</h4>
              <p className="text-sm text-gray-400 whitespace-pre-line">{businessConfig.contact.hours}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/additions" className="hover:text-white">Additions</Link></li>
              <li><Link href="/garages" className="hover:text-white">Garages</Link></li>
              <li><Link href="/outdoor-living" className="hover:text-white">Outdoor Living</Link></li>
              <li><Link href="/remodeling" className="hover:text-white">Remodeling</Link></li>
              <li><Link href="/commercial-upfits" className="hover:text-white">Commercial Upfits</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/projects" className="hover:text-white">Our Projects</Link></li>
              <li><Link href="/contact" className="hover:text-white">Get Free Estimate</Link></li>
              <li><Link href="/service-areas" className="hover:text-white">Service Areas</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing Guide</Link></li>
            </ul>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="mb-8 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.2850456789!2d-82.07669558486845!3d34.63417458044791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88578d1a6ee3c001%3A0x147295d161e89612!2sBurch%20Contracting!5e0!3m2!1sen!2sus!4v1714780800000!5m2!1sen!2sus"
            width="100%" 
            height="300" 
            style={{ border: 0 }} 
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Burch Contracting Location - 1095 Water Tank Rd, Gray Court, SC 29645"
          />
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-2">
                Proudly serving {businessConfig.serviceArea.locations.slice(0, 5).join(', ')}, and all of Upstate SC since 1995
              </p>
              <p className="text-gray-500 text-xs">
                © {currentYear} {businessConfig.name}. All rights reserved. SC Licensed Construction, Remodeling and Renovations Contractor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
