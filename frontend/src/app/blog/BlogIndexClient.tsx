'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Search } from 'lucide-react';

export interface DynamicBlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface DynamicBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  author?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  category?: DynamicBlogCategory | null;
  category_id?: number | null;
  is_featured?: boolean;
}

interface ArticleOutline {
  id: number;
  title: string;
  category: string;
  categorySlug: string;
  slug: string;
  readTime: string;
  desc: string;
  image: string;
  publishedDate: string;
}

interface BlogIndexClientProps {
  initialBlogs?: DynamicBlogPost[];
  initialCategories?: DynamicBlogCategory[];
}

export default function BlogIndexClient({
  initialBlogs = [],
  initialCategories = [],
}: BlogIndexClientProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map backend blogs to unified ArticleOutline
  const articles: ArticleOutline[] = useMemo(() => {
    if (!initialBlogs || initialBlogs.length === 0) {
      return [];
    }

    return initialBlogs.map((b) => {
      // Calculate a sensible read time based on content length
      const wordCount = (b.content || b.excerpt || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
      const calcMinutes = Math.max(3, Math.min(12, Math.ceil(wordCount / 180)));
      const readTime = `${calcMinutes} min read`;

      // Date formatting
      const dateRaw = b.published_at || b.created_at;
      let formattedDate = 'Recently Updated';
      if (dateRaw) {
        try {
          const d = new Date(dateRaw);
          formattedDate = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        } catch {
          formattedDate = 'Recently Updated';
        }
      }

      const catName = b.category?.name || 'Design Guide';
      const catSlug = b.category?.slug || 'guide';

      // Clean plain description from excerpt or content
      let desc = b.excerpt || '';
      if (!desc && b.content) {
        desc = b.content.replace(/<[^>]*>/g, ' ').slice(0, 160) + '...';
      }

      return {
        id: b.id,
        title: b.title,
        category: catName,
        categorySlug: catSlug,
        slug: b.slug,
        readTime,
        desc: desc || 'Comprehensive interior design breakdown, material specifications, and execution advice from Archovex.',
        image: b.featured_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        publishedDate: formattedDate,
      };
    });
  }, [initialBlogs]);

  // Dynamic Category filters
  const categoryTabs = useMemo(() => {
    const tabs: { label: string; slug: string }[] = [{ label: 'All Guides', slug: 'all' }];
    
    // Add categories passed from server
    if (initialCategories && initialCategories.length > 0) {
      initialCategories.forEach((cat) => {
        tabs.push({ label: cat.name, slug: cat.slug });
      });
    } else {
      // Fallback: derive categories from blogs
      const seen = new Set<string>();
      articles.forEach((art) => {
        if (!seen.has(art.categorySlug)) {
          seen.add(art.categorySlug);
          tabs.push({ label: art.category, slug: art.categorySlug });
        }
      });
    }

    return tabs;
  }, [initialCategories, articles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory =
        selectedCategorySlug === 'all' || art.categorySlug === selectedCategorySlug;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.desc.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategorySlug, searchQuery]);

  const activeCategoryLabel =
    categoryTabs.find((t) => t.slug === selectedCategorySlug)?.label || 'All Guides';

  return (
    <div className="font-sans text-slate-800">
      
      {/* 1. HERO */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] py-16 lg:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#EA580C] bg-orange-50 border border-orange-200 px-4 py-1.5 rounded-full inline-block">
            ARCHOVEX KNOWLEDGE HUB
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-slate-900 leading-tight">
            Interior Design Guides, Costs & Insights
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Honest material advice, real Delhi NCR price guides, and practical architectural tips from our design and site execution team.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative pt-2">
            <input
              type="text"
              placeholder="Search guides (e.g. kitchen, wardrobe, cost, Noida)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 pl-11 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium shadow-sm focus:ring-2 focus:ring-[#EA580C] focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 mt-1" />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS */}
      <section className="py-6 bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start lg:justify-center">
            {categoryTabs.map((tab) => {
              const isActive = selectedCategorySlug === tab.slug;
              return (
                <button
                  key={tab.slug}
                  onClick={() => setSelectedCategorySlug(tab.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EA580C] text-white shadow-md'
                      : 'bg-[#FAF8F5] text-slate-700 hover:bg-orange-50 hover:text-[#EA580C] border border-slate-200/80'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ARTICLES GRID */}
      <section className="py-16 lg:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'Guide' : 'Guides'} in <span className="text-slate-900">{activeCategoryLabel}</span>
            </div>
            <Link
              href="/faqs"
              className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-1"
            >
              <span>View Master FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8">
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No Guides Found</h3>
              <p className="text-slate-500 text-sm mb-6">
                No articles match &quot;{searchQuery}&quot; in the selected category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategorySlug('all');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-[#EA580C] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#C2410C] transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((art) => (
                <article
                  key={art.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <Link
                      href={`/blog/${art.slug}`}
                      className="block relative aspect-[16/10] overflow-hidden bg-slate-900"
                    >
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-bold text-[#EA580C] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                        {art.category}
                      </span>
                    </Link>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#EA580C]" /> {art.publishedDate}
                        </span>
                        <span>•</span>
                        <span>{art.readTime}</span>
                      </div>

                      <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors leading-snug">
                        <Link href={`/blog/${art.slug}`}>
                          {art.title}
                        </Link>
                      </h2>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                        {art.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#EA580C]">
                    <Link
                      href={`/blog/${art.slug}`}
                      className="hover:underline flex items-center gap-1.5"
                    >
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/contact-us"
                      className="text-[10px] text-slate-400 hover:text-[#EA580C] font-semibold uppercase"
                    >
                      Consult Expert
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. INLINE CTA */}
      <section className="py-16 bg-slate-900 text-white text-center font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full inline-block">
            NEED BESPOKE GUIDANCE?
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Have a Specific Question About Your Space?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
            Speak directly with an Archovex design expert. We will evaluate your floor plan and share transparent advice on layout, materials and costs.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4">
            <Link
              href="/contact-us"
              className="px-7 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all"
            >
              BOOK FREE CONSULTATION
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
