'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Lead } from '@/types';
import { Search, Phone, Mail, MapPin, CheckCircle2, Clock, Trash2, Edit2, X } from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState<'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Closed'>('New');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let params = [];
      if (statusFilter) params.push(`status=${statusFilter}`);
      if (search) params.push(`search=${search}`);
      const query = params.length > 0 ? `?${params.join('&')}` : '';

      const res = await apiClient.get(`/admin/leads${query}`);
      if (res.data.success) {
        setLeads(res.data.data.data || res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleOpenEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setNotes(lead.notes || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setSaving(true);

    try {
      await apiClient.put(`/admin/leads/${selectedLead.id}`, {
        status: editStatus,
        notes,
      });
      setSelectedLead(null);
      fetchLeads();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead record?')) return;
    try {
      await apiClient.delete(`/admin/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Lead CRM Management</h1>
          <p className="text-xs text-slate-500">Track and convert consultation requests submitted from website forms.</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border rounded-xl font-medium"
        >
          <option value="">All Lead Statuses</option>
          <option value="New">New Requests</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Converted">Converted</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 font-bold uppercase text-slate-500 border-b">
              <th className="p-4">Customer Name</th>
              <th className="p-4">Phone / Email</th>
              <th className="p-4">City</th>
              <th className="p-4">Property & Budget</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y font-medium text-slate-700">
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-400">Loading leads...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-400">No lead records found.</td></tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{l.name}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{l.phone}</span>
                    <span className="text-slate-400 text-[10px]">{l.email || '—'}</span>
                  </td>
                  <td className="p-4">{l.city?.name || 'General'}</td>
                  <td className="p-4">
                    <span>{l.property_type || '3 BHK'}</span>
                    <span className="text-slate-400 block text-[10px]">{l.budget || '—'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      l.status === 'New' ? 'bg-amber-100 text-amber-800' :
                      l.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-[11px]">
                    {new Date(l.created_at || '').toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(l)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(l.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm text-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <button onClick={() => setSelectedLead(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900">Update Lead: {selectedLead.name}</h2>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block font-bold mb-1 text-slate-700">Lead Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl font-bold"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Internal Sales Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Call scheduled for tomorrow at 4 PM..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <button type="submit" disabled={saving} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl uppercase">
                {saving ? 'SAVING...' : 'UPDATE LEAD RECORD'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
