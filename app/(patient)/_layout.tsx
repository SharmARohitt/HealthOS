/**
 * Patient Layout - Tab navigation for patient role with stack for detail screens
 */

import { Tabs } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function PatientLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background.secondary,
          borderTopColor: Colors.border.medium,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.accent.primary,
        tabBarInactiveTintColor: Colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
        }}
      />
      <Tabs.Screen
        name="consent"
        options={{
          title: 'Consent',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
      <Tabs.Screen
        name="fact-detail"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

