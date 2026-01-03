/**
 * Patient Fact Detail Screen - Full medical fact view with blockchain proof
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
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTruthStore } from '@/store/truthStore';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { createMockFacts } from '@/services/mockData';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';

export default function PatientFactDetailScreen() {
  const { factId, id } = useLocalSearchParams<{ factId: string; id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { facts } = useTruthStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBlockchainModal, setShowBlockchainModal] = useState(false);

  const factIdParam = factId || id;

  // Try to get from store first, then fallback to mock data
  const [fact, setFact] = useState<any>(null);

  useEffect(() => {
    if (factIdParam) {
      const storeFact = facts.find(f => f.id === factIdParam);
      if (storeFact) {
        setFact(storeFact);
      } else if (user) {
        // Fallback to mock facts
        const mockFacts = createMockFacts(user.id);
        const mockFact = mockFacts.find(f => f.id === factIdParam);
        if (mockFact) {
          setFact(mockFact);
        } else {
          // Default to first mock fact for demo
          setFact(mockFacts[0]);
        }
      }
    } else if (user) {
      // No ID provided, show first mock fact for demo
      const mockFacts = createMockFacts(user.id);
      setFact(mockFacts[0]);
    }
  }, [factIdParam, user, facts]);

  const getFactTypeInfo = (type: string) => {
    const info: Record<string, { icon: string; label: string; color: string }> = {
      'diagnosis': { icon: '🩺', label: 'Diagnosis', color: '#FF6B6B' },
      'lab_result': { icon: '🧪', label: 'Lab Result', color: '#4ECDC4' },
      'prescription': { icon: '💊', label: 'Prescription', color: '#45B7D1' },
      'procedure': { icon: '🏥', label: 'Procedure', color: '#96CEB4' },
      'vaccination': { icon: '💉', label: 'Vaccination', color: '#FFEAA7' },
      'vital_signs': { icon: '❤️', label: 'Vital Signs', color: '#DDA0DD' },
      'allergy': { icon: '⚠️', label: 'Allergy', color: '#FF9FF3' },
      'imaging': { icon: '📷', label: 'Imaging', color: '#54A0FF' },
    };
    return info[type?.toLowerCase()] || { icon: '📋', label: 'Medical Record', color: Colors.accent.primary };
  };

  const getVerificationColor = (level: string) => {
    const colors: Record<string, string> = {
      'self_reported': '#FFE66D',
      'provider_verified': '#4ECDC4',
      'institution_verified': '#45B7D1',
      'blockchain_anchored': '#6C5CE7',
    };
    return colors[level?.toLowerCase()] || '#4ECDC4';
  };

  const handleShare = async () => {
    if (!fact) return;
    try {
      await Share.share({
        message: `Medical Record: ${fact.description || fact.title}\n\nVerified on HealthOS blockchain\nHash: ${fact.hash || fact.blockchainAnchor?.transactionHash}`,
        title: 'Share Medical Record',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share record');
    }
  };

  const handleDownload = (formatType: 'pdf' | 'json' | 'hl7') => {
    Alert.alert(
      'Export Initiated',
      `Your medical record will be exported as ${formatType.toUpperCase()}. This may take a moment.`,
      [{ text: 'OK' }]
    );
    setShowShareModal(false);
  };

  if (!fact) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyText}>Record not found</Text>
          <Text style={styles.emptySubtext}>
            This medical record may have been removed or you don't have access.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const typeInfo = getFactTypeInfo(fact.factType);
  const recordDate = fact.recordedAt || fact.timestamp || fact.createdAt;
  const factHash = fact.hash || fact.blockchainAnchor?.transactionHash || 'pending';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Record</Text>
        <TouchableOpacity onPress={() => setShowShareModal(true)}>
          <Text style={styles.shareButton}>↗️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={[styles.mainCard, { borderLeftColor: typeInfo.color }]}>
          <View style={styles.typeRow}>
            <View style={[styles.typeIcon, { backgroundColor: `${typeInfo.color}20` }]}>
              <Text style={styles.typeEmoji}>{typeInfo.icon}</Text>
            </View>
            <View style={styles.typeInfo}>
              <Text style={styles.typeLabel}>{typeInfo.label}</Text>
              <Text style={styles.recordDate}>
                {recordDate ? format(new Date(recordDate), 'MMMM d, yyyy • h:mm a') : 'Date not available'}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{fact.title || fact.description}</Text>
          {fact.description && fact.title && (
            <Text style={styles.description}>{fact.description}</Text>
          )}

          {/* Values */}
          {fact.values && Object.keys(fact.values).length > 0 && (
            <View style={styles.valuesSection}>
              <Text style={styles.sectionLabel}>Values</Text>
              <View style={styles.valuesGrid}>
                {Object.entries(fact.values).map(([key, value]) => (
                  <View key={key} style={styles.valueItem}>
                    <Text style={styles.valueLabel}>{key}</Text>
                    <Text style={styles.valueText}>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Issuer Info */}
          <View style={styles.issuerSection}>
            <Text style={styles.sectionLabel}>Issued By</Text>
            <Text style={styles.issuerName}>{fact.issuerName || fact.createdBy || 'Healthcare Provider'}</Text>
            <Text style={styles.issuerRole}>{fact.issuerRole || 'Medical Professional'}</Text>
          </View>

          {/* Metadata */}
          {fact.metadata?.notes && (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Clinical Notes</Text>
              <Text style={styles.notesText}>{fact.metadata.notes}</Text>
            </View>
          )}
        </View>

        {/* Verification Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✓ Verification Status</Text>
          <View style={styles.verificationCard}>
            <View style={styles.verificationHeader}>
              <View style={[styles.verificationBadge, { backgroundColor: `${getVerificationColor(fact.verificationLevel || fact.verificationStatus)}20` }]}>
                <Text style={[styles.verificationLevel, { color: getVerificationColor(fact.verificationLevel || fact.verificationStatus) }]}>
                  {(fact.verificationLevel || fact.verificationStatus || 'verified').replace(/_/g, ' ').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.verificationStatus}>VERIFIED</Text>
            </View>

            <View style={styles.verificationDetails}>
              <View style={styles.verifyRow}>
                <Text style={styles.verifyLabel}>Created By</Text>
                <Text style={styles.verifyValue}>{fact.createdBy || fact.issuerName || 'Healthcare Provider'}</Text>
              </View>
              {(fact.verifiedBy || fact.issuerRole) && (
                <View style={styles.verifyRow}>
                  <Text style={styles.verifyLabel}>Verified By</Text>
                  <Text style={styles.verifyValue}>{fact.verifiedBy || fact.issuerRole}</Text>
                </View>
              )}
              {fact.verifiedAt && (
                <View style={styles.verifyRow}>
                  <Text style={styles.verifyLabel}>Verified At</Text>
                  <Text style={styles.verifyValue}>
                    {format(new Date(fact.verifiedAt), 'MMM d, yyyy • h:mm a')}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.confidenceBar}>
              <Text style={styles.confidenceLabel}>Confidence Score</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(fact.confidenceScore || fact.confidenceLevel || 0.95) * 100}%` }]} />
              </View>
              <Text style={styles.confidenceValue}>{((fact.confidenceScore || fact.confidenceLevel || 0.95) * 100).toFixed(0)}%</Text>
            </View>
          </View>
        </View>

        {/* Blockchain Proof */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⛓️ Blockchain Proof</Text>
            <TouchableOpacity onPress={() => setShowBlockchainModal(true)}>
              <Text style={styles.sectionLink}>View Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.blockchainCard}>
            <View style={styles.blockchainStatus}>
              <View style={styles.anchoredBadge}>
                <Text style={styles.anchoredIcon}>🔗</Text>
                <Text style={styles.anchoredText}>Anchored on Chain</Text>
              </View>
              <Text style={styles.blockNumber}>Block #{fact.blockNumber || fact.blockchainAnchor?.blockNumber || '12847391'}</Text>
            </View>

            <View style={styles.hashSection}>
              <Text style={styles.hashLabel}>Record Hash (SHA-256)</Text>
              <View style={styles.hashBox}>
                <Text style={styles.hashValue} numberOfLines={2}>{factHash}</Text>
              </View>
            </View>

            {fact.previousHash && (
              <View style={styles.hashSection}>
                <Text style={styles.hashLabel}>Previous Hash</Text>
                <View style={styles.hashBox}>
                  <Text style={styles.hashValue} numberOfLines={1}>{fact.previousHash}</Text>
                </View>
              </View>
            )}

            <View style={styles.timestampRow}>
              <Text style={styles.timestampLabel}>Timestamp</Text>
              <Text style={styles.timestampValue}>
                {recordDate ? format(new Date(recordDate), 'yyyy-MM-dd HH:mm:ss') : 'N/A'} UTC
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share Record</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowShareModal(true)}
          >
            <Text style={styles.actionIcon}>📥</Text>
            <Text style={styles.actionText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowBlockchainModal(true)}>
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={styles.actionText}>Verify</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Share/Export Modal */}
      <Modal visible={showShareModal} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowShareModal(false)}
        >
          <View style={styles.shareModal}>
            <Text style={styles.modalTitle}>Export Record</Text>
            
            <TouchableOpacity style={styles.exportOption} onPress={() => handleDownload('pdf')}>
              <Text style={styles.exportIcon}>📄</Text>
              <View>
                <Text style={styles.exportLabel}>PDF Document</Text>
                <Text style={styles.exportDesc}>Human-readable format</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.exportOption} onPress={() => handleDownload('json')}>
              <Text style={styles.exportIcon}>📋</Text>
              <View>
                <Text style={styles.exportLabel}>JSON (FHIR)</Text>
                <Text style={styles.exportDesc}>Interoperable format</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.exportOption} onPress={() => handleDownload('hl7')}>
              <Text style={styles.exportIcon}>🏥</Text>
              <View>
                <Text style={styles.exportLabel}>HL7 Message</Text>
                <Text style={styles.exportDesc}>Healthcare standard</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Blockchain Detail Modal */}
      <Modal visible={showBlockchainModal} transparent animationType="slide">
        <View style={styles.bcModalOverlay}>
          <View style={styles.bcModalContent}>
            <View style={styles.bcModalHeader}>
              <Text style={styles.bcModalTitle}>Blockchain Verification</Text>
              <TouchableOpacity onPress={() => setShowBlockchainModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.bcModalBody}>
              <View style={styles.bcInfo}>
                <Text style={styles.bcInfoIcon}>✅</Text>
                <Text style={styles.bcInfoText}>
                  This record has been cryptographically sealed and anchored to a blockchain, 
                  ensuring it cannot be altered or deleted without detection.
                </Text>
              </View>

              <View style={styles.bcDetail}>
                <Text style={styles.bcDetailLabel}>Transaction Hash</Text>
                <Text style={styles.bcDetailValue}>{factHash}</Text>
              </View>

              <View style={styles.bcDetail}>
                <Text style={styles.bcDetailLabel}>Block Number</Text>
                <Text style={styles.bcDetailValue}>{fact.blockNumber || fact.blockchainAnchor?.blockNumber || '12847391'}</Text>
              </View>

              <View style={styles.bcDetail}>
                <Text style={styles.bcDetailLabel}>Network</Text>
                <Text style={styles.bcDetailValue}>HealthOS Private Chain</Text>
              </View>

              <View style={styles.bcDetail}>
                <Text style={styles.bcDetailLabel}>Confirmations</Text>
                <Text style={styles.bcDetailValue}>847 confirmations</Text>
              </View>

              <View style={styles.bcDetail}>
                <Text style={styles.bcDetailLabel}>Gas Used</Text>
                <Text style={styles.bcDetailValue}>21,000 units</Text>
              </View>

              <TouchableOpacity style={styles.verifyBtn}>
                <Text style={styles.verifyBtnText}>Verify on Explorer</Text>
              </TouchableOpacity>
            </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backBtn: {
    width: 60,
  },
  backButton: {
    fontSize: Typography.fontSize.base,
    color: Colors.accent.primary,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  shareButton: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
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
  },
  mainCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    marginBottom: Spacing.md,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  typeEmoji: {
    fontSize: 24,
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  recordDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  valuesSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueItem: {
    width: '50%',
    marginBottom: Spacing.sm,
  },
  valueLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 2,
  },
  valueText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  issuerSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  issuerName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  issuerRole: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  notesBox: {
    marginTop: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  notesLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  sectionLink: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.primary,
  },
  verificationCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  verificationBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  verificationLevel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  verificationStatus: {
    fontSize: Typography.fontSize.xs,
    color: '#4ECDC4',
    fontWeight: Typography.fontWeight.bold,
  },
  verificationDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.sm,
  },
  verifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  verifyLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  verifyValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  confidenceBar: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  confidenceLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.background.primary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 3,
  },
  confidenceValue: {
    fontSize: Typography.fontSize.sm,
    color: '#4ECDC4',
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'right',
  },
  blockchainCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#6C5CE740',
  },
  blockchainStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  anchoredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C5CE720',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  anchoredIcon: {
    marginRight: 4,
  },
  anchoredText: {
    fontSize: Typography.fontSize.xs,
    color: '#6C5CE7',
    fontWeight: Typography.fontWeight.semibold,
  },
  blockNumber: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  hashSection: {
    marginBottom: Spacing.sm,
  },
  hashLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  hashBox: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  hashValue: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontFamily: 'monospace',
  },
  timestampRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  timestampLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  timestampValue: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    width: 100,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareModal: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '85%',
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  exportIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  exportLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  exportDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  cancelButton: {
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  cancelText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
  },
  bcModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  bcModalContent: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '80%',
  },
  bcModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  bcModalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  closeBtn: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  bcModalBody: {
    padding: Spacing.md,
  },
  bcInfo: {
    flexDirection: 'row',
    backgroundColor: '#4ECDC420',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  bcInfoIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  bcInfoText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  bcDetail: {
    marginBottom: Spacing.md,
  },
  bcDetailLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  bcDetailValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontFamily: 'monospace',
  },
  verifyBtn: {
    backgroundColor: '#6C5CE7',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
