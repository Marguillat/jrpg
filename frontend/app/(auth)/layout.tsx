import React from 'react';
import Link from 'next/link';
import { Swords } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f6fafd] p-6 font-sans">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2 mb-2 hover:opacity-90 transition-opacity">
          <Swords className="h-8 w-8 text-primary" />
          <span className="font-serif font-bold text-2xl tracking-tight text-[#171c1f]">
            Aethelgard
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
}
