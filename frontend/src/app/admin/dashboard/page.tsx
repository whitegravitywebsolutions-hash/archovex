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
          <h1 className="text-2xl font-black text-[#0C4A6E] uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-600">Welcome to ARCHOVEX INFRA CMS control center.</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/designs/new"
            className="px-5 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-all flex items-center gap-1.5 border border-amber-300/40"
          >
            <Plus className="w-4 h-4 text-white" /> Add New Design
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E4DCD0] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0C4A6E]">Total Designs</span>
            <div className="p-2.5 bg-sky-50 text-[#0891B2] rounded-xl border border-sky-100"><Compass className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-black text-[#0C4A6E]">{stats?.total_designs || 0}</span>
          <span className="text-[11px] font-bold text-emerald-600 block">{stats?.published_designs || 0} Published</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E4DCD0] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0C4A6E]">Categories</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100"><FolderTree className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-black text-[#0C4A6E]">{stats?.total_categories || 0}</span>
          <span className="text-[11px] font-semibold text-slate-500 block">Dynamic CMS Categories</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E4DCD0] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0C4A6E]">Consultation Leads</span>
            <div className="p-2.5 bg-orange-50 text-[#F97316] rounded-xl border border-orange-100"><Users className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-black text-[#0C4A6E]">{stats?.total_leads || 0}</span>
          <span className="text-[11px] font-black text-[#F97316] block">{stats?.new_leads || 0} New Requests</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E4DCD0] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0C4A6E]">Cities Served</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100"><MapPin className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-black text-[#0C4A6E]">{stats?.total_cities || 0}</span>
          <span className="text-[11px] font-semibold text-slate-500 block">Experience Centers</span>
        </div>
      </div>

      {/* Recent Leads CRM Table */}
      <div className="bg-white rounded-2xl border border-[#E4DCD0] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E4DCD0] flex items-center justify-between">
          <h2 className="text-base font-black text-[#0C4A6E] uppercase tracking-tight">Recent Customer Consultation Leads</h2>
          <Link href="/admin/leads" className="text-xs font-black text-[#F97316] hover:text-[#EA580C] flex items-center gap-1 uppercase tracking-wider">
            View All Leads <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3EEE4] text-[11px] font-black uppercase text-[#0C4A6E] border-b border-[#E4DCD0]">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">City</th>
                <th className="p-4">Requirement</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DCD0]/60 text-xs text-slate-700 font-medium">
              {stats?.recent_leads?.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-[#FAF8F3] transition-colors">
                  <td className="p-4 font-bold text-[#0C4A6E]">{lead.name}</td>
                  <td className="p-4">{lead.phone} <span className="text-slate-500 block text-[10px]">{lead.email}</span></td>
                  <td className="p-4">{lead.city?.name || 'General'}</td>
                  <td className="p-4">{lead.requirement || 'Full Home'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      lead.status === 'New' ? 'bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-[11px]">
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
