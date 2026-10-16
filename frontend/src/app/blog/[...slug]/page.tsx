import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import BlogDetailClient from './BlogDetailClient';
import CategoryPageClient from '@/app/designs/[categorySlug]/CategoryPageClient';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string | string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const targetSlug = Array.isArray(rawSlug) ? rawSlug[rawSlug.length - 1] : rawSlug;

  // Try direct blog API or design detail API
  let data = await fetchPublicData(`/blogs/${targetSlug}`).catch(() => null);
  if (!data || (!data.post && !data.title)) {
    data = await fetchPublicData(`/designs/${targetSlug}`).catch(() => null);
  }

  const post = data?.post || (data?.title ? data : null);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://archovex.vercel.app');

  if (post && post.title) {
    const seo = post.seo_data || {};
    const title = seo.meta_title || post.meta_title || `${post.title} | ARCHOVEX INFRA`;
    const description = seo.meta_description || post.meta_description || post.short_description || `Read ${post.title} interior design guide by ARCHOVEX.`;
    const canonical = seo.canonical_url || `/blog/${post.slug}`;
    const ogImg = seo.og_image || post.featured_image || '/logo.png';

    return {
      metadataBase: new URL(siteUrl),
      title,
      description,
      alternates: { canonical },
      robots: {
        index: seo.robots_index ?? true,
        follow: seo.robots_follow ?? true,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
        images: [{ url: ogImg, width: 1200, height: 630, alt: title }],
        type: 'article',
      },
    };
  }

  // Check if category exists for category slug fallback
  const catData = await fetchPublicData(`/design-categories/${targetSlug}`).catch(() => null);
  const cat = catData?.category;

  if (cat) {
    const seo = cat.seo_data || {};
    const title = seo.meta_title || cat.meta_title || `${cat.name} | ARCHOVEX INFRA`;
    const description = seo.meta_description || cat.meta_description || cat.short_description || `Browse custom ${cat.name} blogs & design guides by ARCHOVEX INFRA.`;
    const canonical = seo.canonical_url || `/blogs/${cat.slug}`;

    return {
      metadataBase: new URL(siteUrl),
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
        images: [{ url: cat.image || '/logo.png', width: 1200, height: 630, alt: title }],
        type: 'website',
      },
    };
  }

  return { title: 'Blog Post Not Found | ARCHOVEX INFRA' };
}

export default async function DynamicBlogOrCategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const targetSlug = Array.isArray(rawSlug) ? rawSlug[rawSlug.length - 1] : rawSlug;

  // 1. Try single blog post
  let data = await fetchPublicData(`/blogs/${targetSlug}`).catch(() => null);
  if (!data || (!data.post && !data.title)) {
    data = await fetchPublicData(`/designs/${targetSlug}`).catch(() => null);
  }

  const post = data?.post || (data?.title ? data : null);

  const homeData = await fetchPublicData('/home').catch(() => null);
  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://archovex.vercel.app');

  // Render Single Blog Post
  if (post) {
    const related = data?.related || [];

    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': post.title,
      'description': post.short_description || post.meta_description || post.title,
      'image': [post.featured_image || `${siteUrl}/logo.png`],
      'author': {
        '@type': 'Organization',
        'name': 'ARCHOVEX INFRA PRIVATE LIMITED',
        'url': siteUrl
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'ARCHOVEX INFRA PRIVATE LIMITED',
        'logo': {
          '@type': 'ImageObject',
          'url': `${siteUrl}/logo.png`
        }
      },
      'datePublished': post.published_at || post.created_at,
      'dateModified': post.updated_at || post.published_at || post.created_at,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${siteUrl}/blog/${post.slug}`
      }
    };

    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${siteUrl}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${siteUrl}/blog` },
        { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': `${siteUrl}/blog/${post.slug}` }
      ]
    };

    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <Header initialMenu={homeData?.menus || []} cities={cities} />
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title }
          ]}
        />
        <main className="flex-grow">
          <BlogDetailClient post={post} related={related} cities={cities} />
        </main>
        <Footer settings={settings} socialLinks={socialLinks} />
        <FloatingWhatsAppButton number={settings.whatsapp} />
      </div>
    );
  }

  // 2. Try Category fallback
  const catData = await fetchPublicData(`/design-categories/${targetSlug}`).catch(() => null);
  if (catData && catData.category) {
    const category = catData.category;
    const initialPosts = catData.posts?.data || [];
    const faqs = catData.faqs || [];

    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${siteUrl}/` },
        { '@type': 'ListItem', 'position': 2, 'name': category.name, 'item': `${siteUrl}/blog/${category.slug}` }
      ]
    };

    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <Header initialMenu={homeData?.menus || []} cities={cities} />
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: category.name }
          ]}
        />
        <main className="flex-grow">
          <CategoryPageClient category={category} initialPosts={initialPosts} faqs={faqs} cities={cities} hideBreadcrumb={true} />
        </main>
        <Footer settings={settings} socialLinks={socialLinks} />
        <FloatingWhatsAppButton number={settings.whatsapp} />
      </div>
    );
  }

  notFound();
}
