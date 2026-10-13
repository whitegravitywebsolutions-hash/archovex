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

  return (
    <div
      className="absolute top-full left-0 right-0 w-full bg-white/95 backdrop-blur-xl text-slate-900 border-t-2 border-[#F97316] border-x border-b border-slate-200/80 shadow-2xl rounded-b-2xl p-6 lg:p-8 z-50 transition-all duration-200 animate-fade-in mt-0"
      onMouseLeave={onClose}
    >
      {validColumns.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
          {validColumns.map((col, colIdx) => {
            const items = col.items || (col as any).mega_menu_items || [];

            return (
              <div key={col.id || colIdx} className="space-y-1.5">
                <ul className="space-y-1.5">
                  {items.map((sub: any, itemIdx: number) => {
                    const title = sub.label || sub.title || '';
                    const url = sub.url || '/services';
                    const target = sub.target || (sub.open_new_tab ? '_blank' : '_self');

                    return (
                      <li key={sub.id || itemIdx}>
                        <Link
                          href={url}
                          target={target}
                          onClick={onClose}
                          className="group text-xs font-bold text-slate-800 hover:text-[#EA580C] transition-all flex items-center gap-2 py-1"
                        >
                          <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#F97316] group-hover:scale-150 transition-all shrink-0" />
                          <span className="group-hover:translate-x-1 transition-transform truncate">
                            {title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-4 text-center text-xs text-slate-400">
          No menu items configured.
        </div>
      )}
    </div>
  );
}
