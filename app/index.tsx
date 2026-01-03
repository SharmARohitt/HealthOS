/**
 * Root Index - Entry point that routes based on authentication state
 */

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/theme';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.accent.primary} />
      </View>
    );
  }

  // Redirect based on authentication state
  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Route to role-based home screen
  switch (user.role) {
    case 'patient':
      return <Redirect href="/(patient)/timeline" />;
    case 'doctor':
      return <Redirect href="/(doctor)/dashboard" />;
    case 'lab':
      return <Redirect href="/(lab)/dashboard" />;
    case 'insurer':
      return <Redirect href="/(insurer)/dashboard" />;
    case 'auditor':
      return <Redirect href="/(auditor)/dashboard" />;
    default:
      return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
});

