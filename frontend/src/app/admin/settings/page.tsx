'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient, getImageUrl } from '@/lib/api';
import { Save, CheckCircle2, Loader2, Share2, Image as ImageIcon, Link as LinkIcon, FileText, Globe, Building, ShieldCheck, Star } from 'lucide-react';
import MediaPickerModal from '@/components/admin/MediaPickerModal';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
    phone: '+91 98765 43210',
    email: 'contact@archovex.com',
    whatsapp: '+919876543210',
    address: 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001',
    footer_logo: '',
    footer_description: 'ARCHOVEX INFRA PRIVATE LIMITED is an architectural & interior design firm delivering bespoke modular kitchens, living room concepts, custom wardrobes, and turnkey home interiors across India.',
    instagram_url: 'https://instagram.com',
    facebook_url: 'https://facebook.com',
    twitter_url: '',
    youtube_url: '',
    linkedin_url: '',
    footer_locations: `Interior Designers in Noida | /locations/noida
Interior Designers in Greater Noida | /locations/greater-noida
Interior Designers in Delhi | /locations/delhi
Interior Designers in New Delhi | /locations/new-delhi
Interior Designers in Gurgaon | /locations/gurgaon`,
    footer_services: `Full Home Interior Design | /services/full-home-interior-design
Modular Kitchen Design | /services/modular-kitchen-design
Living Room Interior Design | /services/living-room-interior-design
Bedroom Interior Design | /services/bedroom-interior-design
Wardrobe Design | /services/wardrobe-design
Home Renovation & Remodeling | /services/home-renovation-remodeling
Office Interior Design | /services/office-interior-design
Corporate Office Interior Design | /services/corporate-office-interior-design
Commercial Interior Design | /services/commercial-interior-design
Turnkey Interior Design | /services/turnkey-interior-design`,
    footer_copyright: '2026 Archovex. All Rights Reserved.',
    footer_privacy_url: '/privacy-policy',
    footer_terms_url: '/terms-and-conditions',
    // Trust Strip facts (shown after hero on homepage)
    trust_years_in_business: '',
    trust_projects_completed: '',
    trust_warranty_terms: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

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
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('settingsUpdated'));
      }
      setMessage('Site & Footer settings updated successfully! Live on website.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoSelect = (urls: string[]) => {
    if (urls && urls.length > 0) {
      setSettings((prev) => ({ ...prev, footer_logo: urls[0] }));
    }
    setIsMediaPickerOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0C4A6E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs max-w-4xl pb-16">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Global Site & Footer Settings</h1>
        <p className="text-xs text-slate-500">
          Manage contact info, uploaded footer logo, description, social icons, custom Location & Service links, and legal footer text.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        
        {/* 1. CONTACT INFORMATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0C4A6E] border-b pb-2 border-slate-200">
            <Building className="w-4 h-4 text-[#F97316]" />
            <span>Contact Information & Corporate Office</span>
          </div>

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
              className="w-full p-2.5 border rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Headquarters Office Address</label>
            <textarea
              rows={2}
              value={settings.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-medium"
            />
          </div>
        </div>

        {/* 2. FOOTER LOGO & DESCRIPTION */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0C4A6E] border-b pb-2 border-slate-200">
            <ImageIcon className="w-4 h-4 text-[#F97316]" />
            <span>Footer Logo & Brand Description</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Footer Logo Image</label>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="relative w-24 h-24 bg-[#0C4A6E] rounded-xl border border-sky-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {settings.footer_logo ? (
                  <Image
                    src={getImageUrl(settings.footer_logo)}
                    alt="Footer Logo"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-sky-200 text-center px-1">Default Logo</span>
                )}
              </div>
              <div className="space-y-2 flex-grow">
                <input
                  type="text"
                  value={settings.footer_logo || ''}
                  onChange={(e) => setSettings({ ...settings, footer_logo: e.target.value })}
                  placeholder="https://... or upload logo"
                  className="w-full p-2 border rounded-xl font-mono text-[11px] bg-white"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="px-4 py-2 bg-[#0C4A6E] hover:bg-slate-800 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choose from Media Library</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Footer Brand Description Paragraph</label>
            <textarea
              rows={3}
              value={settings.footer_description || ''}
              onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
              placeholder="Paragraph text displayed under the footer logo..."
              className="w-full p-3 border rounded-xl text-xs font-normal leading-relaxed"
            />
          </div>
        </div>

        {/* 3. SOCIAL MEDIA LINKS */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0C4A6E] border-b pb-2 border-slate-200">
            <Share2 className="w-4 h-4 text-[#F97316]" />
            <span>Social Media Links (Footer Icons)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
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

            <div>
              <label className="block font-bold text-slate-700 mb-1">Twitter / X URL (Optional)</label>
              <input
                type="text"
                value={settings.twitter_url || ''}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                placeholder="https://twitter.com/archovex"
                className="w-full p-2.5 bg-white border rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">YouTube Channel URL (Optional)</label>
              <input
                type="text"
                value={settings.youtube_url || ''}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                placeholder="https://youtube.com/@archovex"
                className="w-full p-2.5 bg-white border rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">LinkedIn Page URL (Optional)</label>
              <input
                type="text"
                value={settings.linkedin_url || ''}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/company/archovex"
                className="w-full p-2.5 bg-white border rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 4. FOOTER DYNAMIC LINKS (ALL LOCATIONS & SERVICES) */}
        <div className="pt-4 border-t border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0C4A6E] border-b pb-2 border-slate-200">
            <LinkIcon className="w-4 h-4 text-[#F97316]" />
            <span>Footer Column Links (All Locations & Services)</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">"All Locations" Links Column</label>
                <span className="text-[10px] text-slate-500 font-mono">Format: Title | Link URL (one per line)</span>
              </div>
              <textarea
                rows={6}
                value={settings.footer_locations || ''}
                onChange={(e) => setSettings({ ...settings, footer_locations: e.target.value })}
                placeholder="Interior Designers in Noida | /locations/noida..."
                className="w-full p-3 border rounded-xl font-mono text-xs leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">"Services" Links Column</label>
                <span className="text-[10px] text-slate-500 font-mono">Format: Title | Link URL (one per line)</span>
              </div>
              <textarea
                rows={8}
                value={settings.footer_services || ''}
                onChange={(e) => setSettings({ ...settings, footer_services: e.target.value })}
                placeholder="Full Home Interior Design | /services/full-home-interior-design..."
                className="w-full p-3 border rounded-xl font-mono text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 5. TRUST STRIP FACTS */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0C4A6E] border-b pb-2 border-slate-200">
            <Star className="w-4 h-4 text-[#F97316]" />
            <span>Trust Strip Facts (shown after Hero on Homepage)</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Fill only confirmed values. Leave a field blank to hide it from the strip.
            The &ldquo;Serving 5 cities in Delhi NCR&rdquo; item is always shown.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Years in Business</label>
              <input
                type="text"
                value={settings.trust_years_in_business || ''}
                onChange={(e) => setSettings({ ...settings, trust_years_in_business: e.target.value })}
                placeholder="e.g. 8"
                className="w-full p-2.5 border rounded-xl font-bold text-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-1">Renders as: &ldquo;8 years in interiors&rdquo;</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Projects Completed</label>
              <input
                type="text"
                value={settings.trust_projects_completed || ''}
                onChange={(e) => setSettings({ ...settings, trust_projects_completed: e.target.value })}
                placeholder="e.g. 500+"
                className="w-full p-2.5 border rounded-xl font-bold text-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-1">Renders as: &ldquo;500+ projects completed&rdquo;</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Warranty Terms</label>
              <input
                type="text"
                value={settings.trust_warranty_terms || ''}
                onChange={(e) => setSettings({ ...settings, trust_warranty_terms: e.target.value })}
                placeholder="e.g. 10-Year Warranty"
                className="w-full p-2.5 border rounded-xl font-bold text-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-1">Free-form, e.g. &ldquo;10-Year Warranty&rdquo;</p>
            </div>
          </div>
        </div>

        {/* 6. COPYRIGHT & LEGAL LINKS */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0C4A6E] border-b pb-2 border-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#F97316]" />
            <span>Footer Copyright & Legal Policy Links</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Copyright Text</label>
            <input
              type="text"
              value={settings.footer_copyright || '2026 Archovex. All Rights Reserved.'}
              onChange={(e) => setSettings({ ...settings, footer_copyright: e.target.value })}
              placeholder="e.g. 2026 Archovex. All Rights Reserved."
              className="w-full p-2.5 border rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Privacy Policy URL</label>
              <input
                type="text"
                value={settings.footer_privacy_url || '/privacy-policy'}
                onChange={(e) => setSettings({ ...settings, footer_privacy_url: e.target.value })}
                placeholder="e.g. /privacy-policy"
                className="w-full p-2.5 border rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Terms & Conditions URL</label>
              <input
                type="text"
                value={settings.footer_terms_url || '/terms-and-conditions'}
                onChange={(e) => setSettings({ ...settings, footer_terms_url: e.target.value })}
                placeholder="e.g. /terms-and-conditions"
                className="w-full p-2.5 border rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-[#0C4A6E] hover:bg-[#F97316] text-white font-black rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : (
            <>
              <Save className="w-4 h-4 text-white" />
              <span>SAVE ALL SETTINGS</span>
            </>
          )}
        </button>
      </form>

      {/* Media Picker Modal for Footer Logo */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleLogoSelect}
        allowMultiple={false}
      />
    </div>
  );
}
