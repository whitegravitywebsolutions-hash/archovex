'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { DesignPost, Category } from '@/types';
import { Plus, Edit2, Trash2, Search, Filter, Eye } from 'lucide-react';

export default function AdminDesignsPage() {
  const [posts, setPosts] = useState<DesignPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let params = [];
      if (search) params.push(`search=${search}`);
      if (selectedCategory) params.push(`category_id=${selectedCategory}`);
      if (selectedStatus) params.push(`status=${selectedStatus}`);

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
  }, [selectedCategory, selectedStatus]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this design post?')) return;
    try {
      await apiClient.delete(`/admin/design-posts/${id}`);
      fetchPosts();
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
                <th className="p-4">Style</th>
                <th className="p-4">City</th>
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

                  return (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border">
                          <Image src={imgUrl} alt={post.title} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{post.title}</td>
                      <td className="p-4 font-semibold text-blue-600">{post.category?.name || 'Unassigned'}</td>
                      <td className="p-4">{post.style || '—'}</td>
                      <td className="p-4">{post.city?.name || 'All Cities'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4">{post.is_featured ? '★ Yes' : 'No'}</td>
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
