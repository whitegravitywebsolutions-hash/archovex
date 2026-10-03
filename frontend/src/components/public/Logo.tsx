'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  light?: boolean;
  hasBg?: boolean;
}

export default function Logo({ className = '', light = false, hasBg = false }: LogoProps) {
  const isWhiteBg = light || hasBg;

  if (isWhiteBg) {
    return (
      <Link href="/" className={`inline-flex items-center justify-center group transition-all ${className}`}>
        <div className="bg-white/95 rounded-2xl px-4 py-2 shadow-md border border-amber-500/25 group-hover:border-amber-500/50 group-hover:shadow-lg transition-all duration-300 backdrop-blur-md">
          <Image
            src="/logo.png"
            alt="ARCHOVEX INFRA PRIVATE LIMITED"
            width={320}
            height={96}
            className="h-[64px] sm:h-[72px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center justify-center group transition-all ${className}`}>
      <Image
        src="/logo.png"
        alt="ARCHOVEX INFRA PRIVATE LIMITED"
        width={320}
        height={96}
        className="h-[72px] sm:h-[80px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        priority
      />
    </Link>
  );
}
