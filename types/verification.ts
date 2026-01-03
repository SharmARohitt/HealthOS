/**
 * Verification and dispute resolution types
 */

export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export enum DisputeResolution {
  UPHELD = 'upheld', // Dispute was valid, fact corrected
  DISMISSED = 'dismissed', // Dispute was invalid, fact stands
  COMPROMISE = 'compromise', // Partial resolution
}

/**
 * Dispute object - Challenge to a medical fact
 */
export interface Dispute {
  id: string;
  factId: string;
  
  // Dispute details
  raisedBy: string;
  raisedByRole: string;
  reason: string;
  evidence?: {
    type: 'document' | 'test_result' | 'expert_opinion' | 'other';
    description: string;
    attachments?: string[]; // URLs or references
  };
  
  // Status and resolution
  status: DisputeStatus;
  resolution?: DisputeResolution;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolutionNotes?: string;
  
  // Timeline
  createdAt: Date;
  updatedAt: Date;
  
  // Review
  assignedReviewer?: string;
  reviewNotes?: string[];
}

/**
 * Verification proof - Cryptographic evidence of fact integrity
 */
export interface VerificationProof {
  factId: string;
  hash: string;
  timestamp: Date;
  issuerSignature?: string;
  blockchainProof?: {
    transactionHash: string;
    blockNumber: number;
    blockTimestamp: Date;
    network: string;
  };
  verificationStatus: 'verified' | 'pending' | 'failed';
}

