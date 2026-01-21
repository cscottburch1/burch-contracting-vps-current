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
  { name: 'Basic Room Addition (per sq ft)', laborRate: 180, materialLow: 96, materialHigh: 180, timeHours: 1, category: 'Room Additions', unit: 'sq ft' },
  { name: 'Master Bedroom Suite Addition (per sq ft)', laborRate: 216, materialLow: 120, materialHigh: 216, timeHours: 1.2, category: 'Room Additions', unit: 'sq ft' },
  { name: 'Bathroom Addition (per sq ft)', laborRate: 240, materialLow: 144, materialHigh: 240, timeHours: 1.5, category: 'Room Additions', unit: 'sq ft' },
  { name: 'Home Office Addition (per sq ft)', laborRate: 168, materialLow: 90, materialHigh: 168, timeHours: 0.9, category: 'Room Additions', unit: 'sq ft' },
  { name: 'In-Law Suite Addition (per sq ft)', laborRate: 204, materialLow: 114, materialHigh: 204, timeHours: 1.1, category: 'Room Additions', unit: 'sq ft' },
  { name: 'Second Story Addition (per sq ft)', laborRate: 240, materialLow: 144, materialHigh: 240, timeHours: 1.5, category: 'Room Additions', unit: 'sq ft' },
  { name: 'Bump-Out Addition (per sq ft)', laborRate: 216, materialLow: 120, materialHigh: 216, timeHours: 1.3, category: 'Room Additions', unit: 'sq ft' },
  
  // Screened Porches
  { name: 'Basic Screened Porch (per sq ft)', laborRate: 60, materialLow: 30, materialHigh: 60, timeHours: 0.4, category: 'Screened Porches', unit: 'sq ft' },
  { name: 'Premium Screened Porch with Ceiling Fan (per sq ft)', laborRate: 78, materialLow: 42, materialHigh: 78, timeHours: 0.5, category: 'Screened Porches', unit: 'sq ft' },
  { name: 'Three-Season Porch (per sq ft)', laborRate: 102, materialLow: 60, materialHigh: 102, timeHours: 0.7, category: 'Screened Porches', unit: 'sq ft' },
  { name: 'Four-Season Sunroom (per sq ft)', laborRate: 180, materialLow: 120, materialHigh: 180, timeHours: 1, category: 'Screened Porches', unit: 'sq ft' },
  { name: 'Screened Porch Enclosure (existing deck)', laborRate: 48, materialLow: 24, materialHigh: 48, timeHours: 0.3, category: 'Screened Porches', unit: 'sq ft' },
  
  // Decks
  { name: 'Pressure-Treated Wood Deck (per sq ft)', laborRate: 30, materialLow: 18, materialHigh: 30, timeHours: 0.2, category: 'Decks', unit: 'sq ft' },
  { name: 'Cedar Deck (per sq ft)', laborRate: 36, materialLow: 30, materialHigh: 48, timeHours: 0.25, category: 'Decks', unit: 'sq ft' },
  { name: 'Composite Deck (per sq ft)', laborRate: 42, materialLow: 42, materialHigh: 66, timeHours: 0.3, category: 'Decks', unit: 'sq ft' },
  { name: 'PVC/Vinyl Deck (per sq ft)', laborRate: 48, materialLow: 54, materialHigh: 78, timeHours: 0.35, category: 'Decks', unit: 'sq ft' },
  { name: 'Multi-Level Deck (per sq ft)', laborRate: 54, materialLow: 30, materialHigh: 60, timeHours: 0.4, category: 'Decks', unit: 'sq ft' },
  { name: 'Deck Stairs (per step)', laborRate: 144, materialLow: 60, materialHigh: 120, timeHours: 2, category: 'Decks', unit: 'step' },
  { name: 'Deck Railing (per linear foot)', laborRate: 42, materialLow: 18, materialHigh: 72, timeHours: 0.5, category: 'Decks', unit: 'linear ft' },
  { name: 'Built-in Deck Seating (per linear foot)', laborRate: 96, materialLow: 48, materialHigh: 96, timeHours: 1.5, category: 'Decks', unit: 'linear ft' },
  
  // Garage Additions
  { name: 'One-Car Garage Addition (12x22)', laborRate: 14400, materialLow: 9600, materialHigh: 18000, timeHours: 200, category: 'Garages', unit: 'project' },
  { name: 'Two-Car Garage Addition (20x22)', laborRate: 24000, materialLow: 18000, materialHigh: 30000, timeHours: 320, category: 'Garages', unit: 'project' },
  { name: 'Three-Car Garage Addition (30x22)', laborRate: 36000, materialLow: 26400, materialHigh: 42000, timeHours: 480, category: 'Garages', unit: 'project' },
  { name: 'Detached Garage (per sq ft)', laborRate: 72, materialLow: 48, materialHigh: 84, timeHours: 0.5, category: 'Garages', unit: 'sq ft' },
  { name: 'Garage Conversion to Living Space', laborRate: 18000, materialLow: 12000, materialHigh: 24000, timeHours: 240, category: 'Garages', unit: 'project' },
  
  // Outdoor Living
  { name: 'Covered Patio (per sq ft)', laborRate: 54, materialLow: 30, materialHigh: 60, timeHours: 0.4, category: 'Outdoor Living', unit: 'sq ft' },
  { name: 'Pergola Installation (per sq ft)', laborRate: 48, materialLow: 24, materialHigh: 54, timeHours: 0.35, category: 'Outdoor Living', unit: 'sq ft' },
  { name: 'Gazebo Installation (8x8)', laborRate: 3600, materialLow: 3000, materialHigh: 7200, timeHours: 40, category: 'Outdoor Living', unit: 'project' },
  { name: 'Outdoor Kitchen (Basic)', laborRate: 9600, materialLow: 6000, materialHigh: 14400, timeHours: 80, category: 'Outdoor Living', unit: 'project' },
  { name: 'Outdoor Kitchen (Premium)', laborRate: 18000, materialLow: 14400, materialHigh: 36000, timeHours: 150, category: 'Outdoor Living', unit: 'project' },
  { name: 'Built-in Fire Pit', laborRate: 1800, materialLow: 960, materialHigh: 3000, timeHours: 24, category: 'Outdoor Living', unit: 'project' },
  { name: 'Outdoor Fireplace', laborRate: 4800, materialLow: 3600, materialHigh: 9600, timeHours: 60, category: 'Outdoor Living', unit: 'project' },
  
  // Attic & Basement Conversions
  { name: 'Attic Conversion (per sq ft)', laborRate: 144, materialLow: 84, materialHigh: 144, timeHours: 0.8, category: 'Conversions', unit: 'sq ft' },
  { name: 'Dormer Addition for Attic', laborRate: 9600, materialLow: 6000, materialHigh: 14400, timeHours: 120, category: 'Conversions', unit: 'project' },
  { name: 'Crawl Space Encapsulation (per sq ft)', laborRate: 9.6, materialLow: 4.8, materialHigh: 9.6, timeHours: 0.1, category: 'Conversions', unit: 'sq ft' },
];

export default function AdditionsCalculator() {
  const [selectedService, setSelectedService] = useState<ServiceRate | null>(null);
  const [quantity, setQuantity] = useState(200);
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
            Additions & Porches <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto animate-fade-in-up stagger-1 opacity-0">
            Estimate costs for room additions, screened porches, decks, and outdoor living spaces in the Greenville area
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
                <h3 className="font-bold text-yellow-900 mb-2">Estimate Disclaimer</h3>
                <p className="text-yellow-800 text-sm leading-relaxed">
                  These calculations are for <strong>estimating purposes only</strong>. Actual costs for additions and outdoor structures vary significantly based on foundation requirements, structural engineering, zoning regulations, permits, site preparation, utilities, material selections, and architectural features. A detailed site assessment and architectural plans are required for accurate pricing. Contact us for a free consultation and detailed quote.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Addition Type</h2>
                
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
                        {selectedService.unit === 'linear ft' && 'Enter linear feet'}
                        {selectedService.unit === 'step' && 'Number of steps'}
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
                              onChange={(e) => setMaterialQuality(e.target.value as any)}
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
              <Icon name="MapPin" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Greenville Area Rates</h3>
              <p className="text-sm text-gray-600">
                Based on current Greenville, SC construction rates
              </p>
            </Card>
            <Card className="text-center">
              <Icon name="FileCheck" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Permits Handled</h3>
              <p className="text-sm text-gray-600">
                We manage all permits and inspections
              </p>
            </Card>
            <Card className="text-center">
              <Icon name="Award" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Quality Construction</h3>
              <p className="text-sm text-gray-600">
                Built to last with premium craftsmanship
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
