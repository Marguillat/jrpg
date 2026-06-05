'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { characterService } from '@/lib/services/character.service';
import { queryKeys } from '@/lib/query/keys';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CharacterClass, CharacterResponseDTO } from '@/types/api';
import { Swords, Plus, Trash2, Shield, Heart, Sparkles, Wand2 } from 'lucide-react';

const characterSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  characterClass: z.enum(['WARRIOR', 'MAGE', 'ROGUE', 'CLERIC', 'PALADIN'] as const),
});

type CharacterFormValues = z.infer<typeof characterSchema>;

const classDetails = {
  WARRIOR: { name: 'Guerrier', strength: 12, agility: 8, intelligence: 5, maxHealth: 55, maxMana: 15, icon: Swords },
  MAGE: { name: 'Mage', strength: 5, agility: 8, intelligence: 15, maxHealth: 35, maxMana: 45, icon: Wand2 },
  ROGUE: { name: 'Voleur', strength: 8, agility: 14, intelligence: 6, maxHealth: 42, maxMana: 22, icon: Sparkles },
  CLERIC: { name: 'Prêtre', strength: 7, agility: 7, intelligence: 12, maxHealth: 45, maxMana: 35, icon: Wand2 },
  PALADIN: { name: 'Paladin', strength: 10, agility: 6, intelligence: 9, maxHealth: 50, maxMana: 25, icon: Shield },
};

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const activeCharacterId = useGameStore((state) => state.activeCharacterId);
  const setActiveCharacterId = useGameStore((state) => state.setActiveCharacterId);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  // Formulaire de création
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CharacterFormValues>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: '',
      characterClass: 'WARRIOR',
    },
  });

  const selectedClass = watch('characterClass');

  // Récupère les personnages
  const { data: characters = [], isLoading } = useQuery({
    queryKey: queryKeys.characters.all,
    queryFn: characterService.getAll,
  });

  // Mutation de création
  const createMutation = useMutation({
    mutationFn: characterService.create,
    onSuccess: (newChar) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
      setActiveCharacterId(newChar.id);
      setShowCreateForm(false);
      reset();
      setCreationError(null);
    },
    onError: (error: any) => {
      setCreationError(error.message || 'Une erreur est survenue lors de la création.');
    },
  });

  // Mutation de suppression
  const deleteMutation = useMutation({
    mutationFn: characterService.delete,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
      if (activeCharacterId === deletedId) {
        setActiveCharacterId(null);
      }
    },
  });

  const onSubmit = (data: CharacterFormValues) => {
    setCreationError(null);
    createMutation.mutate(data);
  };

  const activeCharacter = characters.find((c) => c.id === activeCharacterId);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#171c1f]">Grimoire des Héros</h1>
          <p className="text-sm text-[#393E41]">Sélectionnez ou recrutez des aventuriers pour explorer Aethelgard.</p>
        </div>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus className="h-5 w-5" />
            Recruter un Héros
          </Button>
        )}
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <Card accent className="animate-fade-in max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-serif">Nouveau Recrutement</h2>
            <Button variant="ghost" size="sm" onClick={() => { setShowCreateForm(false); setCreationError(null); }}>
              Annuler
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {creationError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
                {creationError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Nom de l'aventurier"
                  placeholder="Ex: Aragorn, Merlin..."
                  error={errors.name?.message}
                  {...register('name')}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#393E41]">
                    Classe de Héros
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(classDetails).map(([key, value]) => {
                      const Icon = value.icon;
                      return (
                        <label
                          key={key}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer transition-all ${
                            selectedClass === key
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-card-border hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            value={key}
                            className="sr-only"
                            {...register('characterClass')}
                          />
                          <Icon className="h-4 w-4 shrink-0" />
                          {value.name}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Prévisualisation des Stats */}
              <div className="p-5 bg-[#f2eeee]/30 border border-card-border rounded-xl space-y-4">
                <h3 className="font-serif font-semibold text-[#171c1f]">
                  Statistiques de départ ({classDetails[selectedClass].name})
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <span>PV : {classDetails[selectedClass].maxHealth}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span>PM : {classDetails[selectedClass].maxMana}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Swords className="h-4 w-4 text-primary" />
                    <span>Force : {classDetails[selectedClass].strength}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span>Agilité : {classDetails[selectedClass].agility}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-purple-600" />
                    <span>Intelligence : {classDetails[selectedClass].intelligence}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={createMutation.isPending}>
              Valider le recrutement
            </Button>
          </form>
        </Card>
      )}

      {/* Liste des personnages */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-white border border-card-border rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : characters.length === 0 ? (
        <Card className="p-12 text-center max-w-xl mx-auto flex flex-col items-center gap-4">
          <Swords className="h-12 w-12 text-primary" />
          <h3 className="font-serif font-bold text-xl">Aucun Héros Recruté</h3>
          <p className="text-sm text-gray-500">
            Votre taverne est vide pour le moment. Recrutez votre premier héros pour commencer l'aventure à Aethelgard.
          </p>
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Recruter un Héros
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {characters.map((char) => {
            const isActive = char.id === activeCharacterId;
            const details = classDetails[char.characterClass];
            const Icon = details?.icon || Swords;

            return (
              <Card
                key={char.id}
                accent={isActive}
                className={`cursor-pointer relative transition-all group ${
                  isActive ? 'ring-2 ring-primary/40 border-primary' : ''
                }`}
                onClick={() => setActiveCharacterId(char.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/5 rounded-xl text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-[#171c1f] group-hover:text-primary transition-colors">
                        {char.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        {details?.name} (Niv. {char.level})
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Voulez-vous vraiment licencier ce héros ?')) {
                        deleteMutation.mutate(char.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Stats Summary */}
                <div className="mt-6 space-y-2 text-xs font-semibold text-[#393E41]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-red-600" />
                      PV
                    </span>
                    <span>
                      {char.stats.currentHealth} / {char.stats.maxHealth}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all duration-300"
                      style={{ width: `${(char.stats.currentHealth / char.stats.maxHealth) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      PM
                    </span>
                    <span>
                      {char.stats.currentMana} / {char.stats.maxMana}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${(char.stats.currentMana / char.stats.maxMana) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute bottom-4 right-4 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Actif
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Active character detailed view */}
      {activeCharacter && (
        <Card className="max-w-3xl border border-card-border p-6 bg-white shadow-sm mt-8">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2 text-primary">
            <Swords className="h-5 w-5" />
            Statistiques Détailées — {activeCharacter.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="bg-[#f6fafd] p-3 rounded-lg border border-card-border/50 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Niveau</p>
              <p className="text-xl font-bold text-primary mt-1">{activeCharacter.level}</p>
            </div>
            <div className="bg-[#f6fafd] p-3 rounded-lg border border-card-border/50 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Force</p>
              <p className="text-xl font-bold mt-1">{activeCharacter.stats.strength}</p>
            </div>
            <div className="bg-[#f6fafd] p-3 rounded-lg border border-card-border/50 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Agilité</p>
              <p className="text-xl font-bold mt-1">{activeCharacter.stats.agility}</p>
            </div>
            <div className="bg-[#f6fafd] p-3 rounded-lg border border-card-border/50 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Intelligence</p>
              <p className="text-xl font-bold mt-1">{activeCharacter.stats.intelligence}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
