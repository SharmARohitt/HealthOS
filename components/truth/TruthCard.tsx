/**
 * TruthCard - Displays a Medical Fact Object with authority and clarity
 * The atomic unit of medical truth visualization
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MedicalFact, FactType } from '@/types/medical';
import { VerificationBadge } from './VerificationBadge';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { format } from 'date-fns';

interface TruthCardProps {
  fact: MedicalFact;
  onPress?: (fact: MedicalFact) => void;
  compact?: boolean;
}

const factTypeLabels: Record<FactType, string> = {
  [FactType.DIAGNOSIS]: 'Diagnosis',
  [FactType.LAB_RESULT]: 'Lab Result',
  [FactType.PRESCRIPTION]: 'Prescription',
  [FactType.PROCEDURE]: 'Procedure',
  [FactType.CONSENT]: 'Consent',
  [FactType.CORRECTION]: 'Correction',
  [FactType.VITAL_SIGN]: 'Vital Sign',
  [FactType.IMAGING]: 'Imaging',
};

export const TruthCard: React.FC<TruthCardProps> = ({
  fact,
  onPress,
  compact = false,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(fact);
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, compact && styles.cardCompact]}
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.factType}>{factTypeLabels[fact.factType]}</Text>
          {fact.version > 1 && (
            <Text style={styles.version}>v{fact.version}</Text>
          )}
        </View>
        <VerificationBadge status={fact.verificationStatus} size="sm" />
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {fact.title}
      </Text>

      {/* Description */}
      {!compact && fact.description && (
        <Text style={styles.description} numberOfLines={3}>
          {fact.description}
        </Text>
      )}

      {/* Metadata */}
      <View style={styles.metadata}>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Issuer:</Text>
          <Text style={styles.metadataValue}>{fact.issuerName}</Text>
        </View>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Anchored:</Text>
          <Text style={styles.metadataValue}>
            {format(fact.timestamp, 'MMM d, yyyy • HH:mm')}
          </Text>
        </View>
        {fact.blockchainAnchor && (
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Blockchain:</Text>
            <Text style={styles.metadataValue} numberOfLines={1}>
              {fact.blockchainAnchor.transactionHash.slice(0, 12)}...
            </Text>
          </View>
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  cardCompact: {
    padding: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  factType: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  version: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontFamily: Typography.fontFamily.mono,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.lg,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
    marginBottom: Spacing.md,
  },
  metadata: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.medium,
    paddingTop: Spacing.sm,
    gap: Spacing.xs,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metadataLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.medium,
    minWidth: 80,
  },
  metadataValue: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily.mono,
    flex: 1,
  },
});

