/**
 * Patient Consent Management Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { ConsentCard } from '@/components/consent/ConsentCard';
import { Colors, Typography, Spacing } from '@/constants/theme';
import type { Consent } from '@/types/consent';

export default function PatientConsentScreen() {
  const { user } = useAuthStore();
  const [consents, setConsents] = useState<Consent[]>([]);

  useEffect(() => {
    // In production, load consents from API
    // Mock data for now
    setConsents([]);
  }, [user]);

  const handleRevokeConsent = async (consent: Consent) => {
    // In production, call API to revoke consent
    console.log('Revoke consent:', consent.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consent Manager</Text>
        <Text style={styles.headerSubtitle}>
          Manage access to your medical data
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {consents.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No consents granted</Text>
            <Text style={styles.emptySubtext}>
              Consent requests will appear here when healthcare providers request
              access to your data
            </Text>
          </View>
        ) : (
          consents.map((consent) => (
            <ConsentCard
              key={consent.id}
              consent={consent}
              onRevoke={handleRevokeConsent}
            />
          ))
        )}
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
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.medium,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  empty: {
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
});

