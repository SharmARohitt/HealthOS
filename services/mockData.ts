/**
 * Mock Data Service - Comprehensive mock data for the entire application
 * This provides realistic data for all roles and features
 */

import { 
  MedicalFact, 
  FactType, 
  VerificationStatus, 
  ConfidenceLevel,
  MedicalTimeline 
} from '@/types/medical';
import { 
  Consent, 
  ConsentStatus, 
  ConsentPurpose, 
  ConsentRequest 
} from '@/types/consent';
import { User, UserRole } from '@/types/user';

// ============================================
// MOCK PATIENTS
// ============================================
export const mockPatients: User[] = [
  {
    id: 'patient_001',
    email: 'john.doe@email.com',
    name: 'John Doe',
    role: UserRole.PATIENT,
    verified: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'patient_002',
    email: 'jane.smith@email.com',
    name: 'Jane Smith',
    role: UserRole.PATIENT,
    verified: true,
    createdAt: new Date('2024-03-20'),
  },
  {
    id: 'patient_003',
    email: 'robert.johnson@email.com',
    name: 'Robert Johnson',
    role: UserRole.PATIENT,
    verified: true,
    createdAt: new Date('2023-11-10'),
  },
  {
    id: 'patient_004',
    email: 'emily.davis@email.com',
    name: 'Emily Davis',
    role: UserRole.PATIENT,
    verified: true,
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'patient_005',
    email: 'michael.brown@email.com',
    name: 'Michael Brown',
    role: UserRole.PATIENT,
    verified: true,
    createdAt: new Date('2024-08-15'),
  },
];

// ============================================
// MOCK DOCTORS
// ============================================
export const mockDoctors: User[] = [
  {
    id: 'doctor_001',
    email: 'dr.sarah.smith@healthos.com',
    name: 'Dr. Sarah Smith',
    role: UserRole.DOCTOR,
    verified: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'doctor_002',
    email: 'dr.michael.chen@healthos.com',
    name: 'Dr. Michael Chen',
    role: UserRole.DOCTOR,
    verified: true,
    createdAt: new Date('2023-03-15'),
  },
  {
    id: 'doctor_003',
    email: 'dr.emily.brown@healthos.com',
    name: 'Dr. Emily Brown',
    role: UserRole.DOCTOR,
    verified: true,
    createdAt: new Date('2023-06-01'),
  },
];

// ============================================
// MOCK MEDICAL FACTS
// ============================================
export const createMockFacts = (patientId: string): MedicalFact[] => {
  const baseFacts: MedicalFact[] = [
    {
      id: `fact_${patientId}_001`,
      factType: FactType.DIAGNOSIS,
      title: 'Type 2 Diabetes Mellitus',
      description: 'Patient diagnosed with Type 2 Diabetes Mellitus based on HbA1c levels of 7.2% and fasting glucose of 142 mg/dL. Recommended lifestyle modifications and metformin therapy.',
      data: {
        icdCode: 'E11.9',
        hba1c: 7.2,
        fastingGlucose: 142,
        treatment: 'Metformin 500mg twice daily',
      },
      issuerId: 'doctor_001',
      issuerRole: 'Doctor',
      issuerName: 'Dr. Sarah Smith',
      patientId,
      timestamp: new Date('2025-12-15T10:30:00'),
      confidenceLevel: ConfidenceLevel.HIGH,
      verificationStatus: VerificationStatus.VERIFIED,
      hash: 'a1b2c3d4e5f6789012345678901234567890abcdef',
      version: 1,
      requiresConsent: true,
      blockchainAnchor: {
        transactionHash: '0x7f3a8b2c4d5e6f7890123456789abcdef01234567890',
        blockNumber: 1847293,
        timestamp: new Date('2025-12-15T10:31:00'),
        network: 'healthos-mainnet',
      },
      createdAt: new Date('2025-12-15T10:30:00'),
      updatedAt: new Date('2025-12-15T10:31:00'),
      createdBy: 'doctor_001',
    },
    {
      id: `fact_${patientId}_002`,
      factType: FactType.LAB_RESULT,
      title: 'Complete Blood Count (CBC)',
      description: 'Routine CBC performed. All values within normal limits. Hemoglobin slightly elevated but within acceptable range.',
      data: {
        hemoglobin: 15.8,
        wbc: 7200,
        platelets: 245000,
        rbc: 5.1,
        hematocrit: 46.2,
      },
      issuerId: 'lab_001',
      issuerRole: 'Lab',
      issuerName: 'MediLab Diagnostics',
      patientId,
      timestamp: new Date('2025-12-20T14:15:00'),
      confidenceLevel: ConfidenceLevel.HIGH,
      verificationStatus: VerificationStatus.VERIFIED,
      hash: 'b2c3d4e5f6789012345678901234567890abcdef12',
      version: 1,
      requiresConsent: true,
      blockchainAnchor: {
        transactionHash: '0x8c4b9d3e5f6a7b8901234567890abcdef12345678901',
        blockNumber: 1847450,
        timestamp: new Date('2025-12-20T14:16:00'),
        network: 'healthos-mainnet',
      },
      createdAt: new Date('2025-12-20T14:15:00'),
      updatedAt: new Date('2025-12-20T14:16:00'),
      createdBy: 'lab_001',
    },
    {
      id: `fact_${patientId}_003`,
      factType: FactType.PRESCRIPTION,
      title: 'Metformin HCl 500mg',
      description: 'Prescribed for Type 2 Diabetes management. Take twice daily with meals. Monitor blood glucose regularly.',
      data: {
        medication: 'Metformin HCl',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '90 days',
        refills: 3,
        instructions: 'Take with meals to reduce GI side effects',
      },
      issuerId: 'doctor_001',
      issuerRole: 'Doctor',
      issuerName: 'Dr. Sarah Smith',
      patientId,
      timestamp: new Date('2025-12-15T10:45:00'),
      confidenceLevel: ConfidenceLevel.HIGH,
      verificationStatus: VerificationStatus.VERIFIED,
      hash: 'c3d4e5f6789012345678901234567890abcdef1234',
      version: 1,
      requiresConsent: true,
      blockchainAnchor: {
        transactionHash: '0x9d5c0e4f6a7b8c9012345678901abcdef234567890ab',
        blockNumber: 1847295,
        timestamp: new Date('2025-12-15T10:46:00'),
        network: 'healthos-mainnet',
      },
      createdAt: new Date('2025-12-15T10:45:00'),
      updatedAt: new Date('2025-12-15T10:46:00'),
      createdBy: 'doctor_001',
    },
    {
      id: `fact_${patientId}_004`,
      factType: FactType.VITAL_SIGN,
      title: 'Blood Pressure Reading',
      description: 'Routine blood pressure check during office visit. Values within normal range.',
      data: {
        systolic: 120,
        diastolic: 80,
        pulse: 72,
        position: 'Seated',
        arm: 'Left',
      },
      issuerId: 'doctor_001',
      issuerRole: 'Doctor',
      issuerName: 'Dr. Sarah Smith',
      patientId,
      timestamp: new Date('2025-12-28T09:00:00'),
      confidenceLevel: ConfidenceLevel.HIGH,
      verificationStatus: VerificationStatus.VERIFIED,
      hash: 'd4e5f6789012345678901234567890abcdef123456',
      version: 1,
      requiresConsent: false,
      blockchainAnchor: {
        transactionHash: '0xa6e7f8901234567890abcdef1234567890abcdef1234',
        blockNumber: 1847890,
        timestamp: new Date('2025-12-28T09:01:00'),
        network: 'healthos-mainnet',
      },
      createdAt: new Date('2025-12-28T09:00:00'),
      updatedAt: new Date('2025-12-28T09:01:00'),
      createdBy: 'doctor_001',
    },
    {
      id: `fact_${patientId}_005`,
      factType: FactType.PROCEDURE,
      title: 'Annual Physical Examination',
      description: 'Comprehensive annual physical examination including cardiovascular, respiratory, and neurological assessment. Overall health status: Good.',
      data: {
        type: 'Annual Physical',
        findings: 'No abnormalities detected',
        recommendations: ['Continue current medications', 'Follow up in 6 months', 'Maintain healthy diet'],
        duration: '45 minutes',
      },
      issuerId: 'doctor_001',
      issuerRole: 'Doctor',
      issuerName: 'Dr. Sarah Smith',
      patientId,
      timestamp: new Date('2026-01-02T10:00:00'),
      confidenceLevel: ConfidenceLevel.HIGH,
      verificationStatus: VerificationStatus.VERIFIED,
      hash: 'e5f6789012345678901234567890abcdef12345678',
      version: 1,
      requiresConsent: true,
      blockchainAnchor: {
        transactionHash: '0xb7f8901234567890abcdef1234567890abcdef123456',
        blockNumber: 1848100,
        timestamp: new Date('2026-01-02T10:01:00'),
        network: 'healthos-mainnet',
      },
      createdAt: new Date('2026-01-02T10:00:00'),
      updatedAt: new Date('2026-01-02T10:01:00'),
      createdBy: 'doctor_001',
    },
    {
      id: `fact_${patientId}_006`,
      factType: FactType.LAB_RESULT,
      title: 'Lipid Panel',
      description: 'Fasting lipid panel results. LDL slightly elevated, HDL within normal range. Triglycerides normal.',
      data: {
        totalCholesterol: 210,
        ldl: 135,
        hdl: 52,
        triglycerides: 115,
        vldl: 23,
      },
      issuerId: 'lab_001',
      issuerRole: 'Lab',
      issuerName: 'MediLab Diagnostics',
      patientId,
      timestamp: new Date('2025-12-22T11:30:00'),
      confidenceLevel: ConfidenceLevel.HIGH,
      verificationStatus: VerificationStatus.VERIFIED,
      hash: 'f6789012345678901234567890abcdef1234567890',
      version: 1,
      requiresConsent: true,
      blockchainAnchor: {
        transactionHash: '0xc8901234567890abcdef1234567890abcdef12345678',
        blockNumber: 1847550,
        timestamp: new Date('2025-12-22T11:31:00'),
        network: 'healthos-mainnet',
      },
      createdAt: new Date('2025-12-22T11:30:00'),
      updatedAt: new Date('2025-12-22T11:31:00'),
      createdBy: 'lab_001',
    },
    {
      id: `fact_${patientId}_007`,
      factType: FactType.IMAGING,
      title: 'Chest X-Ray',
      description: 'Routine chest X-ray. No acute cardiopulmonary abnormality. Heart size normal. Lungs clear.',
      data: {
        type: 'PA and Lateral',
        findings: 'No acute abnormality',
        impression: 'Normal chest radiograph',
        technique: 'Standard two-view chest radiograph',
      },
      issuerId: 'lab_002',
      issuerRole: 'Lab',
      issuerName: 'City Imaging Center',
      patientId,
      timestamp: new Date('2025-11-15T15:00:00'),
      confidenceLevel: ConfidenceLevel.HIGH,
      verificationStatus: VerificationStatus.VERIFIED,
      hash: '789012345678901234567890abcdef123456789012',
      version: 1,
      requiresConsent: true,
      blockchainAnchor: {
        transactionHash: '0xd9012345678901abcdef1234567890abcdef1234567890',
        blockNumber: 1845000,
        timestamp: new Date('2025-11-15T15:01:00'),
        network: 'healthos-mainnet',
      },
      createdAt: new Date('2025-11-15T15:00:00'),
      updatedAt: new Date('2025-11-15T15:01:00'),
      createdBy: 'lab_002',
    },
  ];

  return baseFacts;
};

// ============================================
// MOCK CONSENTS
// ============================================
export const createMockConsents = (patientId: string): Consent[] => {
  return [
    {
      id: `consent_${patientId}_001`,
      patientId,
      granteeId: 'doctor_001',
      granteeRole: 'Dr. Sarah Smith - Primary Care',
      purposes: [ConsentPurpose.VIEW, ConsentPurpose.CREATE, ConsentPurpose.MODIFY],
      scope: {
        factTypes: ['diagnosis', 'prescription', 'vital_sign', 'procedure'],
      },
      grantedAt: new Date('2025-01-01'),
      expiresAt: new Date('2026-12-31'),
      status: ConsentStatus.ACTIVE,
      grantedBy: patientId,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
      hash: 'consent_hash_001',
      terms: 'I authorize Dr. Sarah Smith to view, create, and modify my medical records for ongoing primary care treatment.',
      machineReadableTerms: {
        accessLevel: 'full',
        dataCategories: ['clinical', 'diagnostic'],
      },
    },
    {
      id: `consent_${patientId}_002`,
      patientId,
      granteeId: 'lab_001',
      granteeRole: 'MediLab Diagnostics',
      purposes: [ConsentPurpose.VIEW, ConsentPurpose.CREATE],
      scope: {
        factTypes: ['lab_result'],
      },
      grantedAt: new Date('2025-06-15'),
      expiresAt: new Date('2026-06-15'),
      status: ConsentStatus.ACTIVE,
      grantedBy: patientId,
      createdAt: new Date('2025-06-15'),
      updatedAt: new Date('2025-06-15'),
      hash: 'consent_hash_002',
      terms: 'I authorize MediLab Diagnostics to view my records and upload lab results for diagnostic purposes.',
      machineReadableTerms: {
        accessLevel: 'limited',
        dataCategories: ['diagnostic'],
      },
    },
    {
      id: `consent_${patientId}_003`,
      patientId,
      granteeId: 'insurer_001',
      granteeRole: 'HealthFirst Insurance',
      purposes: [ConsentPurpose.VIEW, ConsentPurpose.INSURANCE],
      scope: {
        factTypes: ['diagnosis', 'procedure', 'prescription'],
        dateRange: {
          from: new Date('2025-01-01'),
          to: new Date('2025-12-31'),
        },
      },
      grantedAt: new Date('2025-03-01'),
      expiresAt: new Date('2026-03-01'),
      status: ConsentStatus.ACTIVE,
      grantedBy: patientId,
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-01'),
      hash: 'consent_hash_003',
      terms: 'I authorize HealthFirst Insurance to view my diagnoses, procedures, and prescriptions for claims processing within the specified date range.',
      machineReadableTerms: {
        accessLevel: 'limited',
        dataCategories: ['clinical'],
        purpose: 'claims_processing',
      },
    },
    {
      id: `consent_${patientId}_004`,
      patientId,
      granteeId: 'doctor_002',
      granteeRole: 'Dr. Michael Chen - Cardiology',
      purposes: [ConsentPurpose.VIEW],
      scope: {
        factTypes: ['diagnosis', 'vital_sign', 'imaging'],
      },
      grantedAt: new Date('2025-10-01'),
      expiresAt: new Date('2026-04-01'),
      status: ConsentStatus.ACTIVE,
      grantedBy: patientId,
      createdAt: new Date('2025-10-01'),
      updatedAt: new Date('2025-10-01'),
      hash: 'consent_hash_004',
      terms: 'I authorize Dr. Michael Chen to view my cardiac-related records for specialist consultation.',
      machineReadableTerms: {
        accessLevel: 'readonly',
        dataCategories: ['clinical', 'diagnostic'],
        specialty: 'cardiology',
      },
    },
    {
      id: `consent_${patientId}_005`,
      patientId,
      granteeId: 'insurer_002',
      granteeRole: 'BlueCross Insurance',
      purposes: [ConsentPurpose.VIEW],
      scope: {},
      grantedAt: new Date('2024-06-01'),
      expiresAt: new Date('2025-06-01'),
      status: ConsentStatus.EXPIRED,
      grantedBy: patientId,
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2025-06-01'),
      hash: 'consent_hash_005',
      terms: 'Previous insurance provider - consent has expired.',
      machineReadableTerms: {},
    },
    {
      id: `consent_${patientId}_006`,
      patientId,
      granteeId: 'researcher_001',
      granteeRole: 'University Medical Research',
      purposes: [ConsentPurpose.RESEARCH],
      scope: {
        factTypes: ['diagnosis', 'lab_result'],
      },
      grantedAt: new Date('2025-08-01'),
      revokedAt: new Date('2025-11-15'),
      revocationReason: 'No longer participating in research study',
      status: ConsentStatus.REVOKED,
      grantedBy: patientId,
      createdAt: new Date('2025-08-01'),
      updatedAt: new Date('2025-11-15'),
      hash: 'consent_hash_006',
      terms: 'Consent for anonymized data use in medical research - REVOKED.',
      machineReadableTerms: {
        purpose: 'research',
        anonymized: true,
      },
    },
  ];
};

// ============================================
// MOCK CONSENT REQUESTS
// ============================================
export const createMockConsentRequests = (patientId: string): ConsentRequest[] => {
  return [
    {
      id: `request_${patientId}_001`,
      patientId,
      requestedBy: 'insurer_003',
      requestedByRole: 'MetLife Insurance',
      purposes: [ConsentPurpose.VIEW, ConsentPurpose.INSURANCE],
      scope: {
        factTypes: ['diagnosis', 'procedure', 'lab_result'],
      },
      terms: 'MetLife Insurance requests access to your medical records for policy underwriting purposes.',
      expiresAt: new Date('2026-06-30'),
      status: 'pending',
      requestedAt: new Date('2026-01-02T14:30:00'),
    },
    {
      id: `request_${patientId}_002`,
      patientId,
      requestedBy: 'doctor_003',
      requestedByRole: 'Dr. Emily Brown - Endocrinology',
      purposes: [ConsentPurpose.VIEW, ConsentPurpose.CREATE],
      scope: {
        factTypes: ['diagnosis', 'lab_result', 'prescription'],
      },
      terms: 'Dr. Emily Brown requests access for diabetes specialist consultation and treatment planning.',
      expiresAt: new Date('2027-01-01'),
      status: 'pending',
      requestedAt: new Date('2026-01-03T09:15:00'),
    },
  ];
};

// ============================================
// MOCK APPOINTMENTS
// ============================================
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
  type: 'checkup' | 'follow-up' | 'consultation' | 'procedure' | 'new-patient';
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  notes?: string;
}

export const createMockAppointments = (userId: string, role: UserRole): Appointment[] => {
  if (role === UserRole.PATIENT) {
    return [
      {
        id: 'apt_001',
        patientId: userId,
        patientName: 'You',
        doctorId: 'doctor_001',
        doctorName: 'Dr. Sarah Smith',
        date: new Date('2026-01-15'),
        time: '10:00 AM',
        type: 'follow-up',
        status: 'scheduled',
        notes: 'Diabetes follow-up',
      },
      {
        id: 'apt_002',
        patientId: userId,
        patientName: 'You',
        doctorId: 'doctor_002',
        doctorName: 'Dr. Michael Chen',
        date: new Date('2026-01-22'),
        time: '2:30 PM',
        type: 'consultation',
        status: 'scheduled',
        notes: 'Cardiology consultation',
      },
      {
        id: 'apt_003',
        patientId: userId,
        patientName: 'You',
        doctorId: 'doctor_001',
        doctorName: 'Dr. Sarah Smith',
        date: new Date('2026-02-15'),
        time: '9:00 AM',
        type: 'checkup',
        status: 'scheduled',
        notes: 'Quarterly checkup',
      },
    ];
  } else if (role === UserRole.DOCTOR) {
    return [
      {
        id: 'apt_d_001',
        patientId: 'patient_001',
        patientName: 'John Doe',
        doctorId: userId,
        doctorName: 'You',
        date: new Date('2026-01-03'),
        time: '9:00 AM',
        type: 'checkup',
        status: 'completed',
      },
      {
        id: 'apt_d_002',
        patientId: 'patient_002',
        patientName: 'Jane Smith',
        doctorId: userId,
        doctorName: 'You',
        date: new Date('2026-01-03'),
        time: '10:30 AM',
        type: 'follow-up',
        status: 'in-progress',
      },
      {
        id: 'apt_d_003',
        patientId: 'patient_003',
        patientName: 'Robert Johnson',
        doctorId: userId,
        doctorName: 'You',
        date: new Date('2026-01-03'),
        time: '2:00 PM',
        type: 'consultation',
        status: 'scheduled',
      },
      {
        id: 'apt_d_004',
        patientId: 'patient_004',
        patientName: 'Emily Davis',
        doctorId: userId,
        doctorName: 'You',
        date: new Date('2026-01-03'),
        time: '3:30 PM',
        type: 'new-patient',
        status: 'scheduled',
      },
      {
        id: 'apt_d_005',
        patientId: 'patient_005',
        patientName: 'Michael Brown',
        doctorId: userId,
        doctorName: 'You',
        date: new Date('2026-01-03'),
        time: '4:30 PM',
        type: 'follow-up',
        status: 'scheduled',
      },
    ];
  }
  return [];
};

// ============================================
// MOCK NOTIFICATIONS
// ============================================
export interface Notification {
  id: string;
  type: 'consent_request' | 'appointment' | 'lab_result' | 'prescription' | 'system' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
  metadata?: Record<string, unknown>;
}

export const createMockNotifications = (userId: string, role: UserRole): Notification[] => {
  const baseNotifications: Notification[] = [
    {
      id: 'notif_001',
      type: 'consent_request',
      title: 'New Consent Request',
      message: 'MetLife Insurance is requesting access to your medical records.',
      timestamp: new Date('2026-01-02T14:30:00'),
      read: false,
      actionRequired: true,
      metadata: { requestId: 'request_001' },
    },
    {
      id: 'notif_002',
      type: 'consent_request',
      title: 'Specialist Access Request',
      message: 'Dr. Emily Brown (Endocrinology) is requesting access for consultation.',
      timestamp: new Date('2026-01-03T09:15:00'),
      read: false,
      actionRequired: true,
      metadata: { requestId: 'request_002' },
    },
    {
      id: 'notif_003',
      type: 'lab_result',
      title: 'New Lab Results Available',
      message: 'Your Complete Blood Count results are now available to view.',
      timestamp: new Date('2025-12-20T14:30:00'),
      read: true,
      actionRequired: false,
      metadata: { factId: 'fact_001_002' },
    },
    {
      id: 'notif_004',
      type: 'appointment',
      title: 'Upcoming Appointment Reminder',
      message: 'You have an appointment with Dr. Sarah Smith on Jan 15, 2026 at 10:00 AM.',
      timestamp: new Date('2026-01-03T08:00:00'),
      read: false,
      actionRequired: false,
      metadata: { appointmentId: 'apt_001' },
    },
    {
      id: 'notif_005',
      type: 'prescription',
      title: 'Prescription Refill Reminder',
      message: 'Your Metformin prescription will need refill in 7 days.',
      timestamp: new Date('2026-01-01T09:00:00'),
      read: true,
      actionRequired: false,
    },
    {
      id: 'notif_006',
      type: 'system',
      title: 'Profile Verified',
      message: 'Your identity has been successfully verified on the blockchain.',
      timestamp: new Date('2025-12-28T10:00:00'),
      read: true,
      actionRequired: false,
    },
  ];

  if (role === UserRole.DOCTOR) {
    return [
      {
        id: 'notif_d_001',
        type: 'alert',
        title: 'Critical Lab Result',
        message: 'Patient Robert Johnson has a critical lab result requiring review.',
        timestamp: new Date('2026-01-03T08:30:00'),
        read: false,
        actionRequired: true,
      },
      {
        id: 'notif_d_002',
        type: 'appointment',
        title: 'New Patient Scheduled',
        message: 'Emily Davis has scheduled a new patient appointment for today at 3:30 PM.',
        timestamp: new Date('2026-01-02T16:00:00'),
        read: true,
        actionRequired: false,
      },
      {
        id: 'notif_d_003',
        type: 'consent_request',
        title: 'Consent Granted',
        message: 'John Doe has granted you access to their complete medical history.',
        timestamp: new Date('2026-01-01T11:00:00'),
        read: true,
        actionRequired: false,
      },
    ];
  }

  return baseNotifications;
};

// ============================================
// MOCK HEALTH STATS
// ============================================
export interface HealthStat {
  id: string;
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export const createMockHealthStats = (): HealthStat[] => {
  return [
    {
      id: 'stat_001',
      label: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      icon: '❤️',
      trend: 'stable',
      lastUpdated: new Date('2025-12-28'),
    },
    {
      id: 'stat_002',
      label: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      icon: '💓',
      trend: 'stable',
      lastUpdated: new Date('2025-12-28'),
    },
    {
      id: 'stat_003',
      label: 'Blood Sugar',
      value: '142',
      unit: 'mg/dL',
      status: 'warning',
      icon: '🩸',
      trend: 'down',
      lastUpdated: new Date('2025-12-22'),
    },
    {
      id: 'stat_004',
      label: 'HbA1c',
      value: '7.2',
      unit: '%',
      status: 'warning',
      icon: '📊',
      trend: 'down',
      lastUpdated: new Date('2025-12-15'),
    },
    {
      id: 'stat_005',
      label: 'BMI',
      value: '23.5',
      unit: 'kg/m²',
      status: 'normal',
      icon: '⚖️',
      trend: 'stable',
      lastUpdated: new Date('2026-01-02'),
    },
    {
      id: 'stat_006',
      label: 'Cholesterol',
      value: '210',
      unit: 'mg/dL',
      status: 'warning',
      icon: '🔬',
      trend: 'up',
      lastUpdated: new Date('2025-12-22'),
    },
  ];
};

// ============================================
// MOCK AUDIT LOGS
// ============================================
export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  actorId: string;
  actorRole: string;
  target: string;
  targetId: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
  details?: string;
  ipAddress?: string;
  blockchainHash?: string;
}

export const createMockAuditLogs = (): AuditLogEntry[] => {
  return [
    {
      id: 'audit_001',
      action: 'FACT_CREATED',
      actor: 'Dr. Sarah Smith',
      actorId: 'doctor_001',
      actorRole: 'Doctor',
      target: 'Medical Fact: Annual Physical',
      targetId: 'fact_001_005',
      timestamp: new Date('2026-01-02T10:01:00'),
      status: 'success',
      details: 'Created annual physical examination record',
      blockchainHash: '0xb7f8901234567890abcdef1234567890abcdef123456',
    },
    {
      id: 'audit_002',
      action: 'CONSENT_GRANTED',
      actor: 'John Doe',
      actorId: 'patient_001',
      actorRole: 'Patient',
      target: 'Dr. Sarah Smith',
      targetId: 'doctor_001',
      timestamp: new Date('2025-12-30T15:30:00'),
      status: 'success',
      details: 'Granted full access for primary care',
      blockchainHash: '0xc890123456789abcdef1234567890abcdef12345678',
    },
    {
      id: 'audit_003',
      action: 'RECORD_ACCESSED',
      actor: 'HealthFirst Insurance',
      actorId: 'insurer_001',
      actorRole: 'Insurer',
      target: 'Patient Timeline: John Doe',
      targetId: 'patient_001',
      timestamp: new Date('2025-12-29T11:00:00'),
      status: 'success',
      details: 'Accessed records for claims processing',
    },
    {
      id: 'audit_004',
      action: 'LAB_RESULT_UPLOADED',
      actor: 'MediLab Diagnostics',
      actorId: 'lab_001',
      actorRole: 'Lab',
      target: 'Complete Blood Count',
      targetId: 'fact_001_002',
      timestamp: new Date('2025-12-20T14:16:00'),
      status: 'success',
      details: 'CBC results uploaded and verified',
      blockchainHash: '0x8c4b9d3e5f6a7b8901234567890abcdef12345678901',
    },
    {
      id: 'audit_005',
      action: 'CONSENT_REVOKED',
      actor: 'John Doe',
      actorId: 'patient_001',
      actorRole: 'Patient',
      target: 'University Medical Research',
      targetId: 'researcher_001',
      timestamp: new Date('2025-11-15T14:00:00'),
      status: 'success',
      details: 'Revoked research consent',
      blockchainHash: '0xd9012345678901abcdef1234567890abcdef1234567890',
    },
    {
      id: 'audit_006',
      action: 'ACCESS_DENIED',
      actor: 'Unknown Agent',
      actorId: 'unknown_001',
      actorRole: 'Unknown',
      target: 'Patient Timeline: Emily Davis',
      targetId: 'patient_004',
      timestamp: new Date('2025-12-28T23:45:00'),
      status: 'failed',
      details: 'Attempted access without valid consent - BLOCKED',
      ipAddress: '192.168.1.100',
    },
  ];
};

// ============================================
// HELPER: Get Mock Data for Current User
// ============================================
export const getMockDataForUser = (user: User) => {
  return {
    facts: createMockFacts(user.id),
    consents: createMockConsents(user.id),
    consentRequests: createMockConsentRequests(user.id),
    appointments: createMockAppointments(user.id, user.role),
    notifications: createMockNotifications(user.id, user.role),
    healthStats: createMockHealthStats(),
  };
};

export const getMockTimeline = (patientId: string): MedicalTimeline => {
  const facts = createMockFacts(patientId);
  return {
    patientId,
    facts,
    timelineHash: 'timeline_hash_' + patientId,
    lastUpdated: new Date(),
  };
};
