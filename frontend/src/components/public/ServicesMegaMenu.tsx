'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ChevronRight, 
  ArrowRight
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface ServicesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: any[];
}

const DEFAULT_SERVICES_ITEMS = [
  { title: 'Full Home Interior Design', slug: 'full-home-interior-design', short_description: 'Complete 2BHK/3BHK/Villa interior solutions' },
  { title: 'Modular Kitchen Design', slug: 'modular-kitchen-design', short_description: 'L-shaped, Island & Parallel modular kitchens' },
  { title: 'Living Room Interior Design', slug: 'living-room-interior-design', short_description: 'TV console units, foyers & lounge spaces' },
  { title: 'Bedroom Interior Design', slug: 'bedroom-interior-design', short_description: 'Master bedrooms, kids rooms & guest suites' },
  { title: 'Wardrobe Design', slug: 'wardrobe-design', short_description: 'Sliding glass, walk-in & hinged wardrobes' },
  { title: 'Home Renovation & Remodeling', slug: 'home-renovation', short_description: 'Civil changes, flooring, painting & upgrades' },
  { title: 'Office Interior Design', slug: 'office-interior-design', short_description: 'Modern workspaces & private cabins' },
  { title: 'Corporate Office Interior Design', slug: 'corporate-office-interior-design', short_description: 'Turnkey IT parks & corporate floors' },
  { title: 'Commercial Interior Design', slug: 'commercial-interior-design', short_description: 'Retail stores, showrooms & cafes' },
  { title: 'Turnkey Interior Design', slug: 'turnkey-interior-design', short_description: 'End-to-end design to handover execution' },
];

export default function ServicesMegaMenu({ isOpen, onClose, categories }: ServicesMegaMenuProps) {
  const [items, setItems] = useState<any[]>(
    Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_SERVICES_ITEMS
  );

  useEffect(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      setItems(categories);
    } else {
      apiClient.get('/categories').then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setItems(res.data.data);
        }
      }).catch((err) => console.error(err));
    }
  }, [categories]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 w-full bg-[#FAF8F3] text-slate-900 border-t-4 border-[#F97316] border-x border-b border-[#E4DCD0] shadow-2xl rounded-b-3xl p-6 lg:p-7 z-50 transition-all duration-200 animate-fade-in mt-0"
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-5 border-b border-[#E4DCD0] mb-5">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-black text-[#0C4A6E] uppercase tracking-wider">
            ARCHOVEX INTERIOR SERVICES
          </h3>
          <span className="text-[10px] font-black uppercase bg-[#F97316]/10 text-[#EA580C] px-3 py-1 rounded-full border border-[#F97316]/20 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#F97316]" /> {items.length} SPECIALIZED OFFERINGS
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

      {/* Dynamic Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {items.map((item: any) => {
          const title = item.name || item.title;
          const slug = item.slug;
          const subtitle = item.short_description || item.subtitle || 'Custom interior design & execution';

          return (
            <Link
              key={slug || item.id}
              href={`/services/${slug}`}
              onClick={onClose}
              className="group relative bg-white p-4 rounded-2xl border border-[#E4DCD0] hover:border-[#F97316] hover:shadow-md transition-all flex flex-col justify-between space-y-3 min-h-[120px]"
            >
              {/* Top Row: Single Consistent Icon */}
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#0C4A6E]/5 group-hover:bg-[#0C4A6E] text-[#0C4A6E] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 group-hover:text-[#0C4A6E] transition-colors line-clamp-1">
                  {title}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium leading-snug line-clamp-2">
                  {subtitle}
                </p>
              </div>

              {/* Bottom Right Orange Arrow */}
              <div className="flex justify-end pt-1">
                <ChevronRight className="w-3.5 h-3.5 text-[#F97316] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
