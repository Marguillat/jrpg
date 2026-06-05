import { apiClient } from '../api/client';
import { CharacterRequestDTO, CharacterResponseDTO } from '@/types/api';

export const characterService = {
  getAll: async (): Promise<CharacterResponseDTO[]> => {
    const response = await apiClient.get<CharacterResponseDTO[]>('/characters');
    return response.data;
  },
  
  getById: async (id: string): Promise<CharacterResponseDTO> => {
    const response = await apiClient.get<CharacterResponseDTO>(`/characters/${id}`);
    return response.data;
  },
  
  create: async (data: CharacterRequestDTO): Promise<CharacterResponseDTO> => {
    const response = await apiClient.post<CharacterResponseDTO>('/characters', data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/characters/${id}`);
  },
};
