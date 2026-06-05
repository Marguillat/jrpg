import { apiClient } from '../api/client';
import { BattleRequestDTO, BattleResultDTO } from '@/types/api';

export const battleService = {
  start: async (data: BattleRequestDTO): Promise<BattleResultDTO> => {
    const response = await apiClient.post<BattleResultDTO>('/battles/start', data);
    return response.data;
  },
};
