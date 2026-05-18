'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

// Lazy load heavy PDF libraries only when needed
// This reduces initial bundle size by ~400KB

interface CalculatorResult {
  total: number;
  breakdown: {
    label: string;
    value: number;
    description?: string;
  }[];
  inputs: Record<string, any>;
  projectType: string;
  timestamp: Date;
}

interface AdvancedCalculatorProps {
  result: CalculatorResult;
  onShowMathChange?: (show: boolean) => void;
  onSave?: () => void;
  onPrint?: () => void;
  onRequestQuote?: () => void;
  className?: string;
}

export const AdvancedCalculator: React.FC<AdvancedCalculatorProps> = ({
  result,
  onShowMathChange,
  onSave,
  onPrint,
  onRequestQuote,
  className = ''
}) => {
  const [showMath, setShowMath] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const toggleShowMath = () => {
    const newValue = !showMath;
    setShowMath(newValue);
    onShowMathChange?.(newValue);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      const savedEstimates = JSON.parse(localStorage.getItem('burch-estimates') || '[]');
      savedEstimates.push({
        ...result,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('burch-estimates', JSON.stringify(savedEstimates));
      
      onSave?.();
      
      // Show success message
      toast.success('Estimate saved successfully! You can access it later from your browser.');
    } catch (error) {
      console.error('Error saving estimate:', error);
      toast.error('Failed to save estimate. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    try {
      window.print();
      onPrint?.();
    } finally {
      setTimeout(() => setIsPrinting(false), 1000);
    }
  };

  const handleGeneratePDF = async () => {
    if (!resultRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      // Dynamically import heavy libraries only when PDF button is clicked
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      
      // Capture the calculator result as canvas
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text('Burch Contracting - (864) 724-4600', 105, 290, { align: 'center' });
      pdf.text('1095 Water Tank Rd, Gray Court, SC 29645', 105, 295, { align: 'center' });
      
      // Download
      const fileName = `burch-${result.projectType.toLowerCase().replace(/\s+/g, '-')}-estimate-${Date.now()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try printing instead.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Actions Bar */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleShowMath}
              variant={showMath ? 'primary' : 'outline'}
              size="sm"
              className="gap-2"
            >
              <Icon name={showMath ? 'EyeOff' : 'Eye'} size={16} />
              {showMath ? 'Hide' : 'Show'} Calculation Details
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              disabled={isSaving}
              className="gap-2"
            >
              <Icon name={isSaving ? 'Loader' : 'Save'} size={16} className={isSaving ? 'animate-spin' : ''} />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>

            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              disabled={isPrinting}
              className="gap-2"
            >
              <Icon name="Printer" size={16} />
              Print
            </Button>

            <Button
              onClick={handleGeneratePDF}
              variant="outline"
              size="sm"
              disabled={isGeneratingPDF}
              className="gap-2"
            >
              <Icon name={isGeneratingPDF ? 'Loader' : 'FileText'} size={16} className={isGeneratingPDF ? 'animate-spin' : ''} />
              {isGeneratingPDF ? 'Generating...' : 'PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Calculator Result */}
      <div ref={resultRef} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6">
          <h3 className="text-2xl font-bold mb-2">{result.projectType} Estimate</h3>
          <p className="text-blue-100 text-sm">
            Generated {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
          </p>
        </div>

        {/* Total */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated Total Cost</p>
              <p className="text-4xl font-bold text-gray-900">{formatCurrency(result.total)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">±10% accuracy</p>
              <p className="text-xs text-gray-500">Final quote may vary</p>
            </div>
          </div>
        </div>

        {/* Breakdown (Show Math) */}
        {showMath && result.breakdown.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
            <div className="space-y-3">
              {result.breakdown.map((item, index) => (
                <div key={index} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 ml-4">
                    {formatCurrency(item.value)}
                  </p>
                </div>
              ))}
              
              {/* Total Row */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-gray-300">
                <p className="text-base font-bold text-gray-900">Total Estimated Cost</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(result.total)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Project Details */}
        <div className="p-6 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Your Project Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(result.inputs).map(([key, value]) => (
              <div key={key} className="bg-white rounded p-3 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {typeof value === 'number' ? (key.toLowerCase().includes('price') || key.toLowerCase().includes('cost') ? formatCurrency(value) : value) : String(value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-start gap-2">
            <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-700">
              <strong>Important:</strong> This is a rough estimate only. Final pricing depends on site conditions, 
              material availability, and specific project requirements. Request a free on-site quote for accurate pricing.
            </p>
          </div>
        </div>
      </div>

      {/* Get Official Quote CTA */}
      <div className="bg-linear-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6">
        <div className="text-center">
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            Ready to Get Started?
          </h4>
          <p className="text-gray-600 mb-4">
            Get a free, no-obligation on-site quote from our expert team
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={onRequestQuote}
              variant="primary"
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              <Icon name="FileText" size={20} />
              Request Free Quote
            </Button>
            <Button
              href="tel:8647244600"
              variant="outline"
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              <Icon name="Phone" size={20} />
              Call (864) 724-4600
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Most quotes delivered within 24-48 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCalculator;
