'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Sparkles, 
  Layers, 
  Award,
  Calendar,
  Check,
  Building2,
  Search,
  BookOpen,
  Heart,
  LayoutGrid
} from 'lucide-react';
import { getImageUrl, apiClient } from '@/lib/api';
import DesignCard from '@/components/public/DesignCard';
import DesignFilters from '@/components/public/DesignFilters';

export interface PageSectionData {
  id: string;
  type: string;
  active?: boolean;
  title?: string;
  subtitle?: string;
  data?: any;
  settings?: any;
}

interface DynamicSectionRendererProps {
  sections?: PageSectionData[];
  onOpenConsultation?: () => void;
}

export default function DynamicSectionRenderer({ 
  sections = [], 
  onOpenConsultation 
}: DynamicSectionRendererProps) {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a, button');
      if (target) {
        const href = target.getAttribute('href');
        if (href && href.includes('#consultation')) {
          e.preventDefault();
          onOpenConsultation?.();
        }
      }
    };
    window.addEventListener('click', handleAnchorClick);
    return () => window.removeEventListener('click', handleAnchorClick);
  }, [onOpenConsultation]);

  const activeSections = Array.isArray(sections) 
    ? sections.filter(s => (s as any).is_active !== false && s.active !== false) 
    : [];

  if (activeSections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-0">
      {activeSections.map((section) => (
        <SectionBlock 
          key={section.id || Math.random().toString()} 
          section={section} 
          onOpenConsultation={onOpenConsultation}
        />
      ))}
    </div>
  );
}

function SectionBlock({ 
  section, 
  onOpenConsultation 
}: { 
  section: PageSectionData; 
  onOpenConsultation?: () => void; 
}) {
  switch (section.type) {
    case 'hero_banner':
    case 'hero':
      return <HeroBannerSection section={section} onOpenConsultation={onOpenConsultation} />;
    case 'hero_slider':
    case 'full_width_hero':
      return <HeroSliderSection section={section} onOpenConsultation={onOpenConsultation} />;
    case 'trust_counters':
    case 'stats':
      return <TrustCountersSection section={section} />;
    case 'category_showcase':
    case 'categories':
      return <CategoryShowcaseSection section={section} />;
    case 'design_posts':
    case 'posts':
      return <DesignPostsSection section={section} />;
    case 'process_workflow':
    case 'process':
      return <ProcessWorkflowSection section={section} />;
    case 'testimonials':
      return <TestimonialsSection section={section} />;
    case 'faq_accordion':
    case 'faq':
      return <FaqAccordionSection section={section} />;
    case 'rich_text':
    case 'richtext':
      return <RichTextSection section={section} />;
    case 'cta_banner':
    case 'cta':
      return <CtaBannerSection section={section} onOpenConsultation={onOpenConsultation} />;
    case 'custom_html':
    case 'html':
      return <CustomHtmlSection section={section} />;
    case 'all_services_filter':
    case 'all_services':
      return <AllServicesFilterSection section={section} />;
    case 'all_blogs_filter':
    case 'all_blogs':
      return <AllBlogsFilterSection section={section} />;
    case 'design_catalog':
    case 'catalog_grid':
    case 'explore_designs':
      return <DesignCatalogSection section={section} />;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* 1. HERO BANNER                                                             */
/* -------------------------------------------------------------------------- */
function HeroBannerSection({ 
  section, 
  onOpenConsultation 
}: { 
  section: PageSectionData; 
  onOpenConsultation?: () => void; 
}) {
  const d = section.data || {};
  const title = section.title || d.title || 'DESIGN YOUR DREAM HOME';
  const subtitle = section.subtitle || d.subtitle || 'Thoughtfully designed luxury interiors built around the way you live.';
  
  const rawCtaText = (section as any).cta_text !== undefined ? (section as any).cta_text : d.cta_text;
  const ctaText = rawCtaText !== undefined ? rawCtaText : 'BOOK FREE CONSULTATION';
  const ctaLink = (section as any).cta_link || d.cta_link || '#consultation';

  const rawSecondaryText = (section as any).secondary_cta_text !== undefined ? (section as any).secondary_cta_text : d.secondary_cta_text;
  const secondaryCtaText = rawSecondaryText !== undefined ? rawSecondaryText : '';
  const secondaryCtaLink = (section as any).secondary_cta_link || d.secondary_cta_link || '/blogs';

  const rawBg = (section as any).bg_image || d.bg_image || d.background_image;
  const bgImage = rawBg ? getImageUrl(rawBg) : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';

  const isPrimaryConsultation = !ctaLink || ctaLink.includes('#consultation');
  const isSecondaryConsultation = secondaryCtaLink && secondaryCtaLink.includes('#consultation');

  const showPrimaryButton = Boolean(ctaText && ctaText.trim());
  const showSecondaryButton = Boolean(secondaryCtaText && secondaryCtaText.trim());

  return (
    <section className="relative bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0E7490] text-white py-14 lg:py-24 border-b border-sky-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/15 border border-[#F97316]/40 text-[#FFEDD5] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#F97316]" />
              <span>ARCHOVEX INFRA • LUXURY INTERIORS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] uppercase">
              {title}
            </h1>

            {subtitle && (
              <p className="text-base text-sky-100 font-normal leading-relaxed">
                {subtitle}
              </p>
            )}

            {(showPrimaryButton || showSecondaryButton) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                {/* Primary CTA Button */}
                {showPrimaryButton && (
                  isPrimaryConsultation ? (
                    <button
                      type="button"
                      onClick={() => onOpenConsultation?.()}
                      className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-[#F97316]/30 transition-all flex items-center justify-center gap-2 border border-amber-300/40 cursor-pointer"
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href={ctaLink}
                      className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-[#F97316]/30 transition-all flex items-center justify-center gap-2 border border-amber-300/40"
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )
                )}

                {/* Secondary CTA Button */}
                {showSecondaryButton && (
                  isSecondaryConsultation ? (
                    <button
                      type="button"
                      onClick={() => onOpenConsultation?.()}
                      className="px-8 py-4 bg-white/10 hover:bg-white hover:text-[#0C4A6E] text-white border border-white/30 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center backdrop-blur-md cursor-pointer"
                    >
                      {secondaryCtaText}
                    </button>
                  ) : (
                    <Link
                      href={secondaryCtaLink || '/blogs'}
                      className="px-8 py-4 bg-white/10 hover:bg-white hover:text-[#0C4A6E] text-white border border-white/30 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center backdrop-blur-md"
                    >
                      {secondaryCtaText}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-sky-800/80 bg-[#0369A1]">
              <Image
                src={bgImage}
                alt={title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. TRUST COUNTERS                                                          */
/* -------------------------------------------------------------------------- */
function TrustCountersSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title || d.title || 'Why Choose ARCHOVEX';
  const rawItems = (section as any).items || d.items;
  const items = Array.isArray(rawItems) && rawItems.length > 0 
    ? rawItems.map((item: any) => ({
        value: item.value || item.number || '',
        label: item.label || item.text || '',
      }))
    : [
        { label: 'HOMES DELIVERED', value: '1,200+' },
        { label: 'DESIGN WARRANTY', value: '10 YEARS' },
        { label: 'HANDOVER GUARANTEE', value: '45 DAYS' },
        { label: 'CUSTOMER RATING', value: '4.9 ★' },
      ];

  return (
    <section className="py-16 bg-[#FAF8F3] border-b border-[#E4DCD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {title && (
          <h2 className="text-2xl sm:text-3xl font-black text-[#0C4A6E] uppercase tracking-tight mb-10">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#F3EEE4] rounded-2xl p-6 border border-[#E4DCD0] shadow-xs hover:border-[#F97316]/50 transition-all">
              <p className="text-3xl sm:text-4xl font-black text-[#F97316] tracking-tight">
                {item.value}
              </p>
              <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mt-2">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. CATEGORY SHOWCASE                                                       */
/* -------------------------------------------------------------------------- */
function CategoryShowcaseSection({ section }: { section: PageSectionData }) {
  const [categories, setCategories] = useState<any[]>([]);
  const d = section.data || {};
  const title = section.title || d.title || 'EXPLORE OUR DESIGN CATEGORIES';
  const subtitle = section.subtitle || d.subtitle || 'Discover interior solutions customized for every space in your home';

  useEffect(() => {
    if (Array.isArray(d.categories) && d.categories.length > 0) {
      setCategories(d.categories);
    } else {
      apiClient.get('/categories')
        .then(res => {
          if (res.data?.success) setCategories(res.data.data || []);
        })
        .catch(() => {});
    }
  }, [d.categories]);

  return (
    <section className="py-16 lg:py-24 bg-[#FAF8F3] border-b border-[#E4DCD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0C4A6E] uppercase tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-slate-600 mt-2 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat: any, idx: number) => {
            const image = cat.banner_image ? getImageUrl(cat.banner_image) : (cat.image ? getImageUrl(cat.image) : 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80');
            return (
              <Link 
                key={cat.id || idx} 
                href={`/designs/${cat.slug || '#'}`}
                className="group bg-white rounded-2xl border border-[#E4DCD0] hover:border-[#0891B2]/60 overflow-hidden shadow-xs hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <Image
                    src={image}
                    alt={cat.name || 'Category'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C4A6E]/85 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-2.5 py-1 bg-[#F97316] text-white text-[10px] font-black uppercase rounded-md mb-1 tracking-wider shadow-xs">
                      INTERIOR DESIGNS
                    </span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      {cat.name}
                    </h3>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between bg-white text-xs font-extrabold text-[#0C4A6E] group-hover:text-[#F97316] transition-colors">
                  <span>VIEW ALL DESIGNS</span>
                  <ArrowRight className="w-4 h-4 text-[#F97316] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. DESIGN POSTS                                                           */
/* -------------------------------------------------------------------------- */
function DesignPostsSection({ section }: { section: PageSectionData }) {
  const [designs, setDesigns] = useState<any[]>([]);
  const d = section.data || {};
  const title = section.title || d.title || 'FEATURED INTERIOR DESIGNS';
  const limit = d.limit || 6;

  useEffect(() => {
    apiClient.get(`/designs?limit=${limit}`)
      .then(res => {
        if (res.data?.success) {
          const list = res.data.data?.data || res.data.data || [];
          setDesigns(list.slice(0, limit));
        }
      })
      .catch(() => {});
  }, [limit]);

  if (designs.length === 0) return null;

  return (
    <section className="py-16 bg-[#FAF8F3] border-b border-[#E4DCD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#0C4A6E] uppercase tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-normal">Handcrafted luxury interior designs for modern homes</p>
          </div>
          <Link href="/designs" className="text-xs font-black text-[#F97316] hover:text-[#EA580C] uppercase tracking-wider flex items-center gap-1">
            <span>SEE ALL DESIGNS</span>
            <ArrowRight className="w-4 h-4 text-[#F97316]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design: any) => {
            const primaryImg =
              design.primary_image?.image ||
              design.primary_image?.file_path ||
              design.featured_image ||
              (design.images && design.images.length > 0 ? (design.images[0].image || design.images[0].file_path) : null) ||
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
            const catSlug = design.category?.slug || 'general';
            return (
              <Link 
                key={design.id} 
                href={`/designs/${catSlug}/${design.slug}`}
                className="group bg-white rounded-2xl border border-[#E4DCD0] hover:border-[#0891B2]/60 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
                  <Image
                    src={getImageUrl(primaryImg)}
                    alt={design.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {design.category && (
                    <span className="absolute top-3 left-3 bg-[#0C4A6E] backdrop-blur-sm text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider border border-sky-900 shadow-2xs">
                      {design.category.name}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#0C4A6E] group-hover:text-[#F97316] transition-colors line-clamp-2">
                      {design.title}
                    </h3>
                    {design.price_range && (
                      <p className="text-xs font-semibold text-slate-500 mt-1">Est. {design.price_range}</p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E4DCD0] flex items-center justify-between text-xs font-extrabold text-[#0C4A6E] group-hover:text-[#F97316] transition-colors">
                    <span>EXPLORE PROJECT</span>
                    <ArrowRight className="w-4 h-4 text-[#F97316] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. PROCESS WORKFLOW                                                        */
/* -------------------------------------------------------------------------- */
function ProcessWorkflowSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title || d.title || 'OUR 4-STEP STREAMLINED PROCESS';
  const rawSteps = (section as any).items || d.steps || d.items;
  const steps = Array.isArray(rawSteps) && rawSteps.length > 0 
    ? rawSteps.map((step: any) => ({
        title: step.title || '',
        description: step.description || step.desc || '',
      }))
    : [
        { title: '1. Consultation & Measurement', description: 'In-person or virtual consultation to analyze space, requirement and style.' },
        { title: '2. 3D Render & Estimate', description: 'Photorealistic 3D design renders with transparent itemized budget estimation.' },
        { title: '3. Factory Manufacturing', description: 'Precision modular crafting using premium German hardware and high-grade materials.' },
        { title: '4. 45-Day Handover', description: 'On-time installation with 148-point quality audit and 10-year warranty.' },
      ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0E7490] text-white border-b border-sky-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
            {title}
          </h2>
          <p className="text-sm text-sky-100 mt-2 font-normal">From concept to reality with zero delays and complete transparency</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step: any, idx: number) => (
            <div key={idx} className="bg-[#0369A1]/60 rounded-2xl p-6 border border-sky-600/60 flex flex-col justify-between hover:border-[#F97316]/80 transition-all shadow-lg">
              <div>
                <span className="text-xs font-black text-white uppercase tracking-widest bg-[#F97316] px-3 py-1 rounded-full inline-block mb-4 shadow-xs">
                  STEP 0{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-sky-100 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. TESTIMONIALS                                                           */
/* -------------------------------------------------------------------------- */
function TestimonialsSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title || d.title || 'WHAT OUR CLIENTS SAY';
  const rawItems = (section as any).items || d.items;
  const items = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : [
    { name: 'Rajesh & Priya Verma', role: '3BHK Homeowner, Bangalore', quote: 'ARCHOVEX rendered precise 3D designs and delivered our home right on schedule. The German hinges and finish are superb!', avatar: '' },
    { name: 'Ananya Sharma', role: 'Villa Owner, Hyderabad', quote: 'Superb quality and zero hidden charges! The project manager kept us updated every single week.', avatar: '' },
  ];

  return (
    <section className="py-16 bg-[#FAF8F3] border-b border-[#E4DCD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-[#0C4A6E] uppercase tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-normal">Real stories from real homeowners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E4DCD0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#F97316] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F97316]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#E4DCD0]">
                <div className="w-10 h-10 rounded-full bg-[#0C4A6E] text-white font-black text-sm flex items-center justify-center uppercase border border-[#F97316]">
                  {t.name ? t.name.charAt(0) : 'C'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0C4A6E]">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. FAQ ACCORDION                                                           */
/* -------------------------------------------------------------------------- */
function FaqAccordionSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title || d.title || 'FREQUENTLY ASKED QUESTIONS';
  const rawFaqs = (section as any).items || d.faqs || d.items;
  const faqs = Array.isArray(rawFaqs) && rawFaqs.length > 0 ? rawFaqs : [
    { question: 'What is included in the 10-year warranty?', answer: 'Our 10-year warranty covers modular cabinets, German hardware fittings, structural defects, and material degradation under normal usage.' },
    { question: 'How long does a full home interior project take?', answer: 'Our standard completion timeline is 45 days from design approval and site readiness.' },
    { question: 'Is 3D design rendering free?', answer: 'Yes, initial 3D design concept rendering is included free of cost during consultation.' },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-[#FAF8F3] border-b border-[#E4DCD0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#0C4A6E] uppercase tracking-tight">
            {title}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq: any, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="border border-[#E4DCD0] rounded-xl overflow-hidden bg-white transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 font-bold text-[#0C4A6E] text-sm flex items-center justify-between gap-4 hover:bg-[#F3EEE4] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-[#F97316]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-[#E4DCD0] bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. RICH TEXT SECTION                                                      */
/* -------------------------------------------------------------------------- */
function RichTextSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const heading = section.title || d.heading || d.title || '';
  const content = (section as any).content || d.content || '';

  return (
    <section className="py-16 bg-[#FAF8F3] border-b border-[#E4DCD0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {heading && (
          <h2 className="text-3xl font-black text-[#0C4A6E] uppercase tracking-tight mb-6">
            {heading}
          </h2>
        )}
        <div 
          className="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 9. CTA BANNER                                                             */
/* -------------------------------------------------------------------------- */
function CtaBannerSection({ 
  section, 
  onOpenConsultation 
}: { 
  section: PageSectionData; 
  onOpenConsultation?: () => void; 
}) {
  const d = section.data || {};
  const title = section.title || d.title || 'READY TO TRANSFORM YOUR LIVING SPACE?';
  const description = section.subtitle || d.description || d.subtitle || 'Book a free consultation with our senior interior architects today.';
  const btnText = (section as any).cta_text || d.button_text || d.cta_text || 'BOOK FREE CONSULTATION';
  const btnLink = (section as any).cta_link || d.button_link || d.cta_link || '';

  return (
    <section className="py-16 bg-gradient-to-r from-[#0C4A6E] via-[#075985] to-[#0E7490] text-white border-b border-sky-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-sky-100 max-w-2xl mx-auto font-normal">
            {description}
          </p>
        )}
        <div className="pt-2">
          {btnLink ? (
            <Link
              href={btnLink}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl border border-amber-300/40"
            >
              <span>{btnText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl border border-amber-300/40"
            >
              <span>{btnText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 10. CUSTOM HTML SECTION                                                    */
/* -------------------------------------------------------------------------- */
function CustomHtmlSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title || d.title || '';
  const htmlCode = (section as any).html_code || (section as any).content || d.html_code || d.content || '';

  if (!htmlCode) return null;

  return (
    <section className="py-12 bg-[#FAF8F3] border-b border-[#E4DCD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl font-black text-[#0B132B] uppercase tracking-tight mb-8 text-center">
            {title}
          </h2>
        )}
        <div 
          className="custom-html-wrapper"
          dangerouslySetInnerHTML={{ __html: htmlCode }}
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 11. FULL WIDTH HERO SLIDER                                                 */
/* -------------------------------------------------------------------------- */
function HeroSliderSection({
  section,
  onOpenConsultation,
}: {
  section: PageSectionData;
  onOpenConsultation?: () => void;
}) {
  const d = section.data || {};
  const rawSlides = (section as any).items || d.slides || d.items;

  const slides = Array.isArray(rawSlides) && rawSlides.length > 0
    ? rawSlides
    : [
        {
          title: section.title || 'LUXURY TURNKEY INTERIORS & ARCHITECTURE',
          subtitle: section.subtitle || 'Bespoke modular kitchens, living room spaces, and custom wardrobes with German hardware & 10-year warranty.',
          bg_image: (section as any).bg_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
          cta_text: (section as any).cta_text || 'BOOK FREE CONSULTATION',
          cta_link: (section as any).cta_link || '',
          badge: (section as any).badge || 'ARCHOVEX LUXURY HOMES',
        },
        {
          title: 'CRAFTED IN AUTOMATED GERMAN FACTORIES',
          subtitle: 'Sub-millimeter precision woodworking with Boiling Water Resistant (BWR) plywood and 45-day guaranteed handover.',
          bg_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80',
          cta_text: 'EXPLORE DESIGNS',
          cta_link: '/designs',
          badge: '45-DAY HANDOVER GUARANTEE',
        },
        {
          title: 'PHOTOREALISTIC 3D DESIGN RENDERS',
          subtitle: 'Visualize your entire home in 3D before execution begins with complete line-item price transparency.',
          bg_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
          cta_text: 'SEE RECENT PROJECTS',
          cta_link: '/designs',
          badge: '10-YEAR WARRANTY',
        },
      ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[700px] flex items-center bg-slate-950 overflow-hidden group">
      {slides.map((slide: any, idx: number) => {
        const rawBg = slide.bg_image || slide.background_image || slide.image;
        const bgImg = rawBg ? getImageUrl(rawBg) : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80';
        const isActive = idx === currentIndex;

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={bgImg}
              alt={slide.title || 'Hero Banner'}
              fill
              priority={idx === 0}
              className="object-cover object-center transform scale-105 transition-transform duration-10000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C4A6E]/95 via-[#0C4A6E]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C4A6E]/90 via-transparent to-black/30" />

            <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-20">
              <div className="max-w-2xl space-y-6 text-white animate-fade-in">
                {(slide.badge || slide.tagline) && (
                  <div className="inline-flex items-center gap-2 bg-[#F97316] text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg border border-amber-400/40">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>{slide.badge || slide.tagline}</span>
                  </div>
                )}

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] uppercase text-white drop-shadow-md">
                  {slide.title || 'DESIGN YOUR DREAM HOME'}
                </h1>

                {slide.subtitle && (
                  <p className="text-sm sm:text-base lg:text-lg text-sky-100 font-normal leading-relaxed max-w-xl text-shadow">
                    {slide.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {/* Primary CTA Button */}
                  {(() => {
                    const rawPrimary = slide.cta_text !== undefined ? slide.cta_text : (section as any).cta_text;
                    const primaryText = rawPrimary !== undefined ? rawPrimary : 'BOOK FREE CONSULTATION';
                    const primaryLink = slide.cta_link || (section as any).cta_link || '#consultation';
                    const showPrimary = Boolean(primaryText && primaryText.trim());
                    const isPrimaryConsultation = !primaryLink || primaryLink.includes('#consultation');

                    if (!showPrimary) return null;

                    return isPrimaryConsultation ? (
                      <button
                        type="button"
                        onClick={onOpenConsultation}
                        className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 border border-amber-300/40 cursor-pointer"
                      >
                        <span>{primaryText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <Link
                        href={primaryLink}
                        className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 border border-amber-300/40"
                      >
                        <span>{primaryText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    );
                  })()}

                  {/* Secondary CTA Button */}
                  {(() => {
                    const rawSecondary = slide.secondary_cta_text !== undefined ? slide.secondary_cta_text : (section as any).secondary_cta_text;
                    const secondaryText = rawSecondary !== undefined ? rawSecondary : '';
                    const secondaryLink = slide.secondary_cta_link || (section as any).secondary_cta_link || '/blogs';
                    const showSecondary = Boolean(secondaryText && secondaryText.trim());
                    const isSecondaryConsultation = secondaryLink && secondaryLink.includes('#consultation');

                    if (!showSecondary) return null;

                    return isSecondaryConsultation ? (
                      <button
                        type="button"
                        onClick={onOpenConsultation}
                        className="px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-[#0C4A6E] border border-white/30 backdrop-blur-md font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>{secondaryText}</span>
                      </button>
                    ) : (
                      <Link
                        href={secondaryLink}
                        className="px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-[#0C4A6E] border border-white/30 backdrop-blur-md font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                      >
                        <span>{secondaryText}</span>
                      </Link>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3.5 bg-[#0C4A6E]/80 hover:bg-[#F97316] text-white rounded-full border border-white/20 backdrop-blur-md transition-all shadow-xl opacity-80 hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3.5 bg-[#0C4A6E]/80 hover:bg-[#F97316] text-white rounded-full border border-white/20 backdrop-blur-md transition-all shadow-xl opacity-80 hover:opacity-100 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-[#0C4A6E]/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            {slides.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-[#F97316] shadow-glow' : 'w-2.5 bg-white/50 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 12. ALL SERVICES WITH FILTER                                               */
/* -------------------------------------------------------------------------- */
function AllServicesFilterSection({ section }: { section: PageSectionData }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'featured'>('all');

  const d = section.data || {};
  const title = section.title || d.title || 'ALL SERVICES & INTERIOR CATEGORIES';
  const subtitle = section.subtitle || d.subtitle || 'Explore our complete turnkey interior design solutions tailored for every space';
  const badge = section.badge || d.badge || 'OUR SERVICES';

  useEffect(() => {
    setLoading(true);
    apiClient.get('/categories')
      .then(res => {
        if (res.data?.success) {
          const list = res.data.data || [];
          setCategories(list.filter((cat: any) => cat.status !== 'draft'));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = !search.trim() || 
      cat.name?.toLowerCase().includes(search.toLowerCase()) ||
      cat.short_description?.toLowerCase().includes(search.toLowerCase()) ||
      cat.description?.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || (selectedFilter === 'featured' && Boolean(cat.is_featured));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="py-16 lg:py-24 bg-[#FAF8F3] border-b border-[#E4DCD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Controls Box */}
        <div className="bg-[#F3EEE4] rounded-2xl border border-[#E4DCD0] p-4 sm:p-6 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4DCD0] focus:ring-2 focus:ring-[#0891B2] rounded-xl text-xs text-[#0C4A6E] font-bold outline-none transition-all shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-[#E4DCD0] p-1.5 rounded-xl shadow-xs">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-[#0C4A6E] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0C4A6E]'
                }`}
              >
                All Services ({categories.length})
              </button>
              <button
                onClick={() => setSelectedFilter('featured')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedFilter === 'featured'
                    ? 'bg-[#0C4A6E] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0C4A6E]'
                }`}
              >
                Featured
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-[#E4DCD0] rounded-2xl max-w-xl mx-auto p-8">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0C4A6E]">No services found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat: any) => {
              const image = cat.banner_image ? getImageUrl(cat.banner_image) : (cat.image ? getImageUrl(cat.image) : 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80');
              return (
                <Link
                  key={cat.id}
                  href={`/services/${cat.slug}`}
                  className="group bg-white rounded-2xl border border-[#E4DCD0] hover:border-[#0C4A6E] overflow-hidden shadow-xs hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <Image
                      src={image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C4A6E]/85 via-[#0C4A6E]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4">
                      {cat.is_featured && (
                        <span className="inline-block px-2.5 py-0.5 bg-[#F97316] text-white text-[9px] font-black uppercase rounded mb-1.5 tracking-wider shadow-xs">
                          FEATURED SERVICE
                        </span>
                      )}
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">
                        {cat.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {cat.short_description || cat.description || 'Turnkey interior design services by ARCHOVEX INFRA.'}
                    </p>

                    <div className="mt-5 pt-3 border-t border-[#E4DCD0] flex items-center justify-between text-xs font-extrabold text-[#0C4A6E] group-hover:text-[#F97316] transition-colors">
                      <span>VIEW SERVICE DETAILS</span>
                      <ArrowRight className="w-4 h-4 text-[#F97316] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 13. ALL BLOGS WITH FILTER (WITH PAGINATION & ALL WISHLIST ITEMS)           */
/* -------------------------------------------------------------------------- */
function AllBlogsFilterSection({ section }: { section: PageSectionData }) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [allWishlistBlogs, setAllWishlistBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistMode, setWishlistMode] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Sync Wishlist IDs from localStorage & check URL params
  useEffect(() => {
    const syncWishlist = () => {
      try {
        const list = JSON.parse(localStorage.getItem('archovex_wishlist') || '[]');
        setWishlistIds(Array.isArray(list) ? list.map((id: any) => Number(id)) : []);
      } catch {
        setWishlistIds([]);
      }
    };
    syncWishlist();
    window.addEventListener('storage', syncWishlist);
    window.addEventListener('wishlistUpdated', syncWishlist);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('wishlist') === 'true') {
        setWishlistMode(true);
      }
    }

    return () => {
      window.removeEventListener('storage', syncWishlist);
      window.removeEventListener('wishlistUpdated', syncWishlist);
    };
  }, []);

  // Fetch Categories & Cities
  useEffect(() => {
    apiClient.get('/categories')
      .then((res) => {
        if (res.data?.success) setCategories(res.data.data || []);
      })
      .catch(() => {});

    apiClient.get('/cities')
      .then((res) => {
        if (res.data?.success) setCities(res.data.data || []);
      })
      .catch(() => {});
  }, []);

  // Fetch all posts for Wishlist when wishlistIds change or when wishlist mode is active
  useEffect(() => {
    if (wishlistIds.length > 0 || wishlistMode) {
      const idsParam = wishlistIds.join(',');
      const url = idsParam ? `/designs?ids=${idsParam}&limit=1000` : '/designs?limit=1000';
      apiClient.get(url)
        .then((res) => {
          if (res.data?.success) {
            const list = res.data.data?.data || res.data.data || [];
            setAllWishlistBlogs(list);
          }
        })
        .catch(() => {});
    }
  }, [wishlistIds.join(','), wishlistMode]);

  // Fetch Blogs / Designs with Pagination & Filters
  const fetchBlogs = async (filters: Record<string, string> = {}, pageNum = page) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: String(pageNum),
        limit: '8',
      }).toString();

      const res = await apiClient.get(`/designs?${queryParams}`);
      if (res.data?.success) {
        const rawData = res.data.data;
        if (rawData && Array.isArray(rawData.data)) {
          setBlogs(rawData.data);
          setPagination({
            current_page: rawData.current_page,
            last_page: rawData.last_page,
            total: rawData.total,
          });
        } else if (Array.isArray(rawData)) {
          setBlogs(rawData);
          setPagination(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(activeFilters, page);
  }, [page]);

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setActiveFilters(newFilters);
    setPage(1);
    fetchBlogs(newFilters, 1);
  };

  const handleWishlistToggle = (mode: boolean) => {
    setWishlistMode(mode);
    if (typeof window !== 'undefined') {
      const newUrl = mode
        ? `${window.location.pathname}?wishlist=true`
        : window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }
  };

  const displayedBlogs = wishlistMode
    ? (allWishlistBlogs.length > 0 ? allWishlistBlogs : blogs).filter((b) => wishlistIds.includes(Number(b.id)))
    : blogs;

  return (
    <section className="py-12 bg-[#FAF8F3] border-b border-[#E4DCD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Mode Switcher Bar */}
        <div className="flex items-center justify-between border-b border-[#E4DCD0] pb-4">
          <div className="flex items-center gap-2 bg-[#F3EEE4] p-1 rounded-xl border border-[#E4DCD0]">
            <button
              type="button"
              onClick={() => handleWishlistToggle(false)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                !wishlistMode
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>All Blogs</span>
            </button>

            <button
              type="button"
              onClick={() => handleWishlistToggle(true)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                wishlistMode
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlistMode ? 'fill-current' : ''}`} />
              <span>My Wishlist ({wishlistIds.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Search Box + Services Filter + Location Filter) */}
        {!wishlistMode && (
          <DesignFilters
            categories={categories}
            cities={cities}
            onFilterChange={handleFilterChange}
            showServicesFilter={true}
            hideStylesAndLayouts={true}
            serviceLabel="All Services"
            cityLabel="All Locations"
            placeholder="Search blogs by title, topic..."
          />
        )}

        {/* 4-Column Grid matching uploaded image */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-200 aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : displayedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedBlogs.map((blog) => (
              <DesignCard key={blog.id} post={blog} />
            ))}
          </div>
        ) : wishlistMode ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E4DCD0] text-center space-y-4 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-xl font-black text-[#0C4A6E] uppercase">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click the heart icon on any design or blog post card to save your favorite concepts here.
            </p>
            <button
              type="button"
              onClick={() => handleWishlistToggle(false)}
              className="px-6 py-2.5 bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all inline-block shadow-md"
            >
              Explore All Blogs
            </button>
          </div>
        ) : (
          <div className="bg-[#FAF8F3] p-12 rounded-2xl border border-[#E4DCD0] text-center space-y-3">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-[#0C4A6E] uppercase">No posts found</h3>
            <p className="text-xs text-slate-500">Try broadening your search or filter options.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {!wishlistMode && pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#E4DCD0]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-xl border border-[#E4DCD0] bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1 font-bold text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {[...Array(pagination.last_page)].map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#0C4A6E] text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-[#E4DCD0]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
              disabled={page === pagination.last_page}
              className="px-3 py-2 rounded-xl border border-[#E4DCD0] bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1 font-bold text-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 14. EXPLORE DESIGNS HERO BANNER SECTION                                    */
/* -------------------------------------------------------------------------- */
function DesignCatalogSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title || d.title || 'EXPLORE INTERIOR DESIGNS';
  const subtitle = section.subtitle || d.subtitle || 'Discover bespoke designs categorized by room, layout, style, and city.';
  const badge = section.badge || d.badge || 'COMPLETE INTERIOR CATALOG';

  return (
    <section className="bg-slate-950 text-white py-14 sm:py-18 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
        {badge && (
          <span className="text-[11px] font-black uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30 px-4 py-1.5 rounded-full inline-block shadow-sm">
            {badge}
          </span>
        )}
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-sm">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}


