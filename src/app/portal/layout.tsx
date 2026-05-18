import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { PortalNav } from '@/components/portal/PortalNav';

export const metadata: Metadata = {
  title: 'Customer Portal | Burch Contracting',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortalNav />
      {children}
      {/* Spacer so mobile bottom tab bar doesn't overlap content */}
      <div className="h-16 sm:hidden" aria-hidden />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
