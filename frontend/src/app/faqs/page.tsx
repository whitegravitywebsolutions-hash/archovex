import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { fetchPublicData } from '@/lib/api';
import { notFound } from 'next/navigation';
import { getRobotsDirective } from '@/lib/seoConfig';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPublicData('/pages/faqs').catch(() => null);
  if (pageData?.seo_data?.meta_title) {
    const seo = pageData.seo_data;
    return {
      title: seo.meta_title,
      description: seo.meta_description || 'Interior Design FAQs: Cost, Timeline | Archovex',
      alternates: { canonical: seo.canonical_url || '/faqs' },
      robots: getRobotsDirective(seo.robots),
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  return {
    metadataBase: new URL(siteUrl),
    title: 'Interior Design FAQs: Cost, Timeline | Archovex',
    description: 'Answers to common interior design questions: cost, quotes, timelines, materials, payments, warranty and site visits across Delhi NCR.',
    alternates: {
      canonical: '/faqs',
    },
    openGraph: {
      title: 'Interior Design FAQs: Cost, Timeline | Archovex',
      description: 'Answers to common interior design questions: cost, quotes, timelines, materials, payments, warranty and site visits across Delhi NCR.',
      url: '/faqs',
      siteName: 'ARCHOVEX INFRA PRIVATE LIMITED',
      images: ['/logo.png'],
    },
    robots: getRobotsDirective(),
  };
}

export default async function MasterFaqsPage() {
  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/pages/faqs').catch(() => null),
  ]);

  if (!customPage || customPage.status === 'draft') {
    notFound();
  }

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://archovex.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'FAQs', item: 'https://archovex.vercel.app/faqs' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How is the cost of an interior project worked out?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cost is built up item by item: each cabinet, wardrobe, ceiling, electrical point and finish is measured and priced. The total depends on scope, materials, hardware and civil work. Archovex shares this as an itemised quote after the site visit, not as a flat package price.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is a BOQ in interior design?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A BOQ, or bill of quantities, is a list of every item in your project with its size, material, quantity and cost. It lets you see exactly what you are paying for, compare quotes fairly and remove or change items before you approve the project.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do interior quotes from different firms vary so much?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Quotes vary because firms use different board grades, shutter finishes, hardware brands and scopes. One quote may include ceilings and painting while another does not. Always compare itemised quotes line by line, checking materials and brands, not just the total.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the steps in an Archovex project?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every project follows six steps: consultation, site visit and measurement, design and itemised quote, approval of materials, production and site work, and quality check with handover. You approve each stage before the next one begins.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does a typical interior project take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It depends on scope. A single kitchen or wardrobe takes less time than a full home or office. Typical ranges with Archovex: modular kitchen 3–4 weeks, full home 6–8 weeks, and corporate office 4–6 weeks. You get a written schedule before work starts.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I make changes after the design is approved?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, but changes after approval may affect cost and time, especially once production has started. Archovex records changes in writing with their cost and time impact, and work on a change starts only after you approve it.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which materials does Archovex use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We use moisture-resistant boards such as BWP plywood or HDHMR in kitchens and wet areas, and MR-grade boards in dry areas, with laminate, acrylic, PU or veneer finishes as you choose. Exact brands and grades are listed in your quote and our modular kitchen specifications.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does the Archovex warranty cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Archovex offers up to a 10-year warranty on modular woodwork and cabinetry. The warranty covers manufacturing defects, termite resistance and hardware alignment, and excludes normal wear and tear, external water seepage from building walls, or accidental damage. Hardware brands carry their own manufacturer warranties. Full terms are given in your agreement before you sign.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I choose my own materials or brands?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. If you prefer a particular board, laminate or hardware brand (such as Hafele, Hettich, Blum, Merino or Greenlam), tell your designer. We include it in the quote and explain any effect on cost, timeline or warranty.',
        },
      },
      {
        '@type': 'Question',
        name: 'How are payments staged?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Payments are linked to project milestones so you pay as work progresses: an initial token on design sign-off, 50% upon final material approval prior to factory production, 40% upon modular carcass delivery at site before installation, and the remaining 10% on final handover after complete QC inspection. Each payment is listed clearly in your agreement.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer EMI or financing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Archovex assists clients with zero-cost and flexible EMI financing options through partner financial institutions. Ask your designer during the initial consultation for current options and eligibility criteria.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which cities do you work in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Archovex works in Noida, Greater Noida, Delhi, New Delhi and Gurgaon. We design homes, offices and commercial spaces in all five cities. For nearby areas, share your address and we will confirm. View all areas we serve.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the site visit free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The first site visit within our five NCR cities is completely free as part of our initial consultation. We measure your space and discuss layout options before preparing a design and itemised quote.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you take on office and shop projects?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We design offices, corporate workplaces, showrooms, retail stores, restaurants and clinics. These projects include building or mall approvals planning and are scheduled around your move-in or opening date. Learn more under commercial interior design.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you work outside business hours for commercial spaces?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, where the building or mall allows it. Many commercial buildings require noisy work after hours. We plan crews and deliveries around these rules.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens if something needs fixing after handover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Contact us through our dedicated support helpline at +91 9217614436 or email support@archovex.com and describe the issue with photos. Items under warranty are repaired promptly as per terms. We aim to respond within 24 to 48 hours on working days.',
        },
      },
      {
        '@type': 'Question',
        name: 'How should I care for my modular furniture?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Wipe surfaces with a soft, damp cloth and avoid harsh chemicals. Keep water away from edges and joints, especially near sinks. Do not overload shelves or drawers. Report any loose hinge or channel early so it can be adjusted before it wears.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      <Breadcrumbs items={[{ label: 'FAQs' }]} />
      <main className="flex-grow">
        {dynamicSections && dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'FAQs'}</h1>
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
