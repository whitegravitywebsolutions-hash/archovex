'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { City } from '@/types';

interface FiltersProps {
  categories?: Category[];
  cities?: City[];
  onFilterChange: (filters: Record<string, string>) => void;
  activeCategorySlug?: string;
  showServicesFilter?: boolean;
  hideStylesAndLayouts?: boolean;
  serviceLabel?: string;
  cityLabel?: string;
  placeholder?: string;
}

export default function DesignFilters({ 
  categories = [],
  cities = [], 
  onFilterChange, 
  activeCategorySlug,
  showServicesFilter = false,
  hideStylesAndLayouts = false,
  serviceLabel = 'All Services',
  cityLabel = 'All Cities',
  placeholder = 'Search designs by title, style, finish...'
}: FiltersProps) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [style, setStyle] = useState('');
  const [layout, setLayout] = useState('');
  const [cityId, setCityId] = useState('');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search,
        category_id: categoryId,
        style: hideStylesAndLayouts ? '' : style,
        layout: hideStylesAndLayouts ? '' : layout,
        city_id: cityId,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, categoryId, style, layout, cityId, hideStylesAndLayouts]);

  const clearFilters = () => {
    setSearch('');
    setCategoryId('');
    setStyle('');
    setLayout('');
    setCityId('');
    onFilterChange({});
  };

  const hasActive = search || categoryId || (!hideStylesAndLayouts && (style || layout)) || cityId;

  return (
    <div className="bg-[#F3EEE4] rounded-2xl border border-[#E4DCD0] p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className={`relative w-full ${hideStylesAndLayouts && showServicesFilter ? 'md:w-1/3' : (hideStylesAndLayouts ? 'md:flex-1' : 'md:w-1/3')}`}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs text-[#0C4A6E] font-bold focus:ring-2 focus:ring-[#0891B2] focus:outline-none transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className={`w-full ${hideStylesAndLayouts && showServicesFilter ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 md:w-2/3' : (hideStylesAndLayouts ? 'md:w-64' : 'grid grid-cols-1 sm:grid-cols-3 gap-3 md:w-2/3')}`}>
          {/* Services Filter */}
          {showServicesFilter && (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs font-bold text-[#0C4A6E] focus:ring-2 focus:ring-[#0891B2] focus:outline-none"
            >
              <option value="">{serviceLabel}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}

          {!hideStylesAndLayouts && (
            <>
              {/* Style */}
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="px-3 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs font-bold text-[#0C4A6E] focus:ring-2 focus:ring-[#0891B2] focus:outline-none"
              >
                <option value="">All Styles</option>
                <option value="Modern">Modern</option>
                <option value="Luxury">Luxury</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Contemporary">Contemporary</option>
                <option value="Scandinavian">Scandinavian</option>
                <option value="Traditional">Traditional</option>
              </select>

              {/* Kitchen / Room Layout */}
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
                className="px-3 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs font-bold text-[#0C4A6E] focus:ring-2 focus:ring-[#0891B2] focus:outline-none"
              >
                <option value="">All Layouts</option>
                <option value="L-Shaped">L-Shaped</option>
                <option value="Island">Island</option>
                <option value="Parallel">Parallel</option>
                <option value="U-Shaped">U-Shaped</option>
                <option value="Straight">Straight</option>
                <option value="Sliding 3-Door">Sliding 3-Door</option>
                <option value="Walk-In U-Shape">Walk-In Closet</option>
              </select>
            </>
          )}

          {/* City / Location */}
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs font-bold text-[#0C4A6E] focus:ring-2 focus:ring-[#0891B2] focus:outline-none"
          >
            <option value="">{cityLabel}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {hasActive && (
        <div className="flex items-center justify-between pt-2 border-t border-[#E4DCD0] text-xs text-slate-500">
          <span>Active filters applied</span>
          <button
            onClick={clearFilters}
            className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider"
          >
            <X className="w-3.5 h-3.5" /> Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
