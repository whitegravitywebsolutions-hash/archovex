import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import Link from 'next/link';
import { fetchPublicData } from '@/lib/api';
import { MapPin, ArrowRight, Building2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interior Designers By Location | ARCHOVEX INFRA',
  description: 'Find luxury interior designers in Noida, Greater Noida, Delhi, New Delhi, Gurgaon and premier NCR regions.',
  alternates: {
    canonical: '/locations',
  },
};

const DEFAULT_LOCATIONS = [
  { name: 'Noida', slug: 'noida', tag: 'NCR Hub', count: '150+ Projects Handed Over' },
  { name: 'Greater Noida', slug: 'greater-noida', tag: 'High-Rise Expressways', count: '120+ Projects Handed Over' },
  { name: 'Delhi', slug: 'delhi', tag: 'Luxury Bungalows & Villas', count: '200+ Projects Handed Over' },
  { name: 'New Delhi', slug: 'new-delhi', tag: 'Premium Central Estates', count: '90+ Projects Handed Over' },
  { name: 'Gurgaon', slug: 'gurgaon', tag: 'Cyber City Luxury Apartments', count: '180+ Projects Handed Over' },
];

export default async function LocationsHubPage() {
  const homeData = await fetchPublicData('/home').catch(() => null);
  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const locationList = cities.length > 0 ? cities.map((c: any) => ({
    name: c.name,
    slug: c.slug,
    tag: c.tagline || 'Interior Experience Hub',
    count: 'Turnkey Architectural Solutions',
  })) : DEFAULT_LOCATIONS;

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans">
      <Header initialMenu={homeData?.menus || []} cities={cities} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0E7490] text-white py-16 sm:py-20 border-b border-sky-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#FFEDD5] bg-[#F97316]/20 border border-[#F97316]/40 px-4 py-1.5 rounded-full inline-block">
            ARCHOVEX LOCATIONS HUB
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Interior Designers Near You Across NCR & India
          </h1>
          <p className="text-sm sm:text-base text-sky-100 max-w-3xl mx-auto leading-relaxed">
            Select your city or location to explore local design projects, local experience centers, and regional turnkey delivery guarantees.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locationList.map((loc: any) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="group bg-white p-6 rounded-3xl border border-[#E4DCD0] hover:border-[#F97316] hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0C4A6E]/5 group-hover:bg-[#0C4A6E] text-[#0C4A6E] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                  <MapPin className="w-6 h-6 text-[#F97316]" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase bg-[#F97316]/10 text-[#EA580C] px-2.5 py-1 rounded-full border border-[#F97316]/20 inline-block mb-2">
                    {loc.tag}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0C4A6E] transition-colors">
                    Interior Designers in {loc.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {loc.count}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#0C4A6E] group-hover:text-[#F97316] transition-colors">
                <span>View Location Hub</span>
                <ArrowRight className="w-4 h-4 text-[#F97316] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
