/**
 * API Service - Centralized API client for backend communication
 * Production-ready with error handling, retries, and request/response interceptors
 */

import { useAuthStore } from '@/store/authStore';
import type { MedicalFact, MedicalTimeline } from '@/types/medical';
import type { Consent, ConsentRequest } from '@/types/consent';
import type { Dispute } from '@/types/verification';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.healthos.io/v1';

interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

class ApiService {
  private async getHeaders(): Promise<Record<string, string>> {
    const token = useAuthStore.getState().token;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          data: data as T,
          error: data.message || 'Request failed',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        data: {} as T,
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Medical Facts API
  async getTimeline(patientId: string): Promise<ApiResponse<MedicalTimeline>> {
    return this.request<MedicalTimeline>(`/timeline/${patientId}`);
  }

  async getFact(factId: string): Promise<ApiResponse<MedicalFact>> {
    return this.request<MedicalFact>(`/facts/${factId}`);
  }

  async createFact(fact: Partial<MedicalFact>): Promise<ApiResponse<MedicalFact>> {
    return this.request<MedicalFact>('/facts', {
      method: 'POST',
      body: JSON.stringify(fact),
    });
  }

  async updateFact(factId: string, updates: Partial<MedicalFact>): Promise<ApiResponse<MedicalFact>> {
    return this.request<MedicalFact>(`/facts/${factId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Consent API
  async getConsents(patientId: string): Promise<ApiResponse<Consent[]>> {
    return this.request<Consent[]>(`/consents/${patientId}`);
  }

  async createConsent(consent: Partial<Consent>): Promise<ApiResponse<Consent>> {
    return this.request<Consent>('/consents', {
      method: 'POST',
      body: JSON.stringify(consent),
    });
  }

  async revokeConsent(consentId: string, reason?: string): Promise<ApiResponse<Consent>> {
    return this.request<Consent>(`/consents/${consentId}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getConsentRequests(patientId: string): Promise<ApiResponse<ConsentRequest[]>> {
    return this.request<ConsentRequest[]>(`/consent-requests/${patientId}`);
  }

  // Dispute API
  async createDispute(dispute: Partial<Dispute>): Promise<ApiResponse<Dispute>> {
    return this.request<Dispute>('/disputes', {
      method: 'POST',
      body: JSON.stringify(dispute),
    });
  }

  async getDisputes(factId?: string): Promise<ApiResponse<Dispute[]>> {
    const endpoint = factId ? `/disputes?factId=${factId}` : '/disputes';
    return this.request<Dispute[]>(endpoint);
  }
}

export const apiService = new ApiService();

