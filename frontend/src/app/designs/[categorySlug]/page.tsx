import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import CategoryPageClient from './CategoryPageClient';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug } = await params;
  const data = await fetchPublicData(`/design-categories/${categorySlug}`);
  const cat = data?.category;

  if (!cat) {
    return { title: 'Category Not Found | ARCHOVEX INFRA' };
  }

  return {
    title: cat.meta_title || `${cat.name} | ARCHOVEX INFRA PRIVATE LIMITED`,
    description: cat.meta_description || cat.short_description || `Browse custom ${cat.name} by ARCHOVEX INFRA.`,
    canonical: cat.canonical_url || `https://archovex.com/designs/${cat.slug}`,
    openGraph: {
      title: cat.og_title || cat.meta_title || cat.name,
      description: cat.og_description || cat.meta_description || cat.short_description,
      images: [cat.og_image || cat.image || '/logo.png'],
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
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

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header cities={cities} />

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
