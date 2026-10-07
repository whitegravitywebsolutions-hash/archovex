import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { fetchPublicData } from "@/lib/api";
import "./globals.css";

export const dynamic = 'force-dynamic';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await fetchPublicData('/home');
  const settings = homeData?.settings || {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://archovex.vercel.app');

  return {
    metadataBase: new URL(siteUrl),
    title: settings.default_meta_title || "ARCHOVEX INFRA PRIVATE LIMITED | Premium Interior Design",
    description: settings.default_meta_description || "Luxury home interior design and turnkey execution across India.",
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: [
        { url: '/icon.png', type: 'image/png' },
        { url: '/favicon.ico', type: 'image/x-icon' },
      ],
      shortcut: '/icon.png',
      apple: '/icon.png',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const homeData = await fetchPublicData('/home');
  const settings = homeData?.settings || {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://archovex.vercel.app');

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': settings.site_name || 'ARCHOVEX INFRA PRIVATE LIMITED',
    'url': siteUrl,
    'logo': `${siteUrl}/logo.png`,
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': settings.phone || '+91 98765 43210',
      'contactType': 'customer service',
      'areaServed': 'IN',
      'availableLanguage': ['en', 'hi']
    },
    'sameAs': [
      settings.facebook_url,
      settings.instagram_url,
      'https://pinterest.com/archovexinfra',
      'https://linkedin.com/company/archovexinfra'
    ].filter(Boolean)
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': settings.site_name || 'ARCHOVEX INFRA',
    'url': siteUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/blogs?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const scriptHead = settings.script_head || '';
  const scriptBody = settings.script_body || '';
  const scriptFooter = settings.script_footer || '';

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {scriptHead && (
          <div dangerouslySetInnerHTML={{ __html: scriptHead }} />
        )}
        {scriptBody && (
          <div dangerouslySetInnerHTML={{ __html: scriptBody }} />
        )}
        {children}
        {scriptFooter && (
          <div dangerouslySetInnerHTML={{ __html: scriptFooter }} />
        )}
      </body>
    </html>
  );
}
