import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPublicData('/pages/about-us').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'About Archovex Infra',
      alternates: { canonical: seo.canonical_url || '/about-us' },
      robots: seo.robots || 'index, follow',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  return {
    metadataBase: new URL(siteUrl),
    title: 'About Archovex Infra | Interior Design Company, NCR',
    description: 'Meet Archovex Infra, an interior design and execution company serving homes and businesses in Noida, Greater Noida, Delhi, New Delhi and Gurgaon.',
    alternates: {
      canonical: '/about-us',
    },
    openGraph: {
      title: 'About Archovex Infra | Interior Design Company, NCR',
      description: 'Meet Archovex Infra, an interior design and execution company serving homes and businesses in Noida, Greater Noida, Delhi, New Delhi and Gurgaon.',
      url: '/about-us',
      siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: ['/logo.png'],
    },
  };
}

export default async function AboutUsPage() {
  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/about-us').catch(() => null),
  ]);

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Archovex Infra',
    url: 'https://archovex.vercel.app/about-us',
    mainEntity: {
      '@type': 'Organization',
      name: 'ARCHOVEX INFRA PRIVATE LIMITED',
      legalName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Connaught Place',
        addressLocality: 'New Delhi',
        postalCode: '110001',
        addressCountry: 'IN',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    },
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
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'About Us'}</h1>
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
