'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DesignPost } from '@/types';
import { X, Heart, Share2, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface QuickViewProps {
  post: DesignPost | null;
  onClose: () => void;
  onOpenConsultation?: () => void;
}

export default function DesignQuickViewModal({ post, onClose, onOpenConsultation }: QuickViewProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (post) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [post, onClose]);

  if (!post) return null;

  const images = post.images && post.images.length > 0
    ? post.images
    : [{ id: 1, image: post.featured_image || '/placeholder.jpg', sort_order: 1, is_primary: true, is_mobile: true, design_post_id: post.id }];

  const currentImg = images[activeImgIdx]?.image || post.featured_image || '/placeholder.jpg';
  const categorySlug = post.category?.slug || 'modular-kitchen-designs';
  const detailUrl = `/designs/${categorySlug}/${post.slug}`;

  const nextImg = () => setActiveImgIdx((prev) => (prev + 1) % images.length);
  const prevImg = () => setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-all backdrop-blur-md shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Image Gallery Carousel */}
        <div className="w-full md:w-3/5 bg-slate-950 relative flex flex-col justify-between p-4 min-h-[320px] md:min-h-[500px]">
          <div className="relative flex-grow w-full rounded-2xl overflow-hidden">
            <Image
              src={currentImg}
              alt={post.title}
              fill
              className="object-cover transition-all duration-300"
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails bar */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pt-3 pb-1 snap-x">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImgIdx === idx ? 'border-blue-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img.image} alt="thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Design Details & Specifications */}
        <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {post.category && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {post.category.name}
                </span>
              )}
              {post.style && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                  {post.style}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{post.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {post.short_description || 'Custom luxury interior design engineered with high-density materials and 10-year warranty.'}
            </p>

            {/* Specifications Grid */}
            {post.specifications && post.specifications.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b pb-1">
                  Design Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {post.specifications.map((spec) => (
                    <div key={spec.id} className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-600 block">{spec.label}</span>
                      <span className="font-semibold text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {post.features && post.features.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b pb-1">
                  Special Features
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {post.features.slice(0, 4).map((ft) => (
                    <li key={ft.id} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>{ft.feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenConsultation) onOpenConsultation();
                }}
                className="flex-grow py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
              >
                BOOK FREE CONSULTATION
              </button>
            </div>

            <Link
              href={detailUrl}
              onClick={onClose}
              className="w-full py-2.5 border border-slate-200 hover:border-slate-900 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              VIEW FULL DESIGN DETAILS <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
