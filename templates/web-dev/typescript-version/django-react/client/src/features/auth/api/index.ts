import { apiClient } from '@/api/client';
import { AuthResponse } from '../types';

export const login = async (credentials: any): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('auth/login/', credentials);
  return response.data;
};
