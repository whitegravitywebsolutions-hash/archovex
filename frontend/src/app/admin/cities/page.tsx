'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { City } from '@/types';
import { Plus, Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    state: '',
    description: '',
    hero_image: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    status: 'published',
    sort_order: 0,
  });

  const [saving, setSaving] = useState(false);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/cities');
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
      state: '',
      description: '',
      hero_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      address: '',
      phone: '+91 98765 43210',
      email: 'city@archovex.com',
      whatsapp: '+919876543210',
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
      state: city.state || '',
      description: city.description || '',
      hero_image: city.hero_image || '',
      address: city.address || '',
      phone: city.phone || '',
      email: city.email || '',
      whatsapp: city.whatsapp || '',
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
        await apiClient.put(`/admin/cities/${editId}`, formData);
      } else {
        await apiClient.post('/admin/cities', formData);
      }
      setIsModalOpen(false);
      fetchCities();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save city');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this city?')) return;
    try {
      await apiClient.delete(`/admin/cities/${id}`);
      fetchCities();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">City Management CMS</h1>
          <p className="text-xs text-slate-500">Create new city experience centers dynamically without developer code.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New City
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 font-bold uppercase text-slate-500 border-b">
              <th className="p-4">City Name</th>
              <th className="p-4">State</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y font-medium text-slate-700">
            {cities.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">{c.name}</td>
                <td className="p-4">{c.state || 'India'}</td>
                <td className="p-4">{c.phone}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
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
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm text-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 mb-4">{editId ? 'Edit City' : 'Add New City'}</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">City Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold mb-1">State</label>
                <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold mb-1">Experience Center Address</label>
                <textarea rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-bold mb-1">WhatsApp Number</label>
                  <input type="text" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full p-2 border rounded-lg" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg uppercase mt-2">
                {saving ? 'SAVING...' : 'SAVE CITY'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
