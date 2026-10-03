import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DesignsCatalogClient from './DesignsCatalogClient';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Explore All Interior Designs | ARCHOVEX INFRA PRIVATE LIMITED',
  description: 'Browse hundreds of luxury modular kitchen designs, living rooms, sliding wardrobes, and turnkey home interiors across India.',
};


export default async function DesignsPage() {
  const homeData = await fetchPublicData('/home');
  const cities = homeData?.cities || [];
  const categories = homeData?.categories || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
      <Header cities={cities} />

      <main className="flex-grow">
        <DesignsCatalogClient categories={categories} cities={cities} />
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
