'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/public/Logo';
import {
  LayoutDashboard,
  FolderTree,
  Compass,
  Users,
  BookOpen,
  Menu,
  Image as ImageIcon,
  Settings,
  Search,
  LogOut,
  ChevronRight,
  User as UserIcon,
  Code
} from 'lucide-react';
import { User } from '@/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (pathname.includes('/admin/login')) return;

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('archovex_admin_token');
      const storedUser = localStorage.getItem('archovex_admin_user');
      if (!token) {
        router.push('/admin/login');
      } else if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [pathname, router]);

  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('archovex_admin_token');
      localStorage.removeItem('archovex_admin_user');
      router.push('/admin/login');
    }
  };

  const navItems = [
    { label: 'Page Builder', href: '/admin/pages', icon: BookOpen },
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Blogs', href: '/admin/designs', icon: Compass },
    { label: 'Leads CRM', href: '/admin/leads', icon: Users },
    { label: 'Header & Menus', href: '/admin/menus', icon: Menu },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'Custom Scripts', href: '/admin/scripts', icon: Code },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];


  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col justify-between p-4 border-r border-slate-900 fixed h-full z-30">
        <div className="space-y-6">
          <div className="pt-2 px-2">
            <Logo light />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Logout */}
        <div className="pt-4 border-t border-slate-900 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-blue-400 font-semibold">{user?.role || 'SUPER_ADMIN'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-rose-300 text-xs font-bold rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="pl-64 flex-grow flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>ARCHOVEX Admin CMS</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-bold text-slate-900 uppercase">
              {pathname.split('/')[2] === 'designs' ? 'Blogs' : (pathname.split('/')[2] || 'Dashboard')}
            </span>

          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              View Live Website ↗
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8 flex-grow">{children}</main>
      </div>
    </div>
  );
}
