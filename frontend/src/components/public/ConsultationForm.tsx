'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { City } from '@/types';
import { CheckCircle2, Loader2, Send, MessageCircle, ExternalLink } from 'lucide-react';
import { createWhatsAppConsultationUrl } from '@/lib/pageUtils';

interface ConsultationFormProps {
  cities?: City[];
  onSuccess?: () => void;
  compact?: boolean;
  defaultRequirement?: string;
  whatsappNumber?: string;
  isContactForm?: boolean;
}

export default function ConsultationForm({
  cities = [],
  onSuccess,
  compact = false,
  defaultRequirement = '',
  whatsappNumber,
  isContactForm = false,
}: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    requirement: defaultRequirement || '',
  });

  const [activeWhatsApp, setActiveWhatsApp] = useState(whatsappNumber || '+919217614436');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (whatsappNumber) {
      setActiveWhatsApp(whatsappNumber);
    } else {
      apiClient.get('/settings').then((res) => {
        if (res.data?.data?.settings?.whatsapp) {
          setActiveWhatsApp(res.data.data.settings.whatsapp);
        }
      }).catch(() => {});
    }
  }, [whatsappNumber]);

  useEffect(() => {
    if (defaultRequirement) {
      setFormData((prev) => ({ ...prev, requirement: defaultRequirement }));
    }
  }, [defaultRequirement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send enquiry details to backend (triggers email notification to whitegravitywebsolutions@gmail.com)
      await apiClient.post('/enquiry', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        requirement: formData.requirement,
        source: isContactForm ? 'Contact Form' : 'Consultation Modal Form',
        type: 'consultation',
      });

      if (!isContactForm) {
        // Also open WhatsApp Helpline for direct architect chat
        const waUrl = createWhatsAppConsultationUrl({
          whatsappNumber: activeWhatsApp,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          requirement: formData.requirement,
        });

        setSubmittedWhatsAppUrl(waUrl);
        if (typeof window !== 'undefined') {
          window.open(waUrl, '_blank');
        }
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    if (isContactForm) {
      return (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl text-center space-y-4 font-sans">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-xl font-bold font-serif">Enquiry Received!</h3>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
            Thank you for reaching out to ARCHOVEX INFRA. Our team has received your enquiry and an interior expert will call you shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', phone: '', email: '', address: '', requirement: '' });
            }}
            className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 underline pt-2 cursor-pointer hover:text-emerald-900"
          >
            Submit another enquiry
          </button>
        </div>
      );
    }

    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl text-center space-y-4 font-sans animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <MessageCircle className="w-8 h-8 fill-current" />
        </div>
        <h3 className="text-xl font-bold font-serif">Consultation Request Ready!</h3>
        <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
          We are opening WhatsApp so you can speak directly with our senior interior architect at <strong>{activeWhatsApp}</strong>.
        </p>
        {submittedWhatsAppUrl && (
          <div className="pt-2">
            <a
              href={submittedWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Continue to WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', phone: '', email: '', address: '', requirement: '' });
          }}
          className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 underline pt-2 cursor-pointer hover:text-emerald-900"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
      {error && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Row 1: Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">YOUR NAME *</label>
          <input
            type="text"
            required
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">MOBILE NUMBER *</label>
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Row 2: Email & Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">EMAIL ADDRESS</label>
          <input
            type="email"
            placeholder="rahul@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">YOUR ADDRESS / CITY</label>
          <input
            type="text"
            placeholder="e.g. Flat 302, Sector 62, Noida"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Requirement Textarea Field */}
      <div>
        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">REQUIREMENT DETAILS</label>
        <textarea
          rows={3}
          placeholder="Describe your interior design requirements (e.g. 3BHK full home interior, modular kitchen with German hardware, wardrobes...)"
          value={formData.requirement}
          onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] focus:outline-none transition-all shadow-2xs"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/20 disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : isContactForm ? (
          <>
            <span>SUBMIT CONTACT ENQUIRY</span>
            <Send className="w-3.5 h-3.5 text-white" />
          </>
        ) : (
          <>
            <MessageCircle className="w-4 h-4 fill-current text-white" />
            <span>BOOK CONSULTATION ON WHATSAPP</span>
          </>
        )}
      </button>
    </form>
  );
}
