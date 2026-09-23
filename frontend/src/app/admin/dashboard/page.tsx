'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import {
  Compass,
  FolderTree,
  MapPin,
  Users,
  Briefcase,
  FolderGit2,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/dashboard').then((res) => {
      if (res.data.success) {
        setStats(res.data.data);
      }
    }).catch((err) => console.error(err)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-xs font-bold text-slate-500 animate-pulse">Loading dashboard metrics...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Title & Quick Add Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h1>
          <p className="text-xs text-slate-500">Welcome to ARCHOVEX INFRA CMS control center.</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/designs/new"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add New Design
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Designs</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Compass className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{stats?.total_designs || 0}</span>
          <span className="text-[11px] font-semibold text-emerald-600 block">{stats?.published_designs || 0} Published</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Categories</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><FolderTree className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{stats?.total_categories || 0}</span>
          <span className="text-[11px] font-semibold text-slate-500 block">Dynamic CMS Categories</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Consultation Leads</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Users className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{stats?.total_leads || 0}</span>
          <span className="text-[11px] font-bold text-amber-600 block">{stats?.new_leads || 0} New Requests</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cities Served</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><MapPin className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{stats?.total_cities || 0}</span>
          <span className="text-[11px] font-semibold text-slate-500 block">Experience Centers</span>
        </div>
      </div>

      {/* Recent Leads CRM Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Customer Consultation Leads</h2>
          <Link href="/admin/leads" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase">
            View All Leads <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-100">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">City</th>
                <th className="p-4">Requirement</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {stats?.recent_leads?.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{lead.name}</td>
                  <td className="p-4">{lead.phone} <span className="text-slate-400 block text-[10px]">{lead.email}</span></td>
                  <td className="p-4">{lead.city?.name || 'General'}</td>
                  <td className="p-4">{lead.requirement || 'Full Home'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      lead.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-[11px]">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
