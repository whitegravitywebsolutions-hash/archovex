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
  dynamicSections?: any[] | null;
  whatsappNumber?: string;
}

export default function BlogIndexClient({
  initialBlogs = [],
  initialCategories = [],
  dynamicSections = null,
  whatsappNumber = '',
}: BlogIndexClientProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract Page Builder custom editor sections if present
  const introSection = dynamicSections?.find(
    (s: any) => s.id === 'sec-blog-intro' || (s.title && s.title.toLowerCase().includes('intro'))
  ) || dynamicSections?.[0];

  const ctaSection = dynamicSections?.find(
    (s: any) => s.id === 'sec-blog-cta' || (s.title && s.title.toLowerCase().includes('cta'))
  );

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
      
      {/* 1. HERO & INTRO (MANAGED VIA PAGE BUILDER CUSTOM EDITOR) */}
      {introSection && introSection.content ? (
        <div
          dangerouslySetInnerHTML={{ __html: introSection.content }}
          className="blog-intro-builder-container"
        />
      ) : (
        <section className="relative bg-[#FAF8F3] py-14 lg:py-20 border-b border-slate-200/90 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-8">
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <span>›</span>
              <span className="text-[#0F172A] font-bold">Blog</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: H1 and Intro Copy */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                  <span>Archovex Knowledge Hub · Delhi NCR</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-slate-900 tracking-tight leading-[1.18]">
                  Interior Design Blog: Practical Guides for NCR Homes and Offices
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  The Archovex interior design blog answers the questions people ask us before they start a project: what drives cost, which materials last, how to plan around society rules and what to check in an older home. Every guide is written for homes and offices in Noida, Greater Noida, Delhi, New Delhi and Gurgaon, in plain language and without sales talk.
                </p>
              </div>

              {/* Right Column: Designer's Desk Visual */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-white">
                  <Image
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
                    alt="Designer's desk with samples, drawings and a laptop"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-[11px] text-white flex items-center justify-between">
                    <span className="font-bold">Real NCR Case Studies & Specifications</span>
                    <span className="text-orange-400 font-semibold">Archovex Studio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. CATEGORY FILTERS & SEARCH */}
      <section className="py-5 bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start flex-1">
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

            {/* Quick Search */}
            <div className="relative w-full sm:w-64 flex-shrink-0">
              <input
                type="text"
                placeholder="Search practical guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-9 bg-[#FAF8F5] border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#EA580C] focus:bg-white focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
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

      {/* 4. INLINE CTA (MANAGED VIA PAGE BUILDER CUSTOM EDITOR) */}
      {ctaSection && ctaSection.content ? (
        <div
          dangerouslySetInnerHTML={{
            __html: ctaSection.content.replace(/\[WHATSAPP\]/g, whatsappNumber || '919999999999'),
          }}
          className="blog-cta-builder-container"
        />
      ) : (
        <section className="relative py-20 sm:py-24 font-sans overflow-hidden text-center bg-[#0F172A] border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-[1.18] max-w-2xl mx-auto">
              Have a question a guide does not answer?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Ask a designer directly.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${whatsappNumber || '919999999999'}?text=Hi%20Archovex,%20I%20have%20a%20question%20about%20my%20interior%20project.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-base font-bold shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>Talk to a Designer</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
