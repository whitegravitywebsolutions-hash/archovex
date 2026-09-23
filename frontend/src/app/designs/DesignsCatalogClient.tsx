'use client';

import React, { useState, useEffect } from 'react';
import { Category, City, DesignPost } from '@/types';
import DesignCard from '@/components/public/DesignCard';
import DesignFilters from '@/components/public/DesignFilters';
import DesignQuickViewModal from '@/components/public/DesignQuickViewModal';
import ConsultationFormModal from '@/components/public/ConsultationFormModal';
import { apiClient } from '@/lib/api';
import { Sparkles } from 'lucide-react';

interface Props {
  categories: Category[];
  cities: City[];
}

export default function DesignsCatalogClient({ categories, cities }: Props) {
  const [posts, setPosts] = useState<DesignPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewPost, setQuickViewPost] = useState<DesignPost | null>(null);
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
      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-400/20 px-3.5 py-1.5 rounded-full inline-block">
            COMPLETE INTERIOR CATALOG
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase">Explore Interior Designs</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Discover bespoke designs categorized by room, layout, style, finish, and budget.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
                <DesignCard key={post.id} post={post} onQuickView={setQuickViewPost} />
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
