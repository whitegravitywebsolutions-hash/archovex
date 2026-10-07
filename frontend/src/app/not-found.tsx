import React from 'react';
import Link from 'next/link';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import { fetchPublicData } from '@/lib/api';
import { Home, SearchX, Compass } from 'lucide-react';

export default async function NotFound() {
  const homeData = await fetchPublicData('/home').catch(() => null);
  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans text-slate-800">
      {/* Website Navigation Header */}
      <Header cities={cities} />

      {/* 404 Main Message Section */}
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center space-y-6 border border-[#E4DCD0] relative overflow-hidden">
          <div className="w-20 h-20 bg-[#F97316]/10 text-[#F97316] rounded-3xl flex items-center justify-center mx-auto border border-[#F97316]/20 shadow-inner">
            <SearchX className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-6xl font-black text-[#0C4A6E] tracking-tight block">404</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0C4A6E] uppercase tracking-wide">
              PAGE NOT FOUND
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
              We couldn’t find the page or interior design collection you were looking for. It might have been relocated or renamed.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-amber-300/30"
            >
              <Home className="w-4 h-4" /> Return To Homepage
            </Link>
            <Link
              href="/blogs"
              className="w-full sm:w-auto px-6 py-3 bg-[#0C4A6E] hover:bg-[#075985] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" /> Explore Blogs
            </Link>
          </div>
        </div>
      </main>

      {/* Website Footer & Floating Action Widgets */}
      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
