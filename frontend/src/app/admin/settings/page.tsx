'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Save, CheckCircle2, Loader2, Share2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
    phone: '+91 98765 43210',
    email: 'contact@archovex.com',
    whatsapp: '+919876543210',
    instagram_url: 'https://instagram.com',
    facebook_url: 'https://facebook.com',
    address: 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiClient.get('/admin/settings').then((res) => {
      if (res.data.success && res.data.data?.settings) {
        setSettings((prev) => ({ ...prev, ...res.data.data.settings }));
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await apiClient.post('/admin/settings', settings);
      setMessage('Site settings updated successfully! Reflecting live on website.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-xs max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Global Site Settings</h1>
        <p className="text-xs text-slate-500">Manage common website contact parameters, social media URLs, phone numbers, WhatsApp, email, and address.</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">Contact Information & Office Settings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Company Phone Number</label>
            <input
              type="text"
              value={settings.phone || ''}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">WhatsApp Helpline Number</label>
            <input
              type="text"
              value={settings.whatsapp || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-bold text-emerald-700"
              placeholder="+919876543210"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Contact Email Address</label>
          <input
            type="email"
            value={settings.email || ''}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="w-full p-2.5 border rounded-xl"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Headquarters Office Address</label>
          <textarea
            rows={2}
            value={settings.address || ''}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full p-2.5 border rounded-xl"
          />
        </div>

        {/* SOCIAL MEDIA URLS */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0C4A6E]">
            <Share2 className="w-4 h-4 text-[#F97316]" />
            <span>Social Media Links (Footer Icons)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instagram Page URL</label>
              <input
                type="text"
                value={settings.instagram_url || settings.instagram || ''}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value, instagram: e.target.value })}
                placeholder="https://instagram.com/archovex"
                className="w-full p-2.5 bg-white border rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Facebook Page URL</label>
              <input
                type="text"
                value={settings.facebook_url || settings.facebook || ''}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value, facebook: e.target.value })}
                placeholder="https://facebook.com/archovex"
                className="w-full p-2.5 bg-white border rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SAVE ALL SETTINGS'}
        </button>
      </form>
    </div>
  );
}
