import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DesignDetailClient from './DesignDetailClient';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';

import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug, postSlug } = await params;
  const data = await fetchPublicData(`/design-categories/${categorySlug}/${postSlug}`);
  const post = data?.post;

  if (!post) {
    return { title: 'Design Not Found | ARCHOVEX INFRA' };
  }

  const seo = post.seo_data || {};
  const primaryImg = post.primary_image?.image || post.featured_image || '/logo.png';

  const title = seo.meta_title || post.meta_title || `${post.title} | ARCHOVEX INFRA PRIVATE LIMITED`;
  const description = seo.meta_description || post.meta_description || post.short_description || `Explore ${post.title} custom interior design by ARCHOVEX.`;
  const canonical = seo.canonical_url || post.canonical_url || `https://archovex.com/designs/${categorySlug}/${post.slug}`;
  const ogTitle = seo.og_title || post.og_title || title;
  const ogDesc = seo.og_description || post.og_description || description;
  const ogImg = seo.og_image || post.og_image || primaryImg;
  const twitterCard = seo.twitter_card || 'summary_large_image';
  const twitterSite = seo.twitter_site || '@archovex';
  const robotsIndex = seo.robots_index ?? true;
  const robotsFollow = seo.robots_follow ?? true;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
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
      type: (seo.og_type as any) || 'article',
    },
    twitter: {
      card: twitterCard,
      site: twitterSite,
      title: ogTitle,
      description: ogDesc,
      images: [ogImg],
    },
  };
}

export default async function DesignDetailPage({ params }: PageProps) {
  const { categorySlug, postSlug } = await params;
  const data = await fetchPublicData(`/design-categories/${categorySlug}/${postSlug}`);

  if (!data || !data.post) {
    notFound();
  }

  const post = data.post;
  const category = data.category;
  const related = data.related || [];

  const homeData = await fetchPublicData('/home');
  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const seo = post.seo_data || {};
  const customSchemaCode = seo.schema_code || '';

  // Article Schema JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.short_description || post.meta_description,
    'image': [post.featured_image || 'https://archovex.com/logo.png'],
    'author': {
      '@type': 'Organization',
      'name': 'ARCHOVEX INFRA PRIVATE LIMITED',
      'url': 'https://archovex.com'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'ARCHOVEX INFRA PRIVATE LIMITED',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://archovex.com/logo.png'
      }
    },
    'datePublished': post.published_at || post.created_at,
    'dateModified': post.updated_at || post.published_at || post.created_at,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://archovex.com/designs/${categorySlug}/${postSlug}`
    }
  };

  // Breadcrumb Schema JSON-LD
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
        'name': category?.name || 'Designs',
        'item': `https://archovex.com/designs/${categorySlug}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.title,
        'item': `https://archovex.com/designs/${categorySlug}/${postSlug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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

      <Header cities={cities} />

      <main className="flex-grow">
        <DesignDetailClient
          post={post}
          category={category}
          related={related}
          cities={cities}
        />
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
