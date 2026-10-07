'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { City } from '@/types';
import { Search, MapPin, Building2, ChevronRight, X, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface CityMegaMenuProps {
  cities?: City[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CityMegaMenu({ cities = [], isOpen, onClose }: CityMegaMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchedCities, setFetchedCities] = useState<City[]>([]);

  useEffect(() => {
    if (cities.length === 0) {
      apiClient.get('/cities')
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.data)) {
            setFetchedCities(res.data.data.filter((c: any) => c.status !== 'draft'));
          }
        })
        .catch(() => {});
    }
  }, [cities.length]);

  const activeCities = useMemo(() => {
    const list = cities.length > 0 ? cities : fetchedCities;
    return list.filter((c) => c.status !== 'draft');
  }, [cities, fetchedCities]);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return activeCities;
    const q = searchQuery.toLowerCase().trim();
    return activeCities.filter((c) => c.name.toLowerCase().includes(q));
  }, [activeCities, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 w-full bg-[#FAF8F3] text-slate-900 border-t-4 border-[#F97316] border-x border-b border-[#E4DCD0] shadow-2xl rounded-b-3xl p-6 lg:p-7 z-50 transition-all duration-200 animate-fade-in mt-0"
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      {/* Header Bar: Title + Search Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E4DCD0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0C4A6E] text-white flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5 text-[#F97316]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-[#0C4A6E] uppercase tracking-wider">
                ARCHOVEX Service Locations
              </h3>
              <span className="text-[10px] font-black uppercase bg-[#F97316]/10 text-[#EA580C] px-2.5 py-0.5 rounded-full border border-[#F97316]/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> {activeCities.length} Locations Active
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Explore turnkey interior design services and experience studios in your location
            </p>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[280px] md:min-w-[320px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations..."
            className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 font-medium pl-10 pr-9 py-2.5 rounded-xl border border-[#E4DCD0] focus:outline-none focus:border-[#0C4A6E] focus:ring-2 focus:ring-[#0C4A6E]/15 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: CMS Published Locations */}
      <div className="pt-5">
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredCities.map((c) => (
              <Link
                key={c.id || c.slug}
                href={`/locations/${c.slug}`}
                onClick={onClose}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-white hover:bg-[#0C4A6E] border border-[#E4DCD0] hover:border-[#0C4A6E] transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F3EEE4] group-hover:bg-white/10 flex items-center justify-center transition-colors">
                    <MapPin className="w-4 h-4 text-[#F97316] group-hover:text-amber-300" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black text-[#0C4A6E] group-hover:text-white transition-colors">
                    {c.name}
                  </h4>
                </div>

                <div className="mt-4 pt-2 border-t border-[#E4DCD0] group-hover:border-white/20 flex items-center justify-between text-[11px] font-extrabold text-slate-500 group-hover:text-white transition-colors">
                  <span>VIEW LOCATION</span>
                  <ChevronRight className="w-4 h-4 text-[#F97316] group-hover:text-amber-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-[#E4DCD0]">
            <p className="text-xs font-bold text-[#0C4A6E]">No active location found matching "{searchQuery}"</p>
            <p className="text-[11px] text-slate-600 font-medium mt-1">
              We deliver & install interior projects across India!
            </p>
            <Link
              href="/contact-us"
              onClick={onClose}
              className="inline-flex items-center gap-1 mt-3 px-4 py-2 bg-[#F97316] text-white text-xs font-bold rounded-xl hover:bg-[#EA580C] transition-all"
            >
              <span>Contact Design Team</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
