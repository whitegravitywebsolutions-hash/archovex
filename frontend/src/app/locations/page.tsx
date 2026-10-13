import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPublicData('/pages/locations').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Interior Designers Across Delhi NCR',
      alternates: { canonical: seo.canonical_url || '/locations' },
      robots: seo.robots || 'index, follow',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  return {
    metadataBase: new URL(siteUrl),
    title: 'Interior Designers Across Delhi NCR | Archovex Locations',
    description: 'Explore Archovex interior design studios across Delhi NCR: Noida, Greater Noida, Delhi, New Delhi and Gurgaon.',
    alternates: {
      canonical: '/locations',
    },
    openGraph: {
      title: 'Interior Designers Across Delhi NCR | Archovex Locations',
      description: 'Explore Archovex interior design studios across Delhi NCR: Noida, Greater Noida, Delhi, New Delhi and Gurgaon.',
      url: '/locations',
      siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: ['/logo.png'],
    },
  };
}

export default async function LocationsHubPage() {
  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/locations').catch(() => null),
  ]);

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Interior Designers in NCR Locations',
    url: 'https://archovex.vercel.app/locations',
    description: 'Explore Archovex interior design studios across Delhi NCR: Noida, Greater Noida, Delhi, New Delhi and Gurgaon.',
    hasPart: [
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/locations/noida', name: 'Interior Designers in Noida' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/locations/greater-noida', name: 'Interior Designers in Greater Noida' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/locations/delhi', name: 'Interior Designers in Delhi' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/locations/new-delhi', name: 'Interior Designers in New Delhi' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/locations/gurgaon', name: 'Interior Designers in Gurgaon' },
    ],
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      <main className="flex-grow">
        {dynamicSections && dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'Locations'}</h1>
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
