/**
 * Mock Users for Development and Testing
 * Pre-configured users for each role with consistent credentials
 */

import { User, UserRole } from '@/types/user';

export interface MockUserCredentials {
  email: string;
  password: string;
  user: User;
}

export const MOCK_USERS: Record<UserRole, MockUserCredentials> = {
  [UserRole.PATIENT]: {
    email: 'patient@healthos.com',
    password: 'patient123',
    user: {
      id: 'patient_001',
      role: UserRole.PATIENT,
      email: 'patient@healthos.com',
      name: 'John Doe',
      verified: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
    },
  },
  [UserRole.DOCTOR]: {
    email: 'doctor@healthos.com',
    password: 'doctor123',
    user: {
      id: 'doctor_001',
      role: UserRole.DOCTOR,
      email: 'doctor@healthos.com',
      name: 'Dr. Sarah Smith',
      verified: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
    },
  },
  [UserRole.LAB]: {
    email: 'lab@healthos.com',
    password: 'lab123',
    user: {
      id: 'lab_001',
      role: UserRole.LAB,
      email: 'lab@healthos.com',
      name: 'MediLab Diagnostics',
      verified: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
    },
  },
  [UserRole.INSURER]: {
    email: 'insurer@healthos.com',
    password: 'insurer123',
    user: {
      id: 'insurer_001',
      role: UserRole.INSURER,
      email: 'insurer@healthos.com',
      name: 'HealthShield Insurance',
      verified: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
    },
  },
  [UserRole.AUDITOR]: {
    email: 'auditor@healthos.com',
    password: 'auditor123',
    user: {
      id: 'auditor_001',
      role: UserRole.AUDITOR,
      email: 'auditor@healthos.com',
      name: 'Medical Compliance Auditor',
      verified: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
    },
  },
};

/**
 * Authenticate a mock user
 */
export const authenticateMockUser = (
  email: string,
  password: string,
  role: UserRole
): User | null => {
  const mockUser = MOCK_USERS[role];
  
  if (
    mockUser.email.toLowerCase() === email.toLowerCase() &&
    mockUser.password === password
  ) {
    return {
      ...mockUser.user,
      lastLoginAt: new Date(),
    };
  }
  
  return null;
};

/**
 * Get all mock users (for development reference)
 */
export const getAllMockUsers = (): MockUserCredentials[] => {
  return Object.values(MOCK_USERS);
};
