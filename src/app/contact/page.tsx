'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { businessConfig } from '@/config/business';
import { analytics } from '@/lib/analytics';
import { buildBreadcrumbSchema, buildContactPointSchema } from '@/lib/seo/schema';
import { absoluteUrl } from '@/lib/seo/site';

type GrecaptchaApi = {
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

interface FormData {
  name: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  serviceType: string;
  budgetRange: string;
  timeframe: string;
  referralSource: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  website: string; // Honeypot field
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactPage() {
  const contactSchema = buildContactPointSchema();
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Contact', url: absoluteUrl('/contact') },
  ]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    streetAddress: '',
    city: '',
    state: 'SC',
    zipCode: '',
    serviceType: '',
    budgetRange: '',
    timeframe: '',
    referralSource: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    website: '' // Honeypot field
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid zip code';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Service type is required';
    }

    if (!formData.budgetRange) {
      newErrors.budgetRange = 'Budget range is required';
    }

    if (!formData.timeframe) {
      newErrors.timeframe = 'Project timeframe is required';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred consultation date is required';
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Preferred time is required';
    }

    if (!formData.referralSource) {
      newErrors.referralSource = 'Please let us know how you heard about us';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's a bot
    if (formData.website) {
      console.log('Spam detected: honeypot filled');
      setErrors({ submit: 'Something went wrong. Please try again.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get reCAPTCHA token
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      let recaptchaToken = '';
      const grecaptcha = typeof window !== 'undefined'
        ? (window as Window & { grecaptcha?: GrecaptchaApi }).grecaptcha
        : undefined;

      if (siteKey && grecaptcha) {
        try {
          recaptchaToken = await grecaptcha.execute(siteKey, { action: 'contact_form' });
        } catch (recaptchaError) {
          console.error('reCAPTCHA error:', recaptchaError);
        }
      }

      // Use FormData for file upload support
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      // Combine address fields for backend
      const fullAddress = `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
      formDataToSend.append('address', fullAddress);
      formDataToSend.append('recaptchaToken', recaptchaToken);
      
      // Append files
      uploadedFiles.forEach((file, index) => {
        formDataToSend.append(`file${index}`, file);
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        // Track successful contact form submission
        analytics.trackContactForm(formData.serviceType || 'general');
        
        setSubmitSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          streetAddress: '',
          city: '',
          state: 'SC',
          zipCode: '',
          serviceType: '',
          budgetRange: '',
          timeframe: '',
          referralSource: '',
          description: '',
          preferredDate: '',
          preferredTime: '',
          website: ''
        });
        setUploadedFiles([]);
        setUploadError('');
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || 'Something went wrong. Please try again or call us directly.' });
      }
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again or call us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const files = Array.from(e.target.files || []);
    
    // Validate file size (max 10MB per file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const invalidFiles = files.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      setUploadError(`Some files are too large. Maximum size is 10MB per file.`);
      return;
    }
    
    // Limit total files to 5
    const totalFiles = uploadedFiles.length + files.length;
    if (totalFiles > 5) {
      setUploadError(`Maximum 5 files allowed. You can upload ${5 - uploadedFiles.length} more file(s).`);
      return;
    }
    
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadError('');
  };

  if (submitSuccess) {
    return (
      <>
        <section className="relative bg-linear-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in backdrop-blur">
              <Icon name="Check" className="text-blue-300" size={48} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">Thank You!</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in-up stagger-1 opacity-0">
              We've received your request and will get back to you within 24 hours.
            </p>
          </div>
        </section>

        <Section background="white" padding="lg">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side - Call to action */}
              <div className="text-center md:text-left">
                <p className="text-lg text-gray-600 mb-6">
                  If you need immediate assistance, please give us a call.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                  <Button variant="primary" size="lg" href="/">
                    Return to Home
                  </Button>
                  <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`}>
                    <Icon name="Phone" size={20} />
                    Call Now
                  </Button>
                </div>
              </div>

              {/* Right side - What Happens Next */}
              <Card padding="lg" className="bg-blue-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">What Happens Next?</h3>
                <ul className="list-none space-y-4 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                    <span className="pt-0.5">We review your request and reach out within one business day to confirm details.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                    <span className="pt-0.5">We schedule a convenient time to visit your property and walk through the scope.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                    <span className="pt-0.5">You receive a written estimate with scope, allowances, timeline, and payment milestones.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                    <span className="pt-0.5">Once approved, we schedule your project start date and assign a dedicated project lead.</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Load reCAPTCHA only on contact page to prevent forced reflows site-wide */}
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      )}

      <section className="relative bg-linear-to-br from-blue-900 via-blue-800 to-gray-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Get Your <span className="gradient-text">Free Estimate</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto animate-fade-in-up stagger-1 opacity-0">
            Tell us about your project and we'll get back to you with a detailed estimate
          </p>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <Card padding="lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Smith"
                      required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                      required
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                    required
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="streetAddress" className="block text-sm font-semibold text-gray-900 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 ${
                      errors.streetAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 Main Street"
                    required
                  />
                  {errors.streetAddress && <p className="mt-1 text-sm text-red-500">{errors.streetAddress}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Simpsonville"
                      required
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-900 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                      <option value="DC">Washington DC</option>
                    </select>
                    {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-900 mb-2">
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="29681"
                      maxLength={10}
                      required
                    />
                    {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-900 mb-2">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        errors.serviceType ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select a service...</option>
                      <option value="additions">Home Additions</option>
                      <option value="garages">Garages</option>
                      <option value="outdoor-living">Outdoor Living</option>
                      <option value="outdoor-living/decks">Decks</option>
                      <option value="outdoor-living/screened-porches">Screened Porches</option>
                      <option value="outdoor-living/covered-patios">Covered Patios</option>
                      <option value="remodeling">Remodeling</option>
                      <option value="commercial-upfits">Commercial Upfits</option>
                    </select>
                    {errors.serviceType && <p className="mt-1 text-sm text-red-500">{errors.serviceType}</p>}
                  </div>

                  <div>
                    <label htmlFor="budgetRange" className="block text-sm font-semibold text-gray-900 mb-2">
                      Budget Range <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        errors.budgetRange ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select budget range...</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-15k">$5,000 - $15,000</option>
                      <option value="15k-30k">$15,000 - $30,000</option>
                      <option value="30k-50k">$30,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="over-100k">Over $100,000</option>
                      <option value="flexible">Flexible/Not Sure</option>
                    </select>
                    {errors.budgetRange && <p className="mt-1 text-sm text-red-500">{errors.budgetRange}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="timeframe" className="block text-sm font-semibold text-gray-900 mb-2">
                      Project Timeframe <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="timeframe"
                      name="timeframe"
                      value={formData.timeframe}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        errors.timeframe ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select timeframe...</option>
                      <option value="asap">As Soon As Possible</option>
                      <option value="within-month">Within 1 Month</option>
                      <option value="1-3-months">1-3 Months</option>
                      <option value="3-6-months">3-6 Months</option>
                      <option value="planning">Just Planning</option>
                    </select>
                    {errors.timeframe && <p className="mt-1 text-sm text-red-500">{errors.timeframe}</p>}
                  </div>

                  <div>
                    <label htmlFor="referralSource" className="block text-sm font-semibold text-gray-900 mb-2">
                      How Did You Hear About Us? <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="referralSource"
                      name="referralSource"
                      value={formData.referralSource}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        errors.referralSource ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select source...</option>
                      <option value="google">Google Search</option>
                      <option value="facebook">Facebook</option>
                      <option value="referral">Friend/Family Referral</option>
                      <option value="previous-customer">Previous Customer</option>
                      <option value="yard-sign">Yard Sign</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.referralSource && <p className="mt-1 text-sm text-red-500">{errors.referralSource}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredDate" className="block text-sm font-semibold text-gray-900 mb-2">
                      Preferred Consultation Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        errors.preferredDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.preferredDate && <p className="mt-1 text-sm text-red-500">{errors.preferredDate}</p>}
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-semibold text-gray-900 mb-2">
                      Preferred Time <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        errors.preferredTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select time...</option>
                      <option value="morning">Morning (8am-12pm)</option>
                      <option value="afternoon">Afternoon (12pm-4pm)</option>
                      <option value="evening">Evening (4pm-7pm)</option>
                      <option value="flexible">Flexible</option>
                    </select>
                    {errors.preferredTime && <p className="mt-1 text-sm text-red-500">{errors.preferredTime}</p>}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Requested dates and times are not guaranteed but we will do our best to accommodate your schedule. We'll confirm your appointment within 24 hours.
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about your project... What work needs to be done? Any specific requirements or concerns?"
                    required
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Upload Images or Documents <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="fileUpload"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="fileUpload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Icon name="Upload" size={32} className="text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700 mb-1">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, PDF, DOC up to 10MB each (max 5 files)
                      </span>
                    </label>
                  </div>
                  
                  {uploadError && (
                    <p className="mt-2 text-sm text-red-500">{uploadError}</p>
                  )}
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Icon name="File" size={16} className="text-blue-600 shrink-0" />
                            <span className="text-sm text-gray-700 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 shrink-0">
                              ({(file.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 shrink-0 ml-2"
                            aria-label="Remove file"
                          >
                            <Icon name="X" size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    💡 Tip: Upload photos of the area, inspiration images, or reference documents to help us better understand your project.
                  </p>
                </div>

                {/* Honeypot field - hidden from humans, visible to bots */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.submit}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Submit Request'}
                  {!isSubmitting && <Icon name="ArrowRight" size={20} />}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to be contacted about your project. We respect your privacy and will never share your information.
                </p>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="sr-only">How to Reach Us</h2>
            <Card padding="lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="Phone" className="text-blue-600 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href={`tel:${businessConfig.contact.phone}`} className="text-blue-600 hover:underline">
                      {businessConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="Mail" className="text-blue-600 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href={`mailto:${businessConfig.contact.email}`} className="text-blue-600 hover:underline">
                      {businessConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="MapPin" className="text-blue-600 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Service Area</p>
                    <p className="text-gray-600">{businessConfig.contact.city}, {businessConfig.contact.state}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="Clock" className="text-blue-600 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Business Hours</p>
                    <p className="text-gray-600 whitespace-pre-line text-sm">{businessConfig.contact.hours}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="bg-blue-50">
              <h3 className="text-lg font-bold text-gray-900 mb-3">What Happens Next?</h3>
              <ul className="list-none space-y-4 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                  <span className="pt-0.5">We review your request and reach out within one business day to confirm details.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span className="pt-0.5">We schedule a convenient time to visit your property and walk through the scope.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                  <span className="pt-0.5">You receive a written estimate with scope, allowances, timeline, and payment milestones.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                  <span className="pt-0.5">Once approved, we schedule your project start date and assign a dedicated project lead.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
