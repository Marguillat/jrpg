export type CharacterClass = 'WARRIOR' | 'MAGE' | 'ROGUE' | 'CLERIC' | 'PALADIN';

export interface Stats {
  strength: number;
  agility: number;
  intelligence: number;
  maxHealth: number;
  currentHealth: number;
  maxMana: number;
  currentMana: number;
}

export interface CharacterResponseDTO {
  id: string;
  name: string;
  characterClass: CharacterClass;
  level: number;
  experience: number;
  stats: Stats;
  equippedItemIds: string[];
}

export interface CharacterRequestDTO {
  name: string;
  characterClass: CharacterClass;
}

export type ItemType = 'WEAPON' | 'ARMOR' | 'CONSUMABLE' | 'QUEST_ITEM' | 'ACCESSORY';

export interface ItemResponseDTO {
  id: string;
  name: string;
  type: ItemType;
  strengthBonus: number;
  agilityBonus: number;
  intelligenceBonus: number;
  healthBonus: number;
  manaBonus: number;
}

export interface ItemRequestDTO {
  name: string;
  type: ItemType;
  strengthBonus: number;
  agilityBonus: number;
  intelligenceBonus: number;
  healthBonus: number;
  manaBonus: number;
}

export interface MonsterResponseDTO {
  id: string;
  name: string;
  level: number;
  stats: Stats;
  experienceValue: number;
}

export interface MonsterRequestDTO {
  name: string;
  level: number;
  stats: Stats;
  experienceValue: number;
}

export interface BattleRequestDTO {
  characterId: string;
  monsterId: string;
}

export interface BattleResultDTO {
  characterName: string;
  monsterName: string;
  victory: boolean;
  experienceGained: number;
  log: string[];
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  errors: string[];
}
