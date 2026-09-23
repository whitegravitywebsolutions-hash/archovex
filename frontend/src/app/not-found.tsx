import React from 'react';
import Link from 'next/link';
import Logo from '@/components/public/Logo';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 font-sans">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo light />
      </div>

      <div className="max-w-xl mx-auto text-center space-y-6 py-20">
        <span className="text-6xl font-extrabold text-blue-500 block">404</span>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">PAGE NOT FOUND</h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          The requested interior design page or category could not be found or has been relocated.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> RETURN TO HOMEPAGE
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-slate-600">
        © {new Date().getFullYear()} ARCHOVEX INFRA PRIVATE LIMITED.
      </div>
    </div>
  );
}
