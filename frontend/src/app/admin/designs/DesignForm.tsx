'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiClient, getImageUrl, getSiteBaseUrl } from '@/lib/api';
import { Category, City, DesignPost } from '@/types';
import { Trash2, Star, ArrowLeft, Loader2, Image as ImageIcon, Calendar, Clock, Copy, ExternalLink } from 'lucide-react';
import SeoFormBlock, { SeoData } from '@/components/admin/SeoFormBlock';
import MediaPickerModal from '@/components/admin/MediaPickerModal';
import RichTextEditor from '@/components/admin/RichTextEditor';
import SearchableMultiSelect from '@/components/admin/SearchableMultiSelect';

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
  const [blogCategories, setBlogCategories] = useState<any[]>([]);
  const [selectedBlogCategoryId, setSelectedBlogCategoryId] = useState<number | ''>(
    initialData?.category_id ? Number(initialData.category_id) : ''
  );
  const [cities, setCities] = useState<City[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state - multi-select for categories and locations (cities)
  const [categoryIds, setCategoryIds] = useState<number[]>(() => {
    if (initialData?.category_ids && Array.isArray(initialData.category_ids) && initialData.category_ids.length > 0) {
      return initialData.category_ids.map(Number);
    }
    if (initialData?.category_id) {
      return [Number(initialData.category_id)];
    }
    return [];
  });

  const [cityIds, setCityIds] = useState<number[]>(() => {
    if (initialData?.city_ids && Array.isArray(initialData.city_ids) && initialData.city_ids.length > 0) {
      return initialData.city_ids.map(Number);
    }
    if (initialData?.city_id) {
      return [Number(initialData.city_id)];
    }
    return [];
  });

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugTouched, setIsSlugTouched] = useState(!!initialData?.slug);
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || initialData?.excerpt || '');
  const [description, setDescription] = useState(initialData?.description || initialData?.content || '');

  // Section 5 Single Featured Image
  const [featuredImage, setFeaturedImage] = useState<string>(
    initialData?.featured_image || (initialData?.images && initialData.images.length > 0 ? initialData.images[0].image : '') || ''
  );

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const initialSeoPath = initialData?.slug ? `/blogs/${initialData.slug}` : '';
  const initialFullUrl = initialSeoPath ? `${getSiteBaseUrl()}${initialSeoPath}` : '';

  // Section 7 SEO - Strapi 15-field meta block
  const [seoData, setSeoData] = useState<SeoData>({
    path: initialSeoPath,
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    focus_keyphrase: '',
    canonical_url: initialFullUrl,
    robots_index: true,
    robots_follow: true,
    og_title: initialData?.meta_title || initialData?.title || '',
    og_description: initialData?.meta_description || initialData?.short_description || '',
    og_url: initialFullUrl,
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

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const autoSlug = generateSlug(newTitle);

    if (!isSlugTouched) {
      setSlug(autoSlug);
    }

    const currentSlug = !isSlugTouched ? autoSlug : slug;
    const path = currentSlug ? `/blogs/${currentSlug}` : '';
    const fullUrl = path ? `${getSiteBaseUrl()}${path}` : '';

    setSeoData(prev => ({
      ...prev,
      meta_title: newTitle,
      og_title: newTitle,
      path: path || prev.path,
      canonical_url: fullUrl || prev.canonical_url,
      og_url: fullUrl || prev.og_url,
      meta_description: prev.meta_description || shortDescription,
      og_description: prev.og_description || shortDescription,
    }));
  };

  const handleSlugChange = (newSlug: string) => {
    setSlug(newSlug);
    setIsSlugTouched(true);
    const path = newSlug ? `/blogs/${newSlug}` : '';
    const fullUrl = path ? `${getSiteBaseUrl()}${path}` : '';
    setSeoData(prev => ({
      ...prev,
      path: path || prev.path,
      canonical_url: fullUrl || prev.canonical_url,
      og_url: fullUrl || prev.og_url,
    }));
  };

  const handleShortDescriptionChange = (newDesc: string) => {
    setShortDescription(newDesc);
    setSeoData(prev => ({
      ...prev,
      meta_description: newDesc,
      og_description: newDesc,
    }));
  };

  useEffect(() => {
    apiClient.get('/admin/categories').then((res) => setCategories(res.data.data || []));
    apiClient.get('/admin/blog-categories').then((res) => setBlogCategories(res.data.data || []));

    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.slug) setSlug(initialData.slug);
      setShortDescription(initialData.short_description || initialData.excerpt || '');
      setDescription(initialData.description || initialData.content || '');
      if (initialData.featured_image) setFeaturedImage(initialData.featured_image);
      if (initialData.status) setStatus(initialData.status);
      if (initialData.published_at) setPublishedAt(formatDateForInput(initialData.published_at));
      if (initialData.category_id) setSelectedBlogCategoryId(Number(initialData.category_id));

      if (initialData.slug) {
        const fetchPath = `/blogs/${initialData.slug}`;
        apiClient.get(`/admin/seo/by-path?path=${fetchPath}`).then((res) => {
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
    }
  }, [initialData]);

  const handleSelectFromMediaLibrary = (urls: string[]) => {
    if (urls.length > 0) {
      const imgUrl = getImageUrl(urls[0]);
      setFeaturedImage(imgUrl);
      setSeoData(prev => ({
        ...prev,
        og_image: prev.og_image || imgUrl,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const activeCatId = categoryIds.length > 0 ? categoryIds[0] : (categories[0]?.id || initialData?.category_id || 1);
    const activeCatIds = categoryIds.length > 0 ? categoryIds : [activeCatId];
    const blogPath = slug ? `/blogs/${slug}` : seoData.path;
    const fullUrl = `${getSiteBaseUrl()}${blogPath}`;

    const payload = {
      category_id: activeCatId,
      category_ids: activeCatIds,
      city_id: cityIds.length > 0 ? cityIds[0] : null,
      city_ids: cityIds,
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
      location: initialData?.location || null,
      featured_image: featuredImage,
      status,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      is_featured: isFeatured,
      sort_order: sortOrder,
      specifications: initialData?.specifications || [],
      features: initialData?.features || [],
      images: featuredImage ? [featuredImage] : [],
      meta_title: seoData.meta_title || title,
      meta_description: seoData.meta_description || shortDescription,
      seo_data: {
        ...seoData,
        path: blogPath,
        canonical_url: seoData.canonical_url || fullUrl,
        og_url: seoData.og_url || fullUrl,
        meta_title: seoData.meta_title || title,
        meta_description: seoData.meta_description || shortDescription,
      },
    };

    const blogPayload = {
      title,
      slug,
      excerpt: shortDescription,
      short_description: shortDescription,
      content: description,
      description,
      featured_image: featuredImage,
      category_id: selectedBlogCategoryId || null,
      status,
      is_featured: isFeatured,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
    };

    try {
      if (initialData?.id) {
        await Promise.all([
          apiClient.put(`/admin/blogs/${initialData.id}`, blogPayload).catch(() => null),
          apiClient.put(`/admin/design-posts/${initialData.id}`, payload).catch(() => null),
        ]);
      } else {
        await Promise.all([
          apiClient.post('/admin/blogs', blogPayload).catch(() => null),
          apiClient.post('/admin/design-posts', payload).catch(() => null),
        ]);
      }
      router.push('/admin/blogs');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save blog post.');
    } finally {
      setSaving(false);
    }
  };

  const handleCloneBlog = async () => {
    if (!initialData?.id) return;
    try {
      const res = await apiClient.post(`/admin/blogs/${initialData.id}/clone`);
      if (res.data?.success && res.data.data?.id) {
        alert('Blog post cloned as draft successfully!');
        router.push(`/admin/blogs/${res.data.data.id}/edit`);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to clone blog post');
    }
  };

  const handleDeleteBlog = async () => {
    if (!initialData?.id) return;
    if (!confirm('Are you sure you want to delete this blog post permanently?')) return;
    try {
      await apiClient.delete(`/admin/blogs/${initialData.id}`);
      router.push('/admin/blogs');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete blog post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto pb-20 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push('/admin/blogs')} className="p-2 text-slate-500 hover:text-slate-900 rounded-lg border bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-extrabold text-slate-900">
            {initialData?.id ? `Edit Blog: ${initialData.title}` : 'Add New Blog Post'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {initialData?.id && (
            <>
              <a
                href={`/blogs/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                title="Open Live Blog in New Window"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden md:inline">Open in New Window</span>
              </a>

              <button
                type="button"
                onClick={handleCloneBlog}
                className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Clone Blog Post (as Draft)"
              >
                <Copy className="w-4 h-4" />
                <span>Clone Blog</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteBlog}
                className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Delete Blog Post"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden md:inline">Delete</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setStatus('draft')}
            className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold rounded-xl uppercase tracking-wider cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Blog'}
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl">{error}</div>}

      {/* WORDPRESS 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT CANVAS (lg:col-span-8): CONTENT & GALLERY & SEO BLOCK */}
        <div className="lg:col-span-8 space-y-6">
          {/* BLOG CONTENT */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">Blog Content</h2>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Short Description</label>
              <textarea
                rows={2}
                placeholder="Brief 1-2 sentence overview for cards and listings..."
                value={shortDescription}
                onChange={(e) => handleShortDescriptionChange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">Detailed Content & Body</label>
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

          {/* SEO & SOCIAL META MANAGEMENT BLOCK */}
          <SeoFormBlock data={seoData} onChange={setSeoData} />
        </div>

        {/* RIGHT SIDEBAR (lg:col-span-4): BLOG ATTRIBUTES CARD & FEATURED IMAGE CARD */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">
              Blog Post Attributes
            </h2>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Blog Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Modern L-Shaped Modular Kitchen Ideas & Guide"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">URL Path / Slug *</label>
              <input
                type="text"
                required
                placeholder="e.g. modern-l-shaped-modular-kitchen"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Full URL: <code className="text-slate-600 font-mono">/blogs/{slug || '...'}</code>
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Blog Category</label>
              <select
                value={selectedBlogCategoryId}
                onChange={(e) => setSelectedBlogCategoryId(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Choose Blog Category --</option>
                {blogCategories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="published">🟢 Published / Scheduled</option>
                <option value="draft">⚪ Draft (Hidden)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">Publish Date & Time</label>
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
              <label className="block font-bold text-slate-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
              />
            </div>

            {publishedAt && new Date(publishedAt) > new Date() && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Scheduled:</strong> Live on{' '}
                  <strong>{new Date(publishedAt).toLocaleString()}</strong>.
                </span>
              </div>
            )}
          </div>

          {/* FEATURED IMAGE BOX (SINGLE IMAGE) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">
              Featured Image
            </h2>

            {featuredImage ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 group">
                  <Image src={getImageUrl(featuredImage)} alt="Featured image" fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg shadow-md transition-all"
                    title="Remove Featured Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-200"
                >
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <span>Replace Featured Image</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-slate-500 font-medium text-[11px]">No featured image set</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Set Featured Image</span>
                </button>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Image URL (External / CDN)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-grow p-2 border border-slate-200 rounded-xl bg-slate-50 text-[11px] focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (imageUrlInput.trim()) {
                      setFeaturedImage(imageUrlInput.trim());
                      setImageUrlInput('');
                    }
                  }}
                  className="px-3 py-2 bg-slate-900 text-white font-bold rounded-xl text-[11px] uppercase shrink-0"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleSelectFromMediaLibrary}
        allowMultiple={false}
      />
    </form>
  );
}
