'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useGameStore } from '@/stores/gameStore';
import { LayoutDashboard, Compass, Shield, LogOut, Swords } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Aventure', href: '/adventure', icon: Compass },
    { name: 'Inventaire', href: '/inventory', icon: Shield },
  ];

  return (
    <aside className="w-64 bg-white border-r border-card-border flex flex-col h-screen sticky top-0 font-sans">
      <div className="p-6 border-b border-card-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Swords className="h-6 w-6 text-primary" />
          <span className="font-serif font-bold text-xl tracking-tight text-[#171c1f]">
            Aethelgard
          </span>
        </Link>
        {user && (
          <p className="text-xs text-gray-500 mt-2">
            Aventurier : <span className="font-semibold text-primary">{user.username}</span>
          </p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-[#FBF6F6] shadow-sm'
                  : 'text-[#393E41] hover:bg-[#f6fafd] hover:text-primary'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-card-border bg-[#f6fafd]/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
