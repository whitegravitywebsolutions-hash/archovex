'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { SocialLink } from '@/types';
import { Phone, Mail, MapPin, ShieldCheck, Award, Clock } from 'lucide-react';

interface FooterProps {
  settings?: Record<string, any>;
  socialLinks?: SocialLink[];
}

export default function Footer({ settings = {}, socialLinks = [] }: FooterProps) {
  const phone = settings.phone || '+91 98765 43210';
  const email = settings.email || 'contact@archovex.com';
  const address = settings.address || 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001';
  const copyright = settings.copyright || `© ${new Date().getFullYear()} ARCHOVEX INFRA PRIVATE LIMITED. All rights reserved.`;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Trust Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">10-Year Warranty</h4>
              <p className="text-xs text-slate-300">Flat 10 years material warranty on all modular units.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">German Hardware</h4>
              <p className="text-xs text-slate-300">Soft-close Blum & Hettich tandem drawer systems.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">45-Day Delivery</h4>
              <p className="text-xs text-slate-300">Guaranteed on-time installation or we pay penalty.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo light />
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              ARCHOVEX INFRA PRIVATE LIMITED is an architectural & interior design firm delivering bespoke modular kitchens, living room concepts, custom wardrobes, and turnkey home interiors across India.
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </div>
            </div>
          </div>

          {/* Quick Design Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2">
              Design Categories
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li><Link href="/designs/modular-kitchen-designs" className="hover:text-white transition-colors">Modular Kitchen Designs</Link></li>
              <li><Link href="/designs/living-room-designs" className="hover:text-white transition-colors">Living Room Designs</Link></li>
              <li><Link href="/designs/wardrobe-designs" className="hover:text-white transition-colors">Wardrobe Designs</Link></li>
              <li><Link href="/designs/end-to-end-offerings" className="hover:text-white transition-colors">End-to-End Offerings</Link></li>
              <li><Link href="/designs" className="hover:text-white transition-colors">All Interior Designs</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/admin/login" className="hover:text-blue-400 transition-colors">Admin Portal Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{copyright}</p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors font-semibold text-xs uppercase"
              >
                {soc.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
