'use client';

import React, { useState } from 'react';
import { Globe, Trash2, Plus, Code, Sparkles, Check } from 'lucide-react';

export interface SeoData {
  path?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyphrase?: string;
  canonical_url?: string;
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

interface SeoFormBlockProps {
  data: SeoData;
  onChange: (updatedData: SeoData) => void;
  onSave?: () => void;
  saving?: boolean;
}

export default function SeoFormBlock({ data, onChange, onSave, saving = false }: SeoFormBlockProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (field: keyof SeoData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 text-xs font-sans shadow-sm">
      {/* Block Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-sm">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>SEO & Social Meta Management</span>
              <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                Meta Suite
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">Configure search engine indexing, OpenGraph card previews, and JSON-LD structured schemas.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-all"
          >
            {isOpen ? 'Collapse Block' : 'Expand Block'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-6 animate-fade-in">
          {/* Path / Target Route */}
          {data.path !== undefined && (
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                Target Page Path <span className="text-slate-400 font-normal">(path)</span>
              </label>
              <input
                type="text"
                value={data.path || ''}
                onChange={(e) => handleChange('path', e.target.value)}
                placeholder="/designs/modular-kitchen-designs"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
              />
            </div>
          )}

          {/* Row 1: metaTitle & metaDescription */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                Meta Title <span className="text-slate-400 font-normal">(metaTitle)</span>
              </label>
              <input
                type="text"
                value={data.meta_title || ''}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                placeholder="Best Luxury Modular Interiors | ARCHOVEX INFRA"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                Meta Description <span className="text-slate-400 font-normal">(metaDescription)</span>
              </label>
              <textarea
                rows={3}
                value={data.meta_description || ''}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                placeholder="ARCHOVEX INFRA offers luxury modular kitchens, living room interiors, sliding wardrobes with 10-year warranty..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none resize-none transition-all"
              />
            </div>
          </div>

          {/* Row 2: focusKeyphrase & canonicalURL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                Focus Keyphrase <span className="text-slate-400 font-normal">(focusKeyphrase)</span>
              </label>
              <input
                type="text"
                value={data.focus_keyphrase || ''}
                onChange={(e) => handleChange('focus_keyphrase', e.target.value)}
                placeholder="luxury interior design, modular kitchen"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                Canonical URL <span className="text-slate-400 font-normal">(canonicalURL)</span>
              </label>
              <input
                type="text"
                value={data.canonical_url || ''}
                onChange={(e) => handleChange('canonical_url', e.target.value)}
                placeholder="https://archovex.com/designs/modular-kitchen-designs"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 3: robotsIndex & robotsFollow Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-800">
                  Search Engine Indexing <span className="text-slate-400 font-normal">(robotsIndex)</span>
                </label>
              </div>
              <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleChange('robots_index', false)}
                  className={`px-6 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    data.robots_index === false
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  FALSE
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('robots_index', true)}
                  className={`px-6 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    data.robots_index !== false
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  TRUE
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-800">
                  Follow Links <span className="text-slate-400 font-normal">(robotsFollow)</span>
                </label>
              </div>
              <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleChange('robots_follow', false)}
                  className={`px-6 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    data.robots_follow === false
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  FALSE
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('robots_follow', true)}
                  className={`px-6 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    data.robots_follow !== false
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  TRUE
                </button>
              </div>
            </div>
          </div>

          {/* Row 4: ogTitle & ogDescription */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                OpenGraph Title <span className="text-slate-400 font-normal">(ogTitle)</span>
              </label>
              <input
                type="text"
                value={data.og_title || ''}
                onChange={(e) => handleChange('og_title', e.target.value)}
                placeholder="ARCHOVEX INFRA | Luxury Home Interiors"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                OpenGraph Description <span className="text-slate-400 font-normal">(ogDescription)</span>
              </label>
              <textarea
                rows={3}
                value={data.og_description || ''}
                onChange={(e) => handleChange('og_description', e.target.value)}
                placeholder="Explore award-winning home interior concepts..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none resize-none transition-all"
              />
            </div>
          </div>

          {/* Row 5: ogURL & ogType */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                OpenGraph URL <span className="text-slate-400 font-normal">(ogURL)</span>
              </label>
              <input
                type="text"
                value={data.og_url || ''}
                onChange={(e) => handleChange('og_url', e.target.value)}
                placeholder="https://archovex.com/designs"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                OpenGraph Type <span className="text-slate-400 font-normal">(ogType)</span>
              </label>
              <input
                type="text"
                value={data.og_type || 'website'}
                onChange={(e) => handleChange('og_type', e.target.value)}
                placeholder="website"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 6: ogSiteName & ogImage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                Site Brand Name <span className="text-slate-400 font-normal">(ogSiteName)</span>
              </label>
              <input
                type="text"
                value={data.og_site_name || 'ARCHOVEX INFRA PRIVATE LIMITED'}
                onChange={(e) => handleChange('og_site_name', e.target.value)}
                placeholder="ARCHOVEX INFRA PRIVATE LIMITED"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                Social Share Image <span className="text-slate-400 font-normal">(ogImage)</span>
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-slate-900 bg-slate-50 rounded-xl p-4 text-center cursor-pointer transition-all">
                <input
                  type="text"
                  value={data.og_image || ''}
                  onChange={(e) => handleChange('og_image', e.target.value)}
                  placeholder="https://images.unsplash.com/... or upload image URL"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none mb-2 focus:border-slate-900"
                />
                <div className="flex flex-col items-center justify-center text-slate-500 space-y-1">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">Paste social share image URL or upload asset</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 7: twitterCard & twitterSite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                Twitter Card Format <span className="text-slate-400 font-normal">(twitterCard)</span>
              </label>
              <input
                type="text"
                value={data.twitter_card || 'summary_large_image'}
                onChange={(e) => handleChange('twitter_card', e.target.value)}
                placeholder="summary_large_image"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
                Twitter Handle <span className="text-slate-400 font-normal">(twitterSite)</span>
              </label>
              <input
                type="text"
                value={data.twitter_site || '@archovexinfra'}
                onChange={(e) => handleChange('twitter_site', e.target.value)}
                placeholder="@archovexinfra"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 8: schema JSON Code Block Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-900" />
                <span>Structured Data Schema <span className="text-slate-400 font-normal">(schema / JSON-LD)</span></span>
              </label>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">JSON-LD Editor</span>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs shadow-inner">
              <textarea
                rows={6}
                value={data.schema_code || '{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "ARCHOVEX INFRA"\n}'}
                onChange={(e) => handleChange('schema_code', e.target.value)}
                className="w-full bg-transparent text-emerald-400 focus:outline-none resize-y font-mono text-xs leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Save Button */}
          {onSave && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Page SEO Settings'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
