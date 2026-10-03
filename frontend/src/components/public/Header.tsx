'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import MegaMenu from './MegaMenu';
import CityMegaMenu from './CityMegaMenu';
import MobileMenu from './MobileMenu';
import ConsultationFormModal from './ConsultationFormModal';
import { MenuItem, City } from '@/types';
import { Menu as MenuIcon, Phone, Heart, ChevronDown } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface HeaderProps {
  initialMenu?: MenuItem[];
  cities?: City[];
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 1, menu_id: 1, label: 'Home', url: '/', type: 'link', sort_order: 1, is_active: true, open_new_tab: false },
  { id: 2, menu_id: 1, label: 'Design Gallery', url: '/designs', type: 'megamenu', sort_order: 2, is_active: true, open_new_tab: false },
  { id: 3, menu_id: 1, label: 'Cities', url: '#', type: 'city', sort_order: 3, is_active: true, open_new_tab: false },
  { id: 4, menu_id: 1, label: 'Contact', url: '/contact', type: 'link', sort_order: 4, is_active: true, open_new_tab: false },
];

export default function Header({ initialMenu = [], cities = [] }: HeaderProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    initialMenu.length > 0 ? initialMenu : DEFAULT_MENU_ITEMS
  );
  const [cityList, setCityList] = useState<City[]>(cities);
  const [activeMegaIdx, setActiveMegaIdx] = useState<number | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = (idx: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveMegaIdx(idx);
  };

  const handleMenuLeave = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveMegaIdx(null);
    }, 220);
  };

  useEffect(() => {
    if (initialMenu.length > 0) {
      setMenuItems(initialMenu);
    }
    apiClient.get('/menus').then((res) => {
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const unique = Array.from(new Map<number, MenuItem>(res.data.data.map((item: MenuItem) => [item.id, item])).values());
        setMenuItems(unique);
      }
    }).catch((err) => console.error(err));
  }, [initialMenu]);

  useEffect(() => {
    if (cities.length > 0) {
      setCityList(cities);
    } else {
      apiClient.get('/cities').then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setCityList(res.data.data);
        }
      }).catch((err) => console.error(err));
    }
  }, [cities]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateWishlist = () => {
        try {
          const list = JSON.parse(localStorage.getItem('archovex_wishlist') || '[]');
          setWishlistCount(Array.isArray(list) ? list.length : 0);
        } catch {
          setWishlistCount(0);
        }
      };
      updateWishlist();
      window.addEventListener('storage', updateWishlist);
      window.addEventListener('wishlistUpdated', updateWishlist);
      return () => {
        window.removeEventListener('storage', updateWishlist);
        window.removeEventListener('wishlistUpdated', updateWishlist);
      };
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full header-glass border-b border-[#e4dcd0] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[88px] py-2 flex items-center justify-between relative">
          {/* Brand Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full flex-nowrap">
            {menuItems.map((item, idx) => {
              const megaCols = item.mega_columns || item.megaColumns || [];
              const isCityItem = item.label.toLowerCase() === 'cities' || item.url === '/cities' || item.type === 'city';
              const isDesignItem = item.label.toLowerCase().includes('design') || item.url === '/designs';
              const hasMega = megaCols.length > 0 || item.type === 'megamenu' || isDesignItem;
              const hasDropdown = hasMega || (isCityItem && cityList.length > 0);
              const isHovered = activeMegaIdx === idx;

              return (
                <div
                  key={item.id}
                  className="relative h-full flex items-center group py-4"
                  onMouseEnter={() => hasDropdown && handleMenuEnter(idx)}
                  onMouseLeave={() => hasDropdown && handleMenuLeave()}
                >
                  <Link
                    href={item.url || '#'}
                    className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider h-full px-1 transition-colors ${
                      isHovered ? 'text-[#0C4A6E] font-black' : 'text-slate-800 hover:text-[#0C4A6E]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isHovered ? 'text-[#F97316] rotate-180' : 'text-slate-500 group-hover:text-[#0C4A6E]'
                        }`}
                      />
                    )}
                  </Link>

                  {/* Bottom Touch Active Line */}
                  {isHovered && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#F97316] rounded-t-full transition-all animate-fade-in" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-3">
            {/* Phone Quick Link */}
            <a
              href="tel:+919876543210"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#0C4A6E] hover:text-[#F97316] px-3 py-2 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4 text-[#F97316]" />
              <span>+91 98765 43210</span>
            </a>

            {/* Wishlist Link */}
            <Link
              href="/designs?wishlist=true"
              className="relative p-2 text-slate-700 hover:text-[#F97316] rounded-full hover:bg-[#F3EEE4] transition-all"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5 text-[#0C4A6E]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#F97316] text-white font-black text-[9px] rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Book Consultation Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:inline-flex px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-amber-400/30"
            >
              BOOK CONSULTATION
            </button>

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
              aria-label="Toggle Mobile Menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Active Container-Bounded Mega Menu Dropdown */}
          {activeMegaIdx !== null && menuItems[activeMegaIdx] && (
            <div
              className="absolute top-full left-0 right-0 w-full z-50 px-4 sm:px-6 lg:px-8 pointer-events-auto pt-1 -mt-1"
              onMouseEnter={() => {
                if (leaveTimeoutRef.current) {
                  clearTimeout(leaveTimeoutRef.current);
                  leaveTimeoutRef.current = null;
                }
              }}
              onMouseLeave={handleMenuLeave}
            >
              {(() => {
                const item = menuItems[activeMegaIdx];
                const megaCols = item.mega_columns || item.megaColumns || [];
                const isCityItem = item.label.toLowerCase() === 'cities' || item.url === '/cities' || item.type === 'city';
                const isDesignItem = item.label.toLowerCase().includes('design') || item.url === '/designs';
                const hasMega = megaCols.length > 0 || item.type === 'megamenu' || isDesignItem;

                if (isCityItem) {
                  return (
                    <CityMegaMenu
                      cities={cityList}
                      isOpen={true}
                      onClose={() => setActiveMegaIdx(null)}
                    />
                  );
                }

                if (hasMega) {
                  return (
                    <MegaMenu
                      columns={megaCols}
                      isOpen={true}
                      onClose={() => setActiveMegaIdx(null)}
                    />
                  );
                }

                return null;
              })()}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        items={menuItems}
        cities={cityList}
        onOpenConsultation={() => setIsModalOpen(true)}
      />

      {/* Consultation Modal */}
      <ConsultationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cities={cityList}
      />
    </>
  );
}
