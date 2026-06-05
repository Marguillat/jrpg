export const queryKeys = {
  characters: {
    all: ['characters'] as const,
    detail: (id: string) => ['characters', id] as const,
  },
  items: {
    all: ['items'] as const,
    detail: (id: string) => ['items', id] as const,
  },
  monsters: {
    all: ['monsters'] as const,
    detail: (id: string) => ['monsters', id] as const,
  },
};
