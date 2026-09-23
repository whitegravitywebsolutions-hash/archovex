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
    <section className="relative bg-gradient-to-b from-blue-50/70 via-slate-50/50 to-white py-12 lg:py-20 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-6 text-slate-900">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100/90 border border-blue-200 text-blue-900 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-xs">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>ARCHOVEX INFRA • LUXURY INTERIORS</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] uppercase">
              {heading}
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              {subheading}
            </p>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-800 pt-2">
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>10-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>45-Day Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>German Hardware</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Zero-Cost 3D Render</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onOpenConsultation}
                className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>BOOK FREE CONSULTATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/designs"
                className="px-8 py-4 bg-white hover:bg-slate-900 hover:text-white text-slate-900 border-2 border-slate-200 font-bold text-xs uppercase tracking-widest rounded-xl shadow-xs transition-all flex items-center justify-center"
              >
                EXPLORE DESIGNS
              </Link>
            </div>
          </div>

          {/* Right Photography Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <Image
                src={heroImage}
                alt="ARCHOVEX Luxury Interior Design"
                fill
                priority
                className="object-cover img-zoom-hover"
              />

              {/* Floating Highlight Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase">Turnkey Execution</h4>
                    <p className="text-[11px] text-slate-500">2,500+ Homes Delivered Across Metros</p>
                  </div>
                </div>
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase">
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
