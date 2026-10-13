import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const pageData = await fetchPublicData('/pages/contact-us').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Contact ARCHOVEX INFRA PRIVATE LIMITED',
      keywords: seo.meta_keywords || '',
      alternates: {
        canonical: seo.canonical_url || '/contact-us',
      },
      openGraph: {
        title: seo.og_title || seo.meta_title,
        description: seo.og_description || seo.meta_description,
        images: seo.og_image ? [{ url: seo.og_image }] : ['/logo.png'],
      },
      robots: seo.robots || 'index, follow',
    };
  }

  return {
    title: 'Contact Archovex Infra | Book a Free Consultation',
    description: 'Call, WhatsApp or message Archovex Infra to plan your home or office interiors in Noida, Greater Noida, Delhi, New Delhi or Gurgaon.',
    alternates: {
      canonical: '/contact-us',
    },
  };
}

export default async function ContactPage() {
  const [homeData, customContactPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/contact-us').catch(() => null)
  ]);

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customContactPage?.sections) ? customContactPage.sections : [];

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans">
      <Header initialMenu={homeData?.menus || []} cities={cities} />

      <main className="flex-grow">
        {dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customContactPage?.title || 'Contact Us'}</h1>
            <p className="text-xs text-slate-500">
              This page currently has no section content configured. Add sections in the Page Builder to build this page layout.
            </p>
          </div>
        )}
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
