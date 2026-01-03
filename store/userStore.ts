/**
 * User store - Manages user profile and role-specific data
 */

import { create } from 'zustand';
import type { User, UserRole, DoctorProfile, LabProfile, PatientProfile } from '@/types';

interface UserState {
  currentUser: User | null;
  profile: DoctorProfile | LabProfile | PatientProfile | null;
  
  // Actions
  setUser: (user: User) => void;
  setProfile: (profile: DoctorProfile | LabProfile | PatientProfile) => void;
  clearUser: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  profile: null,

  setUser: (user: User) => {
    set({ currentUser: user });
  },

  setProfile: (profile: DoctorProfile | LabProfile | PatientProfile) => {
    set({ profile });
  },

  clearUser: () => {
    set({ currentUser: null, profile: null });
  },

  hasRole: (role: UserRole) => {
    const { currentUser } = get();
    return currentUser?.role === role;
  },

  hasAnyRole: (roles: UserRole[]) => {
    const { currentUser } = get();
    return currentUser ? roles.includes(currentUser.role) : false;
  },
}));

