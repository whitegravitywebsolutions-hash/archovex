import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import CategoryPageClient from '@/app/designs/[categorySlug]/CategoryPageClient';
import ConsultationForm from '@/components/public/ConsultationForm';
import { fetchPublicData, getImageUrl } from '@/lib/api';
import { notFound } from 'next/navigation';
import { ChevronRight, ShieldCheck, Award, Clock, CheckCircle2 } from 'lucide-react';

interface ServicePageProps {
  params: Promise<{ serviceSlug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { serviceSlug } = await params;
  const catData = await fetchPublicData(`/design-categories/${serviceSlug}`).catch(() => null);
  if (catData?.category) {
    const category = catData.category;
    const seo = category.seo_data || {};
    return {
      title: seo.meta_title || `${category.name} | ARCHOVEX INFRA PRIVATE LIMITED`,
      description: seo.meta_description || category.description || category.short_description,
      canonical: `https://archovex.com/services/${category.slug}`,
    };
  }

  const service = await fetchPublicData(`/services/${serviceSlug}`).catch(() => null);
  const title = service?.title || serviceSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const description = service?.meta_description || service?.description || `Luxury ${title} by ARCHOVEX INFRA PRIVATE LIMITED. 10-year warranty, German hardware, 45-day installation guarantee.`;

  return {
    title: `${title} | ARCHOVEX INFRA PRIVATE LIMITED`,
    description,
    canonical: `https://archovex.com/services/${serviceSlug}`,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { serviceSlug } = await params;

  // Check if this is a design category (e.g. living-room-designs, modular-kitchen-designs, wardrobe-designs, etc.)
  const [homeData, catData, serviceData] = await Promise.all([
    fetchPublicData('/home').catch(() => null),
    fetchPublicData(`/design-categories/${serviceSlug}`).catch(() => null),
    fetchPublicData(`/services/${serviceSlug}`).catch(() => null),
  ]);

  const cities = homeData?.cities || [];
  const settings = homeData?.settings || {};
  const socialLinks = homeData?.social_links || [];

  // If matching design category found, render CategoryPageClient for identical UI
  if (catData && catData.category) {
    const category = catData.category;
    const initialPosts = catData.posts?.data || [];
    const faqs = catData.faqs || [];

    return (
      <div className="min-h-screen bg-[#faf8f3] flex flex-col font-sans">
        <Header initialMenu={homeData?.menus || []} cities={cities} />

        <main className="flex-grow">
          <CategoryPageClient
            category={category}
            initialPosts={initialPosts}
            faqs={faqs}
            cities={cities}
            parentLabel="Services"
            parentUrl="/services"
          />
        </main>

        <Footer settings={settings} socialLinks={socialLinks} />
        <FloatingWhatsAppButton number={settings.whatsapp} />
      </div>
    );
  }

  // Otherwise, render service detail page
  const title = serviceData?.title || serviceSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const description = serviceData?.description || `ARCHOVEX specializes in turnkey ${title} with high-precision modular factory manufacturing.`;
  const heroImage = getImageUrl(serviceData?.image);

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans">
      <Header initialMenu={homeData?.menus || []} cities={cities} />

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-[#FAF8F3] border-b border-[#E4DCD0] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-slate-500">
          <a href="/" className="hover:text-[#0C4A6E]">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <a href="/services" className="hover:text-[#0C4A6E]">Services</a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#0C4A6E]">{title}</span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0E7490] text-white py-16 sm:py-24 border-b border-sky-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black uppercase tracking-widest text-[#FFEDD5] bg-[#F97316]/20 border border-[#F97316]/40 px-4 py-1.5 rounded-full inline-block shadow-sm">
              PREMIUM ARCHITECTURAL SERVICE
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-sky-100 font-medium leading-relaxed">
              {description}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-sky-100">
              <span className="flex items-center gap-1.5 bg-sky-900/50 px-3 py-1.5 rounded-lg border border-sky-700/50">
                <ShieldCheck className="w-4 h-4 text-[#F97316]" /> 10-Year Warranty
              </span>
              <span className="flex items-center gap-1.5 bg-sky-900/50 px-3 py-1.5 rounded-lg border border-sky-700/50">
                <Award className="w-4 h-4 text-[#F97316]" /> German Hardware
              </span>
              <span className="flex items-center gap-1.5 bg-sky-900/50 px-3 py-1.5 rounded-lg border border-sky-700/50">
                <Clock className="w-4 h-4 text-[#F97316]" /> 45-Day Delivery
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-video lg:aspect-square rounded-3xl overflow-hidden border-2 border-sky-400/30 shadow-2xl bg-slate-900">
            <img
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Content Form */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white p-8 sm:p-12 rounded-3xl border border-[#E4DCD0] shadow-sm">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#F97316]">FREE CONSULTATION</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0C4A6E] uppercase tracking-tight">
              Get 3D Design & Price Estimate for {title}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Schedule a personalized meeting with our senior interior architects at our experience center or request an inline virtual consultation.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>3D Virtual Floorplan & VR Walkthrough</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Material Sample Inspection & Quotation</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Transparent Itemized Pricing without Hidden Costs</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ConsultationForm source={`Service: ${title}`} cities={cities} />
          </div>
        </div>
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
      <FloatingWhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
