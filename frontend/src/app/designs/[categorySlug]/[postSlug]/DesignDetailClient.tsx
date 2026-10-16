'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DesignPost, Category, City } from '@/types';
import DesignCard from '@/components/public/DesignCard';
import ConsultationForm from '@/components/public/ConsultationForm';
import ConsultationFormModal from '@/components/public/ConsultationFormModal';
import {
  ChevronRight,
  Home,
  Heart,
  ChevronLeft,
  MessageCircle,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

interface ClientProps {
  post: DesignPost;
  category: Category;
  related: DesignPost[];
  cities: City[];
}

export default function DesignDetailClient({ post, category, related, cities }: ClientProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const images = post.images && post.images.length > 0
    ? post.images
    : [{ id: 1, image: post.featured_image || '/placeholder.jpg', sort_order: 1, is_primary: true, is_mobile: true, design_post_id: post.id }];

  const currentImg = images[activeImgIdx]?.image || post.featured_image || '/placeholder.jpg';

  const canonicalShareUrl = `https://archovex.com/designs/${category.slug}/${post.slug}`;

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      const urlToCopy = window.location.href || canonicalShareUrl;
      navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const rawContent = post.content || post.description || '';
  const isHtml = /<[a-z][\s\S]*>/i.test(rawContent);

  return (
    <>
      {/* 1. Breadcrumb Navigation */}
      <div className="bg-[#FAFAFA] border-b border-slate-200 py-3.5 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-slate-900 flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-slate-400" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/blogs" className="hover:text-slate-900">Blogs</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href={`/blogs/${category.slug}`} className="hover:text-slate-900">{category.name}</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="font-bold text-slate-900 line-clamp-1">{post.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 sm:pb-12 space-y-10">

        {/* 2. Top Title & Editorial Header Block */}
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 font-sans">
            <span className="bg-amber-50 text-[#EA580C] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md border border-amber-200">
              {category.name}
            </span>
            {post.style && (
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md border border-slate-200">
                {post.style}
              </span>
            )}
            {post.city && (
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md border border-emerald-200">
                {post.city.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.short_description && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl font-normal font-sans">
              {post.short_description}
            </p>
          )}
        </div>

        {/* 3. First Full Featured Image Display */}
        <div className="space-y-4 font-sans">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200">
            <Image
              src={currentImg}
              alt={post.title}
              fill
              priority
              className="object-cover transition-all duration-300"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all shadow-md backdrop-blur-sm"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImgIdx((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all shadow-md backdrop-blur-sm"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-lg">
              {activeImgIdx + 1} / {images.length} Photos
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImgIdx === idx ? 'border-[#EA580C] scale-105 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.image} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. 2-Column Blog Layout (Left Content + Right Sticky Lead Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-sans">

          {/* LEFT COLUMN (8 Cols): Blog Article Content & Specs */}
          <div className="lg:col-span-8 space-y-8">
            {/* Rich Content Article */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#EA580C]" />
                <span>Detailed Description & Content</span>
              </h2>

              {rawContent ? (
                <div
                  className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-[#EA580C] hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-md prose-table:border-collapse prose-td:border prose-td:border-slate-200 prose-td:p-2.5 prose-th:bg-slate-50 prose-th:p-2.5"
                  dangerouslySetInnerHTML={{ __html: isHtml ? rawContent : rawContent.replace(/\n/g, '<br />') }}
                />
              ) : (
                <p className="text-xs text-slate-500 italic">No detailed description published for this design post.</p>
              )}
            </div>

            {/* Share Action Bar */}
            <div className="bg-[#FAFAFA] border border-slate-200/90 p-4 rounded-2xl flex flex-wrap items-center justify-end gap-4">

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Share Design:</span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this interior design on ARCHOVEX: ${canonicalShareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-2 bg-slate-200/80 text-slate-800 hover:bg-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (4 Cols): Sticky Consultation Form Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Lead Form Box */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-lg space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md inline-block mb-1">
                  DIRECT DESIGN INQUIRY
                </span>
                <h3 className="text-lg font-serif font-bold text-slate-900">Let's Design Your Space</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Talk to our senior interior experts & get personalized 3D plan options.
                </p>
              </div>

              <ConsultationForm cities={cities} compact={true} />
            </div>

          </div>
        </div>

        {/* 5. RELATED DESIGNS SECTION */}
        {related.length > 0 && (
          <section className="pt-12 border-t border-slate-200/90 space-y-8 font-sans">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 uppercase tracking-tight">Related Design Concepts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <DesignCard key={rel.id} post={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* MODALS */}
      <ConsultationFormModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        cities={cities}
      />
    </>
  );
}
