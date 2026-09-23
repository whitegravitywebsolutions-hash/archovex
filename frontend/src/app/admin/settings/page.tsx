'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
    phone: '+91 98765 43210',
    email: 'contact@archovex.com',
    whatsapp: '+919876543210',
    address: 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001',
    hero_heading: 'DESIGN YOUR DREAM HOME',
    hero_subheading: 'Thoughtfully designed luxury interiors built around the way you live.',
    copyright: '© 2026 ARCHOVEX INFRA PRIVATE LIMITED. All rights reserved.',
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
        <h1 className="text-2xl font-extrabold text-slate-900">Global Site & Footer Settings</h1>
        <p className="text-xs text-slate-500">Manage common website parameters, phone numbers, WhatsApp, hero text, and address.</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">Hero Section Settings</h2>

        <div className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Homepage Hero Heading</label>
            <input
              type="text"
              value={settings.hero_heading || ''}
              onChange={(e) => setSettings({ ...settings, hero_heading: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Homepage Hero Subheading</label>
            <textarea
              rows={2}
              value={settings.hero_subheading || ''}
              onChange={(e) => setSettings({ ...settings, hero_subheading: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>
        </div>

        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2 pt-4">Contact Information & Footer Settings</h2>

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
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block font-bold text-slate-700 mb-1">Footer Copyright Text</label>
            <input
              type="text"
              value={settings.copyright || ''}
              onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>
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
