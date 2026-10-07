'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import ServicesMegaMenu from './ServicesMegaMenu';
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
  { id: 2, menu_id: 1, label: 'Services', url: '/services', type: 'servicesmenu', sort_order: 2, is_active: true, open_new_tab: false },
  { id: 3, menu_id: 1, label: 'Blogs', url: '/blogs', type: 'link', sort_order: 3, is_active: true, open_new_tab: false },
  { id: 4, menu_id: 1, label: 'Locations', url: '/locations', type: 'city', sort_order: 4, is_active: true, open_new_tab: false },
  { id: 5, menu_id: 1, label: 'Contact', url: '/contact-us', type: 'link', sort_order: 5, is_active: true, open_new_tab: false },
];

export default function Header({ initialMenu = [], cities = [] }: HeaderProps) {
  const pathname = usePathname() || '';
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
    if (initialMenu && initialMenu.length > 0) {
      setMenuItems(initialMenu);
    } else {
      apiClient.get('/menus').then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const unique = Array.from(new Map<number, MenuItem>(res.data.data.map((item: MenuItem) => [item.id, item])).values());
          setMenuItems(unique);
        }
      }).catch((err) => console.error('Failed to fetch dynamic menus:', err));
    }
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
              const labelLower = (item.label || '').toLowerCase();
              const urlLower = (item.url || '').toLowerCase();
              const isLocationsItem = labelLower.includes('location') || labelLower.includes('city') || urlLower === '/locations' || urlLower === '/cities' || item.type === 'city' || item.type === 'locationsmenu';
              const isBlogsItem = labelLower.includes('blog') || urlLower === '/blogs';
              const isServicesItem = (labelLower.includes('service') || urlLower === '/services' || item.type === 'servicesmenu' || item.type === 'megamenu') && !isBlogsItem;
              const hasMega = megaCols.length > 0;
              const hasDropdown = hasMega || isServicesItem || isLocationsItem;
              const isHovered = activeMegaIdx === idx;

              const isExactPage = pathname === urlLower;
              const isChildOfServices = isServicesItem && pathname.startsWith('/services');
              const isChildOfLocations = isLocationsItem && (pathname.startsWith('/locations') || pathname.startsWith('/cities'));
              const isChildOfBlogs = isBlogsItem && pathname.startsWith('/blogs');
              const isActiveParent = isExactPage || isChildOfServices || isChildOfLocations || isChildOfBlogs;

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
                      isActiveParent || isHovered ? 'text-[#0C4A6E] font-black' : 'text-slate-800 hover:text-[#0C4A6E]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isHovered
                            ? 'text-[#F97316] rotate-180'
                            : isActiveParent
                            ? 'text-[#F97316]'
                            : 'text-slate-500 group-hover:text-[#0C4A6E]'
                        }`}
                      />
                    )}
                  </Link>

                  {/* Bottom Touch Active Line */}
                  {(isHovered || isActiveParent) && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#F97316] rounded-t-full transition-all animate-fade-in" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Phone Quick Link */}
            <a
              href="tel:+919876543210"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-[#0C4A6E] hover:text-[#F97316] px-2.5 py-2 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4 text-[#F97316]" />
              <span>+91 98765 43210</span>
            </a>

            {/* Wishlist Link */}
            <Link
              href="/blogs?wishlist=true"
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

            {/* Book Consultation Button (Kept visible on mobile) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex px-3 sm:px-5 py-2 sm:py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-amber-400/30 whitespace-nowrap"
            >
              <span className="hidden sm:inline">GET FREE CONSULTATION</span>
              <span className="sm:hidden">FREE CONSULTATION</span>
            </button>

            {/* Mobile Drawer Trigger (Hamburger) */}
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
                const labelLower = item.label.toLowerCase();
                const megaCols = item.mega_columns || item.megaColumns || [];
                const isLocationsItem = labelLower.includes('location') || labelLower.includes('city') || item.url === '/locations' || item.url === '/cities' || item.type === 'locationsmenu' || item.type === 'city';
                const isServicesItem = labelLower.includes('service') || labelLower.includes('design') || item.url === '/services' || item.url === '/designs' || item.type === 'servicesmenu' || item.type === 'megamenu';

                if (isLocationsItem) {
                  return (
                    <CityMegaMenu
                      cities={cityList}
                      isOpen={true}
                      onClose={() => setActiveMegaIdx(null)}
                    />
                  );
                }

                if (isServicesItem) {
                  if (megaCols.length > 0) {
                    return (
                      <MegaMenu
                        columns={megaCols}
                        isOpen={true}
                        onClose={() => setActiveMegaIdx(null)}
                      />
                    );
                  }
                  return (
                    <ServicesMegaMenu
                      isOpen={true}
                      onClose={() => setActiveMegaIdx(null)}
                    />
                  );
                }

                if (megaCols.length > 0) {
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
