'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { City, DesignPost, Service, Project, Testimonial, Faq } from '@/types';
import DesignCard from '@/components/public/DesignCard';
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
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <>
      {/* CITY HERO */}
      <section className="relative bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0E7490] text-white py-20 overflow-hidden border-b border-sky-900">
        {city.hero_image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={city.hero_image}
              alt=""
              aria-hidden="true"
              fill
              priority
              className="object-cover opacity-25 scale-105 text-transparent select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C4A6E] via-[#0C4A6E]/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#FFEDD5] bg-[#F97316]/20 border border-[#F97316]/40 px-4 py-1.5 rounded-full inline-block shadow-sm">
            ARCHOVEX STUDIO • {city.name.toUpperCase()}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Best Home Interior Designers in {city.name}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
            {city.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-[#F97316]/30 transition-all border border-amber-300/40"
            >
              BOOK CONSULTATION IN {city.name.toUpperCase()}
            </button>
            {city.whatsapp && (
              <a
                href={`https://wa.me/${city.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl transition-all flex items-center gap-2 border border-emerald-400/30"
              >
                <MessageCircle className="w-4 h-4" /> CHAT ON WHATSAPP
              </a>
            )}
          </div>
        </div>
      </section>

      {/* CITY CONTACT & STUDIO INFO */}
      <section className="bg-[#0C4A6E] text-white py-10 border-b border-sky-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="flex items-start gap-3 p-4 bg-[#075985]/80 rounded-2xl border border-sky-700/80">
            <MapPin className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold uppercase block text-white">Experience Center</span>
              <span className="text-sky-100">{city.address || `ARCHOVEX Studio, ${city.name}`}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-[#075985]/80 rounded-2xl border border-sky-700/80">
            <Phone className="w-5 h-5 text-[#F97316] flex-shrink-0" />
            <div>
              <span className="font-bold uppercase block text-white">Direct Helpline</span>
              <a href={`tel:${city.phone}`} className="text-sky-100 hover:text-white">{city.phone || '+91 98765 43210'}</a>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-[#075985]/80 rounded-2xl border border-sky-700/80">
            <Mail className="w-5 h-5 text-[#F97316] flex-shrink-0" />
            <div>
              <span className="font-bold uppercase block text-white">Email Studio</span>
              <a href={`mailto:${city.email}`} className="text-sky-100 hover:text-white">{city.email || 'info@archovex.com'}</a>
            </div>
          </div>
        </div>
      </section>

      {/* DESIGNS POPULAR IN CITY */}
      {designs.length > 0 && (
        <section className="py-16 bg-[#FAF8F3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-2xl font-black text-[#0C4A6E] uppercase tracking-tight">Popular Interior Designs in {city.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((post) => (
                <DesignCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CITY TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-[#FAF8F3] border-t border-[#E4DCD0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-2xl font-black text-[#0C4A6E] uppercase tracking-tight">Recent Customer Reviews in {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-6 rounded-2xl border border-[#E4DCD0] shadow-xs space-y-3">
                  <div className="flex gap-1 text-[#F97316]">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F97316]" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic">"{t.review}"</p>
                  <span className="text-xs font-bold text-[#0C4A6E] block pt-2">— {t.client_name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CITY FAQs */}
      {faqs.length > 0 && (
        <section className="py-16 bg-[#FAF8F3] border-t border-[#E4DCD0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-2xl font-black text-[#0C4A6E] uppercase tracking-tight">Interiors FAQ in {city.name}</h2>
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
