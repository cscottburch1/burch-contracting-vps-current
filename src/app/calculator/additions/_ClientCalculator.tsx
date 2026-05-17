'use client';

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

interface ServiceRate {
  name: string;
  laborRate: number;
  materialLow: number;
  materialHigh: number;
  timeHours: number;
  category: string;
  unit: string;
}

const serviceRates: ServiceRate[] = [
  // Room Additions
  { name: 'Basic Room Addition (per sq ft)', laborRate: 198, materialLow: 105.6, materialHigh: 198, timeHours: 1, category: 'Room Additions', unit: 'sq ft' },
  { name: 'Master Bedroom Suite Addition (per sq ft)', laborRate: 237.6, materialLow: 132, materialHigh: 237.6, timeHours: 1.2, category: 'Room Additions', unit: 'sq ft' },
  { name: 'Bathroom Addition (per sq ft)', laborRate: 264, materialLow: 158.4, materialHigh: 264, timeHours: 1.5, category: 'Room Additions', unit: 'sq ft' },
  { name: 'Home Office Addition (per sq ft)', laborRate: 184.8, materialLow: 99, materialHigh: 184.8, timeHours: 0.9, category: 'Room Additions', unit: 'sq ft' },
  { name: 'In-Law Suite Addition (per sq ft)', laborRate: 224.4, materialLow: 125.4, materialHigh: 224.4, timeHours: 1.1, category: 'Room Additions', unit: 'sq ft' },
  { name: 'Second Story Addition (per sq ft)', laborRate: 264, materialLow: 158.4, materialHigh: 264, timeHours: 1.5, category: 'Room Additions', unit: 'sq ft' },
  { name: 'Bump-Out Addition (per sq ft)', laborRate: 237.6, materialLow: 132, materialHigh: 237.6, timeHours: 1.3, category: 'Room Additions', unit: 'sq ft' },
  // Screened Porches
  { name: 'Basic Screened Porch (per sq ft)', laborRate: 66, materialLow: 33, materialHigh: 66, timeHours: 0.4, category: 'Screened Porches', unit: 'sq ft' },
  { name: 'Premium Screened Porch with Ceiling Fan (per sq ft)', laborRate: 85.8, materialLow: 46.2, materialHigh: 85.8, timeHours: 0.5, category: 'Screened Porches', unit: 'sq ft' },
  { name: 'Three-Season Porch (per sq ft)', laborRate: 112.2, materialLow: 66, materialHigh: 112.2, timeHours: 0.7, category: 'Screened Porches', unit: 'sq ft' },
  { name: 'Four-Season Sunroom (per sq ft)', laborRate: 198, materialLow: 132, materialHigh: 198, timeHours: 1, category: 'Screened Porches', unit: 'sq ft' },
  { name: 'Screened Porch Enclosure (existing deck)', laborRate: 52.8, materialLow: 26.4, materialHigh: 52.8, timeHours: 0.3, category: 'Screened Porches', unit: 'sq ft' },
  // Decks
  { name: 'Pressure-Treated Wood Deck (per sq ft)', laborRate: 33, materialLow: 19.8, materialHigh: 33, timeHours: 0.2, category: 'Decks', unit: 'sq ft' },
  { name: 'Cedar Deck (per sq ft)', laborRate: 39.6, materialLow: 33, materialHigh: 52.8, timeHours: 0.25, category: 'Decks', unit: 'sq ft' },
  { name: 'Composite Deck (per sq ft)', laborRate: 46.2, materialLow: 46.2, materialHigh: 72.6, timeHours: 0.3, category: 'Decks', unit: 'sq ft' },
  { name: 'PVC/Vinyl Deck (per sq ft)', laborRate: 52.8, materialLow: 59.4, materialHigh: 85.8, timeHours: 0.35, category: 'Decks', unit: 'sq ft' },
  { name: 'Multi-Level Deck (per sq ft)', laborRate: 59.4, materialLow: 33, materialHigh: 66, timeHours: 0.4, category: 'Decks', unit: 'sq ft' },
  { name: 'Deck Stairs (per step)', laborRate: 158.4, materialLow: 66, materialHigh: 132, timeHours: 2, category: 'Decks', unit: 'step' },
  { name: 'Deck Railing (per linear foot)', laborRate: 46.2, materialLow: 19.8, materialHigh: 79.2, timeHours: 0.5, category: 'Decks', unit: 'linear ft' },
  { name: 'Built-in Deck Seating (per linear foot)', laborRate: 105.6, materialLow: 52.8, materialHigh: 105.6, timeHours: 1.5, category: 'Decks', unit: 'linear ft' },
  // Garage Additions
  { name: 'One-Car Garage Addition (12x22)', laborRate: 19008, materialLow: 12672, materialHigh: 23760, timeHours: 200, category: 'Garages', unit: 'project' },
  { name: 'Two-Car Garage Addition (20x22)', laborRate: 31680, materialLow: 23760, materialHigh: 39600, timeHours: 320, category: 'Garages', unit: 'project' },
  { name: 'Three-Car Garage Addition (30x22)', laborRate: 47520, materialLow: 34848, materialHigh: 55440, timeHours: 480, category: 'Garages', unit: 'project' },
  { name: 'Detached Garage (per sq ft)', laborRate: 95.04, materialLow: 63.36, materialHigh: 110.88, timeHours: 0.5, category: 'Garages', unit: 'sq ft' },
  { name: 'Garage Conversion to Living Space', laborRate: 23760, materialLow: 15840, materialHigh: 31680, timeHours: 240, category: 'Garages', unit: 'project' },
  // Outdoor Living
  { name: 'Covered Patio (per sq ft)', laborRate: 59.4, materialLow: 33, materialHigh: 66, timeHours: 0.4, category: 'Outdoor Living', unit: 'sq ft' },
  { name: 'Pergola Installation (per sq ft)', laborRate: 52.8, materialLow: 26.4, materialHigh: 59.4, timeHours: 0.35, category: 'Outdoor Living', unit: 'sq ft' },
  { name: 'Gazebo Installation (8x8)', laborRate: 3960, materialLow: 3300, materialHigh: 7920, timeHours: 40, category: 'Outdoor Living', unit: 'project' },
  { name: 'Outdoor Kitchen (Basic)', laborRate: 10560, materialLow: 6600, materialHigh: 15840, timeHours: 80, category: 'Outdoor Living', unit: 'project' },
  { name: 'Outdoor Kitchen (Premium)', laborRate: 19800, materialLow: 15840, materialHigh: 39600, timeHours: 150, category: 'Outdoor Living', unit: 'project' },
  { name: 'Built-in Fire Pit', laborRate: 1980, materialLow: 1056, materialHigh: 3300, timeHours: 24, category: 'Outdoor Living', unit: 'project' },
  { name: 'Outdoor Fireplace', laborRate: 5280, materialLow: 3960, materialHigh: 10560, timeHours: 60, category: 'Outdoor Living', unit: 'project' },
  // Attic & Basement Conversions
  { name: 'Attic Conversion (per sq ft)', laborRate: 158.4, materialLow: 92.4, materialHigh: 158.4, timeHours: 0.8, category: 'Conversions', unit: 'sq ft' },
  { name: 'Dormer Addition for Attic', laborRate: 10560, materialLow: 6600, materialHigh: 15840, timeHours: 120, category: 'Conversions', unit: 'project' },
  { name: 'Crawl Space Encapsulation (per sq ft)', laborRate: 10.56, materialLow: 5.28, materialHigh: 10.56, timeHours: 0.1, category: 'Conversions', unit: 'sq ft' },
];

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function AdditionsClientCalculator() {
  const [selectedService, setSelectedService] = useState<ServiceRate | null>(null);
  const [quantity, setQuantity] = useState(200);
  const [materialQuality, setMaterialQuality] = useState<'low' | 'mid' | 'high'>('mid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(serviceRates.map(s => s.category)))];
  const filteredServices = selectedCategory === 'All' ? serviceRates : serviceRates.filter(s => s.category === selectedCategory);

  const calculateEstimate = () => {
    if (!selectedService) return { labor: 0, materials: 0, total: 0 };
    const labor = selectedService.laborRate * quantity;
    const materials = materialQuality === 'low'
      ? selectedService.materialLow * quantity
      : materialQuality === 'high'
        ? selectedService.materialHigh * quantity
        : ((selectedService.materialLow + selectedService.materialHigh) / 2) * quantity;
    return { labor, materials, total: labor + materials };
  };

  const estimate = calculateEstimate();

  return (
    <Section background="gray" padding="lg">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-amber-50 border-2 border-amber-200 mb-8">
          <div className="flex gap-3">
            <Icon name="AlertCircle" size={24} className="text-amber-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2">Budget Planning Tool</h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                These calculations are for estimating purposes only. Actual costs vary significantly based on foundation requirements, structural engineering, zoning, permits, site preparation, and material selections. <strong>Schedule a free on-site consultation for accurate pricing.</strong>
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Selection */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Addition or Structure Type</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredServices.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => {
                      setSelectedService(service);
                      if (service.unit === 'sq ft') setQuantity(200);
                      else if (service.unit === 'project') setQuantity(1);
                      else if (service.unit === 'linear ft') setQuantity(40);
                      else if (service.unit === 'step') setQuantity(4);
                      else setQuantity(1);
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedService?.name === service.name
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{service.category} · per {service.unit}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs text-gray-500">From</p>
                        <p className="font-bold text-blue-600">{formatUSD(service.laborRate + service.materialLow)}/{service.unit}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Estimate Panel */}
          <div>
            <Card className="sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Estimate</h2>
              {selectedService ? (
                <>
                  <div className="mb-4 rounded-lg bg-blue-50 p-3">
                    <p className="font-semibold text-gray-900 text-sm">{selectedService.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedService.category}</p>
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity ({selectedService.unit})</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedService.unit === 'sq ft' && 'Enter total square footage'}
                      {selectedService.unit === 'project' && 'Typically 1 for full projects'}
                      {selectedService.unit === 'linear ft' && 'Enter linear feet'}
                      {selectedService.unit === 'step' && 'Number of steps'}
                    </p>
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Material Quality</label>
                    <div className="space-y-2">
                      {(['low', 'mid', 'high'] as const).map((q) => (
                        <label key={q} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${materialQuality === q ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                          <input type="radio" name="quality" value={q} checked={materialQuality === q} onChange={() => setMaterialQuality(q)} className="mr-3" />
                          <span className="font-medium">{q === 'mid' ? 'Standard' : q === 'low' ? 'Budget' : 'Premium'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-5 space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between"><span>Labor</span><strong>{formatUSD(estimate.labor)}</strong></div>
                    <div className="flex justify-between"><span>Materials</span><strong>{formatUSD(estimate.materials)}</strong></div>
                  </div>
                  <div className="bg-blue-700 text-white p-4 rounded-lg mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total Estimate</span>
                      <span className="font-bold text-2xl">{formatUSD(estimate.total)}</span>
                    </div>
                    <p className="text-blue-200 text-xs mt-1">
                      Est. time: {(selectedService.timeHours * quantity).toFixed(0)} hrs
                    </p>
                  </div>

                  <div className="mt-5 space-y-3">
                    <Button variant="primary" size="md" href="/contact" className="w-full">
                      <Icon name="FileText" size={18} />
                      Request Free Estimate
                    </Button>
                    <Button variant="outline" size="md" href="tel:8647244600" className="w-full">
                      <Icon name="Phone" size={18} />
                      (864) 724-4600
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Building" size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a project type to see the estimate</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <Icon name="MapPin" size={32} className="text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Greenville &amp; Laurens County Rates</h3>
            <p className="text-sm text-gray-600">Based on current Upstate SC construction market pricing</p>
          </Card>
          <Card className="text-center">
            <Icon name="FileCheck" size={32} className="text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Permits Handled</h3>
            <p className="text-sm text-gray-600">We manage all permits and inspections</p>
          </Card>
          <Card className="text-center">
            <Icon name="Award" size={32} className="text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">BBB A+ Rated</h3>
            <p className="text-sm text-gray-600">Licensed general contractor since 1995</p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
