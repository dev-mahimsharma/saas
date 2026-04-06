import { useState } from 'react';
import { login } from '../api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const data = await login(credentials);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      window.location.href = '/';
    } catch (e) {
      console.error('Login error', e);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleLogin };
};
