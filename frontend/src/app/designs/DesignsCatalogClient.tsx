'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Category, City, DesignPost } from '@/types';
import DesignCard from '@/components/public/DesignCard';
import DesignFilters from '@/components/public/DesignFilters';
import ConsultationFormModal from '@/components/public/ConsultationFormModal';
import { apiClient } from '@/lib/api';
import { Sparkles } from 'lucide-react';

interface Props {
  categories: Category[];
  cities: City[];
}

function CatalogContent({ categories, cities }: Props) {
  const [posts, setPosts] = useState<DesignPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

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

  return (
    <>
      <section className="bg-gradient-to-b from-[#FAFAFA] via-[#F6F4EF] to-[#FAFAFA] text-slate-900 pt-7 pb-14 border-b border-slate-200/80 font-sans">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full inline-block shadow-2xs">
            COMPLETE INTERIOR CATALOG
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-tight text-slate-900">
            Explore Interior Designs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Discover bespoke designs categorized by room, layout, style, and city.
          </p>
        </div>
      </section>

      <section className="py-10 bg-[#FAFAFA] min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <DesignFilters cities={cities} onFilterChange={fetchPosts} />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-200 aspect-[4/5] rounded-2xl" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <DesignCard key={post.id} post={post} />
              ))}
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
