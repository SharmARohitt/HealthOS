/**
 * Patient Consent Management Screen - Full consent management with requests
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { createMockConsents, createMockConsentRequests } from '@/services/mockData';
import type { Consent, ConsentRequest } from '@/types/consent';
import { ConsentStatus, ConsentPurpose } from '@/types/consent';
import { format } from 'date-fns';

export default function PatientConsentScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'history'>('active');
  const [consents, setConsents] = useState<Consent[]>([]);
  const [requests, setRequests] = useState<ConsentRequest[]>([]);
  const [selectedConsent, setSelectedConsent] = useState<Consent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (user) {
      setConsents(createMockConsents(user.id));
      setRequests(createMockConsentRequests(user.id));
    }
  }, [user]);

  const activeConsents = consents.filter(c => c.status === ConsentStatus.ACTIVE);
  const historyConsents = consents.filter(c => c.status !== ConsentStatus.ACTIVE);
  const pendingRequests = requests.filter(r => r.status === 'pending');

  const handleRevokeConsent = (consent: Consent) => {
    Alert.alert(
      'Revoke Access',
      `Are you sure you want to revoke access for ${consent.granteeRole}? They will no longer be able to view your medical records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: () => {
            setConsents(prev => prev.map(c => 
              c.id === consent.id 
                ? { ...c, status: ConsentStatus.REVOKED, revokedAt: new Date() }
                : c
            ));
            Alert.alert('Success', 'Consent has been revoked and recorded on the blockchain.');
          }
        }
      ]
    );
  };

  const handleApproveRequest = (request: ConsentRequest) => {
    Alert.alert(
      'Approve Access',
      `Grant ${request.requestedByRole} access to your medical records?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            // Add to consents
            const newConsent: Consent = {
              id: `consent_new_${Date.now()}`,
              patientId: user?.id || '',
              granteeId: request.requestedBy,
              granteeRole: request.requestedByRole,
              purposes: request.purposes,
              scope: request.scope,
              grantedAt: new Date(),
              expiresAt: request.expiresAt,
              status: ConsentStatus.ACTIVE,
              grantedBy: user?.id || '',
              createdAt: new Date(),
              updatedAt: new Date(),
              hash: `hash_${Date.now()}`,
              terms: request.terms,
              machineReadableTerms: {},
            };
            setConsents(prev => [newConsent, ...prev]);
            setRequests(prev => prev.filter(r => r.id !== request.id));
            Alert.alert('Success', 'Access has been granted and recorded on the blockchain.');
          }
        }
      ]
    );
  };

  const handleDenyRequest = (request: ConsentRequest) => {
    Alert.alert(
      'Deny Access',
      `Deny ${request.requestedByRole}'s request to access your records?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deny',
          style: 'destructive',
          onPress: () => {
            setRequests(prev => prev.filter(r => r.id !== request.id));
            Alert.alert('Request Denied', 'The access request has been denied.');
          }
        }
      ]
    );
  };

  const getPurposeLabel = (purpose: ConsentPurpose) => {
    const labels: Record<ConsentPurpose, string> = {
      [ConsentPurpose.VIEW]: 'View',
      [ConsentPurpose.CREATE]: 'Create',
      [ConsentPurpose.MODIFY]: 'Modify',
      [ConsentPurpose.SHARE]: 'Share',
      [ConsentPurpose.RESEARCH]: 'Research',
      [ConsentPurpose.INSURANCE]: 'Insurance',
      [ConsentPurpose.LEGAL]: 'Legal',
    };
    return labels[purpose];
  };

  const getStatusColor = (status: ConsentStatus) => {
    const colors = {
      [ConsentStatus.ACTIVE]: '#4ECDC4',
      [ConsentStatus.REVOKED]: '#FF6B6B',
      [ConsentStatus.EXPIRED]: '#FFE66D',
      [ConsentStatus.PENDING]: '#45B7D1',
    };
    return colors[status];
  };

  const renderConsentCard = (consent: Consent) => (
    <TouchableOpacity 
      key={consent.id} 
      style={styles.consentCard}
      onPress={() => {
        setSelectedConsent(consent);
        setShowDetailModal(true);
      }}
    >
      <View style={styles.consentHeader}>
        <View style={styles.granteeInfo}>
          <View style={styles.granteeAvatar}>
            <Text style={styles.granteeInitial}>{consent.granteeRole.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.granteeName}>{consent.granteeRole}</Text>
            <Text style={styles.granteeId}>ID: {consent.granteeId.slice(0, 12)}...</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(consent.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(consent.status) }]}>
            {consent.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.purposeRow}>
        {consent.purposes.map(purpose => (
          <View key={purpose} style={styles.purposeTag}>
            <Text style={styles.purposeText}>{getPurposeLabel(purpose)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.consentTerms} numberOfLines={2}>{consent.terms}</Text>

      <View style={styles.consentMeta}>
        <Text style={styles.metaText}>
          Granted: {format(consent.grantedAt, 'MMM d, yyyy')}
        </Text>
        {consent.expiresAt && (
          <Text style={styles.metaText}>
            Expires: {format(consent.expiresAt, 'MMM d, yyyy')}
          </Text>
        )}
      </View>

      {consent.status === ConsentStatus.ACTIVE && (
        <TouchableOpacity 
          style={styles.revokeButton}
          onPress={() => handleRevokeConsent(consent)}
        >
          <Text style={styles.revokeButtonText}>Revoke Access</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderRequestCard = (request: ConsentRequest) => (
    <View key={request.id} style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.requestIcon}>
          <Text style={styles.requestEmoji}>🔔</Text>
        </View>
        <View style={styles.requestInfo}>
          <Text style={styles.requestTitle}>{request.requestedByRole}</Text>
          <Text style={styles.requestTime}>
            Requested {format(request.requestedAt, 'MMM d, yyyy • h:mm a')}
          </Text>
        </View>
      </View>

      <Text style={styles.requestTerms}>{request.terms}</Text>

      <View style={styles.requestPurposes}>
        <Text style={styles.requestLabel}>Requesting access for:</Text>
        <View style={styles.purposeRow}>
          {request.purposes.map(purpose => (
            <View key={purpose} style={styles.purposeTag}>
              <Text style={styles.purposeText}>{getPurposeLabel(purpose)}</Text>
            </View>
          ))}
        </View>
      </View>

      {request.expiresAt && (
        <Text style={styles.expiresText}>
          ⏱️ Access would expire: {format(request.expiresAt, 'MMM d, yyyy')}
        </Text>
      )}

      <View style={styles.requestActions}>
        <TouchableOpacity 
          style={styles.denyButton}
          onPress={() => handleDenyRequest(request)}
        >
          <Text style={styles.denyButtonText}>Deny</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.approveButton}
          onPress={() => handleApproveRequest(request)}
        >
          <Text style={styles.approveButtonText}>Approve Access</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Consent Manager</Text>
          <Text style={styles.headerSubtitle}>Control who accesses your data</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active ({activeConsents.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending ({pendingRequests.length})
          </Text>
          {pendingRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History ({historyConsents.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'active' && (
          <>
            {activeConsents.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔐</Text>
                <Text style={styles.emptyText}>No Active Consents</Text>
                <Text style={styles.emptySubtext}>
                  You haven't granted access to any healthcare providers yet.
                </Text>
              </View>
            ) : (
              activeConsents.map(renderConsentCard)
            )}
          </>
        )}

        {activeTab === 'pending' && (
          <>
            {pendingRequests.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>No Pending Requests</Text>
                <Text style={styles.emptySubtext}>
                  When healthcare providers request access, their requests will appear here.
                </Text>
              </View>
            ) : (
              pendingRequests.map(renderRequestCard)
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {historyConsents.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>📜</Text>
                <Text style={styles.emptyText}>No History</Text>
                <Text style={styles.emptySubtext}>
                  Revoked and expired consents will appear here.
                </Text>
              </View>
            ) : (
              historyConsents.map(renderConsentCard)
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={showDetailModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedConsent && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Consent Details</Text>
                  <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Grantee</Text>
                    <Text style={styles.detailValue}>{selectedConsent.granteeRole}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(selectedConsent.status) }]}>
                      {selectedConsent.status.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Granted</Text>
                    <Text style={styles.detailValue}>
                      {format(selectedConsent.grantedAt, 'MMM d, yyyy • h:mm a')}
                    </Text>
                  </View>
                  {selectedConsent.expiresAt && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Expires</Text>
                      <Text style={styles.detailValue}>
                        {format(selectedConsent.expiresAt, 'MMM d, yyyy')}
                      </Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Purposes</Text>
                    <Text style={styles.detailValue}>
                      {selectedConsent.purposes.map(getPurposeLabel).join(', ')}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Terms</Text>
                    <Text style={styles.detailValue}>{selectedConsent.terms}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Blockchain Hash</Text>
                    <Text style={[styles.detailValue, { fontFamily: 'monospace' }]}>
                      {selectedConsent.hash}
                    </Text>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    width: 60,
  },
  backButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.accent.primary,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: Spacing.sm,
    backgroundColor: Colors.background.secondary,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: Colors.accent.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#FF6B6B',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  consentCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  consentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  granteeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  granteeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  granteeInitial: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  granteeName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  granteeId: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  purposeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  purposeTag: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginRight: 6,
    marginBottom: 4,
  },
  purposeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  consentTerms: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  consentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  metaText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  revokeButton: {
    backgroundColor: Colors.status.error + '20',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.status.error,
  },
  revokeButtonText: {
    color: Colors.status.error,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  requestCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFE66D',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  requestIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE66D20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  requestEmoji: {
    fontSize: 20,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  requestTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  requestTerms: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  requestPurposes: {
    marginBottom: Spacing.sm,
  },
  requestLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  expiresText: {
    fontSize: Typography.fontSize.xs,
    color: '#FFE66D',
    marginBottom: Spacing.md,
  },
  requestActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  denyButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  denyButtonText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  approveButton: {
    flex: 2,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  modalBody: {
    padding: Spacing.md,
  },
  detailRow: {
    marginBottom: Spacing.md,
  },
  detailLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
});

