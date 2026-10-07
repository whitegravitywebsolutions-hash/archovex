'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/public/HeroSection';
import DesignCard from '@/components/public/DesignCard';
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
      <section className="py-20 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full inline-block">
                EXPLORE BY ROOM
              </span>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight mt-2 uppercase">
                Popular Design Categories
              </h2>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-900 hover:text-blue-700 uppercase tracking-widest transition-colors"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blogs/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-500 bg-[#0B132B] border border-slate-800"
              >
                <Image
                  src={cat.image || '/placeholder.jpg'}
                  alt={cat.name}
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/95 via-[#0B132B]/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 space-y-2 text-white">
                  <h3 className="text-xl font-bold uppercase tracking-wider">{cat.name}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {cat.short_description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 pt-2 group-hover:translate-x-1 transition-transform uppercase">
                    EXPLORE DESIGNS <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DESIGNS GRID */}
      <section className="py-20 bg-[#FAF8F3] border-t border-[#E4DCD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full inline-block">
                HANDPICKED LUXURY
              </span>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight mt-2 uppercase">
                Featured Interior Concepts
              </h2>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-900 hover:text-blue-700 uppercase tracking-widest transition-colors"
            >
              <span>BROWSE ALL DESIGNS</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDesigns.map((post) => (
              <DesignCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SERVICES OFFERED */}
      <section className="py-20 bg-gradient-to-b from-[#F3EEE4] to-[#FAF8F3] border-y border-[#E4DCD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full inline-block">
              OUR CAPABILITIES
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight uppercase">End-to-End Interior Offerings</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete architectural design, high-precision modular manufacturing, civil execution, and white-glove installation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-[#E4DCD0] rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src={service.image || '/placeholder.jpg'}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-950">{service.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{service.short_description}</p>
                <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs font-bold text-blue-700">
                    From ₹{(service.price_from ? service.price_from / 100000 : 2.5).toFixed(1)} Lakhs
                  </span>
                  <Link
                    href="/blogs"
                    className="text-xs font-extrabold uppercase tracking-wider text-slate-900 group-hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    Learn More <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS - Rich ARCHOVEX Deep Navy */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-[#0B132B] text-white border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-400/20 px-3.5 py-1.5 rounded-full inline-block">
                CLIENT STORIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">What Homeowners Say About ARCHOVEX</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-[#131C38] p-8 rounded-2xl border border-slate-700/60 space-y-4 shadow-xl">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-200 italic leading-relaxed font-serif text-sm">
                    "{t.review}"
                  </p>
                  <div className="pt-3 flex items-center gap-3 border-t border-slate-700/60">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-md">
                      {t.client_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.client_name}</h4>
                      <span className="text-[10px] text-blue-300 font-medium">{t.project_type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full inline-block">
              GOT QUESTIONS?
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight uppercase">Frequently Asked Questions</h2>
          </div>

          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* 7. CONSULTATION CTA BANNER - Rich ARCHOVEX Sapphire & Navy */}
      <section className="py-20 bg-gradient-to-r from-[#0B132B] via-[#0F172A] to-[#1C2541] text-white relative overflow-hidden shadow-2xl border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
            READY TO TRANSFORM YOUR HOME?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Get 3D interior renders, custom material samples & transparent quote tailored for your budget.
          </p>
          <button
            onClick={() => setIsConsultationOpen(true)}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-2xl shadow-blue-600/40 transition-all hover:scale-105 border border-blue-400/30 inline-block"
          >
            BOOK FREE DESIGN CONSULTATION
          </button>
        </div>
      </section>

      {/* MODALS */}
      <ConsultationFormModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        cities={cities}
      />
    </>
  );
}
