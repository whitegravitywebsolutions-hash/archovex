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
  LayoutGrid,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Loader2,
  MessageSquare,
  Quote
} from 'lucide-react';
import { getImageUrl, apiClient } from '@/lib/api';
import DesignCard from '@/components/public/DesignCard';
import DesignFilters from '@/components/public/DesignFilters';
import ConsultationForm from '@/components/public/ConsultationForm';

export interface PageSectionData {
  id: string;
  type: string;
  active?: boolean;
  title?: string;
  subtitle?: string;
  badge?: string;
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
          if (onOpenConsultation) {
            onOpenConsultation();
          } else if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('open-consultation-modal'));
          }
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
    <div className="space-y-0 font-sans">
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
    case 'hero_home':
    case 'hero_split_form':
      return <HeroHomeSection section={section} onOpenConsultation={onOpenConsultation} />;
    case 'hero_banner':
    case 'hero':
      return <HeroBannerSection section={section} onOpenConsultation={onOpenConsultation} />;
    case 'hero_slider':
    case 'full_width_hero':
      return <HeroSliderSection section={section} onOpenConsultation={onOpenConsultation} />;
    case 'trust_counters':
    case 'stats':
      return <TrustCountersSection section={section} />;
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
    case 'custom_editor':
      return <CustomEditorSection section={section} />;
    case 'trust_strip':
      return <TrustStripBuilderSection section={section} />;
    case 'cta_banner':
    case 'cta':
      return <CtaBannerSection section={section} onOpenConsultation={onOpenConsultation} />;
    case 'custom_html':
    case 'html':
      return <CustomHtmlSection section={section} />;

    case 'all_blogs_filter':
    case 'all_blogs':
      return <AllBlogsFilterSection section={section} />;
    case 'latest_blog_slider':
    case 'latest_blogs_slider':
    case 'blog_slider':
      return <LatestBlogSliderSection section={section} />;
    case 'contact_with_form':
    case 'contact_form':
    case 'contact_info_form':
      return <ContactWithFormSection section={section} />;
    case 'design_catalog':
    case 'catalog_grid':
    case 'explore_designs':
      return <DesignCatalogSection section={section} />;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* 0. HERO HOME — SPLIT LAYOUT WITH BACKGROUND IMAGE + CONSULTATION FORM     */
/*    Driven fully by Admin Page Builder (hero_home / hero_split_form type)  */
/* -------------------------------------------------------------------------- */
function HeroHomeSection({
  section,
  onOpenConsultation,
}: {
  section: PageSectionData;
  onOpenConsultation?: () => void;
}) {
  const d = section.data || {};
  const eyebrow = (section as any).badge || d.badge || 'Archovex Infra · Interior design and execution';
  const h1 = section.title || d.title || 'Interior Designers in Delhi NCR for Homes and Offices';
  const copy = section.subtitle || d.subtitle || 'Archovex Infra is a team of interior designers in Delhi NCR who plan, design and build interiors for homes and workplaces. We work across Noida, Greater Noida, Delhi, New Delhi and Gurgaon. One team takes your project from the first measurement to the final handover, so you are not left managing carpenters, electricians and painters on your own.';
  const primaryCtaText = (section as any).cta_text || d.cta_text || 'Get Free Consultation';
  const primaryCtaIsConsultation = !((section as any).cta_link || d.cta_link) || ((section as any).cta_link || d.cta_link || '').includes('#consultation');
  const primaryCtaLink = (section as any).cta_link || d.cta_link || '#consultation';
  const whatsappNumber = (section as any).whatsapp_number || d.whatsapp_number || '';

  // Background image from admin. Fallback to a premium NCR living room shot.
  const rawBg = (section as any).bg_image || d.bg_image || d.background_image;
  const bgImage = rawBg
    ? getImageUrl(rawBg)
    : 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80';

  // Inline consultation form state
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', requirement: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/consultation', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        requirement: formData.requirement,
      });
      if (res.data?.success) {
        setSubmitted(true);
      } else {
        setError(res.data?.message || 'Failed to submit enquiry.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerModal = () => {
    if (onOpenConsultation) onOpenConsultation();
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('open-consultation-modal'));
  };

  return (
    <section id="hero" className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden py-10 lg:py-16 text-white">
      {/* FULL-BLEED BACKGROUND PHOTO */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={h1}
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-black/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT: H1, EYEBROW, COPY, CTAs */}
          <div className="lg:col-span-7 space-y-5 pt-1 lg:pt-3">
            {/* Eyebrow — from admin badge field */}
            {eyebrow && (
              <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>{eyebrow}</span>
              </div>
            )}

            {/* H1 — Batch A: "Interior Designers in Delhi NCR for Homes and Offices" */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-[54px] font-serif font-black tracking-tight text-white leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {h1.includes('Delhi NCR') ? (
                <>
                  {h1.split('Delhi NCR')[0]}
                  <span className="text-amber-400">Delhi NCR</span>
                  {h1.split('Delhi NCR')[1]}
                </>
              ) : h1}
            </h1>

            {/* Copy paragraph — from admin subtitle field */}
            {copy && (
              <p className="text-sm sm:text-base lg:text-lg font-sans font-normal text-slate-100 tracking-normal leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                {copy}
              </p>
            )}

            {/* Trust highlights strip */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
              <div className="bg-black/35 backdrop-blur-sm border border-white/15 rounded-xl p-2.5 text-center shadow-md">
                <span className="block text-amber-400 font-extrabold text-sm sm:text-base font-serif">10-Year</span>
                <span className="text-[11px] text-slate-200 font-medium">Warranty</span>
              </div>
              <div className="bg-black/35 backdrop-blur-sm border border-white/15 rounded-xl p-2.5 text-center shadow-md">
                <span className="block text-amber-400 font-extrabold text-sm sm:text-base font-serif">45-Day</span>
                <span className="text-[11px] text-slate-200 font-medium">Handover</span>
              </div>
              <div className="bg-black/35 backdrop-blur-sm border border-white/15 rounded-xl p-2.5 text-center shadow-md">
                <span className="block text-amber-400 font-extrabold text-sm sm:text-base font-serif">5 Cities</span>
                <span className="text-[11px] text-slate-200 font-medium">Delhi NCR</span>
              </div>
            </div>

            {/* CTAs: Get Free Consultation + Chat on WhatsApp */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {primaryCtaIsConsultation ? (
                <button
                  type="button"
                  onClick={triggerModal}
                  className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-amber-500/20 cursor-pointer"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href={primaryCtaLink}
                  className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-amber-500/20"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* RIGHT: CONSULTATION FORM CARD */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-slate-100 relative">
              <div className="space-y-1 mb-5 text-center sm:text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EA580C] bg-orange-50 border border-orange-200 px-3 py-0.5 rounded-full inline-block">
                  TALK TO A DESIGNER
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#082F49]">
                  Book Free Consultation
                </h2>
                <p className="text-xs text-slate-600 font-medium">Get free 3D design renders &amp; custom budget estimate.</p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-emerald-950">Consultation Requested!</h3>
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    Thank you! Our design expert will contact you shortly to share 3D renders and cost estimates.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', email: '', address: '', requirement: '' }); }}
                    className="text-xs font-bold text-emerald-900 underline pt-2 cursor-pointer uppercase tracking-wider"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 font-sans">
                  {error && (
                    <div className="p-2.5 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">YOUR NAME *</label>
                      <input
                        type="text" required placeholder="Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">MOBILE NUMBER *</label>
                      <input
                        type="tel" required placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">EMAIL ADDRESS</label>
                      <input
                        type="email" placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">YOUR CITY</label>
                      <input
                        type="text" placeholder="e.g. Noida, Sec 62"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">REQUIREMENT DETAILS</label>
                    <textarea
                      rows={2} placeholder="e.g. 3BHK full interior, modular kitchen, sliding wardrobes..."
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-orange-500/20 disabled:opacity-50 mt-1"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : (
                      <><span>BOOK FREE CONSULTATION</span><ArrowRight className="w-4 h-4 text-white" /></>
                    )}
                  </button>
                  <div className="text-[11px] font-bold text-slate-500 text-center flex items-center justify-center gap-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>No Spam Guarantee • 100% Free Consultation</span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. HERO BANNER (LIGHT THEME)                                               */
/* -------------------------------------------------------------------------- */
function HeroBannerSection({ 
  section, 
  onOpenConsultation 
}: { 
  section: PageSectionData; 
  onOpenConsultation?: () => void; 
}) {
  const d = section.data || {};
  const title = section.title !== undefined ? section.title : (d.title || '');
  const subtitle = section.subtitle !== undefined ? section.subtitle : (d.subtitle || '');
  const badge = (section as any).badge !== undefined ? (section as any).badge : (d.badge || '');
  
  const rawCtaText = (section as any).cta_text !== undefined ? (section as any).cta_text : d.cta_text;
  const ctaText = rawCtaText !== undefined ? rawCtaText : '';
  const ctaLink = (section as any).cta_link || d.cta_link || '#consultation';

  const rawSecondaryText = (section as any).secondary_cta_text !== undefined ? (section as any).secondary_cta_text : d.secondary_cta_text;
  const secondaryCtaText = rawSecondaryText !== undefined ? rawSecondaryText : '';
  const secondaryCtaLink = (section as any).secondary_cta_link || d.secondary_cta_link || '';

  const rawBg = (section as any).bg_image || d.bg_image || d.background_image;
  const bgImage = rawBg ? getImageUrl(rawBg) : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';

  const isPrimaryConsultation = !ctaLink || ctaLink.includes('#consultation');
  const isSecondaryConsultation = secondaryCtaLink && secondaryCtaLink.includes('#consultation');

  const showPrimaryButton = Boolean(ctaText && ctaText.trim());
  const showSecondaryButton = Boolean(secondaryCtaText && secondaryCtaText.trim());

  const triggerConsultationModal = () => {
    if (onOpenConsultation) onOpenConsultation();
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('open-consultation-modal'));
  };

  return (
    <section className="relative bg-gradient-to-b from-[#FAFAFA] via-amber-50/20 to-[#FAFAFA] text-slate-900 py-14 lg:py-20 border-b border-slate-200/80 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            {badge && badge.trim() ? (
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-[#EA580C] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                <span>{badge}</span>
              </div>
            ) : null}

            {title && title.trim() ? (
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {title}
              </h1>
            ) : null}

            {subtitle && subtitle.trim() ? (
              <p className="text-base text-slate-600 font-normal leading-relaxed">
                {subtitle}
              </p>
            ) : null}

            {(showPrimaryButton || showSecondaryButton) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                {showPrimaryButton && (
                  isPrimaryConsultation ? (
                    <button
                      type="button"
                      onClick={triggerConsultationModal}
                      className="px-8 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/20 cursor-pointer"
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href={ctaLink}
                      className="px-8 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/20"
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )
                )}

                {showSecondaryButton && (
                  isSecondaryConsultation ? (
                    <button
                      type="button"
                      onClick={triggerConsultationModal}
                      className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-md"
                    >
                      {secondaryCtaText}
                    </button>
                  ) : (
                    <Link
                      href={secondaryCtaLink || '/blogs'}
                      className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center shadow-md"
                    >
                      {secondaryCtaText}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <Image
                src={bgImage}
                alt={title || 'Hero Banner'}
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
/* 2. TRUST COUNTERS (LIGHT THEME)                                            */
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
        { label: 'Homes Delivered', value: '1,200+' },
        { label: 'Design Warranty', value: '10 Years' },
        { label: 'Handover Guarantee', value: '45 Days' },
        { label: 'Customer Rating', value: '4.9 ★' },
      ];

  return (
    <section className="py-16 bg-[#FAFAFA] border-b border-slate-200/90 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {title && (
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight mb-10">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:border-[#EA580C]/40 transition-all">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[#EA580C] tracking-tight">
                {item.value}
              </p>
              <p className="text-xs font-bold text-slate-700 tracking-wider mt-2">
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
/* 4. DESIGN POSTS (LIGHT THEME)                                              */
/* -------------------------------------------------------------------------- */
function DesignPostsSection({ section }: { section: PageSectionData }) {
  const [designs, setDesigns] = useState<any[]>([]);
  const d = section.data || {};
  const title = section.title || d.title || 'Featured Interior Designs';
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
    <section className="py-16 bg-[#FAFAFA] border-b border-slate-200/90 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-normal">Handcrafted luxury interior designs for modern homes</p>
          </div>
          <Link href="/designs" className="text-xs font-bold text-[#EA580C] hover:text-[#C2410C] tracking-wider flex items-center gap-1">
            <span>See All Designs</span>
            <ArrowRight className="w-4 h-4 text-[#EA580C]" />
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
                href={`/blogs/${catSlug}/${design.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#EA580C]/40 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <Image
                    src={getImageUrl(primaryImg)}
                    alt={design.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {design.category && (
                    <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider shadow-2xs">
                      {design.category.name}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-serif font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors line-clamp-2">
                      {design.title}
                    </h3>
                    {design.price_range && (
                      <p className="text-xs font-semibold text-slate-500 mt-1">Est. {design.price_range}</p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors">
                    <span>Explore Project</span>
                    <ArrowRight className="w-4 h-4 text-[#EA580C] group-hover:translate-x-1 transition-transform" />
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
/* 5. PROCESS WORKFLOW (LIGHT THEME)                                          */
/* -------------------------------------------------------------------------- */
function ProcessWorkflowSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title || d.title || 'Our 4-Step Streamlined Process';
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
    <section className="py-16 lg:py-20 bg-[#FAFAFA] text-slate-900 border-b border-slate-200/90 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-600 font-normal">From concept to reality with zero delays and complete transparency</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:border-[#EA580C]/40 transition-all flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-white tracking-wider bg-[#EA580C] px-3 py-1 rounded-full inline-block mb-4 shadow-2xs">
                  Step 0{idx + 1}
                </span>
                <h3 className="text-base font-serif font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc || step.description}
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
/* 6. TESTIMONIALS (REDESIGNED LUXURY INTERACTIVE SLIDER)                     */
/* -------------------------------------------------------------------------- */
const DEFAULT_TESTIMONIALS = [
  {
    name: 'Rohit & Megha Malhotra',
    role: 'DLF Phase 5, Gurgaon',
    project: '4BHK Luxury Turnkey Residence',
    tagline: 'Delivered 4 days ahead of schedule with zero price surprises.',
    quote: 'We were nervous about interior renovations because friends had warned us about hidden costs and endless delays. Archovex gave us a detailed line-item BOQ during the 3D design phase and stuck to it to the last rupee. The factory-finished wardrobes and fluted acoustic panelling in our master bedroom exceeded our expectations. Our site supervisor, Ankit, sent daily WhatsApp logs without us ever having to chase him.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    metrics: '45-Day Handover · 10-Yr Warranty · ₹26.8 Lakh Project',
    tag: 'Turnkey 4BHK'
  },
  {
    name: 'Vikramaditya Sengupta',
    role: 'Sector 78, Noida',
    project: 'Parallel Modular Island Kitchen & Dining',
    tagline: 'Ergonomics and German hardware that makes daily cooking a joy.',
    quote: 'Our kitchen layout had an awkward civil column that two other interior firms failed to address properly. Archovex designed custom pull-outs with Hafele soft-close tandem boxes and an integrated quartz breakfast island. The boiling-water-proof (BWP) marine plywood quality and precision acrylic edge-banding are immaculate. Three months in, and every drawer still glides silently like day one.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    metrics: '28-Day Installation · Hafele Soft-Close Hardware · Anti-Bacterial Quartz',
    tag: 'Modular Kitchen'
  },
  {
    name: 'Sunita & Rajiv Chawla',
    role: 'Greater Kailash II, South Delhi',
    project: 'Complete 3BHK Turnkey Interior',
    tagline: 'Flawless turnkey execution while we were travelling abroad.',
    quote: 'Since we live between London and Delhi, remote transparency was our top priority. Archovex executed civil restructuring, electrical rewiring, Italian marble polishing, custom PU wardrobes, and false ceilings seamlessly. Weekly 3D milestone reviews and a single point-of-contact gave us complete peace of mind. We walked into a sparkling, ready-to-move-in home without a single speck of construction dust.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    metrics: '55-Day Handover · Turnkey Execution · Dedicated Site Lead',
    tag: 'Turnkey 3BHK'
  },
  {
    name: 'Kunal Bhasin',
    role: 'Sector 135, Noida Expressway',
    project: '4,800 sq.ft Commercial Office Interior',
    tagline: 'Ergonomic, modern commercial workplace delivered strictly on deadline.',
    quote: 'Fitting out a commercial office space on a tight corporate launch timeline is stressful. Archovex took full charge of HVAC integration, acoustic baffle ceilings, glass partition meeting rooms, and ergonomic workstation clusters. They completed all inspections and handed over the space 3 days before our lease commencement date, saving us substantial rent overlap.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    metrics: '38-Day Turnaround · 42 Workstations & 3 Boardrooms · Fire & HVAC Certified',
    tag: 'Commercial Workspace'
  },
  {
    name: 'Pooja & Amit Aggarwal',
    role: 'Punjabi Bagh West, Delhi',
    project: 'Living & Dining Room Redesign',
    tagline: 'Transformed our traditional home into a warm, contemporary haven.',
    quote: 'Our formal living room felt outdated and poorly lit. Archovex recommended a stunning veneer panel accent wall with concealed warm LED cove lighting, floating stone console, and custom bouclé seating. Guests constantly ask which interior firm designed our space. Their attention to subtle design proportions and lighting warmth made all the difference.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    metrics: '21-Day Room Transformation · Architectural Lighting · Custom Millwork',
    tag: 'Living & Dining'
  }
];

function TestimonialsSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title || d.title || 'What Our Clients Say';
  const subtitle = section.subtitle || d.subtitle || 'Real stories, verified reviews and delivered spaces from homeowners and businesses across Delhi NCR.';
  const badge = (section as any).badge || d.badge || 'Client Stories & Reviews';

  const rawItems = (section as any).items || d.items;
  const items = Array.isArray(rawItems) && rawItems.length > 0 
    ? rawItems.map((item: any, i: number) => ({
        name: item.name || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].name,
        role: item.role || item.location || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].role,
        project: item.project || item.projectType || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].project,
        tagline: item.tagline || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].tagline,
        quote: item.quote || item.review || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].quote,
        rating: item.rating || 5,
        image: item.image || item.photo || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].image,
        metrics: item.metrics || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].metrics,
        tag: item.tag || DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].tag
      }))
    : DEFAULT_TESTIMONIALS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Auto-advance slider every 6 seconds if not hovered
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const active = items[currentIndex] || items[0];

  return (
    <section 
      className="py-16 sm:py-24 bg-[#FAF8F3] border-b border-stone-200/80 font-sans relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative architectural background ambient shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (Simple & Left Aligned) */}
        <div className="text-left mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Featured Showcase Slider Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left: Project Image (Clean, No Overlays) */}
            <div className="lg:col-span-5 relative bg-slate-100 min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] overflow-hidden group">
              <img
                src={active.image}
                alt={active.name || 'Client Project'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Right: Testimonial Details (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white relative">
              
              <div>
                {/* Top Row: Quote Icon */}
                <div className="flex justify-end mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100 flex-shrink-0">
                    <Quote className="w-5 h-5 rotate-180 text-[#EA580C]" />
                  </div>
                </div>

                {/* Testimonial Quote Content */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  "{active.quote}"
                </p>
              </div>

              {/* Footer Row: Client Identity & Slider Controls */}
              <div className="pt-6 mt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                {/* Client Profile with Rating */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-serif font-bold text-base flex items-center justify-center border-2 border-[#EA580C] shadow-sm flex-shrink-0">
                    {active.name ? active.name.charAt(0) : 'A'}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {active.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {active.role}
                    </p>
                    {/* 5-Star Rating placed at bottom with client profile */}
                    <div className="flex items-center gap-1 text-[#EA580C] mt-1.5">
                      {[...Array(active.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#EA580C]" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation Controls: Prev / Counter / Next */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs font-semibold text-slate-400 tracking-wider">
                    <span className="text-slate-900 font-bold">0{currentIndex + 1}</span> / 0{items.length}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous testimonial"
                      className="w-10 h-10 rounded-full border border-stone-200 bg-white text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next testimonial"
                      className="w-10 h-10 rounded-full border border-stone-200 bg-white text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Slider Indicator Dots */}
        {items.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex 
                    ? 'w-8 h-2 bg-[#EA580C]' 
                    : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. FAQ ACCORDION (LIGHT THEME)                                             */
/* -------------------------------------------------------------------------- */
function FaqAccordionSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title || d.title || 'Frequently Asked Questions';
  const rawFaqs = (section as any).items || d.faqs || d.items;
  const faqs = Array.isArray(rawFaqs) && rawFaqs.length > 0 ? rawFaqs : [
    { question: 'What is included in the 10-year warranty?', answer: 'Our 10-year warranty covers modular cabinets, German hardware fittings, structural defects, and material degradation under normal usage.' },
    { question: 'How long does a full home interior project take?', answer: 'Our standard completion timeline is 45 days from design approval and site readiness.' },
    { question: 'Is 3D design rendering free?', answer: 'Yes, initial 3D design concept rendering is included free of cost during consultation.' },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-[#FAFAFA] border-b border-slate-200/90 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq: any, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 font-bold text-slate-900 text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#EA580C]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
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
/* 8. RICH TEXT SECTION (LIGHT THEME)                                        */
/* -------------------------------------------------------------------------- */
function RichTextSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const heading = section.title || d.heading || d.title || '';
  const content = (section as any).content || d.content || '';

  return (
    <section className="py-16 bg-white border-b border-slate-200/90 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {heading && (
          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight mb-6">
            {heading}
          </h2>
        )}
        <div 
          className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 8A-2. TRUST STRIP SECTION (PAGE BUILDER DRIVEN)                            */
/* -------------------------------------------------------------------------- */
const TRUST_STRIP_ICONS: Record<string, React.ReactNode> = {
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  ),
  blueprint: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="9" x2="9" y2="21" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l8 3.5v5C20 15.5 16.5 20 12 22c-4.5-2-8-6.5-8-11.5v-5L12 2z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2C8.69 2 6 4.69 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.31-2.69-6-6-6z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14.5 15 10" />
    </svg>
  ),
};

function TrustStripBuilderSection({ section }: { section: PageSectionData }) {
  const items: any[] = Array.isArray((section as any).items) ? (section as any).items : [];
  if (items.length === 0) return null;

  return (
    <section
      aria-label="Trust indicators"
      className="w-full bg-[#1E293B] border-t border-b border-[#0F172A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap items-center justify-center gap-0 divide-x divide-white/10">
          {items.map((item: any, i: number) => {
            const iconKey = item.icon || 'check';
            const iconEl = TRUST_STRIP_ICONS[iconKey] || TRUST_STRIP_ICONS['check'];
            return (
              <li
                key={i}
                className="flex items-center gap-2.5 px-5 py-4 sm:px-8 sm:py-5 group"
              >
                <span className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-[#F97316] transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
                  {iconEl}
                </span>
                <span className="text-white/85 text-sm sm:text-[0.9rem] font-medium tracking-wide whitespace-nowrap group-hover:text-white transition-colors duration-200">
                  {item.text}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8B. CUSTOM EDITOR SECTION (LIGHT THEME)                                   */
/* -------------------------------------------------------------------------- */
function CustomEditorSection({ section }: { section: PageSectionData }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const d = section.data || {};
  const content = (section as any).content || d.content || (section as any).custom_html || d.custom_html || (section as any).html_code || '';

  const rawTitle = section.title || d.title || '';
  const isDefaultTitle =
    rawTitle === 'Custom Editor Section' || rawTitle === 'Custom Content Section';
  const title = !isDefaultTitle ? rawTitle : '';

  const rawSubtitle = section.subtitle || d.subtitle || '';
  const isDefaultSubtitle =
    rawSubtitle === 'Bespoke rich content formatted with visual editor';
  const subtitle = !isDefaultSubtitle ? rawSubtitle : '';

  const badge = (section as any).badge || d.badge || '';

  React.useEffect(() => {
    if (!containerRef.current) return;

    // 1. Re-execute script tags from dangerouslySetInnerHTML
    const scripts = containerRef.current.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    // 2. Native interactive tab delegation for city tabs
    const handleTabClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-ncr-tab]');
      if (!target || !containerRef.current) return;
      const cityKey = target.getAttribute('data-ncr-tab');
      if (!cityKey) return;

      const cities = ['noida', 'greater-noida', 'delhi', 'new-delhi', 'gurgaon'];
      cities.forEach((c) => {
        const isSel = c === cityKey;

        const tabEl = containerRef.current?.querySelector(`[data-ncr-tab="${c}"]`) as HTMLElement;
        const descEl = containerRef.current?.querySelector(`#tab-desc-${c}`) as HTMLElement;
        const linkEl = containerRef.current?.querySelector(`#tab-link-${c}`) as HTMLElement;
        const pinEl = containerRef.current?.querySelector(`#pin-city-${c}`) as HTMLElement;
        const spotEl = containerRef.current?.querySelector(`#spot-city-${c}`) as HTMLElement;

        const mapIframe = containerRef.current?.querySelector('#google-map-iframe') as HTMLIFrameElement;
        const mapUrls: Record<string, string> = {
          'noida': 'https://maps.google.com/maps?q=Noida,+Uttar+Pradesh&t=&z=12&ie=UTF8&iwloc=&output=embed',
          'greater-noida': 'https://maps.google.com/maps?q=Greater+Noida,+Uttar+Pradesh&t=&z=12&ie=UTF8&iwloc=&output=embed',
          'delhi': 'https://maps.google.com/maps?q=Delhi,+India&t=&z=11&ie=UTF8&iwloc=&output=embed',
          'new-delhi': 'https://maps.google.com/maps?q=New+Delhi,+Delhi&t=&z=12&ie=UTF8&iwloc=&output=embed',
          'gurgaon': 'https://maps.google.com/maps?q=Gurugram,+Haryana&t=&z=12&ie=UTF8&iwloc=&output=embed',
        };

        if (mapIframe && mapUrls[cityKey]) {
          mapIframe.src = mapUrls[cityKey];
        }

        if (tabEl) {
          if (isSel) {
            tabEl.classList.add('border-[#EA580C]', 'bg-orange-50/70', 'shadow-sm');
            tabEl.classList.remove('border-slate-200/90', 'bg-white');
            const dot = tabEl.querySelector('.tab-city-dot') as HTMLElement;
            if (dot) {
              dot.className = 'tab-city-dot w-3 h-3 rounded-full bg-[#EA580C] ring-4 ring-orange-200';
            }
          } else {
            tabEl.classList.remove('border-[#EA580C]', 'bg-orange-50/70', 'shadow-sm');
            tabEl.classList.add('border-slate-200/90', 'bg-white');
            const dot = tabEl.querySelector('.tab-city-dot') as HTMLElement;
            if (dot) {
              dot.className =
                'tab-city-dot w-2.5 h-2.5 rounded-full bg-slate-400 group-hover:bg-[#EA580C] transition-colors';
            }
          }
        }
        // Keep all descriptions and links visible!
        if (descEl) descEl.style.display = 'block';
        if (linkEl) linkEl.style.display = 'inline-flex';
        if (spotEl) spotEl.style.display = isSel ? 'block' : 'none';

        if (pinEl) {
          const pulse = pinEl.querySelector('.pin-pulse-dot') as HTMLElement;
          const svgPin = pinEl.querySelector('.pin-svg') as SVGElement;
          const badge = pinEl.querySelector('.pin-label-badge') as HTMLElement;
          if (isSel) {
            pinEl.style.zIndex = '50';
            pinEl.style.transform = 'translate(-50%, -100%) scale(1.22)';
            if (pulse) pulse.style.display = 'block';
            if (svgPin) {
              svgPin.style.color = '#EA580C';
              svgPin.style.fill = '#EA580C';
              svgPin.style.filter = 'drop-shadow(0 6px 12px rgba(234, 88, 12, 0.6))';
            }
            if (badge) {
              badge.style.backgroundColor = '#EA580C';
              badge.style.color = '#FFFFFF';
              badge.style.borderColor = '#FFFFFF';
              badge.style.boxShadow = '0 4px 16px rgba(234, 88, 12, 0.7)';
            }
          } else {
            pinEl.style.zIndex = '20';
            pinEl.style.transform = 'translate(-50%, -100%) scale(1)';
            if (pulse) pulse.style.display = 'none';
            if (svgPin) {
              svgPin.style.color = '#1E293B';
              svgPin.style.fill = '#1E293B';
              svgPin.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))';
            }
            if (badge) {
              badge.style.backgroundColor = '#1E293B';
              badge.style.color = '#FFFFFF';
              badge.style.borderColor = '#475569';
              badge.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            }
          }
        }
      });
    };

    const el = containerRef.current;
    el.addEventListener('click', handleTabClick);

    const handleFormSubmit = (e: Event) => {
      const form = (e.target as HTMLElement)?.closest('form#final-cta-split-form') as HTMLFormElement | null;
      if (!form) return;
      e.preventDefault();
      
      const btn = form.querySelector('#cta-split-btn') as HTMLButtonElement | null;
      const successBox = form.querySelector('#cta-split-success') as HTMLElement | null;
      const nameEl = form.querySelector('#cta-split-name') as HTMLInputElement | null;
      const phoneEl = form.querySelector('#cta-split-phone') as HTMLInputElement | null;
      const cityEl = form.querySelector('#cta-split-city') as HTMLInputElement | null;
      const propEl = form.querySelector('#cta-split-prop') as HTMLInputElement | null;
      const budgetEl = form.querySelector('#cta-split-budget') as HTMLInputElement | null;

      const name = nameEl?.value || '';
      const phone = phoneEl?.value || '';
      const city = cityEl?.value || '';
      const prop = propEl?.value || '';
      const budget = budgetEl?.value || '';

      if (btn) {
        btn.disabled = true;
        btn.innerText = 'Submitting...';
      }

      fetch('/api/v1/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          address: city,
          property_type: prop,
          budget: budget,
          requirement: 'Home Page CTA: ' + prop + ' in ' + city + ' (' + budget + ')'
        })
      })
      .then((res) => res.json())
      .then(() => {
        if (btn) btn.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
      })
      .catch(() => {
        if (btn) btn.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
      });
    };

    el.addEventListener('submit', handleFormSubmit);

    return () => {
      el.removeEventListener('click', handleTabClick);
      el.removeEventListener('submit', handleFormSubmit);
    };
  }, [content]);

  if (!content && !title) return null;

  // If the editor HTML already includes its own <section> wrapper, render it directly without extra container padding
  const isSelfContained = /<section[\s>]/i.test(content);

  if (isSelfContained) {
    return (
      <div
        ref={containerRef}
        className="w-full font-sans"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100 last:border-b-0 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(badge || title || subtitle) && (
          <div className="max-w-3xl mb-10 text-left">
            {badge && (
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#EA580C] border border-orange-200/60 mb-3">
                {badge}
              </span>
            )}
            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {content && (
          <div 
            className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed font-sans prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-[#EA580C] hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 9. CTA BANNER (LIGHT THEME)                                               */
/* -------------------------------------------------------------------------- */
function CtaBannerSection({ 
  section, 
  onOpenConsultation 
}: { 
  section: PageSectionData; 
  onOpenConsultation?: () => void; 
}) {
  const d = section.data || {};
  const title = section.title || d.title || 'Ready to Transform Your Living Space?';
  const description = section.subtitle || d.description || d.subtitle || 'Book a free consultation with our senior interior architects today.';
  const btnText = (section as any).cta_text || d.button_text || d.cta_text || 'Book Free Consultation';
  const btnLink = (section as any).cta_link || d.button_link || d.cta_link || '';
  const isConsultation = !btnLink || btnLink.includes('#consultation');

  const triggerConsultation = () => {
    if (onOpenConsultation) onOpenConsultation();
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('open-consultation-modal'));
  };

  return (
    <section className="py-16 bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 text-slate-900 border-y border-amber-200/80 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal">
            {description}
          </p>
        )}
        <div className="pt-2">
          {isConsultation ? (
            <button
              type="button"
              onClick={triggerConsultation}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs tracking-wider rounded-xl transition-all shadow-md border border-amber-500/20 cursor-pointer"
            >
              <span>{btnText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href={btnLink}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs tracking-wider rounded-xl transition-all shadow-md border border-amber-500/20"
            >
              <span>{btnText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
    <section className="py-12 bg-[#FAFAFA] border-b border-slate-200/90 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight mb-8 text-center">
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
          title: section.title || 'Luxury Turnkey Interiors & Architecture',
          subtitle: section.subtitle || 'Bespoke modular kitchens, living room spaces, and custom wardrobes with German hardware & 10-year warranty.',
          bg_image: (section as any).bg_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
          cta_text: (section as any).cta_text || 'Book Free Consultation',
          cta_link: (section as any).cta_link || '',
          badge: (section as any).badge || 'Archovex Luxury Homes',
        },
        {
          title: 'Crafted in Automated German Factories',
          subtitle: 'Sub-millimeter precision woodworking with Boiling Water Resistant (BWR) plywood and 45-day guaranteed handover.',
          bg_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80',
          cta_text: 'Explore Designs',
          cta_link: '/designs',
          badge: '45-Day Handover Guarantee',
        },
        {
          title: 'Photorealistic 3D Design Renders',
          subtitle: 'Visualize your entire home in 3D before execution begins with complete line-item price transparency.',
          bg_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
          cta_text: 'See Recent Projects',
          cta_link: '/designs',
          badge: '10-Year Warranty',
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
    <section className="relative w-full min-h-[580px] lg:min-h-[700px] flex items-center bg-slate-950 overflow-hidden group font-sans">
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
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

            <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-20">
              <div className="max-w-2xl space-y-6 text-white animate-fade-in">
                {(slide.badge || slide.tagline) && (
                  <div className="inline-flex items-center gap-2 bg-[#EA580C] text-white px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>{slide.badge || slide.tagline}</span>
                  </div>
                )}

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
                  {slide.title || 'Design Your Dream Home'}
                </h1>

                {slide.subtitle && (
                  <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-xl text-shadow">
                    {slide.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {(() => {
                    const rawPrimary = slide.cta_text !== undefined ? slide.cta_text : (section as any).cta_text;
                    const primaryText = rawPrimary !== undefined ? rawPrimary : 'Book Free Consultation';
                    const primaryLink = slide.cta_link || (section as any).cta_link || '#consultation';
                    const showPrimary = Boolean(primaryText && primaryText.trim());
                    const isPrimaryConsultation = !primaryLink || primaryLink.includes('#consultation');

                    if (!showPrimary) return null;

                    return isPrimaryConsultation ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenConsultation) onOpenConsultation();
                          if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('open-consultation-modal'));
                        }}
                        className="px-8 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 border border-amber-500/20 cursor-pointer"
                      >
                        <span>{primaryText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <Link
                        href={primaryLink}
                        className="px-8 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 border border-amber-500/20"
                      >
                        <span>{primaryText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    );
                  })()}

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
                        onClick={() => {
                          if (onOpenConsultation) onOpenConsultation();
                          if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('open-consultation-modal'));
                        }}
                        className="px-8 py-3.5 bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/30 backdrop-blur-md font-bold text-xs tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>{secondaryText}</span>
                      </button>
                    ) : (
                      <Link
                        href={secondaryLink}
                        className="px-8 py-3.5 bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/30 backdrop-blur-md font-bold text-xs tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-md"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3.5 bg-slate-900/80 hover:bg-[#EA580C] text-white rounded-full border border-white/20 backdrop-blur-md transition-all shadow-xl opacity-80 hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3.5 bg-slate-900/80 hover:bg-[#EA580C] text-white rounded-full border border-white/20 backdrop-blur-md transition-all shadow-xl opacity-80 hover:opacity-100 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            {slides.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-[#EA580C] shadow-xs' : 'w-2.5 bg-white/50 hover:bg-white/90'
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
/* 13. ALL BLOGS WITH FILTER (LIGHT THEME)                                   */
/* -------------------------------------------------------------------------- */
function AllBlogsFilterSection({ section }: { section: PageSectionData }) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [allWishlistBlogs, setAllWishlistBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistMode, setWishlistMode] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

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

  useEffect(() => {
    apiClient.get('/categories')
      .then((res) => {
        if (res.data?.success) setCategories(res.data.data || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (wishlistIds.length > 0 || wishlistMode) {
      const idsParam = wishlistIds.join(',');
      const url = idsParam ? `/blogs?ids=${idsParam}&limit=1000` : '/blogs?limit=1000';
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

  const fetchBlogs = async (filters: Record<string, string> = {}, pageNum = page) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: String(pageNum),
        limit: '8',
      }).toString();

      const res = await apiClient.get(`/blogs?${queryParams}`);
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
    <section className="py-12 bg-[#FAFAFA] border-b border-slate-200/90 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Mode Switcher Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleWishlistToggle(false)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider flex items-center gap-2 transition-all ${
                !wishlistMode
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>All Blogs</span>
            </button>

            <button
              type="button"
              onClick={() => handleWishlistToggle(true)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider flex items-center gap-2 transition-all ${
                wishlistMode
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlistMode ? 'fill-current' : ''}`} />
              <span>My Wishlist ({wishlistIds.length})</span>
            </button>
          </div>
        </div>



        {/* 4-Column Grid */}
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
          <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-4 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click the heart icon on any design or blog post card to save your favorite concepts here.
            </p>
            <button
              type="button"
              onClick={() => handleWishlistToggle(false)}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs tracking-wider rounded-xl hover:bg-slate-800 transition-all inline-block shadow-md"
            >
              Explore All Blogs
            </button>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/90 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-slate-900">No posts found</h3>
            <p className="text-xs text-slate-500">Try broadening your filter options.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {!wishlistMode && pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1 font-bold text-xs"
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
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1 font-bold text-xs"
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
/* 14. EXPLORE DESIGNS HERO BANNER SECTION (LIGHT THEME)                     */
/* -------------------------------------------------------------------------- */
function DesignCatalogSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title || d.title || 'Explore Interior Designs';
  const subtitle = section.subtitle || d.subtitle || 'Discover bespoke designs categorized by room, layout, style, and city.';
  const badge = section.badge || d.badge || 'Complete Interior Catalog';

  return (
    <section className="bg-gradient-to-b from-[#FAFAFA] via-[#F6F4EF] to-[#FAFAFA] text-slate-900 py-14 sm:py-18 border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
        {badge && (
          <span className="text-[11px] font-bold tracking-wider text-[#EA580C] bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full inline-block shadow-2xs">
            {badge}
          </span>
        )}
        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* LATEST BLOG SLIDER SECTION (LIGHT THEME)                                  */
/* -------------------------------------------------------------------------- */
function LatestBlogSliderSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const title = section.title !== undefined ? section.title : (d.title || 'Latest Interior Design Insights');
  const subtitle = section.subtitle !== undefined ? section.subtitle : (d.subtitle || 'Explore our newest blogs, design trends, and decor advice from expert interior architects.');
  const badge = (section as any).badge !== undefined ? (section as any).badge : (d.badge || 'Latest Blogs');

  const rawLimit = (section as any).limit !== undefined ? (section as any).limit : d.limit;
  const limit = Math.max(1, Math.min(20, Number(rawLimit) || 6));

  const showButton = (section as any).show_button !== false && d.show_button !== false;
  const buttonText = (section as any).button_text || d.button_text || 'View All Blogs';
  const buttonLink = (section as any).button_link || d.button_link || '/blogs';

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/blogs?limit=${limit}`)
      .then((res) => {
        if (res.data?.success) {
          const rawData = res.data.data;
          const items = Array.isArray(rawData?.data)
            ? rawData.data
            : Array.isArray(rawData)
            ? rawData
            : [];
          setBlogs(items.slice(0, limit));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [limit]);

  const maxIndex = Math.max(0, blogs.length - cardsPerView);

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-16 bg-[#FAFAFA] border-b border-slate-200/90 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            {badge && (
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-[#EA580C] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
                {subtitle}
              </p>
            )}
          </div>

          {blogs.length > cardsPerView && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 hover:bg-[#EA580C] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-800 transition-all cursor-pointer shadow-2xs"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 hover:bg-[#EA580C] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-800 transition-all cursor-pointer shadow-2xs"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(cardsPerView)].map((_, i) => (
              <div key={i} className="bg-slate-200 aspect-[4/3] rounded-2xl h-80" />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView + (cardsPerView > 1 ? 1.5 : 0))}%)`,
              }}
            >
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex-shrink-0"
                  style={{
                    width:
                      cardsPerView === 1
                        ? '100%'
                        : cardsPerView === 2
                        ? 'calc(50% - 0.75rem)'
                        : 'calc(33.333% - 1rem)',
                  }}
                >
                  <DesignCard post={blog} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 font-medium">
            No latest blogs found.
          </div>
        )}

        {showButton && (
          <div className="pt-4 flex justify-center">
            <Link
              href={buttonLink}
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 text-[#EA580C]" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* CONTACT INFO & CONSULTATION FORM SECTION (LIGHT THEME)                    */
/* -------------------------------------------------------------------------- */
function ContactWithFormSection({ section }: { section: PageSectionData }) {
  const d = section.data || {};
  const leftTitle = section.title || d.title || 'Corporate Headquarters';
  const rightTitle = section.subtitle || d.subtitle || 'Book Free Consultation';
  const formDesc = (section as any).badge || d.badge || 'Fill in your project requirements below to speak with an interior design architect.';

  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    apiClient.get('/home').then((res) => {
      if (res.data?.success && res.data.settings) {
        setSettings(res.data.settings);
      }
    }).catch(() => {});
  }, []);

  const address = (section as any).address || d.address || settings.address || 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001';
  const phone = (section as any).phone || d.phone || settings.phone || '+91 98765 43210';
  const email = (section as any).email || d.email || settings.email || 'contact@archovex.com';
  const whatsapp = (section as any).whatsapp || d.whatsapp || settings.whatsapp || '+91 98765 43210';

  return (
    <section className="py-16 bg-[#FAFAFA] border-b border-slate-200/90 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
            <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-3">
              {leftTitle}
            </h2>
            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#EA580C] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Address</span>
                  <span>{address}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#EA580C] flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Direct Call</span>
                  <span>{phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#EA580C] flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Email Address</span>
                  <span>{email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">WhatsApp Helpline</span>
                  <span>{whatsapp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Consultation Form Card */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
              {rightTitle}
            </h2>
            {formDesc && (
              <p className="text-xs text-slate-600 mt-1">
                {formDesc}
              </p>
            )}
          </div>
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
}
