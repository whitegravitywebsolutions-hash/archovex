'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Save, CheckCircle2, Loader2, Code, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AdminScriptsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    script_head: '',
    script_body: '',
    script_footer: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiClient.get('/admin/settings').then((res) => {
      if (res.data.success && res.data.data?.settings) {
        const s = res.data.data.settings;
        setSettings({
          script_head: s.script_head || '',
          script_body: s.script_body || '',
          script_footer: s.script_footer || '',
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await apiClient.post('/admin/settings', settings);
      setMessage('Custom scripts & GTM tracking codes updated successfully! Live on website.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update custom scripts');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 gap-2 text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-slate-800" />
        <span>Loading Custom Script Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Code className="w-6 h-6 text-blue-600" />
          <span>Custom Scripts & Tracking Manager (GTM)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Add Google Tag Manager (GTM), Meta Pixel, Google Analytics, chatbots, or custom JavaScript/CSS snippets globally across your website.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* 1. HEADER SCRIPTS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b pb-2">
            <label className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-mono">&lt;head&gt;</span>
              <span>1. Header Scripts (Injected inside &lt;head&gt;)</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">GTM Head, Meta Pixel, Custom CSS &lt;style&gt;</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Paste code that must load early in the page head, such as GTM Primary Script, Meta Pixel code, or custom CSS styling rules.
          </p>
          <textarea
            rows={6}
            value={settings.script_head || ''}
            onChange={(e) => setSettings({ ...settings, script_head: e.target.value })}
            placeholder="<!-- Google Tag Manager -->&#10;<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>&#10;<!-- End Google Tag Manager -->"
            className="w-full p-3 border border-slate-300 rounded-2xl font-mono text-xs bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 2. BODY OPEN SCRIPTS */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between border-b pb-2">
            <label className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-mono">&lt;body&gt; Start</span>
              <span>2. Body Start Scripts (Injected right after &lt;body&gt;)</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">GTM &lt;noscript&gt;, Body Tracking Pixels</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Paste code that must execute immediately after the opening &lt;body&gt; tag, such as Google Tag Manager &lt;noscript&gt; fallback iframe.
          </p>
          <textarea
            rows={5}
            value={settings.script_body || ''}
            onChange={(e) => setSettings({ ...settings, script_body: e.target.value })}
            placeholder="<!-- Google Tag Manager (noscript) -->&#10;<noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX' height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript>&#10;<!-- End Google Tag Manager (noscript) -->"
            className="w-full p-3 border border-slate-300 rounded-2xl font-mono text-xs bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 3. FOOTER SCRIPTS */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between border-b pb-2">
            <label className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-mono">&lt;/body&gt; End</span>
              <span>3. Footer Scripts (Injected before closing &lt;/body&gt;)</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Chatbots, WhatsApp Widgets, Analytics JS</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Paste code that can load asynchronously at the bottom of the page, such as WhatsApp floaters, live chat widgets, or conversion tracking.
          </p>
          <textarea
            rows={5}
            value={settings.script_footer || ''}
            onChange={(e) => setSettings({ ...settings, script_footer: e.target.value })}
            placeholder="<!-- Live Chat / Analytics Script -->&#10;<script>console.log('Page loaded');</script>"
            className="w-full p-3 border border-slate-300 rounded-2xl font-mono text-xs bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>SAVE CUSTOM SCRIPTS & TRACKING CODES</span>
        </button>
      </form>
    </div>
  );
}
