/**
 * ConsentCard - Displays consent information with clarity and trust signals
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Consent, ConsentStatus, ConsentPurpose } from '@/types/consent';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { format } from 'date-fns';

interface ConsentCardProps {
  consent: Consent;
  onPress?: (consent: Consent) => void;
  onRevoke?: (consent: Consent) => void;
}

const purposeLabels: Record<ConsentPurpose, string> = {
  [ConsentPurpose.VIEW]: 'View',
  [ConsentPurpose.CREATE]: 'Create',
  [ConsentPurpose.MODIFY]: 'Modify',
  [ConsentPurpose.SHARE]: 'Share',
  [ConsentPurpose.RESEARCH]: 'Research',
  [ConsentPurpose.INSURANCE]: 'Insurance',
  [ConsentPurpose.LEGAL]: 'Legal',
};

const statusColors = {
  [ConsentStatus.ACTIVE]: Colors.status.verified,
  [ConsentStatus.REVOKED]: Colors.text.tertiary,
  [ConsentStatus.EXPIRED]: Colors.status.disputed,
  [ConsentStatus.PENDING]: Colors.status.pending,
};

export const ConsentCard: React.FC<ConsentCardProps> = ({
  consent,
  onPress,
  onRevoke,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const statusColor = statusColors[consent.status];
  const isActive = consent.status === ConsentStatus.ACTIVE;

  return (
    <Container
      style={styles.card}
      onPress={() => onPress?.(consent)}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: statusColor },
            ]}
          />
          <Text style={styles.statusText}>{consent.status.toUpperCase()}</Text>
        </View>
        {isActive && onRevoke && (
          <TouchableOpacity
            onPress={() => onRevoke(consent)}
            style={styles.revokeButton}
          >
            <Text style={styles.revokeButtonText}>Revoke</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Grantee Info */}
      <Text style={styles.grantee}>
        Granted to: <Text style={styles.granteeName}>{consent.granteeRole}</Text>
      </Text>

      {/* Purposes */}
      <View style={styles.purposes}>
        <Text style={styles.purposesLabel}>Purposes:</Text>
        <View style={styles.purposeTags}>
          {consent.purposes.map((purpose) => (
            <View key={purpose} style={styles.purposeTag}>
              <Text style={styles.purposeTagText}>
                {purposeLabels[purpose]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Terms */}
      <Text style={styles.terms} numberOfLines={2}>
        {consent.terms}
      </Text>

      {/* Dates */}
      <View style={styles.dates}>
        <Text style={styles.dateLabel}>
          Granted: {format(consent.grantedAt, 'MMM d, yyyy')}
        </Text>
        {consent.expiresAt && (
          <Text style={styles.dateLabel}>
            Expires: {format(consent.expiresAt, 'MMM d, yyyy')}
          </Text>
        )}
        {consent.revokedAt && (
          <Text style={styles.dateLabel}>
            Revoked: {format(consent.revokedAt, 'MMM d, yyyy')}
          </Text>
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
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: 0.5,
  },
  revokeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  revokeButtonText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.error,
    fontWeight: Typography.fontWeight.medium,
  },
  grantee: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  granteeName: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  purposes: {
    marginBottom: Spacing.sm,
  },
  purposesLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  purposeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  purposeTag: {
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  purposeTagText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  terms: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Spacing.sm,
  },
  dates: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.medium,
    paddingTop: Spacing.sm,
    gap: Spacing.xs,
  },
  dateLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontFamily: Typography.fontFamily.mono,
  },
});

