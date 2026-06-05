import { apiClient } from '../api/client';
import { MonsterRequestDTO, MonsterResponseDTO } from '@/types/api';

export const monsterService = {
  getAll: async (): Promise<MonsterResponseDTO[]> => {
    const response = await apiClient.get<MonsterResponseDTO[]>('/monsters');
    return response.data;
  },
  
  getById: async (id: string): Promise<MonsterResponseDTO> => {
    const response = await apiClient.get<MonsterResponseDTO>(`/monsters/${id}`);
    return response.data;
  },
  
  create: async (data: MonsterRequestDTO): Promise<MonsterResponseDTO> => {
    const response = await apiClient.post<MonsterResponseDTO>('/monsters', data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/monsters/${id}`);
  },
};
