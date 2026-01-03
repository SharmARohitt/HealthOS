/**
 * Login Screen - Role-based authentication
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/user';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { MOCK_USERS } from '@/services/mockUsers';

export default function LoginScreen() {
  const router = useRouter();
  const { login, logout } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.PATIENT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const roles = [
    { value: UserRole.PATIENT, label: 'Patient' },
    { value: UserRole.DOCTOR, label: 'Doctor' },
    { value: UserRole.LAB, label: 'Lab' },
    { value: UserRole.INSURER, label: 'Insurer' },
    { value: UserRole.AUDITOR, label: 'Auditor' },
  ];

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await login(email, password, selectedRole);
      
      // Navigate based on role
      switch (selectedRole) {
        case UserRole.PATIENT:
          router.replace('/(patient)/timeline');
          break;
        case UserRole.DOCTOR:
          router.replace('/(doctor)/dashboard');
          break;
        case UserRole.LAB:
          router.replace('/(lab)/dashboard');
          break;
        case UserRole.INSURER:
          router.replace('/(insurer)/dashboard');
          break;
        case UserRole.AUDITOR:
          router.replace('/(auditor)/dashboard');
          break;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid credentials. Please check your email, password, and selected role.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickFillCredentials = (role: UserRole) => {
    const mockUser = MOCK_USERS[role];
    setEmail(mockUser.email);
    setPassword(mockUser.password);
    setSelectedRole(role);
    setError('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>HealthOS</Text>
          <Text style={styles.subtitle}>The Medical Truth Layer</Text>
          <TouchableOpacity 
            style={styles.clearCacheButton}
            onPress={async () => {
              await logout();
              setError('');
              setEmail('');
              setPassword('');
            }}
          >
            <Text style={styles.clearCacheText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        {/* Role Selection */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Select Role</Text>
          <View style={styles.roleButtons}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  styles.roleButton,
                  selectedRole === role.value && styles.roleButtonActive,
                ]}
                onPress={() => setSelectedRole(role.value)}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === role.value && styles.roleButtonTextActive,
                  ]}
                >
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={Colors.text.tertiary}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Authenticating...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Login Helper */}
        <View style={styles.quickLoginContainer}>
          <Text style={styles.quickLoginLabel}>Quick Login (Dev Mode)</Text>
          <View style={styles.quickLoginButtons}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={styles.quickLoginButton}
                onPress={() => quickFillCredentials(role.value)}
              >
                <Text style={styles.quickLoginButtonText}>{role.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.quickLoginHint}>
            Tap to auto-fill credentials for each role
          </Text>
        </View>

        {/* Credentials Info */}
        <View style={styles.credentialsContainer}>
          <Text style={styles.credentialsTitle}>Test Credentials:</Text>
          {roles.map((role) => {
            const mockUser = MOCK_USERS[role.value];
            return (
              <Text key={role.value} style={styles.credentialsText}>
                {role.label}: {mockUser.email} / {mockUser.password}
              </Text>
            );
          })}
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          This is a demonstration interface. Authentication is simplified for
          development purposes.
        </Text>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  clearCacheButton: {
    marginTop: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  clearCacheText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textDecorationLine: 'underline',
  },
  roleContainer: {
    marginBottom: Spacing.xl,
  },
  roleLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  roleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.secondary,
  },
  roleButtonActive: {
    borderColor: Colors.accent.primary,
    backgroundColor: `${Colors.accent.primary}20`,
  },
  roleButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  roleButtonTextActive: {
    color: Colors.accent.primary,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  errorContainer: {
    backgroundColor: '#ff4444',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  input: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  loginButton: {
    backgroundColor: Colors.accent.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  quickLoginContainer: {
    marginBottom: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  quickLoginLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.primary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  quickLoginButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  quickLoginButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.accent.primary,
  },
  quickLoginButtonText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  quickLoginHint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  credentialsContainer: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: `${Colors.accent.primary}10`,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: `${Colors.accent.primary}30`,
  },
  credentialsTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  credentialsText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2,
  },
  infoText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
  },
});

