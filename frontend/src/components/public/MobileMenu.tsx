'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MenuItem, City } from '@/types';
import { X, ChevronDown, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  cities?: City[];
  onOpenConsultation: () => void;
}

export default function MobileMenu({ isOpen, onClose, items, cities = [], onOpenConsultation }: MobileMenuProps) {
  const [openSubIndex, setOpenSubIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <Logo />
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="py-6 space-y-3">
            {items.map((item, idx) => {
              const isCityItem = item.label.toLowerCase() === 'cities' || item.url === '/cities' || item.type === 'city';
              const hasMegaCols = item.mega_columns && item.mega_columns.length > 0;
              const hasSub = hasMegaCols || (isCityItem && cities.length > 0);
              const isSubOpen = openSubIndex === idx;

              return (
                <div key={item.id} className="border-b border-slate-50 pb-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.url || '#'}
                      onClick={onClose}
                      className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors uppercase tracking-wider py-1"
                    >
                      {item.label}
                    </Link>

                    {hasSub && (
                      <button
                        onClick={() => setOpenSubIndex(isSubOpen ? null : idx)}
                        className="p-2 text-slate-400 hover:text-slate-800"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isSubOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Mega Menu Accordion */}
                  {hasMegaCols && isSubOpen && (
                    <div className="pl-4 pt-2 space-y-4 bg-slate-50 rounded-xl p-3 mt-2">
                      {item.mega_columns!.map((col) => (
                        <div key={col.id} className="space-y-1">
                          {col.title && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                              {col.title}
                            </span>
                          )}
                          <ul className="space-y-1.5 pl-2">
                            {col.items.map((mItem) => (
                              <li key={mItem.id}>
                                <Link
                                  href={mItem.url || '#'}
                                  onClick={onClose}
                                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 block py-1"
                                >
                                  {mItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dynamic City Accordion */}
                  {isCityItem && !hasMegaCols && isSubOpen && cities.length > 0 && (
                    <div className="pl-4 pt-2 space-y-3 bg-slate-50 rounded-xl p-3 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        Experience Studios
                      </span>
                      <ul className="space-y-1.5 pl-2">
                        {cities.map((c) => (
                          <li key={c.id}>
                            <Link
                              href={`/cities/${c.slug}`}
                              onClick={onClose}
                              className="text-xs font-semibold text-slate-700 hover:text-blue-600 py-1 flex items-center justify-between"
                            >
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-blue-600" />
                                {c.name}
                              </span>
                              {c.state && <span className="text-[10px] text-slate-400">{c.state}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer CTA */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <button
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all"
          >
            BOOK FREE CONSULTATION
          </button>

          <a
            href="tel:+919876543210"
            className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 py-2"
          >
            <Phone className="w-4 h-4 text-blue-600" /> +91 98765 43210
          </a>
        </div>
      </div>
    </div>
  );
}
