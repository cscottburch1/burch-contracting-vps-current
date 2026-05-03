'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type ProjectType = 'office' | 'retail' | 'medical' | 'restaurant';
type Quality = 'standard' | 'premium';

const rates: Record<ProjectType, Record<Quality, { low: number; high: number }>> = {
  office: { standard: { low: 50, high: 65 }, premium: { low: 65, high: 95 } },
  retail: { standard: { low: 45, high: 65 }, premium: { low: 65, high: 110 } },
  medical: { standard: { low: 70, high: 95 }, premium: { low: 95, high: 140 } },
  restaurant: { standard: { low: 85, high: 110 }, premium: { low: 110, high: 180 } },
};

const projectLabels: Record<ProjectType, string> = {
  office: 'Office Build-Out',
  retail: 'Retail Upfit',
  medical: 'Medical Office',
  restaurant: 'Restaurant Fit-Out',
};

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function CommercialMiniCalculator() {
  const [sqft, setSqft] = useState<string>('2000');
  const [projectType, setProjectType] = useState<ProjectType>('office');
  const [quality, setQuality] = useState<Quality>('standard');
  const [showResult, setShowResult] = useState(false);

  const sqftNum = parseInt(sqft, 10) || 0;
  const rate = rates[projectType][quality];
  const low = sqftNum * rate.low;
  const high = sqftNum * rate.high;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-blue-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Commercial Tenant Improvement Cost Estimator</h2>
        <p className="text-blue-100 text-sm mt-1">Based on 47 completed projects in Upstate SC (2025–2026 pricing)</p>
      </div>

      <form onSubmit={handleCalculate} className="p-6 space-y-4">
        {/* Project Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Project Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(projectLabels) as ProjectType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setProjectType(t); setShowResult(false); }}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  projectType === t
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {projectLabels[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Sq Ft */}
        <div>
          <label htmlFor="comm-sqft" className="block text-sm font-semibold text-gray-700 mb-2">
            Square Footage
          </label>
          <input
            id="comm-sqft"
            type="number"
            min="200"
            max="50000"
            step="100"
            value={sqft}
            onChange={(e) => { setSqft(e.target.value); setShowResult(false); }}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
            placeholder="e.g. 2000"
          />
        </div>

        {/* Quality */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Finish Level</label>
          <div className="flex gap-3">
            {(['standard', 'premium'] as Quality[]).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => { setQuality(q); setShowResult(false); }}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                  quality === q
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {q === 'standard' ? 'Standard' : 'Premium'}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calculate Estimate
        </button>
      </form>

      {/* Result */}
      {showResult && sqftNum > 0 && (
        <div className="border-t border-gray-200 bg-blue-50 px-6 py-5">
          <p className="text-sm text-gray-600 mb-1">{projectLabels[projectType]} · {sqftNum.toLocaleString()} sq ft · {quality === 'standard' ? 'Standard' : 'Premium'} finish</p>
          <div className="text-3xl font-bold text-blue-700">
            {fmt(low)} – {fmt(high)}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Estimate range: {fmt(rate.low)}/sqft – {fmt(rate.high)}/sqft. Includes labor, materials, and typical trade coordination. Permits ({fmt(800)}–{fmt(2500)}) billed separately.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/calculator/commercial-renovations"
              className="flex-1 text-center bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Full Line-Item Calculator →
            </Link>
            <Link
              href="/contact"
              className="flex-1 text-center border border-blue-700 text-blue-700 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Request Free Estimate
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
