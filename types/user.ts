/**
 * User role types for role-based access control
 * Each role has distinct permissions and UI experiences
 */
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  LAB = 'lab',
  INSURER = 'insurer',
  AUDITOR = 'auditor',
}

/**
 * User identity and authentication data
 */
export interface User {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  verified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

/**
 * Doctor-specific profile data
 */
export interface DoctorProfile {
  userId: string;
  licenseNumber: string;
  specialization: string;
  institution: string;
  verified: boolean;
}

/**
 * Lab-specific profile data
 */
export interface LabProfile {
  userId: string;
  labName: string;
  accreditationNumber: string;
  verified: boolean;
}

/**
 * Patient-specific profile data
 */
export interface PatientProfile {
  userId: string;
  dateOfBirth?: Date;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

