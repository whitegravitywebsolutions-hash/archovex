'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/public/Logo';
import {
  LayoutDashboard,
  Compass,
  Users,
  BookOpen,
  Menu,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  User as UserIcon,
  Code,
  FolderTree,
  FileText
} from 'lucide-react';
import { User } from '@/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Submenu state for Blogs
  const [blogsOpen, setBlogsOpen] = useState<boolean>(true);

  useEffect(() => {
    if (pathname.includes('/admin/blogs')) {
      setBlogsOpen(true);
    }
  }, [pathname]);

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

  const isBlogsActive = pathname.startsWith('/admin/blogs');

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0C4A6E] text-white flex flex-col justify-between p-4 border-r border-[#075985] fixed h-full z-30 shadow-xl overflow-y-auto">
        <div className="space-y-6">
          <div className="pt-2 px-1 flex justify-center w-full">
            <Logo href="/admin" light className="w-full justify-center" />
          </div>

          <nav className="space-y-1 text-xs font-bold">
            {/* 1. Dashboard */}
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname === '/admin/dashboard'
                  ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/25 border border-amber-300/30'
                  : 'text-sky-100 hover:text-white hover:bg-[#0369A1]/60'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${pathname === '/admin/dashboard' ? 'text-white' : 'text-sky-200'}`} />
              <span>Dashboard</span>
            </Link>

            {/* 2. Page Builder */}
            <Link
              href="/admin/pages"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname.startsWith('/admin/pages')
                  ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/25 border border-amber-300/30'
                  : 'text-sky-100 hover:text-white hover:bg-[#0369A1]/60'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${pathname.startsWith('/admin/pages') ? 'text-white' : 'text-sky-200'}`} />
              <span>Page Builder</span>
            </Link>

            {/* 3. Admin Users */}
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname.startsWith('/admin/users')
                  ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/25 border border-amber-300/30'
                  : 'text-sky-100 hover:text-white hover:bg-[#0369A1]/60'
              }`}
            >
              <UserIcon className={`w-4 h-4 ${pathname.startsWith('/admin/users') ? 'text-white' : 'text-sky-200'}`} />
              <span>Admin Users</span>
            </Link>

            {/* 4. BLOGS WITH EXPANDABLE SUB-MENU */}
            <div className="space-y-1">
              <div
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer select-none ${
                  isBlogsActive
                    ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/25 border border-amber-300/30'
                    : 'text-sky-100 hover:text-white hover:bg-[#0369A1]/60'
                }`}
                onClick={() => setBlogsOpen(!blogsOpen)}
              >
                <div className="flex items-center gap-3">
                  <Compass className={`w-4 h-4 ${isBlogsActive ? 'text-white' : 'text-sky-200'}`} />
                  <span>Blogs</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBlogsOpen(!blogsOpen);
                  }}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  {blogsOpen ? (
                    <ChevronDown className="w-4 h-4 text-amber-200" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-sky-300" />
                  )}
                </button>
              </div>

              {/* BLOGS SUBMENU ITEMS */}
              {blogsOpen && (
                <div className="pl-6 pr-1 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/admin/blogs"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                      pathname === '/admin/blogs' || pathname.startsWith('/admin/blogs/new') || (pathname.startsWith('/admin/blogs/') && !pathname.includes('/categories'))
                        ? 'bg-[#0284C7] text-white shadow-xs'
                        : 'text-sky-200 hover:text-white hover:bg-[#0369A1]/40'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>All Blogs</span>
                  </Link>

                  <Link
                    href="/admin/blogs/categories"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                      pathname.startsWith('/admin/blogs/categories')
                        ? 'bg-[#0284C7] text-white shadow-xs'
                        : 'text-sky-200 hover:text-white hover:bg-[#0369A1]/40'
                    }`}
                  >
                    <FolderTree className="w-3.5 h-3.5" />
                    <span>Blog Categories</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Header & Menus */}
            <Link
              href="/admin/menus"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname.startsWith('/admin/menus')
                  ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/25 border border-amber-300/30'
                  : 'text-sky-100 hover:text-white hover:bg-[#0369A1]/60'
              }`}
            >
              <Menu className={`w-4 h-4 ${pathname.startsWith('/admin/menus') ? 'text-white' : 'text-sky-200'}`} />
              <span>Header & Menus</span>
            </Link>

            {/* 7. Media Library */}
            <Link
              href="/admin/media"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname.startsWith('/admin/media')
                  ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/25 border border-amber-300/30'
                  : 'text-sky-100 hover:text-white hover:bg-[#0369A1]/60'
              }`}
            >
              <ImageIcon className={`w-4 h-4 ${pathname.startsWith('/admin/media') ? 'text-white' : 'text-sky-200'}`} />
              <span>Media Library</span>
            </Link>

            {/* 8. Custom Scripts */}
            <Link
              href="/admin/scripts"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname.startsWith('/admin/scripts')
                  ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/25 border border-amber-300/30'
                  : 'text-sky-100 hover:text-white hover:bg-[#0369A1]/60'
              }`}
            >
              <Code className={`w-4 h-4 ${pathname.startsWith('/admin/scripts') ? 'text-white' : 'text-sky-200'}`} />
              <span>Custom Scripts</span>
            </Link>

            {/* 9. Site Settings */}
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname.startsWith('/admin/settings')
                  ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/25 border border-amber-300/30'
                  : 'text-sky-100 hover:text-white hover:bg-[#0369A1]/60'
              }`}
            >
              <Settings className={`w-4 h-4 ${pathname.startsWith('/admin/settings') ? 'text-white' : 'text-sky-200'}`} />
              <span>Site Settings</span>
            </Link>
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
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#075985] hover:bg-rose-900/80 text-sky-100 hover:text-white text-xs font-bold rounded-xl transition-all border border-sky-600/40 cursor-pointer"
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
              {pathname.includes('/admin/blogs/categories') ? 'Blog Categories' : pathname.startsWith('/admin/blogs') ? 'Blogs' : (pathname.split('/')[2] || 'Dashboard')}
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
