'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiClient, getImageUrl } from '@/lib/api';
import { Category, DesignPost } from '@/types';
import { Trash2, Star, ArrowLeft, Loader2, Image as ImageIcon, Calendar, Clock } from 'lucide-react';
import SeoFormBlock, { SeoData } from '@/components/admin/SeoFormBlock';
import MediaPickerModal from '@/components/admin/MediaPickerModal';
import RichTextEditor from '@/components/admin/RichTextEditor';

const formatDateForInput = (dateStr?: string | null) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

interface DesignFormProps {
  initialData?: DesignPost | null;
}

export default function DesignForm({ initialData = null }: DesignFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [categoryId, setCategoryId] = useState<number | string>(initialData?.category_id || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');

  // Section 5 Images
  const [images, setImages] = useState<Array<{ id?: number; image: string; is_primary?: boolean }>>(
    initialData?.images?.map(i => ({ id: i.id, image: i.image, is_primary: i.is_primary })) || [
      { image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', is_primary: true },
    ]
  );

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleSelectFromMediaLibrary = (urls: string[]) => {
    if (urls.length === 0) return;
    const newImages = urls.map((url, idx) => ({
      image: getImageUrl(url),
      is_primary: images.length === 0 && idx === 0,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingMedia(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await apiClient.post('/admin/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success && res.data.data?.url) {
        const fullUrl = getImageUrl(res.data.data.url);
        const isFirst = images.length === 0;
        setImages((prev) => [...prev, { image: fullUrl, is_primary: isFirst }]);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to upload image file');
    } finally {
      setUploadingMedia(false);
    }
  };

  // Section 7 SEO - Strapi 15-field meta block
  const [seoData, setSeoData] = useState<SeoData>({
    path: initialData?.slug ? `/designs/${initialData.slug}` : '',
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    focus_keyphrase: '',
    canonical_url: initialData?.slug ? `https://archovex.com/designs/${initialData.slug}` : '',
    robots_index: true,
    robots_follow: true,
    og_title: initialData?.meta_title || initialData?.title || '',
    og_description: initialData?.meta_description || initialData?.short_description || '',
    og_url: initialData?.slug ? `https://archovex.com/designs/${initialData.slug}` : '',
    og_type: 'article',
    og_site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
    og_image: initialData?.featured_image || '',
    twitter_card: 'summary_large_image',
    twitter_site: '@archovex',
    schema_code: '',
  });

  // Section 8 Publish
  const [status, setStatus] = useState(initialData?.status || 'published');
  const [publishedAt, setPublishedAt] = useState<string>(formatDateForInput(initialData?.published_at));
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order || 1);

  useEffect(() => {
    apiClient.get('/admin/categories').then((res) => setCategories(res.data.data || []));

    if (initialData?.slug) {
      apiClient.get(`/admin/seo/by-path?path=/designs/${initialData.slug}`).then((res) => {
        if (res.data?.data) {
          setSeoData((prev) => ({
            ...prev,
            ...res.data.data,
            robots_index: res.data.data.robots_index ?? true,
            robots_follow: res.data.data.robots_follow ?? true,
          }));
        }
      }).catch(() => {});
    }
  }, [initialData]);

  const addImageUrl = () => {
    if (!imageUrlInput) return;
    const isFirst = images.length === 0;
    setImages([...images, { image: imageUrlInput, is_primary: isFirst }]);
    setImageUrlInput('');
  };

  const setPrimaryImage = (index: number) => {
    setImages(images.map((img, idx) => ({ ...img, is_primary: idx === index })));
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!categoryId) {
      setError('Please select a category.');
      setSaving(false);
      return;
    }

    const payload = {
      category_id: categoryId,
      title,
      slug,
      short_description: shortDescription,
      description,
      style: initialData?.style || null,
      room_type: initialData?.room_type || null,
      layout: initialData?.layout || null,
      dimensions: initialData?.dimensions || null,
      colour: initialData?.colour || null,
      material: initialData?.material || null,
      finish: initialData?.finish || null,
      budget_min: initialData?.budget_min || null,
      budget_max: initialData?.budget_max || null,
      property_type: initialData?.property_type || null,
      area: initialData?.area || null,
      city_id: initialData?.city_id || null,
      location: initialData?.location || null,
      featured_image: images.find(i => i.is_primary)?.image || images[0]?.image || '',
      status,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      is_featured: isFeatured,
      sort_order: sortOrder,
      specifications: initialData?.specifications || [],
      features: initialData?.features || [],
      images: images.map(i => i.image),
      meta_title: seoData.meta_title || title,
      meta_description: seoData.meta_description || shortDescription,
      seo_data: {
        ...seoData,
        path: slug ? `/designs/${slug}` : seoData.path,
        meta_title: seoData.meta_title || title,
        meta_description: seoData.meta_description || shortDescription,
      },
    };

    try {
      if (initialData?.id) {
        await apiClient.put(`/admin/design-posts/${initialData.id}`, payload);
      } else {
        await apiClient.post('/admin/design-posts', payload);
      }
      router.push('/admin/designs');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save design post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20 text-xs">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push('/admin/designs')} className="p-2 text-slate-500 hover:text-slate-900 rounded-lg border">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-extrabold text-slate-900">
            {initialData?.id ? `Edit Blog: ${initialData.title}` : 'Add New Blog Post'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStatus('draft')}
            className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold rounded-xl uppercase tracking-wider"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Blog'}
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl">{error}</div>}

      {/* BASIC INFORMATION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">Basic Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Category *</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium"
            >
              <option value="">Select Category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Blog Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Modern L-Shaped Modular Kitchen Ideas & Guide"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Slug (URL)</label>
          <input
            type="text"
            placeholder="e.g. modern-l-shaped-modular-kitchen"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-[11px]"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Short Description</label>
          <textarea
            rows={2}
            placeholder="Brief 1-2 sentence overview for cards and listings..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border rounded-xl"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-bold text-slate-700">Detailed Description & Content</label>
            <span className="text-[11px] font-semibold text-slate-500">
              Supports Visual Editor & Raw HTML Source Mode
            </span>
          </div>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Write full blog content, detailed description, space planning, specs or paste HTML source code..."
          />
        </div>
      </div>




      {/* MULTI-IMAGE GALLERY MANAGER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Multi-Image Gallery</h2>
            <p className="text-[11px] text-slate-500">Choose assets from Central Media Library or paste external image URLs.</p>
          </div>

          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Select from Media Library</span>
          </button>
        </div>

        <div className="flex gap-3 pt-1">
          <input
            type="text"
            placeholder="Paste Image URL (Unsplash / Pexels / CDN URL)..."
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            className="flex-grow p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:bg-white focus:outline-none"
          />
          <button type="button" onClick={addImageUrl} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider">
            + Add URL
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          {images.map((img, idx) => (
            <div key={idx} className={`relative aspect-video rounded-xl overflow-hidden border-2 ${img.is_primary ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'}`}>
              <Image src={getImageUrl(img.image)} alt="Gallery item" fill className="object-cover" unoptimized />
              {img.is_primary && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow">
                  ★ Primary Image
                </span>
              )}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => setPrimaryImage(idx)}
                  className="p-1.5 bg-slate-900/80 text-white rounded hover:bg-slate-900"
                  title="Set Primary"
                >
                  <Star className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="p-1.5 bg-rose-600/80 text-white rounded hover:bg-rose-600"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: PUBLISHING & FEATURED SETTINGS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Publishing & Featured Settings
          </h2>
          {status === 'draft' ? (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full border bg-slate-100 text-slate-600 border-slate-200 flex items-center gap-1.5">
              ⚪ Draft Mode (Hidden)
            </span>
          ) : publishedAt && new Date(publishedAt) > new Date() ? (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Scheduled for {new Date(publishedAt).toLocaleString()}
            </span>
          ) : (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {publishedAt ? `Published on ${new Date(publishedAt).toLocaleDateString()}` : 'Published Live'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block font-bold text-xs text-slate-700 mb-1">Publish Status</label>
            <select
              value={status === 'published' && isFeatured ? 'featured' : status}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'featured') {
                  setStatus('published');
                  setIsFeatured(true);
                } else if (val === 'published') {
                  setStatus('published');
                } else {
                  setStatus(val);
                }
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="published">🟢 Published / Scheduled</option>
              <option value="featured">⭐ Published & Featured Blog</option>
              <option value="draft">⚪ Draft (Hidden)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-xs text-slate-700">Publish Date & Time</label>
              <button
                type="button"
                onClick={() => {
                  setPublishedAt(formatDateForInput(new Date().toISOString()));
                  if (status === 'draft') setStatus('published');
                }}
                className="text-[10px] text-blue-600 hover:underline font-bold"
              >
                Set to Now
              </button>
            </div>
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => {
                setPublishedAt(e.target.value);
                if (status === 'draft' && e.target.value) {
                  setStatus('published');
                }
              }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-xs text-slate-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
            />
          </div>

          <div>
            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <span className="font-extrabold text-xs text-slate-900 block">★ Featured Blog</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Highlight on homepage</span>
              </div>
            </label>
          </div>
        </div>

        {publishedAt && new Date(publishedAt) > new Date() && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Scheduled Publishing Active:</strong> This post will remain scheduled and will go live automatically on{' '}
              <strong>{new Date(publishedAt).toLocaleString()}</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleSelectFromMediaLibrary}
        allowMultiple={true}
      />

      {/* SECTION 7: SEO */}
      <SeoFormBlock data={seoData} onChange={setSeoData} />
    </form>
  );
}

