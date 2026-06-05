'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { characterService } from '@/lib/services/character.service';
import { monsterService } from '@/lib/services/monster.service';
import { battleService } from '@/lib/services/battle.service';
import { queryKeys } from '@/lib/query/keys';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BattleLogViewer } from '@/components/battle/BattleLogViewer';
import { BattleResultDTO, MonsterResponseDTO } from '@/types/api';
import { Swords, AlertCircle, Heart, Sparkles, Trophy, PlusCircle } from 'lucide-react';

const defaultMonsters = [
  { name: 'Gobelin des Forêts', level: 1, stats: { strength: 5, agility: 4, intelligence: 2, maxHealth: 20, currentHealth: 20, maxMana: 5, currentMana: 5 }, experienceValue: 50 },
  { name: 'Squelette Maudit', level: 2, stats: { strength: 8, agility: 6, intelligence: 3, maxHealth: 35, currentHealth: 35, maxMana: 8, currentMana: 8 }, experienceValue: 80 },
  { name: 'Slime Acide', level: 3, stats: { strength: 6, agility: 12, intelligence: 8, maxHealth: 50, currentHealth: 50, maxMana: 15, currentMana: 15 }, experienceValue: 120 },
  { name: 'Guerrier Orque', level: 5, stats: { strength: 15, agility: 8, intelligence: 4, maxHealth: 80, currentHealth: 80, maxMana: 10, currentMana: 10 }, experienceValue: 200 },
  { name: 'Dragon d\'Ombre', level: 10, stats: { strength: 28, agility: 15, intelligence: 20, maxHealth: 200, currentHealth: 200, maxMana: 50, currentMana: 50 }, experienceValue: 1000 },
];

export default function AdventurePage() {
  const queryClient = useQueryClient();
  const activeCharacterId = useGameStore((state) => state.activeCharacterId);
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResultDTO | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Récupère l'aventurier actif
  const { data: activeCharacter, isLoading: isLoadingChar } = useQuery({
    queryKey: queryKeys.characters.detail(activeCharacterId || ''),
    queryFn: () => characterService.getById(activeCharacterId || ''),
    enabled: !!activeCharacterId,
  });

  // Récupère les monstres
  const { data: monsters = [], isLoading: isLoadingMonsters } = useQuery({
    queryKey: queryKeys.monsters.all,
    queryFn: monsterService.getAll,
  });

  // Graine d'initialisation des monstres
  const seedMutation = useMutation({
    mutationFn: async () => {
      setIsSeeding(true);
      for (const m of defaultMonsters) {
        await monsterService.create(m);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.monsters.all });
      setIsSeeding(false);
    },
  });

  // Mutation de combat
  const battleMutation = useMutation({
    mutationFn: battleService.start,
    onSuccess: (data) => {
      setBattleResult(data);
      // Invalidation pour mettre à jour les PV/XP du personnage
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
      if (activeCharacterId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.characters.detail(activeCharacterId) });
      }
    },
  });

  const handleStartBattle = () => {
    if (!activeCharacterId || !selectedMonsterId) return;
    setBattleResult(null);
    battleMutation.mutate({
      characterId: activeCharacterId,
      monsterId: selectedMonsterId,
    });
  };

  if (!activeCharacterId) {
    return (
      <div className="max-w-xl mx-auto mt-12">
        <Card className="p-8 text-center flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-accent" />
          <h3 className="font-serif font-bold text-xl">Aucun Héros Sélectionné</h3>
          <p className="text-sm text-gray-500">
            Vous devez d'abord désigner un héros actif dans votre Tableau de bord pour pouvoir l'envoyer à l'aventure.
          </p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Aller au Tableau de bord
          </Button>
        </Card>
      </div>
    );
  }

  const selectedMonster = monsters.find((m) => m.id === selectedMonsterId);

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#171c1f]">Quêtes & Combats</h1>
        <p className="text-sm text-[#393E41]">Envoyez votre héros défier les bêtes sauvages d'Aethelgard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche - Héros Actif */}
        <div className="space-y-6">
          <h2 className="text-lg font-serif font-semibold border-b border-card-border/60 pb-2">Héros Actif</h2>
          {isLoadingChar ? (
            <div className="h-48 bg-white border border-card-border rounded-2xl animate-pulse"></div>
          ) : activeCharacter ? (
            <Card accent className="space-y-4">
              <div>
                <h3 className="font-serif font-bold text-2xl">{activeCharacter.name}</h3>
                <p className="text-xs text-primary font-bold uppercase tracking-wider">
                  Niveau {activeCharacter.level} · {activeCharacter.characterClass}
                </p>
              </div>

              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-red-600" /> PV</span>
                  <span>{activeCharacter.stats.currentHealth} / {activeCharacter.stats.maxHealth}</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full transition-all duration-300"
                    style={{ width: `${(activeCharacter.stats.currentHealth / activeCharacter.stats.maxHealth) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-blue-600" /> PM</span>
                  <span>{activeCharacter.stats.currentMana} / {activeCharacter.stats.maxMana}</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${(activeCharacter.stats.currentMana / activeCharacter.stats.maxMana) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-[#f2eeee]/30 p-3 rounded-lg border border-card-border/50">
                <div>
                  <p className="text-gray-500 font-bold">FOR</p>
                  <p className="font-bold text-sm">{activeCharacter.stats.strength}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold">AGI</p>
                  <p className="font-bold text-sm">{activeCharacter.stats.agility}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold">INT</p>
                  <p className="font-bold text-sm">{activeCharacter.stats.intelligence}</p>
                </div>
              </div>
            </Card>
          ) : null}
        </div>

        {/* Colonne Droite - Bestiaire / Monstres */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-card-border/60 pb-2">
            <h2 className="text-lg font-serif font-semibold">Bestiaire Sauvage</h2>
            {monsters.length === 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => seedMutation.mutate()}
                isLoading={isSeeding}
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Générer les Monstres
              </Button>
            )}
          </div>

          {isLoadingMonsters ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 4].map((n) => (
                <div key={n} className="h-24 bg-white border border-card-border rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : monsters.length === 0 ? (
            <Card className="p-8 text-center text-gray-500 text-sm">
              Aucun monstre trouvé. Cliquez sur le bouton ci-dessus pour peupler Aethelgard de créatures fantastiques.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monsters.map((monster) => {
                const isSelected = monster.id === selectedMonsterId;
                return (
                  <Card
                    key={monster.id}
                    className={`cursor-pointer border-t-2 py-4 px-5 flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                        : 'border-card-border hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setBattleResult(null);
                      setSelectedMonsterId(monster.id);
                    }}
                  >
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-lg text-[#171c1f]">{monster.name}</h4>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Niveau {monster.level} · {monster.stats.maxHealth} PV
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#f2a65a]/10 text-[#8b5006] text-xs font-bold px-2 py-1 rounded-full shrink-0">
                      <Trophy className="h-3.5 w-3.5" />
                      +{monster.experienceValue} XP
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Bouton de combat */}
          {selectedMonster && (
            <div className="flex justify-end pt-2">
              <Button
                variant="accent"
                size="lg"
                onClick={handleStartBattle}
                isLoading={battleMutation.isPending}
                className="gap-2 font-bold w-full md:w-auto"
                disabled={activeCharacter.stats.currentHealth <= 0}
              >
                <Swords className="h-5 w-5" />
                Lancer le combat contre {selectedMonster.name}
              </Button>
            </div>
          )}
          
          {activeCharacter && activeCharacter.stats.currentHealth <= 0 && (
            <p className="text-xs text-red-600 font-semibold text-right">
              Votre héros a 0 PV et doit se reposer pour pouvoir combattre.
            </p>
          )}
        </div>
      </div>

      {/* Zone d'affichage des logs de combat */}
      {battleMutation.isPending && (
        <Card className="p-8 text-center flex flex-col items-center gap-4 border border-card-border/60">
          <Swords className="h-12 w-12 text-primary animate-bounce" />
          <h3 className="font-serif font-bold text-xl">Combat en Cours...</h3>
          <p className="text-sm text-gray-500">
            Vos sorts et vos armes s'entrechoquent. Calcul du résultat par le maître du jeu...
          </p>
        </Card>
      )}

      {battleResult && (
        <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
          <BattleLogViewer
            logs={battleResult.log}
            victory={battleResult.victory}
          />
        </div>
      )}
    </div>
  );
}
