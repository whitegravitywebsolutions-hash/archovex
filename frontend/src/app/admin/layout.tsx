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
  Code,
  MapPin
} from 'lucide-react';
import { User } from '@/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname.includes('/admin/login')) {
      setIsAuthenticated(false);
      return;
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('archovex_admin_token');
      const storedUser = localStorage.getItem('archovex_admin_user');
      if (!token) {
        setIsAuthenticated(false);
        router.replace('/admin/login');
      } else {
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // ignore
          }
        }
        setIsAuthenticated(true);
      }
    }
  }, [pathname, router]);

  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-xs font-bold text-[#0C4A6E]">
          <div className="w-5 h-5 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
          <span>Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('archovex_admin_token');
      localStorage.removeItem('archovex_admin_user');
      router.push('/admin/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Page Builder', href: '/admin/pages', icon: BookOpen },
    { label: 'SEO & Social Meta', href: '/admin/seo', icon: Search },
    { label: 'Services', href: '/admin/services', icon: FolderTree },
    { label: 'Locations', href: '/admin/cities', icon: MapPin },
    { label: 'Blogs', href: '/admin/blogs', icon: Compass },
    { label: 'Leads CRM', href: '/admin/leads', icon: Users },
    { label: 'Header & Menus', href: '/admin/menus', icon: Menu },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'Custom Scripts', href: '/admin/scripts', icon: Code },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];


  return (
    <div className="min-h-screen bg-[#FAF8F3] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0C4A6E] text-white flex flex-col justify-between p-4 border-r border-[#075985] fixed h-full z-30 shadow-xl">
        <div className="space-y-6">
          <div className="pt-2 px-1 flex justify-center w-full">
            <Logo light className="w-full justify-center" />
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
                      ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/25 border border-amber-300/30'
                      : 'text-sky-100 hover:text-white hover:bg-[#0369A1]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-200'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Logout */}
        <div className="pt-4 border-t border-[#075985] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center font-black text-xs shadow-sm">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-sky-200 font-bold uppercase tracking-wider">{user?.role || 'SUPER_ADMIN'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#075985] hover:bg-rose-900/80 text-sky-100 hover:text-white text-xs font-bold rounded-xl transition-all border border-sky-600/40"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="pl-64 flex-grow flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-[#E4DCD0] h-16 px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-[#0C4A6E]">ARCHOVEX Admin CMS</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-black text-[#F97316] uppercase">
              {pathname.split('/')[2] === 'designs' ? 'Blogs' : (pathname.split('/')[2] || 'Dashboard')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-black text-white bg-[#F97316] hover:bg-[#EA580C] px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 border border-amber-300/30"
            >
              <span>View Live Website</span> ↗
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8 flex-grow bg-[#FAF8F3]">{children}</main>
      </div>
    </div>
  );
}
