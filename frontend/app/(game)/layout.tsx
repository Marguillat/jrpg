'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/stores/authStore';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, redirection
    if (!isAuthenticated) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      if (!token) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen bg-[#f6fafd]">
      <Sidebar />
      <main className="flex-grow p-8 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
