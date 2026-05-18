'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { businessConfig } from '@/config/business';

interface FormData {
  // Step 1: Project Type
  projectType: string;
  
  // Step 2: Project Details
  projectSize: string;
  timeline: string;
  budget: string;
  
  // Step 3: Location
  address: string;
  city: string;
  zip: string;
  
  // Step 4: Contact
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  
  // Additional
  notes: string;
}

interface MultiStepEstimateFormProps {
  onSubmit?: (data: FormData) => void;
  className?: string;
}

export const MultiStepEstimateForm: React.FC<MultiStepEstimateFormProps> = ({
  onSubmit,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    projectSize: '',
    timeline: '',
    budget: '',
    address: '',
    city: '',
    zip: '',
    name: '',
    email: '',
    phone: '',
    preferredContact: 'phone',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const projectTypes = [
    { value: 'deck', label: 'Custom Deck', icon: 'Home' },
    { value: 'porch', label: 'Screened Porch', icon: 'Home' },
    { value: 'garage', label: 'Garage', icon: 'Car' },
    { value: 'addition', label: 'Home Addition', icon: 'PlusSquare' },
    { value: 'kitchen', label: 'Kitchen Remodel', icon: 'Utensils' },
    { value: 'bathroom', label: 'Bathroom Remodel', icon: 'Droplet' },
    { value: 'basement', label: 'Basement Finishing', icon: 'Layers' },
    { value: 'other', label: 'Other Project', icon: 'Tool' }
  ];

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user updates field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.projectType) newErrors.projectType = 'Please select a project type';
    }

    if (step === 2) {
      if (!formData.projectSize) newErrors.projectSize = 'Please select project size';
      if (!formData.timeline) newErrors.timeline = 'Please select a timeline';
      if (!formData.budget) newErrors.budget = 'Please select a budget range';
    }

    if (step === 3) {
      if (!formData.city) newErrors.city = 'Please enter your city';
      if (!formData.zip) newErrors.zip = 'Please enter your ZIP code';
      else if (!/^\d{5}$/.test(formData.zip)) newErrors.zip = 'Please enter a valid 5-digit ZIP code';
    }

    if (step === 4) {
      if (!formData.name) newErrors.name = 'Please enter your name';
      if (!formData.email && !formData.phone) {
        newErrors.email = 'Please provide email or phone';
        newErrors.phone = 'Please provide email or phone';
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Submit form data
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Here you would typically send to an API
      console.log('Form submitted:', formData);
      
      // Show success message or redirect
      toast.success('Thank you! Your estimate request has been submitted. We\'ll contact you within 24 hours.');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('There was an error submitting your request. Please try calling us at ' + businessConfig.contact.phone);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">What type of project do you need?</h3>
              <p className="text-gray-600 mb-6">Select the service that best matches your needs</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {projectTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateField('projectType', type.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-center hover:shadow-md ${
                    formData.projectType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon name={type.icon as any} size={32} className="mx-auto mb-2 text-gray-700" />
                  <div className="text-sm font-medium text-gray-900">{type.label}</div>
                </button>
              ))}
            </div>
            
            {errors.projectType && <p className="text-red-600 text-sm">{errors.projectType}</p>}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tell us about your project</h3>
              <p className="text-gray-600 mb-6">This helps us provide an accurate estimate</p>
            </div>

            {/* Project Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Size
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Small', 'Medium', 'Large'].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateField('projectSize', size)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.projectSize === size
                        ? 'border-blue-600 bg-blue-50 font-semibold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.projectSize && <p className="text-red-600 text-sm mt-1">{errors.projectSize}</p>}
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Timeline
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => updateField('timeline', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select timeline</option>
                <option value="asap">As soon as possible</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-12-months">6-12 months</option>
                <option value="just-planning">Just planning ahead</option>
              </select>
              {errors.timeline && <p className="text-red-600 text-sm mt-1">{errors.timeline}</p>}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approximate Budget
              </label>
              <select
                value={formData.budget}
                onChange={(e) => updateField('budget', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select budget range</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10-25k">$10,000 - $25,000</option>
                <option value="25-50k">$25,000 - $50,000</option>
                <option value="50-100k">$50,000 - $100,000</option>
                <option value="over-100k">Over $100,000</option>
                <option value="not-sure">Not sure yet</option>
              </select>
              {errors.budget && <p className="text-red-600 text-sm mt-1">{errors.budget}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Project Location</h3>
              <p className="text-gray-600 mb-6">Where is your project located?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address (Optional)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="123 Main St"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Simpsonville"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => updateField('zip', e.target.value)}
                  placeholder="29681"
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.zip && <p className="text-red-600 text-sm mt-1">{errors.zip}</p>}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="MapPin" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <strong>Service Areas:</strong> {businessConfig.serviceArea.locations.join(', ')}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Information</h3>
              <p className="text-gray-600 mb-6">How should we reach you?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(864) 555-1234"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={(e) => updateField('preferredContact', e.target.value)}
                      className="mr-2"
                    />
                    Phone
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={(e) => updateField('preferredContact', e.target.value)}
                      className="mr-2"
                    />
                    Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="either"
                      checked={formData.preferredContact === 'either'}
                      onChange={(e) => updateField('preferredContact', e.target.value)}
                      className="mr-2"
                    />
                    Either
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Any additional details about your project..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`max-w-3xl mx-auto ${className}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className="flex-1 flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step < currentStep
                    ? 'bg-green-600 text-white'
                    : step === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? <Icon name="Check" size={20} /> : step}
              </div>
              {step < 4 && (
                <div className={`flex-1 h-1 mx-2 transition-all ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Project Type</span>
          <span>Details</span>
          <span>Location</span>
          <span>Contact</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          onClick={prevStep}
          variant="outline"
          disabled={currentStep === 1}
          className="gap-2"
        >
          <Icon name="ArrowLeft" size={16} />
          Previous
        </Button>

        <div className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </div>

        {currentStep < totalSteps ? (
          <Button
            onClick={nextStep}
            variant="primary"
            className="gap-2"
          >
            Next
            <Icon name="ArrowRight" size={16} />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Icon name="Loader" size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Icon name="Send" size={16} />
                Submit Request
              </>
            )}
          </Button>
        )}
      </div>

      {/* Trust Signals */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            <Icon name="Shield" size={14} className="text-green-600" />
            <span>Your information is secure</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Clock" size={14} className="text-blue-600" />
            <span>Response within 24 hours</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Award" size={14} className="text-yellow-600" />
            <span>BBB A+ Rated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepEstimateForm;
