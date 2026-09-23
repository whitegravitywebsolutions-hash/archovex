'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DesignPost } from '@/types';
import { Heart, Eye, ArrowUpRight } from 'lucide-react';

interface DesignCardProps {
  post: DesignPost;
  onQuickView?: (post: DesignPost) => void;
}

export default function DesignCard({ post, onQuickView }: DesignCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wishlist = JSON.parse(localStorage.getItem('archovex_wishlist') || '[]');
      setIsWishlisted(wishlist.includes(post.id));
    }
  }, [post.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      let wishlist = JSON.parse(localStorage.getItem('archovex_wishlist') || '[]');
      if (wishlist.includes(post.id)) {
        wishlist = wishlist.filter((id: number) => id !== post.id);
        setIsWishlisted(false);
      } else {
        wishlist.push(post.id);
        setIsWishlisted(true);
      }
      localStorage.setItem('archovex_wishlist', JSON.stringify(wishlist));
    }
  };

  const primaryImgUrl =
    post.primary_image?.image ||
    post.featured_image ||
    (post.images && post.images.length > 0 ? post.images[0].image : '/placeholder.jpg');

  const categorySlug = post.category?.slug || 'modular-kitchen-designs';
  const detailUrl = `/designs/${categorySlug}/${post.slug}`;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={primaryImgUrl}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover img-zoom-hover"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {post.category && (
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
              {post.category.name}
            </span>
          )}
          {post.style && (
            <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
              {post.style}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        {onQuickView && (
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
            <button
              onClick={() => onQuickView(post)}
              className="px-4 py-2.5 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all"
            >
              <Eye className="w-4 h-4 text-blue-600" /> Quick View
            </button>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {post.city && (
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-1">
              {post.city.name} {post.location ? `• ${post.location}` : ''}
            </span>
          )}
          <Link href={detailUrl} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1.5">{post.title}</h3>
          </Link>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {post.short_description || 'High-end custom interior design with premium materials and warranty.'}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          {post.budget_max ? (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-600 block">Est. Budget</span>
              <span className="text-xs font-bold text-slate-900">
                ₹{(post.budget_min ? post.budget_min / 100000 : 3).toFixed(1)}L – ₹{(post.budget_max / 100000).toFixed(1)}L
              </span>
            </div>
          ) : (
            <span className="text-xs font-bold text-blue-700">Custom Price</span>
          )}

          <Link
            href={detailUrl}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-wider"
          >
            VIEW DESIGN <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
