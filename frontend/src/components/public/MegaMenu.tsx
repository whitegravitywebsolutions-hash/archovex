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
  Sparkles
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
        className="absolute top-full left-0 w-[680px] max-w-[95vw] bg-white text-slate-900 border border-t-0 border-slate-200/90 shadow-2xl rounded-b-2xl p-6 z-50 transition-all duration-200 animate-fade-in mt-0"
        onMouseLeave={onClose}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {validColumns.map((col, colIdx) => {
            const items = col.items || (col as any).mega_menu_items || [];
            return (
              <div key={col.id || colIdx} className="space-y-3">
                {col.title && (
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>{col.title}</span>
                    <Sparkles className="w-3 h-3 text-blue-500" />
                  </h4>
                )}
                <div className="space-y-1">
                  {items.map((sub: any, itemIdx: number) => (
                    <Link
                      key={sub.id || itemIdx}
                      href={sub.url || '/designs'}
                      onClick={onClose}
                      className="group flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                      <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                        {sub.label}
                      </span>
                      {sub.description && (
                        <span className="text-[9px] font-black uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
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

  // Fallback if no columns configured yet
  const fallbackItems = [
    { label: 'Home Interiors', url: '/designs', icon: Home },
    { label: 'Modular Kitchen', url: '/designs/modular-kitchen-designs', icon: Utensils },
    { label: 'Living Room', url: '/designs/living-room-designs', icon: Sofa },
    { label: 'Bedroom', url: '/designs/bedroom-designs', icon: BedDouble },
    { label: 'Wardrobe', url: '/designs/wardrobe-designs', icon: DoorClosed },
    { label: 'Space Saving Furniture', url: '/designs/space-saving-designs', icon: Maximize2 },
    { label: 'Home Office', url: '/designs/home-office-designs', icon: Monitor },
    { label: 'Bathroom', url: '/designs/bathroom-designs', icon: Bath },
    { label: '2BHK Interiors', url: '/designs?layout=2BHK', icon: Building },
    { label: '3BHK Interiors', url: '/designs?layout=3BHK', icon: Building2 },
  ];

  return (
    <div
      className="absolute top-full left-0 w-[580px] max-w-[94vw] bg-white text-slate-900 border border-t-0 border-slate-200/90 shadow-2xl rounded-b-2xl p-6 z-50 transition-all duration-200 animate-fade-in mt-0"
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {fallbackItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <Link
              key={idx}
              href={item.url}
              onClick={onClose}
              className="group flex items-center gap-3.5 py-3 border-b border-slate-100 hover:border-slate-200 hover:bg-slate-50/90 px-3 rounded-xl transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 flex items-center justify-center transition-colors shadow-2xs flex-shrink-0">
                <IconComp className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-black transition-colors">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
