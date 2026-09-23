'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  number?: string;
  message?: string;
}

export default function FloatingWhatsAppButton({
  number = '+919876543210',
  message = 'Hello ARCHOVEX team! I am interested in interior design consultation.',
}: FloatingWhatsAppProps) {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 text-xs font-bold tracking-wider uppercase">
        Chat on WhatsApp
      </span>
    </a>
  );
}
