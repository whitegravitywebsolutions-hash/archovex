import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import BlogIndexClient from './BlogIndexClient';
import { fetchPublicData } from '@/lib/api';
import { getRobotsDirective } from '@/lib/seoConfig';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPublicData('/pages/blog').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Interior Design Blog: Guides for NCR Homes | Archovex',
      alternates: { canonical: seo.canonical_url || '/blog' },
      robots: getRobotsDirective(seo.robots),
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
    robots: getRobotsDirective(),
  };
}

export default async function BlogIndexPage() {
  const [homeData, customPage, blogsData, categoriesData] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/blog').catch(() => null),
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

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://archovex.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://archovex.vercel.app/blog' },
    ],
  };

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Archovex Interior Design Blog',
    description: 'Practical interior guides for Delhi NCR homes and offices: cost factors, materials, renovation checklists and planning tips from Archovex designers.',
    url: 'https://archovex.vercel.app/blog',
    publisher: {
      '@type': 'Organization',
      name: 'ARCHOVEX INFRA PRIVATE LIMITED',
      logo: 'http://127.0.0.1:8005/storage/media/website/page_tsx_fe9d6266.png',
    },
    blogPost: blogs.map((b: any) => ({
      '@type': 'BlogPosting',
      headline: b.title,
      url: `https://archovex.vercel.app/blog/${b.slug}`,
      datePublished: b.published_at || b.created_at,
      author: {
        '@type': 'Person',
        name: b.author || 'Ar. Vikram Sharma',
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      <Breadcrumbs items={[{ label: 'Blog' }]} />
      <main className="flex-grow">
        <BlogIndexClient
          initialBlogs={blogs}
          initialCategories={categories}
          dynamicSections={dynamicSections}
          whatsappNumber={settings.whatsapp}
        />
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
