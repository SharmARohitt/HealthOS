/**
 * Fact Detail Screen - View detailed information about a medical fact
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTruthStore } from '@/store/truthStore';
import { VerificationBadge } from '@/components/truth/VerificationBadge';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { formatDate } from '@/utils/format';
import type { MedicalFact } from '@/types/medical';

export default function FactDetailScreen() {
  const router = useRouter();
  const { factId } = useLocalSearchParams<{ factId: string }>();
  const { facts } = useTruthStore();
  const [fact, setFact] = useState<MedicalFact | null>(null);

  useEffect(() => {
    if (factId) {
      const foundFact = facts.find((f) => f.id === factId);
      setFact(foundFact || null);
    }
  }, [factId, facts]);

  if (!fact) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Fact not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fact Details</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Verification Status */}
        <View style={styles.section}>
          <VerificationBadge status={fact.verificationStatus} />
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{fact.title}</Text>
        </View>

        {/* Description */}
        {fact.description && (
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{fact.description}</Text>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.section}>
          <Text style={styles.label}>Fact Type</Text>
          <Text style={styles.value}>{fact.factType}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Issuer</Text>
          <Text style={styles.value}>{fact.issuerName}</Text>
          <Text style={styles.subValue}>{fact.issuerRole}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Timestamp</Text>
          <Text style={styles.value}>{formatDate(fact.timestamp, 'PPpp')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Confidence Level</Text>
          <Text style={styles.value}>{fact.confidenceLevel}</Text>
        </View>

        {fact.version > 1 && (
          <View style={styles.section}>
            <Text style={styles.label}>Version</Text>
            <Text style={styles.value}>v{fact.version}</Text>
          </View>
        )}

        {/* Blockchain Anchor */}
        {fact.blockchainAnchor && (
          <View style={styles.section}>
            <Text style={styles.label}>Blockchain Anchor</Text>
            <View style={styles.hashContainer}>
              <Text style={styles.hashValue}>
                {fact.blockchainAnchor.transactionHash}
              </Text>
              <Text style={styles.subValue}>
                Block: {fact.blockchainAnchor.blockNumber} •{' '}
                {formatDate(fact.blockchainAnchor.timestamp)}
              </Text>
            </View>
          </View>
        )}

        {/* Hash */}
        <View style={styles.section}>
          <Text style={styles.label}>Hash</Text>
          <Text style={[styles.value, styles.hashValue]}>{fact.hash}</Text>
        </View>
      </ScrollView>
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
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.medium,
  },
  backButton: {
    fontSize: Typography.fontSize.base,
    color: Colors.accent.primary,
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.medium,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
  },
  subValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  hashContainer: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  hashValue: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  emptyText: {
    fontSize: Typography.fontSize.xl,
    color: Colors.text.secondary,
  },
});

