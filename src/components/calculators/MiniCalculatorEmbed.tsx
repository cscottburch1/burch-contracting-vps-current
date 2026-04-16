'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';

interface MiniCalculatorEmbedProps {
  serviceType: 'decks' | 'garages' | 'screened-porches' | 'room-additions' | 'kitchen-remodeling' | 'basement-finishing';
  title: string;
  description: string;
}

const calculatorPaths: Record<string, string> = {
  'decks': '/calculator/decks',
  'garages': '/calculator/garages',
  'screened-porches': '/calculator/screened-porches',
  'room-additions': '/calculator/room-additions',
  'kitchen-remodeling': '/calculator/kitchen-remodeling',
  'basement-finishing': '/calculator/basement-finishing',
};

const defaultSizes: Record<string, { min: number; max: number; default: number; unit: string }> = {
  'decks': { min: 100, max: 800, default: 300, unit: 'sq ft' },
  'garages': { min: 200, max: 1000, default: 400, unit: 'sq ft' },
  'screened-porches': { min: 100, max: 600, default: 250, unit: 'sq ft' },
  'room-additions': { min: 150, max: 800, default: 300, unit: 'sq ft' },
  'kitchen-remodeling': { min: 80, max: 400, default: 150, unit: 'sq ft' },
  'basement-finishing': { min: 400, max: 2000, default: 800, unit: 'sq ft' },
};

const baseRates: Record<string, { low: number; high: number }> = {
  'decks': { low: 35, high: 65 },
  'garages': { low: 45, high: 85 },
  'screened-porches': { low: 40, high: 70 },
  'room-additions': { low: 120, high: 220 },
  'kitchen-remodeling': { low: 150, high: 300 },
  'basement-finishing': { low: 60, high: 120 },
};

export default function MiniCalculatorEmbed({ serviceType, title, description }: MiniCalculatorEmbedProps) {
  const sizeConfig = defaultSizes[serviceType];
  const rates = baseRates[serviceType];
  const [size, setSize] = useState(sizeConfig.default);

  const lowEstimate = Math.round(size * rates.low);
  const highEstimate = Math.round(size * rates.high);
  const midEstimate = Math.round((lowEstimate + highEstimate) / 2);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        <div className="rounded-full bg-blue-600 p-3">
          <Icon name="Calculator" size={24} className="text-white" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Size Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Project Size
            </label>
            <span className="text-lg font-bold text-blue-700">
              {size.toLocaleString()} {sizeConfig.unit}
            </span>
          </div>
          <input
            type="range"
            min={sizeConfig.min}
            max={sizeConfig.max}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((size - sizeConfig.min) / (sizeConfig.max - sizeConfig.min)) * 100}%, #e5e7eb ${((size - sizeConfig.min) / (sizeConfig.max - sizeConfig.min)) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>{sizeConfig.min} {sizeConfig.unit}</span>
            <span>{sizeConfig.max} {sizeConfig.unit}</span>
          </div>
        </div>

        {/* Quick Estimate Range */}
        <div className="rounded-xl border-2 border-blue-200 bg-white p-4">
          <div className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-blue-700">
            Quick Estimate Range
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-gray-500">Budget</div>
              <div className="text-lg font-bold text-gray-700">{formatCurrency(lowEstimate)}</div>
            </div>
            <div>
              <div className="text-xs text-blue-700">Most Common</div>
              <div className="text-2xl font-bold text-blue-700">{formatCurrency(midEstimate)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Premium</div>
              <div className="text-lg font-bold text-gray-700">{formatCurrency(highEstimate)}</div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500">
            Based on {size} {sizeConfig.unit} • Simpsonville area pricing
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2">
          <Link href={calculatorPaths[serviceType]} className="block">
            <Button variant="primary" fullWidth size="lg">
              <Icon name="Calculator" size={18} />
              Get Detailed Estimate
            </Button>
          </Link>
          <Link href="/contact" className="block">
            <Button variant="outline" fullWidth>
              <Icon name="ClipboardEdit" size={18} />
              Request Free On-Site Quote
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-500">
          💡 This is a quick estimate. Final pricing depends on site conditions, materials, and project specifics.
        </p>
      </div>
    </Card>
  );
}
