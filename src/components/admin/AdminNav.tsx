'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Target,
  FileText,
  Receipt,
  MessageSquare,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  shortcut?: string;
}

export function AdminNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        const unread = data.conversations?.filter((c: any) => c.unread_count > 0).length || 0;
        setUnreadMessages(unread);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, shortcut: 'Alt+1' },
    { name: 'Customers', href: '/admin/customers', icon: Users, shortcut: 'Alt+2' },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban, shortcut: 'Alt+3' },
    { name: 'CRM / Leads', href: '/admin/crm', icon: Target, shortcut: 'Alt+4' },
    { name: 'Proposals', href: '/admin/proposals', icon: FileText, shortcut: 'Alt+5' },
    { name: 'Invoices', href: '/admin/invoices', icon: Receipt, shortcut: 'Alt+6' },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: unreadMessages, shortcut: 'Alt+7' },
    { name: 'Subcontractors', href: '/admin/subcontractors', icon: Wrench, shortcut: 'Alt+8' },
  ];

  const bottomItems: NavItem[] = [
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Tools', href: '/admin/tools', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (navItems[index]) {
          window.location.href = navItems[index].href;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white
          transition-all duration-300 ease-in-out z-50
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
                B
              </div>
              <div>
                <div className="font-bold text-lg">Burch</div>
                <div className="text-xs text-gray-400">Contracting</div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1.5 hover:bg-gray-700 rounded-lg transition"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition group
                    ${active 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  title={collapsed ? item.name : ''}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  
                  {!collapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.name}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {collapsed && item.badge && item.badge > 0 && (
                    <span className="absolute left-12 top-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-700" />

          {/* Bottom Items */}
          <div className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition
                    ${active 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  title={collapsed ? item.name : ''}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition"
              title={collapsed ? 'Logout' : ''}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              <div className="font-semibold mb-1">Keyboard Shortcuts</div>
              <div>Alt + 1-8 for quick nav</div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to push content right */}
      <div className={`${collapsed ? 'lg:w-20' : 'lg:w-64'} transition-all duration-300`} />
    </>
  );
}
