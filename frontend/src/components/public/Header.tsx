'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import ServicesMegaMenu from './ServicesMegaMenu';
import MegaMenu from './MegaMenu';
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
  { id: 19, menu_id: 1, label: 'About Us', url: '/about-us', type: 'link', sort_order: 2, is_active: true, open_new_tab: false },
  { id: 2, menu_id: 1, label: 'Services', url: '/services', type: 'link', sort_order: 3, is_active: true, open_new_tab: false },
  { id: 18, menu_id: 1, label: 'Blog', url: '/blog', type: 'link', sort_order: 4, is_active: true, open_new_tab: false },
  { id: 17, menu_id: 1, label: 'Locations', url: '/locations', type: 'link', sort_order: 5, is_active: true, open_new_tab: false },
  { id: 8, menu_id: 1, label: 'Contact Us', url: '/contact-us', type: 'link', sort_order: 6, is_active: true, open_new_tab: false },
];

let globalCachedMenuItems: MenuItem[] | null = null;

export default function Header({ initialMenu = [], cities = [] }: HeaderProps) {
  const pathname = usePathname() || '';
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    if (initialMenu && initialMenu.length > 0) return initialMenu;
    if (globalCachedMenuItems && globalCachedMenuItems.length > 0) return globalCachedMenuItems;
    return DEFAULT_MENU_ITEMS;
  });

  const [cityList, setCityList] = useState<City[]>(cities);
  const [activeMegaIdx, setActiveMegaIdx] = useState<number | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultRequirement, setDefaultRequirement] = useState('');
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

  // Close open mega menus cleanly when route changes
  useEffect(() => {
    setActiveMegaIdx(null);
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (initialMenu && initialMenu.length > 0) {
      setMenuItems(initialMenu);
      globalCachedMenuItems = initialMenu;
    } else {
      apiClient.get('/menus').then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const unique = Array.from(new Map<number, MenuItem>(res.data.data.map((item: MenuItem) => [item.id, item])).values());
          setMenuItems(unique);
          globalCachedMenuItems = unique;
        }
      }).catch((err) => console.error('Failed to fetch dynamic menus:', err));
    }
  }, [initialMenu]);

  useEffect(() => {
    if (cities.length > 0) {
      setCityList(cities);
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

      const getServiceByPath = (path: string) => {
        if (path.includes('full-home-interior-design')) return 'Full Home Interior Design';
        if (path.includes('modular-kitchen-design')) return 'Modular Kitchen Design';
        if (path.includes('living-room-interior-design')) return 'Living Room Interior Design';
        if (path.includes('bedroom-interior-design')) return 'Bedroom Interior Design';
        if (path.includes('wardrobe-design')) return 'Wardrobe Design';
        if (path.includes('home-renovation')) return 'Home Renovation & Remodeling';
        if (path.includes('office-interior-design')) return 'Office Interior Design';
        if (path.includes('corporate-office-interior-design')) return 'Corporate Office Interior Design';
        if (path.includes('commercial-interior-design')) return 'Commercial Interior Design';
        if (path.includes('turnkey-interior-design')) return 'Turnkey Interior Design';
        return '';
      };

      const handleOpenModal = (e?: any) => {
        const req = e?.detail?.service || getServiceByPath(window.location.pathname);
        if (req) setDefaultRequirement(req);
        setIsModalOpen(true);
      };
      window.addEventListener('open-consultation-modal', handleOpenModal);

      const handleAnchorClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement)?.closest('a, button');
        if (target) {
          const href = target.getAttribute('href');
          if (href && href.includes('#consultation')) {
            e.preventDefault();
            const req = getServiceByPath(window.location.pathname);
            if (req) setDefaultRequirement(req);
            setIsModalOpen(true);
          }
        }
      };
      window.addEventListener('click', handleAnchorClick);

      return () => {
        window.removeEventListener('storage', updateWishlist);
        window.removeEventListener('wishlistUpdated', updateWishlist);
        window.removeEventListener('open-consultation-modal', handleOpenModal);
        window.removeEventListener('click', handleAnchorClick);
      };
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
          {/* Brand Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 h-full flex-nowrap">
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
                    className={`inline-flex items-center gap-1.5 text-sm font-bold tracking-wider h-full px-0.5 transition-colors ${
                      isActiveParent || isHovered ? 'text-slate-950 font-black' : 'text-slate-800 hover:text-[#EA580C]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isHovered
                            ? 'text-[#EA580C] rotate-180'
                            : isActiveParent
                            ? 'text-[#EA580C]'
                            : 'text-slate-400 group-hover:text-slate-900'
                        }`}
                      />
                    )}
                  </Link>

                  {/* Bottom Active Indicator Line */}
                  {(isHovered || isActiveParent) && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EA580C] rounded-t-full transition-all animate-fade-in" />
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
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-[#EA580C] px-2.5 py-2 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4 text-[#EA580C]" />
              <span>+91 98765 43210</span>
            </a>

            {/* Wishlist Link */}
            <Link
              href="/blogs?wishlist=true"
              className="relative p-2 text-slate-700 hover:text-[#EA580C] rounded-full hover:bg-slate-100 transition-all"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5 text-slate-800" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#EA580C] text-white font-bold text-[9px] rounded-full flex items-center justify-center shadow-2xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Book Consultation Button (Kept visible on mobile) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex px-3 sm:px-5 py-2 sm:py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-[10px] sm:text-xs tracking-wider rounded-xl shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 border border-amber-500/20 whitespace-nowrap cursor-pointer"
            >
              <span className="hidden sm:inline">Get Free Consultation</span>
              <span className="sm:hidden">Free Consultation</span>
            </button>

            {/* Mobile Drawer Trigger (Hamburger) */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
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
        defaultRequirement={defaultRequirement}
      />
    </>
  );
}
