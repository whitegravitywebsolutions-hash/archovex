import { NextResponse } from 'next/server';

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

  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
