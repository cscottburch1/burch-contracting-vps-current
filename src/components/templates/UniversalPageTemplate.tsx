'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '../ui/Icon';
import { EEATSignals } from '../seo/EEATSignals';
import { businessConfig } from '@/config/business';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AuthorInfo {
  name: string;
  role: string;
  experience: string;
  avatar?: string;
}

interface UniversalPageTemplateProps {
  children: React.ReactNode;
  
  // Page metadata
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  
  // E-E-A-T signals
  showAuthor?: boolean;
  author?: AuthorInfo;
  showCredentials?: boolean;
  credentialsVariant?: 'full' | 'compact' | 'minimal';
  lastUpdated?: Date;
  
  // Related content
  relatedPages?: {
    title: string;
    href: string;
    description?: string;
  }[];
  
  // CTA
  showCTA?: boolean;
  ctaTitle?: string;
  ctaDescription?: string;
  
  // Schema
  schemaType?: 'Service' | 'Article' | 'Product';

  // Layout options
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;

  // Calculator / full-bleed page options
  hideTitle?: boolean;   // Suppress the template h1 (use when child component owns the h1)
  rawContent?: boolean;  // Render children full-width, outside the white content box
}

export const UniversalPageTemplate: React.FC<UniversalPageTemplateProps> = ({
  children,
  title,
  description,
  breadcrumbs,
  showAuthor = false,
  author,
  showCredentials = true,
  credentialsVariant = 'compact',
  lastUpdated,
  relatedPages = [],
  showCTA = true,
  ctaTitle = 'Ready to Start Your Project?',
  ctaDescription = 'Get a free estimate from Upstate SC\'s most trusted contractor',
  schemaType,
  maxWidth = 'xl',
  className = '',
  hideTitle = false,
  rawContent = false,
}) => {
  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  }[maxWidth];

  const defaultAuthor: AuthorInfo = {
    name: 'Scott Burch',
    role: 'Owner & Lead Contractor',
    experience: '35+ years experience in residential construction'
  };

  const authorInfo = author || defaultAuthor;

  const breadcrumbsEl = breadcrumbs && breadcrumbs.length > 0 && (
    <div className="bg-white border-b border-gray-200 print:hidden">
      <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-3`}>
        <nav className="flex items-center gap-2 text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            <Icon name="Home" size={14} />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <Icon name="ChevronRight" size={12} className="text-gray-400" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );

  const metaHeaderEl = (!hideTitle || showAuthor || showCredentials) && (
    <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4`}>
      {!hideTitle && (
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-gray-600 mb-6">{description}</p>
          )}
        </header>
      )}

      {showAuthor && (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 mb-6">
          {authorInfo.avatar ? (
            <img src={authorInfo.avatar} alt={authorInfo.name} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon name="User" size={24} className="text-blue-600" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{authorInfo.name}</p>
            <p className="text-sm text-gray-600">{authorInfo.role}</p>
            <p className="text-xs text-gray-500">{authorInfo.experience}</p>
          </div>
          {lastUpdated && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Last updated</p>
              <p className="text-sm text-gray-700">
                {lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      )}

      {showCredentials && (
        <div className="mb-4">
          <EEATSignals variant={credentialsVariant} />
        </div>
      )}
    </div>
  );

  const relatedAndFooterEl = (
    <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
      {relatedPages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedPages.map((page, index) => (
              <Link
                key={index}
                href={page.href}
                className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 flex items-center justify-between">
                  {page.title}
                  <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                </h3>
                {page.description && <p className="text-sm text-gray-600">{page.description}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}

      {showCTA && (
        <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{ctaTitle}</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">{ctaDescription}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <Icon name="FileText" size={20} />
              Request Free Estimate
            </a>
            <a
              href={`tel:${businessConfig.contact.phone.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border-2 border-white"
            >
              <Icon name="Phone" size={20} />
              {businessConfig.contact.phone}
            </a>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-1"><Icon name="Award" size={16} /><span>BBB A+ Rated</span></div>
            <div className="flex items-center gap-1"><Icon name="Star" size={16} /><span>5.0 Google Rating</span></div>
            <div className="flex items-center gap-1"><Icon name="Shield" size={16} /><span>Licensed & Insured</span></div>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white rounded-full px-6 py-3 border border-gray-200">
          <Icon name="MapPin" size={16} className="text-blue-600" />
          <span>Proudly serving Upstate SC since 1995</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {breadcrumbsEl}

      {rawContent ? (
        <>
          {metaHeaderEl}
          {children}
          {relatedAndFooterEl}
        </>
      ) : (
        <main className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12`}>
          {!hideTitle && (
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
              {description && <p className="text-lg md:text-xl text-gray-600 mb-6">{description}</p>}

              {showAuthor && (
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  {authorInfo.avatar ? (
                    <img src={authorInfo.avatar} alt={authorInfo.name} className="w-12 h-12 rounded-full" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon name="User" size={24} className="text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{authorInfo.name}</p>
                    <p className="text-sm text-gray-600">{authorInfo.role}</p>
                    <p className="text-xs text-gray-500">{authorInfo.experience}</p>
                  </div>
                  {lastUpdated && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Last updated</p>
                      <p className="text-sm text-gray-700">
                        {lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </header>
          )}

          {showCredentials && (
            <div className="mb-8">
              <EEATSignals variant={credentialsVariant} />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
            {children}
          </div>

          {relatedPages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPages.map((page, index) => (
                  <Link
                    key={index}
                    href={page.href}
                    className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 flex items-center justify-between">
                      {page.title}
                      <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                    </h3>
                    {page.description && <p className="text-sm text-gray-600">{page.description}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {showCTA && (
            <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{ctaTitle}</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">{ctaDescription}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  <Icon name="FileText" size={20} />
                  Request Free Estimate
                </a>
                <a href={`tel:${businessConfig.contact.phone.replace(/\D/g, '')}`} className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border-2 border-white">
                  <Icon name="Phone" size={20} />
                  {businessConfig.contact.phone}
                </a>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-1"><Icon name="Award" size={16} /><span>BBB A+ Rated</span></div>
                <div className="flex items-center gap-1"><Icon name="Star" size={16} /><span>5.0 Google Rating</span></div>
                <div className="flex items-center gap-1"><Icon name="Shield" size={16} /><span>Licensed & Insured</span></div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white rounded-full px-6 py-3 border border-gray-200">
              <Icon name="MapPin" size={16} className="text-blue-600" />
              <span>Proudly serving Upstate SC since 1995</span>
            </div>
          </div>
        </main>
      )}

      {/* Schema Markup */}
      {schemaType && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': schemaType,
              name: title,
              description: description,
              provider: {
                '@type': 'LocalBusiness',
                name: businessConfig.name,
                telephone: businessConfig.contact.phone,
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: businessConfig.contact.address,
                  addressLocality: businessConfig.contact.city,
                  addressRegion: businessConfig.contact.state,
                  postalCode: businessConfig.contact.zip
                }
              },
              ...(lastUpdated && { dateModified: lastUpdated.toISOString() }),
              ...(showAuthor && {
                author: {
                  '@type': 'Person',
                  name: authorInfo.name,
                  jobTitle: authorInfo.role
                }
              })
            })
          }}
        />
      )}
    </div>
  );
};

export default UniversalPageTemplate;
