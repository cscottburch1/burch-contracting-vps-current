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
  // Office Renovations
  { name: 'Office Space Build-Out (Basic)', laborRate: 39.6, materialLow: 26.4, materialHigh: 52.8, timeHours: 0.4, category: 'Office', unit: 'sq ft' },
  { name: 'Office Space Build-Out (High-End)', laborRate: 66, materialLow: 52.8, materialHigh: 99, timeHours: 0.6, category: 'Office', unit: 'sq ft' },
  { name: 'Conference Room Build-Out', laborRate: 9900, materialLow: 7920, materialHigh: 15840, timeHours: 120, category: 'Office', unit: 'project' },
  { name: 'Executive Office Suite', laborRate: 13200, materialLow: 9900, materialHigh: 19800, timeHours: 150, category: 'Office', unit: 'project' },
  { name: 'Reception Area Renovation', laborRate: 6600, materialLow: 5280, materialHigh: 13200, timeHours: 80, category: 'Office', unit: 'project' },
  { name: 'Break Room/Kitchen Build-Out', laborRate: 7920, materialLow: 6600, materialHigh: 13200, timeHours: 100, category: 'Office', unit: 'project' },
  
  // Retail & Storefront
  { name: 'Retail Space Build-Out (Basic)', laborRate: 46.2, materialLow: 33, materialHigh: 66, timeHours: 0.5, category: 'Retail', unit: 'sq ft' },
  { name: 'Retail Space Build-Out (Premium)', laborRate: 79.2, materialLow: 59.4, materialHigh: 118.8, timeHours: 0.7, category: 'Retail', unit: 'sq ft' },
  { name: 'Storefront Window/Door Installation', laborRate: 3960, materialLow: 5280, materialHigh: 13200, timeHours: 40, category: 'Retail', unit: 'project' },
  { name: 'Retail Display Fixtures Installation', laborRate: 2640, materialLow: 3300, materialHigh: 7920, timeHours: 30, category: 'Retail', unit: 'project' },
  { name: 'Point of Sale Counter Build-Out', laborRate: 1980, materialLow: 1320, materialHigh: 3960, timeHours: 24, category: 'Retail', unit: 'project' },
  { name: 'Fitting Room Construction', laborRate: 3300, materialLow: 1980, materialHigh: 5280, timeHours: 40, category: 'Retail', unit: 'project' },
  
  // Restaurant & Hospitality
  { name: 'Restaurant Kitchen Build-Out', laborRate: 26400, materialLow: 33000, materialHigh: 66000, timeHours: 300, category: 'Restaurant', unit: 'project' },
  { name: 'Restaurant Dining Area (per seat)', laborRate: 528, materialLow: 396, materialHigh: 792, timeHours: 5, category: 'Restaurant', unit: 'seat' },
  { name: 'Bar Installation (Full Service)', laborRate: 13200, materialLow: 9900, materialHigh: 26400, timeHours: 160, category: 'Restaurant', unit: 'project' },
  { name: 'Commercial Kitchen Hood System', laborRate: 7920, materialLow: 5280, materialHigh: 13200, timeHours: 60, category: 'Restaurant', unit: 'project' },
  { name: 'Restaurant Bathroom Renovation', laborRate: 9900, materialLow: 7920, materialHigh: 15840, timeHours: 120, category: 'Restaurant', unit: 'project' },
  
  // Medical & Dental
  { name: 'Medical Office Build-Out', laborRate: 59.4, materialLow: 46.2, materialHigh: 92.4, timeHours: 0.6, category: 'Medical', unit: 'sq ft' },
  { name: 'Dental Operatory Room', laborRate: 15840, materialLow: 13200, materialHigh: 26400, timeHours: 180, category: 'Medical', unit: 'room' },
  { name: 'Medical Exam Room Build-Out', laborRate: 9900, materialLow: 7920, materialHigh: 15840, timeHours: 120, category: 'Medical', unit: 'room' },
  { name: 'Medical Sterilization Room', laborRate: 13200, materialLow: 9900, materialHigh: 19800, timeHours: 150, category: 'Medical', unit: 'project' },
  { name: 'Medical Waiting Room Renovation', laborRate: 6600, materialLow: 5280, materialHigh: 11880, timeHours: 80, category: 'Medical', unit: 'project' },
  
  // Warehouse & Industrial
  { name: 'Warehouse Office Conversion', laborRate: 33, materialLow: 19.8, materialHigh: 39.6, timeHours: 0.4, category: 'Warehouse', unit: 'sq ft' },
  { name: 'Loading Dock Renovation', laborRate: 13200, materialLow: 9900, materialHigh: 19800, timeHours: 150, category: 'Warehouse', unit: 'project' },
  { name: 'Industrial Flooring (Epoxy)', laborRate: 13.2, materialLow: 6.6, materialHigh: 16.5, timeHours: 0.15, category: 'Warehouse', unit: 'sq ft' },
  { name: 'Warehouse Partition Walls', laborRate: 26.4, materialLow: 13.2, materialHigh: 33, timeHours: 0.3, category: 'Warehouse', unit: 'linear ft' },
  
  // Commercial Bathrooms
  { name: 'ADA Compliant Bathroom (Single)', laborRate: 13200, materialLow: 11880, materialHigh: 23760, timeHours: 160, category: 'Bathrooms', unit: 'project' },
  { name: 'Multi-Stall Bathroom Renovation', laborRate: 19800, materialLow: 15840, materialHigh: 33000, timeHours: 240, category: 'Bathrooms', unit: 'project' },
  { name: 'Commercial Bathroom Partition Install', laborRate: 1320, materialLow: 792, materialHigh: 1980, timeHours: 12, category: 'Bathrooms', unit: 'stall' },
  { name: 'ADA Sink & Fixture Installation', laborRate: 1584, materialLow: 1056, materialHigh: 2640, timeHours: 16, category: 'Bathrooms', unit: 'fixture' },
  
  // Commercial Flooring
  { name: 'Commercial Carpet Tile Installation', laborRate: 3.96, materialLow: 3.3, materialHigh: 9.9, timeHours: 0.08, category: 'Flooring', unit: 'sq ft' },
  { name: 'Commercial LVT Installation', laborRate: 6.6, materialLow: 5.28, materialHigh: 13.2, timeHours: 0.1, category: 'Flooring', unit: 'sq ft' },
  { name: 'Polished Concrete Flooring', laborRate: 10.56, materialLow: 5.28, materialHigh: 13.2, timeHours: 0.15, category: 'Flooring', unit: 'sq ft' },
  { name: 'Commercial Tile Flooring', laborRate: 13.2, materialLow: 6.6, materialHigh: 19.8, timeHours: 0.2, category: 'Flooring', unit: 'sq ft' },
  { name: 'Rubber Safety Flooring', laborRate: 7.92, materialLow: 6.6, materialHigh: 16.5, timeHours: 0.12, category: 'Flooring', unit: 'sq ft' },
  
  // Walls & Ceilings
  { name: 'Commercial Drywall Installation', laborRate: 3.96, materialLow: 1.32, materialHigh: 2.64, timeHours: 0.08, category: 'Walls & Ceilings', unit: 'sq ft' },
  { name: 'Drop Ceiling Installation', laborRate: 5.28, materialLow: 3.96, materialHigh: 7.92, timeHours: 0.1, category: 'Walls & Ceilings', unit: 'sq ft' },
  { name: 'Commercial Paint (Interior)', laborRate: 2.64, materialLow: 0.66, materialHigh: 1.32, timeHours: 0.05, category: 'Walls & Ceilings', unit: 'sq ft' },
  { name: 'Commercial Paint (Exterior)', laborRate: 3.3, materialLow: 0.99, materialHigh: 1.98, timeHours: 0.06, category: 'Walls & Ceilings', unit: 'sq ft' },
  { name: 'Acoustic Ceiling Tiles', laborRate: 6.6, materialLow: 3.96, materialHigh: 9.9, timeHours: 0.12, category: 'Walls & Ceilings', unit: 'sq ft' },
  
  // Electrical & Lighting
  { name: 'Commercial LED Lighting Upgrade', laborRate: 396, materialLow: 264, materialHigh: 660, timeHours: 3, category: 'Electrical', unit: 'fixture' },
  { name: 'Emergency Exit Lighting System', laborRate: 2640, materialLow: 1980, materialHigh: 3960, timeHours: 24, category: 'Electrical', unit: 'project' },
  { name: 'Electrical Panel Upgrade (200A)', laborRate: 3300, materialLow: 1980, materialHigh: 3960, timeHours: 24, category: 'Electrical', unit: 'project' },
  { name: 'Power Outlet Installation (Commercial)', laborRate: 198, materialLow: 66, materialHigh: 132, timeHours: 2, category: 'Electrical', unit: 'outlet' },
  
  // HVAC & Mechanical
  { name: 'Commercial HVAC Zone Installation', laborRate: 5280, materialLow: 6600, materialHigh: 13200, timeHours: 60, category: 'HVAC', unit: 'zone' },
  { name: 'Ductwork Installation (per linear ft)', laborRate: 33, materialLow: 19.8, materialHigh: 39.6, timeHours: 0.3, category: 'HVAC', unit: 'linear ft' },
  { name: 'Commercial Ventilation System', laborRate: 9900, materialLow: 7920, materialHigh: 15840, timeHours: 120, category: 'HVAC', unit: 'project' },
  
  // ADA Compliance
  { name: 'ADA Ramp Installation', laborRate: 3300, materialLow: 2640, materialHigh: 5280, timeHours: 40, category: 'ADA Compliance', unit: 'project' },
  { name: 'ADA Door Hardware Upgrade', laborRate: 528, materialLow: 264, materialHigh: 660, timeHours: 4, category: 'ADA Compliance', unit: 'door' },
  { name: 'ADA Signage Package', laborRate: 1320, materialLow: 660, materialHigh: 1584, timeHours: 12, category: 'ADA Compliance', unit: 'project' },
  { name: 'Accessible Parking Space Installation', laborRate: 990, materialLow: 528, materialHigh: 1320, timeHours: 8, category: 'ADA Compliance', unit: 'space' },
];

export default function CommercialRenovationsCalculator() {
  const [selectedService, setSelectedService] = useState<ServiceRate | null>(null);
  const [quantity, setQuantity] = useState(1000);
  const [materialQuality, setMaterialQuality] = useState<'low' | 'mid' | 'high'>('mid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(serviceRates.map(s => s.category)))];

  const filteredServices = selectedCategory === 'All' 
    ? serviceRates 
    : serviceRates.filter(s => s.category === selectedCategory);

  const calculateEstimate = () => {
    if (!selectedService) return { labor: 0, materials: 0, total: 0 };

    const labor = selectedService.laborRate * quantity;
    let materials = 0;

    if (materialQuality === 'low') {
      materials = selectedService.materialLow * quantity;
    } else if (materialQuality === 'high') {
      materials = selectedService.materialHigh * quantity;
    } else {
      materials = ((selectedService.materialLow + selectedService.materialHigh) / 2) * quantity;
    }

    const total = labor + materials;
    return { labor, materials, total };
  };

  const estimate = calculateEstimate();

  return (
    <>
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in backdrop-blur">
            <Icon name="Building" size={48} className="text-blue-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Commercial Renovations <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto animate-fade-in-up stagger-1 opacity-0">
            Get instant estimates for office, retail, restaurant, and commercial space renovations in the Greenville area
          </p>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <div className="max-w-6xl mx-auto">
          {/* Disclaimer */}
          <Card className="bg-yellow-50 border-2 border-yellow-200 mb-8 animate-fade-in-up">
            <div className="flex gap-3">
              <Icon name="AlertCircle" size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">Commercial Estimate Disclaimer</h3>
                <p className="text-yellow-800 text-sm leading-relaxed">
                  These calculations are for <strong>preliminary budgeting purposes only</strong>. Commercial renovation costs vary significantly based on building codes, zoning requirements, ADA compliance needs, permits, tenant improvement allowances, business hours restrictions, and project complexity. Many commercial projects require licensed architects, engineers, and specialized contractors. For an accurate quote and comprehensive project assessment, please contact us for an on-site consultation.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Project Type</h2>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Service List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredServices.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => {
                        setSelectedService(service);
                        // Set smart default quantity based on unit
                        if (service.unit === 'sq ft') setQuantity(1000);
                        else if (service.unit === 'project') setQuantity(1);
                        else if (service.unit === 'room') setQuantity(1);
                        else if (service.unit === 'linear ft') setQuantity(100);
                        else if (service.unit === 'seat') setQuantity(40);
                        else if (service.unit === 'fixture') setQuantity(4);
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
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="inline-flex items-center gap-1">
                              <Icon name="Tag" size={14} />
                              {service.category}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="inline-flex items-center gap-1">
                              <Icon name="Ruler" size={14} />
                              per {service.unit}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-bold text-blue-600">
                            ${(service.laborRate + service.materialLow).toLocaleString()}/{service.unit}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Calculator */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Your Estimate</h2>
                
                {selectedService ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{selectedService.name}</h3>
                      <p className="text-sm text-gray-600">{selectedService.category}</p>
                    </div>

                    {/* Quantity */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity ({selectedService.unit})
                      </label>
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
                        {selectedService.unit === 'room' && 'Number of rooms'}
                        {selectedService.unit === 'linear ft' && 'Total linear feet'}
                        {selectedService.unit === 'seat' && 'Number of seats (restaurant/dining)'}
                        {selectedService.unit === 'fixture' && 'Number of fixtures'}
                        {selectedService.unit === 'outlet' && 'Number of outlets'}
                        {selectedService.unit === 'zone' && 'Number of HVAC zones'}
                        {selectedService.unit === 'door' && 'Number of doors'}
                        {selectedService.unit === 'space' && 'Number of parking spaces'}
                        {selectedService.unit === 'stall' && 'Number of bathroom stalls'}
                      </p>
                    </div>

                    {/* Material Quality */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material Quality
                      </label>
                      <div className="space-y-2">
                        {['low', 'mid', 'high'].map((quality) => (
                          <label key={quality} className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50" style={{
                            borderColor: materialQuality === quality ? '#2563eb' : '#e5e7eb',
                            backgroundColor: materialQuality === quality ? '#eff6ff' : 'transparent'
                          }}>
                            <input
                              type="radio"
                              name="quality"
                              value={quality}
                              checked={materialQuality === quality}
                              onChange={(e) => setMaterialQuality(e.target.value as 'low' | 'mid' | 'high')}
                              className="mr-3"
                            />
                            <span className="font-medium capitalize">{quality === 'mid' ? 'Standard' : quality === 'low' ? 'Budget' : 'Premium'}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Estimate Breakdown */}
                    <div className="border-t pt-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-gray-700">
                          <span>Labor</span>
                          <span className="font-semibold">${estimate.labor.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Materials</span>
                          <span className="font-semibold">${estimate.materials.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-blue-600 text-white p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">Total Estimate</span>
                          <span className="font-bold text-2xl">${estimate.total.toLocaleString()}</span>
                        </div>
                        <p className="text-blue-100 text-xs mt-2">
                          Estimated time: {(selectedService.timeHours * quantity).toFixed(0)} hours
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 space-y-3">
                      <Button variant="primary" size="md" href="/contact" className="w-full">
                        <Icon name="FileText" size={18} />
                        Request Official Quote
                      </Button>
                      <Button variant="outline" size="md" href="tel:(864) 724-4600" className="w-full">
                        <Icon name="Phone" size={18} />
                        Call for Details
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Building" size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Select a project to see the estimate</p>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <Icon name="Building" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Commercial Expertise</h3>
              <p className="text-sm text-gray-600">
                Specialized in office, retail, and restaurant renovations
              </p>
            </Card>
            <Card className="text-center">
              <Icon name="Shield" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Licensed & Bonded</h3>
              <p className="text-sm text-gray-600">
                Fully licensed, insured, and bonded for commercial work
              </p>
            </Card>
            <Card className="text-center">
              <Icon name="Clock" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-gray-600">
                Work around your business hours to minimize disruption
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
