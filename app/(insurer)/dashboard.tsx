/**
 * Insurer Dashboard Screen
 * Complete dashboard for insurance agents with claims, consent, and analytics
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface Claim {
  id: string;
  patientName: string;
  claimType: string;
  amount: string;
  status: 'pending' | 'approved' | 'denied' | 'review';
  submittedAt: string;
  consentStatus: 'granted' | 'pending' | 'expired';
}

interface ConsentRequest {
  id: string;
  patientName: string;
  requestType: string;
  requestedAt: string;
  expiresIn: string;
  status: 'pending' | 'granted' | 'denied';
}

export default function InsurerDashboardScreen() {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'claims' | 'consent'>('claims');

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const stats = [
    { label: 'Active Claims', value: '24', icon: '📋', color: '#45B7D1' },
    { label: 'Pending Approval', value: '8', icon: '⏳', color: '#FFE66D' },
    { label: 'Approved Today', value: '12', icon: '✅', color: '#4ECDC4' },
    { label: 'Total Value', value: '$48K', icon: '💰', color: '#96CEB4' },
  ];

  const claims: Claim[] = [
    { id: '1', patientName: 'John Doe', claimType: 'Hospital Stay', amount: '$12,500', status: 'pending', submittedAt: '2 hours ago', consentStatus: 'granted' },
    { id: '2', patientName: 'Jane Smith', claimType: 'Surgery', amount: '$28,000', status: 'review', submittedAt: '5 hours ago', consentStatus: 'granted' },
    { id: '3', patientName: 'Robert Johnson', claimType: 'Lab Tests', amount: '$850', status: 'approved', submittedAt: '1 day ago', consentStatus: 'granted' },
    { id: '4', patientName: 'Emily Davis', claimType: 'Prescription', amount: '$320', status: 'approved', submittedAt: '2 days ago', consentStatus: 'granted' },
    { id: '5', patientName: 'Michael Brown', claimType: 'Emergency', amount: '$5,200', status: 'denied', submittedAt: '3 days ago', consentStatus: 'expired' },
  ];

  const consentRequests: ConsentRequest[] = [
    { id: '1', patientName: 'Alice Cooper', requestType: 'Full Medical History', requestedAt: '10 min ago', expiresIn: '23h 50m', status: 'pending' },
    { id: '2', patientName: 'Bob Williams', requestType: 'Lab Results Only', requestedAt: '1 hour ago', expiresIn: '22h 0m', status: 'pending' },
    { id: '3', patientName: 'Carol Davis', requestType: 'Treatment Records', requestedAt: '3 hours ago', expiresIn: '20h 0m', status: 'granted' },
    { id: '4', patientName: 'David Miller', requestType: 'Prescription History', requestedAt: '1 day ago', expiresIn: 'Expired', status: 'denied' },
  ];

  const getStatusColor = (status: Claim['status']) => {
    const colors = { pending: '#FFE66D', approved: '#4ECDC4', denied: '#FF6B6B', review: '#45B7D1' };
    return colors[status];
  };

  const getConsentStatusColor = (status: ConsentRequest['status']) => {
    const colors = { pending: '#FFE66D', granted: '#4ECDC4', denied: '#FF6B6B' };
    return colors[status];
  };

  const claimsByCategory = [
    { category: 'Hospital', amount: 45000, percentage: 35 },
    { category: 'Surgery', amount: 32000, percentage: 25 },
    { category: 'Lab Tests', amount: 18000, percentage: 14 },
    { category: 'Prescriptions', amount: 15000, percentage: 12 },
    { category: 'Emergency', amount: 12000, percentage: 9 },
    { category: 'Other', amount: 6000, percentage: 5 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Insurance Portal</Text>
          <Text style={styles.userName}>{user?.name || 'Agent'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { borderBottomColor: stat.color }]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4ECDC4' }]}>
              <Text style={styles.actionEmoji}>📝</Text>
              <Text style={styles.actionText}>New Claim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#45B7D1' }]}>
              <Text style={styles.actionEmoji}>🔐</Text>
              <Text style={styles.actionText}>Request Access</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#96CEB4' }]}>
              <Text style={styles.actionEmoji}>📊</Text>
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'claims' && styles.activeTab]}
              onPress={() => setActiveTab('claims')}
            >
              <Text style={[styles.tabText, activeTab === 'claims' && styles.activeTabText]}>
                Claims ({claims.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'consent' && styles.activeTab]}
              onPress={() => setActiveTab('consent')}
            >
              <Text style={[styles.tabText, activeTab === 'consent' && styles.activeTabText]}>
                Consent ({consentRequests.length})
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'claims' ? (
            <View>
              {claims.map((claim) => (
                <TouchableOpacity key={claim.id} style={styles.claimCard}>
                  <View style={styles.claimHeader}>
                    <Text style={styles.claimPatient}>{claim.patientName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(claim.status)}20` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(claim.status) }]}>
                        {claim.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.claimType}>{claim.claimType}</Text>
                  <View style={styles.claimDetails}>
                    <Text style={styles.claimAmount}>{claim.amount}</Text>
                    <Text style={styles.claimMeta}>• {claim.submittedAt}</Text>
                  </View>
                  <View style={styles.consentIndicator}>
                    <Text style={[styles.consentText, { color: claim.consentStatus === 'granted' ? '#4ECDC4' : '#FF6B6B' }]}>
                      {claim.consentStatus === 'granted' ? '🔓 Consent Granted' : '🔒 ' + claim.consentStatus.charAt(0).toUpperCase() + claim.consentStatus.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View>
              {consentRequests.map((request) => (
                <TouchableOpacity key={request.id} style={styles.consentCard}>
                  <View style={styles.consentHeader}>
                    <Text style={styles.consentPatient}>{request.patientName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getConsentStatusColor(request.status)}20` }]}>
                      <Text style={[styles.statusText, { color: getConsentStatusColor(request.status) }]}>
                        {request.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.consentType}>{request.requestType}</Text>
                  <View style={styles.consentMeta}>
                    <Text style={styles.consentTime}>Requested {request.requestedAt}</Text>
                    <Text style={[styles.expiresText, { color: request.expiresIn === 'Expired' ? '#FF6B6B' : '#FFE66D' }]}>
                      ⏱️ {request.expiresIn}
                    </Text>
                  </View>
                  {request.status === 'pending' && (
                    <View style={styles.consentActions}>
                      <TouchableOpacity style={styles.remindButton}>
                        <Text style={styles.remindButtonText}>Send Reminder</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Claims by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Claims by Category</Text>
          <View style={styles.analyticsCard}>
            {claimsByCategory.map((item, index) => (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryLabel}>
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <Text style={styles.categoryAmount}>${(item.amount / 1000).toFixed(0)}K</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${item.percentage}%`, backgroundColor: index === 0 ? '#4ECDC4' : '#45B7D1' }]} />
                </View>
                <Text style={styles.percentageText}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Blockchain Verification Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Stats</Text>
          <View style={styles.verificationCard}>
            <View style={styles.verificationRow}>
              <View style={styles.verificationItem}>
                <Text style={styles.verificationIcon}>🔗</Text>
                <Text style={styles.verificationValue}>156</Text>
                <Text style={styles.verificationLabel}>On-Chain Records</Text>
              </View>
              <View style={styles.verificationItem}>
                <Text style={styles.verificationIcon}>✓</Text>
                <Text style={styles.verificationValue}>98%</Text>
                <Text style={styles.verificationLabel}>Verified Claims</Text>
              </View>
              <View style={styles.verificationItem}>
                <Text style={styles.verificationIcon}>⚡</Text>
                <Text style={styles.verificationValue}>1.2s</Text>
                <Text style={styles.verificationLabel}>Avg. Verify Time</Text>
              </View>
            </View>
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
  greeting: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  userName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  logoutButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
  },
  logoutText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderBottomWidth: 3,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  actionText: {
    fontSize: Typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.semibold,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  activeTab: {
    backgroundColor: Colors.accent.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  claimCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  claimPatient: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  claimType: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  claimDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  claimAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent.primary,
  },
  claimMeta: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginLeft: Spacing.sm,
  },
  consentIndicator: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  consentText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  consentCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  consentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consentPatient: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  consentType: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  consentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  consentTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  expiresText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  consentActions: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  remindButton: {
    backgroundColor: '#45B7D120',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  remindButtonText: {
    color: '#45B7D1',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  analyticsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryLabel: {
    width: 90,
  },
  categoryName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  categoryAmount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border.light,
    borderRadius: 4,
    marginHorizontal: Spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    width: 35,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'right',
    fontWeight: Typography.fontWeight.medium,
  },
  verificationCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  verificationItem: {
    alignItems: 'center',
  },
  verificationIcon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  verificationValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent.primary,
  },
  verificationLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 4,
    textAlign: 'center',
  },
});

