'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { SUBCONTRACTOR_SPECIALTIES } from '@/types/subcontractor';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function SubcontractorJoinPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formStartTime, setFormStartTime] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      
      // Get all checked specialties
      const specialties = formData.getAll('specialties');
      
      // Get reCAPTCHA token (guarded — don't fail if grecaptcha isn't loaded)
      let recaptchaToken = '';
      try {
        const siteKey = (process.env as any).NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (siteKey && typeof window !== 'undefined' && (window as any).grecaptcha) {
          try {
            // Use grecaptcha.ready when available to ensure the library is initialized
            const grecaptcha = (window as any).grecaptcha;
            if (typeof grecaptcha.ready === 'function') {
              await new Promise<void>((resolve) => grecaptcha.ready(resolve));
            }
            recaptchaToken = await grecaptcha.execute(siteKey, { action: 'subcontractor_apply' });
          } catch (recaptchaError) {
            console.error('reCAPTCHA error:', recaptchaError);
          }
        }
      } catch (e) {
        console.error('Error obtaining reCAPTCHA token:', e);
      }

      // Time-based bot detection (form filled too quickly)
      const timeTaken = Date.now() - formStartTime;
      
      const data = {
        company_name: formData.get('company_name'),
        contact_name: formData.get('contact_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        business_type: formData.get('business_type'),
        years_in_business: formData.get('years_in_business'),
        license_number: formData.get('license_number'),
        insurance_provider: formData.get('insurance_provider'),
        insurance_expiry: formData.get('insurance_expiry'),
        specialties,
        website: formData.get('website'), // honeypot
        recaptchaToken,
        formTimeTaken: timeTaken, // Send time taken for server-side validation
      };

      const res = await fetch('/api/subcontractors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        // Close modal and show success page
        setShowForm(false);
        setSubmitSuccess(true);
        // Clear the form fields so reopening the modal shows a fresh form
        try {
          e.currentTarget.reset();
        } catch (resetErr) {
          // ignore if reset is not available
        }
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitMessage(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Prevent background scrolling when modal is open and move focus
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Set form start time for bot detection
    if (showForm && formStartTime === 0) {
      setFormStartTime(Date.now());
    }
    if (showForm) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // focus the first input in the modal when opened
      setTimeout(() => {
        try { firstInputRef.current?.focus(); } catch (e) {}
      }, 50);
      return () => { document.body.style.overflow = prev; };
    }
  }, [showForm]);

  // Show success page if submission was successful
  if (submitSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Application Received!</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Thank you for applying to join our subcontractor network.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              We'll review your application and contact you within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setSubmitSuccess(false)}
                className="bg-white text-blue-900 px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-50 transition shadow-lg"
              >
                Back to Home
              </button>
              <a
                href="/tradesmen"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition shadow-lg"
              >
                Login to Portal
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Load reCAPTCHA only on subcontractor form pages */}
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      )}
      {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
              <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">Join Our Subcontractor Network</h1>
              <p className="text-base sm:text-2xl mb-6 sm:mb-8 text-blue-100">
                Partner with Burch Contracting and grow your business
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => setShowForm(true)}
                  className="bg-white text-blue-900 px-6 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-xl font-bold hover:bg-blue-50 transition shadow-lg btn-primary"
                >
                  Apply Now
                </button>
                <a
                  href="/tradesmen"
                  className="bg-blue-800 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-xl font-bold hover:bg-blue-900 transition shadow-lg border-2 border-white"
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Why Partner With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Steady Work</h3>
                <p className="text-gray-700">
                  Access to consistent project opportunities throughout the year. We keep our best partners busy.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Fair Pricing</h3>
                <p className="text-gray-700">
                  Competitive rates and transparent bidding process. Your work is valued and compensated fairly.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast Payments</h3>
                <p className="text-gray-700">
                  Net 30 payment terms or less with reliable, on-time payments. No chasing down checks.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Long-Term Relationships</h3>
                <p className="text-gray-700">
                  We build partnerships, not just transactions. Grow with us as a preferred contractor.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Professional Projects</h3>
                <p className="text-gray-700">
                  Work on quality residential and commercial projects with clear specifications and expectations.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Digital Platform</h3>
                <p className="text-gray-700">
                  Easy online bidding, document management, and communication through our contractor portal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Apply</h3>
                <p className="text-gray-700">
                  Fill out our simple application form with your company details and specialties.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Review</h3>
                <p className="text-gray-700">
                  Our team reviews your application and verifies credentials within 48 hours.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Onboard</h3>
                <p className="text-gray-700">
                  Submit required documents and get access to our contractor portal.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Start Bidding</h3>
                <p className="text-gray-700">
                  Browse available projects and submit bids on jobs that fit your expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                📱 Install the Mobile App
              </h2>
              <p className="text-xl text-green-100">
                Work on the go - Access your projects from your phone!
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">For iPhone Users (Safari)</h3>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                      <span>Go to <strong>burchcontracting.com/tradesmen</strong> and login</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                      <span>Tap the <strong>Share</strong> button (box with arrow)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
                      <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">4</span>
                      <span>Tap <strong>"Add"</strong> in the top right</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">✓</span>
                      <span>The app icon will appear on your home screen!</span>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">For Android Users (Chrome)</h3>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                      <span>Go to <strong>burchcontracting.com/tradesmen</strong> and login</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                      <span>Tap the <strong>"Install"</strong> button that appears at the top</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
                      <span>OR tap the <strong>three dots menu</strong> (⋮)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">4</span>
                      <span>Select <strong>"Add to Home screen"</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">✓</span>
                      <span>The app icon will appear on your home screen!</span>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">⚡</span>
                  App Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>View assigned projects</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Upload project photos</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Track time and materials</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Report issues instantly</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Communicate with office</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Works offline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Requirements
            </h2>
            <div className="bg-white p-10 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Valid Business License</h3>
                    <p className="text-gray-600">Current and active business license in your state</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900">General Liability Insurance</h3>
                    <p className="text-gray-600">Minimum $1M coverage required</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900">W-9 Form</h3>
                    <p className="text-gray-600">For tax reporting purposes</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Professional References</h3>
                    <p className="text-gray-600">Contact information for previous clients</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Minimum 2 Years Experience</h3>
                    <p className="text-gray-600">In your specialized trade</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Own Tools & Equipment</h3>
                    <p className="text-gray-600">Professional-grade tools for your trade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties We Need */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Trades We're Looking For
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {SUBCONTRACTOR_SPECIALTIES.map((specialty) => (
                <div 
                  key={specialty}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center font-semibold text-gray-700"
                >
                  {specialty}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Join Our Team?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Take the first step toward a profitable partnership
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-900 px-10 py-4 rounded-lg text-xl font-bold hover:bg-blue-50 transition shadow-lg"
            >
              Submit Application
            </button>
          </div>
        </section>

        {/* Application Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
              <div className="min-h-screen flex items-start sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Subcontractor application dialog">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 sm:mx-0 my-8 modal-content">
                <div className="p-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                  <h2 id="subcontractor-application-title" className="text-3xl font-bold text-gray-900">Subcontractor Application</h2>
                  <button 
                    onClick={() => setShowForm(false)}
                    aria-label="Close application dialog"
                    className="text-gray-500 hover:text-gray-700 text-3xl"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Subcontractor application form">
                  {/* Honeypot field - improved anti-autofill */}
                  <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                    <label htmlFor="website_url">Website (leave blank)</label>
                    <input
                      type="text"
                      id="website_url"
                      name="website"
                      tabIndex={-1}
                      autoComplete="new-password"
                      placeholder=""
                      aria-hidden="true"
                    />
                  </div>

                  {/* Submit message */}
                  {submitMessage && (
                    <div className={`p-4 rounded-lg ${submitMessage.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {submitMessage}
                    </div>
                  )}

                  {/* Company Information */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="company_name">Company Name *</label>
                        <input 
                          id="company_name"
                          ref={firstInputRef}
                          type="text" 
                          name="company_name"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Contact Name *</label>
                        <input 
                          type="text" 
                          name="contact_name"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Email *</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Phone *</label>
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Business Address</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Street Address *</label>
                        <input 
                          type="text" 
                          name="address"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">City *</label>
                          <input 
                            type="text" 
                            name="city"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">State *</label>
                          <input 
                            type="text" 
                            name="state"
                            required
                            maxLength={2}
                            placeholder="SC"
                            className="w-full border border-gray-300 rounded-lg p-3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">ZIP *</label>
                          <input 
                            type="text" 
                            name="zip"
                            required
                            pattern="[0-9]{5}"
                            placeholder="29601"
                            className="w-full border border-gray-300 rounded-lg p-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Business Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Business Type *</label>
                        <select 
                          name="business_type"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        >
                          <option value="">Select...</option>
                          <option value="sole_proprietor">Sole Proprietor</option>
                          <option value="llc">LLC</option>
                          <option value="corporation">Corporation</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Years in Business *</label>
                        <input 
                          type="number" 
                          name="years_in_business"
                          min="0"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">License Number</label>
                        <input 
                          type="text" 
                          name="license_number"
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Insurance Provider</label>
                        <input 
                          type="text" 
                          name="insurance_provider"
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Insurance Expiry Date</label>
                        <input 
                          type="date" 
                          name="insurance_expiry"
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Your Specialties *</h3>
                    <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-56 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {SUBCONTRACTOR_SPECIALTIES.map((specialty) => (
                        <label key={specialty} className="flex items-center space-x-2 cursor-pointer hover:bg-white hover:shadow-sm rounded p-1 transition">
                          <input 
                            type="checkbox" 
                            name="specialties"
                            value={specialty}
                            className="rounded"
                          />
                          <span className="text-sm">{specialty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                    <button 
                      type="button"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          </div>
        )}
      </main>
    );
  }

  
