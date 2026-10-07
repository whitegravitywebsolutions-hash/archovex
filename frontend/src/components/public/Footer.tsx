'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { SocialLink } from '@/types';
import { Phone, Mail, MapPin, ShieldCheck, Award, Clock } from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

interface FooterProps {
  settings?: Record<string, any>;
  socialLinks?: SocialLink[];
}

export default function Footer({ settings = {}, socialLinks = [] }: FooterProps) {
  const phone = settings.phone || '+91 98765 43210';
  const email = settings.email || 'contact@archovex.com';
  const address = settings.address || 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001';

  // 1. Determine Instagram URL (Settings > socialLinks > Fallback)
  let instagramUrl = settings.instagram_url || settings.instagram;
  if (!instagramUrl && Array.isArray(socialLinks) && socialLinks.length > 0) {
    const found = socialLinks.find((s) => (s.platform || '').toLowerCase().includes('insta'));
    if (found?.url) instagramUrl = found.url;
  }
  if (!instagramUrl) instagramUrl = 'https://instagram.com';

  // 2. Determine Facebook URL (Settings > socialLinks > Fallback)
  let facebookUrl = settings.facebook_url || settings.facebook;
  if (!facebookUrl && Array.isArray(socialLinks) && socialLinks.length > 0) {
    const found = socialLinks.find((s) => {
      const p = (s.platform || '').toLowerCase();
      return p.includes('face') || p.includes('fb');
    });
    if (found?.url) facebookUrl = found.url;
  }
  if (!facebookUrl) facebookUrl = 'https://facebook.com';

  // 3. Determine WhatsApp URL (Settings > socialLinks > Fallback)
  let rawWhatsapp = settings.whatsapp;
  if (!rawWhatsapp && Array.isArray(socialLinks) && socialLinks.length > 0) {
    const found = socialLinks.find((s) => {
      const p = (s.platform || '').toLowerCase();
      return p.includes('what') || p.includes('wa');
    });
    if (found?.url) rawWhatsapp = found.url;
  }
  if (!rawWhatsapp) rawWhatsapp = '+919876543210';
  const whatsappUrl = rawWhatsapp.startsWith('http')
    ? rawWhatsapp
    : `https://wa.me/${rawWhatsapp.replace(/[^0-9]/g, '')}`;

  const socialItems = [
    { id: 'instagram', name: 'Instagram', url: instagramUrl, Icon: InstagramIcon },
    { id: 'facebook', name: 'Facebook', url: facebookUrl, Icon: FacebookIcon },
    { id: 'whatsapp', name: 'WhatsApp', url: whatsappUrl, Icon: WhatsappIcon },
  ];

  return (
    <footer className="bg-[#0C4A6E] text-slate-200 pt-16 pb-12 border-t border-sky-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Trust Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-sky-800/60">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#075985]/60 border border-sky-700/60">
            <div className="p-3 bg-[#F97316]/20 text-[#F97316] rounded-xl border border-[#F97316]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">10-Year Warranty</h4>
              <p className="text-xs text-sky-100/90">Flat 10 years material warranty on all modular units.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#075985]/60 border border-sky-700/60">
            <div className="p-3 bg-[#F97316]/20 text-[#F97316] rounded-xl border border-[#F97316]/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">German Hardware</h4>
              <p className="text-xs text-sky-100/90">Soft-close Blum & Hettich tandem drawer systems.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#075985]/60 border border-sky-700/60">
            <div className="p-3 bg-[#F97316]/20 text-[#F97316] rounded-xl border border-[#F97316]/30">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">45-Day Delivery</h4>
              <p className="text-xs text-sky-100/90">Guaranteed on-time installation or we pay penalty.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo light />
            <p className="text-xs text-sky-100/90 leading-relaxed">
              ARCHOVEX INFRA PRIVATE LIMITED is an architectural & interior design firm delivering bespoke modular kitchens, living room concepts, custom wardrobes, and turnkey home interiors across India.
            </p>

            {/* ONLY Instagram, Facebook & WhatsApp Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {socialItems.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.name}
                  aria-label={item.name}
                  className="w-9 h-9 rounded-full bg-[#075985]/80 hover:bg-[#F97316] text-sky-100 hover:text-white border border-sky-700/60 flex items-center justify-center transition-all shadow-xs group"
                >
                  <item.Icon className="w-4.5 h-4.5 text-[#F97316] group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* All Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#F97316] border-b border-sky-800/80 pb-2">
              All Locations
            </h4>
            <ul className="space-y-2 text-xs font-medium text-sky-100/90">
              <li><Link href="/locations/noida" className="hover:text-white transition-colors">Interior Designers in Noida</Link></li>
              <li><Link href="/locations/greater-noida" className="hover:text-white transition-colors">Interior Designers in Greater Noida</Link></li>
              <li><Link href="/locations/delhi" className="hover:text-white transition-colors">Interior Designers in Delhi</Link></li>
              <li><Link href="/locations/new-delhi" className="hover:text-white transition-colors">Interior Designers in New Delhi</Link></li>
              <li><Link href="/locations/gurgaon" className="hover:text-white transition-colors">Interior Designers in Gurgaon</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#F97316] border-b border-sky-800/80 pb-2">
              Services
            </h4>
            <ul className="space-y-2 text-xs font-medium text-sky-100/90">
              <li><Link href="/services/full-home-interior-design" className="hover:text-white transition-colors">Full Home Interior Design</Link></li>
              <li><Link href="/services/modular-kitchen-design" className="hover:text-white transition-colors">Modular Kitchen Design</Link></li>
              <li><Link href="/services/living-room-interior-design" className="hover:text-white transition-colors">Living Room Interior Design</Link></li>
              <li><Link href="/services/bedroom-interior-design" className="hover:text-white transition-colors">Bedroom Interior Design</Link></li>
              <li><Link href="/services/wardrobe-design" className="hover:text-white transition-colors">Wardrobe Design</Link></li>
              <li><Link href="/services/home-renovation-remodeling" className="hover:text-white transition-colors">Home Renovation & Remodeling</Link></li>
              <li><Link href="/services/office-interior-design" className="hover:text-white transition-colors">Office Interior Design</Link></li>
              <li><Link href="/services/corporate-office-interior-design" className="hover:text-white transition-colors">Corporate Office Interior Design</Link></li>
              <li><Link href="/services/commercial-interior-design" className="hover:text-white transition-colors">Commercial Interior Design</Link></li>
              <li><Link href="/services/turnkey-interior-design" className="hover:text-white transition-colors">Turnkey Interior Design</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#F97316] border-b border-sky-800/80 pb-2">
              Contact Details
            </h4>
            <div className="space-y-3 text-xs text-sky-100/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F97316] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider block">Address</span>
                  <span>{address}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#F97316] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider block">Direct Call</span>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#F97316] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider block">Email Address</span>
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sky-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sky-200">
          <div className="flex flex-wrap items-center gap-2 font-medium">
            <span>2026 Archovex. All Rights Reserved.</span>
            <span className="text-sky-400">|</span>
            <Link href="/privacy-policy" className="hover:text-[#F97316] transition-colors">Privacy Policy</Link>
            <span className="text-sky-400">|</span>
            <Link href="/terms-and-conditions" className="hover:text-[#F97316] transition-colors">Terms & Conditions</Link>
          </div>

          <div className="text-xs font-medium">
            <span>
              Designed & Developed by{' '}
              <a 
                href="https://whitegravity.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-[#F97316] font-semibold transition-colors underline decoration-[#F97316]/50 underline-offset-2"
              >
                White Gravity Web Solutions
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
