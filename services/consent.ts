/**
 * Consent Service - Manages consent creation, validation, and revocation
 */

import * as Crypto from 'expo-crypto';
import type { Consent, ConsentPurpose, ConsentStatus } from '@/types/consent';
import type { MedicalFact, FactType } from '@/types/medical';

class ConsentService {
  /**
   * Generate cryptographic hash for consent
   */
  async hashConsent(consent: Consent): Promise<string> {
    const consentString = JSON.stringify({
      id: consent.id,
      patientId: consent.patientId,
      granteeId: consent.granteeId,
      purposes: consent.purposes,
      scope: consent.scope,
      grantedAt: consent.grantedAt.toISOString(),
      expiresAt: consent.expiresAt?.toISOString(),
    });

    return Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      consentString
    );
  }

  /**
   * Check if consent is valid (active and not expired)
   */
  isConsentValid(consent: Consent): boolean {
    if (consent.status !== ConsentStatus.ACTIVE) {
      return false;
    }

    if (consent.expiresAt && consent.expiresAt < new Date()) {
      return false;
    }

    return true;
  }

  /**
   * Check if consent allows a specific action
   */
  hasConsent(
    consents: Consent[],
    purpose: ConsentPurpose,
    factType?: FactType
  ): boolean {
    const validConsents = consents.filter((c) => this.isConsentValid(c));

    return validConsents.some((consent) => {
      // Check if purpose is allowed
      if (!consent.purposes.includes(purpose)) {
        return false;
      }

      // Check if fact type is in scope (if scope is specified)
      if (factType && consent.scope.factTypes) {
        return consent.scope.factTypes.includes(factType);
      }

      return true;
    });
  }

  /**
   * Check if consent allows access to a specific fact
   */
  canAccessFact(consents: Consent[], fact: MedicalFact): boolean {
    const validConsents = consents.filter((c) => this.isConsentValid(c));

    return validConsents.some((consent) => {
      // Check date range if specified
      if (consent.scope.dateRange) {
        const factDate = fact.timestamp;
        if (
          factDate < consent.scope.dateRange.from ||
          factDate > consent.scope.dateRange.to
        ) {
          return false;
        }
      }

      // Check specific facts if scope is limited
      if (
        consent.scope.specificFacts &&
        !consent.scope.specificFacts.includes(fact.id)
      ) {
        return false;
      }

      // Check fact type if scope is specified
      if (
        consent.scope.factTypes &&
        !consent.scope.factTypes.includes(fact.factType)
      ) {
        return false;
      }

      return true;
    });
  }

  /**
   * Create a new consent object with hash
   */
  async createConsent(
    consentData: Omit<Consent, 'id' | 'hash' | 'createdAt' | 'updatedAt'>
  ): Promise<Consent> {
    const consent: Consent = {
      ...consentData,
      id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hash: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    consent.hash = await this.hashConsent(consent);

    return consent;
  }
}

export const consentService = new ConsentService();

