import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DesignDetailClient from './DesignDetailClient';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug, postSlug } = await params;
  const data = await fetchPublicData(`/design-categories/${categorySlug}/${postSlug}`);
  const post = data?.post;

  if (!post) {
    return { title: 'Design Not Found | ARCHOVEX INFRA' };
  }

  const primaryImg = post.primary_image?.image || post.featured_image || '/logo.png';

  return {
    title: post.meta_title || `${post.title} | ARCHOVEX INFRA PRIVATE LIMITED`,
    description: post.meta_description || post.short_description || `Explore ${post.title} custom interior design by ARCHOVEX.`,
    canonical: post.canonical_url || `https://archovex.com/designs/${categorySlug}/${post.slug}`,
    openGraph: {
      title: post.og_title || post.meta_title || post.title,
      description: post.og_description || post.meta_description || post.short_description,
      images: [post.og_image || primaryImg],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.twitter_title || post.meta_title || post.title,
      description: post.twitter_description || post.meta_description || post.short_description,
      images: [post.twitter_image || primaryImg],
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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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
