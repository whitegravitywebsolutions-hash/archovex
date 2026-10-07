'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, getImageUrl } from '@/lib/api';
import { 
  Search, 
  Save, 
  CheckCircle2, 
  Globe, 
  Share2, 
  Code, 
  Plus, 
  Edit3, 
  Sparkles, 
  Image as ImageIcon,
  Check,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface SeoRecord {
  id?: number;
  path: string;
  meta_title: string;
  meta_description: string;
  focus_keyphrase?: string;
  canonical_url: string;
  robots?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  og_title?: string;
  og_description?: string;
  og_url?: string;
  og_type?: string;
  og_site_name?: string;
  og_image?: string;
  twitter_card?: string;
  twitter_site?: string;
  schema_code?: string;
}

export default function AdminSeoManagementPage() {
  const [records, setRecords] = useState<SeoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<SeoRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [form, setForm] = useState<SeoRecord>({
    path: '/',
    meta_title: '',
    meta_description: '',
    focus_keyphrase: '',
    canonical_url: 'https://archovex.com',
    robots: 'index, follow',
    og_title: '',
    og_description: '',
    og_url: '',
    og_type: 'website',
    og_site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
    og_image: '',
    twitter_card: 'summary_large_image',
    schema_code: '',
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/seo');
      if (res.data.success && Array.isArray(res.data.data)) {
        setRecords(res.data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSelect = (rec: SeoRecord) => {
    setSelectedRecord(rec);
    setForm({
      id: rec.id,
      path: rec.path || '/',
      meta_title: rec.meta_title || '',
      meta_description: rec.meta_description || '',
      focus_keyphrase: rec.focus_keyphrase || '',
      canonical_url: rec.canonical_url || `https://archovex.com${rec.path}`,
      robots: rec.robots || 'index, follow',
      og_title: rec.og_title || rec.meta_title || '',
      og_description: rec.og_description || rec.meta_description || '',
      og_url: rec.og_url || rec.canonical_url || `https://archovex.com${rec.path}`,
      og_type: rec.og_type || 'website',
      og_site_name: rec.og_site_name || 'ARCHOVEX INFRA PRIVATE LIMITED',
      og_image: rec.og_image || '',
      twitter_card: rec.twitter_card || 'summary_large_image',
      schema_code: rec.schema_code || '',
    });
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setForm({
      path: '/new-page-path',
      meta_title: 'ARCHOVEX INFRA PRIVATE LIMITED | Luxury Interiors',
      meta_description: 'Custom luxury interior design & turn-key architectural execution solutions across India.',
      focus_keyphrase: 'luxury interior design',
      canonical_url: 'https://archovex.com/new-page-path',
      robots: 'index, follow',
      og_title: '',
      og_description: '',
      og_url: '',
      og_type: 'website',
      og_site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
      og_image: '',
      twitter_card: 'summary_large_image',
      schema_code: '',
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      let res;
      if (form.id) {
        res = await apiClient.put(`/admin/seo/${form.id}`, form);
      } else {
        res = await apiClient.post('/admin/seo', form);
      }

      if (res.data.success) {
        setMessage('SEO & Social Meta updated successfully!');
        setTimeout(() => setMessage(''), 4000);
        fetchRecords();
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save SEO metadata');
    } finally {
      setSaving(false);
    }
  };

  const filteredRecords = records.filter((r) =>
    (r.path || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.meta_title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const titleLength = (form.meta_title || '').length;
  const descLength = (form.meta_description || '').length;

  return (
    <div className="space-y-6 text-xs max-w-7xl mx-auto font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Search className="w-6 h-6 text-[#F97316]" />
            <span>SEO & Social Meta Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage Search Engine Meta Titles, Meta Descriptions, OpenGraph Tags, Social Cards, and JSON-LD Schemas across all URLs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRecords}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Route SEO</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Grid: List on Left, Editor & Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route SEO Records Table */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by path or title..."
              className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0C4A6E]"
            />
          </div>

          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b pb-2">
            <span>Configured URL Routes ({filteredRecords.length})</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#0C4A6E]" />
              <span>Loading SEO Metadata...</span>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {filteredRecords.map((rec) => {
                const isSelected = form.id === rec.id || form.path === rec.path;

                return (
                  <div
                    key={rec.id || rec.path}
                    onClick={() => handleSelect(rec)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-[#0C4A6E] text-white border-[#0C4A6E] shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#0C4A6E]'
                      }`}>
                        {rec.path}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        (rec.robots || 'index').includes('noindex')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isSelected ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {rec.robots || 'index, follow'}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {rec.meta_title || 'Untitled Page'}
                    </h4>

                    {rec.canonical_url && (
                      <p className={`text-[10px] truncate ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                        Canonical: {rec.canonical_url}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 italic">
              No matching SEO record found.
            </div>
          )}
        </div>

        {/* Right Column: Editor & Live SERP / Social Preview */}
        <div className="lg:col-span-7 space-y-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#0C4A6E]" />
                  <h3 className="text-sm font-black text-[#0C4A6E] uppercase tracking-wider">
                    {form.id ? `Editing SEO for ${form.path}` : 'Creating New SEO Record'}
                  </h3>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save SEO Metadata</span>
                </button>
              </div>

              {/* 1. GOOGLE SERP PREVIEW BOX */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                  Google Search Result Live Snippet Preview
                </span>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                  <div className="text-[11px] text-emerald-700 font-mono truncate">
                    {form.canonical_url || `https://archovex.com${form.path}`}
                  </div>
                  <h3 className="text-base font-medium text-blue-800 hover:underline cursor-pointer truncate">
                    {form.meta_title || 'Default Title | ARCHOVEX INFRA PRIVATE LIMITED'}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {form.meta_description || 'Default Meta Description snippet for search engines.'}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-bold pt-1">
                  <span className={titleLength >= 30 && titleLength <= 60 ? 'text-emerald-600' : 'text-amber-600'}>
                    Title: {titleLength} / 60 chars {titleLength >= 30 && titleLength <= 60 ? '✓ Good' : '⚠️ Rec. 30-60'}
                  </span>
                  <span className={descLength >= 120 && descLength <= 160 ? 'text-emerald-600' : 'text-amber-600'}>
                    Desc: {descLength} / 160 chars {descLength >= 120 && descLength <= 160 ? '✓ Good' : '⚠️ Rec. 120-160'}
                  </span>
                </div>
              </div>

              {/* 2. MAIN SEO FIELDS */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Page Path *</label>
                    <input
                      type="text"
                      value={form.path}
                      onChange={(e) => setForm({ ...form, path: e.target.value })}
                      placeholder="e.g. /about-us or /blogs/modular-kitchen"
                      className="w-full p-2.5 border rounded-xl font-mono text-xs font-bold text-[#0C4A6E]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Focus Keyphrase</label>
                    <input
                      type="text"
                      value={form.focus_keyphrase || ''}
                      onChange={(e) => setForm({ ...form, focus_keyphrase: e.target.value })}
                      placeholder="e.g. luxury interior designers"
                      className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meta Title Tag *</label>
                  <input
                    type="text"
                    value={form.meta_title}
                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                    placeholder="Best Interior Designers in India | ARCHOVEX INFRA"
                    className="w-full p-2.5 border rounded-xl text-xs font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meta Description *</label>
                  <textarea
                    rows={3}
                    value={form.meta_description}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                    placeholder="Turnkey interior design services with 10-year warranty..."
                    className="w-full p-2.5 border rounded-xl text-xs leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={form.canonical_url}
                      onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                      placeholder="https://archovex.com/page-path"
                      className="w-full p-2.5 border rounded-xl font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Robots Directives</label>
                    <select
                      value={form.robots || 'index, follow'}
                      onChange={(e) => setForm({ ...form, robots: e.target.value })}
                      className="w-full p-2.5 border rounded-xl text-xs font-bold"
                    >
                      <option value="index, follow">index, follow (Default - Allow Search Indexing)</option>
                      <option value="noindex, follow">noindex, follow (Hide Page from Google, Follow Links)</option>
                      <option value="noindex, nofollow">noindex, nofollow (Strict Block)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. OPENGRAPH & SOCIAL MEDIA META */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#0C4A6E] tracking-wider">
                  <Share2 className="w-4 h-4 text-[#F97316]" />
                  <span>OpenGraph & Social Sharing Card Metadata</span>
                </div>

                <div className="p-4 bg-[#FAF8F3] border border-[#E4DCD0] rounded-xl space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">OpenGraph Title</label>
                      <input
                        type="text"
                        value={form.og_title || ''}
                        onChange={(e) => setForm({ ...form, og_title: e.target.value })}
                        placeholder="Leave blank to fallback to Meta Title"
                        className="w-full p-2.5 bg-white border rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">OpenGraph Type</label>
                      <select
                        value={form.og_type || 'website'}
                        onChange={(e) => setForm({ ...form, og_type: e.target.value })}
                        className="w-full p-2.5 bg-white border rounded-xl text-xs font-semibold"
                      >
                        <option value="website">website</option>
                        <option value="article">article</option>
                        <option value="product">product</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">OpenGraph Description</label>
                    <textarea
                      rows={2}
                      value={form.og_description || ''}
                      onChange={(e) => setForm({ ...form, og_description: e.target.value })}
                      placeholder="Leave blank to fallback to Meta Description"
                      className="w-full p-2.5 bg-white border rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">OpenGraph Banner Image URL</label>
                    <input
                      type="text"
                      value={form.og_image || ''}
                      onChange={(e) => setForm({ ...form, og_image: e.target.value })}
                      placeholder="https://archovex.com/og-banner.jpg"
                      className="w-full p-2.5 bg-white border rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 4. JSON-LD SCHEMA CODE */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#0C4A6E] tracking-wider">
                  <Code className="w-4 h-4 text-[#F97316]" />
                  <span>Custom JSON-LD Structured Data Schema</span>
                </div>

                <textarea
                  rows={4}
                  value={form.schema_code || ''}
                  onChange={(e) => setForm({ ...form, schema_code: e.target.value })}
                  placeholder='<script type="application/ld+json">{"@context": "https://schema.org", "@type": "Organization"}</script>'
                  className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-black rounded-xl uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save SEO & Social Metadata</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
              <Search className="w-12 h-12 text-[#F97316] mx-auto opacity-50" />
              <h3 className="text-base font-black text-[#0C4A6E] uppercase">Select a URL Route to Edit SEO</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose any path from the left list or click "Add Route SEO" to configure Meta Tags, OpenGraph Cards, and JSON-LD Schemas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
