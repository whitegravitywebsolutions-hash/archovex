'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { City } from '@/types';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

interface ConsultationFormProps {
  cities?: City[];
  onSuccess?: () => void;
  compact?: boolean;
  defaultRequirement?: string;
}

export default function ConsultationForm({ cities = [], onSuccess, compact = false, defaultRequirement = '' }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    requirement: defaultRequirement || '',
  });

  React.useEffect(() => {
    if (defaultRequirement) {
      setFormData((prev) => ({ ...prev, requirement: defaultRequirement }));
    }
  }, [defaultRequirement]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/consultation', formData);
      if (res.data?.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        setError(res.data?.message || 'Failed to submit form.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h3 className="text-xl font-bold">Consultation Requested!</h3>
        <p className="text-sm text-emerald-800">
          Thank you for choosing ARCHOVEX INFRA. Our senior interior designer will contact you within 2 business hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 underline pt-2 cursor-pointer"
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
          <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">YOUR ADDRESS</label>
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
        ) : (
          <>
            <span>GET FREE CONSULTATION</span>
            <Send className="w-3.5 h-3.5 text-white" />
          </>
        )}
      </button>
    </form>
  );
}
