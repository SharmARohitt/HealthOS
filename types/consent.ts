/**
 * Consent as Code - Time-bound, purpose-bound, revocable consent
 * Human-readable + machine-readable with audit trails
 */

export enum ConsentPurpose {
  VIEW = 'view',
  CREATE = 'create',
  MODIFY = 'modify',
  SHARE = 'share',
  RESEARCH = 'research',
  INSURANCE = 'insurance',
  LEGAL = 'legal',
}

export enum ConsentStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

/**
 * Consent object - Represents patient authorization
 */
export interface Consent {
  id: string;
  patientId: string;
  granteeId: string; // Who has access (doctor, lab, insurer, etc.)
  granteeRole: string;
  
  // Purpose and scope
  purposes: ConsentPurpose[];
  scope: {
    factTypes?: string[]; // Which fact types are accessible
    dateRange?: {
      from: Date;
      to: Date;
    };
    specificFacts?: string[]; // Specific fact IDs if scope is limited
  };
  
  // Time bounds
  grantedAt: Date;
  expiresAt?: Date; // Optional expiration
  
  // Status
  status: ConsentStatus;
  revokedAt?: Date;
  revocationReason?: string;
  
  // Audit
  grantedBy: string; // Usually the patient, but could be delegate
  createdAt: Date;
  updatedAt: Date;
  
  // Cryptographic integrity
  hash: string;
  signature?: string; // Digital signature of the consent
  
  // Human-readable terms
  terms: string; // Plain language description
  machineReadableTerms: Record<string, unknown>; // Structured terms
}

/**
 * Consent request - Pending consent awaiting patient approval
 */
export interface ConsentRequest {
  id: string;
  patientId: string;
  requestedBy: string;
  requestedByRole: string;
  purposes: ConsentPurpose[];
  scope: Consent['scope'];
  terms: string;
  expiresAt?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedAt: Date;
  respondedAt?: Date;
}

/**
 * Consent audit log entry
 */
export interface ConsentAuditLog {
  id: string;
  consentId: string;
  action: 'granted' | 'revoked' | 'expired' | 'modified' | 'viewed';
  performedBy: string;
  timestamp: Date;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

