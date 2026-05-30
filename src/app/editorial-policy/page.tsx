import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Editorial Policy | Burch Contracting',
  description:
    'Learn how Burch Contracting creates, reviews, and updates website content to maintain accuracy and helpful local guidance.',
  alternates: {
    canonical: absoluteUrl('/editorial-policy'),
  },
};

export default function EditorialPolicyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Editorial Policy</h1>
      <p className="mt-4 text-sm text-gray-600">
        Last reviewed: <time dateTime="2026-05-11">May 11, 2026</time>
      </p>
      <div className="mt-8 space-y-6 text-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Editorial Standards</h2>
        <p>
          Content is written and reviewed with input from Burch Contracting project experience in Upstate South Carolina.
        </p>
        <p>
          We prioritize practical guidance, realistic pricing ranges, and local permitting context. Content is updated as market conditions change.
        </p>
        <p>
          Corrections or update requests can be sent to estimates@burchcontracting.com.
        </p>
      </div>
    </section>
  );
}
