import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export default function Logo({ className = '', light = false }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Brand Architectural Symbol: Blue Gear + Upward Arrow inside Hexagon */}
      <div className={`relative w-10 h-10 flex items-center justify-center rounded-xl p-2 transition-all shadow-md ${
        light ? 'bg-white text-blue-900' : 'bg-blue-900 text-blue-400 group-hover:bg-blue-800'
      }`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Outer Industrial Gear teeth pattern */}
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4" strokeDasharray="6 8" />
          {/* Architectural Hexagon Frame */}
          <polygon points="50,15 82,33 82,67 50,85 18,67 18,33" stroke={light ? '#1E3A8A' : '#60A5FA'} strokeWidth="5" fill="none" />
          {/* Upward Growth Arrow Symbol */}
          <path d="M50 25 L70 52 H58 V75 H42 V52 H30 Z" fill={light ? '#2563EB' : '#3B82F6'} stroke={light ? '#93C5FD' : '#BFDBFE'} strokeWidth="2" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <span className={`text-xl font-black tracking-wider uppercase font-sans ${light ? 'text-white' : 'text-slate-900'}`}>
          ARCHOVEX
        </span>
        <span className={`text-[9px] font-bold tracking-widest uppercase -mt-1 ${light ? 'text-blue-200' : 'text-blue-700'}`}>
          INFRA PRIVATE LIMITED
        </span>
      </div>
    </Link>
  );
}
