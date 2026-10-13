'use client';

import React from 'react';
import DynamicSectionRenderer, { PageSectionData } from '@/components/public/sections/DynamicSectionRenderer';
import { City } from '@/types';

interface HomepageClientProps {
  categories?: any[];
  featuredDesigns?: any[];
  services?: any[];
  projects?: any[];
  cities?: City[];
  testimonials?: any[];
  faqs?: any[];
  blogs?: any[];
  settings?: Record<string, any>;
  /** Sections from admin page builder (slug: home) */
  customSections?: PageSectionData[];
}

export default function HomepageClient({
  customSections = [],
}: HomepageClientProps) {
  return (
    <>
      {customSections && customSections.length > 0 ? (
        <DynamicSectionRenderer sections={customSections} />
      ) : (
        <div className="py-24 px-4 text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-2xl font-black text-[#0B132B] uppercase">Home Page</h1>
          <p className="text-xs text-slate-500">
            This page currently has no section content configured. Add sections in the Page Builder to build your home page layout.
          </p>
        </div>
      )}
    </>
  );
}
