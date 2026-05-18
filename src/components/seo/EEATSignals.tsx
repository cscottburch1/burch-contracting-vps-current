'use client';

import React from 'react';
import { Icon } from '../ui/Icon';
import { businessConfig } from '@/config/business';

interface EEATSignalsProps {
  variant?: 'full' | 'compact' | 'minimal';
  showCredentials?: boolean;
  showGoogleRating?: boolean;
  showBBB?: boolean;
  showExperience?: boolean;
  showLicensing?: boolean;
  className?: string;
}

export const EEATSignals: React.FC<EEATSignalsProps> = ({
  variant = 'full',
  showCredentials = true,
  showGoogleRating = true,
  showBBB = true,
  showExperience = true,
  showLicensing = true,
  className = ''
}) => {
  // Fixed to 35+ years for consistent E-E-A-T messaging across all pages
  const yearsInBusiness = 35;

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-4 text-sm text-gray-600 ${className}`}>
        <div className="flex items-center gap-1">
          <Icon name="Award" size={16} className="text-blue-600" />
          <span>BBB A+</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Star" size={16} className="text-yellow-500" />
          <span>5.0 Rating</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Calendar" size={16} className="text-gray-700" />
          <span>{yearsInBusiness}+ Years</span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {showBBB && (
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">A+</div>
              <div className="text-xs text-gray-600">BBB Rating</div>
              <div className="text-xs text-gray-500">Since 2014</div>
            </div>
          )}
          {showGoogleRating && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="text-2xl font-bold text-yellow-600">5.0</div>
                <Icon name="Star" size={16} className="text-yellow-500" />
              </div>
              <div className="text-xs text-gray-600">Google Rating</div>
              <div className="text-xs text-gray-500">Verified Reviews</div>
            </div>
          )}
          {showExperience && (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{yearsInBusiness}+</div>
              <div className="text-xs text-gray-600">Years Experience</div>
              <div className="text-xs text-gray-500">Est. 1995</div>
            </div>
          )}
          {showLicensing && (
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-gray-700" />
              </div>
              <div className="text-xs text-gray-600 mt-1">Licensed & Insured</div>
              <div className="text-xs text-gray-500">Fully Certified</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-linear-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6 shadow-sm ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Trusted Expertise You Can Count On
        </h3>
        <p className="text-sm text-gray-600">
          Burch Contracting brings decades of professional construction experience to every project
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* BBB A+ Rating */}
        {showBBB && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="Award" size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">A+</div>
                <div className="text-xs text-gray-500">BBB Rating</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Better Business Bureau A+ rating since 2014
            </p>
          </div>
        )}

        {/* Google Rating */}
        {showGoogleRating && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Icon name="Star" size={24} className="text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">5.0</div>
                <div className="text-xs text-gray-500">Google Rating</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Perfect 5-star rating from hundreds of verified customer reviews
            </p>
          </div>
        )}

        {/* Experience */}
        {showExperience && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="Calendar" size={24} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{yearsInBusiness}+</div>
                <div className="text-xs text-gray-500">Years Experience</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Family-owned and operated since 1995, serving Upstate SC with excellence
            </p>
          </div>
        )}

        {/* Licensing */}
        {showLicensing && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-gray-700" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800">Licensed</div>
                <div className="text-xs text-gray-500">& Insured</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Fully licensed, bonded, and insured for your complete protection
            </p>
          </div>
        )}
      </div>

      {/* Credentials List */}
      {showCredentials && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Licensed General Contractor</strong> - SC State Licensed
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Fully Insured</strong> - General Liability & Workers Comp
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>BBB A+ Rating</strong> - Since 2014
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Google Verified</strong> - 5.0 Star Business
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Local Family Business</strong> - {yearsInBusiness}+ Years in Upstate SC
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Written Warranties</strong> - All Work Guaranteed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Contact CTA */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Questions about our credentials?{' '}
          <a 
            href={`tel:${businessConfig.contact.phone.replace(/\D/g, '')}`}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Call us at {businessConfig.contact.phone}
          </a>
        </p>
      </div>
    </div>
  );
};

export default EEATSignals;
