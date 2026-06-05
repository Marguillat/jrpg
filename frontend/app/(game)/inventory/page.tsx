'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '@/lib/services/item.service';
import { characterService } from '@/lib/services/character.service';
import { queryKeys } from '@/lib/query/keys';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ItemResponseDTO, ItemType } from '@/types/api';
import {
  Shield,
  Swords,
  Sparkles,
  Package,
  Heart,
  AlertCircle,
  PlusCircle,
  Check,
} from 'lucide-react';

// Données de seed pour les objets par défaut
const defaultItems = [
  { name: 'Épée de Fer', type: 'WEAPON' as ItemType, strengthBonus: 5, agilityBonus: 0, intelligenceBonus: 0, healthBonus: 0, manaBonus: 0 },
  { name: 'Dague Elfique', type: 'WEAPON' as ItemType, strengthBonus: 2, agilityBonus: 4, intelligenceBonus: 0, healthBonus: 0, manaBonus: 0 },
  { name: 'Bâton Arcanique', type: 'WEAPON' as ItemType, strengthBonus: 0, agilityBonus: 0, intelligenceBonus: 8, healthBonus: 0, manaBonus: 5 },
  { name: 'Bouclier de Chêne', type: 'ARMOR' as ItemType, strengthBonus: 0, agilityBonus: 0, intelligenceBonus: 0, healthBonus: 15, manaBonus: 0 },
  { name: 'Armure de Maille', type: 'ARMOR' as ItemType, strengthBonus: 2, agilityBonus: -1, intelligenceBonus: 0, healthBonus: 20, manaBonus: 0 },
  { name: 'Potion de Soin', type: 'CONSUMABLE' as ItemType, strengthBonus: 0, agilityBonus: 0, intelligenceBonus: 0, healthBonus: 10, manaBonus: 0 },
  { name: 'Anneau de Mana', type: 'ACCESSORY' as ItemType, strengthBonus: 0, agilityBonus: 0, intelligenceBonus: 3, healthBonus: 0, manaBonus: 15 },
  { name: 'Bottes du Chasseur', type: 'ACCESSORY' as ItemType, strengthBonus: 0, agilityBonus: 5, intelligenceBonus: 0, healthBonus: 5, manaBonus: 0 },
];

const typeConfig: Record<ItemType, { icon: React.ElementType; label: string; color: string }> = {
  WEAPON: { icon: Swords, label: 'Arme', color: 'border-t-red-500 text-red-600' },
  ARMOR: { icon: Shield, label: 'Armure', color: 'border-t-blue-500 text-blue-600' },
  CONSUMABLE: { icon: Heart, label: 'Consommable', color: 'border-t-green-500 text-green-600' },
  QUEST_ITEM: { icon: Sparkles, label: 'Quête', color: 'border-t-purple-500 text-purple-600' },
  ACCESSORY: { icon: Package, label: 'Accessoire', color: 'border-t-amber-500 text-amber-600' },
};

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const activeCharacterId = useGameStore((state) => state.activeCharacterId);
  const [filterType, setFilterType] = useState<ItemType | 'ALL'>('ALL');
  const [equippingId, setEquippingId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: queryKeys.items.all,
    queryFn: itemService.getAll,
  });

  const { data: activeCharacter } = useQuery({
    queryKey: queryKeys.characters.detail(activeCharacterId || ''),
    queryFn: () => characterService.getById(activeCharacterId || ''),
    enabled: !!activeCharacterId,
  });

  // Seed d'objets par défaut
  const seedMutation = useMutation({
    mutationFn: async () => {
      setIsSeeding(true);
      for (const item of defaultItems) {
        await itemService.create(item);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all });
      setIsSeeding(false);
    },
    onError: () => setIsSeeding(false),
  });

  // Mutation d'équipement
  const equipMutation = useMutation({
    mutationFn: ({ itemId, characterId }: { itemId: string; characterId: string }) =>
      itemService.equip(itemId, characterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
      if (activeCharacterId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.characters.detail(activeCharacterId) });
      }
      setEquippingId(null);
    },
    onError: () => setEquippingId(null),
  });

  const handleEquip = (itemId: string) => {
    if (!activeCharacterId) return;
    setEquippingId(itemId);
    equipMutation.mutate({ itemId, characterId: activeCharacterId });
  };

  const filteredItems = filterType === 'ALL' ? items : items.filter((i) => i.type === filterType);

  const filterButtons: { key: ItemType | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'Tout' },
    { key: 'WEAPON', label: 'Armes' },
    { key: 'ARMOR', label: 'Armures' },
    { key: 'ACCESSORY', label: 'Accessoires' },
    { key: 'CONSUMABLE', label: 'Consommables' },
  ];

  const isItemEquipped = (itemId: string) =>
    activeCharacter?.equippedItemIds?.includes(itemId) ?? false;

  const renderBonus = (label: string, value: number, icon: React.ElementType, color: string) => {
    if (value === 0) return null;
    const Icon = icon;
    return (
      <span className={`flex items-center gap-0.5 text-xs font-semibold ${color}`}>
        <Icon className="h-3 w-3" />
        {value > 0 ? `+${value}` : value}
      </span>
    );
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#171c1f]">Inventaire des Reliques</h1>
          <p className="text-sm text-[#393E41]">
            {activeCharacter
              ? `Équipez des armes et armures sur ${activeCharacter.name}.`
              : 'Sélectionnez un héros dans le Tableau de bord pour équiper des objets.'}
          </p>
        </div>
        {items.length === 0 && (
          <Button
            variant="secondary"
            onClick={() => seedMutation.mutate()}
            isLoading={isSeeding}
            className="gap-2 shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            Peupler le marché
          </Button>
        )}
      </div>

      {/* Filtre par type */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              filterType === key
                ? 'bg-primary text-white border-primary'
                : 'bg-white border-card-border text-[#393E41] hover:border-primary hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Message si pas de héros actif */}
      {!activeCharacterId && (
        <div className="flex items-center gap-3 p-4 bg-[#f2a65a]/10 border border-[#f2a65a]/40 rounded-xl text-sm text-[#8b5006] font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>Sélectionnez un héros actif dans le Tableau de bord pour pouvoir équiper des objets.</span>
        </div>
      )}

      {/* Grille des objets */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-44 bg-white border border-card-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="p-12 text-center max-w-xl mx-auto flex flex-col items-center gap-4">
          <Package className="h-12 w-12 text-primary" />
          <h3 className="font-serif font-bold text-xl">Marché Vide</h3>
          <p className="text-sm text-gray-500">
            Aucun objet trouvé pour ce filtre.{' '}
            {items.length === 0 && 'Peuplez le marché pour découvrir des reliques légendaires.'}
          </p>
          {items.length === 0 && (
            <Button onClick={() => seedMutation.mutate()} isLoading={isSeeding} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Peupler le marché
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            const equipped = isItemEquipped(item.id);
            const isEquipping = equippingId === item.id;

            return (
              <Card
                key={item.id}
                className={`flex flex-col gap-4 border-t-4 ${config.color.split(' ')[0]} transition-all hover:-translate-y-1`}
              >
                {/* En-tête */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#171c1f] leading-tight">
                      {item.name}
                    </h3>
                    <span className={`text-xs font-bold uppercase tracking-wider ${config.color.split(' ')[1]}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className={`p-2 rounded-lg bg-gray-50 ${config.color.split(' ')[1]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Bonus de stats */}
                <div className="flex flex-wrap gap-2 min-h-[24px]">
                  {renderBonus('FOR', item.strengthBonus, Swords, 'text-red-600')}
                  {renderBonus('AGI', item.agilityBonus, Sparkles, 'text-amber-600')}
                  {renderBonus('INT', item.intelligenceBonus, Sparkles, 'text-purple-600')}
                  {renderBonus('PV', item.healthBonus, Heart, 'text-green-600')}
                  {renderBonus('PM', item.manaBonus, Sparkles, 'text-blue-600')}
                  {[item.strengthBonus, item.agilityBonus, item.intelligenceBonus, item.healthBonus, item.manaBonus].every(
                    (v) => v === 0
                  ) && <span className="text-xs text-gray-400 italic">Aucun bonus de stat</span>}
                </div>

                {/* Bouton Équiper */}
                <div className="mt-auto pt-2">
                  {equipped ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg">
                      <Check className="h-4 w-4" />
                      Équipé sur {activeCharacter?.name}
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full font-bold"
                      onClick={() => handleEquip(item.id)}
                      isLoading={isEquipping}
                      disabled={!activeCharacterId || isEquipping}
                    >
                      {activeCharacterId ? 'Équiper' : 'Choisir un héros d\'abord'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
