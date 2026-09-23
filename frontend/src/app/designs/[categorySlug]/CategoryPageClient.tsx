'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category, DesignPost, Faq, City } from '@/types';
import DesignCard from '@/components/public/DesignCard';
import DesignFilters from '@/components/public/DesignFilters';
import DesignQuickViewModal from '@/components/public/DesignQuickViewModal';
import ConsultationFormModal from '@/components/public/ConsultationFormModal';
import FAQAccordion from '@/components/public/FAQAccordion';
import { apiClient } from '@/lib/api';
import { ChevronRight, Home, Sparkles } from 'lucide-react';

interface ClientProps {
  category: Category;
  initialPosts: DesignPost[];
  faqs: Faq[];
  cities: City[];
}

export default function CategoryPageClient({ category, initialPosts, faqs, cities }: ClientProps) {
  const [posts, setPosts] = useState<DesignPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [quickViewPost, setQuickViewPost] = useState<DesignPost | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const handleFilterChange = async (filters: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await apiClient.get(`/design-categories/${category.slug}?${params}`);
      if (res.data.success && res.data.data.posts) {
        setPosts(res.data.data.posts.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/designs" className="hover:text-slate-900">Designs</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="font-bold text-slate-900">{category.name}</span>
        </div>
      </div>

      {/* CATEGORY HERO */}
      <section className="relative bg-slate-950 text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={category.image || '/placeholder.jpg'}
            alt={category.name}
            fill
            className="object-cover opacity-30 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-400/20 px-3.5 py-1.5 rounded-full inline-block">
            DESIGN COLLECTION
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">{category.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {category.description || category.short_description}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all"
            >
              BOOK FREE CONSULTATION
            </button>
          </div>
        </div>
      </section>

      {/* FILTER BAR & DESIGN GRID */}
      <section className="py-12 bg-slate-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <DesignFilters
            cities={cities}
            onFilterChange={handleFilterChange}
            activeCategorySlug={category.slug}
          />

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
              <h3 className="text-lg font-bold text-slate-900">No designs match your filter criteria</h3>
              <p className="text-xs text-slate-500">Try clearing or adjusting filters to view more designs.</p>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORY FAQs */}
      {faqs.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions ({category.name})</h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}

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
