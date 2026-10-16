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
  const pageData = await fetchPublicData('/pages/about-us').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'About Archovex Infra',
      alternates: { canonical: seo.canonical_url || '/about-us' },
      robots: seo.robots || 'index, follow',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  return {
    metadataBase: new URL(siteUrl),
    title: 'About Archovex Infra | Interior Design Company, NCR',
    description: 'Meet Archovex Infra, an interior design and execution company serving homes and businesses in Noida, Greater Noida, Delhi, New Delhi and Gurgaon.',
    alternates: {
      canonical: '/about-us',
    },
    openGraph: {
      title: 'About Archovex Infra | Interior Design Company, NCR',
      description: 'Meet Archovex Infra, an interior design and execution company serving homes and businesses in Noida, Greater Noida, Delhi, New Delhi and Gurgaon.',
      url: '/about-us',
      siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: ['/logo.png'],
    },
  };
}

export default async function AboutUsPage() {
  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/about-us').catch(() => null),
  ]);

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;

  const siteUrl = 'https://archovex.vercel.app';

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Archovex Infra | Interior Design Company, NCR',
    url: `${siteUrl}/about-us`,
    description: 'Meet Archovex Infra, an interior design and execution company serving homes and businesses in Noida, Greater Noida, Delhi, New Delhi and Gurgaon.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Archovex Infra',
      legalName: '[REGISTERED NAME]',
      foundingDate: '[YEAR FOUNDED]',
      founder: {
        '@type': 'Person',
        name: '[FOUNDER NAMES]',
      },
      address: '[ADDRESS]',
      telephone: '[PHONE]',
      email: '[EMAIL]',
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
      sameAs: [
        'https://www.instagram.com/archovexinfra',
        'https://www.facebook.com/archovexinfra',
        '[Google Business Profile URL]',
      ],
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About Us',
        item: `${siteUrl}/about-us`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is behind Archovex Infra?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Archovex Infra was founded by [FOUNDER NAMES] in [YEAR FOUNDED]. The team includes interior designers and site professionals who handle both design and execution. You meet your designer at the first consultation and stay with the same team through the project.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Archovex Infra located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our office is at [ADDRESS]. We work on projects across Noida, Greater Noida, Delhi, New Delhi and Gurgaon. You can visit us by appointment, or we can meet you at your site for the first consultation.',
        },
      },
      {
        '@type': 'Question',
        name: 'What kind of projects does Archovex take on?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We design and build interiors for homes and businesses. Home projects range from a single kitchen or wardrobe to a complete flat or builder floor. Business projects include offices, corporate workplaces, showrooms, retail stores, restaurants and clinics.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is Archovex different from a local carpenter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A carpenter builds what you describe. Archovex plans the full space first, shows you the design, lists every item in the quote and then builds and coordinates all trades. You get one team accountable for the result instead of managing several contractors yourself.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many projects has Archovex completed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Archovex has completed [PROJECTS] projects across homes and businesses in Delhi NCR. Ask your designer for examples similar to your space, including the city and property type, during your consultation.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Archovex work on commercial projects too?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Along with homes, we design offices, corporate workplaces and commercial spaces such as showrooms, restaurants and clinics. These projects follow the same process of site visit, design, itemised quote and managed execution.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
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
      <Breadcrumbs items={[{ label: 'About Us' }]} />
      <main className="flex-grow">
        {dynamicSections && dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'About Us'}</h1>
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
