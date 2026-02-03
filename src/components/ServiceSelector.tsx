'use client';

import { useEffect, useState } from 'react';

interface Service {
  id: string;
  title: string;
}

export function ServiceSelector({ 
  value, 
  onChange, 
  error,
  required = true 
}: { 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services/active')
      .then(res => res.json())
      .then(data => {
        const mappedServices = (data || []).map((s: any) => ({
          id: s.service_slug,
          title: s.service_name
        }));
        setServices(mappedServices);
      })
      .catch(err => {
        console.error('Failed to load services:', err);
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <select
      id="serviceType"
      name="serviceType"
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      required={required}
      disabled={loading}
    >
      <option value="">{loading ? 'Loading services...' : 'Select a service...'}</option>
      {services.map(service => (
        <option key={service.id} value={service.id}>{service.title}</option>
      ))}
    </select>
  );
}
