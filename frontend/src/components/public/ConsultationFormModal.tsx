'use client';

import React from 'react';
import { X } from 'lucide-react';
import ConsultationForm from './ConsultationForm';
import { City } from '@/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities?: City[];
}

export default function ConsultationFormModal({ isOpen, onClose, cities = [] }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#FAF8F3] rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto border border-[#E4DCD0]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#0C4A6E] hover:bg-[#F3EEE4] rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30 px-3.5 py-1 rounded-full inline-block mb-2 shadow-xs">
            ARCHOVEX INFRA STUDIO
          </span>
          <h2 className="text-2xl font-black text-[#0C4A6E] uppercase tracking-tight">Book Free Consultation</h2>
          <p className="text-xs text-slate-600 mt-1 font-normal">
            Get 3D designs, estimated budget breakdown & 10-year warranty advice.
          </p>
        </div>

        <ConsultationForm cities={cities} onSuccess={() => {}} />
      </div>
    </div>
  );
}
