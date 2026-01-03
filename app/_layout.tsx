/**
 * Root Layout - Expo Router entry point
 * Handles authentication state and routing
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const { checkAuth, logout } = useAuthStore();

  useEffect(() => {
    // Clear authentication on app start to force login
    logout().then(() => {
      checkAuth();
    });
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.background.primary} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background.primary,
          },
          animation: 'default',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(patient)" />
        <Stack.Screen name="(doctor)" />
        <Stack.Screen name="(lab)" />
        <Stack.Screen name="(insurer)" />
        <Stack.Screen name="(auditor)" />
      </Stack>
    </>
  );
}

