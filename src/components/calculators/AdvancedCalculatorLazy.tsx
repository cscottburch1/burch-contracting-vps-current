'use client';

/**
 * Lazy-loadable wrapper for AdvancedCalculator
 * This ensures the calculator and its heavy PDF dependencies (html2canvas + jsPDF)
 * only load when actually needed, improving initial page load performance.
 * 
 * Usage:
 *   import AdvancedCalculatorLazy from '@/components/calculators/AdvancedCalculatorLazy';
 *   
 *   <AdvancedCalculatorLazy
 *     result={calculatorResult}
 *     onSave={handleSave}
 *     onPrint={handlePrint}
 *   />
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Dynamic import with no SSR - calculator only renders client-side
const AdvancedCalculatorLazy = dynamic<any>(
  () => import('./AdvancedCalculator').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading calculator...</p>
        </div>
      </div>
    )
  }
);

export default AdvancedCalculatorLazy;
