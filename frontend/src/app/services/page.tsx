import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPublicData('/pages/services').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Interior Design Services in Delhi NCR',
      alternates: { canonical: seo.canonical_url || '/services' },
      robots: seo.robots || 'index, follow',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  return {
    metadataBase: new URL(siteUrl),
    title: 'Interior Design Services in Delhi NCR | Archovex',
    description: 'Home and commercial interior design services by Archovex: full home, modular kitchens, wardrobes, renovation, offices and turnkey projects in NCR.',
    alternates: {
      canonical: '/services',
    },
    openGraph: {
      title: 'Interior Design Services in Delhi NCR | Archovex',
      description: 'Home and commercial interior design services by Archovex: full home, modular kitchens, wardrobes, renovation, offices and turnkey projects in NCR.',
      url: '/services',
      siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: ['/logo.png'],
    },
  };
}

export default async function ServicesHubPage() {
  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/services').catch(() => null),
  ]);

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Interior Design Services in Delhi NCR',
    url: 'https://archovex.vercel.app/services',
    description: 'Home and commercial interior design services by Archovex: full home, modular kitchens, wardrobes, renovation, offices and turnkey projects in NCR.',
    hasPart: [
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/services/full-home-interior-design', name: 'Full Home Interior Design' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/services/modular-kitchen-design', name: 'Modular Kitchen Design' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/services/living-room-interior-design', name: 'Living Room Interior Design' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/services/bedroom-interior-design', name: 'Bedroom Interior Design' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/services/wardrobe-design', name: 'Wardrobe Design' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/services/home-renovation', name: 'Home Renovation & Remodeling' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/services/office-interior-design', name: 'Office Interior Design' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/services/corporate-office-interior-design', name: 'Corporate Office Interior Design' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/services/commercial-interior-design', name: 'Commercial Interior Design' },
      { '@type': 'WebPage', url: 'https://archovex.vercel.app/services/turnkey-interior-design', name: 'Turnkey Interior Design' },
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
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'Services'}</h1>
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
