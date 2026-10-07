import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import LocationPageClient from '@/components/public/LocationPageClient';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locationSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locationSlug } = await params;
  const data = await fetchPublicData(`/cities/${locationSlug}`);
  const city = data?.city;

  if (!city) {
    return { title: 'Location Not Found | ARCHOVEX INFRA' };
  }

  return {
    title: city.meta_title || `Best Interior Designers in ${city.name} | ARCHOVEX INFRA`,
    description: city.meta_description || city.description || `Turnkey interior design services in ${city.name}.`,
    alternates: {
      canonical: city.canonical_url || `/locations/${city.slug}`,
    },
  };
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { locationSlug } = await params;
  const data = await fetchPublicData(`/cities/${locationSlug}`);

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
      <Header initialMenu={homeData?.menus || []} cities={cities} />

      <main className="flex-grow">
        <LocationPageClient
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
