'use client';

import React, { useState } from 'react';
import { Faq } from '@/types';
import { ChevronDown } from 'lucide-react';

interface FAQProps {
  faqs: Faq[];
}

export default function FAQAccordion({ faqs }: FAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;

        return (
          <div
            key={faq.id || idx}
            className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm transition-all"
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors"
            >
              <span>{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3 animate-fade-in">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
