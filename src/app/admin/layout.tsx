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
    <div className="flex min-h-screen bg-gray-50">
      {showSidebar && <AdminNav />}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
