/**
 * Root Index - Entry point that routes based on authentication state
 */

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/theme';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace('/(auth)/login');
      return;
    }

    // Route to role-based home screen
    switch (user.role) {
      case 'patient':
        router.replace('/(patient)/timeline');
        break;
      case 'doctor':
        router.replace('/(doctor)/dashboard');
        break;
      case 'lab':
        router.replace('/(lab)/dashboard');
        break;
      case 'insurer':
        router.replace('/(insurer)/dashboard');
        break;
      case 'auditor':
        router.replace('/(auditor)/dashboard');
        break;
      default:
        router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.accent.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
});

