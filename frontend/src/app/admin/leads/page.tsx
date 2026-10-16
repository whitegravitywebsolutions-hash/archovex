'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Lead } from '@/types';
import { Search, Phone, Mail, MapPin, CheckCircle2, Clock, Trash2, Edit2, X, MessageSquare, ExternalLink } from 'lucide-react';

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
      const params = [];
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lead CRM Management</h1>
          <p className="text-xs text-slate-500 mt-1">Track and manage customer enquiries and consultation requests submitted from website forms.</p>
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
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="">All Lead Statuses</option>
            <option value="New">New Requests</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>
          <button
            onClick={() => fetchLeads()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors whitespace-nowrap shadow-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 font-bold uppercase tracking-wider text-[11px] text-slate-500 border-b border-slate-200">
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Type & Source</th>
                <th className="p-4">Address / City</th>
                <th className="p-4">Requirement / Message</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr><td colSpan={8} className="p-10 text-center text-slate-400 font-medium">Loading leads...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={8} className="p-10 text-center text-slate-400 font-medium">No lead records found.</td></tr>
              ) : (
                leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm flex-shrink-0">
                          {l.name ? l.name.charAt(0) : 'L'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{l.name}</div>
                          {l.assigned_to && (
                            <div className="text-[10px] text-slate-400">Assigned: {l.assigned_to}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <a href={`tel:${l.phone}`} className="font-bold text-slate-900 hover:text-amber-600 block transition-colors">
                        {l.phone}
                      </a>
                      {l.email ? (
                        <a href={`mailto:${l.email}`} className="text-slate-400 hover:text-slate-600 text-[11px] block transition-colors truncate max-w-[180px]">
                          {l.email}
                        </a>
                      ) : (
                        <span className="text-slate-300 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        l.type === 'contact' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {l.type === 'contact' ? 'Contact Enquiry' : (l.type || 'Lead')}
                      </span>
                      {l.source && (
                        <span className="block text-[10px] text-slate-400 mt-1 capitalize">{l.source.replace('_', ' ')}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-start gap-1 max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-[11px] line-clamp-2" title={l.address || l.city?.name || 'General'}>
                          {l.address || l.city?.name || 'General'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-[240px]">
                        <p className="text-slate-800 line-clamp-2 text-[11px]" title={l.requirement || l.message || '—'}>
                          {l.requirement || l.message || (l.property_type ? `${l.property_type} ${l.budget ? '(' + l.budget + ')' : ''}` : '—')}
                        </p>
                        {l.property_type && l.requirement && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">{l.property_type} {l.budget ? `• ${l.budget}` : ''}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${
                        l.status === 'New' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                        l.status === 'Converted' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                        l.status === 'Closed' ? 'bg-slate-200 text-slate-700' :
                        'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          l.status === 'New' ? 'bg-amber-500 animate-pulse' :
                          l.status === 'Converted' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} />
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {l.created_at ? new Date(l.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : '—'}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                      {l.phone && (
                        <a
                          href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${l.name}, thank you for contacting Archovex Infra.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Message on WhatsApp"
                          className="inline-flex p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleOpenEdit(l)}
                        title="View & Edit Lead"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(l.id)}
                        title="Delete Lead"
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW & UPDATE STATUS MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm text-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                selectedLead.type === 'contact' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {selectedLead.type === 'contact' ? 'Contact Form Enquiry' : (selectedLead.type || 'Consultation Request')}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedLead.name}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Submitted on {selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString('en-IN') : '—'}
                {selectedLead.source && ` • Source: ${selectedLead.source}`}
              </p>
            </div>

            {/* Customer Details Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Phone Number</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-bold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-500" />
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Email Address</span>
                  {selectedLead.email ? (
                    <a href={`mailto:${selectedLead.email}`} className="font-bold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-500" />
                      {selectedLead.email}
                    </a>
                  ) : (
                    <span className="text-slate-400 font-medium">Not provided</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Location / Address</span>
                <div className="text-slate-800 font-medium flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{selectedLead.address || selectedLead.city?.name || 'Not provided'}</span>
                </div>
              </div>

              {(selectedLead.property_type || selectedLead.budget) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  {selectedLead.property_type && (
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Property Type</span>
                      <span className="text-slate-900 font-bold">{selectedLead.property_type}</span>
                    </div>
                  )}
                  {selectedLead.budget && (
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Estimated Budget</span>
                      <span className="text-slate-900 font-bold">{selectedLead.budget}</span>
                    </div>
                  )}
                </div>
              )}

              {(selectedLead.requirement || selectedLead.message) && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Requirement / Message</span>
                  <div className="bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-medium whitespace-pre-wrap leading-relaxed text-xs">
                    {selectedLead.requirement || selectedLead.message}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedLead.name}, thank you for contacting Archovex Infra regarding your enquiry.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${selectedLead.phone}`}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-2 transition-colors text-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Customer
              </a>
            </div>

            {/* Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block font-bold mb-1 text-slate-700">Lead Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
                  placeholder="e.g. Call scheduled for tomorrow at 4 PM, requested detailed quote..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-800"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="w-1/3 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl uppercase tracking-wider hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-2/3 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
                >
                  {saving ? 'SAVING...' : 'UPDATE LEAD RECORD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
