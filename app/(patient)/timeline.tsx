/**
 * Patient Timeline Screen - Main home screen for patients
 * Displays medical timeline with all facts
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useTruthStore } from '@/store/truthStore';
import { MedicalTimeline } from '@/components/timeline/MedicalTimeline';
import { Colors, Typography, Spacing } from '@/constants/theme';
import type { MedicalFact } from '@/types/medical';

export default function PatientTimelineScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { facts, setTimeline } = useTruthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  useEffect(() => {
    // In production, load timeline from API
    // For now, use mock data
    if (facts.length === 0 && user) {
      // Mock timeline data - in production, fetch from API
      const mockTimeline = {
        patientId: user.id,
        facts: [],
        timelineHash: 'mock_hash',
        lastUpdated: new Date(),
      };
      setTimeline(mockTimeline);
    }
  }, [user, facts.length, setTimeline]);

  const handleFactPress = (fact: MedicalFact) => {
    router.push({
      pathname: '/(patient)/fact-detail',
      params: { factId: fact.id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Medical Timeline</Text>
          <Text style={styles.headerSubtitle}>
            Your complete medical truth ledger
          </Text>
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.content}>
        <MedicalTimeline facts={facts} onFactPress={handleFactPress} />
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  logoutButton: {
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  logoutText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  content: {
    flex: 1,
  },
});

