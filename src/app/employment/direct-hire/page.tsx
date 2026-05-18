'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Icon } from '@/components/ui/Icon';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const POSITIONS = [
  'Carpenter',
  'Plumber',
  'Electrician',
  'HVAC Technician',
  'General Laborer',
  'Project Manager',
  'Estimator',
  'Office Administrator',
  'Other',
];

const EXPERIENCE_LEVELS = [
  'Entry Level (0-2 years)',
  'Intermediate (2-5 years)',
  'Experienced (5-10 years)',
  'Expert (10+ years)',
];

export default function DirectHireEmployeesPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formStartTime, setFormStartTime] = useState<number>(0);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');
    setResumeError('');

    try {
      const formData = new FormData(e.currentTarget);
      
      // Get reCAPTCHA token (guarded — don't fail if grecaptcha isn't loaded)
      let recaptchaToken = '';
      try {
        const siteKey = (process.env as any).NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (siteKey && typeof window !== 'undefined' && (window as any).grecaptcha) {
          try {
            const grecaptcha = (window as any).grecaptcha;
            if (typeof grecaptcha.ready === 'function') {
              await new Promise<void>((resolve) => grecaptcha.ready(resolve));
            }
            recaptchaToken = await grecaptcha.execute(siteKey, { action: 'employee_apply' });
          } catch (recaptchaError) {
            console.error('reCAPTCHA error:', recaptchaError);
          }
        }
      } catch (e) {
        console.error('Error obtaining reCAPTCHA token:', e);
      }

      // Time-based bot detection
      const timeTaken = Date.now() - formStartTime;
      
      // Handle resume file if present
      let resumeBase64 = '';
      let resumeFileName = '';
      let resumeFileSize = 0;
      if (resume) {
        resumeFileName = resume.name;
        resumeFileSize = resume.size;
        const reader = new FileReader();
        resumeBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            // Extract base64 data without the data:mime;base64, prefix
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(resume);
        });
      }
      
      const data = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        position: formData.get('position'),
        experience_level: formData.get('experience_level'),
        years_experience: formData.get('years_experience'),
        certifications: formData.get('certifications'),
        bio: formData.get('bio'),
        website: formData.get('website'), // honeypot
        recaptchaToken,
        formTimeTaken: timeTaken,
        resume: resumeBase64,
        resumeFileName,
        resumeFileSize,
      };

      const res = await fetch('/api/employment/direct-hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setShowForm(false);
        setSubmitSuccess(true);
        setResume(null);
        try {
          e.currentTarget.reset();
        } catch (resetErr) {
          // ignore
        }
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

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (showForm && formStartTime === 0) {
      setFormStartTime(Date.now());
    }
    if (showForm) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        try { firstInputRef.current?.focus(); } catch (e) {}
      }, 50);
      return () => { document.body.style.overflow = prev; };
    }
  }, [showForm, formStartTime]);

  // Success page
  if (submitSuccess) {
    return (
      <main className="min-h-screen bg-linear-to-b from-green-50 to-white">
        <section className="relative bg-linear-to-br from-gray-900 via-green-900 to-gray-900 text-white py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Check" size={48} className="text-green-300" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Application Received!</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Thank you for your interest in joining Burch Contracting.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              We'll review your application and contact you within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setSubmitSuccess(false)}
                className="bg-white text-green-900 px-8 py-3 rounded-lg text-lg font-bold hover:bg-green-50 transition shadow-lg"
              >
                Back to Home
              </button>
              <a
                href="/employment"
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-green-700 transition shadow-lg"
              >
                Employment Opportunities
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Load reCAPTCHA only on employment form pages */}
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      )}
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <a href="/employment" className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold">
          <Icon name="ChevronLeft" size={18} />
          <span>Back to Employment</span>
        </a>
      </div>

      {/* Hero Section */}
      <section className="bg-linear-to-r from-green-900 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">Direct Hire Employment</h1>
            <p className="text-base sm:text-2xl mb-6 sm:mb-8 text-green-100">
              Join Our Team and Build Your Career With Burch Contracting
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setShowForm(true)}
                className="bg-white text-green-900 px-6 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-xl font-bold hover:bg-green-50 transition shadow-lg"
              >
                Apply Now
              </button>
              <a
                href="/employment"
                className="bg-green-800 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-xl font-bold hover:bg-green-900 transition shadow-lg border-2 border-white"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Join Burch Contracting?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Competitive Wages</h3>
              <p className="text-gray-700">
                Earn competitive pay based on your experience and position. We believe in fair compensation for quality work.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🏥</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Benefits Package</h3>
              <p className="text-gray-700">
                Health insurance, dental coverage, 401(k) retirement plan, and paid time off for all full-time employees.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Growth Opportunities</h3>
              <p className="text-gray-700">
                Advance your skills and career with training opportunities and leadership roles within our growing company.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Team Environment</h3>
              <p className="text-gray-700">
                Work with experienced professionals who value collaboration, safety, and quality craftsmanship.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🛠️</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Equipment & Training</h3>
              <p className="text-gray-700">
                We provide the tools and training you need. Safety equipment and ongoing education included.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Steady Work</h3>
              <p className="text-gray-700">
                Consistent, reliable work schedule with established local customer base in Upstate South Carolina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            The Hiring Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Apply</h3>
              <p className="text-gray-700">
                Fill out our application form with your work history and qualifications.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Interview</h3>
              <p className="text-gray-700">
                We'll contact you to schedule an interview to learn about your experience and goals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Background Check</h3>
              <p className="text-gray-700">
                Standard background verification to ensure a safe working environment for all.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Onboard & Start</h3>
              <p className="text-gray-700">
                Complete paperwork and safety training, then start your career with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-green-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Apply Now</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-white hover:bg-green-700 p-2 rounded"
              >
                <Icon name="X" size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {submitMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {submitMessage}
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="User" size={20} />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      name="first_name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Phone" size={20} />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="MapPin" size={20} />
                  Address
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Briefcase" size={20} />
                  Employment Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position Interested In *
                    </label>
                    <select
                      name="position"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">-- Select Position --</option>
                      {POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level *
                    </label>
                    <select
                      name="experience_level"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">-- Select Level --</option>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Work Experience
                  </label>
                  <input
                    type="number"
                    name="years_experience"
                    min="0"
                    max="70"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Award" size={20} />
                  Qualifications
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Licenses & Certifications
                  </label>
                  <textarea
                    name="certifications"
                    placeholder="List any relevant licenses, certifications, or training (e.g., EPA, OSHA, First Aid CPR, etc.)"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* About You */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="MessageSquare" size={20} />
                  About You
                </h3>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell Us About Yourself
                </label>
                <textarea
                  name="bio"
                  placeholder="Share your work experience, skills, and why you'd like to join Burch Contracting..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Upload" size={20} />
                  Resume / Application
                </h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Your Resume (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition flex items-center gap-2">
                      <Icon name="Paperclip" size={18} />
                      Choose File
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Validate file size (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              setResumeError('File size must be less than 5MB');
                              setResume(null);
                              e.target.value = '';
                              return;
                            }
                            // Validate file type
                            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
                            if (!validTypes.includes(file.type)) {
                              setResumeError('Please upload a PDF, DOC, DOCX, or TXT file');
                              setResume(null);
                              e.target.value = '';
                              return;
                            }
                            setResumeError('');
                            setResume(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {resume && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{resume.name}</span>
                        <button
                          type="button"
                          onClick={() => setResume(null)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Icon name="X" size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                  {resumeError && (
                    <p className="text-sm text-red-600">{resumeError}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Accepted formats: PDF, DOC, DOCX, TXT (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Honeypot field */}
              <input
                type="hidden"
                name="website"
                style={{ display: 'none' }}
              />

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
