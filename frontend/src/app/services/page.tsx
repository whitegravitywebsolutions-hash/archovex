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
  const pageData = await fetchPublicData('/pages/services').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Interior Design Services in Delhi NCR',
      alternates: { canonical: seo.canonical_url || '/services' },
      robots: seo.robots || 'index, follow',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  return {
    metadataBase: new URL(siteUrl),
    title: 'Interior Design Services in Delhi NCR | Archovex',
    description: 'Home and commercial interior design services by Archovex: full home, modular kitchens, wardrobes, renovation, offices and turnkey projects in NCR.',
    alternates: {
      canonical: '/services',
    },
    openGraph: {
      title: 'Interior Design Services in Delhi NCR | Archovex',
      description: 'Home and commercial interior design services by Archovex: full home, modular kitchens, wardrobes, renovation, offices and turnkey projects in NCR.',
      url: '/services',
      siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: ['/logo.png'],
    },
  };
}

export default async function ServicesHubPage() {
  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/services').catch(() => null),
  ]);

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;

  const siteUrl = 'https://archovex.vercel.app';

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Interior Design Services for Homes and Businesses',
    url: `${siteUrl}/services`,
    description: 'Home and commercial interior design services by Archovex: full home, modular kitchens, wardrobes, renovation, offices and turnkey projects in NCR.',
    hasPart: [
      { '@type': 'WebPage', url: `${siteUrl}/services/full-home-interior-design`, name: 'Full Home Interior Design' },
      { '@type': 'WebPage', url: `${siteUrl}/services/modular-kitchen-design`, name: 'Modular Kitchen Design' },
      { '@type': 'WebPage', url: `${siteUrl}/services/living-room-interior-design`, name: 'Living Room Interior Design' },
      { '@type': 'WebPage', url: `${siteUrl}/services/bedroom-interior-design`, name: 'Bedroom Interior Design' },
      { '@type': 'WebPage', url: `${siteUrl}/services/wardrobe-design`, name: 'Wardrobe Design' },
      { '@type': 'WebPage', url: `${siteUrl}/services/home-renovation`, name: 'Home Renovation & Remodeling' },
      { '@type': 'WebPage', url: `${siteUrl}/services/office-interior-design`, name: 'Office Interior Design' },
      { '@type': 'WebPage', url: `${siteUrl}/services/corporate-office-interior-design`, name: 'Corporate Office Interior Design' },
      { '@type': 'WebPage', url: `${siteUrl}/services/commercial-interior-design`, name: 'Commercial Interior Design' },
      { '@type': 'WebPage', url: `${siteUrl}/services/turnkey-interior-design`, name: 'Turnkey Interior Design' },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Archovex Interior Design Services',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Full Home Interior Design',
        url: `${siteUrl}/services/full-home-interior-design`,
        item: {
          '@type': 'Service',
          name: 'Full Home Interior Design',
          url: `${siteUrl}/services/full-home-interior-design`,
          provider: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Archovex Infra',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Modular Kitchen Design',
        url: `${siteUrl}/services/modular-kitchen-design`,
        item: {
          '@type': 'Service',
          name: 'Modular Kitchen Design',
          url: `${siteUrl}/services/modular-kitchen-design`,
          provider: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Archovex Infra',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Living Room Interior Design',
        url: `${siteUrl}/services/living-room-interior-design`,
        item: {
          '@type': 'Service',
          name: 'Living Room Interior Design',
          url: `${siteUrl}/services/living-room-interior-design`,
          provider: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Archovex Infra',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Bedroom Interior Design',
        url: `${siteUrl}/services/bedroom-interior-design`,
        item: {
          '@type': 'Service',
          name: 'Bedroom Interior Design',
          url: `${siteUrl}/services/bedroom-interior-design`,
          provider: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Archovex Infra',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Wardrobe Design',
        url: `${siteUrl}/services/wardrobe-design`,
        item: {
          '@type': 'Service',
          name: 'Wardrobe Design',
          url: `${siteUrl}/services/wardrobe-design`,
          provider: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Archovex Infra',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Home Renovation & Remodeling',
        url: `${siteUrl}/services/home-renovation`,
        item: {
          '@type': 'Service',
          name: 'Home Renovation & Remodeling',
          url: `${siteUrl}/services/home-renovation`,
          provider: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Archovex Infra',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 7,
        name: 'Office Interior Design',
        url: `${siteUrl}/services/office-interior-design`,
        item: {
          '@type': 'Service',
          name: 'Office Interior Design',
          url: `${siteUrl}/services/office-interior-design`,
          provider: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Archovex Infra',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 8,
        name: 'Corporate Office Interior Design',
        url: `${siteUrl}/services/corporate-office-interior-design`,
        item: {
          '@type': 'Service',
          name: 'Corporate Office Interior Design',
          url: `${siteUrl}/services/corporate-office-interior-design`,
          provider: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Archovex Infra',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 9,
        name: 'Commercial Interior Design',
        url: `${siteUrl}/services/commercial-interior-design`,
        item: {
          '@type': 'Service',
          name: 'Commercial Interior Design',
          url: `${siteUrl}/services/commercial-interior-design`,
          provider: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Archovex Infra',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 10,
        name: 'Turnkey Interior Design',
        url: `${siteUrl}/services/turnkey-interior-design`,
        item: {
          '@type': 'Service',
          name: 'Turnkey Interior Design',
          url: `${siteUrl}/services/turnkey-interior-design`,
          provider: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Archovex Infra',
          },
        },
      },
    ],
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
        name: 'Services',
        item: `${siteUrl}/services`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What interior design services does Archovex offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Archovex offers full home interiors, modular kitchens, living rooms, bedrooms, wardrobes and home renovation for residential clients. For businesses, we design offices, corporate workplaces and commercial spaces. We also offer turnkey projects where one contract covers design, civil work and execution.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do your services include execution or only design?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every Archovex service includes both design and execution. Our team plans the space, shares an itemised quote, then manages carpentry, installation and civil work on site. You do not need to hire separate contractors to build the design.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between full home and turnkey interiors?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Full home interiors cover the design and furniture of every room in your home. Turnkey goes further: one contract includes civil work such as electrical, plumbing, flooring and painting as well. Turnkey is also available for offices and commercial spaces.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I combine services, like a kitchen and wardrobes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Many clients combine a modular kitchen with wardrobes or bedrooms. Your designer plans them together so finishes match and site work is done in one schedule, which usually saves time compared with doing each room separately.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer these services in all your cities?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Archovex offers its services across Noida, Greater Noida, Delhi, New Delhi and Gurgaon. [CONFIRM any service not offered in a specific city.] Share your location when you enquire and we will confirm the next steps.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
      <Breadcrumbs items={[{ label: 'Services' }]} />

      <main className="flex-grow">
        {dynamicSections && dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'Services'}</h1>
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
