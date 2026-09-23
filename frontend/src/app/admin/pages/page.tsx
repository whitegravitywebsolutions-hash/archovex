'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Plus, Edit3, Trash2, Globe, Layers, Search, Eye, ExternalLink, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface PageItem {
  id: number;
  title: string;
  slug: string;
  status: string;
  sections?: any[];
  updated_at: string;
}

export default function AdminPagesListPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newPageData, setNewPageData] = useState({
    title: '',
    slug: '',
    status: 'published',
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/pages');
      if (res.data.success) {
        setPages(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await apiClient.post('/admin/pages', {
        ...newPageData,
        sections: [
          {
            id: 'sec_hero_default',
            type: 'hero',
            is_active: true,
            title: newPageData.title,
            subtitle: 'Welcome to ARCHOVEX INFRA luxury home interiors.',
            cta_text: 'Book Free Consultation',
            cta_link: '#consultation',
            bg_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
          },
        ],
      });

      if (res.data.success && res.data.data?.id) {
        setIsModalOpen(false);
        router.push(`/admin/pages/builder/${res.data.data.id}`);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create page');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number, slug: string) => {
    if (slug === 'home') {
      alert('The Home page cannot be deleted.');
      return;
    }

    if (!confirm('Are you sure you want to delete this page and all its section layouts?')) return;

    try {
      await apiClient.delete(`/admin/pages/${id}`);
      fetchPages();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = pages.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span>Visual Page Builder & Page-Wise SEO CMS</span>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Page Builder + SEO
            </span>
          </h1>
          <p className="text-xs text-slate-500">Build custom pages, arrange dynamic section layouts, and manage page-wise SEO metadata (Meta Titles, Descriptions, OG Tags, Schema Code).</p>
        </div>

        <button
          onClick={() => {
            setNewPageData({ title: '', slug: '', status: 'published' });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Page
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-100">
                <th className="p-4">Page Title</th>
                <th className="p-4">URL Path / Slug</th>
                <th className="p-4">Sections</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Modified</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                      <span>Loading pages...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No pages found. Click "+ Create New Page" to add one.
                  </td>
                </tr>
              ) : (
                filtered.map((page) => {
                  const path = page.slug === 'home' ? '/' : `/${page.slug}`;
                  const sectionCount = Array.isArray(page.sections) ? page.sections.length : 0;

                  return (
                    <tr key={page.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        <span>{page.title}</span>
                        {page.slug === 'home' && (
                          <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Home Page
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-[11px]">{path}</td>
                      <td className="p-4 font-bold">
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{sectionCount} Sections</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            page.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(page.updated_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          href={`/admin/pages/builder/${page.id}`}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg uppercase tracking-wider text-[11px] inline-flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Open Visual Builder</span>
                        </Link>

                        <a
                          href={path}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg inline-block"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {page.slug !== 'home' && (
                          <button
                            onClick={() => handleDelete(page.id, page.slug)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Page"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW PAGE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Create New Dynamic Page</h2>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Page Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. About Us / Special Offers / Luxury Villas"
                  value={newPageData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewPageData({
                      ...newPageData,
                      title,
                      slug: newPageData.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                    });
                  }}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Slug / Path *</label>
                <div className="flex items-center">
                  <span className="p-2.5 bg-slate-100 border border-r-0 rounded-l-xl text-slate-500 font-mono text-[11px]">/</span>
                  <input
                    type="text"
                    required
                    placeholder="about-us"
                    value={newPageData.slug}
                    onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
                    className="w-full p-2.5 border rounded-r-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Publication Status</label>
                <select
                  value={newPageData.status}
                  onChange={(e) => setNewPageData({ ...newPageData, status: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider shadow-md flex items-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create & Open Builder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
