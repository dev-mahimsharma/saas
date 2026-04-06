/**
 * src/services: Dedicated modules for handling external API and business logic domains.
 */
import { apiClient } from '@/lib/api-client';

export const AuthService = {
  login: async (credentials) => {
    // Placeholder login methodology
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  signup: async (userData) => {
    // Placeholder signup
    return apiClient('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
};
