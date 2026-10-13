'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Category, City } from '@/types';

interface FiltersProps {
  categories?: Category[];
  cities?: City[];
  onFilterChange: (filters: Record<string, string>) => void;
  activeCategorySlug?: string;
  showServicesFilter?: boolean;
  hideStylesAndLayouts?: boolean;
  hideSearch?: boolean;
  hideCityFilter?: boolean;
  hideOrderBy?: boolean;
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
  hideSearch = true,
  hideCityFilter = true,
  hideOrderBy = false,
  serviceLabel = 'All Services',
  cityLabel = 'All Cities',
  placeholder = 'Search designs by title, style, finish...'
}: FiltersProps) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [style, setStyle] = useState('');
  const [layout, setLayout] = useState('');
  const [cityId, setCityId] = useState('');
  const [order, setOrder] = useState('');

  // Debounced search & filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search: hideSearch ? '' : search,
        category_id: categoryId,
        style: hideStylesAndLayouts ? '' : style,
        layout: hideStylesAndLayouts ? '' : layout,
        city_id: (hideCityFilter || cities.length === 0) ? '' : cityId,
        order: hideOrderBy ? '' : order,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, categoryId, style, layout, cityId, order, hideStylesAndLayouts, hideSearch, hideCityFilter, hideOrderBy, cities.length]);

  const clearFilters = () => {
    setSearch('');
    setCategoryId('');
    setStyle('');
    setLayout('');
    setCityId('');
    setOrder('');
    onFilterChange({});
  };

  const hasActive = (!hideSearch && search) || categoryId || (!hideStylesAndLayouts && (style || layout)) || (!hideCityFilter && cities.length > 0 && cityId) || (!hideOrderBy && order);

  const showCategories = showServicesFilter && categories.length > 0;
  const showStyles = !hideStylesAndLayouts;
  const showCities = !hideCityFilter && cities.length > 0;
  const showSearch = !hideSearch;
  const showOrderBy = !hideOrderBy;

  if (!showCategories && !showStyles && !showCities && !showSearch && !showOrderBy) {
    return null;
  }

  return (
    <div className="bg-[#FAFAFA] rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3 font-sans">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input (Hidden when hideSearch=true) */}
        {showSearch && (
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none transition-all shadow-2xs"
            />
          </div>
        )}

        {/* Services / Categories Filter Dropdown */}
        {showCategories && (
          <div className="flex-1 min-w-[200px]">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none shadow-2xs cursor-pointer"
            >
              <option value="">{serviceLabel}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Style Dropdown */}
        {showStyles && (
          <>
            <div className="flex-1 min-w-[160px]">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none shadow-2xs cursor-pointer"
              >
                <option value="">All Styles</option>
                <option value="Modern">Modern</option>
                <option value="Luxury">Luxury</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Contemporary">Contemporary</option>
                <option value="Scandinavian">Scandinavian</option>
                <option value="Traditional">Traditional</option>
              </select>
            </div>

            {/* Layout Dropdown */}
            <div className="flex-1 min-w-[160px]">
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none shadow-2xs cursor-pointer"
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
            </div>
          </>
        )}

        {/* City Filter Dropdown (Hidden when hideCityFilter=true) */}
        {showCities && (
          <div className="flex-1 min-w-[160px]">
            <select
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none shadow-2xs cursor-pointer"
            >
              <option value="">{cityLabel}</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Order By Filter Dropdown */}
        {!hideOrderBy && (
          <div className="flex-1 min-w-[160px]">
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none shadow-2xs cursor-pointer"
            >
              <option value="">Sort By: Default</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title_asc">Title (A - Z)</option>
              <option value="title_desc">Title (Z - A)</option>
            </select>
          </div>
        )}
      </div>

      {hasActive && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
          <span>Active filters applied</span>
          <button
            onClick={clearFilters}
            className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
