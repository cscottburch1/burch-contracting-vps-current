'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  backButton?: {
    label: string;
    href: string;
  };
  actions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  breadcrumbs,
  backButton,
  actions,
  secondaryActions
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {item.href ? (
                <Link href={item.href} className="hover:text-blue-600 transition">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-semibold">{item.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Main Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Back Button */}
          {backButton && (
            <Link
              href={backButton.href}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-3 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{backButton.label}</span>
            </Link>
          )}

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
            {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
          </div>
        </div>

        {/* Actions */}
        {(actions || secondaryActions) && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
            {secondaryActions}
          </div>
        )}
      </div>
    </div>
  );
}
