import { apiClient } from '../api/client';
import { ItemRequestDTO, ItemResponseDTO } from '@/types/api';

export const itemService = {
  getAll: async (): Promise<ItemResponseDTO[]> => {
    const response = await apiClient.get<ItemResponseDTO[]>('/items');
    return response.data;
  },
  
  getById: async (id: string): Promise<ItemResponseDTO> => {
    const response = await apiClient.get<ItemResponseDTO>(`/items/${id}`);
    return response.data;
  },
  
  create: async (data: ItemRequestDTO): Promise<ItemResponseDTO> => {
    const response = await apiClient.post<ItemResponseDTO>('/items', data);
    return response.data;
  },
  
  equip: async (itemId: string, characterId: string): Promise<void> => {
    await apiClient.post(`/items/${itemId}/equip/${characterId}`);
  },
};
