'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Share2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { getImageUrl, apiClient } from '@/lib/api';
import { createWhatsAppConsultationUrl } from '@/lib/pageUtils';

interface BlogDetailClientProps {
  post: any;
  related?: any[];
  cities?: any[];
}

export default function BlogDetailClient({ post, related = [], cities = [] }: BlogDetailClientProps) {
  const [copied, setCopied] = useState(false);

  // Form State for Right Sidebar Lead Widget (LIGHT THEME)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    property_type: '3 BHK Home',
    city_id: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState('');
  const [formError, setFormError] = useState('');

  const imgUrl = getImageUrl(post.primary_image?.image || post.featured_image || post.image);
  const pubDate = post.published_at || post.created_at;
  const dateStr = pubDate
    ? new Date(pubDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'September 22, 2026';

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Please enter your name and phone number.');
      return;
    }
    setSubmitting(true);
    setFormError('');

    try {
      // 1. Submit enquiry to backend API -> sends email to whitegravitywebsolutions@gmail.com
      try {
        await apiClient.post('/enquiry', {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          requirement: `Property Scope: ${formData.property_type}`,
          source: `Blog Post: ${post.title}`,
          type: 'blog_consultation',
        });
      } catch (apiErr) {
        console.error('Email dispatch error (continuing to WhatsApp):', apiErr);
      }

      // 2. Open WhatsApp directly with senior architect
      const targetWhatsApp = post.whatsapp || '+919217614436';
      const waUrl = createWhatsAppConsultationUrl({
        whatsappNumber: targetWhatsApp,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        requirement: `Property Type: ${formData.property_type}`,
        sourceTitle: `Blog: ${post.title}`,
      });

      setSubmittedUrl(waUrl);
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }
      setSubmitted(true);
    } catch (err: any) {
      setFormError('Failed to prepare consultation request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Ensure maximum 3 related items for the bottom grid
  const displayedRelated = related.slice(0, 3);

  return (
    <article className="pt-4 sm:pt-6 pb-8 sm:pb-12 bg-white text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {/* 1. ARTICLE HEADER */}
        <div className="max-w-5xl space-y-5">
          {/* Main Article Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          {/* Subtitle / Excerpt */}
          {post.excerpt || post.short_description ? (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal font-sans max-w-4xl">
              {post.excerpt || post.short_description}
            </p>
          ) : null}
        </div>

        {/* 2. FEATURED HERO BANNER IMAGE */}
        {imgUrl && imgUrl !== '/placeholder.jpg' && (
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100">
            <Image
              src={imgUrl}
              alt={post.title ? `${post.title} - Archovex Infra Interior Design` : 'Archovex Infra Luxury Living'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* 3. MAIN 2-COLUMN LAYOUT: CONTENT (LEFT 8) + SIDEBAR (RIGHT 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT CONTENT COLUMN - WYSIWYG CONTENT ONLY */}
          <div className="lg:col-span-8 space-y-10">
            <div className="editor_section">
              {/* Rich HTML Content directly from Editor */}
              {(() => {
                const bodyHtml = post.content || post.description;
                if (!bodyHtml || bodyHtml.trim() === '') {
                  return (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-medium">
                      No body content published for this article yet. Use the CMS Blog Editor to add content.
                    </div>
                  );
                }
                return (
                  <div
                    className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed space-y-6 font-normal font-sans prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-p:font-sans prose-p:text-slate-600 prose-p:leading-relaxed prose-li:font-sans prose-li:text-slate-600 prose-a:text-[#EA580C] prose-a:font-semibold prose-blockquote:border-[#EA580C] prose-blockquote:bg-amber-50/50 prose-blockquote:p-6 prose-blockquote:rounded-2xl prose-strong:text-slate-900"
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                  />
                );
              })()}

              {/* Optional Multi-Image Gallery */}
              {Array.isArray(post.images) && post.images.length > 1 && (
                <div className="pt-8 space-y-4 border-t border-slate-100">
                  <h3 className="text-lg font-serif font-bold text-slate-900 tracking-tight uppercase">
                    Design Gallery
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {post.images.map((imgObj: any, idx: number) => {
                      const galleryUrl = getImageUrl(typeof imgObj === 'string' ? imgObj : imgObj.image);
                      return (
                        <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
                          <Image src={galleryUrl} alt={`${post.title} image ${idx + 1}`} fill className="object-cover" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Published Meta Bar - Displayed After Editor Content */}
              <div className="pt-6 mt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-500 font-sans">
                <div className="flex items-center gap-4 font-sans">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                    <Calendar className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>{dateStr}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                    <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>5 Min Read</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={handleShare}
                    className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 text-xs cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (STICKY): LIGHT THEME LEAD FORM */}
          <div id="consultation-sidebar" className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 font-sans">
            
            {/* LIGHT THEME LEAD CONSULTATION FORM CARD */}
            <div className="bg-[#FAF8F5] text-slate-900 p-6 sm:p-7 rounded-3xl shadow-xl border-2 border-slate-200/90 space-y-5 font-sans">
              <div className="space-y-1.5 border-b border-slate-200 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] bg-[#FFF7ED] border border-[#FFEDD5] px-3 py-1 rounded-full inline-block font-sans">
                  BOOK FREE CONSULTATION
                </span>
                <h3 className="text-xl font-serif font-bold tracking-tight text-slate-900">
                  DESIGN YOUR DREAM SPACE
                </h3>
                <p className="text-xs text-slate-600 font-normal font-sans leading-relaxed">
                  Get a personalized 3D design proposal, material specification breakdown & price estimate.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-2xl text-center space-y-3 font-sans">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <MessageCircle className="w-6 h-6 fill-current" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-950 font-serif">Consultation Request Ready!</h4>
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    We are connecting you directly with our senior interior architect on WhatsApp.
                  </p>
                  {submittedUrl && (
                    <div className="pt-1">
                      <a
                        href={submittedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>Continue to WhatsApp</span>
                      </a>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', email: '', property_type: '3 BHK Home', city_id: '' }); }}
                    className="text-xs font-bold text-emerald-900 underline pt-2 block mx-auto cursor-pointer uppercase tracking-wider hover:text-emerald-950"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold text-xs">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 font-sans">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 font-sans">
                      MOBILE NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 font-sans">
                      EMAIL ADDRESS (OPTIONAL)
                    </label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 font-sans">
                      PROPERTY SCOPE / TYPE
                    </label>
                    <select
                      value={formData.property_type}
                      onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#EA580C] transition-all shadow-2xs font-sans text-xs"
                    >
                      <option value="3 BHK Home">Full Home Interior (3 BHK)</option>
                      <option value="2 BHK Home">Full Home Interior (2 BHK)</option>
                      <option value="4+ BHK / Villa">Villa / Luxury Apartment</option>
                      <option value="Modular Kitchen">Modular Kitchen</option>
                      <option value="Custom Wardrobes">Custom Wardrobes</option>
                      <option value="Commercial Office">Commercial / Office Interior</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border border-amber-500/20 disabled:opacity-50 mt-2 cursor-pointer font-sans"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 fill-current text-white" />
                        <span>BOOK CONSULTATION ON WHATSAPP</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-slate-600 font-semibold font-sans">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>45-Day Handover</span>
                    </span>
                    <span>•</span>
                    <span>10-Yr Warranty</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4. BOTTOM RELATED ARTICLES GRID (EXACTLY 3 CARDS + VIEW ALL BUTTON) */}
        {displayedRelated.length > 0 && (
          <div className="pt-10 border-t border-slate-200/90 space-y-8 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] bg-[#FFF7ED] border border-[#FFEDD5] px-3.5 py-1 rounded-full inline-block mb-2 font-sans">
                  MORE EDITORIAL GUIDES
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                  Related Architectural Studies & Design Guides
                </h3>
              </div>

              {/* VIEW ALL BLOGS BUTTON */}
              <Link
                href="/blog"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 group shrink-0 font-sans"
              >
                <span>VIEW ALL BLOGS</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* EXACTLY 3-COLUMN GRID MATCHING /blog CARD DESIGN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedRelated.map((item: any) => {
                const relImg = getImageUrl(item.primary_image?.image || item.featured_image || item.image) || 'http://127.0.0.1:8005/storage/media/website/turnkey_interior_design_in_del_1d0bb6fa.jpg';
                const relDate = item.published_at || item.created_at;
                const relDateStr = relDate
                  ? new Date(relDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Recently Updated';

                const wordCount = (item.content || item.excerpt || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
                const calcMinutes = Math.max(3, Math.min(12, Math.ceil(wordCount / 180)));
                const readTime = `${calcMinutes} min read`;

                const catName = item.category?.name || 'Design Guide';
                let desc = item.excerpt || item.short_description || '';
                if (!desc && item.content) {
                  desc = item.content.replace(/<[^>]*>/g, ' ').slice(0, 150) + '...';
                }

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <Link
                        href={`/blog/${item.slug}`}
                        className="block relative aspect-[16/10] overflow-hidden bg-slate-900"
                      >
                        <Image
                          src={relImg}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 text-[10px] font-bold text-[#EA580C] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm uppercase tracking-wider font-sans">
                          {catName}
                        </span>
                      </Link>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium font-sans">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#EA580C]" /> {relDateStr}
                          </span>
                          <span>•</span>
                          <span>{readTime}</span>
                        </div>

                        <h4 className="text-base sm:text-lg font-serif font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors leading-snug line-clamp-2">
                          <Link href={`/blog/${item.slug}`}>
                            {item.title}
                          </Link>
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal font-sans line-clamp-3">
                          {desc || 'Explore key architectural insights and custom interior design specifications.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#EA580C] font-sans">
                      <Link
                        href={`/blog/${item.slug}`}
                        className="hover:underline flex items-center gap-1.5"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href="/contact-us"
                        className="text-[10px] text-slate-400 hover:text-[#EA580C] font-semibold uppercase font-sans"
                      >
                        Consult Expert
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
