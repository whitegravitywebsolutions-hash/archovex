'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { City } from '@/types';
import { Search, MapPin, Building2, ChevronRight, X, Sparkles } from 'lucide-react';

interface CityMegaMenuProps {
  cities?: City[];
  isOpen: boolean;
  onClose: () => void;
}

const ALL_INDIAN_CITIES = [
  'Agra', 'Ahilyanagar', 'Ahmedabad', 'Aizawl', 'Aligarh', 'Amritsar', 'Anand', 'Asansol', 'Aurangabad', 'Ayodhya',
  'Banswara', 'Baramulla', 'Beed', 'Belgaum', 'Bengaluru', 'Bhilai', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur',
  'Chandigarh', 'Chandrapur', 'Chennai', 'Chikkamagaluru', 'Coimbatore', 'Cuttack',
  'Dehradun', 'Delhi', 'Dhanbad', 'Dibrugarh', 'Durg', 'Faridabad',
  'Gandhinagar', 'Gaya', 'Ghaziabad', 'Ghumarwin', 'Goa', 'Godhra', 'Gurugram', 'Guwahati', 'Gwalior',
  'Hamirpur', 'Hosapete', 'Hubli', 'Hyderabad',
  'Indore',
  'Jabalpur', 'Jagdalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamshedpur', 'Jigani', 'Jodhpur',
  'Kadapa', 'Kakinada', 'Kangra', 'Kanpur', 'Karimnagar', 'Karur', 'Khammam', 'Kochi', 'Kolhapur', 'Kolkata', 'Kozhikode',
  'Latur', 'Lucknow', 'Ludhiana',
  'Madurai', 'Mandi', 'Mangalore', 'Mansoorabad', 'Meerut', 'Mehsana', 'Moradabad', 'Mumbai', 'Mysore',
  'Nagercoil', 'Nagpur', 'Nanded', 'Nashik', 'Navi Mumbai', 'Nawanshahr', 'Neemuch', 'Nizamabad', 'Noida',
  'Ongole',
  'Patiala', 'Patna', 'Pondicherry', 'Pune',
  'Raebareli', 'Raipur', 'Rajahmundry', 'Rajkot', 'Ranchi', 'Rewa', 'Rewari', 'Rudrapur',
  'Salem', 'Sangareddy', 'Sangli', 'Shivamogga', 'Siliguri', 'Singrauli', 'Sivakasi', 'Solapur', 'Srikakulam', 'Srinagar', 'Surat',
  'Thane', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli', 'Tirunelveli', 'Tumakuru',
  'Udaipur', 'Udupi', 'Ujjain',
  'Vadodara', 'Varanasi', 'Vellore', 'Vijayapur', 'Vijayawada', 'Visakhapatnam',
  'Warangal'
];

const FEATURED_POPULAR_CITIES = [
  { name: 'Bengaluru', label: 'Tech Hub', slug: 'bengaluru' },
  { name: 'Mumbai', label: 'Financial Capital', slug: 'mumbai' },
  { name: 'Delhi NCR', label: 'Capital Region', slug: 'delhi' },
  { name: 'Hyderabad', label: 'Cyber City', slug: 'hyderabad' },
  { name: 'Pune', label: 'Cultural Hub', slug: 'pune' },
  { name: 'Chennai', label: 'Metropolis', slug: 'chennai' },
  { name: 'Kolkata', label: 'Heritage City', slug: 'kolkata' },
  { name: 'Ahmedabad', label: 'Commercial Hub', slug: 'ahmedabad' }
];

export default function CityMegaMenu({ cities = [], isOpen, onClose }: CityMegaMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Combine DB cities with static list
  const cityList = useMemo(() => {
    const cityMap = new Map<string, { name: string; slug: string }>();

    cities.forEach((c) => {
      if (c.name) {
        cityMap.set(c.name.toLowerCase(), {
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
        });
      }
    });

    ALL_INDIAN_CITIES.forEach((cityName) => {
      const key = cityName.toLowerCase();
      if (!cityMap.has(key)) {
        cityMap.set(key, {
          name: cityName,
          slug: cityName.toLowerCase().replace(/\s+/g, '-'),
        });
      }
    });

    return Array.from(cityMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [cities]);

  // Filter cities by search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cityList;
    const q = searchQuery.toLowerCase().trim();
    return cityList.filter((c) => c.name.toLowerCase().includes(q));
  }, [cityList, searchQuery]);

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
                <Sparkles className="w-2.5 h-2.5" /> {cityList.length}+ Cities Served
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Find interior design services, experience centers & site execution teams near you
            </p>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[280px] md:min-w-[340px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 130+ cities across India..."
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

      {/* Featured Tier-1 Cities Section (Only show when not searching) */}
      {!searchQuery && (
        <div className="pt-4 pb-4 border-b border-[#E4DCD0]">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#0C4A6E] mb-2.5 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#F97316]" /> Popular Metro Hubs
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {FEATURED_POPULAR_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                onClick={onClose}
                className="group flex flex-col p-2.5 rounded-xl bg-white hover:bg-[#0C4A6E] border border-[#E4DCD0] hover:border-[#0C4A6E] transition-all shadow-xs"
              >
                <span className="text-xs font-bold text-[#0C4A6E] group-hover:text-white transition-colors truncate">
                  {c.name}
                </span>
                <span className="text-[9px] font-semibold text-slate-500 group-hover:text-amber-300 transition-colors truncate">
                  {c.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: All Cities */}
      <div className="pt-4">
        {!searchQuery && (
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3 flex items-center justify-between">
            <span>All Cities A–Z</span>
            <span className="text-slate-600 font-semibold lowercase">({filteredCities.length} locations)</span>
          </div>
        )}

        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 gap-y-2 max-h-[45vh] overflow-y-auto pr-3 custom-scrollbar">
            {filteredCities.map((c) => (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                onClick={onClose}
                className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-800 hover:text-[#0C4A6E] hover:bg-white hover:shadow-xs transition-all border border-transparent hover:border-[#E4DCD0]"
                title={c.name}
              >
                <span className="truncate">{c.name}</span>
                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#F97316] opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-[#E4DCD0]">
            <p className="text-xs font-bold text-[#0C4A6E]">No city matched "{searchQuery}"</p>
            <p className="text-[11px] text-slate-600 font-medium mt-1">
              We deliver & install interior projects pan-India!
            </p>
            <Link
              href="/contact"
              onClick={onClose}
              className="inline-flex items-center gap-1 mt-3 px-4 py-2 bg-[#F97316] text-white text-xs font-bold rounded-xl hover:bg-[#EA580C] transition-all"
            >
              <span>Contact Design Team</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Footer Callout */}
      <div className="mt-4 pt-3 border-t border-[#E4DCD0] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">Pan-India Factory Delivery & 45-Day Installation Guarantee</span>
        </div>
        <Link
          href="/contact"
          onClick={onClose}
          className="font-extrabold text-[#0C4A6E] hover:text-[#F97316] flex items-center gap-1 transition-colors"
        >
          <span>Request Site Visit in Your Area</span> →
        </Link>
      </div>
    </div>
  );
}
