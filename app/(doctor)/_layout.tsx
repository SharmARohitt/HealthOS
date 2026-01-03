/**
 * Doctor Layout
 */

import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function DoctorLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background.primary,
        },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="create-fact" />
    </Stack>
  );
}

