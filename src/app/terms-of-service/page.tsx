import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Terms of Service | Burch Contracting',
  description:
    'Review terms governing use of the Burch Contracting website, estimate requests, and informational content.',
  alternates: {
    canonical: absoluteUrl('/terms-of-service'),
  },
};

export default function TermsOfServicePage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Terms of Service</h1>
      <p className="mt-4 text-sm text-gray-600">
        Effective date: <time dateTime="2026-05-11">May 11, 2026</time>
      </p>
      <div className="mt-8 space-y-6 text-gray-700">
        <p>
          Website content is provided for informational purposes and does not constitute a final project quote or binding contract.
        </p>
        <p>
          Project scope, pricing, and timelines are finalized only through written proposals and signed agreements.
        </p>
        <p>
          By using this site, you agree not to misuse forms, attempt unauthorized access, or interfere with website operations.
        </p>
      </div>
    </section>
  );
}
