'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { City } from '@/types';
import { Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';

export default function AdminLocationsPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: 'published',
    sort_order: 0,
  });

  const [saving, setSaving] = useState(false);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/locations');
      if (res.data.success) {
        setCities(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      name: '',
      slug: '',
      status: 'published',
      sort_order: cities.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (city: City) => {
    setEditId(city.id);
    setFormData({
      name: city.name,
      slug: city.slug,
      status: city.status,
      sort_order: city.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await apiClient.put(`/admin/locations/${editId}`, formData);
      } else {
        await apiClient.post('/admin/locations', formData);
      }
      setIsModalOpen(false);
      fetchCities();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save location');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await apiClient.delete(`/admin/locations/${id}`);
      fetchCities();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Location Management CMS</h1>
          <p className="text-xs text-slate-500">Manage location routes (/locations/[slug]) dynamically.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Location
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 font-bold uppercase text-slate-500 border-b">
              <th className="p-4">Location Name</th>
              <th className="p-4">URL Route (Slug)</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y font-medium text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">Loading locations...</td>
              </tr>
            ) : cities.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">No locations found.</td>
              </tr>
            ) : (
              cities.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{c.name}</td>
                  <td className="p-4 font-mono text-blue-600 font-semibold">
                    <Link
                      href={`/locations/${c.slug}`}
                      target="_blank"
                      className="hover:underline flex items-center gap-1 inline-flex"
                    >
                      /locations/{c.slug}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm text-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 mb-4">{editId ? 'Edit Location' : 'Add New Location'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold mb-1 text-slate-700">Location Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      slug: editId ? prev.slug : autoSlug,
                    }));
                  }}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">URL Route Slug * (e.g. /locations/new-delhi)</label>
                <div className="flex items-center">
                  <span className="p-2.5 bg-slate-100 border border-r-0 rounded-l-xl text-slate-500 font-mono text-xs">/locations/</span>
                  <input
                    type="text"
                    required
                    placeholder="new-delhi"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    className="w-full p-2.5 border rounded-r-xl font-mono text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider mt-2 shadow-md">
                {saving ? 'SAVING...' : 'SAVE LOCATION'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
