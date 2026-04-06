/**
 * src/services: Dedicated modules for handling external API and business logic domains.
 */
import { apiClient } from '@/lib/api-client';
import { User, ApiResponse } from '@/types';

export const AuthService = {
  login: async (credentials: Record<string, string>): Promise<ApiResponse<User>> => {
    // Placeholder login methodology
    return apiClient<ApiResponse<User>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  signup: async (userData: Record<string, string>): Promise<ApiResponse<User>> => {
    // Placeholder signup
    return apiClient<ApiResponse<User>>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
};
