import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { fetchPublicData } from '@/lib/api';
import { getRobotsDirective } from '@/lib/seoConfig';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const slug = resolved.slug;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.vercel.app';

  const pageData = await fetchPublicData(`/pages/services/${slug}`).catch(() => null);
  if (pageData) {
    const seo = pageData.seo_data || {};
    const title = seo.meta_title || pageData.meta_title || pageData.title || 'Service | Archovex Infra';
    const description = seo.meta_description || pageData.meta_description || 'Interior design services by Archovex Infra.';
    return {
      metadataBase: new URL(siteUrl),
      title,
      description,
      alternates: {
        canonical: seo.canonical_url || `/services/${slug}`,
      },
      openGraph: {
        title: seo.og_title || title,
        description: seo.og_description || description,
        url: seo.og_url || `/services/${slug}`,
        siteName: seo.og_site_name || 'ARCHOVEX INFRA PRIVATE LIMITED',
        images: seo.og_image ? [{ url: seo.og_image }] : ['/logo.png'],
      },
      robots: getRobotsDirective(seo.robots),
    };
  }

  return { title: 'Service | Archovex Infra', robots: getRobotsDirective() };
}

export default async function ServicePageRouter({ params }: PageProps) {
  const resolved = await params;
  const slug = resolved.slug;

  const [homeData, customPage] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData(`/pages/services/${slug}`).catch(() => null),
  ]);

  if (!customPage || customPage.status === 'draft') {
    notFound();
  }

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  const dynamicSections = Array.isArray(customPage?.sections) && customPage.sections.length > 0 ? customPage.sections : null;
  const siteUrl = 'https://archovex.vercel.app';

  // Batch B Schemas
  let serviceSchema: any = null;
  let breadcrumbSchema: any = null;
  let faqSchema: any = null;

  if (slug === 'full-home-interior-design') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Full Home Interior Design',
      name: 'Full Home Interior Design in Delhi NCR',
      description: 'Complete 1–4 BHK home interiors planned room by room, with itemised quotes and one team from design to handover in Noida, Delhi and Gurgaon.',
      url: `${siteUrl}/services/full-home-interior-design`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: 'Full Home Interior Design', item: `${siteUrl}/services/full-home-interior-design` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is included in full home interior design?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Full home interior design covers layout planning and built-in furniture for every room you choose, such as the kitchen, wardrobes, TV unit and storage. It usually also includes false ceilings, lighting, electrical points and painting. Your quote lists exactly what is included.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does full home interior cost for a 3BHK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'There is no single price for a 3BHK. Cost depends on how many rooms get built-in furniture, the board and finish you choose, hardware and civil work. Archovex visits your home and shares an itemised quote, so you can adjust scope before deciding.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a full home interior project take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A typical full home project takes [TIMELINE – FULL HOME] from design approval to handover. The schedule depends on the number of rooms, civil work, approval speed and society rules. You get a written schedule before work begins.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I live in the house during the work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It is possible for smaller projects, but full home work involves dust, noise and materials in every room. Most clients move in after handover. If you need to stay, we can plan the work in phases, room by room.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you provide 3D designs before work starts?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '[CONFIRM: Yes. You see design views of each room before approving the quote, and changes are made at this stage, not on site.] Approving the design in advance avoids costly changes once production starts.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I do my home in phases?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Many clients start with the kitchen and wardrobes, then add the living room and décor later. We plan the full home upfront so later phases match the first.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the price include furniture like sofas and beds?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Built-in furniture such as wardrobes, kitchen units and TV units is part of the scope. Loose furniture like sofas, beds and dining sets is usually quoted separately or sourced by you. [CONFIRM Archovex's approach.]",
          },
        },
        {
          '@type': 'Question',
          name: 'Which material is best for a full home?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use BWP plywood or HDHMR in the kitchen and other wet areas, and MR-grade boards or HDHMR for wardrobes. Laminate works well for daily use, while acrylic or PU suits a premium look. Your designer will suggest options for each room.',
          },
        },
      ],
    };
  } else if (slug === 'modular-kitchen-design') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Modular Kitchen Design',
      name: 'Modular Kitchen Design in Delhi NCR',
      description: 'Modular kitchens planned around how you cook: L-shaped, parallel, U-shaped and island layouts, honest material advice and an itemised quote.',
      url: `${siteUrl}/services/modular-kitchen-design`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: 'Modular Kitchen Design', item: `${siteUrl}/services/modular-kitchen-design` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the cost of a modular kitchen per sq ft?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cost per sq ft varies widely with board grade, shutter finish, countertop and hardware. A laminate kitchen with standard fittings costs far less than an acrylic kitchen with branded accessories. Archovex shares an itemised quote after measuring your kitchen, so you see each part\'s cost.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which is the best material for a modular kitchen in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For the cabinet body, BWP plywood or HDHMR board works best because kitchens face water and heat daily. For shutters, laminate offers durability and value, while acrylic or PU gives a glossy, premium finish. Your designer will match materials to your budget and use.',
          },
        },
        {
          '@type': 'Question',
          name: 'BWP plywood or HDHMR: which is better for a kitchen?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Both handle moisture well. BWP plywood is the traditional choice for sink areas and holds screws strongly. HDHMR is dense, smooth and resists moisture and termites. Many kitchens use either successfully; the brand, grade and edge sealing matter as much as the board type.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which kitchen layout is best for a small flat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In small flats, a straight or L-shaped layout usually works best. It keeps a clear walkway and leaves room for a fridge and tall unit. Parallel kitchens suit narrow rooms. Your designer will recommend a layout after measuring your space.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a modular kitchen take to install?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An Archovex kitchen typically takes [TIMELINE – KITCHEN] from design approval to installation. On-site fitting usually takes a few days once units arrive. Finishes like PU and special countertops can extend the schedule.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you replace an old kitchen without breaking the platform?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Often yes. If the existing platform is level and sound, new base units can sometimes be fitted around it. In many older kitchens, removing the platform gives better storage. We check during the site visit and explain both options.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do modular kitchens come with a warranty?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Archovex kitchens come with [WARRANTY TERMS]. Hardware brands often carry their own warranty too. Your quote and agreement list what is covered and for how long.',
          },
        },
      ],
    };
  } else if (slug === 'living-room-interior-design') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Living Room Interior Design',
      name: 'Living Room Interior Design in Delhi NCR',
      description: 'Living room interiors with TV units, false ceilings, lighting and storage, designed and built by one team across Noida, Delhi and Gurgaon.',
      url: `${siteUrl}/services/living-room-interior-design`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: 'Living Room Interior Design', item: `${siteUrl}/services/living-room-interior-design` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does living room interior design cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cost depends on room size, how much of the wall gets panelling or a TV unit, the ceiling design, lighting and finishes. A simple TV unit with paint costs far less than a full feature wall with layered lighting. Archovex shares an itemised quote after the site visit.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which false ceiling is best for a living room?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Gypsum board false ceilings suit most living rooms. They give clean lines, hide wiring and can be repaired easily. A single cove with warm lighting suits low ceilings, while taller rooms can take layered or wood-accent designs.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I design a small living room?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Keep the floor clear with a wall-mounted TV unit, choose a sofa sized to the room, and use closed storage to hide clutter. Light colours and a mirror or two help the room feel larger. Good lighting matters more than extra furniture.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the right distance between the sofa and the TV?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A common guide is to sit about 1.5 to 2.5 times the screen\'s diagonal size away from it. For a 55-inch TV, that is roughly 2 to 3.5 metres. Your designer will adjust for room shape and seating.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you design the living and dining area together?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. In most NCR flats the living and dining areas share one space. We plan them as one zone, with matching finishes, a clear walkway and lighting that separates the two areas when needed.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you supply sofas and décor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '[CONFIRM: Archovex builds fixed elements like TV units, panels and ceilings, and can help you choose or source sofas, rugs, curtains and décor so they match the design.] Ask your designer what is included in your quote.',
          },
        },
      ],
    };
  } else if (slug === 'bedroom-interior-design') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Bedroom Interior Design',
      name: 'Bedroom Interior Design in Delhi NCR',
      description: "Bedroom interiors with wardrobes, bed back panels, lighting and storage for master, kids' and guest rooms, designed and built by Archovex in NCR.",
      url: `${siteUrl}/services/bedroom-interior-design`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: 'Bedroom Interior Design', item: `${siteUrl}/services/bedroom-interior-design` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does bedroom interior design cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cost depends mainly on wardrobe size and fittings, the bed wall design, ceiling and lighting, and your choice of finishes. A bedroom with a laminate wardrobe and painted walls costs much less than one with a veneer wardrobe and upholstered panel. Archovex shares an itemised quote after measuring.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I add storage to a small bedroom?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use full-height wardrobes with lofts, a bed with drawers or a hydraulic lift, and wall-mounted side tables. Sliding wardrobe doors save space where the walkway is narrow. Your designer can also use the space above the door and window.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you design a bedroom as per Vastu?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. If you follow Vastu, tell us at the first meeting. We can plan bed direction, wardrobe placement and the position of mirrors around your preferences, within the limits of your room's layout and doors.",
          },
        },
        {
          '@type': 'Question',
          name: 'What should a kids\' bedroom include?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "A kids' room usually needs a bed, a wardrobe, a study table with good lighting, and open storage for books and toys. Choose rounded edges and washable finishes. Plan furniture that can be updated as your child grows.",
          },
        },
        {
          '@type': 'Question',
          name: 'Which false ceiling suits a bedroom?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A simple gypsum ceiling with a soft cove light suits most bedrooms. It hides wiring and gives warm evening light. Avoid heavy, multi-level designs in rooms with low ceilings, as they can make the room feel smaller.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can my bedroom also work as a home office?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We can add a compact desk, task lighting, extra power points and closed storage for work files. In guest rooms, a fold-down desk or a sofa-bed setup keeps the room flexible.',
          },
        },
      ],
    };
  } else if (slug === 'wardrobe-design') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Wardrobe Design',
      name: 'Wardrobe Design in Delhi NCR',
      description: 'Sliding, hinged and walk-in wardrobes sized to your wall and what you store, with honest material advice and an itemised quote from Archovex.',
      url: `${siteUrl}/services/wardrobe-design`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: 'Wardrobe Design', item: `${siteUrl}/services/wardrobe-design` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Sliding or hinged wardrobe: which is better?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hinged wardrobes open fully and suit most rooms. Sliding wardrobes save space and suit rooms where the bed is close to the wall, but only part opens at a time. Choose by room width and how you use the wardrobe daily.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the cost of a wardrobe per sq ft?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cost per sq ft depends on the board, shutter finish, door type and accessories. A laminate hinged wardrobe costs much less than a glass sliding one with lighting. Archovex measures your wall and shares an itemised quote before you decide.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which laminate is best for wardrobe shutters?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Matte or textured laminates hide fingerprints and small scratches, so they suit daily use. High-gloss laminate looks brighter but shows marks. Ask your designer for thickness and brand options; a thicker, branded laminate lasts longer.',
          },
        },
        {
          '@type': 'Question',
          name: 'Should my wardrobe go up to the ceiling?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Usually yes. A full-height wardrobe with a loft adds storage for suitcases and seasonal items and avoids a dusty gap on top. In rooms with very high ceilings, the top section can be split into a separate loft.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you fit a wardrobe on an uneven wall?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We measure at several points and use filler panels and adjustable fittings so the wardrobe sits straight even if the wall or floor is not perfectly level.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a modular wardrobe last?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A well-made wardrobe with good board and hardware can last many years with basic care. Lifespan depends on material grade, hardware quality and how it is used. Archovex wardrobes come with [WARRANTY TERMS].',
          },
        },
      ],
    };
  } else if (slug === 'home-renovation') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Home Renovation and Remodeling',
      name: 'Home Renovation & Remodeling in Delhi NCR',
      description: 'Renovation for older flats, builder floors and houses: kitchens, bathrooms, flooring, wiring and full remodels, planned and managed by Archovex.',
      url: `${siteUrl}/services/home-renovation`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: 'Home Renovation & Remodeling', item: `${siteUrl}/services/home-renovation` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does home renovation cost per sq ft?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "There is no reliable single rate, because renovation cost depends on the home's condition and scope. A paint-and-storage update costs far less than one with new wiring, plumbing and floors. Archovex surveys your home first and shares an itemised quote.",
          },
        },
        {
          '@type': 'Question',
          name: 'Can I live in my house during renovation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For one or two rooms, yes, with dust barriers and phased work. For full renovations with plumbing, wiring and flooring work, most families move out for part or all of the project. We plan the sequence around your choice.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need permission from my society or RWA to renovate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Most societies and RWAs require notice for renovation and set work hours, debris rules and lift use. Structural changes need separate approvals and an engineer's assessment. Check your society's rules early; we plan the work schedule around them.",
          },
        },
        {
          '@type': 'Question',
          name: 'Can you remove a wall during renovation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Non-load-bearing partitions can often be removed. Load-bearing walls, columns and beams must not be altered without a structural engineer's check and the required approvals. We assess this during the site survey and advise you before planning.",
          },
        },
        {
          '@type': 'Question',
          name: 'Should I rewire an old home during renovation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'If your wiring is old, overloaded or keeps tripping, rewiring during renovation is the safest and cheapest time to do it, because walls are already open. We check the condition of wiring and the distribution board during the survey.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between renovation and remodeling?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Renovation updates or repairs what exists, such as new finishes, wiring or fittings. Remodeling changes how a space is laid out or used, like merging rooms or moving the kitchen. Many projects include both.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you renovate bathrooms?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '[CONFIRM: Yes. Bathroom renovation includes waterproofing, tiling, sanitary fittings and vanity units, coordinated with the rest of your home\'s work.] Waterproofing is done before tiling to prevent future leaks.',
          },
        },
      ],
    };
  } else if (slug === 'office-interior-design') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Office Interior Design',
      name: 'Office Interior Design in Delhi NCR',
      description: 'Office interiors for small and growing teams: workstations, cabins, meeting rooms and pantries, designed and fitted out by Archovex across NCR.',
      url: `${siteUrl}/services/office-interior-design`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      audience: {
        '@type': 'BusinessAudience',
        name: 'Startups, Professional Firms, and Growing Teams',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: 'Office Interior Design', item: `${siteUrl}/services/office-interior-design` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does office interior design cost per sq ft?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Office cost per sq ft depends on how many cabins and meeting rooms you need, partition and ceiling types, electrical and data work, and furniture. An open-plan office costs less per sq ft than one with many enclosed rooms. Archovex shares an itemised quote after the site survey.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does an office fit-out take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An Archovex office project typically takes [TIMELINE – OFFICE] from design approval to handover. The schedule depends on size, building approvals, after-hours work rules and furniture lead times. You receive a written schedule before work begins.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I design a small office?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Start with headcount and how people work. Use open workstations for most staff, one flexible meeting room, and shared storage. Glass partitions keep the space bright. Plan power and data points carefully, as they are hard to add later.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you work while our business is running?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, for refresh projects. We can phase the work section by section or schedule noisy tasks after hours or on weekends, depending on building rules. Full fit-outs of empty floors are faster and usually done before you move in.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you supply office furniture?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '[CONFIRM: Yes. Archovex can supply and install workstations, storage and cabin furniture, or work with furniture you already own.] Chairs and specialised items can be sourced from brands you prefer.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you handle IT and network cabling?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We plan data and power points in the layout and lay conduits and cabling as per your scope. [CONFIRM: active IT equipment is installed by your IT vendor, and we coordinate with them on site.]',
          },
        },
      ],
    };
  } else if (slug === 'corporate-office-interior-design') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Corporate Office Interior Design',
      name: 'Corporate Office Interior Design, Delhi NCR',
      description: 'Corporate office fit-outs for large teams: space planning, workstations, meeting zones and services, designed and delivered by Archovex in NCR.',
      url: `${siteUrl}/services/corporate-office-interior-design`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      audience: {
        '@type': 'BusinessAudience',
        name: 'Enterprises, Regional Headquarters, and Corporate Organizations',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: 'Corporate Office Interior Design', item: `${siteUrl}/services/corporate-office-interior-design` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is an office fit-out?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An office fit-out is the work needed to make a leased space ready to use: partitions, ceilings, flooring, lighting, power, data, AC changes and furniture. It turns a bare or base-build floor into a working office designed for your team.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between Category A and Category B fit-out?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Category A is the basic finish a landlord usually provides, such as ceilings, base lighting, AC and finished floors. Category B is the tenant\'s fit-out on top of that: layout, partitions, meeting rooms, furniture, IT and branding. Archovex mainly delivers Category B work.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a corporate office fit-out take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An Archovex corporate fit-out typically takes [TIMELINE – CORPORATE, by floor size] from design approval to handover. Timing depends on floor size, approvals with building management, services work and furniture lead times. We agree a programme before starting.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do we plan a corporate office move?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Start early: confirm headcount and growth, define how teams work, then do a test fit before signing the lease if possible. Agree design, budget and programme, and plan IT and furniture moves together. A design-and-build partner keeps these steps on one schedule.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you coordinate with building management and landlords?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Corporate buildings usually require drawing approval, work permits and set work hours. We prepare the drawings and plan work around the building\'s rules. [CONFIRM Archovex\'s exact role in submissions.]',
          },
        },
        {
          '@type': 'Question',
          name: 'Can the fit-out be done in phases while teams keep working?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. For occupied floors, we can split work into zones and schedule noisy tasks after hours, subject to building rules. Phased work takes longer overall but keeps your business running.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you provide an itemised BOQ for procurement?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Archovex shares an itemised bill of quantities grouped by package, such as civil, services, interiors and furniture. This helps procurement teams approve budgets and compare bids line by line.',
          },
        },
      ],
    };
  } else if (slug === 'commercial-interior-design') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Commercial Interior Design',
      name: 'Commercial Interior Design in Delhi NCR',
      description: 'Commercial interiors for showrooms, retail stores, restaurants, cafés and clinics, designed around customer flow and built by Archovex in NCR.',
      url: `${siteUrl}/services/commercial-interior-design`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      audience: {
        '@type': 'BusinessAudience',
        name: 'Retail Stores, Showrooms, Restaurants, Cafés and Clinics',
      },
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: 'Commercial Interior Design', item: `${siteUrl}/services/commercial-interior-design` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does commercial interior design cost per sq ft?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Commercial cost per sq ft varies with business type, fixtures, services and finishes. A simple retail store costs less per sq ft than a restaurant with kitchen services or a clinic with treatment rooms. Archovex shares an itemised BOQ after the site survey.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a shop or showroom fit-out take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An Archovex commercial project typically takes [TIMELINE – COMMERCIAL, by type and size] from design approval to handover. Mall approvals, permitted work hours and custom fixtures affect timing. We plan the schedule backwards from your opening date.',
          },
        },
        {
          '@type': 'Question',
          name: 'What approvals does a commercial fit-out need?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most commercial spaces need landlord or mall approval of drawings, and work permits for the site. Restaurants and clinics may need additional licences and compliance with fire and safety norms. Check your lease and local requirements early; we plan the design to meet them.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you follow our brand guidelines?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. If your brand has store design or identity guidelines, we use them for layout, colours, materials and signage. If you are a new brand, we help you develop a consistent look across counters, displays and graphics.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you design restaurant kitchens?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We design the front-of-house and coordinate space, services and finishes for the kitchen area. [CONFIRM: commercial kitchen equipment layout is planned with your kitchen equipment supplier.]',
          },
        },
        {
          '@type': 'Question',
          name: 'Can work happen at night in a mall?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Many malls only allow fit-out work at set hours, often outside trading time. We plan crews and deliveries around these rules so work continues without breaking mall guidelines.',
          },
        },
      ],
    };
  } else if (slug === 'turnkey-interior-design') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Turnkey Interior Design',
      name: 'Turnkey Interior Design in Delhi NCR',
      description: 'Turnkey interiors for homes and businesses: design, civil work, services, furniture and finishing under one contract with Archovex in NCR.',
      url: `${siteUrl}/services/turnkey-interior-design`,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Archovex Infra',
      },
      audience: [
        {
          '@type': 'PeopleAudience',
          name: 'Homeowners and Residential Property Owners',
        },
        {
          '@type': 'BusinessAudience',
          name: 'Commercial Businesses and Enterprise Clients',
        },
      ],
      areaServed: ['Noida', 'Greater Noida', 'Delhi', 'New Delhi', 'Gurgaon'],
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: 'Turnkey Interior Design', item: `${siteUrl}/services/turnkey-interior-design` },
      ],
    };

    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is turnkey interior design?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Turnkey interior design is a service where one company handles the full project: design, civil work, electrical, plumbing, carpentry, furniture and finishing. You approve the design and budget, and the company manages every trade until the space is ready to use.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between turnkey and design-only services?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A design-only service gives you drawings and specifications, and you hire contractors to build them. A turnkey service includes the design and the execution under one contract, so one company is responsible for the final result, the schedule and coordination between trades.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is turnkey cheaper than hiring contractors separately?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Not always on paper, because the turnkey company manages and coordinates the work. It often saves money in practice by reducing rework, delays and gaps between trades. With an itemised turnkey quote, you can compare each line against separate contractor quotes.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should a turnkey contract include?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A good turnkey contract includes a detailed scope of work, itemised costs, material specifications, a schedule, payment milestones, warranty terms and a process for changes. Ask for all of these in writing before you sign.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you do turnkey projects for offices and shops?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Archovex offers turnkey projects for offices, corporate floors, showrooms, retail stores, restaurants and clinics, as well as homes. Commercial turnkey projects are planned around your opening or move-in date.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens if I want changes during the project?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Changes after approval are recorded as written change orders that show the cost and time impact. Work on a change starts only after you approve it, so the budget and schedule stay clear.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I track progress if I can\'t visit the site?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '[CONFIRM: Your project lead shares regular photo and video updates and a progress report against the schedule.] Many clients, including those living outside NCR, manage turnkey projects this way.',
          },
        },
      ],
    };
  }

  const serviceTitles: Record<string, string> = {
    'full-home-interior-design': 'Full Home Interior Design',
    'modular-kitchen-design': 'Modular Kitchen Design',
    'living-room-interior-design': 'Living Room Interior Design',
    'bedroom-interior-design': 'Bedroom Interior Design',
    'wardrobe-design': 'Wardrobe Design',
    'home-renovation': 'Home Renovation & Remodeling',
    'office-interior-design': 'Office Interior Design',
    'corporate-office-interior-design': 'Corporate Office Interior Design',
    'commercial-interior-design': 'Commercial Interior Design',
    'turnkey-interior-design': 'Turnkey Interior Design',
  };
  const currentTitle = serviceTitles[slug] || customPage?.title?.split('|')[0]?.trim() || 'Service Details';

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
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
      <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: currentTitle }]} />

      <main className="flex-grow">
        {dynamicSections && dynamicSections.length > 0 ? (
          <DynamicSectionRenderer sections={dynamicSections} />
        ) : (
          <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-2xl font-black text-[#0B132B] uppercase">{customPage?.title || 'Service'}</h1>
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
