import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import CityPageClient from './CityPageClient';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ citySlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { citySlug } = await params;
  const data = await fetchPublicData(`/cities/${citySlug}`);
  const city = data?.city;

  if (!city) {
    return { title: 'City Not Found | ARCHOVEX INFRA' };
  }

  return {
    title: city.meta_title || `Best Interior Designers in ${city.name} | ARCHOVEX INFRA`,
    description: city.meta_description || city.description || `Turnkey interior design services in ${city.name}.`,
    canonical: city.canonical_url || `https://archovex.com/cities/${city.slug}`,
  };
}

export default async function CityDetailPage({ params }: PageProps) {
  const { citySlug } = await params;
  const data = await fetchPublicData(`/cities/${citySlug}`);

  if (!data || !data.city) {
    notFound();
  }

  const city = data.city;
  const designs = data.designs || [];
  const services = data.services || [];
  const projects = data.projects || [];
  const testimonials = data.testimonials || [];
  const faqs = data.faqs || [];

  const homeData = await fetchPublicData('/home');
  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
      <Header cities={cities} />

      <main className="flex-grow">
        <CityPageClient
          city={city}
          designs={designs}
          services={services}
          projects={projects}
          testimonials={testimonials}
          faqs={faqs}
          cities={cities}
        />
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={city.whatsapp || settings.whatsapp} />
    </div>
  );
}
