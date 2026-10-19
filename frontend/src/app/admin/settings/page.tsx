'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient, getImageUrl } from '@/lib/api';
import { Save, CheckCircle2, Loader2, Share2, Image as ImageIcon, Link as LinkIcon, FileText, Globe, Building, ShieldCheck, Trash2, Sparkles } from 'lucide-react';
import MediaPickerModal from '@/components/admin/MediaPickerModal';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'ARCHOVEX INFRA PRIVATE LIMITED',
    phone: '+91 9217614436',
    email: 'info@archovexinfra.com',
    whatsapp: '+919217614436',
    address: 'Floor No. 1, Building No. 01AB, Kh-814, SS, Behind Ace City, Near Nix Hospital, Bisrakh Jalalpur Village, Greater Noida, Gautambuddha Nagar, Uttar Pradesh – 201306, India.',
    footer_logo: '',
    footer_description: 'ARCHOVEX INFRA PRIVATE LIMITED is an architectural & interior design firm delivering bespoke modular kitchens, living room concepts, custom wardrobes, and turnkey home interiors across India.',
    og_image: '',
    default_og_image: '',
    default_meta_title: 'Interior Designers in Delhi NCR | Archovex Infra',
    default_meta_description: 'Archovex Infra designs and builds home and office interiors in Noida, Greater Noida, Delhi, New Delhi and Gurgaon. Book a free consultation.',
    instagram_url: 'https://instagram.com',
    facebook_url: 'https://facebook.com',
    twitter_url: '',
    youtube_url: '',
    linkedin_url: '',
    footer_company: `Home | /
About Us | /about-us
Services | /services
Interior Designs | /designs
Our Blogs | /blog
Contact Us | /contact-us`,
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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'footer_logo' | 'og_image'>('footer_logo');

  useEffect(() => {
    apiClient.get('/admin/settings').then((res) => {
      if (res.data.success && res.data.data?.settings) {
        const loaded = res.data.data.settings;
        setSettings((prev) => ({
          ...prev,
          ...loaded,
          og_image: loaded.og_image || loaded.default_og_image || '',
        }));
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

  const openMediaPicker = (target: 'footer_logo' | 'og_image') => {
    setMediaPickerTarget(target);
    setIsMediaPickerOpen(true);
  };

  const handleMediaSelect = (urls: string[]) => {
    if (urls && urls.length > 0) {
      const selected = urls[0];
      if (mediaPickerTarget === 'og_image') {
        setSettings((prev) => ({
          ...prev,
          og_image: selected,
          default_og_image: selected,
        }));
      } else {
        setSettings((prev) => ({ ...prev, footer_logo: selected }));
      }
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

        {/* 2. OPEN GRAPH & SOCIAL SHARING IMAGE (OG IMAGE) */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-slate-200">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0C4A6E]">
              <Share2 className="w-4 h-4 text-[#F97316]" />
              <span>Default Open Graph (OG) Image & Social Sharing</span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200/60 uppercase tracking-wider">
              Recommended: 1200 × 630 PX
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            This image acts as the website's default social preview thumbnail when links are shared across <strong>WhatsApp, Facebook, Twitter / X, LinkedIn, and Telegram</strong>.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            {/* Left: Preview Container */}
            <div className="lg:col-span-6 space-y-2">
              <label className="block font-bold text-slate-700">Live Social Share Card Preview</label>
              
              <div className="relative w-full aspect-[1200/630] bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-sm flex flex-col justify-between group">
                {settings.og_image ? (
                  <>
                    <Image
                      src={getImageUrl(settings.og_image)}
                      alt="Open Graph Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                    <div className="relative z-10 p-3 flex justify-between items-start">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">
                        <Share2 className="w-3 h-3 text-[#F97316]" /> Social Card Preview
                      </span>
                      <button
                        type="button"
                        onClick={() => setSettings((prev) => ({ ...prev, og_image: '', default_og_image: '' }))}
                        className="px-2 py-1 bg-rose-600/90 hover:bg-rose-600 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                        title="Remove OG Image"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                    <div className="relative z-10 p-4 text-white space-y-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-amber-300 truncate">
                        {settings.site_name || 'ARCHOVEX INFRA PRIVATE LIMITED'}
                      </p>
                      <h4 className="text-xs sm:text-sm font-bold line-clamp-1 leading-snug drop-shadow-sm">
                        {settings.default_meta_title || 'Interior Designers in Delhi NCR | Archovex Infra'}
                      </h4>
                      <p className="text-[11px] text-slate-200 line-clamp-1 opacity-90">
                        {settings.default_meta_description || 'Custom luxury interior design & turnkey architecture solutions.'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-slate-300 border border-white/10">
                      <ImageIcon className="w-6 h-6 text-[#F97316]" />
                    </div>
                    <p className="text-xs font-bold text-slate-300">No Default OG Image Configured</p>
                    <p className="text-[11px] text-slate-400 max-w-xs">
                      Shared links will fall back to the company logo or page-specific graphic.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Controls & Guidance */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">OG Image URL or Media Path</label>
                  <input
                    type="text"
                    value={settings.og_image || ''}
                    onChange={(e) => setSettings({ ...settings, og_image: e.target.value, default_og_image: e.target.value })}
                    placeholder="https://... or choose from Media Library"
                    className="w-full p-2.5 bg-white border rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openMediaPicker('og_image')}
                    className="px-4 py-2.5 bg-[#0C4A6E] hover:bg-[#F97316] text-white rounded-xl font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Choose / Upload OG Image</span>
                  </button>

                  {settings.og_image && (
                    <button
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, og_image: '', default_og_image: '' }))}
                      className="px-3 py-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Image</span>
                    </button>
                  )}
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>Open Graph Image Guidelines</span>
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                    <li><strong>Optimal Dimension:</strong> 1200 × 630 pixels (standard 1.91:1 ratio)</li>
                    <li><strong>Format:</strong> High resolution JPG, PNG, or WebP</li>
                    <li><strong>Visual Content:</strong> Eye-catching showcase of your luxury interior design projects with the Archovex branding</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. FOOTER LOGO & DESCRIPTION */}
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
                  onClick={() => openMediaPicker('footer_logo')}
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
            <span>Footer Column Links (Company, All Locations & Services)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">"Company" Links Column</label>
                <span className="text-[10px] text-slate-500 font-mono">Format: Title | Link URL (one per line)</span>
              </div>
              <textarea
                rows={8}
                value={settings.footer_company || ''}
                onChange={(e) => setSettings({ ...settings, footer_company: e.target.value })}
                placeholder="Home | /&#10;About Us | /about-us&#10;Contact Us | /contact-us..."
                className="w-full p-3 border rounded-xl font-mono text-xs leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">"All Locations" Links Column</label>
                <span className="text-[10px] text-slate-500 font-mono">Format: Title | Link URL (one per line)</span>
              </div>
              <textarea
                rows={8}
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

        {/* 5. COPYRIGHT & LEGAL LINKS */}
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

      {/* Media Picker Modal for Footer Logo & OG Image */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        allowMultiple={false}
      />
    </div>
  );
}
