'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MenuItem, City } from '@/types';
import { X, ChevronDown, Phone, MapPin, Sparkles } from 'lucide-react';
import Logo from './Logo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  cities?: City[];
  onOpenConsultation: () => void;
}

const DEFAULT_SERVICES_LIST = [
  { title: 'Full Home Interior Design', slug: 'full-home-interior-design' },
  { title: 'Modular Kitchen Design', slug: 'modular-kitchen-design' },
  { title: 'Living Room Interior Design', slug: 'living-room-interior-design' },
  { title: 'Bedroom Interior Design', slug: 'bedroom-interior-design' },
  { title: 'Wardrobe Design', slug: 'wardrobe-design' },
  { title: 'Home Renovation & Remodeling', slug: 'home-renovation' },
  { title: 'Office Interior Design', slug: 'office-interior-design' },
  { title: 'Commercial Interior Design', slug: 'commercial-interior-design' },
  { title: 'Turnkey Interior Design', slug: 'turnkey-interior-design' },
];

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
              const labelLower = (item.label || '').toLowerCase();
              const urlLower = (item.url || '').toLowerCase();
              const isCityItem = labelLower.includes('location') || labelLower.includes('city') || urlLower === '/locations' || urlLower === '/cities' || item.type === 'city' || item.type === 'locationsmenu';
              const isServiceItem = (labelLower.includes('service') || labelLower.includes('design') || urlLower === '/services' || urlLower === '/designs' || item.type === 'servicesmenu' || item.type === 'megamenu') && !labelLower.includes('blog');
              const hasMegaCols = item.mega_columns && item.mega_columns.length > 0;
              const hasSub = hasMegaCols || isServiceItem || isCityItem;
              const isSubOpen = openSubIndex === idx;

              return (
                <div key={item.id} className="border-b border-slate-50 pb-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.url || '#'}
                      onClick={onClose}
                      className="text-sm font-bold text-slate-800 hover:text-[#0C4A6E] transition-colors uppercase tracking-wider py-1 flex-grow"
                    >
                      {item.label}
                    </Link>

                    {hasSub && (
                      <button
                        onClick={() => setOpenSubIndex(isSubOpen ? null : idx)}
                        className="p-2 text-slate-400 hover:text-[#0C4A6E] flex items-center gap-1 text-xs font-semibold"
                        aria-label={`Toggle ${item.label} dropdown`}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubOpen ? 'rotate-180 text-[#F97316]' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Custom DB Mega Menu Accordion */}
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
                                  className="text-xs font-semibold text-slate-600 hover:text-[#0C4A6E] block py-1"
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

                  {/* Services Accordion */}
                  {isServiceItem && !hasMegaCols && isSubOpen && (
                    <div className="pl-3 pt-2 space-y-2 bg-[#FAF8F3] border border-[#E4DCD0] rounded-xl p-3 mt-2 animate-fade-in">
                      <div className="flex items-center justify-between pb-1 border-b border-[#E4DCD0]">
                        <span className="text-[10px] font-black text-[#0C4A6E] uppercase tracking-widest block">
                          OUR SERVICES HUB
                        </span>
                        <Link
                          href="/services"
                          onClick={onClose}
                          className="text-[10px] font-bold text-[#F97316] hover:underline"
                        >
                          View All
                        </Link>
                      </div>
                      <ul className="space-y-1.5 pt-1">
                        {DEFAULT_SERVICES_LIST.map((srv) => (
                          <li key={srv.slug}>
                            <Link
                              href={`/services/${srv.slug}`}
                              onClick={onClose}
                              className="text-xs font-bold text-slate-700 hover:text-[#0C4A6E] py-1 flex items-center gap-2"
                            >
                              <Sparkles className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                              <span>{srv.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Locations Accordion */}
                  {isCityItem && !hasMegaCols && isSubOpen && (
                    <div className="pl-3 pt-2 space-y-2 bg-[#FAF8F3] border border-[#E4DCD0] rounded-xl p-3 mt-2 animate-fade-in">
                      <div className="flex items-center justify-between pb-1 border-b border-[#E4DCD0]">
                        <span className="text-[10px] font-black text-[#0C4A6E] uppercase tracking-widest block">
                          LOCATION STUDIOS
                        </span>
                        <Link
                          href="/locations"
                          onClick={onClose}
                          className="text-[10px] font-bold text-[#F97316] hover:underline"
                        >
                          View All
                        </Link>
                      </div>
                      <ul className="space-y-1.5 pt-1">
                        {(cities.length > 0 ? cities : [
                          { id: 1, name: 'Delhi NCR', slug: 'delhi-ncr', state: 'North India' },
                          { id: 2, name: 'Gurugram', slug: 'gurugram', state: 'Haryana' },
                          { id: 3, name: 'Noida', slug: 'noida', state: 'Uttar Pradesh' },
                          { id: 4, name: 'Bengaluru', slug: 'bengaluru', state: 'Karnataka' },
                          { id: 5, name: 'Mumbai', slug: 'mumbai', state: 'Maharashtra' },
                        ]).map((c) => (
                          <li key={c.id}>
                            <Link
                              href={`/locations/${c.slug}`}
                              onClick={onClose}
                              className="text-xs font-bold text-slate-700 hover:text-[#0C4A6E] py-1 flex items-center justify-between"
                            >
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-[#F97316]" />
                                {c.name}
                              </span>
                              {c.state && <span className="text-[10px] text-slate-400 font-medium">{c.state}</span>}
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
            className="w-full py-3.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all border border-amber-300/40"
          >
            GET FREE CONSULTATION
          </button>

          <a
            href="tel:+919876543210"
            className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-[#0C4A6E] py-2"
          >
            <Phone className="w-4 h-4 text-[#F97316]" /> +91 98765 43210
          </a>
        </div>
      </div>
    </div>
  );
}
