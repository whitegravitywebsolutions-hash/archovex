'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Loader2,
  CheckCircle2,
  Globe,
  Layout,
  FileText,
  Star,
  MapPin,
  HelpCircle,
  ShieldCheck,
  Megaphone,
  Image as ImageIcon,
  Code,
  BookOpen
} from 'lucide-react';
import SeoFormBlock, { SeoData } from '@/components/admin/SeoFormBlock';
import MediaPickerModal from '@/components/admin/MediaPickerModal';

interface SectionItem {
  id: string;
  type: string;
  is_active: boolean;
  title?: string;
  subtitle?: string;
  badge?: string;
  bg_image?: string;
  cta_text?: string;
  cta_link?: string;
  theme?: 'light' | 'dark' | 'slate';
  content?: string;
  items?: any[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VisualPageBuilderPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const pageId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Page Core Info
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('published');
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [activeTab, setActiveTab] = useState<'builder' | 'seo'>('builder');
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetSecId, setMediaTargetSecId] = useState<string | null>(null);

  // SEO Data
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

  const fetchPage = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/admin/pages/${pageId}`);
      if (res.data.success) {
        const page = res.data.data;
        setTitle(page.title);
        setSlug(page.slug);
        setStatus(page.status);
        setSections(Array.isArray(page.sections) ? page.sections : []);

        const path = page.slug === 'home' ? '/' : `/${page.slug}`;
        if (page.seo_data) {
          setSeoData({
            ...page.seo_data,
            path,
            robots_index: page.seo_data.robots_index ?? true,
            robots_follow: page.seo_data.robots_follow ?? true,
          });
        } else {
          setSeoData((prev) => ({
            ...prev,
            path,
            meta_title: page.meta_title || page.title,
            meta_description: page.meta_description || '',
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  // Section Library Catalogs
  const sectionCatalog = [
    {
      type: 'hero',
      label: 'Hero Banner',
      icon: Layout,
      desc: 'Large visual banner with background image, headline, and CTA button.',
      defaultData: {
        type: 'hero',
        title: 'Bespoke Luxury Home Interiors & Modular Designs',
        subtitle: 'Turnkey interior solutions with 45-day delivery guarantee & 10-year warranty.',
        badge: 'PREMIUM INTERIOR FIRM',
        cta_text: 'Book Free Design Consultation',
        cta_link: '#consultation',
        bg_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
        theme: 'dark',
      },
    },
    {
      type: 'hero_slider',
      label: 'Full Width Hero Slider',
      icon: ImageIcon,
      desc: 'Full width hero banner carousel slider with multiple slides, background images, headlines, and CTAs.',
      defaultData: {
        type: 'hero_slider',
        title: 'Full Width Hero Slider',
        items: [
          {
            title: 'LUXURY TURNKEY INTERIORS & ARCHITECTURE',
            subtitle: 'Bespoke modular kitchens, living room spaces, and custom wardrobes with German hardware & 10-year warranty.',
            bg_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
            cta_text: 'BOOK FREE CONSULTATION',
            cta_link: '',
            badge: 'ARCHOVEX LUXURY HOMES'
          },
          {
            title: 'CRAFTED IN AUTOMATED GERMAN FACTORIES',
            subtitle: 'Sub-millimeter precision woodworking with Boiling Water Resistant (BWR) plywood and 45-day guaranteed handover.',
            bg_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80',
            cta_text: 'EXPLORE DESIGNS',
            cta_link: '/designs',
            badge: '45-DAY HANDOVER GUARANTEE'
          },
          {
            title: 'PHOTOREALISTIC 3D DESIGN RENDERS',
            subtitle: 'Visualize your entire home in 3D before execution begins with complete line-item price transparency.',
            bg_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
            cta_text: 'SEE RECENT PROJECTS',
            cta_link: '/designs',
            badge: '10-YEAR WARRANTY'
          }
        ]
      },
    },
    {
      type: 'stats',
      label: 'Trust Highlights & Counters',
      icon: ShieldCheck,
      desc: 'Highlight warranties, delivery timeline, and happy customer counts.',
      defaultData: {
        type: 'stats',
        title: 'Why 140,000+ Homeowners Trust ARCHOVEX',
        subtitle: 'Unmatched material quality, transparent pricing, and German engineering.',
        items: [
          { number: '10-Year Warranty', label: 'Flat 10 years warranty on all modular units' },
          { number: '45-Day Delivery', label: 'Guaranteed on-time installation or we pay penalty' },
          { number: '140,000+ Homes', label: 'Successfully designed and delivered across India' },
        ],
      },
    },
    {
      type: 'categories',
      label: 'Category Showcase Grid',
      icon: Layers,
      desc: 'Grid showcasing Modular Kitchens, Living Rooms, Wardrobes, and Offerings.',
      defaultData: {
        type: 'categories',
        title: 'Explore Interior Categories',
        subtitle: 'Handcrafted interior designs tailored to your floor plan and aesthetic preferences.',
        badge: 'DESIGN CATALOG',
      },
    },
    {
      type: 'posts',
      label: 'Featured Design Posts Grid',
      icon: Sparkles,
      desc: 'Showcase top interior design posts & inspirations.',
      defaultData: {
        type: 'posts',
        title: 'Latest Interior Design Posts',
        subtitle: 'Get inspired by our curated portfolio of real home projects.',
        badge: 'PORTFOLIO SHOWCASE',
      },
    },
    {
      type: 'process',
      label: '4-Step Design Process',
      icon: FileText,
      desc: 'Explain consultation, 3D design, production, and installation workflow.',
      defaultData: {
        type: 'process',
        title: 'Our Hassle-Free 4-Step Journey',
        subtitle: 'From initial consultation to final keys handover in 45 days.',
        items: [
          { title: '1. Free Consultation', desc: 'Meet our interior experts to discuss requirements & budget.' },
          { title: '2. 3D Design & Selection', desc: 'Visualize your space in 3D with material samples.' },
          { title: '3. Precision Manufacturing', desc: 'European German machinery crafted modular units.' },
          { title: '4. On-Time Installation', desc: 'Professional site installation and 10-year warranty certificate.' },
        ],
      },
    },
    {
      type: 'testimonials',
      label: 'Customer Testimonials',
      icon: Star,
      desc: 'Display homeowner reviews and ratings.',
      defaultData: {
        type: 'testimonials',
        title: 'What Homeowners Say About ARCHOVEX',
        subtitle: 'Read real reviews from homeowners who transformed their spaces with us.',
        badge: 'HAPPY HOMEOWNERS',
        items: [
          { name: 'Rajesh & Priya Verma', role: '3BHK Homeowner, Bangalore', quote: 'ARCHOVEX rendered precise 3D designs and delivered our home right on schedule.' },
          { name: 'Ananya Sharma', role: 'Villa Owner, Hyderabad', quote: 'Superb quality and zero hidden charges! The project manager kept us updated every single week.' }
        ]
      },
    },
    {
      type: 'faq',
      label: 'FAQ Accordion',
      icon: HelpCircle,
      desc: 'Frequently asked questions regarding warranty, pricing, and execution.',
      defaultData: {
        type: 'faq',
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about our interior design services.',
        items: [
          { question: 'What is included in the 10-year warranty?', answer: 'Our 10-year warranty covers all modular cabinetry, hinges, drawer channels, and structural materials against manufacturing defects.' },
          { question: 'How does the 45-day delivery guarantee work?', answer: 'Once your 3D design is approved and sign-off is completed, installation will be finished on site within 45 days.' },
        ],
      },
    },
    {
      type: 'richtext',
      label: 'Rich Text / Freeform Content',
      icon: FileText,
      desc: 'Add text paragraphs, custom headings, or rich HTML content.',
      defaultData: {
        type: 'richtext',
        title: 'Custom Content Section',
        content: 'ARCHOVEX INFRA PRIVATE LIMITED is an architectural & interior design firm delivering bespoke modular kitchens, living room concepts, custom wardrobes, and turnkey home interiors across India.',
      },
    },
    {
      type: 'cta',
      label: 'Call-To-Action (CTA) Banner',
      icon: Megaphone,
      desc: 'Full-width banner for booking consultations or capturing leads.',
      defaultData: {
        type: 'cta',
        title: 'Ready to Build Your Dream Home Interiors?',
        subtitle: 'Get a personalized 3D design consultation and instant price quote today.',
        cta_text: 'Book Free Consultation',
        cta_link: '#consultation',
        theme: 'dark',
      },
    },
    {
      type: 'custom_html',
      label: 'Custom HTML / Embed Code',
      icon: Code,
      desc: 'Embed custom raw HTML, custom widgets, iframes, or custom layout markup.',
      defaultData: {
        type: 'custom_html',
        title: 'Custom HTML Block',
        html_code: '<div class="p-8 bg-slate-900 text-white rounded-2xl text-center"><h3 class="text-2xl font-bold uppercase tracking-tight">Custom HTML Section</h3><p class="mt-2 text-slate-300 text-sm">Enter any custom HTML markup, iframe, or embed script snippet here.</p></div>',
      },
    },
    {
      type: 'all_services_filter',
      label: 'All Services with Filter',
      icon: Layers,
      desc: 'Display all active services/categories with live search & filters.',
      defaultData: {
        type: 'all_services_filter',
        title: 'All Interior Design Services',
        subtitle: 'Explore our comprehensive range of turnkey interior design and architectural solutions.',
        badge: 'OUR SERVICES',
      },
    },
    {
      type: 'all_blogs_filter',
      label: 'All Blogs with Filter',
      icon: BookOpen,
      desc: 'Display all active blogs & design posts with category filter pills, live search, and pagination.',
      defaultData: {
        type: 'all_blogs_filter',
        title: 'All Blogs & Design Inspirations',
        subtitle: 'Read our latest articles, design tips, trends, and home decor guides.',
        badge: 'INSIGHTS & BLOGS',
      },
    },
    {
      type: 'design_catalog',
      label: 'Hero Banner (Dark Theme)',
      icon: Layout,
      desc: 'Dark theme hero section banner with customizable badge, main headline, and paragraph subtitle.',
      defaultData: {
        type: 'design_catalog',
        title: 'EXPLORE INTERIOR DESIGNS',
        subtitle: 'Discover bespoke designs categorized by room, layout, style, and city.',
        badge: 'COMPLETE INTERIOR CATALOG',
      },
    },
  ];

  const addSection = (catalogItem: any) => {
    const newSec: SectionItem = {
      ...catalogItem.defaultData,
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      is_active: true,
    };
    setSections([...sections, newSec]);
    setExpandedSectionId(newSec.id);
  };

  const removeSection = (id: string) => {
    if (!confirm('Are you sure you want to remove this section?')) return;
    setSections(sections.filter((s) => s.id !== id));
  };

  const toggleSectionActive = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setSections(updated);
  };

  const updateSectionField = (id: string, field: keyof SectionItem, value: any) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleOpenMediaPicker = (secId: string) => {
    setMediaTargetSecId(secId);
    setIsMediaPickerOpen(true);
  };

  const handleSelectMedia = (selectedUrls: string[]) => {
    if (selectedUrls.length > 0 && mediaTargetSecId) {
      updateSectionField(mediaTargetSecId, 'bg_image', selectedUrls[0]);
    }
    setIsMediaPickerOpen(false);
  };

  const updateSectionItemField = (secId: string, itemIdx: number, field: string, value: any) => {
    setSections(sections.map((s) => {
      if (s.id !== secId) return s;
      const currentItems = Array.isArray(s.items) ? [...s.items] : [];
      if (!currentItems[itemIdx]) currentItems[itemIdx] = {};
      currentItems[itemIdx] = { ...currentItems[itemIdx], [field]: value };
      return { ...s, items: currentItems };
    }));
  };

  const addSectionArrayItem = (secId: string, defaultItem: any) => {
    setSections(sections.map((s) => {
      if (s.id !== secId) return s;
      const currentItems = Array.isArray(s.items) ? [...s.items] : [];
      return { ...s, items: [...currentItems, defaultItem] };
    }));
  };

  const removeSectionArrayItem = (secId: string, itemIdx: number) => {
    setSections(sections.map((s) => {
      if (s.id !== secId) return s;
      const currentItems = Array.isArray(s.items) ? [...s.items] : [];
      currentItems.splice(itemIdx, 1);
      return { ...s, items: currentItems };
    }));
  };

  const handleSavePage = async () => {
    setSaving(true);
    setSuccessMessage('');

    const pagePath = slug === 'home' ? '/' : `/${slug}`;
    const payload = {
      title,
      slug,
      status,
      sections,
      meta_title: seoData.meta_title || title,
      meta_description: seoData.meta_description || '',
      seo_data: {
        ...seoData,
        path: pagePath,
        meta_title: seoData.meta_title || title,
        meta_description: seoData.meta_description || '',
      },
    };

    try {
      await apiClient.put(`/admin/pages/${pageId}`, payload);
      setSuccessMessage('Page layout & sections saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-slate-800" />
        <span>Loading Visual Page Builder...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs font-sans max-w-7xl mx-auto pb-20">
      {/* Top Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-16 z-20">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => router.push('/admin/pages')}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg border hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>Editing: {title || 'Untitled Page'}</span>
              <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-mono">
                {slug === 'home' ? '/' : `/${slug}`}
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">Add, drag-and-drop, and edit dynamic interior design sections.</p>
          </div>
        </div>

        {/* Tab Switcher & Save Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'builder' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visual Builder ({sections.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'seo' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Page SEO Settings
            </button>
          </div>

          <button
            type="button"
            onClick={handleSavePage}
            disabled={saving}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Page</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Page Meta Header Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Page Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">URL Path / Slug *</label>
          <input
            type="text"
            disabled={slug === 'home'}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs font-mono disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* TAB 1: VISUAL BUILDER */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: SECTION CATALOG LIBRARY */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 sticky top-40">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center justify-between border-b pb-2">
                <span>Add Section Block</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Library</span>
              </h3>
              <p className="text-[11px] text-slate-500">Click any block to add it to your page layout.</p>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {sectionCatalog.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.type}
                      type="button"
                      onClick={() => addSection(cat)}
                      className="w-full p-3 rounded-xl border border-slate-200 hover:border-slate-900 bg-slate-50/70 hover:bg-slate-900 hover:text-white text-left transition-all group flex items-start gap-3"
                    >
                      <div className="p-2 bg-white group-hover:bg-slate-800 text-slate-900 group-hover:text-white rounded-lg shadow-sm border border-slate-200/80 group-hover:border-slate-700">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs block text-slate-900 group-hover:text-white mb-0.5">
                          + {cat.label}
                        </span>
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-300 leading-tight block">
                          {cat.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: DRAG & DROP REORDERING SECTION STACK */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-900" />
                <span>Page Section Stack ({sections.length})</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Use Up/Down arrows to reorder sections</span>
            </div>

            {sections.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400 space-y-3">
                <Layout className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-bold text-slate-700 text-xs">No sections added yet.</p>
                <p className="text-[11px]">Click any section block on the left panel to build your custom layout.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((sec, index) => {
                  const isExpanded = expandedSectionId === sec.id;
                  const catInfo = sectionCatalog.find((c) => c.type === sec.type);
                  const Icon = catInfo?.icon || Layout;

                  return (
                    <div
                      key={sec.id}
                      className={`bg-white rounded-2xl border transition-all shadow-sm ${
                        sec.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                      }`}
                    >
                      {/* Section Card Header & Control Bar */}
                      <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                          <div className="text-slate-400">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className="p-2 bg-slate-900 text-white rounded-lg shadow-sm">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-xs">
                                {index + 1}. {catInfo?.label || sec.type.toUpperCase()}
                              </span>
                              {!sec.is_active && (
                                <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                  Disabled
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 truncate max-w-xs block font-mono">
                              {sec.title || 'Untitled Section'}
                            </span>
                          </div>
                        </div>

                        {/* Reorder & Action Controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveSection(index, 'up')}
                            className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 hover:bg-slate-200 rounded-lg"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === sections.length - 1}
                            onClick={() => moveSection(index, 'down')}
                            className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 hover:bg-slate-200 rounded-lg"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleSectionActive(sec.id)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg"
                            title={sec.is_active ? 'Hide Section' : 'Show Section'}
                          >
                            {sec.is_active ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                          >
                            <span>{isExpanded ? 'Collapse' : 'Edit'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => removeSection(sec.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Section Editor Form Body */}
                      {isExpanded && (
                        <div className="p-6 space-y-5 text-xs bg-white rounded-b-2xl animate-fade-in border-t border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Section Heading / Title</label>
                              <input
                                type="text"
                                value={sec.title || ''}
                                onChange={(e) => updateSectionField(sec.id, 'title', e.target.value)}
                                className="w-full p-2.5 border rounded-xl"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Badge Tagline (Optional)</label>
                              <input
                                type="text"
                                value={sec.badge || ''}
                                onChange={(e) => updateSectionField(sec.id, 'badge', e.target.value)}
                                placeholder="e.g. NATIONWIDE PRESENCE"
                                className="w-full p-2.5 border rounded-xl"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Subtitle / Paragraph Description</label>
                            <textarea
                              rows={2}
                              value={sec.subtitle || ''}
                              onChange={(e) => updateSectionField(sec.id, 'subtitle', e.target.value)}
                              className="w-full p-2.5 border rounded-xl"
                            />
                          </div>

                          {(sec.type === 'hero' || sec.type === 'cta' || sec.type === 'hero_banner') && (
                            <div className="space-y-4 pt-2 border-t border-slate-200">
                              <span className="text-xs font-black uppercase text-[#0C4A6E] tracking-wider block">
                                CTA Action Buttons (Primary & Secondary)
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Button Text</label>
                                  <input
                                    type="text"
                                    value={sec.cta_text || ''}
                                    onChange={(e) => updateSectionField(sec.id, 'cta_text', e.target.value)}
                                    placeholder="e.g. Book Free Design Consultation"
                                    className="w-full p-2.5 bg-white border rounded-xl text-xs font-semibold"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Button Link</label>
                                  <input
                                    type="text"
                                    value={sec.cta_link || ''}
                                    onChange={(e) => updateSectionField(sec.id, 'cta_link', e.target.value)}
                                    placeholder="e.g. #consultation or /blogs"
                                    className="w-full p-2.5 bg-white border rounded-xl font-mono text-[11px]"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary CTA Button Text (Optional)</label>
                                  <input
                                    type="text"
                                    value={sec.secondary_cta_text || ''}
                                    onChange={(e) => updateSectionField(sec.id, 'secondary_cta_text', e.target.value)}
                                    placeholder="e.g. Explore Blogs"
                                    className="w-full p-2.5 bg-white border rounded-xl text-xs font-semibold"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary CTA Button Link (Optional)</label>
                                  <input
                                    type="text"
                                    value={sec.secondary_cta_link || ''}
                                    onChange={(e) => updateSectionField(sec.id, 'secondary_cta_link', e.target.value)}
                                    placeholder="e.g. /blogs or #consultation"
                                    className="w-full p-2.5 bg-white border rounded-xl font-mono text-[11px]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {sec.type === 'hero' && (
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Background Image URL</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={sec.bg_image || ''}
                                  onChange={(e) => updateSectionField(sec.id, 'bg_image', e.target.value)}
                                  className="flex-grow p-2.5 border rounded-xl font-mono text-[11px]"
                                  placeholder="https://..."
                                />
                                <button
                                  type="button"
                                  onClick={() => handleOpenMediaPicker(sec.id)}
                                  className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>Media Library</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* DYNAMIC ITEMS EDITORS BASED ON SECTION TYPE */}

                          {/* HERO SLIDER SLIDES EDITOR */}
                          {(sec.type === 'hero_slider' || sec.type === 'full_width_hero') && (
                            <div className="space-y-4 pt-3 border-t border-slate-200">
                              <div className="flex items-center justify-between">
                                <label className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                  <ImageIcon className="w-4 h-4 text-blue-700" />
                                  <span>Hero Banner Slider Slides (Full Width Carousels)</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => addSectionArrayItem(sec.id, {
                                    title: 'NEW SLIDE TITLE',
                                    subtitle: 'Bespoke modular interior design with German hardware.',
                                    bg_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
                                    cta_text: 'BOOK CONSULTATION',
                                    cta_link: '',
                                    badge: 'EXCLUSIVE INTERIORS'
                                  })}
                                  className="px-3 py-1 bg-blue-700 text-white font-bold rounded-lg text-[11px] hover:bg-blue-800 transition-colors"
                                >
                                  + Add Slide
                                </button>
                              </div>

                              {Array.isArray(sec.items) && sec.items.length > 0 ? (
                                <div className="space-y-4">
                                  {sec.items.map((slide: any, slideIdx: number) => (
                                    <div key={slideIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group">
                                      <div className="flex items-center justify-between border-b pb-2">
                                        <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                                          Slide #{slideIdx + 1}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => removeSectionArrayItem(sec.id, slideIdx)}
                                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg text-[11px] font-bold flex items-center gap-1"
                                          title="Remove Slide"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>Remove Slide</span>
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Slide Title *</label>
                                          <input
                                            type="text"
                                            value={slide.title || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, slideIdx, 'title', e.target.value)}
                                            placeholder="Slide Headline"
                                            className="w-full p-2 border rounded-lg text-xs"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Badge / Tagline</label>
                                          <input
                                            type="text"
                                            value={slide.badge || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, slideIdx, 'badge', e.target.value)}
                                            placeholder="e.g. 10-YEAR WARRANTY"
                                            className="w-full p-2 border rounded-lg text-xs"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Subtitle / Description</label>
                                        <textarea
                                          rows={2}
                                          value={slide.subtitle || ''}
                                          onChange={(e) => updateSectionItemField(sec.id, slideIdx, 'subtitle', e.target.value)}
                                          placeholder="Slide Paragraph"
                                          className="w-full p-2 border rounded-lg text-xs"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Background Image URL</label>
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={slide.bg_image || slide.image || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, slideIdx, 'bg_image', e.target.value)}
                                            placeholder="https://..."
                                            className="flex-grow p-2 border rounded-lg text-xs font-mono text-[11px]"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleOpenMediaPicker(sec.id)}
                                            className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1"
                                          >
                                            <ImageIcon className="w-3.5 h-3.5" />
                                            <span>Media</span>
                                          </button>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Primary CTA Button Text</label>
                                          <input
                                            type="text"
                                            value={slide.cta_text || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, slideIdx, 'cta_text', e.target.value)}
                                            placeholder="e.g. BOOK FREE CONSULTATION"
                                            className="w-full p-2 border rounded-lg text-xs font-semibold"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Primary CTA Button Link</label>
                                          <input
                                            type="text"
                                            value={slide.cta_link || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, slideIdx, 'cta_link', e.target.value)}
                                            placeholder="e.g. #consultation or /blogs"
                                            className="w-full p-2 border rounded-lg text-xs font-mono text-[11px]"
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Secondary CTA Button Text (Optional)</label>
                                          <input
                                            type="text"
                                            value={slide.secondary_cta_text || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, slideIdx, 'secondary_cta_text', e.target.value)}
                                            placeholder="e.g. VIEW BLOGS"
                                            className="w-full p-2 border rounded-lg text-xs font-semibold"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Secondary CTA Button Link (Optional)</label>
                                          <input
                                            type="text"
                                            value={slide.secondary_cta_link || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, slideIdx, 'secondary_cta_link', e.target.value)}
                                            placeholder="e.g. /blogs or #consultation"
                                            className="w-full p-2 border rounded-lg text-xs font-mono text-[11px]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic">No slides added. Click + Add Slide to create custom hero banners.</p>
                              )}
                            </div>
                          )}

                          {/* 1. STATS / TRUST COUNTERS */}
                          {(sec.type === 'stats' || sec.type === 'trust_counters') && (
                            <div className="space-y-3 pt-3 border-t border-slate-200">
                              <div className="flex items-center justify-between">
                                <label className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                                  Trust Highlights / Stat Counters (Items)
                                </label>
                                <button
                                  type="button"
                                  onClick={() => addSectionArrayItem(sec.id, { number: '100+', label: 'New Highlight' })}
                                  className="px-3 py-1 bg-blue-700 text-white font-bold rounded-lg text-[11px] hover:bg-blue-800 transition-colors"
                                >
                                  + Add Counter Item
                                </button>
                              </div>

                              {Array.isArray(sec.items) && sec.items.length > 0 ? (
                                <div className="space-y-3">
                                  {sec.items.map((item: any, itemIdx: number) => (
                                    <div key={itemIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Highlight Number / Title</label>
                                          <input
                                            type="text"
                                            value={item.number || item.value || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, itemIdx, 'number', e.target.value)}
                                            placeholder="e.g. 10-Year Warranty"
                                            className="w-full p-2 border rounded-lg text-xs"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Label / Subtitle</label>
                                          <input
                                            type="text"
                                            value={item.label || item.text || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, itemIdx, 'label', e.target.value)}
                                            placeholder="e.g. Flat 10 years warranty on all modular units"
                                            className="w-full p-2 border rounded-lg text-xs"
                                          />
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeSectionArrayItem(sec.id, itemIdx)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg self-center"
                                        title="Remove Item"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic">No counter items added. Click + Add Counter Item to create custom stats.</p>
                              )}
                            </div>
                          )}

                          {/* 2. PROCESS STEPS */}
                          {(sec.type === 'process' || sec.type === 'process_workflow') && (
                            <div className="space-y-3 pt-3 border-t border-slate-200">
                              <div className="flex items-center justify-between">
                                <label className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                                  Workflow Steps (Items)
                                </label>
                                <button
                                  type="button"
                                  onClick={() => addSectionArrayItem(sec.id, { title: 'Step Title', desc: 'Step description details' })}
                                  className="px-3 py-1 bg-blue-700 text-white font-bold rounded-lg text-[11px] hover:bg-blue-800 transition-colors"
                                >
                                  + Add Step
                                </button>
                              </div>

                              {Array.isArray(sec.items) && sec.items.length > 0 ? (
                                <div className="space-y-3">
                                  {sec.items.map((step: any, itemIdx: number) => (
                                    <div key={itemIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                                      <div className="flex-1 space-y-2">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Step Heading</label>
                                          <input
                                            type="text"
                                            value={step.title || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, itemIdx, 'title', e.target.value)}
                                            placeholder="e.g. 1. Free Consultation"
                                            className="w-full p-2 border rounded-lg text-xs"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Step Description</label>
                                          <textarea
                                            rows={2}
                                            value={step.desc || step.description || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, itemIdx, 'desc', e.target.value)}
                                            placeholder="Explain what happens in this step..."
                                            className="w-full p-2 border rounded-lg text-xs"
                                          />
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeSectionArrayItem(sec.id, itemIdx)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg self-center"
                                        title="Remove Step"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic">No custom workflow steps added. Click + Add Step to create custom steps.</p>
                              )}
                            </div>
                          )}

                          {/* 3. TESTIMONIALS */}
                          {sec.type === 'testimonials' && (
                            <div className="space-y-3 pt-3 border-t border-slate-200">
                              <div className="flex items-center justify-between">
                                <label className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                                  Testimonials & Client Reviews (Items)
                                </label>
                                <button
                                  type="button"
                                  onClick={() => addSectionArrayItem(sec.id, { name: 'Client Name', role: 'Homeowner', quote: 'Great interior work!' })}
                                  className="px-3 py-1 bg-blue-700 text-white font-bold rounded-lg text-[11px] hover:bg-blue-800 transition-colors"
                                >
                                  + Add Testimonial
                                </button>
                              </div>

                              {Array.isArray(sec.items) && sec.items.length > 0 ? (
                                <div className="space-y-3">
                                  {sec.items.map((item: any, itemIdx: number) => (
                                    <div key={itemIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                                      <div className="flex-1 space-y-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          <div>
                                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Client Name</label>
                                            <input
                                              type="text"
                                              value={item.name || ''}
                                              onChange={(e) => updateSectionItemField(sec.id, itemIdx, 'name', e.target.value)}
                                              placeholder="e.g. Rajesh Verma"
                                              className="w-full p-2 border rounded-lg text-xs"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Role / Location</label>
                                            <input
                                              type="text"
                                              value={item.role || ''}
                                              onChange={(e) => updateSectionItemField(sec.id, itemIdx, 'role', e.target.value)}
                                              placeholder="e.g. 3BHK Homeowner, Delhi"
                                              className="w-full p-2 border rounded-lg text-xs"
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Quote / Review Text</label>
                                          <textarea
                                            rows={2}
                                            value={item.quote || item.review || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, itemIdx, 'quote', e.target.value)}
                                            placeholder="Write client testimonial quote..."
                                            className="w-full p-2 border rounded-lg text-xs"
                                          />
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeSectionArrayItem(sec.id, itemIdx)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg self-center"
                                        title="Remove Testimonial"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic">No testimonials added. Click + Add Testimonial to create custom reviews.</p>
                              )}
                            </div>
                          )}

                          {/* 4. FAQ ACCORDION */}
                          {(sec.type === 'faq' || sec.type === 'faq_accordion') && (
                            <div className="space-y-3 pt-3 border-t border-slate-200">
                              <div className="flex items-center justify-between">
                                <label className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                                  Frequently Asked Questions (Items)
                                </label>
                                <button
                                  type="button"
                                  onClick={() => addSectionArrayItem(sec.id, { question: 'New Question?', answer: 'Answer details here.' })}
                                  className="px-3 py-1 bg-blue-700 text-white font-bold rounded-lg text-[11px] hover:bg-blue-800 transition-colors"
                                >
                                  + Add FAQ Item
                                </button>
                              </div>

                              {Array.isArray(sec.items) && sec.items.length > 0 ? (
                                <div className="space-y-3">
                                  {sec.items.map((faq: any, itemIdx: number) => (
                                    <div key={itemIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                                      <div className="flex-1 space-y-2">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Question</label>
                                          <input
                                            type="text"
                                            value={faq.question || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, itemIdx, 'question', e.target.value)}
                                            placeholder="e.g. What is included in the 10-year warranty?"
                                            className="w-full p-2 border rounded-lg text-xs"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Answer</label>
                                          <textarea
                                            rows={2}
                                            value={faq.answer || ''}
                                            onChange={(e) => updateSectionItemField(sec.id, itemIdx, 'answer', e.target.value)}
                                            placeholder="Write clear answer for homeowners..."
                                            className="w-full p-2 border rounded-lg text-xs"
                                          />
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeSectionArrayItem(sec.id, itemIdx)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg self-center"
                                        title="Remove FAQ"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic">No FAQ items added. Click + Add FAQ Item to create custom FAQs.</p>
                              )}
                            </div>
                          )}

                          {/* 5. RICH TEXT */}
                          {sec.type === 'richtext' && (
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Rich Content / HTML Body</label>
                              <textarea
                                rows={6}
                                value={sec.content || ''}
                                onChange={(e) => updateSectionField(sec.id, 'content', e.target.value)}
                                className="w-full p-2.5 border rounded-xl font-mono text-xs"
                              />
                            </div>
                          )}

                          {/* 6. CUSTOM HTML / EMBED CODE */}
                          {(sec.type === 'custom_html' || sec.type === 'html') && (
                            <div className="space-y-2 pt-3 border-t border-slate-200">
                              <label className="block font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                                Raw Custom HTML / Embed Snippet Code
                              </label>
                              <p className="text-[11px] text-slate-500">
                                Enter custom HTML markup, embedded widgets, YouTube iframes, or custom banner code.
                              </p>
                              <textarea
                                rows={8}
                                value={(sec as any).html_code || sec.content || ''}
                                onChange={(e) => updateSectionField(sec.id, 'html_code' as any, e.target.value)}
                                placeholder="<div class='custom-banner'>...</div>"
                                className="w-full p-3 border rounded-xl font-mono text-xs bg-slate-900 text-emerald-400 focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PAGE SEO SETTINGS */}
      {activeTab === 'seo' && (
        <SeoFormBlock data={seoData} onChange={setSeoData} />
      )}

      {/* MEDIA PICKER MODAL */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleSelectMedia}
        allowMultiple={false}
      />
    </div>
  );
}
