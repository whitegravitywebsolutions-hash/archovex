'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { City } from '@/types';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ConsultationFormProps {
  cities?: City[];
  onSuccess?: () => void;
  compact?: boolean;
}

export default function ConsultationForm({ cities = [], onSuccess, compact = false }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city_id: '',
    property_type: '3 BHK',
    requirement: 'Modular Kitchen',
    budget: '₹5L – ₹10L',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/consultation', formData);
      if (res.data.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        setError(res.data.message || 'Failed to submit form.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit consultation request. Please try again.');
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
          Thank you for choosing ARCHOVEX INFRA. Our senior interior designer will call you within 2 business hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 underline pt-2"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#0B132B] mb-1">Your Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs text-[#0B132B] font-medium focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#0B132B] mb-1">Mobile Number *</label>
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs text-[#0B132B] font-medium focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#0B132B] mb-1">Email Address</label>
          <input
            type="email"
            placeholder="rahul@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs text-[#0B132B] font-medium focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#0B132B] mb-1">Select City</label>
          <select
            value={formData.city_id}
            onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs text-[#0B132B] font-semibold focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition-all"
          >
            <option value="">Select your city...</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#0B132B] mb-1">Property Type</label>
            <select
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs text-[#0B132B] font-semibold focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition-all"
            >
              <option value="1 BHK">1 BHK Apartment</option>
              <option value="2 BHK">2 BHK Apartment</option>
              <option value="3 BHK">3 BHK Apartment</option>
              <option value="4 BHK+">4 BHK / Penthouse</option>
              <option value="Villa">Independent Villa / Kothi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#0B132B] mb-1">Requirement</label>
            <select
              value={formData.requirement}
              onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs text-[#0B132B] font-semibold focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition-all"
            >
              <option value="Full Home Interiors">Full Home Interiors</option>
              <option value="Modular Kitchen">Modular Kitchen</option>
              <option value="Wardrobes & Storage">Wardrobes & Storage</option>
              <option value="Living Room Makeover">Living Room Makeover</option>
              <option value="Complete Renovation">Complete Renovation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#0B132B] mb-1">Budget Range</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E4DCD0] rounded-xl text-xs text-[#0B132B] font-semibold focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition-all"
            >
              <option value="Under ₹5L">Under ₹5 Lakhs</option>
              <option value="₹5L – ₹10L">₹5L – ₹10 Lakhs</option>
              <option value="₹10L – ₹20L">₹10L – ₹20 Lakhs</option>
              <option value="₹20L+">₹20 Lakhs+</option>
            </select>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-[#F97316]/25 transition-all flex items-center justify-center gap-2 border border-amber-300/40 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'GET FREE CONSULTATION'}
      </button>

      <p className="text-[10px] text-slate-500 text-center">
        🔒 100% Privacy Guaranteed. No spam. 10-Year Warranty Coverage.
      </p>
    </form>
  );
}
