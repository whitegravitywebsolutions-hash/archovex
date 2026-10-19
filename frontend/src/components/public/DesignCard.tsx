'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DesignPost } from '@/types';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { getImageUrl } from '@/lib/api';

interface DesignCardProps {
  post: DesignPost;
}

export default function DesignCard({ post }: DesignCardProps) {

  const rawImg =
    post.primary_image?.image ||
    post.primary_image?.file_path ||
    post.featured_image ||
    post.image ||
    (post as any).cover_image ||
    (post.images && post.images.length > 0 ? (post.images[0].image || post.images[0].file_path) : null);

  const primaryImgUrl = rawImg
    ? getImageUrl(rawImg)
    : 'http://127.0.0.1:8005/storage/media/website/turnkey_interior_design_in_del_1d0bb6fa.jpg';

  const categorySlug = post.category?.slug;
  const detailUrl = categorySlug ? `/blogs/${categorySlug}/${post.slug}` : `/blogs/${post.slug}`;

  // Date Formatting (Safely fallback to valid date string)
  const rawDate = (post as any).published_at || post.created_at || (post as any).date || (post as any).updated_at;
  let formattedDate: string | null = null;
  if (rawDate) {
    const parsedDate = new Date(rawDate);
    if (!isNaN(parsedDate.getTime())) {
      formattedDate = parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }
  if (!formattedDate) {
    formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Reading Time Estimation
  const contentText = post.short_description || (post as any).content || (post as any).description || '';
  const wordCount = contentText.replace(/<[^>]+>/g, '').split(/\s+/).length;
  const estMinutes = Math.max(3, Math.ceil(wordCount / 100));
  const readTime = (post as any).reading_time || (post as any).read_time || `${estMinutes} min read`;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-[#EA580C]/40 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col h-full font-sans">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={primaryImgUrl}
          alt={post.title || 'Blog Post Image'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover img-zoom-hover"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {post.category && (
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md shadow-2xs">
              {post.category.name}
            </span>
          )}
          {post.style && (
            <span className="bg-[#EA580C] backdrop-blur-md text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md shadow-2xs">
              {post.style}
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Metadata Row: Date & City */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 tracking-wider mb-2">
            {formattedDate ? (
              <span className="flex items-center gap-1 text-[#EA580C]">
                <Calendar className="w-3 h-3 text-[#EA580C]" />
                <span>{formattedDate}</span>
              </span>
            ) : null}

            {post.city && (
              <span className="text-slate-500">
                {post.city.name} {post.location ? `• ${post.location}` : ''}
              </span>
            )}
          </div>

          <Link href={detailUrl} className="block group-hover:text-[#EA580C] transition-colors">
            <h3 className="text-base font-serif font-bold text-slate-900 line-clamp-1 mb-1.5">{post.title}</h3>
          </Link>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {post.short_description || (post as any).excerpt || 'High-end custom interior design with premium materials and warranty.'}
          </p>
        </div>

        {/* Card Footer Row: Read More & Reading Time */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <Link
            href={detailUrl}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors tracking-wider"
          >
            <span>Read More</span> <ArrowUpRight className="w-3.5 h-3.5 text-[#EA580C]" />
          </Link>

          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
