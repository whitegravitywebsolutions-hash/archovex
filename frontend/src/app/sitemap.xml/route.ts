import { fetchPublicData } from '@/lib/api';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.com';

  const [homeData, blogsData, categoriesData] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/blogs').catch(() => fetchPublicData('/designs')).catch(() => null),
    fetchPublicData('/categories').catch(() => null),
  ]);

  const categories = (Array.isArray(categoriesData) ? categoriesData : (homeData?.categories || []));
  const cities = homeData?.cities || [];
  const blogs = (blogsData?.data || blogsData || []);

  const SERVICES_SLUGS = [
    'full-home-interior-design',
    'modular-kitchen-design',
    'living-room-interior-design',
    'bedroom-interior-design',
    'wardrobe-design',
    'home-renovation-remodeling',
    'office-interior-design',
    'corporate-office-interior-design',
    'commercial-interior-design',
    'turnkey-interior-design',
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>
  <url><loc>${baseUrl}/about-us</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/services</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/locations</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/blogs</loc><priority>0.9</priority><changefreq>daily</changefreq></url>
  <url><loc>${baseUrl}/contact-us</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/privacy-policy</loc><priority>0.3</priority><changefreq>yearly</changefreq></url>
  <url><loc>${baseUrl}/terms-and-conditions</loc><priority>0.3</priority><changefreq>yearly</changefreq></url>
`;

  // 1. Services Pages (/services/[serviceSlug])
  SERVICES_SLUGS.forEach((slug) => {
    xml += `  <url><loc>${baseUrl}/services/${slug}</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>\n`;
  });

  // 2. Blog Category Pages (/blogs/[categorySlug])
  const uniqueCatSlugs = new Set<string>();
  categories.forEach((cat: any) => {
    if (cat.slug && !uniqueCatSlugs.has(cat.slug)) {
      uniqueCatSlugs.add(cat.slug);
      xml += `  <url><loc>${baseUrl}/blogs/${cat.slug}</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>\n`;
    }
  });

  // 3. Location Studios (/locations/[slug])
  const locationSlugs = cities.length > 0 ? cities.map((c: any) => c.slug) : ['noida', 'greater-noida', 'delhi', 'new-delhi', 'gurgaon'];
  const uniqueLocSlugs = new Set<string>();
  locationSlugs.forEach((slug: string) => {
    if (slug && !uniqueLocSlugs.has(slug)) {
      uniqueLocSlugs.add(slug);
      xml += `  <url><loc>${baseUrl}/locations/${slug}</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>\n`;
    }
  });

  // 4. Individual Blog Posts (/blogs/[categorySlug]/[postSlug])
  if (Array.isArray(blogs)) {
    blogs.forEach((post: any) => {
      if (post.slug) {
        const catSlug = post.category?.slug || 'modular-kitchen-designs';
        xml += `  <url><loc>${baseUrl}/blogs/${catSlug}/${post.slug}</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>\n`;
      }
    });
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
