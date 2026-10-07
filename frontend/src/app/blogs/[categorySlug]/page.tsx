import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import CategoryPageClient from '@/app/designs/[categorySlug]/CategoryPageClient';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const data = await fetchPublicData(`/design-categories/${categorySlug}`);
  const cat = data?.category;

  if (!cat) {
    return { title: 'Category Not Found | ARCHOVEX INFRA' };
  }

  const seo = cat.seo_data || {};
  const title = seo.meta_title || cat.meta_title || `${cat.name} | ARCHOVEX INFRA PRIVATE LIMITED`;
  const description = seo.meta_description || cat.meta_description || cat.short_description || `Browse custom ${cat.name} blogs & design guides by ARCHOVEX INFRA.`;
  const canonical = seo.canonical_url || cat.canonical_url || `https://archovex.com/blogs/${cat.slug}`;
  const ogTitle = seo.og_title || cat.og_title || title;
  const ogDesc = seo.og_description || cat.og_description || description;
  const ogImg = seo.og_image || cat.og_image || cat.image || '/logo.png';

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: seo.robots_index ?? true,
      follow: seo.robots_follow ?? true,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      siteName: seo.og_site_name || 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: (seo.og_type as any) || 'website',
    },
  };
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const data = await fetchPublicData(`/design-categories/${categorySlug}`);

  if (!data || !data.category) {
    notFound();
  }

  const category = data.category;
  const initialPosts = data.posts?.data || [];
  const faqs = data.faqs || [];

  const homeData = await fetchPublicData('/home');
  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const seo = category.seo_data || {};
  const customSchemaCode = seo.schema_code || '';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://archovex.com/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': category.name,
        'item': `https://archovex.com/blogs/${category.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {customSchemaCode && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: customSchemaCode }}
        />
      )}

      <Header initialMenu={homeData?.menus || []} cities={cities} />

      <main className="flex-grow">
        <CategoryPageClient
          category={category}
          initialPosts={initialPosts}
          faqs={faqs}
          cities={cities}
        />
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
