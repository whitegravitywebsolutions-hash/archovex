import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-[#FAF8F3] border-b border-slate-200/80 py-3 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#EA580C] transition-colors flex items-center gap-1 flex-shrink-0">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Home</span>
          </Link>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={index}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-[#EA580C] transition-colors flex-shrink-0">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-bold text-slate-900 truncate" aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
