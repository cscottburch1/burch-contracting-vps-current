import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Page Not Found</p>
      <h1 className="mb-4 text-4xl font-bold text-gray-900">The page you requested is not available.</h1>
      <p className="mb-8 text-lg text-gray-600">
        Try the main service pages, local remodeling pages, or contact us for help finding the right project information.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/services" className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800">
          Browse Services
        </Link>
        <Link href="/contact" className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50">
          Request Estimate
        </Link>
      </div>
    </main>
  );
}
