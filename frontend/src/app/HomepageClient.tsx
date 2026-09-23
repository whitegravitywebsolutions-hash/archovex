'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/public/HeroSection';
import DesignCard from '@/components/public/DesignCard';
import DesignQuickViewModal from '@/components/public/DesignQuickViewModal';
import ConsultationFormModal from '@/components/public/ConsultationFormModal';
import FAQAccordion from '@/components/public/FAQAccordion';
import { Category, DesignPost, Service, Project, City, Testimonial, Faq, Blog } from '@/types';
import { ArrowRight, Star, MapPin, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HomepageClientProps {
  categories: Category[];
  featuredDesigns: DesignPost[];
  services: Service[];
  projects: Project[];
  cities: City[];
  testimonials: Testimonial[];
  faqs: Faq[];
  blogs: Blog[];
  settings: Record<string, any>;
}

export default function HomepageClient({
  categories,
  featuredDesigns,
  services,
  projects,
  cities,
  testimonials,
  faqs,
  blogs,
  settings,
}: HomepageClientProps) {
  const [quickViewPost, setQuickViewPost] = useState<DesignPost | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <>
      {/* 1. HERO SECTION */}
      <HeroSection
        onOpenConsultation={() => setIsConsultationOpen(true)}
        data={{
          heading: settings.hero_heading || 'DESIGN YOUR DREAM HOME',
          subheading: settings.hero_subheading || 'Thoughtfully designed luxury interiors built around the way you live. 10-Year Warranty.',
        }}
      />

      {/* 2. POPULAR DESIGN CATEGORIES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                EXPLORE BY ROOM
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Popular Design Categories
              </h2>
            </div>
            <Link
              href="/designs"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-blue-700 uppercase tracking-widest transition-colors"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/designs/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-500 bg-slate-900"
              >
                <Image
                  src={cat.image || '/placeholder.jpg'}
                  alt={cat.name}
                  fill
                  className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 space-y-2 text-white">
                  <h3 className="text-xl font-bold uppercase tracking-wider">{cat.name}</h3>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {cat.short_description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 pt-2 group-hover:translate-x-1 transition-transform">
                    EXPLORE DESIGNS <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DESIGNS GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                HANDPICKED LUXURY
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Featured Interior Concepts
              </h2>
            </div>
            <Link
              href="/designs"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-blue-700 uppercase tracking-widest transition-colors"
            >
              <span>BROWSE ALL DESIGNS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDesigns.map((post) => (
              <DesignCard key={post.id} post={post} onQuickView={setQuickViewPost} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SERVICES OFFERED - Elegant Soft Light / Slate Layout */}
      <section className="py-20 bg-blue-50/50 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-800 bg-blue-100 px-3.5 py-1.5 rounded-full inline-block">
              OUR CAPABILITIES
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">End-to-End Interior Offerings</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete design, manufacturing, civil execution, and installation under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src={service.image || '/placeholder.jpg'}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{service.short_description}</p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs font-bold text-blue-700">
                    From ₹{(service.price_from ? service.price_from / 100000 : 2.5).toFixed(1)} Lakhs
                  </span>
                  <Link
                    href="/designs"
                    className="text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 6. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                CLIENT STORIES
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">What Homeowners Say About ARCHOVEX</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed font-serif text-sm">
                    "{t.review}"
                  </p>
                  <div className="pt-2 flex items-center gap-3 border-t border-slate-200/60">
                    <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {t.client_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{t.client_name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">{t.project_type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              GOT QUESTIONS?
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </div>

          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* 8. CONSULTATION CTA BANNER - Rich Royal Blue Gradient */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-blue-400/20 text-blue-300 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
            READY TO TRANSFORM YOUR HOME?
          </h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Get 3D interior renders, custom material samples & transparent quote tailored for your budget.
          </p>
          <button
            onClick={() => setIsConsultationOpen(true)}
            className="px-10 py-4 bg-white hover:bg-blue-50 text-blue-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-2xl transition-all hover:scale-105"
          >
            BOOK FREE DESIGN CONSULTATION
          </button>
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
