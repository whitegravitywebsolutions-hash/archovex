import { fetchPublicData } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://archovex.com';

  const homeData = await fetchPublicData('/home');
  const categories = homeData?.categories || [];
  const cities = homeData?.cities || [];

  const designsData = await fetchPublicData('/designs');
  const designs = designsData?.data || [];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/designs</loc><priority>0.9</priority></url>
  <url><loc>${baseUrl}/contact</loc><priority>0.7</priority></url>
`;

  // Categories
  categories.forEach((cat: any) => {
    xml += `  <url><loc>${baseUrl}/designs/${cat.slug}</loc><priority>0.9</priority></url>\n`;
  });

  // Cities
  cities.forEach((city: any) => {
    xml += `  <url><loc>${baseUrl}/cities/${city.slug}</loc><priority>0.8</priority></url>\n`;
  });

  // Designs
  designs.forEach((post: any) => {
    const catSlug = post.category?.slug || 'modular-kitchen-designs';
    xml += `  <url><loc>${baseUrl}/designs/${catSlug}/${post.slug}</loc><priority>0.8</priority></url>\n`;
  });

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
