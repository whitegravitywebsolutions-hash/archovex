import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';
import { getRobotsDirective } from '@/lib/seoConfig';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const pageData = await fetchPublicData('/pages/contact-us').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Contact ARCHOVEX INFRA PRIVATE LIMITED',
      keywords: seo.meta_keywords || '',
      alternates: {
        canonical: seo.canonical_url || '/contact-us',
      },
      openGraph: {
        title: seo.og_title || seo.meta_title,
        description: seo.og_description || seo.meta_description,
        images: seo.og_image ? [{ url: seo.og_image }] : ['/logo.png'],
      },
      robots: getRobotsDirective(seo.robots),
    };
  }

  return {
    title: 'Contact Archovex Infra | Book a Free Consultation',
    description: 'Call, WhatsApp or message Archovex Infra to plan your home or office interiors in Noida, Greater Noida, Delhi, New Delhi or Gurgaon.',
    alternates: {
      canonical: '/contact-us',
    },
    robots: getRobotsDirective(),
  };
}

export default async function ContactPage() {
  const [homeData, customContactPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/contact-us').catch(() => null)
  ]);

  if (!customContactPage || customContactPage.status === 'draft') {
    notFound();
  }

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customContactPage?.sections) ? customContactPage.sections : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://archovex.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Contact Us', item: 'https://archovex.vercel.app/contact-us' },
    ],
  };

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Archovex Infra',
    description: 'Call, WhatsApp or message Archovex Infra to plan your home or office interiors in Noida, Greater Noida, Delhi, New Delhi or Gurgaon.',
    url: 'https://archovex.vercel.app/contact-us',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'ARCHOVEX INFRA PRIVATE LIMITED',
      telephone: '+919217614436',
      email: 'contact@archovex.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Sector 63',
        addressLocality: 'Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201301',
        addressCountry: 'IN',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+919217614436',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
      },
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How soon will someone call me back?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A designer usually calls back within 24 hours on working days. For faster contact, message us on WhatsApp at +91 9217614436. If you contact us outside office hours, we reply on the next working day.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I visit your office without an appointment?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Please book a visit first so a designer is available to meet you. Our office is at Sector 63, Noida and is open Monday to Saturday, 10:00 AM – 7:00 PM. Call or WhatsApp us to fix a time that suits you.',
        },
      },
      {
        '@type': 'Question',
        name: 'What should I share in my first message?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Share your city, property type, approximate size, which rooms need work and your timeline. Photos or a floor plan help us prepare. A budget range is optional but helps us suggest the right materials.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <main className="flex-grow">
        {dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customContactPage?.title || 'Contact Us'}</h1>
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
