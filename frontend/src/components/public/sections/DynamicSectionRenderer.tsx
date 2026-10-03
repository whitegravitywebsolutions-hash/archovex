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
  Building2
} from 'lucide-react';
import { getImageUrl, apiClient } from '@/lib/api';

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
  const subtitle = section.subtitle || d.subtitle || 'Thoughtfully designed luxury interiors built around the way you live. 10-Year Warranty & 45-Day Handover.';
  const ctaText = (section as any).cta_text || d.cta_text || 'BOOK FREE CONSULTATION';
  const ctaLink = (section as any).cta_link || d.cta_link || '';
  const rawBg = (section as any).bg_image || d.bg_image || d.background_image;
  const bgImage = rawBg ? getImageUrl(rawBg) : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';

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

            <p className="text-base text-sky-100 font-normal leading-relaxed">
              {subtitle}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-sky-100 pt-2">
              <div className="flex items-center gap-2 bg-[#0369A1]/60 p-3 rounded-xl border border-sky-600/50 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>10-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0369A1]/60 p-3 rounded-xl border border-sky-600/50 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>45-Day Handover</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              {ctaLink ? (
                <Link
                  href={ctaLink}
                  className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-[#F97316]/30 transition-all flex items-center justify-center gap-2 border border-amber-300/40"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={onOpenConsultation}
                  className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-[#F97316]/30 transition-all flex items-center justify-center gap-2 border border-amber-300/40"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <Link
                href="/designs"
                className="px-8 py-4 bg-white/10 hover:bg-white hover:text-[#0C4A6E] text-white border border-white/30 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center backdrop-blur-md"
              >
                EXPLORE DESIGNS
              </Link>
            </div>
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
              <div className="absolute bottom-6 left-6 right-6 bg-[#0C4A6E]/95 backdrop-blur-md p-4 rounded-2xl border border-sky-600/80 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#F97316]/20 text-[#F97316] rounded-xl border border-[#F97316]/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wider">Custom 3D Renders</h4>
                    <p className="text-[11px] text-sky-200">Tailored to your space and budget</p>
                  </div>
                </div>
                <span className="text-xs font-black text-[#FFEDD5] bg-[#F97316]/20 px-3 py-1 rounded-full border border-[#F97316]/40">
                  Verified Quality
                </span>
              </div>
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
            const primaryImg = design.primary_image?.file_path || design.primary_image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
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
                  {slide.cta_link ? (
                    <Link
                      href={slide.cta_link}
                      className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 border border-amber-300/40"
                    >
                      <span>{slide.cta_text || 'EXPLORE NOW'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={onOpenConsultation}
                      className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 border border-amber-300/40"
                    >
                      <span>{slide.cta_text || 'BOOK FREE CONSULTATION'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <Link
                    href="/designs"
                    className="px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-[#0C4A6E] border border-white/30 backdrop-blur-md font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>VIEW DESIGNS</span>
                  </Link>
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
