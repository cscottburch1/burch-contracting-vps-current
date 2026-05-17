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
}

const serviceRates: ServiceRate[] = [
  { name: 'Water Heater Installation (40-50 gal)', laborRate: 594, materialLow: 528, materialHigh: 1188, timeHours: 4, category: 'Plumbing' },
  { name: 'Tankless Water Heater Installation', laborRate: 1056, materialLow: 1320, materialHigh: 3300, timeHours: 6, category: 'Plumbing' },
  { name: 'Toilet Installation', laborRate: 198, materialLow: 158.4, materialHigh: 528, timeHours: 2, category: 'Plumbing' },
  { name: 'Faucet Installation (Kitchen)', laborRate: 158.4, materialLow: 105.6, materialHigh: 462, timeHours: 1.5, category: 'Plumbing' },
  { name: 'Faucet Installation (Bathroom)', laborRate: 132, materialLow: 79.2, materialHigh: 330, timeHours: 1, category: 'Plumbing' },
  { name: 'Sink Installation', laborRate: 237.6, materialLow: 198, materialHigh: 792, timeHours: 2, category: 'Plumbing' },
  { name: 'Garbage Disposal Installation', laborRate: 171.6, materialLow: 132, materialHigh: 396, timeHours: 1.5, category: 'Plumbing' },
  { name: 'Interior Door Installation', laborRate: 264, materialLow: 198, materialHigh: 660, timeHours: 2.5, category: 'Doors & Windows' },
  { name: 'Exterior Door Installation', laborRate: 462, materialLow: 396, materialHigh: 1584, timeHours: 4, category: 'Doors & Windows' },
  { name: 'Storm Door Installation', laborRate: 237.6, materialLow: 264, materialHigh: 792, timeHours: 2, category: 'Doors & Windows' },
  { name: 'Window Installation (Standard)', laborRate: 330, materialLow: 330, materialHigh: 1056, timeHours: 3, category: 'Doors & Windows' },
  { name: 'Dishwasher Installation', laborRate: 237.6, materialLow: 528, materialHigh: 1584, timeHours: 2, category: 'Appliances' },
  { name: 'Microwave Installation (Over-Range)', laborRate: 198, materialLow: 198, materialHigh: 660, timeHours: 2, category: 'Appliances' },
  { name: 'Ceiling Fan Installation', laborRate: 198, materialLow: 105.6, materialHigh: 528, timeHours: 2, category: 'Appliances' },
  { name: 'Light Fixture Installation', laborRate: 132, materialLow: 66, materialHigh: 396, timeHours: 1.5, category: 'Electrical' },
  { name: 'Outlet/Switch Installation', laborRate: 105.6, materialLow: 19.8, materialHigh: 66, timeHours: 1, category: 'Electrical' },
  { name: 'GFCI Outlet Installation', laborRate: 132, materialLow: 33, materialHigh: 79.2, timeHours: 1, category: 'Electrical' },
  { name: 'Dimmer Switch Installation', laborRate: 118.8, materialLow: 26.4, materialHigh: 105.6, timeHours: 1, category: 'Electrical' },
  { name: 'Baseboards Installation (per room)', laborRate: 330, materialLow: 132, materialHigh: 528, timeHours: 4, category: 'Carpentry' },
  { name: 'Crown Molding (per room)', laborRate: 462, materialLow: 198, materialHigh: 660, timeHours: 5, category: 'Carpentry' },
  { name: 'Shelving Installation (Custom)', laborRate: 264, materialLow: 132, materialHigh: 528, timeHours: 3, category: 'Carpentry' },
  { name: 'Drywall Repair (Small Hole)', laborRate: 132, materialLow: 26.4, materialHigh: 66, timeHours: 1.5, category: 'Repairs' },
  { name: 'Drywall Repair (Large Area)', laborRate: 396, materialLow: 99, materialHigh: 264, timeHours: 4, category: 'Repairs' },
  { name: 'Deck Repair (per hour)', laborRate: 112.2, materialLow: 66, materialHigh: 264, timeHours: 1, category: 'Repairs' },
  { name: 'Single Room Interior Paint (12x12)', laborRate: 462, materialLow: 105.6, materialHigh: 198, timeHours: 6, category: 'Painting' },
  { name: 'Bedroom Paint (Standard)', laborRate: 528, materialLow: 118.8, materialHigh: 211.2, timeHours: 6.5, category: 'Painting' },
  { name: 'Living Room Paint (Standard)', laborRate: 792, materialLow: 184.8, materialHigh: 330, timeHours: 9, category: 'Painting' },
  { name: 'Kitchen Paint (Walls Only)', laborRate: 594, materialLow: 132, materialHigh: 237.6, timeHours: 7, category: 'Painting' },
  { name: 'Bathroom Paint (Small)', laborRate: 369.6, materialLow: 79.2, materialHigh: 145.2, timeHours: 4, category: 'Painting' },
  { name: 'Deck Staining (per 100 sq ft)', laborRate: 264, materialLow: 79.2, materialHigh: 158.4, timeHours: 3, category: 'Painting' },
  { name: 'Popcorn Ceiling Removal & Paint', laborRate: 1056, materialLow: 198, materialHigh: 396, timeHours: 12, category: 'Painting' },
];

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function HandymanClientCalculator() {
  const [selectedService, setSelectedService] = useState<ServiceRate | null>(null);
  const [quantity, setQuantity] = useState(1);
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
                Estimates are for planning only. Actual costs vary based on project specifics, site conditions, material availability, and complexity. <strong>Contact us for a free in-home consultation.</strong>
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Service</h2>
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
                    onClick={() => setSelectedService(service)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedService?.name === service.name ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{service.category} · ~{service.timeHours}h</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs text-gray-500">From</p>
                        <p className="font-bold text-blue-600">{formatUSD(service.laborRate + service.materialLow)}</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
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
                    <p className="text-blue-200 text-xs mt-1">Est. time: {(selectedService.timeHours * quantity).toFixed(1)} hrs</p>
                  </div>
                  <div className="mt-5 space-y-3">
                    <Button variant="primary" size="md" href="/contact" className="w-full"><Icon name="FileText" size={18} />Request Official Quote</Button>
                    <Button variant="outline" size="md" href="tel:8647244600" className="w-full"><Icon name="Phone" size={18} />(864) 724-4600</Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Calculator" size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a service to see the estimate</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center"><Icon name="MapPin" size={32} className="text-blue-600 mx-auto mb-3" /><h3 className="font-bold text-gray-900 mb-2">Local Rates</h3><p className="text-sm text-gray-600">Based on current Simpsonville &amp; Greenville County market rates</p></Card>
          <Card className="text-center"><Icon name="Shield" size={32} className="text-blue-600 mx-auto mb-3" /><h3 className="font-bold text-gray-900 mb-2">Licensed &amp; Insured</h3><p className="text-sm text-gray-600">All work by certified professionals</p></Card>
          <Card className="text-center"><Icon name="Clock" size={32} className="text-blue-600 mx-auto mb-3" /><h3 className="font-bold text-gray-900 mb-2">Fast Response</h3><p className="text-sm text-gray-600">Most projects scheduled within 3–5 business days</p></Card>
        </div>
      </div>
    </Section>
  );
}
