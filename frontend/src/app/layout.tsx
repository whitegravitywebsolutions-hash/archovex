import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins, Playfair_Display } from "next/font/google";
import { fetchPublicData } from "@/lib/api";
import "./globals.css";

export const dynamic = 'force-dynamic';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await fetchPublicData('/home');
  const settings = homeData?.settings || {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

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

  const orgLocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: 'Archovex Infra',
    legalName: '[REGISTERED NAME]',
    url: 'https://archovex.vercel.app',
    logo: 'https://archovex.vercel.app/logo.png',
    telephone: '[PHONE]',
    email: '[EMAIL]',
    address: '[ADDRESS]',
    geo: '[LAT, LONG]',
    openingHours: '[HOURS]',
    areaServed: [
      'Noida',
      'Greater Noida',
      'Delhi',
      'New Delhi',
      'Gurgaon'
    ],
    sameAs: [
      settings.instagram_url || 'https://www.instagram.com/archovexinfra',
      settings.facebook_url || 'https://www.facebook.com/archovexinfra',
      '[Google Business Profile URL]'
    ],
    foundingDate: '[YEARS]'
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Archovex Infra',
    url: 'https://archovex.vercel.app'
  };

  const scriptHead = settings.script_head || '';
  const scriptBody = settings.script_body || '';
  const scriptFooter = settings.script_footer || '';

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${poppins.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLocalBusinessSchema) }}
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
