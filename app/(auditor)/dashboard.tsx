/**
 * Auditor Dashboard Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function AuditorDashboardScreen() {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Auditor Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Audit medical records and verify integrity
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>⚙️ Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Logged in as: {user?.name}</Text>
          <Text style={styles.userInfoEmail}>{user?.email}</Text>
        </View>
        <Text style={styles.placeholderText}>
          Auditor dashboard functionality coming soon
        </Text>
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
    padding: Spacing.md,
  },
  userInfo: {
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  userInfoText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  userInfoEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  placeholderText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing['2xl'],
  },
});

