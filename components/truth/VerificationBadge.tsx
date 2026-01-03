/**
 * VerificationBadge - Displays verification status with authority
 * Trust-first visual indicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VerificationStatus } from '@/types/medical';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

const statusConfig = {
  [VerificationStatus.VERIFIED]: {
    label: 'Verified',
    color: Colors.status.verified,
    icon: '✓',
  },
  [VerificationStatus.DISPUTED]: {
    label: 'Disputed',
    color: Colors.status.disputed,
    icon: '⚠',
  },
  [VerificationStatus.PENDING]: {
    label: 'Pending',
    color: Colors.status.pending,
    icon: '○',
  },
  [VerificationStatus.SUPERSEDED]: {
    label: 'Superseded',
    color: Colors.status.superseded,
    icon: '↻',
  },
};

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const config = statusConfig[status];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${config.color}15`, // 15 = ~8% opacity
          borderColor: config.color,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          paddingVertical: isSmall ? Spacing.xs : Spacing.sm,
        },
      ]}
    >
      <Text
        style={[
          styles.icon,
          {
            color: config.color,
            fontSize: isSmall ? Typography.fontSize.sm : Typography.fontSize.base,
          },
        ]}
      >
        {config.icon}
      </Text>
      <Text
        style={[
          styles.label,
          {
            color: config.color,
            fontSize: isSmall ? Typography.fontSize.xs : Typography.fontSize.sm,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  icon: {
    fontWeight: Typography.fontWeight.bold,
  },
  label: {
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

