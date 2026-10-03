'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { DesignPost, Category } from '@/types';
import { Plus, Edit2, Trash2, Search, Filter, Eye, Star } from 'lucide-react';

export default function AdminDesignsPage() {
  const [posts, setPosts] = useState<DesignPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedFeatured, setSelectedFeatured] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let params = [];
      if (search) params.push(`search=${search}`);
      if (selectedCategory) params.push(`category_id=${selectedCategory}`);
      if (selectedStatus) params.push(`status=${selectedStatus}`);
      if (selectedFeatured !== '') params.push(`is_featured=${selectedFeatured}`);

      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      const res = await apiClient.get(`/admin/design-posts${queryString}`);
      if (res.data.success) {
        setPosts(res.data.data.data || res.data.data);
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
    fetchPosts();
  }, [selectedCategory, selectedStatus, selectedFeatured]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await apiClient.delete(`/admin/design-posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const res = await apiClient.post(`/admin/design-posts/${id}/toggle-featured`);
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
          <h1 className="text-2xl font-extrabold text-slate-900">Blogs</h1>
          <p className="text-xs text-slate-500">Manage all blog posts, articles & visual interior design guides.</p>
        </div>

        <Link
          href="/admin/designs/new"
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Blog
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, category, style..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPosts()}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={selectedFeatured}
            onChange={(e) => setSelectedFeatured(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="">All Posts (Featured & Standard)</option>
            <option value="1">★ Featured Blogs Only</option>
            <option value="0">Standard Blogs Only</option>
          </select>
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
                <th className="p-4">Category</th>
                <th className="p-4">City</th>
                <th className="p-4">Publish Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-400">Loading blogs...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-400">No blogs found.</td></tr>
              ) : (

                posts.map((post) => {
                  const imgUrl = post.primary_image?.image || post.featured_image || '/placeholder.jpg';
                  const effectiveDateStr = post.published_at || post.created_at;
                  const pubDate = effectiveDateStr ? new Date(effectiveDateStr) : null;
                  const isScheduled = !!(post.published_at && new Date(post.published_at) > new Date());

                  return (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border">
                          <Image src={imgUrl} alt={post.title} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{post.title}</td>
                      <td className="p-4 font-semibold text-blue-600">{post.category?.name || 'Unassigned'}</td>
                      <td className="p-4">{post.city?.name || 'All Cities'}</td>
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
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleFeatured(post.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border ${
                            post.is_featured
                              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-sm'
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-600'
                          }`}
                          title={post.is_featured ? 'Featured post (click to unfeature)' : 'Click to mark as featured'}
                        >
                          <Star className={`w-3.5 h-3.5 ${post.is_featured ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                          <span>{post.is_featured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link href={`/admin/designs/${post.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg inline-block">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
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
      </div>
    </div>
  );
}
