'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './Logo';
import { SocialLink } from '@/types';
import { Phone, Mail, MapPin } from 'lucide-react';
import { getImageUrl, apiClient } from '@/lib/api';

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

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const DEFAULT_LOCATIONS = [
  { label: 'Interior Designers in Noida', url: '/locations/noida' },
  { label: 'Interior Designers in Greater Noida', url: '/locations/greater-noida' },
  { label: 'Interior Designers in Delhi', url: '/locations/delhi' },
  { label: 'Interior Designers in New Delhi', url: '/locations/new-delhi' },
  { label: 'Interior Designers in Gurgaon', url: '/locations/gurgaon' },
];

const DEFAULT_SERVICES = [
  { label: 'Full Home Interior Design', url: '/services/full-home-interior-design' },
  { label: 'Modular Kitchen Design', url: '/services/modular-kitchen-design' },
  { label: 'Living Room Interior Design', url: '/services/living-room-interior-design' },
  { label: 'Bedroom Interior Design', url: '/services/bedroom-interior-design' },
  { label: 'Wardrobe Design', url: '/services/wardrobe-design' },
  { label: 'Home Renovation & Remodeling', url: '/services/home-renovation' },
  { label: 'Office Interior Design', url: '/services/office-interior-design' },
  { label: 'Corporate Office Interior Design', url: '/services/corporate-office-interior-design' },
  { label: 'Commercial Interior Design', url: '/services/commercial-interior-design' },
  { label: 'Turnkey Interior Design', url: '/services/turnkey-interior-design' },
];

const parsePipeLinks = (rawText: string, fallback: { label: string; url: string }[]) => {
  if (!rawText || !rawText.trim()) return fallback;
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return fallback;
  return lines.map((line) => {
    const parts = line.split('|');
    const label = parts[0]?.trim() || line;
    const url = parts[1]?.trim() || '#';
    return { label, url };
  });
};

interface FooterProps {
  settings?: Record<string, any>;
  socialLinks?: SocialLink[];
}

export default function Footer({ settings: initialSettings = {}, socialLinks: initialSocials = [] }: FooterProps) {
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>(initialSettings);
  const [socials, setSocials] = useState<SocialLink[]>(initialSocials);

  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      setSiteSettings((prev) => ({ ...prev, ...initialSettings }));
    }
  }, [initialSettings]);

  useEffect(() => {
    const fetchLiveSettings = () => {
      apiClient.get('/home').then((res) => {
        if (res.data?.success && res.data.settings) {
          setSiteSettings(res.data.settings);
        }
        if (res.data?.success && Array.isArray(res.data.social_links)) {
          setSocials(res.data.social_links);
        }
      }).catch(() => {});
    };

    fetchLiveSettings();

    if (typeof window !== 'undefined') {
      window.addEventListener('settingsUpdated', fetchLiveSettings);
      return () => window.removeEventListener('settingsUpdated', fetchLiveSettings);
    }
  }, []);

  const phone = siteSettings.phone || '+91 98765 43210';
  const email = siteSettings.email || 'contact@archovex.com';
  const address = siteSettings.address || 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001';

  const footerLogo = siteSettings.footer_logo;
  const footerDesc = siteSettings.footer_description || 'ARCHOVEX INFRA PRIVATE LIMITED is an architectural & interior design firm delivering bespoke modular kitchens, living room concepts, custom wardrobes, and turnkey home interiors across India.';
  const footerCopyright = siteSettings.footer_copyright || siteSettings.copyright || '2026 Archovex. All Rights Reserved.';
  const privacyUrl = siteSettings.footer_privacy_url || '/privacy-policy';
  const termsUrl = siteSettings.footer_terms_url || '/terms-and-conditions';

  const locationsList = parsePipeLinks(siteSettings.footer_locations, DEFAULT_LOCATIONS);
  const servicesList = parsePipeLinks(siteSettings.footer_services, DEFAULT_SERVICES);

  // Social Links Resolution
  let instagramUrl = siteSettings.instagram_url || siteSettings.instagram;
  if (!instagramUrl && Array.isArray(socials) && socials.length > 0) {
    const found = socials.find((s) => (s.platform || '').toLowerCase().includes('insta'));
    if (found?.url) instagramUrl = found.url;
  }
  if (!instagramUrl) instagramUrl = 'https://instagram.com';

  let facebookUrl = siteSettings.facebook_url || siteSettings.facebook;
  if (!facebookUrl && Array.isArray(socials) && socials.length > 0) {
    const found = socials.find((s) => {
      const p = (s.platform || '').toLowerCase();
      return p.includes('face') || p.includes('fb');
    });
    if (found?.url) facebookUrl = found.url;
  }
  if (!facebookUrl) facebookUrl = 'https://facebook.com';

  let rawWhatsapp = siteSettings.whatsapp;
  if (!rawWhatsapp && Array.isArray(socials) && socials.length > 0) {
    const found = socials.find((s) => {
      const p = (s.platform || '').toLowerCase();
      return p.includes('what') || p.includes('wa');
    });
    if (found?.url) rawWhatsapp = found.url;
  }
  if (!rawWhatsapp) rawWhatsapp = '+919876543210';
  const whatsappUrl = rawWhatsapp.startsWith('http')
    ? rawWhatsapp
    : `https://wa.me/${rawWhatsapp.replace(/[^0-9]/g, '')}`;

  const twitterUrl = siteSettings.twitter_url;
  const youtubeUrl = siteSettings.youtube_url;
  const linkedinUrl = siteSettings.linkedin_url;

  const socialItems = [
    { id: 'instagram', name: 'Instagram', url: instagramUrl, Icon: InstagramIcon },
    { id: 'facebook', name: 'Facebook', url: facebookUrl, Icon: FacebookIcon },
    { id: 'whatsapp', name: 'WhatsApp', url: whatsappUrl, Icon: WhatsappIcon },
    ...(twitterUrl ? [{ id: 'twitter', name: 'Twitter', url: twitterUrl, Icon: TwitterIcon }] : []),
    ...(youtubeUrl ? [{ id: 'youtube', name: 'YouTube', url: youtubeUrl, Icon: YoutubeIcon }] : []),
    ...(linkedinUrl ? [{ id: 'linkedin', name: 'LinkedIn', url: linkedinUrl, Icon: LinkedinIcon }] : []),
  ];

  return (
    <footer className="bg-[#FAF9F6] text-slate-800 pt-16 pb-12 border-t border-slate-200/90 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            {footerLogo ? (
              <Link href="/" className="inline-block relative h-16 w-48">
                <Image
                  src={getImageUrl(footerLogo)}
                  alt="Footer Logo"
                  fill
                  className="object-contain object-left"
                />
              </Link>
            ) : (
              <Logo />
            )}

            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              {footerDesc}
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {socialItems.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.name}
                  aria-label={item.name}
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#EA580C] text-slate-800 hover:text-white border border-slate-200 shadow-2xs flex items-center justify-center transition-all group cursor-pointer"
                >
                  <item.Icon className="w-4 h-4 text-[#EA580C] group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* All Locations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              All Locations
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-800">
              {locationsList.map((loc, i) => (
                <li key={i}>
                  <Link href={loc.url} className="hover:text-[#EA580C] transition-colors block py-0.5 tracking-wide">
                    {loc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              Services
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-800">
              {servicesList.map((srv, i) => (
                <li key={i}>
                  <Link href={srv.url} className="hover:text-[#EA580C] transition-colors block py-0.5 tracking-wide">
                    {srv.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              Contact Details
            </h4>
            <div className="space-y-3.5 text-xs text-slate-800 font-bold">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
                  <MapPin className="w-4 h-4 text-[#EA580C] flex-shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold tracking-wider block mb-0.5">Address</span>
                  <span className="text-slate-800 leading-snug font-bold">{address}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
                  <Phone className="w-4 h-4 text-[#EA580C] flex-shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold tracking-wider block mb-0.5">Direct Call</span>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-slate-900 font-extrabold hover:text-[#EA580C] transition-colors">{phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
                  <Mail className="w-4 h-4 text-[#EA580C] flex-shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold tracking-wider block mb-0.5">Email Address</span>
                  <a href={`mailto:${email}`} className="text-slate-900 font-extrabold hover:text-[#EA580C] transition-colors">{email}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-700 font-bold">
          <div className="flex flex-wrap items-center gap-2 font-bold">
            <span>{footerCopyright}</span>
            <span className="text-slate-300">|</span>
            <Link href={privacyUrl} className="hover:text-[#EA580C] transition-colors tracking-wider">Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href={termsUrl} className="hover:text-[#EA580C] transition-colors tracking-wider">Terms & Conditions</Link>
          </div>

          <div className="text-xs font-bold">
            <span>
              Designed & Developed by{' '}
              <a 
                href="https://whitegravity.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-900 hover:text-[#EA580C] font-extrabold transition-colors underline decoration-[#EA580C]/50 underline-offset-2"
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
