import { fetchPublicData } from '@/lib/api';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
    if (host) {
      const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
      baseUrl = `${proto}://${host}`;
    } else {
      baseUrl = 'http://localhost:3000';
    }
  }

  const [homeData, blogsData, categoriesData, pagesData] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData('/blogs').catch(() => fetchPublicData('/designs')).catch(() => null),
    fetchPublicData('/categories').catch(() => null),
    fetchPublicData('/pages').catch(() => null),
  ]);

  const categories = (Array.isArray(categoriesData) ? categoriesData : (homeData?.categories || []));
  const cities = homeData?.cities || [];
  const blogs = (blogsData?.data || blogsData || []);
  const publishedPages: any[] = Array.isArray(pagesData) ? pagesData : (pagesData?.data || []);

  const addedUrls = new Set<string>();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Helper to add URL with deduplication
  const addUrl = (path: string, priority: string, changefreq: string, lastmod?: string) => {
    const cleanPath = path === '/' ? '' : '/' + path.replace(/^\/+/, '').replace(/\/+$/, '');
    const fullUrl = `${baseUrl}${cleanPath}`;
    if (addedUrls.has(fullUrl)) return;
    addedUrls.add(fullUrl);

    xml += `  <url>\n    <loc>${fullUrl}</loc>\n`;
    if (lastmod) {
      xml += `    <lastmod>${lastmod.includes('T') ? lastmod.split('T')[0] : lastmod.split(' ')[0]}</lastmod>\n`;
    }
    xml += `    <priority>${priority}</priority>\n    <changefreq>${changefreq}</changefreq>\n  </url>\n`;
  };

  // 1. DYNAMIC PUBLISHED PAGES (From DB - only status='published', drafts and deleted pages are excluded)
  if (publishedPages.length > 0) {
    publishedPages.forEach((page: any) => {
      const slug = (page.slug || '').trim();
      if (!slug) return;

      const isHome = slug === 'home' || slug === '/';
      const path = isHome ? '/' : slug;

      let priority = '0.8';
      let changefreq = 'weekly';

      if (isHome) {
        priority = '1.0';
        changefreq = 'daily';
      } else if (['about-us', 'services', 'locations', 'blog', 'contact-us'].includes(slug)) {
        priority = '0.9';
        changefreq = 'weekly';
      } else if (slug === 'faqs') {
        priority = '0.8';
        changefreq = 'monthly';
      }

      addUrl(path, priority, changefreq, page.updated_at || page.created_at);
    });
  } else {
    // Fallback core pages if DB is unreachable
    addUrl('/', '1.0', 'daily');
    addUrl('about-us', '0.9', 'weekly');
    addUrl('services', '0.9', 'weekly');
    addUrl('locations', '0.9', 'weekly');
    addUrl('blog', '0.9', 'daily');
    addUrl('contact-us', '0.8', 'monthly');
    addUrl('faqs', '0.8', 'monthly');
  }

  // 2. Blog Category Pages (/blog/[categorySlug])
  categories.forEach((cat: any) => {
    if (cat.slug) {
      addUrl(`blog/${cat.slug}`, '0.8', 'weekly', cat.updated_at);
    }
  });

  // 3. Location Studios (/locations/[slug])
  const locationSlugs = cities.length > 0 ? cities.map((c: any) => c.slug) : ['noida', 'greater-noida', 'delhi', 'new-delhi', 'gurgaon'];
  locationSlugs.forEach((slug: string) => {
    if (slug) {
      addUrl(`locations/${slug}`, '0.8', 'weekly');
    }
  });

  // 4. Individual Blog Posts (/blog/[categorySlug]/[postSlug])
  if (Array.isArray(blogs)) {
    blogs.forEach((post: any) => {
      if (post.slug) {
        const catSlug = post.category?.slug || 'modular-kitchen-designs';
        addUrl(`blog/${catSlug}/${post.slug}`, '0.8', 'monthly', post.updated_at || post.published_at);
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
