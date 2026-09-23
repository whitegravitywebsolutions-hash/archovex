'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminSeoRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/pages');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3 text-xs">
      <Loader2 className="w-6 h-6 animate-spin text-slate-800" />
      <span className="font-bold text-slate-900 text-sm">Redirecting to Page Builder...</span>
      <p className="text-slate-500">All page layouts, sections, and page-wise SEO settings are unified in the Page Builder.</p>
    </div>
  );
}
