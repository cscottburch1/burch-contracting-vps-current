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
  { name: 'Office Space Build-Out (Basic)', laborRate: 39.6, materialLow: 26.4, materialHigh: 52.8, timeHours: 0.4, category: 'Office', unit: 'sq ft' },
  { name: 'Office Space Build-Out (High-End)', laborRate: 66, materialLow: 52.8, materialHigh: 99, timeHours: 0.6, category: 'Office', unit: 'sq ft' },
  { name: 'Conference Room Build-Out', laborRate: 9900, materialLow: 7920, materialHigh: 15840, timeHours: 120, category: 'Office', unit: 'project' },
  { name: 'Executive Office Suite', laborRate: 13200, materialLow: 9900, materialHigh: 19800, timeHours: 150, category: 'Office', unit: 'project' },
  { name: 'Reception Area Renovation', laborRate: 6600, materialLow: 5280, materialHigh: 13200, timeHours: 80, category: 'Office', unit: 'project' },
  { name: 'Break Room/Kitchen Build-Out', laborRate: 7920, materialLow: 6600, materialHigh: 13200, timeHours: 100, category: 'Office', unit: 'project' },
  { name: 'Retail Space Build-Out (Basic)', laborRate: 46.2, materialLow: 33, materialHigh: 66, timeHours: 0.5, category: 'Retail', unit: 'sq ft' },
  { name: 'Retail Space Build-Out (Premium)', laborRate: 79.2, materialLow: 59.4, materialHigh: 118.8, timeHours: 0.7, category: 'Retail', unit: 'sq ft' },
  { name: 'Storefront Window/Door Installation', laborRate: 3960, materialLow: 5280, materialHigh: 13200, timeHours: 40, category: 'Retail', unit: 'project' },
  { name: 'Point of Sale Counter Build-Out', laborRate: 1980, materialLow: 1320, materialHigh: 3960, timeHours: 24, category: 'Retail', unit: 'project' },
  { name: 'Restaurant Kitchen Build-Out', laborRate: 26400, materialLow: 33000, materialHigh: 66000, timeHours: 300, category: 'Restaurant', unit: 'project' },
  { name: 'Restaurant Dining Area (per seat)', laborRate: 528, materialLow: 396, materialHigh: 792, timeHours: 5, category: 'Restaurant', unit: 'seat' },
  { name: 'Bar Installation (Full Service)', laborRate: 13200, materialLow: 9900, materialHigh: 26400, timeHours: 160, category: 'Restaurant', unit: 'project' },
  { name: 'Restaurant Bathroom Renovation', laborRate: 9900, materialLow: 7920, materialHigh: 15840, timeHours: 120, category: 'Restaurant', unit: 'project' },
  { name: 'Medical Office Build-Out', laborRate: 59.4, materialLow: 46.2, materialHigh: 92.4, timeHours: 0.6, category: 'Medical', unit: 'sq ft' },
  { name: 'Dental Operatory Room', laborRate: 15840, materialLow: 13200, materialHigh: 26400, timeHours: 180, category: 'Medical', unit: 'room' },
  { name: 'Medical Exam Room Build-Out', laborRate: 9900, materialLow: 7920, materialHigh: 15840, timeHours: 120, category: 'Medical', unit: 'room' },
  { name: 'Medical Waiting Room Renovation', laborRate: 6600, materialLow: 5280, materialHigh: 11880, timeHours: 80, category: 'Medical', unit: 'project' },
  { name: 'Warehouse Office Conversion', laborRate: 33, materialLow: 19.8, materialHigh: 39.6, timeHours: 0.4, category: 'Warehouse', unit: 'sq ft' },
  { name: 'Industrial Flooring (Epoxy)', laborRate: 13.2, materialLow: 6.6, materialHigh: 16.5, timeHours: 0.15, category: 'Warehouse', unit: 'sq ft' },
  { name: 'ADA Compliant Bathroom (Single)', laborRate: 13200, materialLow: 11880, materialHigh: 23760, timeHours: 160, category: 'Bathrooms', unit: 'project' },
  { name: 'Multi-Stall Bathroom Renovation', laborRate: 19800, materialLow: 15840, materialHigh: 33000, timeHours: 240, category: 'Bathrooms', unit: 'project' },
  { name: 'Commercial Carpet Tile Installation', laborRate: 3.96, materialLow: 3.3, materialHigh: 9.9, timeHours: 0.08, category: 'Flooring', unit: 'sq ft' },
  { name: 'Commercial LVT Installation', laborRate: 6.6, materialLow: 5.28, materialHigh: 13.2, timeHours: 0.1, category: 'Flooring', unit: 'sq ft' },
  { name: 'Polished Concrete Flooring', laborRate: 10.56, materialLow: 5.28, materialHigh: 13.2, timeHours: 0.15, category: 'Flooring', unit: 'sq ft' },
  { name: 'Commercial Drywall Installation', laborRate: 3.96, materialLow: 1.32, materialHigh: 2.64, timeHours: 0.08, category: 'Walls & Ceilings', unit: 'sq ft' },
  { name: 'Drop Ceiling Installation', laborRate: 5.28, materialLow: 3.96, materialHigh: 7.92, timeHours: 0.1, category: 'Walls & Ceilings', unit: 'sq ft' },
  { name: 'Commercial LED Lighting Upgrade', laborRate: 396, materialLow: 264, materialHigh: 660, timeHours: 3, category: 'Electrical', unit: 'fixture' },
  { name: 'Electrical Panel Upgrade (200A)', laborRate: 3300, materialLow: 1980, materialHigh: 3960, timeHours: 24, category: 'Electrical', unit: 'project' },
  { name: 'Commercial HVAC Zone Installation', laborRate: 5280, materialLow: 6600, materialHigh: 13200, timeHours: 60, category: 'HVAC', unit: 'zone' },
  { name: 'ADA Ramp Installation', laborRate: 3300, materialLow: 2640, materialHigh: 5280, timeHours: 40, category: 'ADA', unit: 'project' },
  { name: 'ADA Door Hardware Upgrade', laborRate: 528, materialLow: 264, materialHigh: 660, timeHours: 4, category: 'ADA', unit: 'door' },
];

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function CommercialRenovationsClientCalculator() {
  const [selectedService, setSelectedService] = useState<ServiceRate | null>(null);
  const [quantity, setQuantity] = useState(1000);
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
              <h3 className="font-bold text-amber-900 mb-2">Preliminary Budget Tool</h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                Commercial renovation costs vary significantly based on building codes, ADA compliance, permits, and tenant improvement allowances. Many projects require licensed architects or engineers. <strong>Schedule an on-site consultation for accurate pricing.</strong>
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
                      if (service.unit === 'sq ft') setQuantity(1000);
                      else if (service.unit === 'project') setQuantity(1);
                      else if (service.unit === 'room') setQuantity(1);
                      else if (service.unit === 'seat') setQuantity(40);
                      else if (service.unit === 'fixture') setQuantity(4);
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
                      {selectedService.unit === 'sq ft' && 'Total square footage'}
                      {selectedService.unit === 'project' && 'Typically 1 for a full project'}
                      {selectedService.unit === 'room' && 'Number of rooms'}
                      {selectedService.unit === 'seat' && 'Number of dining seats'}
                      {selectedService.unit === 'fixture' && 'Number of fixtures'}
                      {selectedService.unit === 'door' && 'Number of doors'}
                      {selectedService.unit === 'zone' && 'Number of HVAC zones'}
                    </p>
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Finish Level</label>
                    <div className="space-y-2">
                      {(['low', 'mid', 'high'] as const).map((q) => (
                        <label key={q} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${materialQuality === q ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                          <input type="radio" name="quality" value={q} checked={materialQuality === q} onChange={() => setMaterialQuality(q)} className="mr-3" />
                          <span className="font-medium">{q === 'mid' ? 'Standard' : q === 'low' ? 'Value' : 'Premium'}</span>
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
                    <Button variant="primary" size="md" href="/contact" className="w-full"><Icon name="FileText" size={18} />Request Official Quote</Button>
                    <Button variant="outline" size="md" href="tel:8647244600" className="w-full"><Icon name="Phone" size={18} />(864) 724-4600</Button>
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
          <Card className="text-center"><Icon name="Building" size={32} className="text-blue-600 mx-auto mb-3" /><h3 className="font-bold text-gray-900 mb-2">Commercial Expertise</h3><p className="text-sm text-gray-600">Office, retail, restaurant &amp; medical renovations</p></Card>
          <Card className="text-center"><Icon name="Shield" size={32} className="text-blue-600 mx-auto mb-3" /><h3 className="font-bold text-gray-900 mb-2">Licensed &amp; Bonded</h3><p className="text-sm text-gray-600">Fully licensed, insured, and bonded for commercial work</p></Card>
          <Card className="text-center"><Icon name="Clock" size={32} className="text-blue-600 mx-auto mb-3" /><h3 className="font-bold text-gray-900 mb-2">Flexible Scheduling</h3><p className="text-sm text-gray-600">Work around your business hours to minimize disruption</p></Card>
        </div>
      </div>
    </Section>
  );
}
