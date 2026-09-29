'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiClient, getImageUrl } from '@/lib/api';
import { Category, City, DesignPost } from '@/types';
import { Plus, Trash2, Star, Upload, ArrowLeft, Loader2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import SeoFormBlock, { SeoData } from '@/components/admin/SeoFormBlock';
import MediaPickerModal from '@/components/admin/MediaPickerModal';
import RichTextEditor from '@/components/admin/RichTextEditor';


interface DesignFormProps {
  initialData?: DesignPost | null;
}

export default function DesignForm({ initialData = null }: DesignFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [allPosts, setAllPosts] = useState<DesignPost[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [categoryId, setCategoryId] = useState<number | string>(initialData?.category_id || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');

  // Section 2 Details
  const [style, setStyle] = useState(initialData?.style || 'Modern');
  const [roomType, setRoomType] = useState(initialData?.room_type || 'Kitchen');
  const [layout, setLayout] = useState(initialData?.layout || 'L-Shaped');
  const [dimensions, setDimensions] = useState(initialData?.dimensions || '12 x 10 Feet');
  const [colour, setColour] = useState(initialData?.colour || 'White + Wood');
  const [material, setMaterial] = useState(initialData?.material || 'Engineered Wood');
  const [finish, setFinish] = useState(initialData?.finish || 'Acrylic');
  const [budgetMin, setBudgetMin] = useState<number | string>(initialData?.budget_min || 400000);
  const [budgetMax, setBudgetMax] = useState<number | string>(initialData?.budget_max || 600000);
  const [propertyType, setPropertyType] = useState(initialData?.property_type || '3 BHK');
  const [area, setArea] = useState(initialData?.area || '120 Sq Ft');
  const [cityId, setCityId] = useState<number | string>(initialData?.city_id || '');
  const [location, setLocation] = useState(initialData?.location || '');

  // Section 3 Specs repeater
  const [specifications, setSpecifications] = useState<Array<{ label: string; value: string }>>(
    initialData?.specifications?.map(s => ({ label: s.label, value: s.value })) || [
      { label: 'Style', value: 'Modern' },
      { label: 'Hardware', value: 'Blum Soft-Close' },
      { label: 'Warranty', value: '10 Years Warranty' },
    ]
  );

  // Section 4 Features repeater
  const [features, setFeatures] = useState<string[]>(
    initialData?.features?.map(f => f.feature) || [
      'German soft-close tandem drawers',
      'Tall pantry pull-out unit',
      'Concealed under-cabinet LED task illumination',
    ]
  );

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
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order || 1);

  useEffect(() => {
    apiClient.get('/admin/categories').then((res) => setCategories(res.data.data || []));
    apiClient.get('/admin/cities').then((res) => setCities(res.data.data || []));
    apiClient.get('/admin/design-posts').then((res) => setAllPosts(res.data.data?.data || res.data.data || []));

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

  const addSpecification = () => {
    setSpecifications([...specifications, { label: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, idx) => idx !== index));
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index));
  };

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
      style,
      room_type: roomType,
      layout,
      dimensions,
      colour,
      material,
      finish,
      budget_min: budgetMin,
      budget_max: budgetMax,
      property_type: propertyType,
      area,
      city_id: cityId || null,
      location,
      featured_image: images.find(i => i.is_primary)?.image || images[0]?.image || '',
      status,
      is_featured: isFeatured,
      sort_order: sortOrder,
      specifications: specifications.filter(s => s.label && s.value),
      features: features.filter(f => f.trim() !== ''),
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

      {/* SECTION 1: BASIC INFORMATION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">Section 1: Basic Information</h2>

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
          <label className="block font-bold text-slate-700 mb-1">Detailed Description & Content</label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Write full blog content, detailed description, space planning, lighting specs..."
          />
        </div>
      </div>


      {/* SECTION 2: DESIGN DETAILS & TAXONOMY */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">Section 2: Design Details & Attributes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Style</label>
            <input type="text" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Layout</label>
            <input type="text" value={layout} onChange={(e) => setLayout(e.target.value)} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Dimensions</label>
            <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="w-full p-2.5 border rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Colour Palette</label>
            <input type="text" value={colour} onChange={(e) => setColour(e.target.value)} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Material</label>
            <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Finish</label>
            <input type="text" value={finish} onChange={(e) => setFinish(e.target.value)} className="w-full p-2.5 border rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Budget Min (₹)</label>
            <input type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Budget Max (₹)</label>
            <input type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} className="w-full p-2.5 border rounded-xl" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned City</label>
            <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="w-full p-2.5 border rounded-xl">
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 3: SPECIFICATIONS REPEATER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Section 3: Design Specifications</h2>
          <button type="button" onClick={addSpecification} className="px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100">
            + Add Specification
          </button>
        </div>

        <div className="space-y-3">
          {specifications.map((spec, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Label (e.g. Countertop)"
                value={spec.label}
                onChange={(e) => {
                  const updated = [...specifications];
                  updated[idx].label = e.target.value;
                  setSpecifications(updated);
                }}
                className="w-1/2 p-2.5 border rounded-xl"
              />
              <input
                type="text"
                placeholder="Value (e.g. Engineered Quartz)"
                value={spec.value}
                onChange={(e) => {
                  const updated = [...specifications];
                  updated[idx].value = e.target.value;
                  setSpecifications(updated);
                }}
                className="w-1/2 p-2.5 border rounded-xl"
              />
              <button type="button" onClick={() => removeSpecification(idx)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: SPECIAL FEATURES REPEATER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Section 4: Special Features</h2>
          <button type="button" onClick={addFeature} className="px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100">
            + Add Feature
          </button>
        </div>

        <div className="space-y-3">
          {features.map((ft, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Feature description (e.g. Soft-close German Blum hinges)"
                value={ft}
                onChange={(e) => {
                  const updated = [...features];
                  updated[idx] = e.target.value;
                  setFeatures(updated);
                }}
                className="w-full p-2.5 border rounded-xl"
              />
              <button type="button" onClick={() => removeFeature(idx)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: IMAGE GALLERY MANAGER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Section 5: Multi-Image Gallery</h2>
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
