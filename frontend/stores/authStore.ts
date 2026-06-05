import { create } from 'zustand';

interface User {
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (username: string) => {
    const mockToken = 'mock-jwt-token-for-' + username;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', mockToken);
      localStorage.setItem('auth-user', JSON.stringify({ username }));
      document.cookie = `auth-token=${mockToken}; path=/; max-age=86400; SameSite=Strict`;
    }
    set({
      user: { username },
      token: mockToken,
      isAuthenticated: true,
    });
  },
  logout: () => {
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
