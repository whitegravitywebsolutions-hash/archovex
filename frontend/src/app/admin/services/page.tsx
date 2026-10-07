'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Category as ServiceCategory } from '@/types';
import { Plus, Edit2, Trash2, Search, X, Loader2, ExternalLink } from 'lucide-react';
import SeoFormBlock, { SeoData } from '@/components/admin/SeoFormBlock';

const formatDateForInput = (dateStr?: string | null) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    image: '',
    status: 'published',
    is_featured: false,
    sort_order: 0,
    published_at: '',
    meta_title: '',
    meta_description: '',
  });

  const [seoData, setSeoData] = useState<SeoData>({
    path: '',
    meta_title: '',
    meta_description: '',
    focus_keyphrase: '',
    canonical_url: '',
    robots_index: true,
    robots_follow: true,
    og_title: '',
    og_description: '',
    og_url: '',
    og_type: 'website',
    og_site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
    og_image: '',
    twitter_card: 'summary_large_image',
    twitter_site: '@archovex',
    schema_code: '',
  });

  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/categories');
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      name: '',
      slug: '',
      short_description: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      status: 'published',
      is_featured: false,
      sort_order: services.length + 1,
      published_at: formatDateForInput(new Date().toISOString()),
      meta_title: '',
      meta_description: '',
    });
    setSeoData({
      path: '',
      meta_title: '',
      meta_description: '',
      focus_keyphrase: '',
      canonical_url: '',
      robots_index: true,
      robots_follow: true,
      og_title: '',
      og_description: '',
      og_url: '',
      og_type: 'website',
      og_site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
      og_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      twitter_card: 'summary_large_image',
      twitter_site: '@archovex',
      schema_code: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc: ServiceCategory) => {
    setEditId(svc.id);
    setFormData({
      name: svc.name,
      slug: svc.slug,
      short_description: svc.short_description || '',
      description: svc.description || '',
      image: svc.image || '',
      status: svc.status,
      is_featured: svc.is_featured,
      sort_order: svc.sort_order,
      published_at: formatDateForInput(svc.published_at || svc.created_at),
      meta_title: svc.meta_title || '',
      meta_description: svc.meta_description || '',
    });

    const svcPath = `/services/${svc.slug}`;
    setSeoData({
      path: svcPath,
      meta_title: svc.meta_title || svc.name,
      meta_description: svc.meta_description || svc.short_description || '',
      focus_keyphrase: '',
      canonical_url: `https://archovex.com${svcPath}`,
      robots_index: true,
      robots_follow: true,
      og_title: svc.meta_title || svc.name,
      og_description: svc.meta_description || svc.short_description || '',
      og_url: `https://archovex.com${svcPath}`,
      og_type: 'website',
      og_site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
      og_image: svc.image || '',
      twitter_card: 'summary_large_image',
      twitter_site: '@archovex',
      schema_code: '',
    });

    apiClient.get(`/admin/seo/by-path?path=${svcPath}`).then((res) => {
      if (res.data?.data) {
        setSeoData((prev) => ({
          ...prev,
          ...res.data.data,
          robots_index: res.data.data.robots_index ?? true,
          robots_follow: res.data.data.robots_follow ?? true,
        }));
      }
    }).catch(() => {});

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      published_at: formData.published_at ? new Date(formData.published_at).toISOString() : null,
      meta_title: seoData.meta_title || formData.name,
      meta_description: seoData.meta_description || formData.short_description,
      seo_data: {
        ...seoData,
        path: formData.slug ? `/services/${formData.slug}` : seoData.path,
        meta_title: seoData.meta_title || formData.name,
        meta_description: seoData.meta_description || formData.short_description,
      },
    };

    try {
      if (editId) {
        await apiClient.put(`/admin/categories/${editId}`, payload);
      } else {
        await apiClient.post('/admin/categories', payload);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Services Management CMS</h1>
          <p className="text-xs text-slate-500">Create & manage interior design services (/services/[slug]) dynamically.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-100">
                <th className="p-4">Image</th>
                <th className="p-4">Service Name</th>
                <th className="p-4">URL Route Slug</th>
                <th className="p-4">Linked Posts</th>
                <th className="p-4">Publish Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Order</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center text-slate-400">Loading services...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-slate-400">No services found.</td></tr>
              ) : (
                filtered.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 border">
                        <Image src={svc.image || '/placeholder.jpg'} alt={svc.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{svc.name}</td>
                    <td className="p-4 font-mono text-blue-600 text-[11px]">
                      <Link
                        href={`/services/${svc.slug}`}
                        target="_blank"
                        className="hover:underline flex items-center gap-1 inline-flex"
                      >
                        /services/{svc.slug}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="p-4 font-bold">{svc.design_posts_count || 0} Posts</td>
                    <td className="p-4 whitespace-nowrap">
                      {svc.published_at || svc.created_at ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">
                            {new Date(svc.published_at || svc.created_at!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(svc.published_at || svc.created_at!).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        svc.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {svc.status}
                      </span>
                    </td>
                    <td className="p-4">{svc.is_featured ? '★ Yes' : 'No'}</td>
                    <td className="p-4">{svc.sort_order}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(svc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit Service">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(svc.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg" title="Delete Service">
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

      {/* CREATE / EDIT SERVICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editId ? 'Edit Service' : 'Add New Service'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2">Service Core Information</h3>
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
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
                    placeholder="e.g. Full Home Interior Design"
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Route Slug * (e.g. /services/full-home-interior-design)</label>
                  <div className="flex items-center">
                    <span className="p-2.5 bg-slate-100 border border-r-0 rounded-l-xl text-slate-500 font-mono text-xs">/services/</span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      placeholder="full-home-interior-design"
                      className="w-full p-2.5 border rounded-r-xl font-mono text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief description for headers and dropdown cards..."
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Header Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">Publish Date & Time</label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, published_at: formatDateForInput(new Date().toISOString()) })}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        Set to Now
                      </button>
                    </div>
                    <input
                      type="datetime-local"
                      value={formData.published_at}
                      onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    <label htmlFor="is_featured" className="font-bold text-slate-700">Featured Service</label>
                  </div>
                </div>
              </div>

              {/* SEO Block */}
              <SeoFormBlock data={seoData} onChange={setSeoData} />

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SAVE SERVICE & SEO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
