'use client';

import React from 'react';
import Link from 'next/link';
import { MegaMenuColumn } from '@/types';
import { 
  Home, 
  Utensils, 
  Sofa, 
  BedDouble, 
  DoorClosed, 
  Maximize2, 
  Monitor, 
  Bath, 
  Building, 
  Building2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';

interface MegaMenuProps {
  columns?: MegaMenuColumn[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ columns = [], isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  const validColumns = Array.isArray(columns) && columns.length > 0 ? columns : [];

  if (validColumns.length > 0) {
    return (
      <div
        className="absolute top-full left-0 right-0 w-full bg-[#FAF8F3] text-slate-900 border-t-4 border-[#F97316] border-x border-b border-[#E4DCD0] shadow-2xl rounded-b-3xl p-6 lg:p-7 z-50 transition-all duration-200 animate-fade-in mt-0"
        onMouseLeave={onClose}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {validColumns.map((col, colIdx) => {
            const items = col.items || (col as any).mega_menu_items || [];
            return (
              <div key={col.id || colIdx} className="space-y-3">
                {col.title && (
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0C4A6E] border-b border-[#E4DCD0] pb-2 flex items-center justify-between">
                    <span>{col.title}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                  </h4>
                )}
                <div className="space-y-1">
                  {items.map((sub: any, itemIdx: number) => (
                    <Link
                      key={sub.id || itemIdx}
                      href={sub.url || '/designs'}
                      onClick={onClose}
                      className="group flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white transition-all border border-transparent hover:border-[#E4DCD0] hover:shadow-xs"
                    >
                      <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#0C4A6E] transition-colors">
                        {sub.label}
                      </span>
                      {sub.description && (
                        <span className="text-[9px] font-black uppercase bg-[#F97316]/10 text-[#EA580C] px-2 py-0.5 rounded-md border border-[#F97316]/20">
                          {sub.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Curated Fallback Layout matching ARCHOVEX Design Gallery
  const menuSections = [
    {
      title: 'Modular Kitchens',
      icon: Utensils,
      items: [
        { label: 'L-Shaped Kitchens', url: '/designs/modular-kitchen-designs?shape=L-Shaped', badge: 'POPULAR' },
        { label: 'Island Kitchens', url: '/designs/modular-kitchen-designs?shape=Island', badge: 'LUXURY' },
        { label: 'Parallel Kitchens', url: '/designs/modular-kitchen-designs?shape=Parallel' },
        { label: 'Straight Kitchens', url: '/designs/modular-kitchen-designs?shape=Straight' },
        { label: 'All Kitchen Designs', url: '/designs/modular-kitchen-designs', isLink: true },
      ],
    },
    {
      title: 'Living Rooms & Decor',
      icon: Sofa,
      items: [
        { label: 'Modern Luxury Living', url: '/designs/living-room-designs?style=Luxury', badge: 'NEW' },
        { label: 'TV Console Wall Units', url: '/designs/living-room-designs?type=TV-Units' },
        { label: 'Minimal Scandinavian', url: '/designs/living-room-designs?style=Scandinavian' },
        { label: 'Foyer & Shoe Units', url: '/designs/living-room-designs?type=Foyer' },
        { label: 'All Living Designs', url: '/designs/living-room-designs', isLink: true },
      ],
    },
    {
      title: 'Wardrobes & Storage',
      icon: DoorClosed,
      items: [
        { label: 'Sliding Glass Profile', url: '/designs/wardrobe-designs?type=Sliding', badge: 'TRENDING' },
        { label: 'Luxury Walk-in Closets', url: '/designs/wardrobe-designs?type=Walk-in' },
        { label: 'Floor-to-Ceiling Wardrobes', url: '/designs/wardrobe-designs?type=Full-Height' },
        { label: 'Master Bedrooms', url: '/designs/bedroom-designs' },
        { label: 'All Wardrobe Designs', url: '/designs/wardrobe-designs', isLink: true },
      ],
    },
  ];

  return (
    <div
      className="absolute top-full left-0 right-0 w-full bg-[#FAF8F3] text-slate-900 border-t-4 border-[#F97316] border-x border-b border-[#E4DCD0] shadow-2xl rounded-b-3xl p-6 lg:p-7 z-50 transition-all duration-200 animate-fade-in mt-0"
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category Columns 1 to 3 */}
        {menuSections.map((section, idx) => {
          const SectionIcon = section.icon;
          return (
            <div key={idx} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#E4DCD0] pb-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0C4A6E] text-[#F97316] flex items-center justify-center shadow-xs">
                  <SectionIcon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0C4A6E]">
                  {section.title}
                </h4>
              </div>

              <div className="space-y-1">
                {section.items.map((sub, itemIdx) => (
                  <Link
                    key={itemIdx}
                    href={sub.url}
                    onClick={onClose}
                    className={`group flex items-center justify-between py-2 px-3 rounded-xl transition-all ${
                      sub.isLink
                        ? 'bg-white/80 hover:bg-[#0C4A6E] text-[#0C4A6E] hover:text-white font-extrabold border border-[#E4DCD0] hover:border-[#0C4A6E] mt-2'
                        : 'hover:bg-white text-slate-800 hover:text-[#0C4A6E] font-bold border border-transparent hover:border-[#E4DCD0] hover:shadow-xs'
                    }`}
                  >
                    <span className="text-xs truncate flex items-center gap-1.5">
                      <span>{sub.label}</span>
                    </span>
                    {sub.badge && (
                      <span className="text-[9px] font-black uppercase bg-[#F97316]/10 text-[#EA580C] px-2 py-0.5 rounded-md border border-[#F97316]/20">
                        {sub.badge}
                      </span>
                    )}
                    {sub.isLink && (
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Column 4: ARCHOVEX Featured Promo Card */}
        <div className="bg-gradient-to-br from-[#0C4A6E] to-[#075985] rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden border border-[#0369A1]">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-[#F97316]/10 rounded-full blur-xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-[#F97316] text-white px-2.5 py-1 rounded-full border border-amber-300/30">
              <Sparkles className="w-3 h-3" /> 100% Factory Built
            </span>
            <h4 className="text-base font-black leading-snug">
              45-Day Move-in Guarantee
            </h4>
            <p className="text-xs text-sky-100/90 leading-relaxed font-medium">
              Precision BWR Plywood interior execution with 10-year warranty & zero cost EMIs.
            </p>

            <div className="space-y-1.5 pt-1 text-[11px] font-semibold text-sky-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
                <span>10-Year Material Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Sub-millimeter German Finish</span>
              </div>
            </div>
          </div>

          <div className="pt-4 relative z-10">
            <Link
              href="/designs"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md border border-amber-300/30 group"
            >
              <span>Explore All Designs</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
