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
  { name: 'Full Kitchen Remodel (Small, 70-100 sq ft)', laborRate: 10560, materialLow: 13200, materialHigh: 33000, timeHours: 120, category: 'Kitchen', unit: 'project' },
  { name: 'Full Kitchen Remodel (Medium, 100-150 sq ft)', laborRate: 19800, materialLow: 26400, materialHigh: 59400, timeHours: 200, category: 'Kitchen', unit: 'project' },
  { name: 'Full Kitchen Remodel (Large, 150-200 sq ft)', laborRate: 33000, materialLow: 46200, materialHigh: 99000, timeHours: 300, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Cabinet Installation (Stock)', laborRate: 3300, materialLow: 3960, materialHigh: 10560, timeHours: 40, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Cabinet Installation (Semi-Custom)', laborRate: 4620, materialLow: 10560, materialHigh: 19800, timeHours: 50, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Cabinet Installation (Custom)', laborRate: 6600, materialLow: 19800, materialHigh: 46200, timeHours: 60, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Countertop Installation (Laminate)', laborRate: 1056, materialLow: 792, materialHigh: 1980, timeHours: 8, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Countertop Installation (Granite)', laborRate: 1584, materialLow: 2640, materialHigh: 5940, timeHours: 12, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Countertop Installation (Quartz)', laborRate: 1980, materialLow: 3300, materialHigh: 7260, timeHours: 12, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Backsplash Installation', laborRate: 1056, materialLow: 528, materialHigh: 1980, timeHours: 16, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Sink & Faucet Replacement', laborRate: 396, materialLow: 264, materialHigh: 1584, timeHours: 4, category: 'Kitchen', unit: 'project' },
  { name: 'Full Bathroom Remodel (Small, 35-50 sq ft)', laborRate: 6600, materialLow: 7920, materialHigh: 19800, timeHours: 80, category: 'Bathroom', unit: 'project' },
  { name: 'Full Bathroom Remodel (Medium, 50-75 sq ft)', laborRate: 10560, materialLow: 13200, materialHigh: 29040, timeHours: 120, category: 'Bathroom', unit: 'project' },
  { name: 'Full Bathroom Remodel (Large, 75-100 sq ft)', laborRate: 15840, materialLow: 19800, materialHigh: 46200, timeHours: 160, category: 'Bathroom', unit: 'project' },
  { name: 'Shower/Tub Surround Installation (Tile)', laborRate: 3300, materialLow: 1980, materialHigh: 5280, timeHours: 40, category: 'Bathroom', unit: 'project' },
  { name: 'Shower/Tub Surround Installation (Acrylic)', laborRate: 1980, materialLow: 1056, materialHigh: 2640, timeHours: 24, category: 'Bathroom', unit: 'project' },
  { name: 'Bathroom Vanity Installation', laborRate: 792, materialLow: 528, materialHigh: 3300, timeHours: 8, category: 'Bathroom', unit: 'project' },
  { name: 'Walk-in Shower Installation', laborRate: 5280, materialLow: 3960, materialHigh: 10560, timeHours: 60, category: 'Bathroom', unit: 'project' },
  { name: 'Hardwood Flooring Installation', laborRate: 7.92, materialLow: 6.6, materialHigh: 19.8, timeHours: 0.15, category: 'Flooring', unit: 'sq ft' },
  { name: 'Laminate Flooring Installation', laborRate: 3.96, materialLow: 2.64, materialHigh: 7.92, timeHours: 0.08, category: 'Flooring', unit: 'sq ft' },
  { name: 'Luxury Vinyl Plank Installation', laborRate: 5.28, materialLow: 3.96, materialHigh: 10.56, timeHours: 0.1, category: 'Flooring', unit: 'sq ft' },
  { name: 'Tile Flooring Installation', laborRate: 10.56, materialLow: 5.28, materialHigh: 19.8, timeHours: 0.2, category: 'Flooring', unit: 'sq ft' },
  { name: 'Carpet Installation', laborRate: 2.64, materialLow: 2.64, materialHigh: 10.56, timeHours: 0.05, category: 'Flooring', unit: 'sq ft' },
  { name: 'Interior Painting (per room, 12x12)', laborRate: 528, materialLow: 132, materialHigh: 264, timeHours: 12, category: 'Painting', unit: 'room' },
  { name: 'Cabinet Painting/Refinishing', laborRate: 1584, materialLow: 396, materialHigh: 1056, timeHours: 32, category: 'Painting', unit: 'project' },
  { name: 'Drywall Installation (per sheet)', laborRate: 59.4, materialLow: 19.8, materialHigh: 33, timeHours: 1, category: 'Painting', unit: 'sheet' },
  { name: 'Window Replacement (Standard)', laborRate: 330, materialLow: 330, materialHigh: 1056, timeHours: 3, category: 'Windows & Doors', unit: 'window' },
  { name: 'Sliding Glass Door Installation', laborRate: 792, materialLow: 1056, materialHigh: 3300, timeHours: 8, category: 'Windows & Doors', unit: 'door' },
  { name: 'Garage Door Installation', laborRate: 528, materialLow: 1056, materialHigh: 3300, timeHours: 6, category: 'Windows & Doors', unit: 'door' },
  { name: 'Basement Finishing (per sq ft)', laborRate: 46.2, materialLow: 26.4, materialHigh: 59.4, timeHours: 0.3, category: 'Basement', unit: 'sq ft' },
  { name: 'Basement Bathroom Addition', laborRate: 7920, materialLow: 5280, materialHigh: 13200, timeHours: 100, category: 'Basement', unit: 'project' },
];

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function RemodelingClientCalculator() {
  const [selectedService, setSelectedService] = useState<ServiceRate | null>(null);
  const [quantity, setQuantity] = useState(100);
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
                Estimates are for planning only. Actual costs may vary based on structural requirements, permits, material selections, and site conditions. Remodeling projects often uncover hidden issues. <strong>Contact us for a free in-home consultation.</strong>
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Project Type</h2>
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
                      if (service.unit === 'sq ft') setQuantity(500);
                      else if (service.unit === 'room') setQuantity(1);
                      else if (service.unit === 'sheet') setQuantity(20);
                      else setQuantity(1);
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedService?.name === service.name ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-white'
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
                      {selectedService.unit === 'project' && 'Typically 1 for a full project'}
                      {selectedService.unit === 'room' && 'Number of rooms'}
                      {selectedService.unit === 'sheet' && 'Number of 4×8 drywall sheets'}
                      {selectedService.unit === 'window' && 'Number of windows'}
                      {selectedService.unit === 'door' && 'Number of doors'}
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
                    <p className="text-blue-200 text-xs mt-1">Est. time: {(selectedService.timeHours * quantity).toFixed(0)} hrs</p>
                  </div>
                  <div className="mt-5 space-y-3">
                    <Button variant="primary" size="md" href="/contact" className="w-full"><Icon name="FileText" size={18} />Request Free Estimate</Button>
                    <Button variant="outline" size="md" href="tel:8647244600" className="w-full"><Icon name="Phone" size={18} />(864) 724-4600</Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Home" size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a project to see the estimate</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center"><Icon name="MapPin" size={32} className="text-blue-600 mx-auto mb-3" /><h3 className="font-bold text-gray-900 mb-2">Simpsonville &amp; Greenville Area Rates</h3><p className="text-sm text-gray-600">Based on current Upstate SC market pricing</p></Card>
          <Card className="text-center"><Icon name="Shield" size={32} className="text-blue-600 mx-auto mb-3" /><h3 className="font-bold text-gray-900 mb-2">Licensed &amp; Insured</h3><p className="text-sm text-gray-600">All remodeling work fully licensed and insured</p></Card>
          <Card className="text-center"><Icon name="Award" size={32} className="text-blue-600 mx-auto mb-3" /><h3 className="font-bold text-gray-900 mb-2">BBB A+ Rated</h3><p className="text-sm text-gray-600">Trusted contractor since 1995</p></Card>
        </div>
      </div>
    </Section>
  );
}
