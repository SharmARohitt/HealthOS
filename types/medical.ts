/**
 * Medical Fact Object (MFO) - Core entity representing a medical assertion
 * Immutable and versioned, with cryptographic integrity
 */

export enum FactType {
  DIAGNOSIS = 'diagnosis',
  LAB_RESULT = 'lab_result',
  PRESCRIPTION = 'prescription',
  PROCEDURE = 'procedure',
  CONSENT = 'consent',
  CORRECTION = 'correction',
  VITAL_SIGN = 'vital_sign',
  IMAGING = 'imaging',
}

export enum VerificationStatus {
  VERIFIED = 'verified',
  DISPUTED = 'disputed',
  PENDING = 'pending',
  SUPERSEDED = 'superseded',
}

export enum ConfidenceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNCERTAIN = 'uncertain',
}

/**
 * Medical Fact Object - The atomic unit of medical truth
 */
export interface MedicalFact {
  id: string;
  factType: FactType;
  
  // Content
  title: string;
  description: string;
  data: Record<string, unknown>; // Type-specific structured data
  
  // Identity and provenance
  issuerId: string;
  issuerRole: string;
  issuerName: string;
  patientId: string;
  
  // Metadata
  timestamp: Date;
  confidenceLevel: ConfidenceLevel;
  verificationStatus: VerificationStatus;
  
  // Integrity and versioning
  hash: string; // Cryptographic hash of the fact
  previousHash?: string; // Hash of the previous version (for corrections)
  version: number;
  parentFactId?: string; // For corrections/disputes
  
  // Consent linkage
  consentId?: string;
  requiresConsent: boolean;
  
  // Blockchain anchor (when available)
  blockchainAnchor?: {
    transactionHash: string;
    blockNumber: number;
    timestamp: Date;
    network: string;
  };
  
  // Audit trail
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Medical Timeline - Git-like sequence of immutable facts
 */
export interface MedicalTimeline {
  patientId: string;
  facts: MedicalFact[];
  timelineHash: string; // Cryptographic hash of the entire timeline
  lastUpdated: Date;
}

/**
 * Fact version history (for corrections)
 */
export interface FactVersion {
  factId: string;
  version: number;
  fact: MedicalFact;
  changeType: 'creation' | 'correction' | 'dispute';
  changedBy: string;
  changedAt: Date;
  changeReason?: string;
}

/**
 * Diagnosis-specific data structure
 */
export interface DiagnosisData {
  icd10Code?: string;
  diagnosisName: string;
  severity?: 'mild' | 'moderate' | 'severe' | 'critical';
  onsetDate?: Date;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

/**
 * Lab result-specific data structure
 */
export interface LabResultData {
  testName: string;
  testCode?: string;
  value: string | number;
  unit?: string;
  referenceRange?: {
    min: number | string;
    max: number | string;
  };
  status: 'normal' | 'abnormal' | 'critical';
  labName: string;
  performedAt: Date;
}

/**
 * Prescription-specific data structure
 */
export interface PrescriptionData {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  prescribedAt: Date;
  startDate?: Date;
  endDate?: Date;
}

