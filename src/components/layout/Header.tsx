'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { businessConfig } from '@/config/business';
import { analytics } from '@/lib/analytics';

type DropdownKey = 'services' | 'areas' | 'pricing' | 'calculators' | null;

interface NavItem {
  label: string;
  href?: string; // Optional for group headers
  subItems?: NavItem[]; // For nested dropdown items
}

// FIXED: Split "Kitchen & Bath Remodeling" into two separate accessible items
// FIXED: Corrected "Basement Finishing" link from /home-renovations to /basement-finishing
const serviceLinks: NavItem[] = [
  { label: 'Custom Decks', href: '/deck-builder' },
  { label: 'Screened Porches', href: '/screened-porches' },
  { label: 'Garages & Garage Apartments', href: '/garage-builder' },
  { label: 'Home Additions', href: '/room-additions' },
  // Kitchen & Bath now split into two clear items for better UX
  {
    label: 'Kitchen & Bath Remodeling',
    subItems: [
      { label: 'Kitchen Remodeling', href: '/kitchen-remodeling' },
      { label: 'Bathroom Remodeling', href: '/bathroom-remodeling' },
    ],
  },
  { label: 'Basement Finishing', href: '/basement-finishing' },
  { label: 'ADUs & Backyard Cottages', href: '/adu-builder' },
  { label: 'Commercial Renovations', href: '/commercial-renovations' },
];

const calculatorLinks: NavItem[] = [
  { label: 'Deck Cost Calculator', href: '/calculator/decks' },
  { label: 'Screened Porch Calculator', href: '/calculator/screened-porches' },
  { label: 'Garage Cost Calculator', href: '/calculator/garages' },
  { label: 'Home Addition Calculator', href: '/calculator/room-additions' },
  { label: 'Kitchen Remodeling Calculator', href: '/calculator/kitchen-remodeling' },
  { label: 'Bathroom Remodeling Calculator', href: '/calculator/bathroom-remodeling' },
  { label: 'Basement Finishing Calculator', href: '/calculator/basement-finishing' },
  { label: 'ADU Cost Calculator', href: '/calculator/adus' },
];

const areaLinks: NavItem[] = [
  { label: 'Simpsonville, SC', href: '/service-areas/simpsonville' },
  { label: 'Fountain Inn, SC', href: '/service-areas/fountain-inn' },
  { label: 'Greenville, SC', href: '/service-areas/greenville' },
  { label: 'Greer, SC', href: '/service-areas/greer' },
  { label: 'Mauldin, SC', href: '/service-areas/mauldin' },
  { label: 'Five Forks, SC', href: '/service-areas/five-forks' },
  { label: 'Gray Court, SC', href: '/service-areas/gray-court' },
  { label: 'Woodruff, SC', href: '/service-areas/woodruff' },
  { label: 'Laurens, SC', href: '/service-areas/laurens' },
];

const pricingLinks: NavItem[] = [
  { label: 'Deck Building Cost', href: '/cost/cost-to-build-a-deck-simpsonville-sc' },
  { label: 'Screened Porch Cost', href: '/cost/screened-porch-vs-sunroom-sc' },
  { label: 'Garage Construction Cost', href: '/cost/garage-construction-cost-laurens-sc' },
  { label: 'Home Addition Cost', href: '/cost/home-addition-cost-greenville-sc' },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAreasOpen, setMobileAreasOpen] = useState(false);
  const [mobilePricingOpen, setMobilePricingOpen] = useState(false);
  const [mobileCalculatorsOpen, setMobileCalculatorsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileServicesOpen(false);
    setMobileAreasOpen(false);
    setMobilePricingOpen(false);
    setMobileCalculatorsOpen(false);
  }, [pathname]);

  const currentPath = pathname ?? '';
  const isActive = (pathPrefix: string) => currentPath === pathPrefix || currentPath.startsWith(`${pathPrefix}/`);

  const navLinkClass = (active: boolean) =>
    `inline-flex items-center gap-1 font-semibold transition-colors ${active ? 'text-blue-700' : 'text-gray-800 hover:text-blue-600'}`;

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openDropdown = (key: Exclude<DropdownKey, null>) => {
    clearCloseTimeout();
    setActiveDropdown(key);
  };

  const scheduleDropdownClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const closeDropdownImmediately = () => {
    clearCloseTimeout();
    setActiveDropdown(null);
  };

  const dropdownWrapperClass = 'relative pb-4 -mb-4';
  const dropdownPanelClass =
    'absolute left-0 top-full mt-2 min-w-[260px] rounded-xl border border-gray-200 bg-white py-2 shadow-xl z-50';
  const dropdownLinkClass = 'block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700';

  const closeDropdownOnBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      closeDropdownImmediately();
    }
  };

  useEffect(() => {
    return () => clearCloseTimeout();
  }, []);

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
              Serving Simpsonville, Fountain Inn &amp; Upstate South Carolina
            </span>

            <div className="flex items-center gap-4">
              <Link href="/portal" className="font-medium text-gray-200 hover:text-white">
                Customer Portal
              </Link>
              <Link href="/employment" className="font-medium text-gray-200 hover:text-white">
                Employment / Careers
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Primary">
        <div className="flex h-20 items-center justify-between">
          <Logo variant="header" />

          <div className="hidden lg:flex items-center gap-7">
            <div
              className={dropdownWrapperClass}
              onMouseEnter={() => openDropdown('services')}
              onMouseLeave={scheduleDropdownClose}
              onBlur={closeDropdownOnBlur}
            >
              <div className="inline-flex items-center gap-1">
                <Link
                  href="/services"
                  className={navLinkClass(isActive('/services'))}
                  onFocus={() => openDropdown('services')}
                >
                  Services
                </Link>
                <button
                  type="button"
                  className={isActive('/services') ? 'text-blue-700' : 'text-gray-800 hover:text-blue-600'}
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === 'services'}
                  aria-controls="desktop-services-menu"
                  aria-label="Toggle Services submenu"
                  onClick={() => {
                    clearCloseTimeout();
                    setActiveDropdown((prev) => (prev === 'services' ? null : 'services'));
                  }}
                  onFocus={() => openDropdown('services')}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      closeDropdownImmediately();
                      (event.currentTarget as HTMLButtonElement).blur();
                    }
                  }}
                >
                  <Icon name="ChevronDown" size={16} className={activeDropdown === 'services' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
              </div>
              <div
                id="desktop-services-menu"
                className={`${dropdownPanelClass} ${activeDropdown === 'services' ? 'block' : 'hidden'}`}
                role="menu"
                aria-label="Services"
                onMouseEnter={clearCloseTimeout}
                onMouseLeave={scheduleDropdownClose}
              >
                {serviceLinks.map((item) => {
                  // Render group with sub-items
                  if (item.subItems) {
                    return (
                      <div key={item.label} className="py-1">
                        <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {item.label}
                        </div>
                        {item.subItems.map((subItem) => (
                          <Link
                            key={`${subItem.label}-${subItem.href}`}
                            href={subItem.href!}
                            className={`${dropdownLinkClass} pl-6`}
                            role="menuitem"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  // Render regular link
                  return (
                    <Link key={`${item.label}-${item.href}`} href={item.href!} className={dropdownLinkClass} role="menuitem">
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div
              className={dropdownWrapperClass}
              onMouseEnter={() => openDropdown('areas')}
              onMouseLeave={scheduleDropdownClose}
              onBlur={closeDropdownOnBlur}
            >
              <div className="inline-flex items-center gap-1">
                <Link
                  href="/locations"
                  className={navLinkClass(isActive('/service-areas') || isActive('/locations'))}
                  onFocus={() => openDropdown('areas')}
                >
                  Areas Served
                </Link>
                <button
                  type="button"
                  className={isActive('/service-areas') || isActive('/locations') ? 'text-blue-700' : 'text-gray-800 hover:text-blue-600'}
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === 'areas'}
                  aria-controls="desktop-areas-menu"
                  aria-label="Toggle Areas Served submenu"
                  onClick={() => {
                    clearCloseTimeout();
                    setActiveDropdown((prev) => (prev === 'areas' ? null : 'areas'));
                  }}
                  onFocus={() => openDropdown('areas')}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      closeDropdownImmediately();
                      (event.currentTarget as HTMLButtonElement).blur();
                    }
                  }}
                >
                  <Icon name="ChevronDown" size={16} className={activeDropdown === 'areas' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
              </div>
              <div
                id="desktop-areas-menu"
                className={`${dropdownPanelClass} ${activeDropdown === 'areas' ? 'block' : 'hidden'}`}
                role="menu"
                aria-label="Areas Served"
                onMouseEnter={clearCloseTimeout}
                onMouseLeave={scheduleDropdownClose}
              >
                {areaLinks.map((item) => (
                  <Link key={item.href} href={item.href!} className={dropdownLinkClass} role="menuitem">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/projects" className={navLinkClass(isActive('/projects'))}>
              Projects
            </Link>

            <div
              className={dropdownWrapperClass}
              onMouseEnter={() => openDropdown('pricing')}
              onMouseLeave={scheduleDropdownClose}
              onBlur={closeDropdownOnBlur}
            >
              <div className="inline-flex items-center gap-1">
                <Link
                  href="/cost"
                  className={navLinkClass(isActive('/cost'))}
                  onFocus={() => openDropdown('pricing')}
                >
                  Pricing Guide
                </Link>
                <button
                  type="button"
                  className="text-gray-800 hover:text-blue-600"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === 'pricing'}
                  aria-controls="desktop-pricing-menu"
                  aria-label="Toggle Pricing Guide submenu"
                  onClick={() => {
                    clearCloseTimeout();
                    setActiveDropdown((prev) => (prev === 'pricing' ? null : 'pricing'));
                  }}
                  onFocus={() => openDropdown('pricing')}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      closeDropdownImmediately();
                      (event.currentTarget as HTMLButtonElement).blur();
                    }
                  }}
                >
                  <Icon name="ChevronDown" size={16} className={activeDropdown === 'pricing' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
              </div>
              <div
                id="desktop-pricing-menu"
                className={`${dropdownPanelClass} ${activeDropdown === 'pricing' ? 'block' : 'hidden'}`}
                role="menu"
                aria-label="Pricing Guide"
                onMouseEnter={clearCloseTimeout}
                onMouseLeave={scheduleDropdownClose}
              >
                {pricingLinks.map((item) => (
                  <Link key={item.href} href={item.href!} className={dropdownLinkClass} role="menuitem">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div
              className={dropdownWrapperClass}
              onMouseEnter={() => openDropdown('calculators')}
              onMouseLeave={scheduleDropdownClose}
              onBlur={closeDropdownOnBlur}
            >
              <div className="inline-flex items-center gap-1">
                <Link
                  href="/calculators"
                  className={navLinkClass(isActive('/calculators') || isActive('/calculator'))}
                  onFocus={() => openDropdown('calculators')
                >
                  Calculators
                </Link>
                <button
                  type="button"
                  className={isActive('/calculators') || isActive('/calculator') ? 'text-blue-700' : 'text-gray-800 hover:text-blue-600'}
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === 'calculators'}
                  aria-controls="desktop-calculators-menu"
                  aria-label="Toggle Calculators submenu"
                  onClick={() => {
                    clearCloseTimeout();
                    setActiveDropdown((prev) => (prev === 'calculators' ? null : 'calculators'));
                  }}
                  onFocus={() => openDropdown('calculators')}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      closeDropdownImmediately();
                      (event.currentTarget as HTMLButtonElement).blur();
                    }
                  }}
                >
                  <Icon name="ChevronDown" size={16} className={activeDropdown === 'calculators' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
              </div>
              <div
                id="desktop-calculators-menu"
                className={`${dropdownPanelClass} ${activeDropdown === 'calculators' ? 'block' : 'hidden'}`}
                role="menu"
                aria-label="Calculators"
                onMouseEnter={clearCloseTimeout}
                onMouseLeave={scheduleDropdownClose}
              >
                {calculatorLinks.map((item) => (
                  <Link key={item.href} href={item.href!} className={dropdownLinkClass} role="menuitem">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/about" className={navLinkClass(isActive('/about'))}>
              About
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
              className="bg-orange-600 hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Free Estimate
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

              <div>
                <div className="flex w-full items-center justify-between py-2">
                  <Link href="/services" className="text-left text-lg font-semibold text-black hover:text-blue-700">
                    Services
                  </Link>
                  <button
                    type="button"
                    className="p-1 text-black"
                    onClick={() => setMobileServicesOpen((prev) => !prev)}
                    aria-expanded={mobileServicesOpen}
                    aria-controls="mobile-services-menu"
                    aria-label="Toggle Services submenu"
                  >
                    <Icon name="ChevronDown" size={18} className={mobileServicesOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                </div>
                {mobileServicesOpen && (
                  <div id="mobile-services-menu" className="mt-1 space-y-1 border-l border-gray-200 pl-4">
                    {serviceLinks.map((item) => {
                      // Render group with sub-items
                      if (item.subItems) {
                        return (
                          <div key={item.label} className="py-1">
                            <div className="py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              {item.label}
                            </div>
                            {item.subItems.map((subItem) => (
                              <Link
                                key={`${subItem.label}-${subItem.href}-mobile`}
                                href={subItem.href!}
                                className="block py-1.5 pl-3 text-gray-700 hover:text-blue-700"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        );
                      }
                      // Render regular link
                      return (
                        <Link key={`${item.label}-${item.href}-mobile`} href={item.href!} className="block py-1.5 text-gray-700 hover:text-blue-700">
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <div className="flex w-full items-center justify-between py-2">
                  <Link href="/locations" className="text-left text-lg font-semibold text-black hover:text-blue-700">
                    Areas Served
                  </Link>
                  <button
                    type="button"
                    className="p-1 text-black"
                    onClick={() => setMobileAreasOpen((prev) => !prev)}
                    aria-expanded={mobileAreasOpen}
                    aria-controls="mobile-areas-menu"
                    aria-label="Toggle Areas Served submenu"
                  >
                    <Icon name="ChevronDown" size={18} className={mobileAreasOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                </div>
                {mobileAreasOpen && (
                  <div id="mobile-areas-menu" className="mt-1 space-y-1 border-l border-gray-200 pl-4">
                    {areaLinks.map((item) => (
                      <Link key={`${item.href}-mobile`} href={item.href!} className="block py-1.5 text-gray-700 hover:text-blue-700">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/projects" className="py-2 text-lg font-semibold text-black hover:text-blue-700">
                Projects
              </Link>

              <div>
                <div className="flex w-full items-center justify-between py-2">
                  <Link href="/cost" className="text-left text-lg font-semibold text-black hover:text-blue-700">
                    Pricing Guide
                  </Link>
                  <button
                    type="button"
                    className="p-1 text-black"
                    onClick={() => setMobilePricingOpen((prev) => !prev)}
                    aria-expanded={mobilePricingOpen}
                    aria-controls="mobile-pricing-menu"
                    aria-label="Toggle Pricing Guide submenu"
                  >
                    <Icon name="ChevronDown" size={18} className={mobilePricingOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                </div>
                {mobilePricingOpen && (
                  <div id="mobile-pricing-menu" className="mt-1 space-y-1 border-l border-gray-200 pl-4">
                    {pricingLinks.map((item) => (
                      <Link key={`${item.href}-mobile`} href={item.href!} className="block py-1.5 text-gray-700 hover:text-blue-700">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex w-full items-center justify-between py-2">
                  <Link href="/calculators" className="text-left text-lg font-semibold text-black hover:text-blue-700">
                    Calculators
                  </Link>
                  <button
                    type="button"
                    className="p-1 text-black"
                    onClick={() => setMobileCalculatorsOpen((prev) => !prev)}
                    aria-expanded={mobileCalculatorsOpen}
                    aria-controls="mobile-calculators-menu"
                    aria-label="Toggle Calculators submenu"
                  >
                    <Icon name="ChevronDown" size={18} className={mobileCalculatorsOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                </div>
                {mobileCalculatorsOpen && (
                  <div id="mobile-calculators-menu" className="mt-1 space-y-1 border-l border-gray-200 pl-4">
                    {calculatorLinks.map((item) => (
                      <Link key={`${item.href}-mobile`} href={item.href!} className="block py-1.5 text-gray-700 hover:text-blue-700">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/about" className="py-2 text-lg font-semibold text-black hover:text-blue-700">
                About
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
