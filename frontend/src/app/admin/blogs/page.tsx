'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { DesignPost, Category } from '@/types';
import { Plus, Edit2, Trash2, Search, Filter, Eye, Star, ChevronLeft, ChevronRight, Copy, ExternalLink } from 'lucide-react';

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<DesignPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedFeatured, setSelectedFeatured] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [fromItem, setFromItem] = useState(0);
  const [toItem, setToItem] = useState(0);
  const [perPage, setPerPage] = useState('25');

  const fetchPosts = async (page = currentPage) => {
    setLoading(true);
    try {
      let params = [`page=${page}`, `limit=${perPage}`];
      if (search) params.push(`search=${search}`);
      if (selectedCategory) params.push(`category_id=${selectedCategory}`);
      if (selectedStatus) params.push(`status=${selectedStatus}`);
      if (selectedFeatured !== '') params.push(`is_featured=${selectedFeatured}`);
      if (selectedOrder) params.push(`order=${selectedOrder}`);

      const queryString = `?${params.join('&')}`;
      const res = await apiClient.get(`/admin/blogs${queryString}`);
      if (res.data.success) {
        const paginated = res.data.data;
        if (paginated && paginated.data) {
          setPosts(paginated.data);
          setCurrentPage(paginated.current_page || 1);
          setLastPage(paginated.last_page || 1);
          setTotalBlogs(paginated.total || 0);
          setFromItem(paginated.from || 0);
          setToItem(paginated.to || 0);
        } else {
          setPosts(Array.isArray(paginated) ? paginated : []);
          setTotalBlogs(Array.isArray(paginated) ? paginated.length : 0);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiClient.get('/admin/categories').then((res) => {
      if (res.data.success) setCategories(res.data.data);
    });
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [selectedCategory, selectedStatus, selectedFeatured, selectedOrder, perPage]);

  const handleSearch = () => {
    fetchPosts(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
      fetchPosts(newPage);
    }
  };

  const handleCloneBlog = async (id: number) => {
    try {
      const res = await apiClient.post(`/admin/blogs/${id}/clone`);
      if (res.data?.success) {
        fetchPosts(currentPage);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to clone blog post');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await apiClient.delete(`/admin/blogs/${id}`);
      fetchPosts(currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const res = await apiClient.post(`/admin/blogs/${id}/toggle-featured`);
      if (res.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id ? { ...post, is_featured: res.data.is_featured } : post
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900">Blogs</h1>
            <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm">
              Total {totalBlogs} Blogs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage all blog posts, articles & visual interior design guides.</p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Blog
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 text-[11px]">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 text-[11px]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 text-[11px]">Sort By:</span>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="updated_desc">Last Edit (Newest First)</option>
              <option value="updated_asc">Last Edit (Oldest First)</option>
              <option value="published_desc">Publish Date (Newest First)</option>
              <option value="published_asc">Publish Date (Oldest First)</option>
              <option value="title_asc">Title (A to Z)</option>
              <option value="title_desc">Title (Z to A)</option>
            </select>
          </div>

          {/* Per Page Limit */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 text-[11px]">Per Page:</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Design Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-100">
                <th className="p-4">Primary Image</th>
                <th className="p-4">Blog Title</th>
                <th className="p-4">Publish Date & Time</th>
                <th className="p-4">Last Edit Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading blogs...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No blogs found.</td></tr>
              ) : (
                posts.map((post) => {
                  const imgUrl = post.primary_image?.image || post.featured_image || '/placeholder.jpg';
                  const effectiveDateStr = post.published_at || post.created_at;
                  const pubDate = effectiveDateStr ? new Date(effectiveDateStr) : null;
                  const updatedDate = post.updated_at ? new Date(post.updated_at) : null;
                  const isScheduled = !!(post.published_at && new Date(post.published_at) > new Date());

                  return (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border">
                          <Image src={imgUrl} alt={post.title} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{post.title}</td>
                      <td className="p-4 whitespace-nowrap">
                        {pubDate ? (
                          <div className="flex flex-col">
                            <span className={`font-semibold ${isScheduled ? 'text-amber-600 font-bold' : 'text-slate-800'}`}>
                              {pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {pubDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              {isScheduled && ' ⏰ (Scheduled)'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {updatedDate ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">
                              {updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {updatedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          post.status === 'published'
                            ? isScheduled
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {post.status === 'published' ? (isScheduled ? 'Scheduled' : 'Published') : post.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link href={`/admin/blogs/${post.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg inline-block" title="Edit Blog">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <a
                          href={`/blogs/${post.category?.slug ? `${post.category.slug}/` : ''}${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg inline-block transition-colors"
                          title="Open Live Blog in New Window"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleCloneBlog(post.id)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg inline-block transition-colors cursor-pointer"
                          title="Clone Blog Post (as Draft)"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg" title="Delete Blog">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalBlogs > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{fromItem}</span> to{' '}
              <span className="font-bold text-slate-900">{toItem}</span> of{' '}
              <span className="font-bold text-slate-900">{totalBlogs}</span> blogs
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg font-bold transition-all shadow-sm ${
                    pageNum === currentPage
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= lastPage || loading}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
