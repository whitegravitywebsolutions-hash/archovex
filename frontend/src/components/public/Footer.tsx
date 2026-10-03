'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { SocialLink } from '@/types';
import { Phone, Mail, MapPin, ShieldCheck, Award, Clock, MessageSquare } from 'lucide-react';

interface FooterProps {
  settings?: Record<string, any>;
  socialLinks?: SocialLink[];
}

export default function Footer({ settings = {}, socialLinks = [] }: FooterProps) {
  const phone = settings.phone || '+91 98765 43210';
  const email = settings.email || 'contact@archovex.com';
  const address = settings.address || 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001';
  const whatsapp = settings.whatsapp || '+919876543210';
  const copyright = settings.copyright || `© ${new Date().getFullYear()} ARCHOVEX INFRA PRIVATE LIMITED. All rights reserved.`;

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
          <div className="lg:col-span-2 space-y-4">
            <Logo light />
            <p className="text-xs text-sky-100/90 leading-relaxed max-w-sm">
              ARCHOVEX INFRA PRIVATE LIMITED is an architectural & interior design firm delivering bespoke modular kitchens, living room concepts, custom wardrobes, and turnkey home interiors across India.
            </p>
            <div className="pt-2 text-xs text-sky-200 flex items-center gap-4">
              <Link href="/contact" className="hover:text-[#F97316] transition-colors font-medium">Contact Us</Link>
              <span>•</span>
              <Link href="/admin/login" className="hover:text-[#F97316] transition-colors font-medium">Admin Portal Login</Link>
            </div>
          </div>

          {/* Quick Design Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#F97316] border-b border-sky-800/80 pb-2">
              Design Categories
            </h4>
            <ul className="space-y-2 text-xs font-medium text-sky-100/90">
              <li><Link href="/designs/modular-kitchen-designs" className="hover:text-white transition-colors">Modular Kitchen Designs</Link></li>
              <li><Link href="/designs/living-room-designs" className="hover:text-white transition-colors">Living Room Designs</Link></li>
              <li><Link href="/designs/wardrobe-designs" className="hover:text-white transition-colors">Wardrobe Designs</Link></li>
              <li><Link href="/designs/end-to-end-offerings" className="hover:text-white transition-colors">End-to-End Offerings</Link></li>
              <li><Link href="/designs" className="hover:text-white transition-colors">All Interior Designs</Link></li>
            </ul>
          </div>

          {/* Contact Details (Replaces Company) */}
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
              <div className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider block">WhatsApp Helpline</span>
                  <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors font-semibold">{whatsapp}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sky-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sky-200">
          <p>{copyright}</p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F97316] transition-colors font-semibold text-xs uppercase"
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
