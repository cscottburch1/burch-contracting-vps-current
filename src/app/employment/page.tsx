'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import React from 'react';

export default function EmploymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Employment Opportunities
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our team and become part of a growing contracting company serving the Upstate South Carolina area.
          </p>
        </div>

        {/* Two Button Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Subcontractors Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
                <Icon name="Briefcase" size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Subcontractors
              </h2>
              <p className="text-gray-600 mb-6">
                Partner with us as a subcontractor. Access projects, bid opportunities, and collaboration tools.
              </p>
            </div>

            <ul className="space-y-2 mb-8 text-gray-700">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Project management tools</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Bid on new opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Schedule management</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Documentation portal</span>
              </li>
            </ul>

            <Button href="/subcontractors/join" variant="primary" fullWidth>
              Explore Subcontractor Opportunities
            </Button>
          </div>

          {/* Direct Hire Employees Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4">
                <Icon name="Users" size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Direct Hire Employees
              </h2>
              <p className="text-gray-600 mb-6">
                Join our team as a full-time or part-time employee. Build a career with a reliable, growing company.
              </p>
            </div>

            <ul className="space-y-2 mb-8 text-gray-700">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Competitive wages</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Benefits package</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Professional growth</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Steady work schedule</span>
              </li>
            </ul>

            <Button href="/employment/direct-hire" variant="primary" fullWidth className="bg-green-600 hover:bg-green-700">
              Apply for Direct Hire Position
            </Button>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Why Work With Burch Contracting?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Established Reputation</h4>
              <p className="text-gray-600">
                Serving Upstate South Carolina with integrity and quality craftsmanship for years.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Growth Opportunities</h4>
              <p className="text-gray-600">
                Expand your skills and advance your career with our growing team.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Local Partnership</h4>
              <p className="text-gray-600">
                Be part of a community-focused company that values strong relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
