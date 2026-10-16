import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPublicData('/pages/locations').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Interior Designers Across Delhi NCR',
      alternates: { canonical: seo.canonical_url || '/locations' },
      robots: seo.robots || 'index, follow',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  return {
    metadataBase: new URL(siteUrl),
    title: 'Interior Designers Across Delhi NCR | Archovex Locations',
    description: 'Explore Archovex interior design studios across Delhi NCR: Noida, Greater Noida, Delhi, New Delhi and Gurgaon.',
    alternates: {
      canonical: '/locations',
    },
    openGraph: {
      title: 'Interior Designers Across Delhi NCR | Archovex Locations',
      description: 'Explore Archovex interior design studios across Delhi NCR: Noida, Greater Noida, Delhi, New Delhi and Gurgaon.',
      url: '/locations',
      siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: ['/logo.png'],
    },
  };
}

export default async function LocationsHubPage() {
  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/locations').catch(() => null),
  ]);

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Interior Designers Across Delhi NCR | Archovex Locations',
    url: 'https://archovex.vercel.app/locations',
    description: 'Archovex serves Noida, Greater Noida, Delhi, New Delhi and Gurgaon. Find local interior design, renovation and office fit-out help in your city.',
    provider: {
      '@type': 'Organization',
      '@id': 'https://archovex.vercel.app/#organization',
      name: 'Archovex Infra',
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Interior Designers in Noida', url: 'https://archovex.vercel.app/locations/noida' },
        { '@type': 'ListItem', position: 2, name: 'Interior Designers in Greater Noida', url: 'https://archovex.vercel.app/locations/greater-noida' },
        { '@type': 'ListItem', position: 3, name: 'Interior Designers in Delhi', url: 'https://archovex.vercel.app/locations/delhi' },
        { '@type': 'ListItem', position: 4, name: 'Interior Designers in New Delhi', url: 'https://archovex.vercel.app/locations/new-delhi' },
        { '@type': 'ListItem', position: 5, name: 'Interior Designers in Gurgaon', url: 'https://archovex.vercel.app/locations/gurgaon' },
      ],
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://archovex.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://archovex.vercel.app/locations' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which areas does Archovex serve?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Archovex serves Noida, Greater Noida, Delhi, New Delhi and Gurgaon. We take on homes, offices and commercial spaces in all five cities. If your property is near these areas, share the address and we will confirm whether we can visit.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you charge extra for site visits in different cities?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The first site visit within our five cities is part of our free consultation. Any charges for repeat visits or locations outside these cities are explained before booking.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you work outside Delhi NCR?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our core service area is the five NCR cities listed above. For projects elsewhere, contact us with details and we will tell you honestly whether we can deliver.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the process different in each city?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The steps are the same everywhere. What changes is planning for local rules, such as society work hours, RWA permissions in Delhi colonies and building approvals for offices. We account for these in the schedule.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you have an office I can visit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Our studio is located at Sector 63, Noida and is open Monday to Saturday, 10:00 AM – 7:00 PM. Visits are by appointment so a designer is available to meet you.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      <Breadcrumbs items={[{ label: 'Locations' }]} />
      <main className="flex-grow">
        {dynamicSections && dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'Locations'}</h1>
            <p className="text-xs text-slate-500">
              This page currently has no section content configured. Add sections in the Page Builder to build this page layout.
            </p>
          </div>
        )}
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
