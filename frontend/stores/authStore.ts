import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';

interface User {
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login', { username, password });
    const { token, username: responseUsername, expiresIn } = response.data;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify({ username: responseUsername }));
      const maxAge = Math.round(expiresIn / 1000) || 86400;
      document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
    }
    
    set({
      user: { username: responseUsername },
      token,
      isAuthenticated: true,
    });
  },
  register: async (username: string, password: string, confirmPassword: string) => {
    const response = await apiClient.post('/auth/register', { username, password, confirmPassword });
    const { token, username: responseUsername, expiresIn } = response.data;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify({ username: responseUsername }));
      const maxAge = Math.round(expiresIn / 1000) || 86400;
      document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
    }
    
    set({
      user: { username: responseUsername },
      token,
      isAuthenticated: true,
    });
  },
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignorer l'erreur pour la déconnexion client
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
      }
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      const userStr = localStorage.getItem('auth-user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (e) {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('auth-user');
        }
      }
    }
  },
}));
