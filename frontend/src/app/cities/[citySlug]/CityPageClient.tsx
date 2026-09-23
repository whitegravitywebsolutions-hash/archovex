'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { City, DesignPost, Service, Project, Testimonial, Faq } from '@/types';
import DesignCard from '@/components/public/DesignCard';
import DesignQuickViewModal from '@/components/public/DesignQuickViewModal';
import ConsultationFormModal from '@/components/public/ConsultationFormModal';
import FAQAccordion from '@/components/public/FAQAccordion';
import { MapPin, Phone, Mail, MessageCircle, Star } from 'lucide-react';

interface Props {
  city: City;
  designs: DesignPost[];
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  faqs: Faq[];
  cities: City[];
}

export default function CityPageClient({
  city,
  designs,
  services,
  projects,
  testimonials,
  faqs,
  cities,
}: Props) {
  const [quickViewPost, setQuickViewPost] = useState<DesignPost | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <>
      {/* CITY HERO */}
      <section className="relative bg-slate-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={city.hero_image || '/placeholder.jpg'}
            alt={`Interiors in ${city.name}`}
            fill
            priority
            className="object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-400/20 px-3.5 py-1.5 rounded-full inline-block">
            ARCHOVEX STUDIO • {city.name.toUpperCase()}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Best Home Interior Designers in {city.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {city.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl transition-all"
            >
              BOOK CONSULTATION IN {city.name.toUpperCase()}
            </button>
            {city.whatsapp && (
              <a
                href={`https://wa.me/${city.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> CHAT ON WHATSAPP
              </a>
            )}
          </div>
        </div>
      </section>

      {/* CITY CONTACT & STUDIO INFO */}
      <section className="bg-slate-900 text-white py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="flex items-start gap-3 p-4 bg-slate-800/60 rounded-xl">
            <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold uppercase block text-slate-300">Experience Center</span>
              <span className="text-slate-400">{city.address || `ARCHOVEX Studio, ${city.name}`}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-xl">
            <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <span className="font-bold uppercase block text-slate-300">Direct Helpline</span>
              <a href={`tel:${city.phone}`} className="text-slate-400 hover:text-white">{city.phone || '+91 98765 43210'}</a>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-xl">
            <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <span className="font-bold uppercase block text-slate-300">Email Studio</span>
              <a href={`mailto:${city.email}`} className="text-slate-400 hover:text-white">{city.email || 'info@archovex.com'}</a>
            </div>
          </div>
        </div>
      </section>

      {/* DESIGNS POPULAR IN CITY */}
      {designs.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Popular Interior Designs in {city.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((post) => (
                <DesignCard key={post.id} post={post} onQuickView={setQuickViewPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CITY TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Recent Customer Reviews in {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-slate-50 p-6 rounded-2xl border space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic">"{t.review}"</p>
                  <span className="text-xs font-bold text-slate-900 block pt-2">— {t.client_name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CITY FAQs */}
      {faqs.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Interiors FAQ in {city.name}</h2>
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
