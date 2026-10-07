'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, CheckCircle2, Award, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenConsultation?: () => void;
  data?: {
    heading?: string;
    subheading?: string;
    image?: string;
  };
}

export default function HeroSection({ onOpenConsultation, data = {} }: HeroProps) {
  const heading = data.heading || 'DESIGN YOUR DREAM HOME';
  const subheading = data.subheading || 'Thoughtfully designed luxury interiors built around the way you live. 10-Year Warranty & 45-Day Delivery Guarantee.';
  const heroImage = data.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';

  return (
    <section className="relative bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0E7490] text-white py-14 lg:py-24 border-b border-sky-900 overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0284C7]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F97316]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F97316]/15 border border-[#F97316]/40 text-[#FFEDD5] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#F97316]" />
              <span>ARCHOVEX INFRA • LUXURY ARCHITECTURE & INTERIORS</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] uppercase">
              {heading}
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-sky-100 font-normal leading-relaxed max-w-xl">
              {subheading}
            </p>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-sky-100 pt-2">
              <div className="flex items-center gap-2.5 bg-[#0369A1]/60 p-3 rounded-xl border border-sky-600/50 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>10-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#0369A1]/60 p-3 rounded-xl border border-sky-600/50 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>45-Day Handover</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#0369A1]/60 p-3 rounded-xl border border-sky-600/50 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-200 flex-shrink-0" />
                <span>German Hardware</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#0369A1]/60 p-3 rounded-xl border border-sky-600/50 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                <span>Zero-Cost 3D Render</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onOpenConsultation}
                className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-[#F97316]/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-amber-300/40"
              >
                <span>BOOK FREE CONSULTATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/blogs"
                className="px-8 py-4 bg-white/10 hover:bg-white hover:text-[#0C4A6E] text-white border border-white/30 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center backdrop-blur-md"
              >
                EXPLORE DESIGNS
              </Link>
            </div>
          </div>

          {/* Right Photography Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-sky-800/80 bg-[#0369A1]">
              <Image
                src={heroImage}
                alt="ARCHOVEX Luxury Interior Design"
                fill
                priority
                className="object-cover img-zoom-hover"
              />

              {/* Floating Highlight Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0C4A6E]/95 backdrop-blur-md p-4 rounded-2xl border border-sky-600/80 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#F97316]/20 text-[#F97316] rounded-xl border border-[#F97316]/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Turnkey Architectural Execution</h4>
                    <p className="text-[11px] text-sky-200">2,500+ Luxury Homes Delivered Across India</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#FFEDD5] bg-[#F97316]/20 border border-[#F97316]/40 px-3 py-1 rounded-full uppercase">
                  100% Custom
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
