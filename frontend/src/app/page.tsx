import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import HomepageClient from './HomepageClient';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://archovex.vercel.app');
    
  const pageData = await fetchPublicData('/pages/home');

  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      metadataBase: new URL(siteUrl),
      title: seo.meta_title,
      description: seo.meta_description || 'ARCHOVEX INFRA PRIVATE LIMITED',
      keywords: seo.meta_keywords || '',
      alternates: {
        canonical: seo.canonical_url || '/',
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

  return {
    metadataBase: new URL(siteUrl),
    title: 'Interior Designers in Delhi NCR | Archovex Infra',
    description: 'Archovex Infra designs and builds home and office interiors in Noida, Greater Noida, Delhi, New Delhi and Gurgaon. Book a free consultation.',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: 'Interior Designers in Delhi NCR | Archovex Infra',
      description: 'Archovex Infra designs and builds home and office interiors in Noida, Greater Noida, Delhi, New Delhi and Gurgaon. Book a free consultation.',
      url: '/',
      siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: ['/logo.png'],
    },
  };
}

export default async function HomePage() {
  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/home').catch(() => null),
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

  // Admin page builder sections for the home page.
  // HomepageClient uses: hero_home section → HeroHomeSection (split layout with form)
  // The rest of the sections (Services, Locations, Process, etc.) are hardcoded React components.
  const customSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0
    ? customPage.sections
    : [];

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      
      <main className="flex-grow">
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
          customSections={customSections}
        />
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
