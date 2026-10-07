'use client';

import React from 'react';
import Link from 'next/link';
import { MegaMenuColumn } from '@/types';
import { 
  Sparkles, 
  ChevronRight, 
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

  const totalItems = validColumns.reduce((acc, col) => {
    const items = col.items || (col as any).mega_menu_items || [];
    return acc + items.length;
  }, 0);

  return (
    <div
      className="absolute top-full left-0 right-0 w-full bg-[#FAF8F3] text-slate-900 border-t-4 border-[#F97316] border-x border-b border-[#E4DCD0] shadow-2xl rounded-b-3xl p-6 lg:p-7 z-50 transition-all duration-200 animate-fade-in mt-0"
      onMouseLeave={onClose}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-5 border-b border-[#E4DCD0] mb-5">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-black text-[#0C4A6E] uppercase tracking-wider">
            ARCHOVEX INTERIOR SERVICES & CATALOG
          </h3>
          <span className="text-[10px] font-black uppercase bg-[#F97316]/10 text-[#EA580C] px-3 py-1 rounded-full border border-[#F97316]/20 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#F97316]" /> {totalItems > 0 ? `${totalItems} SPECIALIZED SERVICES` : 'SPECIALIZED OFFERINGS'}
          </span>
        </div>

        <Link
          href="/services"
          onClick={onClose}
          className="text-xs font-black uppercase tracking-wider text-[#0C4A6E] hover:text-[#F97316] flex items-center gap-1.5 transition-colors group"
        >
          <span>View All Services Hub</span>
          <ArrowRight className="w-4 h-4 text-[#F97316] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Dynamic Columns with Headings & Cards featuring Square Box Icon on Top */}
      {validColumns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {validColumns.map((col, colIdx) => {
            const items = col.items || (col as any).mega_menu_items || [];

            return (
              <div key={col.id || colIdx} className="space-y-3">

                {/* Sub-Items Cards */}
                <div className="space-y-3">
                  {items.map((sub: any, itemIdx: number) => {
                    const title = sub.label || sub.title || '';
                    const url = sub.url || '/services';
                    const shortDescription = sub.description || sub.short_description || 'Custom interior design & execution';

                    return (
                      <Link
                        key={sub.id || itemIdx}
                        href={url}
                        onClick={onClose}
                        className="group relative bg-white p-4 rounded-2xl border border-[#E4DCD0] hover:border-[#F97316] hover:shadow-md transition-all flex flex-col justify-between space-y-3 min-h-[125px]"
                      >
                        {/* Top Square Box Icon */}
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-[#0C4A6E]/5 group-hover:bg-[#0C4A6E] text-[#0C4A6E] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                            <Sparkles className="w-4.5 h-4.5 text-[#F97316] group-hover:text-amber-300 transition-colors" />
                          </div>
                        </div>

                        {/* Title & Short Description */}
                        <div className="space-y-1">
                          <h5 className="text-xs font-black text-slate-900 group-hover:text-[#0C4A6E] transition-colors line-clamp-1">
                            {title}
                          </h5>
                          <p className="text-[10px] text-slate-500 font-medium leading-snug line-clamp-2">
                            {shortDescription}
                          </p>
                        </div>

                        {/* Bottom Right Arrow */}
                        <div className="flex justify-end pt-1">
                          <ChevronRight className="w-3.5 h-3.5 text-[#F97316] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Fallback Layout */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2.5">
            <Link
              href="/services/modular-kitchen-design"
              onClick={onClose}
              className="group bg-white p-4 rounded-2xl border border-[#E4DCD0] hover:border-[#F97316] hover:shadow-md transition-all flex flex-col justify-between space-y-3 min-h-[120px]"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0C4A6E]/5 text-[#0C4A6E] flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-[#F97316]" />
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-900">Modular Kitchen Design</h5>
                <p className="text-[10px] text-slate-500 font-medium">L-shaped, Island & Parallel modular kitchens</p>
              </div>
              <div className="flex justify-end">
                <ChevronRight className="w-3.5 h-3.5 text-[#F97316]" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
