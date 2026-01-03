/**
 * Patient Profile Screen - Complete profile with editing and health summary
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { createMockHealthStats, createMockFacts, createMockConsents } from '@/services/mockData';

export default function PatientProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState('+1 (555) 123-4567');
  const [editedAddress, setEditedAddress] = useState('123 Health Street, Medical City, MC 12345');
  const [editedEmergencyContact, setEditedEmergencyContact] = useState('Jane Doe - +1 (555) 987-6543');

  const healthStats = createMockHealthStats();
  const facts = user ? createMockFacts(user.id) : [];
  const consents = user ? createMockConsents(user.id) : [];
  const activeConsents = consents.filter(c => c.status === 'active');

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const handleSaveProfile = () => {
    // In production, save to API
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleExportRecords = (format: string) => {
    setShowExportModal(false);
    Alert.alert(
      'Export Started',
      `Your medical records are being prepared for download in ${format} format. You will receive a notification when ready.`
    );
  };

  const profileStats = [
    { label: 'Medical Facts', value: facts.length.toString(), icon: '📋' },
    { label: 'Active Consents', value: activeConsents.length.toString(), icon: '🔐' },
    { label: 'Health Score', value: '85/100', icon: '💪' },
    { label: 'Last Checkup', value: 'Jan 2', icon: '📅' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editButton}>{isEditing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar & Name Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'P'}</Text>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Your Name"
              placeholderTextColor={Colors.text.tertiary}
            />
          ) : (
            <Text style={styles.userName}>{user?.name || 'Patient'}</Text>
          )}
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>
              {user?.verified ? '✓ Verified Identity' : '⏳ Pending Verification'}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          {profileStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedPhone}
                  onChangeText={setEditedPhone}
                  placeholder="Phone number"
                  placeholderTextColor={Colors.text.tertiary}
                />
              ) : (
                <Text style={styles.infoValue}>{editedPhone}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, { flex: 1 }]}
                  value={editedAddress}
                  onChangeText={setEditedAddress}
                  placeholder="Address"
                  placeholderTextColor={Colors.text.tertiary}
                  multiline
                />
              ) : (
                <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]}>{editedAddress}</Text>
              )}
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Emergency Contact</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedEmergencyContact}
                  onChangeText={setEditedEmergencyContact}
                  placeholder="Emergency contact"
                  placeholderTextColor={Colors.text.tertiary}
                />
              ) : (
                <Text style={styles.infoValue}>{editedEmergencyContact}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Health Metrics Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Metrics</Text>
          <View style={styles.infoCard}>
            {healthStats.slice(0, 4).map((stat, index) => (
              <View key={stat.id} style={[styles.infoRow, index === 3 && { borderBottomWidth: 0 }]}>
                <View style={styles.metricLabel}>
                  <Text style={styles.metricIcon}>{stat.icon}</Text>
                  <Text style={styles.infoLabel}>{stat.label}</Text>
                </View>
                <View style={styles.metricValue}>
                  <Text style={[styles.infoValue, { color: stat.status === 'warning' ? '#FFE66D' : '#4ECDC4' }]}>
                    {stat.value} {stat.unit}
                  </Text>
                  {stat.trend && (
                    <Text style={styles.trendText}>
                      {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Security</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🔐</Text>
              <Text style={styles.menuText}>Change Password</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📱</Text>
              <Text style={styles.menuText}>Two-Factor Authentication</Text>
              <View style={styles.enabledBadge}>
                <Text style={styles.enabledText}>Enabled</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={styles.menuText}>Notification Settings</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowExportModal(true)}>
              <Text style={styles.menuIcon}>📥</Text>
              <Text style={styles.menuText}>Export Medical Records</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.menuIcon}>🗑️</Text>
              <Text style={[styles.menuText, { color: Colors.status.error }]}>Delete Account</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button (when editing) */}
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>HealthOS v1.0.0 • Blockchain Verified</Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Export Modal */}
      <Modal visible={showExportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Export Medical Records</Text>
            <Text style={styles.modalSubtitle}>Choose export format</Text>
            <TouchableOpacity style={styles.exportOption} onPress={() => handleExportRecords('PDF')}>
              <Text style={styles.exportIcon}>📄</Text>
              <View style={styles.exportInfo}>
                <Text style={styles.exportTitle}>PDF Document</Text>
                <Text style={styles.exportDesc}>Human-readable format with all details</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportOption} onPress={() => handleExportRecords('JSON')}>
              <Text style={styles.exportIcon}>📋</Text>
              <View style={styles.exportInfo}>
                <Text style={styles.exportTitle}>JSON (FHIR)</Text>
                <Text style={styles.exportDesc}>Machine-readable healthcare standard</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportOption} onPress={() => handleExportRecords('Blockchain')}>
              <Text style={styles.exportIcon}>🔗</Text>
              <View style={styles.exportInfo}>
                <Text style={styles.exportTitle}>Blockchain Proof</Text>
                <Text style={styles.exportDesc}>Cryptographic verification bundle</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowExportModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: Spacing.xs,
  },
  backButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.accent.primary,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  editButton: {
    fontSize: Typography.fontSize.base,
    color: Colors.accent.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: Typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  nameInput: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent.primary,
    paddingBottom: 4,
  },
  verifiedBadge: {
    backgroundColor: '#4ECDC420',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  verifiedText: {
    color: '#4ECDC4',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  infoLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  infoValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  infoInput: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent.primary,
    paddingBottom: 2,
    minWidth: 150,
  },
  metricLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: Typography.fontSize.base,
    marginLeft: Spacing.xs,
    color: Colors.text.secondary,
  },
  menuCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  enabledBadge: {
    backgroundColor: '#4ECDC420',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  enabledText: {
    color: '#4ECDC4',
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  logoutButton: {
    backgroundColor: Colors.status.error + '20',
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.status.error,
  },
  logoutButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.status.error,
  },
  versionText: {
    textAlign: 'center',
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  exportIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  exportInfo: {
    flex: 1,
  },
  exportTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  exportDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  cancelButton: {
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
  },
});
