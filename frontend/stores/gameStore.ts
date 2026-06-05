import { create } from 'zustand';

interface GameState {
  activeCharacterId: string | null;
  setActiveCharacterId: (id: string | null) => void;
  initializeGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeCharacterId: null,
  setActiveCharacterId: (id: string | null) => {
    if (typeof window !== 'undefined') {
      if (id) {
        localStorage.setItem('active-character-id', id);
      } else {
        localStorage.removeItem('active-character-id');
      }
    }
    set({ activeCharacterId: id });
  },
  initializeGame: () => {
    if (typeof window !== 'undefined') {
      const activeId = localStorage.getItem('active-character-id');
      set({ activeCharacterId: activeId });
    }
  },
}));
