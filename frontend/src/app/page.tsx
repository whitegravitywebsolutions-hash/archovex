import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import StatsSection from '@/components/public/StatsSection';
import ProcessSection from '@/components/public/ProcessSection';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import HomepageClient from './HomepageClient';
import DynamicPageClient from './[slug]/DynamicPageClient';
import { fetchPublicData } from '@/lib/api';

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';
  const pageData = await fetchPublicData('/pages/home');

  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      metadataBase: new URL(siteUrl),
      title: seo.meta_title,
      description: seo.meta_description || 'ARCHOVEX INFRA PRIVATE LIMITED',
      keywords: seo.meta_keywords || '',
      alternates: {
        canonical: seo.canonical_url || siteUrl,
      },
      openGraph: {
        title: seo.og_title || seo.meta_title,
        description: seo.og_description || seo.meta_description,
        url: seo.og_url || seo.canonical_url || siteUrl,
        siteName: seo.og_site_name || 'ARCHOVEX INFRA PRIVATE LIMITED',
        images: seo.og_image ? [{ url: seo.og_image }] : ['/logo.png'],
      },
      robots: seo.robots || 'index, follow',
    };
  }

  const homeData = await fetchPublicData('/home');
  const settings = homeData?.settings || {};

  return {
    metadataBase: new URL(siteUrl),
    title: settings.default_meta_title || 'ARCHOVEX INFRA PRIVATE LIMITED | Premium Luxury Interior Design',
    description: settings.default_meta_description || 'ARCHOVEX INFRA PRIVATE LIMITED offers luxury modular kitchens, living room designs, sliding wardrobes, and turnkey home interiors across India.',
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: settings.default_meta_title || 'ARCHOVEX INFRA PRIVATE LIMITED',
      description: settings.default_meta_description || 'Luxury interior designs',
      images: ['/logo.png'],
    },
  };
}

export default async function HomePage() {
  const [homeData, customHomePage] = await Promise.all([
    fetchPublicData('/home'),
    fetchPublicData('/pages/home')
  ]);

  const categories = homeData?.categories || [];
  const featuredDesigns = homeData?.featured_designs || [];
  const services = homeData?.services || [];
  const projects = homeData?.projects || [];
  const cities = homeData?.cities || [];
  const testimonials = homeData?.testimonials || [];
  const faqs = homeData?.faqs || [];
  const blogs = homeData?.blogs || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customHomePage?.sections) ? customHomePage.sections : [];

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      
      <main className="flex-grow">
        {dynamicSections.length > 0 ? (
          <DynamicPageClient page={customHomePage} cities={cities} />
        ) : (
          <>
            <HomepageClient
              categories={categories}
              featuredDesigns={featuredDesigns}
              services={services}
              projects={projects}
              cities={cities}
              testimonials={testimonials}
              faqs={faqs}
              blogs={blogs}
              settings={settings}
            />
            <StatsSection />
            <ProcessSection />
          </>
        )}
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
