'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { Category } from '@/types';
import { Plus, Edit2, Trash2, Search, X, CheckCircle2, Loader2 } from 'lucide-react';
import SeoFormBlock, { SeoData } from '@/components/admin/SeoFormBlock';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
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

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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
      sort_order: categories.length + 1,
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

  const handleOpenEdit = (cat: Category) => {
    setEditId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      short_description: cat.short_description || '',
      description: cat.description || '',
      image: cat.image || '',
      status: cat.status,
      is_featured: cat.is_featured,
      sort_order: cat.sort_order,
      meta_title: cat.meta_title || '',
      meta_description: cat.meta_description || '',
    });

    const catPath = `/designs/${cat.slug}`;
    setSeoData({
      path: catPath,
      meta_title: cat.meta_title || cat.name,
      meta_description: cat.meta_description || cat.short_description || '',
      focus_keyphrase: '',
      canonical_url: `https://archovex.com${catPath}`,
      robots_index: true,
      robots_follow: true,
      og_title: cat.meta_title || cat.name,
      og_description: cat.meta_description || cat.short_description || '',
      og_url: `https://archovex.com${catPath}`,
      og_type: 'website',
      og_site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
      og_image: cat.image || '',
      twitter_card: 'summary_large_image',
      twitter_site: '@archovex',
      schema_code: '',
    });

    apiClient.get(`/admin/seo/by-path?path=${catPath}`).then((res) => {
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
      meta_title: seoData.meta_title || formData.name,
      meta_description: seoData.meta_description || formData.short_description,
      seo_data: {
        ...seoData,
        path: formData.slug ? `/designs/${formData.slug}` : seoData.path,
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
      fetchCategories();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Category CMS Management</h1>
          <p className="text-xs text-slate-500">Create & manage interior design categories without code modifications.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-100">
                <th className="p-4">Image</th>
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Posts</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Order</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-400">Loading categories...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-400">No categories found.</td></tr>
              ) : (
                filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 border">
                        <Image src={cat.image || '/placeholder.jpg'} alt={cat.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{cat.name}</td>
                    <td className="p-4 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                    <td className="p-4 font-bold">{cat.design_posts_count || 0} Posts</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        cat.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cat.status}
                      </span>
                    </td>
                    <td className="p-4">{cat.is_featured ? '★ Yes' : 'No'}</td>
                    <td className="p-4">{cat.sort_order}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
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

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editId ? 'Edit Category' : 'Create New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2">Category Core Information</h3>
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Bedroom Designs"
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Slug (Optional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. bedroom-designs"
                    className="w-full p-2.5 border rounded-xl font-mono text-[11px] bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Header Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    <label htmlFor="is_featured" className="font-bold text-slate-700">Featured Category</label>
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
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SAVE CATEGORY & SEO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
