'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Plus, Edit3, Trash2, Globe, Layers, Search, Eye, ExternalLink, Loader2, Sparkles, CheckCircle2, Copy } from 'lucide-react';
import SearchableSingleSelect from '@/components/admin/SearchableSingleSelect';
import { getPageName } from '@/lib/pageUtils';

interface PageItem {
  id: number;
  title: string;
  slug: string;
  status: string;
  parent_id?: number | null;
  parent?: PageItem | null;
  sections?: any[];
  published_at?: string | null;
  updated_at: string;
}

export default function AdminPagesListPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [allParents, setAllParents] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newPageData, setNewPageData] = useState({
    title: '',
    slug: '',
    parent_id: '',
    status: 'published',
    published_at: '',
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        per_page: String(perPage),
        sort_by: sortBy,
        sort_dir: sortDir,
      });

      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await apiClient.get(`/admin/pages?${params.toString()}`);
      if (res.data.success) {
        setPages(res.data.data);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllParents = async () => {
    try {
      const res = await apiClient.get('/admin/pages?per_page=all');
      if (res.data.success && Array.isArray(res.data.data)) {
        const sorted = [...res.data.data].sort((a: PageItem, b: PageItem) => {
          const aTop = !a.parent_id;
          const bTop = !b.parent_id;
          if (aTop && !bTop) return -1;
          if (!aTop && bTop) return 1;
          return getPageName(a).localeCompare(getPageName(b));
        });
        setAllParents(sorted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [currentPage, perPage, sortBy, sortDir, statusFilter, search]);

  useEffect(() => {
    fetchAllParents();
  }, []);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const payload = {
        ...newPageData,
        parent_id: newPageData.parent_id ? Number(newPageData.parent_id) : null,
        sections: [
          {
            id: 'sec_hero_default',
            type: 'hero',
            is_active: true,
            title: newPageData.title,
            subtitle: 'Welcome to ARCHOVEX INFRA luxury home interiors.',
            cta_text: 'Book Free Consultation',
            cta_link: '#consultation',
            bg_image: 'http://127.0.0.1:8005/storage/media/website/page_tsx_5816194f.jpg',
          },
        ],
      };

      const res = await apiClient.post('/admin/pages', payload);

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

  const handleClonePage = async (id: number) => {
    try {
      const res = await apiClient.post(`/admin/pages/${id}/clone`);
      if (res.data?.success) {
        fetchPages();
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to clone page');
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
            setNewPageData({ title: '', slug: '', parent_id: '', status: 'published', published_at: '' });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Page
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search pages..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 text-[11px]">Sort By:</span>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('-');
                setSortBy(sb);
                setSortDir(sd as 'asc' | 'desc');
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
            >
              <option value="updated_at-desc">Last Modified (Newest First)</option>
              <option value="updated_at-asc">Last Modified (Oldest First)</option>
              <option value="created_at-desc">Created Date (Newest First)</option>
              <option value="title-asc">Page Name (A to Z)</option>
              <option value="title-desc">Page Name (Z to A)</option>
              <option value="slug-asc">Slug (A to Z)</option>
            </select>
          </div>

          {/* Per Page Selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 text-[11px]">Per Page:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-100">
                <th className="p-4">Page Name</th>
                <th className="p-4">Publish Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Modified</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                      <span>Loading pages...</span>
                    </div>
                  </td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No pages found. Click "+ Create New Page" to add one.
                  </td>
                </tr>
              ) : (
                pages.map((page) => {
                  const path = page.slug === 'home' ? '/' : `/${page.slug}`;
                  const pubDateStr = page.published_at || page.updated_at;

                  return (
                    <tr key={page.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        <span title={page.title}>{getPageName(page)}</span>
                        {page.slug === 'home' && (
                          <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Home Page
                          </span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {pubDateStr ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">
                              {new Date(pubDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(pubDateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
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

                        <button
                          onClick={() => handleClonePage(page.id)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-lg inline-block transition-colors cursor-pointer"
                          title="Clone Page (as Draft)"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

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

        {/* Pagination Bar */}
        {pagination.total > 0 && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> to{' '}
              <span className="font-bold text-slate-800">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> of{' '}
              <span className="font-bold text-slate-800">{pagination.total}</span> pages
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 shadow-xs transition-all"
              >
                Previous
              </button>

              <span className="px-3 py-1 bg-slate-900 text-white rounded-xl font-bold text-[11px]">
                Page {pagination.current_page} of {pagination.last_page}
              </span>

              <button
                type="button"
                disabled={currentPage >= pagination.last_page}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, pagination.last_page))}
                className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 shadow-xs transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
                <SearchableSingleSelect
                  label="Parent Page (Optional)"
                  placeholder="Search parent pages by title or slug..."
                  noneLabel="-- None (Top Level Page) --"
                  options={allParents.map((p) => ({
                    id: p.id,
                    name: getPageName(p),
                    slug: p.slug,
                    isTopLevel: !p.parent_id,
                    parentId: p.parent_id,
                  }))}
                  value={newPageData.parent_id ? Number(newPageData.parent_id) : null}
                  onChange={(val) => {
                    const selectedParentId = val ? String(val) : '';
                    const parentPage = allParents.find((p) => String(p.id) === selectedParentId);
                    setNewPageData((prev) => {
                      let updatedSlug = prev.slug;
                      if (parentPage && parentPage.slug && !prev.slug.startsWith(`${parentPage.slug}/`)) {
                        updatedSlug = `${parentPage.slug}/${prev.slug.replace(/^[^\/]+\//, '')}`;
                      }
                      return {
                        ...prev,
                        parent_id: selectedParentId,
                        slug: updatedSlug,
                      };
                    });
                  }}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Search & select a parent page (e.g. Services, Locations, Company) to group this page under a parent hierarchy.
                </p>
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Publish Date & Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={newPageData.published_at}
                  onChange={(e) => setNewPageData({ ...newPageData, published_at: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
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
