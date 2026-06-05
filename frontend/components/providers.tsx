'use client';

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useGameStore } from '@/stores/gameStore';

// Initialise le QueryClient pour TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes par défaut
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeGame = useGameStore((state) => state.initializeGame);

  useEffect(() => {
    // Restaure la session et le personnage au chargement initial
    initializeAuth();
    initializeGame();
  }, [initializeAuth, initializeGame]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
