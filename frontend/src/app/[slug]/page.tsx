import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicPageClient from './DynamicPageClient';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicPageProps) {
  const { slug } = await params;
  
  // Skip reserved routes to avoid overriding static routes if any catch-all mismatch
  const reservedSlugs = ['api', 'admin', 'portfolio', 'designs', 'cities', 'contact', 'blog', 'media', 'login'];
  if (reservedSlugs.includes(slug.toLowerCase())) {
    return { title: 'ARCHOVEX INFRA PRIVATE LIMITED' };
  }

  const data = await fetchPublicData(`/pages/${slug}`);

  if (!data) {
    return { title: 'Page Not Found | ARCHOVEX INFRA' };
  }

  const seo = data.seo_data || {};
  const metaTitle = seo.meta_title || data.title || 'ARCHOVEX INFRA PRIVATE LIMITED';
  const metaDesc = seo.meta_description || 'Custom luxury interior design & turn-key architecture solutions.';

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: seo.meta_keywords || '',
    canonical: seo.canonical_url || `https://archovex.com/${slug}`,
    openGraph: {
      title: seo.og_title || metaTitle,
      description: seo.og_description || metaDesc,
      images: seo.og_image ? [{ url: seo.og_image }] : [],
    },
    robots: seo.robots || 'index, follow',
  };
}

export default async function DynamicCustomPage({ params }: DynamicPageProps) {
  const { slug } = await params;

  // Reserved paths handled by explicit route folders in app router
  const reservedSlugs = ['api', 'admin', 'portfolio', 'designs', 'cities', 'contact', 'blog', 'media', 'login'];
  if (reservedSlugs.includes(slug.toLowerCase())) {
    notFound();
  }

  const pageData = await fetchPublicData(`/pages/${slug}`);

  if (!pageData || pageData.status === 'draft') {
    notFound();
  }

  const homeData = await fetchPublicData('/home');
  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
      <Header cities={cities} />

      <main className="flex-grow">
        <DynamicPageClient page={pageData} cities={cities} />
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
