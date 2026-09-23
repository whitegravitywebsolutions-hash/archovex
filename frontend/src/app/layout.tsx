import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fetchPublicData } from "@/lib/api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await fetchPublicData('/home');
  const settings = homeData?.settings || {};

  return {
    title: settings.default_meta_title || "ARCHOVEX INFRA PRIVATE LIMITED | Premium Interior Design",
    description: settings.default_meta_description || "Luxury home interior design and turnkey execution across India.",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const homeData = await fetchPublicData('/home');
  const settings = homeData?.settings || {};

  const scriptHead = settings.script_head || '';
  const scriptBody = settings.script_body || '';
  const scriptFooter = settings.script_footer || '';

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
