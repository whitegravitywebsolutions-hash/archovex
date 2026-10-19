import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';
import { getRobotsDirective } from '@/lib/seoConfig';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPublicData('/pages/terms-and-conditions').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Terms & Conditions | Archovex Infra',
      alternates: { canonical: seo.canonical_url || '/terms-and-conditions' },
      robots: getRobotsDirective(seo.robots),
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  return {
    metadataBase: new URL(siteUrl),
    title: 'Terms & Conditions | Archovex Infra',
    description: 'Terms and conditions governing interior design and fit-out services provided by ARCHOVEX INFRA PRIVATE LIMITED across Delhi NCR.',
    alternates: {
      canonical: '/terms-and-conditions',
    },
    robots: getRobotsDirective(),
  };
}

export default async function TermsAndConditionsPage() {
  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/terms-and-conditions').catch(() => null),
  ]);

  if (!customPage || customPage.status === 'draft') {
    notFound();
  }

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://archovex.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Terms & Conditions', item: 'https://archovex.vercel.app/terms-and-conditions' },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms & Conditions | Archovex Infra',
    description: 'Terms for using the Archovex Infra website and general terms that apply to enquiries, quotes and interior design projects.',
    url: 'https://archovex.vercel.app/terms-and-conditions',
    publisher: {
      '@type': 'Organization',
      name: 'ARCHOVEX INFRA PRIVATE LIMITED',
      logo: 'http://127.0.0.1:8005/storage/media/website/page_tsx_fe9d6266.png',
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />
      
      <main className="flex-grow">
        {dynamicSections && dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'Terms & Conditions'}</h1>
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
