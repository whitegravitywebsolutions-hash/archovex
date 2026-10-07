'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DesignPost } from '@/types';
import { Heart, ArrowUpRight } from 'lucide-react';

interface DesignCardProps {
  post: DesignPost;
}

export default function DesignCard({ post }: DesignCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkWishlist = () => {
        try {
          const wishlist = JSON.parse(localStorage.getItem('archovex_wishlist') || '[]');
          setIsWishlisted(Array.isArray(wishlist) && wishlist.includes(post.id));
        } catch {
          setIsWishlisted(false);
        }
      };
      checkWishlist();
      window.addEventListener('wishlistUpdated', checkWishlist);
      return () => window.removeEventListener('wishlistUpdated', checkWishlist);
    }
  }, [post.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      try {
        let wishlist = JSON.parse(localStorage.getItem('archovex_wishlist') || '[]');
        if (!Array.isArray(wishlist)) wishlist = [];
        if (wishlist.includes(post.id)) {
          wishlist = wishlist.filter((id: number) => id !== post.id);
          setIsWishlisted(false);
        } else {
          wishlist.push(post.id);
          setIsWishlisted(true);
        }
        localStorage.setItem('archovex_wishlist', JSON.stringify(wishlist));
        window.dispatchEvent(new Event('wishlistUpdated'));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const primaryImgUrl =
    post.primary_image?.image ||
    post.primary_image?.file_path ||
    post.featured_image ||
    post.image ||
    (post.images && post.images.length > 0 ? (post.images[0].image || post.images[0].file_path) : null) ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const categorySlug = post.category?.slug || 'modular-kitchen-designs';
  const detailUrl = `/blogs/${categorySlug}/${post.slug}`;

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E4DCD0] hover:border-[#0891B2]/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col h-full">
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
            <span className="bg-[#0C4A6E] backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs border border-sky-900/40">
              {post.category.name}
            </span>
          )}
          {post.style && (
            <span className="bg-[#F97316] backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
              {post.style}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-[#F97316] text-white shadow-lg'
              : 'bg-white/90 text-[#0C4A6E] hover:bg-[#F97316] hover:text-white shadow-xs'
          }`}
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {post.city && (
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              {post.city.name} {post.location ? `• ${post.location}` : ''}
            </span>
          )}
          <Link href={detailUrl} className="block group-hover:text-[#F97316] transition-colors">
            <h3 className="text-base font-black text-[#0C4A6E] line-clamp-1 mb-1.5">{post.title}</h3>
          </Link>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {post.short_description || 'High-end custom interior design with premium materials and warranty.'}
          </p>
        </div>

        <div className="pt-3 border-t border-[#E4DCD0] flex items-center justify-between mt-auto">
          <Link
            href={detailUrl}
            className="inline-flex items-center gap-1 text-xs font-black text-[#0C4A6E] group-hover:text-[#F97316] transition-colors uppercase tracking-wider"
          >
            <span>VIEW DESIGN</span> <ArrowUpRight className="w-3.5 h-3.5 text-[#F97316]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
