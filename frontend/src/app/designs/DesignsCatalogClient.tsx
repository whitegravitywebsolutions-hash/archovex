'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Category, City, DesignPost } from '@/types';
import DesignCard from '@/components/public/DesignCard';
import DesignFilters from '@/components/public/DesignFilters';
import ConsultationFormModal from '@/components/public/ConsultationFormModal';
import { apiClient } from '@/lib/api';
import { Sparkles, Heart, LayoutGrid } from 'lucide-react';

interface Props {
  categories: Category[];
  cities: City[];
}

function CatalogContent({ categories, cities }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isWishlistParam = searchParams.get('wishlist') === 'true';

  const [posts, setPosts] = useState<DesignPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [wishlistMode, setWishlistMode] = useState(isWishlistParam);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  // Sync Wishlist IDs from localStorage
  useEffect(() => {
    const syncWishlist = () => {
      try {
        const list = JSON.parse(localStorage.getItem('archovex_wishlist') || '[]');
        setWishlistIds(Array.isArray(list) ? list : []);
      } catch {
        setWishlistIds([]);
      }
    };
    syncWishlist();
    window.addEventListener('storage', syncWishlist);
    window.addEventListener('wishlistUpdated', syncWishlist);
    return () => {
      window.removeEventListener('storage', syncWishlist);
      window.removeEventListener('wishlistUpdated', syncWishlist);
    };
  }, []);

  useEffect(() => {
    setWishlistMode(isWishlistParam);
  }, [isWishlistParam]);

  const fetchPosts = async (filters: Record<string, string> = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await apiClient.get(`/designs?${params}`);
      if (res.data.success) {
        setPosts(res.data.data.data || res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts if wishlist mode is active
  const displayedPosts = wishlistMode
    ? posts.filter((p) => wishlistIds.includes(p.id))
    : posts;

  return (
    <>
      <section className="bg-slate-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block">
            {wishlistMode ? 'YOUR SAVED FAVORITES' : 'COMPLETE INTERIOR CATALOG'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase">
            {wishlistMode ? 'My Saved Wishlist' : 'Explore Interior Designs'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            {wishlistMode
              ? 'View and manage all your saved interior design concepts in one place.'
              : 'Discover bespoke designs categorized by room, layout, style, and city.'}
          </p>
        </div>
      </section>

      <section className="py-10 bg-[#faf8f3] min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Mode Switcher Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setWishlistMode(false);
                  router.push('/designs');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  !wishlistMode
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>All Designs</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWishlistMode(true);
                  router.push('/designs?wishlist=true');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  wishlistMode
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlistMode ? 'fill-current' : ''}`} />
                <span>My Wishlist ({wishlistIds.length})</span>
              </button>
            </div>
          </div>

          {!wishlistMode && <DesignFilters cities={cities} onFilterChange={fetchPosts} />}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-200 aspect-[4/5] rounded-2xl" />
              ))}
            </div>
          ) : displayedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedPosts.map((post) => (
                <DesignCard key={post.id} post={post} />
              ))}
            </div>
          ) : wishlistMode ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm max-w-lg mx-auto my-8">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click the heart icon on any design card or blog post to save your favorite concepts here for quick access.
              </p>
              <button
                type="button"
                onClick={() => {
                  setWishlistMode(false);
                  router.push('/designs');
                }}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all inline-block shadow-md"
              >
                Explore Design Catalog
              </button>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border text-center space-y-3">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No design posts found</h3>
              <p className="text-xs text-slate-500">Try broadening your search or filter options.</p>
            </div>
          )}
        </div>
      </section>

      {/* MODALS */}
      <ConsultationFormModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        cities={cities}
      />
    </>
  );
}

export default function DesignsCatalogClient(props: Props) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-500">Loading catalog...</div>}>
      <CatalogContent {...props} />
    </Suspense>
  );
}
