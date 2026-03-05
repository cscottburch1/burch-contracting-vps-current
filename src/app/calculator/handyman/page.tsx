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
  // Plumbing
  { name: 'Water Heater Installation (40-50 gal)', laborRate: 594, materialLow: 528, materialHigh: 1188, timeHours: 4, category: 'Plumbing' },
  { name: 'Tankless Water Heater Installation', laborRate: 1056, materialLow: 1320, materialHigh: 3300, timeHours: 6, category: 'Plumbing' },
  { name: 'Toilet Installation', laborRate: 198, materialLow: 158.4, materialHigh: 528, timeHours: 2, category: 'Plumbing' },
  { name: 'Faucet Installation (Kitchen)', laborRate: 158.4, materialLow: 105.6, materialHigh: 462, timeHours: 1.5, category: 'Plumbing' },
  { name: 'Faucet Installation (Bathroom)', laborRate: 132, materialLow: 79.2, materialHigh: 330, timeHours: 1, category: 'Plumbing' },
  { name: 'Sink Installation', laborRate: 237.6, materialLow: 198, materialHigh: 792, timeHours: 2, category: 'Plumbing' },
  { name: 'Garbage Disposal Installation', laborRate: 171.6, materialLow: 132, materialHigh: 396, timeHours: 1.5, category: 'Plumbing' },
  { name: 'Drain Cleaning/Unclog', laborRate: 198, materialLow: 0, materialHigh: 66, timeHours: 1.5, category: 'Plumbing' },
  
  // Doors & Windows
  { name: 'Interior Door Installation', laborRate: 264, materialLow: 198, materialHigh: 660, timeHours: 2.5, category: 'Doors & Windows' },
  { name: 'Exterior Door Installation', laborRate: 462, materialLow: 396, materialHigh: 1584, timeHours: 4, category: 'Doors & Windows' },
  { name: 'Storm Door Installation', laborRate: 237.6, materialLow: 264, materialHigh: 792, timeHours: 2, category: 'Doors & Windows' },
  { name: 'Door Hardware/Lock Installation', laborRate: 105.6, materialLow: 39.6, materialHigh: 264, timeHours: 1, category: 'Doors & Windows' },
  { name: 'Window Installation (Standard)', laborRate: 330, materialLow: 330, materialHigh: 1056, timeHours: 3, category: 'Doors & Windows' },
  { name: 'Screen Door/Window Repair', laborRate: 99, materialLow: 26.4, materialHigh: 132, timeHours: 1, category: 'Doors & Windows' },
  
  // Appliances
  { name: 'Dishwasher Installation', laborRate: 237.6, materialLow: 528, materialHigh: 1584, timeHours: 2, category: 'Appliances' },
  { name: 'Microwave Installation (Over-Range)', laborRate: 198, materialLow: 198, materialHigh: 660, timeHours: 2, category: 'Appliances' },
  { name: 'Range Hood Installation', laborRate: 264, materialLow: 198, materialHigh: 1056, timeHours: 2.5, category: 'Appliances' },
  { name: 'Ceiling Fan Installation', laborRate: 198, materialLow: 105.6, materialHigh: 528, timeHours: 2, category: 'Appliances' },
  
  // Electrical
  { name: 'Light Fixture Installation', laborRate: 132, materialLow: 66, materialHigh: 396, timeHours: 1.5, category: 'Electrical' },
  { name: 'Outlet/Switch Installation', laborRate: 105.6, materialLow: 19.8, materialHigh: 66, timeHours: 1, category: 'Electrical' },
  { name: 'GFCI Outlet Installation', laborRate: 132, materialLow: 33, materialHigh: 79.2, timeHours: 1, category: 'Electrical' },
  { name: 'Dimmer Switch Installation', laborRate: 118.8, materialLow: 26.4, materialHigh: 105.6, timeHours: 1, category: 'Electrical' },
  
  // Carpentry & Trim
  { name: 'Baseboards Installation (per room)', laborRate: 330, materialLow: 132, materialHigh: 528, timeHours: 4, category: 'Carpentry' },
  { name: 'Crown Molding (per room)', laborRate: 462, materialLow: 198, materialHigh: 660, timeHours: 5, category: 'Carpentry' },
  { name: 'Shelving Installation (Custom)', laborRate: 264, materialLow: 132, materialHigh: 528, timeHours: 3, category: 'Carpentry' },
  { name: 'Cabinet Hardware Installation', laborRate: 158.4, materialLow: 39.6, materialHigh: 198, timeHours: 2, category: 'Carpentry' },
  
  // General Repairs
  { name: 'Drywall Repair (Small Hole)', laborRate: 132, materialLow: 26.4, materialHigh: 66, timeHours: 1.5, category: 'Repairs' },
  { name: 'Drywall Repair (Large Area)', laborRate: 396, materialLow: 99, materialHigh: 264, timeHours: 4, category: 'Repairs' },
  { name: 'Deck Repair (per hour)', laborRate: 112.2, materialLow: 66, materialHigh: 264, timeHours: 1, category: 'Repairs' },
  { name: 'Fence Repair (per section)', laborRate: 198, materialLow: 66, materialHigh: 264, timeHours: 2, category: 'Repairs' },
  
  // Painting Services
  { name: 'Single Room Interior Paint (12x12)', laborRate: 462, materialLow: 105.6, materialHigh: 198, timeHours: 6, category: 'Painting' },
  { name: 'Large Room Interior Paint (15x20)', laborRate: 726, materialLow: 158.4, materialHigh: 290.4, timeHours: 8, category: 'Painting' },
  { name: 'Bedroom Paint (Standard)', laborRate: 528, materialLow: 118.8, materialHigh: 211.2, timeHours: 6.5, category: 'Painting' },
  { name: 'Living Room Paint (Standard)', laborRate: 792, materialLow: 184.8, materialHigh: 330, timeHours: 9, category: 'Painting' },
  { name: 'Kitchen Paint (Walls Only)', laborRate: 594, materialLow: 132, materialHigh: 237.6, timeHours: 7, category: 'Painting' },
  { name: 'Bathroom Paint (Small)', laborRate: 369.6, materialLow: 79.2, materialHigh: 145.2, timeHours: 4, category: 'Painting' },
  { name: 'Bathroom Paint (Full)', laborRate: 501.6, materialLow: 112.2, materialHigh: 198, timeHours: 5.5, category: 'Painting' },
  { name: 'Ceiling Paint (per room)', laborRate: 396, materialLow: 92.4, materialHigh: 171.6, timeHours: 5, category: 'Painting' },
  { name: 'Accent Wall (Feature Wall)', laborRate: 237.6, materialLow: 52.8, materialHigh: 118.8, timeHours: 3, category: 'Painting' },
  { name: 'Trim & Baseboards Paint (per room)', laborRate: 290.4, materialLow: 66, materialHigh: 132, timeHours: 4, category: 'Painting' },
  { name: 'Door Painting (Interior, per door)', laborRate: 112.2, materialLow: 26.4, materialHigh: 52.8, timeHours: 1.5, category: 'Painting' },
  { name: 'Cabinet Painting (per linear foot)', laborRate: 46.2, materialLow: 13.2, materialHigh: 33, timeHours: 0.5, category: 'Painting' },
  { name: 'Exterior Door Painting', laborRate: 198, materialLow: 46.2, materialHigh: 92.4, timeHours: 2.5, category: 'Painting' },
  { name: 'Deck Staining (per 100 sq ft)', laborRate: 264, materialLow: 79.2, materialHigh: 158.4, timeHours: 3, category: 'Painting' },
  { name: 'Fence Staining (per 8ft section)', laborRate: 99, materialLow: 33, materialHigh: 66, timeHours: 1.5, category: 'Painting' },
  { name: 'Garage Interior Paint (2-car)', laborRate: 858, materialLow: 198, materialHigh: 369.6, timeHours: 10, category: 'Painting' },
  { name: 'Stairwell/Hallway Paint', laborRate: 501.6, materialLow: 118.8, materialHigh: 211.2, timeHours: 6, category: 'Painting' },
  { name: 'Popcorn Ceiling Removal & Paint', laborRate: 1056, materialLow: 198, materialHigh: 396, timeHours: 12, category: 'Painting' },
  { name: 'Exterior Trim Paint (per section)', laborRate: 264, materialLow: 66, materialHigh: 132, timeHours: 3, category: 'Painting' },
  { name: 'Shutters Paint (per pair)', laborRate: 118.8, materialLow: 33, materialHigh: 66, timeHours: 2, category: 'Painting' },
];

export default function HandymanCalculator() {
  const [selectedService, setSelectedService] = useState<ServiceRate | null>(null);
  const [quantity, setQuantity] = useState(1);
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
            <Icon name="Calculator" size={48} className="text-blue-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Handyman Services <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto animate-fade-in-up stagger-1 opacity-0">
            Get instant estimates for common handyman services based on local Greenville, SC market rates
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
                  These calculations are for <strong>estimating purposes only</strong>. Actual costs may vary based on specific project details, site conditions, material availability, permits required, and the complexity of the work. For an accurate quote tailored to your specific needs, please contact us for a free in-home consultation.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Service</h2>
                
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
                      onClick={() => setSelectedService(service)}
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
                              <Icon name="Clock" size={14} />
                              ~{service.timeHours}h
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-bold text-blue-600">
                            ${(service.laborRate + service.materialLow).toLocaleString()}
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
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
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
                          Estimated time: {(selectedService.timeHours * quantity).toFixed(1)} hours
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
                    <Icon name="Calculator" size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Select a service to see the estimate</p>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <Icon name="MapPin" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Local Rates</h3>
              <p className="text-sm text-gray-600">
                Based on current Greenville, SC market rates
              </p>
            </Card>
            <Card className="text-center">
              <Icon name="Shield" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Licensed & Insured</h3>
              <p className="text-sm text-gray-600">
                All work performed by certified professionals
              </p>
            </Card>
            <Card className="text-center">
              <Icon name="Clock" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Fast Response</h3>
              <p className="text-sm text-gray-600">
                Most projects scheduled within 3-5 business days
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
