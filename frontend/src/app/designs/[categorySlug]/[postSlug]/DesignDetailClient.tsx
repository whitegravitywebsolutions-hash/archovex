'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DesignPost, Category, City } from '@/types';
import DesignCard from '@/components/public/DesignCard';
import DesignQuickViewModal from '@/components/public/DesignQuickViewModal';
import ConsultationFormModal from '@/components/public/ConsultationFormModal';
import {
  ChevronRight,
  Home,
  Heart,
  Share2,
  CheckCircle2,
  ChevronLeft,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

interface ClientProps {
  post: DesignPost;
  category: Category;
  related: DesignPost[];
  cities: City[];
}

export default function DesignDetailClient({ post, category, related, cities }: ClientProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [quickViewPost, setQuickViewPost] = useState<DesignPost | null>(null);

  const images = post.images && post.images.length > 0
    ? post.images
    : [{ id: 1, image: post.featured_image || '/placeholder.jpg', sort_order: 1, is_primary: true, is_mobile: true, design_post_id: post.id }];

  const currentImg = images[activeImgIdx]?.image || post.featured_image || '/placeholder.jpg';

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50 border-b border-slate-200 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-slate-900 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/designs" className="hover:text-slate-900">Designs</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href={`/designs/${category.slug}`} className="hover:text-slate-900">{category.name}</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="font-bold text-slate-900 line-clamp-1">{post.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT 7 COLS: Image Gallery Viewer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-950 shadow-xl">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImgIdx((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                {activeImgIdx + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`relative w-24 h-18 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImgIdx === idx ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.image} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: Details, Specifications, CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                  {category.name}
                </span>
                {post.style && (
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                    {post.style}
                  </span>
                )}
                {post.city && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                    {post.city.name}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {post.title}
              </h1>

              {post.short_description && (
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {post.short_description}
                </p>
              )}
            </div>

            {/* Estimated Budget Box */}
            <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Estimated Budget Scope</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {post.budget_max
                    ? `₹${(post.budget_min ? post.budget_min / 100000 : 3).toFixed(1)}L – ₹${(post.budget_max / 100000).toFixed(1)} Lakhs`
                    : 'Custom Quotation'}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                10-Year Warranty
              </span>
            </div>

            {/* Specifications */}
            {post.specifications && post.specifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
                  Design Specifications
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {post.specifications.map((sp) => (
                    <div key={sp.id} className="bg-white border border-slate-100 p-2.5 rounded-xl shadow-2xs">
                      <span className="text-[10px] text-slate-600 block">{sp.label}</span>
                      <span className="font-bold text-slate-900">{sp.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {post.features && post.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
                  Special Features
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {post.features.map((ft) => (
                    <li key={ft.id} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{ft.feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="pt-4 border-t space-y-3">
              <button
                onClick={() => setIsConsultationOpen(true)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl transition-all"
              >
                BOOK FREE CONSULTATION FOR THIS DESIGN
              </button>

              {/* Social Share & Wishlist Bar */}
              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold border transition-colors ${
                    isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out this design on ARCHOVEX: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    title="Copy Link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description Content */}
        {post.description && (
          <div className="bg-slate-50 border border-slate-200/80 p-8 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">About This Interior Concept</h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
              {post.description}
            </div>
          </div>
        )}

        {/* RELATED DESIGNS SECTION */}
        {related.length > 0 && (
          <section className="pt-12 border-t border-slate-200 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Related Design Concepts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <DesignCard key={rel.id} post={rel} onQuickView={setQuickViewPost} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* MODALS */}
      <DesignQuickViewModal
        post={quickViewPost}
        onClose={() => setQuickViewPost(null)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      <ConsultationFormModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        cities={cities}
      />
    </>
  );
}
