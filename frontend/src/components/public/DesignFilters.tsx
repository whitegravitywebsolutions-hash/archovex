'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { City } from '@/types';

interface FiltersProps {
  cities?: City[];
  onFilterChange: (filters: Record<string, string>) => void;
  activeCategorySlug?: string;
}

export default function DesignFilters({ cities = [], onFilterChange, activeCategorySlug }: FiltersProps) {
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState('');
  const [layout, setLayout] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [cityId, setCityId] = useState('');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search,
        style,
        layout,
        budget_max: budgetMax,
        city_id: cityId,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, style, layout, budgetMax, cityId]);

  const clearFilters = () => {
    setSearch('');
    setStyle('');
    setLayout('');
    setBudgetMax('');
    setCityId('');
    onFilterChange({});
  };

  const hasActive = search || style || layout || budgetMax || cityId;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search designs by title, style, finish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-2/3">
          {/* Style */}
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
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
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
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

          {/* Budget */}
          <select
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="">All Budgets</option>
            <option value="300000">Under ₹3 Lakhs</option>
            <option value="500000">Under ₹5 Lakhs</option>
            <option value="800000">Under ₹8 Lakhs</option>
            <option value="1500000">Under ₹15 Lakhs</option>
          </select>

          {/* City */}
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {hasActive && (
        <div className="flex items-center justify-between pt-2 border-t text-xs text-slate-500">
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
