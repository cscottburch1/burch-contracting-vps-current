'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(true);

  // Hide sidebar on login page
  useEffect(() => {
    setShowSidebar(pathname !== '/admin' && !pathname?.startsWith('/admin/page'));
  }, [pathname]);

  // Don't show sidebar on login page
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="h-full px-4 md:px-6 flex items-center">
          <h1 className="text-sm md:text-base font-semibold text-gray-900">Admin Console</h1>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {showSidebar && <AdminNav />}
        <main className="flex-1 min-h-0 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
