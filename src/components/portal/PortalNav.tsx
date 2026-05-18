'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, MessageSquare } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/portal/projects', icon: FolderKanban },
  { name: 'Messages', href: '/portal/messages', icon: MessageSquare },
];

const HIDDEN_PATHS = ['/portal', '/portal/forgot-password', '/portal/reset-password'];

export function PortalNav() {
  const pathname = usePathname();

  if (HIDDEN_PATHS.includes(pathname || '')) return null;

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden sm:flex sticky top-0 z-30 h-14 bg-white border-b border-gray-200 items-center px-6 gap-6 shadow-sm">
        <span className="font-bold text-gray-900 text-sm mr-2">Burch Contracting</span>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-white border-t border-gray-200 flex">
        {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
              isActive(href) ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Icon size={22} />
            {name}
          </Link>
        ))}
      </nav>
    </>
  );
}
