'use client';

import React, { useState } from 'react';
import DynamicSectionRenderer from '@/components/public/sections/DynamicSectionRenderer';
import ConsultationFormModal from '@/components/public/ConsultationFormModal';

interface DynamicPageClientProps {
  page: any;
  cities?: any[];
}

export default function DynamicPageClient({ page, cities = [] }: DynamicPageClientProps) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const sections = Array.isArray(page?.sections) ? page.sections : [];

  return (
    <>
      {sections.length > 0 ? (
        <DynamicSectionRenderer 
          sections={sections} 
          onOpenConsultation={() => setIsConsultationOpen(true)}
        />
      ) : (
        <div className="py-20 px-4 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 uppercase">{page?.title || 'Page Content'}</h1>
          <p className="text-sm text-slate-500 mt-2">This page currently has no section content configured.</p>
        </div>
      )}

      {isConsultationOpen && (
        <ConsultationFormModal 
          isOpen={isConsultationOpen} 
          onClose={() => setIsConsultationOpen(false)}
          cities={cities}
        />
      )}
    </>
  );
}
