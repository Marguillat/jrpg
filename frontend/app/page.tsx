'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Swords, Shield, Scroll, Sparkles, BookOpen, Flame } from 'lucide-react';

export default function LandingPage() {
  const classes = [
    {
      name: 'Guerrier',
      icon: Swords,
      desc: 'Maître d\'armes robuste, le Guerrier excelle au combat rapproché grâce à sa force brute et sa résistance exceptionnelle.',
      color: 'border-t-red-600',
    },
    {
      name: 'Mage',
      icon: Flame,
      desc: 'Adepte des arts mystiques, le Mage manipule l\'énergie magique brute pour lancer de puissants sortilèges destructeurs.',
      color: 'border-t-blue-500',
    },
    {
      name: 'Voleur',
      icon: Sparkles,
      desc: 'Rapide et insaisissable, le Voleur utilise son agilité pour frapper les points faibles et esquiver les attaques ennemies.',
      color: 'border-t-yellow-500',
    },
    {
      name: 'Prêtre',
      icon: BookOpen,
      desc: 'Canal de puissance divine, le Prêtre soigne les blessures et renforce ses alliés tout en châtiant le mal.',
      color: 'border-t-emerald-500',
    },
    {
      name: 'Paladin',
      icon: Shield,
      desc: 'Protecteur inflexible combinant foi et acier, le Paladin défend les faibles et survit aux combats les plus rudes.',
      color: 'border-t-amber-600',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f6fafd]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-card-border/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold text-xl tracking-tight text-[#171c1f]">
              Aethelgard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-primary">
                Se connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm" className="font-semibold">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest font-sans">
            <Sparkles className="h-4 w-4" />
            Le monde d'Aethelgard vous attend
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#171c1f] max-w-3xl leading-[1.15]">
            Forgez votre légende dans <span className="text-primary italic">Aethelgard</span>
          </h1>
          <p className="text-lg text-[#393E41] max-w-2xl font-sans leading-relaxed">
            Créez votre héros, équipez des reliques légendaires et simulez des combats tactiques en temps réel contre les créatures les plus redoutables du bestiaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/register">
              <Button variant="accent" size="lg" className="w-full sm:w-auto font-bold">
                Commencer l'aventure
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-bold">
                Consulter mon grimoire
              </Button>
            </Link>
          </div>
        </section>

        {/* Classes Info Section */}
        <section className="bg-white border-y border-card-border/60 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-bold text-[#171c1f]">Choisissez votre Destin</h2>
              <p className="text-[#393E41] font-sans">
                Découvrez les 5 classes de héros uniques d'Aethelgard, chacune disposant de statistiques spécialisées et d'une progression héroïque propre.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {classes.map((cls) => {
                const Icon = cls.icon;
                return (
                  <Card key={cls.name} className={`flex flex-col gap-4 border-t-4 ${cls.color} hover:-translate-y-1 transition-all duration-300`}>
                    <div className="p-3 bg-primary/5 rounded-xl self-start">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#171c1f]">{cls.name}</h3>
                    <p className="text-xs text-[#393E41]/80 font-sans leading-relaxed flex-grow">
                      {cls.desc}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Lore details */}
        <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="p-3 bg-[#f2a65a]/10 text-[#8b5006] rounded-xl inline-flex self-start">
              <Scroll className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-[#171c1f]">Un JRPG tactique automatisé</h2>
            <p className="text-[#393E41] font-sans leading-relaxed">
              Inspiré des classiques du jeu de rôle, Aethelgard simule l'intégralité du combat de manière stratégique et rigoureuse. Chaque coup critique, parade ou sortilège lancé est calculé en fonction de la Force, de l'Agilité, et de l'Intelligence de vos héros et de leurs adversaires.
            </p>
            <p className="text-[#393E41] font-sans leading-relaxed">
              Équipez vos aventuriers d'épées de fer, d'armures de mailles ou d'anneaux mystiques pour altérer leurs statistiques avant de les lancer au cœur de la mêlée.
            </p>
          </div>
          <div className="flex-1 w-full bg-white border border-card-border p-8 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-card-border/60 pb-3">
              <Swords className="h-5 w-5 text-[#8b5006]" />
              <span className="font-serif font-bold text-lg">Combat simulé #4192</span>
            </div>
            <div className="font-mono text-xs text-gray-600 space-y-2 bg-[#f2eeee]/30 p-4 rounded-xl">
              <p className="text-primary font-semibold">&gt; Aragorn (Guerrier) attaque Goblin ! Dégâts : 12</p>
              <p className="text-red-700 font-semibold">&gt; Goblin réplique ! Aragorn perd 3 PV (PV restants: 47/50)</p>
              <p className="text-primary font-semibold">&gt; Aragorn assène un coup critique dévastateur ! Dégâts : 22</p>
              <p className="text-[#8b5006] font-bold">&gt; Victoire ! Aragorn a triomphé de Goblin (+50 XP)</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-card-border/60 py-8 text-center text-xs text-[#393E41]/75 font-sans">
        <p>© 2026 JRPG. Développé conformément à la charte CRAFT.</p>
      </footer>
    </div>
  );
}
