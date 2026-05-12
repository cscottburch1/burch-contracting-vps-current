'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { businessConfig } from '@/config/business';
import { analytics } from '@/lib/analytics';

// Lean navigation structure - no dropdowns, clear hierarchy

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const currentPath = pathname ?? '';
  const isActive = (pathPrefix: string) => currentPath === pathPrefix || currentPath.startsWith(`${pathPrefix}/`);

  const navLinkClass = (active: boolean) =>
    `inline-flex items-center gap-1 font-semibold transition-colors ${active ? 'text-blue-700' : 'text-gray-800 hover:text-blue-600'}`;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gray-100 bg-white transition-shadow duration-200 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
      role="banner"
    >
      <div className="bg-gray-900 py-2 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`tel:${businessConfig.contact.phone}`}
                className="inline-flex items-center gap-2 font-semibold text-white hover:text-blue-200"
                onClick={() => analytics.trackPhoneClick()}
                aria-label={`Call ${businessConfig.contact.phone}`}
              >
                <Icon name="Phone" size={15} />
                <span>{businessConfig.contact.phone}</span>
              </a>
              <a
                href="https://www.google.com/maps/place/34.6341746,-82.0744941"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 text-gray-200 hover:text-white"
                aria-label="View location on Google Maps"
              >
                <Icon name="MapPin" size={15} />
                <span>1095 Water Tank Rd, Gray Court, SC 29645</span>
              </a>
            </div>

            <span className="hidden lg:inline text-gray-200">
              Serving Simpsonville, Mauldin, Fountain Inn &amp; Woodruff
            </span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Primary">
        <div className="flex h-20 items-center justify-between">
          <Logo variant="header" />

          <div className="hidden lg:flex items-center gap-7">
            <Link href="/" className={navLinkClass(currentPath === '/')}>
              Home
            </Link>

            <Link href="/work" className={navLinkClass(isActive('/work') || isActive('/projects'))}>
              Work
            </Link>

            <Link href="/services" className={navLinkClass(isActive('/services'))}>
              Services
            </Link>

            <Link href="/areas" className={navLinkClass(isActive('/areas') || isActive('/service-areas'))}>
              Areas We Serve
            </Link>

            <Link href="/about" className={navLinkClass(isActive('/about'))}>
              About Scott
            </Link>

            <Link href="/contact" className={navLinkClass(isActive('/contact'))}>
              Contact
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              href="/contact"
              onClick={() => analytics.trackGetEstimateClick('header')}
              className="bg-orange-600 hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Get Estimate
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-900"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
          >
            <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={28} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t py-4 lg:hidden">
            <div className="flex flex-col gap-4">
              <a
                href={`tel:${businessConfig.contact.phone}`}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-3 text-base font-semibold text-blue-800"
                onClick={() => analytics.trackPhoneClick()}
                aria-label={`Call ${businessConfig.contact.phone}`}
              >
                <Icon name="Phone" size={18} />
                {businessConfig.contact.phone}
              </a>

              <Link href="/" className="py-2 text-lg font-semibold text-black hover:text-blue-700">
                Home
              </Link>

              <Link href="/work" className="py-2 text-lg font-semibold text-black hover:text-blue-700">
                Work
              </Link>

              <Link href="/services" className="py-2 text-lg font-semibold text-black hover:text-blue-700">
                Services
              </Link>

              <Link href="/areas" className="py-2 text-lg font-semibold text-black hover:text-blue-700">
                Areas We Serve
              </Link>

              <Link href="/about" className="py-2 text-lg font-semibold text-black hover:text-blue-700">
                About Scott
              </Link>

              <Link href="/contact" className="py-2 text-lg font-semibold text-black hover:text-blue-700">
                Contact
              </Link>

              <Button
                variant="primary"
                size="md"
                href="/contact"
                fullWidth
                className="bg-orange-600 hover:bg-orange-700"
              >
                Get Estimate
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
