/**
 * Authentication store - Manages authentication state and session
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateToken: (token: string) => Promise<void>;
}

const TOKEN_KEY = 'healthos_auth_token';
const USER_KEY = 'healthos_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string, role: UserRole) => {
    try {
      // In production, this would call the authentication service
      // For now, mock authentication
      const mockUser: User = {
        id: `user_${Date.now()}`,
        role,
        email,
        name: email.split('@')[0],
        verified: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store securely
      await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateToken: async (token: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      set({ token });
    } catch (error) {
      console.error('Token update error:', error);
    }
  },
}));

