'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import {
  Layers,
  BookOpen,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  Globe,
  Edit3,
  ExternalLink,
  Sparkles,
  MailCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/admin/dashboard')
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-slate-400 animate-pulse space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin mx-auto"></div>
        <p>Loading ARCHOVEX CMS dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Title & Quick Action Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-slate-900 tracking-tight">
            CMS Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your Page Builder layouts, Blog guides, and Customer Leads CRM in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/blogs/new"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>New Blog Article</span>
          </Link>
          <Link
            href="/admin/pages"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border border-slate-200"
          >
            <Layers className="w-4 h-4 text-slate-600" />
            <span>Page Builder</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Page Builder Pages */}
        <Link
          href="/admin/pages"
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all group space-y-3 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
              CMS PAGES
            </span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-serif">
              {stats?.total_pages || 0}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {stats?.published_pages || 0} Published
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Custom Page Builder Layouts
          </span>
        </Link>

        {/* Total Blog Articles */}
        <Link
          href="/admin/blogs"
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all group space-y-3 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
              BLOG GUIDES
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-serif">
              {stats?.total_blogs || 0}
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {stats?.published_blogs || 0} Published
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Architectural Editorial Guides
          </span>
        </Link>

        {/* Media Assets */}
        <Link
          href="/admin/media"
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all group space-y-3 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
              MEDIA ASSETS
            </span>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-serif">
              {stats?.total_media || 0}
            </span>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
              Uploaded
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Images & Portfolio Files
          </span>
        </Link>

        {/* Global SEO Settings */}
        <Link
          href="/admin/seo"
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all group space-y-3 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
              SEO ENGINE
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-serif">
              100%
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            OpenGraph & Schema Manager
          </span>
        </Link>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT 7: Recent CMS Pages */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Recent CMS Pages
              </h2>
              <p className="text-xs text-slate-400">Pages published or updated recently in visual builder.</p>
            </div>
            <Link
              href="/admin/pages"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 uppercase tracking-wider font-mono"
            >
              <span>View All Pages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-extrabold uppercase font-mono text-slate-500 border-b border-slate-100">
                  <th className="p-4">Page Title</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {stats?.recent_pages && stats.recent_pages.length > 0 ? (
                  stats.recent_pages.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{p.title}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-500">/{p.slug}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                            p.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {p.status || 'published'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/pages/builder/${p.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#EA580C] hover:text-white rounded-lg text-slate-700 font-semibold text-xs transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Builder</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-xs text-slate-400 font-medium">
                      No pages recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT 5: Enquiries Status & Recent Blog Guides */}
        <div className="lg:col-span-5 space-y-6">
          {/* Email Enquiry Notification Box */}
          <div className="bg-gradient-to-br from-slate-900 to-[#0C4A6E] text-white p-6 rounded-3xl shadow-md space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400">
              <MailCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Live Email Enquiries</span>
            </div>
            <p className="text-sm font-semibold text-slate-100 leading-snug">
              All website enquiries from Home page, Contact Us, and Consultation modals are automatically delivered to:
            </p>
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/15 text-xs font-mono font-bold text-amber-300 break-all">
              info@archovexinfra.com
            </div>
          </div>

          {/* Recent Blogs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Recent Blog Guides</span>
              </h3>
              <Link href="/admin/blogs" className="text-[10px] font-bold text-slate-400 hover:text-slate-700 font-mono">
                VIEW ALL
              </Link>
            </div>

            <div className="space-y-2.5">
              {stats?.recent_blogs && stats.recent_blogs.length > 0 ? (
                stats.recent_blogs.map((b: any) => (
                  <div
                    key={b.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs hover:border-slate-200 transition-colors"
                  >
                    <div className="truncate pr-2">
                      <span className="block font-bold text-slate-900 truncate">{b.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 block truncate">
                        /blogs/{b.slug}
                      </span>
                    </div>
                    <Link
                      href={`/admin/blogs/${b.id}/edit`}
                      className="p-2 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shrink-0"
                      title="Edit Blog"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">No blog guides found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
