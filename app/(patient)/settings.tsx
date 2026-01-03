/**
 * Patient Settings Screen - App settings and preferences
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoLock, setAutoLock] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. All your data will be permanently deleted. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Account Deletion', 'Please contact support to delete your account.')
        }
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    hasSwitch, 
    value, 
    onValueChange, 
    onPress,
    danger 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    hasSwitch?: boolean;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    onPress?: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={hasSwitch}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {hasSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.border.medium, true: Colors.accent.primary }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Text style={styles.settingArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="👤"
              title="Profile"
              subtitle="Edit your personal information"
              onPress={() => router.push('/(patient)/profile')}
            />
            <SettingItem
              icon="🔐"
              title="Privacy & Consent"
              subtitle="Manage data access permissions"
              onPress={() => router.push('/(patient)/consent')}
            />
            <SettingItem
              icon="🔑"
              title="Change Password"
              subtitle="Update your password"
              onPress={() => Alert.alert('Change Password', 'Password change feature coming soon.')}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="🔔"
              title="Push Notifications"
              subtitle="Receive alerts on your device"
              hasSwitch
              value={notifications}
              onValueChange={setNotifications}
            />
            <SettingItem
              icon="📧"
              title="Email Alerts"
              subtitle="Get important updates via email"
              hasSwitch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="👆"
              title="Biometric Authentication"
              subtitle="Use fingerprint or Face ID"
              hasSwitch
              value={biometricAuth}
              onValueChange={setBiometricAuth}
            />
            <SettingItem
              icon="⏱️"
              title="Auto-Lock"
              subtitle="Lock app after inactivity"
              hasSwitch
              value={autoLock}
              onValueChange={setAutoLock}
            />
            <SettingItem
              icon="🛡️"
              title="Two-Factor Authentication"
              subtitle="Add extra security"
              onPress={() => Alert.alert('2FA', 'Two-factor authentication coming soon.')}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="🌙"
              title="Dark Mode"
              subtitle="Use dark theme"
              hasSwitch
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <SettingItem
              icon="📊"
              title="Anonymous Data Sharing"
              subtitle="Help improve HealthOS"
              hasSwitch
              value={dataSharing}
              onValueChange={setDataSharing}
            />
            <SettingItem
              icon="🌐"
              title="Language"
              subtitle="English (US)"
              onPress={() => Alert.alert('Language', 'Language selection coming soon.')}
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="📥"
              title="Export My Data"
              subtitle="Download all your records"
              onPress={() => Alert.alert('Export', 'Your data export will be prepared and sent to your email.')}
            />
            <SettingItem
              icon="🗑️"
              title="Clear Cache"
              subtitle="Free up storage space"
              onPress={() => Alert.alert('Cache Cleared', 'Local cache has been cleared.')}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="ℹ️"
              title="About HealthOS"
              subtitle="Version 1.0.0"
              onPress={() => Alert.alert('HealthOS', 'Version 1.0.0\n\nBlockchain-powered health records.\n\n© 2025 HealthOS')}
            />
            <SettingItem
              icon="📜"
              title="Terms of Service"
              onPress={() => Alert.alert('Terms', 'Terms of service would open here.')}
            />
            <SettingItem
              icon="🔒"
              title="Privacy Policy"
              onPress={() => Alert.alert('Privacy', 'Privacy policy would open here.')}
            />
            <SettingItem
              icon="❓"
              title="Help & Support"
              onPress={() => Alert.alert('Support', 'Contact support@healthos.com for assistance.')}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="🚪"
              title="Log Out"
              onPress={handleLogout}
              danger
            />
            <SettingItem
              icon="⚠️"
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
              danger
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    width: 60,
  },
  backButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.accent.primary,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: Spacing.md,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dangerTitle: {
    color: Colors.status.error,
  },
  sectionContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  settingTitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  settingSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  settingArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  dangerText: {
    color: Colors.status.error,
  },
});
