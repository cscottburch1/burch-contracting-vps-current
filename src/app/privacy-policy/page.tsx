import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Privacy Policy | Burch Contracting',
  description:
    'Read how Burch Contracting collects, uses, and protects personal information submitted through our website and estimate forms.',
  alternates: {
    canonical: absoluteUrl('/privacy-policy'),
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-4 text-sm text-gray-600">
        Effective date: <time dateTime="2026-05-11">May 11, 2026</time>
      </p>
      <div className="mt-8 space-y-6 text-gray-700">
        <p>
          Burch Contracting collects contact and project information you submit through our website to respond to estimate requests,
          schedule consultations, and provide services.
        </p>
        <p>
          We do not sell your personal information. We may use trusted service providers to process website analytics,
          communications, and operations.
        </p>
        <p>
          You may request updates or deletion of your submitted information by contacting us at estimates@burchcontracting.com.
        </p>
      </div>
    </section>
  );
}
