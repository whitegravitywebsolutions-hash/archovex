'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category, DesignPost, Faq, City } from '@/types';
import DesignCard from '@/components/public/DesignCard';
import DesignFilters from '@/components/public/DesignFilters';
import ConsultationFormModal from '@/components/public/ConsultationFormModal';
import FAQAccordion from '@/components/public/FAQAccordion';
import { apiClient } from '@/lib/api';
import { ChevronRight, Home, Sparkles } from 'lucide-react';

interface ClientProps {
  category: Category;
  initialPosts: DesignPost[];
  faqs: Faq[];
  cities: City[];
  parentLabel?: string;
  parentUrl?: string;
  hideBreadcrumb?: boolean;
}

export default function CategoryPageClient({
  category,
  initialPosts,
  faqs,
  cities,
  parentLabel = 'Blog',
  parentUrl = '/blog',
  hideBreadcrumb = false,
}: ClientProps) {
  const [posts, setPosts] = useState<DesignPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
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
      {!hideBreadcrumb && (
        <div className="bg-[#FAF8F3] border-b border-slate-200/80 py-3 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-600">
            <Link href="/" className="hover:text-[#EA580C] flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-slate-400" /> Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href={parentUrl} className="hover:text-[#EA580C]">{parentLabel}</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-slate-900">{category.name}</span>
          </div>
        </div>
      )}

      {/* CATEGORY HERO */}
      <section className="relative bg-gradient-to-b from-[#FAFAFA] via-[#F6F4EF] to-[#FAFAFA] text-slate-900 pt-8 sm:pt-12 pb-16 sm:pb-24 overflow-hidden border-b border-slate-200/80 font-sans">
        {category.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={category.image}
              alt=""
              aria-hidden="true"
              fill
              className="object-cover opacity-15 scale-105 select-none"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA]/90 via-[#FAFAFA]/70 to-[#FAFAFA]" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full inline-block shadow-2xs">
            ARCHOVEX • DESIGN COLLECTION
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-tight text-slate-900">{category.name}</h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {category.description || category.short_description}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="px-8 py-4 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all border border-amber-500/20 cursor-pointer"
            >
              BOOK FREE CONSULTATION
            </button>
          </div>
        </div>
      </section>

      {/* FILTER BAR & DESIGN GRID */}
      <section className="py-12 bg-[#FAF8F3] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <DesignFilters
            cities={cities}
            onFilterChange={handleFilterChange}
            activeCategorySlug={category.slug}
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#E4DCD0]/50 aspect-[4/5] rounded-2xl" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <DesignCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-[#E4DCD0] text-center space-y-3">
              <Sparkles className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-[#0C4A6E]">No designs match your filter criteria</h3>
              <p className="text-xs text-slate-500">Try clearing or adjusting filters to view more designs.</p>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORY FAQs */}
      {faqs.length > 0 && (
        <section className="py-16 bg-[#FAF8F3] border-t border-[#E4DCD0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-[#0C4A6E] uppercase tracking-tight">Frequently Asked Questions ({category.name})</h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* MODALS */}
      <ConsultationFormModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        cities={cities}
      />
    </>
  );
}
