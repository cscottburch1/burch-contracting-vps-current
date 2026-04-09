'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface QuickEstimateFormProps {
  serviceName: string;
  cityName?: string;
  className?: string;
}

export default function QuickEstimateForm({ serviceName, cityName, className = '' }: QuickEstimateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    description: '',
    website: '',
  });
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  const locationLabel = cityName ? `${serviceName} in ${cityName}` : serviceName;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.description.trim()) {
      setStatus({ type: 'error', message: 'Please complete all fields before requesting an estimate.' });
      return;
    }

    setStatus({ type: 'loading' });

    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('phone', formData.phone.trim());
      payload.append('email', formData.email.trim());
      payload.append('description', formData.description.trim());
      payload.append('serviceType', locationLabel);
      payload.append('budgetRange', 'Requesting estimate');
      payload.append('timeframe', 'Planning now');
      payload.append('referralSource', 'Local SEO landing page');
      payload.append('address', cityName ? `${cityName}, SC` : 'Upstate South Carolina');
      payload.append('website', formData.website);

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: payload,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus({ type: 'error', message: result?.error || 'Unable to submit your request right now.' });
        return;
      }

      setStatus({
        type: 'success',
        message: 'Thanks — your estimate request was sent. We will follow up shortly.',
      });
      setFormData({ name: '', phone: '', email: '', description: '', website: '' });
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong. Please call us directly at (864) 724-4600.' });
    }
  }

  return (
    <div className={`rounded-2xl border border-blue-100 bg-white p-6 shadow-xl ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900">Get Free Estimate</h3>
      <p className="mt-2 text-sm text-gray-600">
        Request pricing and timeline guidance for {locationLabel.toLowerCase()}.
      </p>

      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
          placeholder="Name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          autoComplete="name"
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
          placeholder="Phone"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          autoComplete="tel"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          autoComplete="email"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
          placeholder={`Tell us about your ${serviceName.toLowerCase()} project`}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={(event) => setFormData((current) => ({ ...current, website: event.target.value }))}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <Button type="submit" fullWidth disabled={status.type === 'loading'}>
          {status.type === 'loading' ? 'Sending Request...' : 'Get Free Estimate'}
        </Button>
      </form>

      <a
        href="tel:8647244600"
        className="mt-3 inline-flex w-full items-center justify-center rounded-lg border-2 border-blue-600 px-4 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
      >
        Call (864) 724-4600
      </a>

      {status.message && (
        <p className={`mt-3 text-sm ${status.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}
