import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import HomepageClient from './HomepageClient';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://archovex.vercel.app');
    
  const pageData = await fetchPublicData('/pages/home');

  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      metadataBase: new URL(siteUrl),
      title: seo.meta_title,
      description: seo.meta_description || 'ARCHOVEX INFRA PRIVATE LIMITED',
      keywords: seo.meta_keywords || '',
      alternates: {
        canonical: seo.canonical_url || '/',
      },
      openGraph: {
        title: seo.og_title || seo.meta_title,
        description: seo.og_description || seo.meta_description,
        url: seo.og_url || seo.canonical_url || siteUrl,
        siteName: seo.og_site_name || 'ARCHOVEX INFRA PRIVATE LIMITED',
        images: seo.og_image ? [{ url: seo.og_image }] : ['/logo.png'],
      },
      robots: seo.robots || 'index, follow',
    };
  }

  return {
    metadataBase: new URL(siteUrl),
    title: 'Interior Designers in Delhi NCR | Archovex Infra',
    description: 'Archovex Infra designs and builds home and office interiors in Noida, Greater Noida, Delhi, New Delhi and Gurgaon. Book a free consultation.',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: 'Interior Designers in Delhi NCR | Archovex Infra',
      description: 'Archovex Infra designs and builds home and office interiors in Noida, Greater Noida, Delhi, New Delhi and Gurgaon. Book a free consultation.',
      url: '/',
      siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: ['/logo.png'],
    },
  };
}

export default async function HomePage() {
  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/home').catch(() => null),
  ]);

  const categories = homeData?.categories || [];
  const featuredDesigns = homeData?.featured_designs || [];
  const services = homeData?.services || [];
  const projects = homeData?.projects || [];
  const cities = homeData?.cities || [];
  const testimonials = homeData?.testimonials || [];
  const faqs = homeData?.faqs || [];
  const blogs = homeData?.blogs || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  // Admin page builder sections for the home page.
  // HomepageClient uses: hero_home section → HeroHomeSection (split layout with form)
  // The rest of the sections (Services, Locations, Process, etc.) are hardcoded React components.
  const customSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0
    ? customPage.sections
    : [];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much do home interiors cost in Delhi NCR?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cost depends on the size of your home, the rooms included, the materials you pick and any civil work. There is no fixed rate that fits every home. Archovex visits your site, discusses your needs and then shares an itemised quote, so you know the cost of each part before deciding.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does a full home interior project take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Timelines depend on the number of rooms, how much carpentry is involved and whether civil work is needed. A typical full home takes [TIMELINE]. We share a written schedule after design approval, and we update you at each stage.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which areas does Archovex serve?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Archovex works in Noida, Greater Noida, Delhi, New Delhi and Gurgaon. Our team visits your site for measurement and checks in during execution. If your property is just outside these cities, contact us and we will confirm whether we can take it on.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you handle both design and execution?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Archovex designs the space and also builds it. Our team manages carpentry, installation and coordination of civil work, so you deal with one team instead of several contractors. This keeps responsibility clear and reduces delays between trades.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you design offices and commercial spaces?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Along with homes, we design offices, corporate workplaces, showrooms, retail stores, restaurants and clinics. Commercial projects follow the same steps of site visit, design, itemised quote and execution, with the schedule planned around your business needs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the first consultation free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Your first consultation with an Archovex designer is free and carries no obligation. We use it to understand your space, needs and budget, and to explain how a project with us would work. [CONFIRM what is included, e.g. site visit or design.]',
        },
      },
      {
        '@type': 'Question',
        name: 'What warranty do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Archovex offers [WARRANTY TERMS] on the work we deliver. Your quote and agreement list what the warranty covers and for how long. Ask your designer for the full terms before you sign.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I do just one room instead of the whole home?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We take on single rooms such as a kitchen, bedroom or living room, as well as complete homes. Many clients start with one room and add others later. Your designer will help you plan so the rooms match over time.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      
      <main className="flex-grow">
        <HomepageClient
          categories={categories}
          featuredDesigns={featuredDesigns}
          services={services}
          projects={projects}
          cities={cities}
          testimonials={testimonials}
          faqs={faqs}
          blogs={blogs}
          settings={settings}
          customSections={customSections}
        />
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
