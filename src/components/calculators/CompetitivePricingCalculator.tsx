'use client';

import { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon, { type IconName } from '@/components/ui/Icon';
import { siteConfig } from '@/lib/seo/site';
import { PRICING_CONFIG, PRICING_LAST_UPDATED, type LocationKey, type ServiceKey } from '@/lib/pricing/pricingConfig';
import { calculateProjectCost, formatCurrency, formatPercentage } from '@/lib/pricing/calculatorEngine';

// Human-readable descriptions for each factor key
const FACTOR_DESCRIPTIONS: Record<string, string> = {
  // Material levels
  standard: 'Contractor-grade, solid value',
  upgraded: 'Quality mid-range materials',
  premium: 'Architectural or luxury grade',
  builder: 'Basic contractor-grade',
  // Complexity
  simple: 'Standard layout, no special features',
  moderate: 'Custom angles or added elements',
  complex: 'Multi-level, curves, or built-ins',
  // Site conditions
  flat: 'Level site, easy equipment access',
  slope: 'Sloped yard or moderate grading',
  challenging: 'Steep slope or restricted access',
  existingStructure: 'Adding to an existing structure',
  newConstruction: 'Full new ground-up construction',
  structuralChallenges: 'Complex roof or foundation tie-in',
  straightforward: 'Level site, standard access',
  difficult: 'Major structural work required',
};

// Typical SF ranges per service for the range hint
const SF_HINTS: Partial<Record<ServiceKey, { min: number; max: number }>> = {
  decks: { min: 100, max: 800 },
  screenedPorches: { min: 100, max: 600 },
  garages: { min: 400, max: 1200 },
  homeAdditions: { min: 200, max: 1000 },
};

// Per-unit adders that need a quantity input from the user
function needsQty(unit: string): boolean {
  const u = unit.toLowerCase();
  return u.includes('linear') || u.includes('foot') || u.includes('feet') || u.includes(' sf') || u.includes('per sf') || u.includes('fixture') || u.includes('fan') || u.includes('opening');
}

interface CompetitivePricingCalculatorProps {
  serviceKey: ServiceKey;
  title: string;
  intro: string;
  icon: IconName;
  marketArea: string;
}

export default function CompetitivePricingCalculator({
  serviceKey,
  title,
  intro,
  icon,
  marketArea,
}: CompetitivePricingCalculatorProps) {
  const serviceConfig = PRICING_CONFIG.services[serviceKey];

  const projectOptions = Object.entries(serviceConfig.baseRates).map(([id, config]) => ({
    id,
    label: config.label,
    directCost: config.directCost,
    description: config.description,
  }));

  const sfHint = SF_HINTS[serviceKey];

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectOptions[0]?.id ?? '');
  const defaultSF = sfHint ? Math.round((sfHint.min + sfHint.max) / 2 / 50) * 50 : 250;
  const [squareFootage, setSquareFootage] = useState<number>(defaultSF);
  const [sqftInput, setSqftInput] = useState<string>(String(defaultSF));
  const [locationKey, setLocationKey] = useState<LocationKey>('fountainInnArea');
  const [materialFactor, setMaterialFactor] = useState<number>(1.0);
  const [complexityFactor, setComplexityFactor] = useState<number>(1.0);
  const [siteConditionFactor, setSiteConditionFactor] = useState<number>(1.0);
  // Map<adderIndex, quantity>
  const [adderQuantities, setAdderQuantities] = useState<Map<number, number>>(new Map());
  const [showDetailedMath, setShowDetailedMath] = useState<boolean>(false);

  const selectedProject = projectOptions.find(p => p.id === selectedProjectId) ?? projectOptions[0];
  const locationConfig = PRICING_CONFIG.locationFactors[locationKey];

  const addersTotal = (() => {
    if (!serviceConfig.adders) return 0;
    return Array.from(adderQuantities.entries()).reduce((sum, [index, qty]) => {
      const adder = serviceConfig.adders![index];
      return sum + (adder?.cost ?? 0) * qty;
    }, 0);
  })();

  const results = calculateProjectCost({
    squareFootage,
    baseDirectCost: selectedProject.directCost,
    locationFactor: locationConfig.factor,
    materialFactor,
    complexityFactor,
    siteConditionFactor,
    adders: addersTotal,
    overheadAndProfit: PRICING_CONFIG.defaultOverheadAndProfit,
  });

  function toggleAdder(index: number) {
    const next = new Map(adderQuantities);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.set(index, 1);
    }
    setAdderQuantities(next);
  }

  function setAdderQty(index: number, qty: number) {
    const next = new Map(adderQuantities);
    if (qty <= 0) {
      next.delete(index);
    } else {
      next.set(index, qty);
    }
    setAdderQuantities(next);
  }

  const oAndPRate = PRICING_CONFIG.defaultOverheadAndProfit;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28 print:hidden">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_top,_white_0,_transparent_42%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Icon name={icon} size={34} className="text-cyan-200" />
            </div>
            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
            <p className="max-w-2xl text-lg text-blue-100 md:text-xl">{intro}</p>
            <div className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-50">
              Competitive local pricing for {marketArea} — transparent {formatPercentage(oAndPRate)} overhead &amp; profit.
            </div>
          </div>
        </div>
      </section>

      {/* Main Calculator */}
      <Section background="gray" padding="lg" className="pb-28 lg:pb-12">
        <div className="mx-auto max-w-7xl">
          {/* Temporal freshness */}
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50 print:hidden">
            <div className="flex items-center gap-3">
              <Icon name="Calendar" size={22} className="text-blue-600" />
              <p className="text-sm font-semibold text-blue-900">
                <strong>Pricing data updated:</strong> {new Date(PRICING_LAST_UPDATED).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — reflects current Upstate SC market rates, material costs, and labor pricing.
              </p>
            </div>
          </Card>

          {/* Disclaimer */}
          <Card className="mb-8 border-2 border-amber-200 bg-amber-50 print:hidden">
            <div className="flex gap-3">
              <Icon name="AlertCircle" size={22} className="mt-1 shrink-0 text-amber-600" />
              <div>
                <h2 className="mb-2 text-lg font-bold text-amber-950">Budget Planning Tool</h2>
                <p className="text-sm leading-relaxed text-amber-900">
                  This calculator uses local market pricing with transparent {formatPercentage(oAndPRate)} overhead and profit. Final pricing depends on actual site conditions, material selections, permit requirements, and scope verification. Use as a planning range, then schedule a site visit for a detailed written estimate.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            {/* Left: Inputs */}
            <div className="space-y-6 print:hidden">

              {/* Project Type */}
              <Card>
                <h2 className="mb-5 text-2xl font-bold text-gray-900">Choose Your Project Type</h2>
                <div className="space-y-3">
                  {projectOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedProjectId(option.id)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition ${
                        selectedProjectId === option.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{option.label}</h3>
                          <p className="mt-1 text-sm text-gray-600">{option.description}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-xs uppercase tracking-wide text-gray-500">Base rate</div>
                          <div className="text-lg font-bold text-gray-900">{formatCurrency(option.directCost)}</div>
                          <div className="text-xs text-gray-500">per SF</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Size & Location */}
              <Card>
                <h2 className="mb-5 text-2xl font-bold text-gray-900">Size &amp; Location</h2>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Project Size (square feet)
                </label>
                {sfHint && (
                  <p className="mb-2 text-xs text-gray-500">
                    Typical range: {sfHint.min.toLocaleString()}–{sfHint.max.toLocaleString()} SF
                  </p>
                )}
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={sqftInput}
                  onChange={(e) => {
                    setSqftInput(e.target.value);
                    const n = Number(e.target.value);
                    if (n >= 1) setSquareFootage(n);
                  }}
                  onBlur={() => {
                    const n = Number(sqftInput);
                    if (!sqftInput || n < 1) setSqftInput(String(squareFootage));
                  }}
                  className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none"
                />

                <label className="mb-2 block text-sm font-semibold text-gray-700">Project Location</label>
                <div className="space-y-2">
                  {(Object.keys(PRICING_CONFIG.locationFactors) as LocationKey[]).map((key) => {
                    const loc = PRICING_CONFIG.locationFactors[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setLocationKey(key)}
                        className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                          locationKey === key
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold">{loc.name}</span>
                            <span className="ml-2 text-xs text-gray-500">({loc.cities.join(', ')})</span>
                          </div>
                          <span className="font-mono text-xs font-bold">{loc.factor.toFixed(2)}×</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Project Factors */}
              <Card>
                <h2 className="mb-5 text-2xl font-bold text-gray-900">Project Factors</h2>

                {/* Material */}
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Material Level</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {Object.entries(serviceConfig.materialFactors).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setMaterialFactor(value as number)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                          materialFactor === value
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-medium capitalize">{key}</div>
                        <div className="text-xs text-gray-500">{FACTOR_DESCRIPTIONS[key] ?? `${(value as number).toFixed(2)}×`}</div>
                        <div className="font-mono text-xs font-bold mt-0.5">{(value as number).toFixed(2)}×</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Complexity */}
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Project Complexity</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {Object.entries(serviceConfig.complexityFactors).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setComplexityFactor(value as number)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                          complexityFactor === value
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-medium capitalize">{key}</div>
                        <div className="text-xs text-gray-500">{FACTOR_DESCRIPTIONS[key] ?? `${(value as number).toFixed(2)}×`}</div>
                        <div className="font-mono text-xs font-bold mt-0.5">{(value as number).toFixed(2)}×</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Site Conditions */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Site Conditions</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {Object.entries(serviceConfig.siteConditionFactors).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSiteConditionFactor(value as number)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                          siteConditionFactor === value
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-medium capitalize">{key}</div>
                        <div className="text-xs text-gray-500">{FACTOR_DESCRIPTIONS[key] ?? `${(value as number).toFixed(2)}×`}</div>
                        <div className="font-mono text-xs font-bold mt-0.5">{(value as number).toFixed(2)}×</div>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Optional Add-Ons */}
              {serviceConfig.adders && serviceConfig.adders.length > 0 && (
                <Card>
                  <h2 className="mb-5 text-2xl font-bold text-gray-900">Optional Add-Ons</h2>
                  <div className="space-y-3">
                    {serviceConfig.adders.map((adder, index) => {
                      const isChecked = adderQuantities.has(index);
                      const qty = adderQuantities.get(index) ?? 1;
                      const quantityBased = needsQty(adder.unit);
                      return (
                        <div
                          key={index}
                          className={`rounded-lg border p-3 transition ${isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        >
                          <label className="flex cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleAdder(index)}
                              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{adder.label}</div>
                              <div className="text-xs text-gray-500">{formatCurrency(adder.cost)} {adder.unit}</div>
                            </div>
                            <div className="text-right font-bold text-gray-900">
                              +{formatCurrency(adder.cost * (isChecked && quantityBased ? qty : 1))}
                            </div>
                          </label>
                          {isChecked && quantityBased && (
                            <div className="mt-2 ml-8 flex items-center gap-2">
                              <label className="text-xs text-gray-600 whitespace-nowrap">Qty ({adder.unit}):</label>
                              <input
                                type="number"
                                min="1"
                                value={qty}
                                onChange={(e) => setAdderQty(index, Math.max(1, Number(e.target.value) || 1))}
                                className="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {adderQuantities.size > 0 && (
                    <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm">
                      <strong>Total Add-Ons:</strong> {formatCurrency(addersTotal)}
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Right: Results */}
            <div>
              <Card className="sticky top-6">
                <h2 className="mb-5 text-2xl font-bold text-gray-900">Your Estimate</h2>

                {/* Selected Project Summary */}
                <div className="mb-6 rounded-xl bg-blue-50 p-4">
                  <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">Selected Project</div>
                  <div className="mt-1 text-lg font-bold text-gray-900">{selectedProject.label}</div>
                  <div className="mt-1 text-sm text-gray-600">{squareFootage.toLocaleString()} SF</div>
                  <div className="mt-1 text-xs text-gray-500">{locationConfig.name}</div>
                </div>

                {/* Pricing Ranges */}
                <div className="mb-6 space-y-3">
                  <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Budget-Conscious</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(results.budgetLow)}</div>
                    <div className="text-xs text-gray-500">Conservative estimate (×0.93)</div>
                  </div>
                  <div className="rounded-xl border-2 border-blue-600 bg-blue-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-blue-700">Most Common</div>
                    <div className="text-3xl font-bold text-blue-900">{formatCurrency(results.mostCommon)}</div>
                    <div className="text-xs text-blue-600">Typical project outcome</div>
                  </div>
                  <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Custom/High-End</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(results.customHigh)}</div>
                    <div className="text-xs text-gray-500">Premium selections (×1.12)</div>
                  </div>
                </div>

                {/* Line-item breakdown */}
                <div className="mb-6 space-y-2 border-t border-gray-200 pt-4 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Direct Cost ({squareFootage} SF × {formatCurrency(selectedProject.directCost)}/SF)</span>
                    <strong>{formatCurrency(results.directCost)}</strong>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Location ({locationConfig.factor.toFixed(2)}×)</span>
                    <span className="font-mono text-xs">applied</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Materials ({materialFactor.toFixed(2)}×)</span>
                    <span className="font-mono text-xs">applied</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Complexity ({complexityFactor.toFixed(2)}×)</span>
                    <span className="font-mono text-xs">applied</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Site Conditions ({siteConditionFactor.toFixed(2)}×)</span>
                    <span className="font-mono text-xs">applied</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-gray-700">
                    <span>Adjusted Direct Cost</span>
                    <strong>{formatCurrency(results.adjustedDirectCost)}</strong>
                  </div>
                  {addersTotal > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Add-Ons</span>
                      <strong>+{formatCurrency(addersTotal)}</strong>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <strong>{formatCurrency(results.subtotalBeforeOP)}</strong>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Overhead &amp; Profit ({formatPercentage(oAndPRate)})</span>
                    <strong>+{formatCurrency(results.breakdown.overheadAndProfitAmount)}</strong>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-3 text-base font-bold text-gray-900">
                    <span>Final Investment</span>
                    <span>{formatCurrency(results.finalPrice)}</span>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="mb-6 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                  Planning estimate only. Actual pricing depends on site inspection, material selections, structural requirements, and scope verification.
                </p>

                {/* Detailed Math Toggle */}
                <button
                  type="button"
                  onClick={() => setShowDetailedMath(!showDetailedMath)}
                  className="mb-4 w-full rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-left font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <span>{showDetailedMath ? 'Hide' : 'Show'} Detailed Math &amp; Assumptions</span>
                    <Icon name={showDetailedMath ? 'ChevronUp' : 'ChevronDown'} size={20} />
                  </div>
                </button>

                {showDetailedMath && (
                  <div className="mb-6 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
                    <h3 className="font-bold text-gray-900">Line-by-Line Calculation</h3>
                    <div className="space-y-2 border-t border-gray-300 pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">1. Base Direct Cost</span>
                        <span className="font-mono">{formatCurrency(selectedProject.directCost)}/SF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">2. Project Size</span>
                        <span className="font-mono">{squareFootage.toLocaleString()} SF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">3. Initial Direct Cost</span>
                        <span className="font-mono">{formatCurrency(squareFootage * selectedProject.directCost)}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2 font-semibold text-gray-700">Adjustment Factors:</div>
                      <div className="flex justify-between pl-4">
                        <span className="text-gray-600">• Location ({locationConfig.name})</span>
                        <span className="font-mono">{locationConfig.factor.toFixed(2)}×</span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <span className="text-gray-600">• Material Level</span>
                        <span className="font-mono">{materialFactor.toFixed(2)}×</span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <span className="text-gray-600">• Project Complexity</span>
                        <span className="font-mono">{complexityFactor.toFixed(2)}×</span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <span className="text-gray-600">• Site Conditions</span>
                        <span className="font-mono">{siteConditionFactor.toFixed(2)}×</span>
                      </div>
                      <div className="flex justify-between pl-4 font-semibold">
                        <span className="text-gray-700">Combined Multiplier</span>
                        <span className="font-mono">{(locationConfig.factor * materialFactor * complexityFactor * siteConditionFactor).toFixed(3)}×</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-2">
                        <span className="text-gray-600">4. Adjusted Direct Cost</span>
                        <span className="font-mono font-semibold">{formatCurrency(results.adjustedDirectCost)}</span>
                      </div>
                      {addersTotal > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">5. Optional Add-Ons</span>
                          <span className="font-mono">+{formatCurrency(addersTotal)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-gray-300 pt-2">
                        <span className="text-gray-600">{addersTotal > 0 ? '6' : '5'}. Subtotal Before Markup</span>
                        <span className="font-mono font-semibold">{formatCurrency(results.subtotalBeforeOP)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{addersTotal > 0 ? '7' : '6'}. Overhead &amp; Profit ({formatPercentage(oAndPRate)})</span>
                        <span className="font-mono">+{formatCurrency(results.breakdown.overheadAndProfitAmount)}</span>
                      </div>
                      <div className="flex justify-between border-t-2 border-blue-600 bg-blue-50 px-2 py-2 text-base font-bold text-blue-900">
                        <span>Final Investment (Most Common)</span>
                        <span>{formatCurrency(results.finalPrice)}</span>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-gray-300 pt-3">
                      <h4 className="mb-2 font-semibold text-gray-700">Additional Estimates:</h4>
                      <div className="flex justify-between text-gray-600">
                        <span>• Budget-Conscious (×0.93)</span>
                        <span className="font-mono">{formatCurrency(results.budgetLow)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>• Premium/High-End (×1.12)</span>
                        <span className="font-mono">{formatCurrency(results.customHigh)}</span>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                      <strong>Note:</strong> These calculations use market averages for planning. Actual costs will depend on site conditions, material selections, permit requirements, and final scope.
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button variant="primary" href="/contact" fullWidth>
                    <Icon name="ClipboardEdit" size={18} />
                    Get Your Free On-Site Estimate
                  </Button>
                  <Button variant="outline" href={siteConfig.phoneHref} fullWidth>
                    <Icon name="Phone" size={18} />
                    {siteConfig.phoneDisplay}
                  </Button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <Icon name="Printer" size={18} className="inline-block mr-2" />
                    Save / Print This Estimate
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Mobile floating estimate bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-blue-700 px-4 py-3 shadow-lg lg:hidden print:hidden">
        <div>
          <div className="text-xs text-blue-200">Most Common Estimate</div>
          <div className="text-xl font-bold text-white">{formatCurrency(results.mostCommon)}</div>
        </div>
        <a
          href="/contact"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
        >
          Get Free Quote
        </a>
      </div>
    </>
  );
}
