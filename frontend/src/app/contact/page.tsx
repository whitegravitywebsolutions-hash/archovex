import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import ConsultationForm from '@/components/public/ConsultationForm';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import { fetchPublicData } from '@/lib/api';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export async function generateMetadata() {
  const pageData = await fetchPublicData('/pages/contact');
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Contact ARCHOVEX INFRA PRIVATE LIMITED',
      keywords: seo.meta_keywords || '',
      canonical: seo.canonical_url || 'https://archovex.com/contact',
      openGraph: {
        title: seo.og_title || seo.meta_title,
        description: seo.og_description || seo.meta_description,
        images: seo.og_image ? [{ url: seo.og_image }] : ['/logo.png'],
      },
      robots: seo.robots || 'index, follow',
    };
  }

  return {
    title: 'Contact ARCHOVEX INFRA PRIVATE LIMITED | Book Free Design Consultation',
    description: 'Connect with our interior design architects across Delhi NCR, Mumbai, Bangalore, and Pune.',
  };
}

export default async function ContactPage() {
  const [homeData, customContactPage] = await Promise.all([
    fetchPublicData('/home'),
    fetchPublicData('/pages/contact')
  ]);

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customContactPage?.sections) ? customContactPage.sections : [];

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans">
      <Header cities={cities} />

      <main className="flex-grow">
        {dynamicSections.length > 0 ? (
          <>
            <DynamicSectionRenderer sections={dynamicSections} />
            
            {/* Embedded Interactive Contact Form Block */}
            <section className="py-16 bg-[#FAF8F3] border-t border-[#E4DCD0]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-[#E4DCD0] shadow-sm space-y-6">
                    <h2 className="text-xl font-black text-[#0C4A6E] uppercase tracking-tight border-b border-[#E4DCD0] pb-3">Corporate Headquarters</h2>
                    <div className="space-y-4 text-xs text-slate-700">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#0C4A6E] block uppercase">Address</span>
                          <span>{settings.address || 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#0C4A6E] block uppercase">Direct Call</span>
                          <span>{settings.phone || '+91 98765 43210'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#0C4A6E] block uppercase">Email Address</span>
                          <span>{settings.email || 'contact@archovex.com'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#0C4A6E] block uppercase">WhatsApp Helpline</span>
                          <span>{settings.whatsapp || '+91 98765 43210'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E4DCD0] shadow-xl space-y-6">
                  <div className="border-b border-[#E4DCD0] pb-4">
                    <h2 className="text-2xl font-black text-[#0C4A6E] uppercase tracking-tight">Book Free Consultation</h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Fill in your project requirements below to speak with an interior design architect.
                    </p>
                  </div>
                  <ConsultationForm cities={cities} />
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0E7490] text-white py-16 sm:py-24 border-b border-sky-900">
              <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#FFEDD5] bg-[#F97316]/20 border border-[#F97316]/40 px-4 py-1.5 rounded-full inline-block shadow-sm">
                  ARCHOVEX • GET IN TOUCH
                </span>
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Contact ARCHOVEX INFRA</h1>
                <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto leading-relaxed">
                  Schedule a design studio visit or get zero-cost consultation for your new home.
                </p>
              </div>
            </section>

            <section className="py-16 bg-[#FAF8F3]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-[#E4DCD0] shadow-sm space-y-6">
                    <h2 className="text-xl font-black text-[#0C4A6E] uppercase tracking-tight border-b border-[#E4DCD0] pb-3">Corporate Headquarters</h2>
                    <div className="space-y-4 text-xs text-slate-700">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#0C4A6E] block uppercase">Address</span>
                          <span>{settings.address || 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#0C4A6E] block uppercase">Direct Call</span>
                          <span>{settings.phone || '+91 98765 43210'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#0C4A6E] block uppercase">Email Address</span>
                          <span>{settings.email || 'contact@archovex.com'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#0C4A6E] block uppercase">WhatsApp Helpline</span>
                          <span>{settings.whatsapp || '+91 98765 43210'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E4DCD0] shadow-xl space-y-6">
                  <div className="border-b border-[#E4DCD0] pb-4">
                    <h2 className="text-2xl font-black text-[#0C4A6E] uppercase tracking-tight">Book Free Consultation</h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Fill in your project requirements below to speak with an interior design architect.
                    </p>
                  </div>
                  <ConsultationForm cities={cities} />
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
