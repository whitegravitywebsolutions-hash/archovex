import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { fetchPublicData } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const slug = resolved.slug;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  const pageData = await fetchPublicData(`/pages/locations/${slug}`).catch(() => null);
  if (pageData) {
    const seo = pageData.seo_data || {};
    const title = seo.meta_title || pageData.meta_title || pageData.title || 'Location | Archovex Infra';
    const description = seo.meta_description || pageData.meta_description || 'Interior designers in Delhi NCR by Archovex Infra.';
    return {
      metadataBase: new URL(siteUrl),
      title,
      description,
      alternates: {
        canonical: seo.canonical_url || `/locations/${slug}`,
      },
      openGraph: {
        title: seo.og_title || title,
        description: seo.og_description || description,
        url: seo.og_url || `/locations/${slug}`,
        siteName: seo.og_site_name || 'ARCHOVEX INFRA PRIVATE LIMITED',
        images: seo.og_image ? [{ url: seo.og_image }] : ['/logo.png'],
      },
      robots: seo.robots || 'index, follow',
    };
  }

  return { title: 'Location | Archovex Infra' };
}

export default async function CityLocationPage({ params }: PageProps) {
  const resolved = await params;
  const slug = resolved.slug;

  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData(`/pages/locations/${slug}`).catch(() => null),
  ]);

  if (!customPage) {
    notFound();
  }

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;
  const siteUrl = 'https://archovex.vercel.app';

  let serviceSchema: any = null;
  let breadcrumbSchema: any = null;
  let faqSchema: any = null;

  if (slug === 'noida') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Interior Design in Noida',
      name: 'Interior Designers in Noida | Archovex Infra',
      description: 'Interior designers in Noida for new flats, Expressway apartments and offices. Kitchens, wardrobes and full homes with itemised quotes. Book a visit.',
      url: `${siteUrl}/locations/noida`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: {
        '@type': 'City',
        name: 'Noida',
      },
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Locations', item: `${siteUrl}/locations` },
        { '@type': 'ListItem', position: 3, name: 'Noida', item: `${siteUrl}/locations/noida` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does a 2BHK interior cost in Noida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A 2BHK interior in Noida can vary widely, depending on whether you do only the kitchen and wardrobes or the full home, and on the materials you choose. Archovex visits your flat and shares an itemised quote, so you see each room\'s cost before deciding.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which interior designer is best for a new flat in Noida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Look for a firm that handles both design and execution, shares an itemised quote, names materials in writing and has worked in Noida societies before. Ask to see recent local projects and check how they handle society rules and after-sales support.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you work in my Noida society?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We work within your society\'s rules on work hours, lift use and debris disposal. Share your society\'s guidelines at the start and we plan the schedule around them, assisting with paperwork and security gate passes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you design flats on the Noida–Greater Noida Expressway?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We design new possessions along the Expressway. These flats often need full home interiors, so we plan the kitchen and wardrobes first to help you move in sooner.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you design offices in Noida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We design and fit out offices for small and growing teams, including in established business sectors such as 62 and 63. We plan around building rules and your move-in date.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does interior work take for a Noida flat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A full home in Noida typically takes 45 to 60 days from design approval to handover. Society work hours and civil work can affect this. We share a written schedule before starting.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which materials suit Noida\'s weather?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Noida\'s humid monsoon months can damage low-grade boards. We recommend BWP plywood or HDHMR in kitchens and bathrooms, and good edge sealing on all furniture. Your designer explains options for each room.',
          },
        },
      ],
    };
  } else if (slug === 'greater-noida') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Interior Design in Greater Noida',
      name: 'Interior Designers in Greater Noida | Archovex',
      description: 'Interior designers in Greater Noida and Noida Extension for new flats: phased, budget-aware interiors with itemised quotes and one team to handover.',
      url: `${siteUrl}/locations/greater-noida`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: [
        { '@type': 'City', name: 'Greater Noida' },
        { '@type': 'Place', name: 'Greater Noida West' },
      ],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Locations', item: `${siteUrl}/locations` },
        { '@type': 'ListItem', position: 3, name: 'Greater Noida', item: `${siteUrl}/locations/greater-noida` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much do interiors cost for a 2BHK in Greater Noida West?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cost depends on whether you start with only the kitchen and wardrobes or do the whole flat, and on the materials you pick. Archovex visits your flat and shares an itemised quote, and can split it into phases to match your budget.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I do my interiors in phases?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We design the full home first, then build in phases, usually starting with the kitchen and wardrobes. Because the design is fixed upfront, later rooms match the earlier ones in finish and style.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you work in Noida Extension societies like Gaur City?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We work across Greater Noida West, also called Noida Extension, including large townships like Gaur City. We plan the work around each society\'s rules on timings, lifts and debris.',
          },
        },
        {
          '@type': 'Question',
          name: 'Should I hire an interior firm or a local carpenter?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A carpenter builds what you describe. A firm like Archovex plans the full home, lists every item and material in the quote, and manages all trades. Compare itemised quotes to see the real difference in scope and materials.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you start the design before possession?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. If you have the floor plan, we can start the layout and design early. We confirm measurements once you get the keys, so work can begin soon after handover.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you serve the Yamuna Expressway area?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We design homes along the Yamuna Expressway belt, including newer projects in sectors such as 22D. Share your project name and we will confirm the site visit.',
          },
        },
      ],
    };
  } else if (slug === 'delhi') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Interior Design in Delhi',
      name: 'Interior Designers in Delhi | Archovex Infra',
      description: 'Interior designers in Delhi for builder floors, independent houses and renovations of older homes. Itemised quotes, one team, RWA-aware planning.',
      url: `${siteUrl}/locations/delhi`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: {
        '@type': 'City',
        name: 'Delhi',
      },
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Locations', item: `${siteUrl}/locations` },
        { '@type': 'ListItem', position: 3, name: 'Delhi', item: `${siteUrl}/locations/delhi` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Do you design builder floors in Delhi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We design newly built floors as well as redeveloped builder floors across South, West and Central Delhi. We coordinate with builders or owners directly.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you renovate an older flat or house in Delhi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Home renovation is our most common service in Delhi. We handle demolition, civil repairs, re-plumbing, re-wiring, flooring and fresh interiors under one contract.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you handle RWA rules in Delhi colonies?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We coordinate with your colony RWA regarding work hours, noise limits and debris clearance. We schedule heavy drilling during permitted daytime windows.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which parts of Delhi do you serve?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We serve South Delhi colonies (GK, Defence Colony, Hauz Khas, Saket), Central Delhi, West Delhi (Punjabi Bagh, Rajouri Garden, Patel Nagar) and East Delhi.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a builder floor interior take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A complete builder floor interior in Delhi typically takes 60 to 75 days, accounting for custom carpentry, civil adjustments and RWA restrictions.',
          },
        },
      ],
    };
  } else if (slug === 'new-delhi') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Interior Design in New Delhi',
      name: 'Interior Designers in New Delhi | Archovex Infra',
      description: 'Interior designers in New Delhi for luxury homes, central enclaves and corporate offices in Connaught Place. Bespoke finishes, discreet turnkey execution.',
      url: `${siteUrl}/locations/new-delhi`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: {
        '@type': 'City',
        name: 'New Delhi',
      },
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Locations', item: `${siteUrl}/locations` },
        { '@type': 'ListItem', position: 3, name: 'New Delhi', item: `${siteUrl}/locations/new-delhi` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Do you work in central New Delhi colonies like Jor Bagh and Golf Links?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We take on interior projects in central New Delhi enclaves. Because these homes often have high ceilings and heritage details, we plan custom joinery and structural protections carefully.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you protect client privacy in New Delhi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We operate under strict confidentiality agreements. No photos of your private residence or offices are published or shared without your explicit written approval.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you fit out offices in Connaught Place?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We design and deliver executive offices and commercial spaces in Connaught Place and Barakhamba Road, coordinating with NDMC guidelines and heritage building parameters.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you source imported Italian marble and rare veneers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We accompany clients to verified stone and veneer yards in Delhi NCR to select slabs personally before cutting and book-matching.',
          },
        },
      ],
    };
  } else if (slug === 'gurgaon') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Interior Design in Gurgaon',
      name: 'Interior Designers in Gurgaon | Archovex Infra',
      description: 'Interior designers in Gurgaon for luxury apartments on Golf Course Extension Road, Dwarka Expressway and corporate offices. Turnkey execution with itemised quotes.',
      url: `${siteUrl}/locations/gurgaon`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: {
        '@type': 'City',
        name: 'Gurugram',
        alternateName: 'Gurgaon',
      },
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Locations', item: `${siteUrl}/locations` },
        { '@type': 'ListItem', position: 3, name: 'Gurgaon', item: `${siteUrl}/locations/gurgaon` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does a 3BHK interior cost in Gurgaon?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A 3BHK interior in Gurgaon varies with apartment size, rooms covered, finish level and custom features. Premium apartments on Golf Course Extension Road often use higher-end veneers and hardware. Archovex measures your home and shares an itemised quote with options at different finish tiers.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you design flats on Dwarka Expressway?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We design new apartments along Dwarka Expressway, including newer projects in Sectors 102 to 104, 109 and 113. Share your project name and possession date and we will plan the site visit.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you work on Golf Course Extension Road?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We design premium apartments on Golf Course Extension Road. These homes are usually large, so we focus on zoning open spaces, lighting and high-quality finishes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I manage my Gurgaon project from abroad?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Many owners choose our turnkey model with one project lead. We share regular photo and video progress updates, and approvals can be handled remotely. You visit only for key decisions or final handover.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you design corporate offices in Gurgaon?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We plan and deliver corporate office fit-outs, from space planning to furniture and handover, coordinated with building management and your move date.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does my Gurgaon society have fit-out rules?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most gated societies have fit-out rules covering work hours, lift use, security deposits and debris. We review your facility manager\'s guidelines early and plan our schedule around them.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Gurgaon the same as Gurugram?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The city was officially renamed Gurugram in 2016, but both names are widely used. Archovex serves the whole city under either name.',
          },
        },
      ],
    };
  }

  const cityTitles: Record<string, string> = {
    'noida': 'Noida',
    'greater-noida': 'Greater Noida',
    'gurgaon': 'Gurgaon',
    'delhi': 'Delhi',
    'new-delhi': 'New Delhi',
  };
  const currentCityTitle = cityTitles[slug] || customPage?.title?.split('|')[0]?.trim() || slug.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Header initialMenu={homeData?.menus || []} cities={cities} />
      <Breadcrumbs items={[{ label: 'Locations', href: '/locations' }, { label: currentCityTitle }]} />

      <main className="flex-grow">
        {dynamicSections && dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'Location'}</h1>
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
