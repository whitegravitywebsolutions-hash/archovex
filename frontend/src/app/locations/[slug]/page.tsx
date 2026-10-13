import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const slug = resolved.slug;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  const pageData = await fetchPublicData(`/pages/locations/${slug}`).catch(() => null);
  if (pageData) {
    const seo = pageData.seo_data || {};
    const title = seo.meta_title || pageData.meta_title || pageData.title || 'Location | Archovex Infra';
    const description = seo.meta_description || pageData.meta_description || 'Interior designers in Delhi NCR by Archovex Infra.';
    return {
      metadataBase: new URL(siteUrl),
      title,
      description,
      alternates: {
        canonical: seo.canonical_url || `/locations/${slug}`,
      },
      openGraph: {
        title: seo.og_title || title,
        description: seo.og_description || description,
        url: seo.og_url || `/locations/${slug}`,
        siteName: seo.og_site_name || 'ARCHOVEX INFRA PRIVATE LIMITED',
        images: seo.og_image ? [{ url: seo.og_image }] : ['/logo.png'],
      },
      robots: seo.robots || 'index, follow',
    };
  }

  return { title: 'Location | Archovex Infra' };
}

export default async function CityLocationPage({ params }: PageProps) {
  const resolved = await params;
  const slug = resolved.slug;

  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData(`/pages/locations/${slug}`).catch(() => null),
  ]);

  if (!customPage) {
    notFound();
  }

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header initialMenu={homeData?.menus || []} cities={cities} />

      <main className="flex-grow">
        {dynamicSections && dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'Location'}</h1>
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
