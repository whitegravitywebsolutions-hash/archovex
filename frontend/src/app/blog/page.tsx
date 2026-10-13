import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import BlogIndexClient from './BlogIndexClient';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPublicData('/pages/blog').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Interior Design Blog: Guides for NCR Homes | Archovex',
      alternates: { canonical: seo.canonical_url || '/blog' },
      robots: seo.robots || 'index, follow',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  return {
    metadataBase: new URL(siteUrl),
    title: 'Interior Design Blog: Guides for NCR Homes | Archovex',
    description: 'Practical interior guides for Delhi NCR homes and offices: cost factors, materials, renovation checklists and planning tips from Archovex designers.',
    alternates: {
      canonical: '/blog',
    },
    openGraph: {
      title: 'Interior Design Blog: Guides for NCR Homes | Archovex',
      description: 'Practical interior guides for Delhi NCR homes and offices: cost factors, materials, renovation checklists and planning tips from Archovex designers.',
      url: '/blog',
      siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: ['/logo.png'],
    },
  };
}

export default async function BlogIndexPage() {
  const [homeData, blogsData, categoriesData] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/blogs?limit=50').catch(() => null),
    fetchPublicData('/blog-categories').catch(() => null),
  ]);

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  // Extract blogs list: either paginated data or direct array
  const rawBlogs = blogsData?.data || blogsData || [];
  const blogs = Array.isArray(rawBlogs?.data) ? rawBlogs.data : (Array.isArray(rawBlogs) ? rawBlogs : []);

  // Extract categories list
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      <main className="flex-grow">
        <BlogIndexClient initialBlogs={blogs} initialCategories={categories} />
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
