/**
 * Lab Dashboard Screen
 * Complete dashboard for lab technicians with test management and analytics
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

interface PendingTest {
  id: string;
  patientName: string;
  testType: string;
  priority: 'normal' | 'urgent' | 'stat';
  requestedBy: string;
  requestedAt: string;
}

interface CompletedResult {
  id: string;
  patientName: string;
  testType: string;
  status: 'normal' | 'abnormal' | 'critical';
  completedAt: string;
  verified: boolean;
}

export default function LabDashboardScreen() {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const stats = [
    { label: 'Pending Tests', value: '18', icon: '⏳', color: '#FFE66D' },
    { label: 'Completed Today', value: '42', icon: '✅', color: '#4ECDC4' },
    { label: 'Critical Results', value: '3', icon: '⚠️', color: '#FF6B6B' },
    { label: 'Avg. Turnaround', value: '2.4h', icon: '⏱️', color: '#45B7D1' },
  ];

  const pendingTests: PendingTest[] = [
    { id: '1', patientName: 'Alice Cooper', testType: 'Complete Blood Count', priority: 'stat', requestedBy: 'Dr. Smith', requestedAt: '10 min ago' },
    { id: '2', patientName: 'Bob Williams', testType: 'Lipid Panel', priority: 'urgent', requestedBy: 'Dr. Johnson', requestedAt: '25 min ago' },
    { id: '3', patientName: 'Carol Davis', testType: 'Thyroid Function', priority: 'normal', requestedBy: 'Dr. Chen', requestedAt: '1 hour ago' },
    { id: '4', patientName: 'David Miller', testType: 'Hemoglobin A1C', priority: 'normal', requestedBy: 'Dr. Brown', requestedAt: '2 hours ago' },
    { id: '5', patientName: 'Eva Martinez', testType: 'Urinalysis', priority: 'urgent', requestedBy: 'Dr. Wilson', requestedAt: '3 hours ago' },
  ];

  const completedResults: CompletedResult[] = [
    { id: '1', patientName: 'Frank Thomas', testType: 'Blood Glucose', status: 'abnormal', completedAt: '15 min ago', verified: true },
    { id: '2', patientName: 'Grace Lee', testType: 'Liver Function', status: 'normal', completedAt: '45 min ago', verified: true },
    { id: '3', patientName: 'Henry Kim', testType: 'Electrolyte Panel', status: 'critical', completedAt: '1 hour ago', verified: false },
    { id: '4', patientName: 'Ivy Chen', testType: 'Complete Blood Count', status: 'normal', completedAt: '2 hours ago', verified: true },
  ];

  const getPriorityColor = (priority: PendingTest['priority']) => {
    const colors = { normal: '#4ECDC4', urgent: '#FFE66D', stat: '#FF6B6B' };
    return colors[priority];
  };

  const getStatusColor = (status: CompletedResult['status']) => {
    const colors = { normal: '#4ECDC4', abnormal: '#FFE66D', critical: '#FF6B6B' };
    return colors[status];
  };

  const testTypeBreakdown = [
    { type: 'Blood Tests', count: 45, percentage: 40 },
    { type: 'Urine Tests', count: 23, percentage: 20 },
    { type: 'Imaging', count: 18, percentage: 16 },
    { type: 'Cultures', count: 15, percentage: 13 },
    { type: 'Other', count: 12, percentage: 11 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Lab Dashboard</Text>
          <Text style={styles.userName}>{user?.name || 'Lab Technician'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4ECDC420' }]}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionLabel}>Upload Results</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#45B7D120' }]}>
              <Text style={styles.actionIcon}>🔬</Text>
              <Text style={styles.actionLabel}>New Sample</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FFE66D20' }]}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionLabel}>Generate Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#DDA0DD20' }]}>
              <Text style={styles.actionIcon}>🏷️</Text>
              <Text style={styles.actionLabel}>Print Labels</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Test Queue Tabs */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
              onPress={() => setActiveTab('pending')}
            >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
                Pending ({pendingTests.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
              onPress={() => setActiveTab('completed')}
            >
              <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
                Completed ({completedResults.length})
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'pending' ? (
            <View>
              {pendingTests.map((test) => (
                <TouchableOpacity key={test.id} style={styles.testCard}>
                  <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(test.priority) }]} />
                  <View style={styles.testInfo}>
                    <View style={styles.testHeader}>
                      <Text style={styles.testPatient}>{test.patientName}</Text>
                      <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(test.priority)}20` }]}>
                        <Text style={[styles.priorityText, { color: getPriorityColor(test.priority) }]}>
                          {test.priority.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.testType}>{test.testType}</Text>
                    <Text style={styles.testMeta}>Requested by {test.requestedBy} • {test.requestedAt}</Text>
                  </View>
                  <TouchableOpacity style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View>
              {completedResults.map((result) => (
                <TouchableOpacity key={result.id} style={styles.testCard}>
                  <View style={[styles.priorityIndicator, { backgroundColor: getStatusColor(result.status) }]} />
                  <View style={styles.testInfo}>
                    <View style={styles.testHeader}>
                      <Text style={styles.testPatient}>{result.patientName}</Text>
                      <View style={[styles.priorityBadge, { backgroundColor: `${getStatusColor(result.status)}20` }]}>
                        <Text style={[styles.priorityText, { color: getStatusColor(result.status) }]}>
                          {result.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.testType}>{result.testType}</Text>
                    <View style={styles.resultMeta}>
                      <Text style={styles.testMeta}>{result.completedAt}</Text>
                      {result.verified && <Text style={styles.verifiedBadge}>✓ Verified on Chain</Text>}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Test Type Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Test Breakdown</Text>
          <View style={styles.analyticsCard}>
            {testTypeBreakdown.map((item, index) => (
              <View key={index} style={styles.breakdownRow}>
                <View style={styles.breakdownLabel}>
                  <Text style={styles.breakdownType}>{item.type}</Text>
                  <Text style={styles.breakdownCount}>{item.count} tests</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${item.percentage}%` }]} />
                </View>
                <Text style={styles.breakdownPercentage}>{item.percentage}%</Text>
              </View>
            ))}
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
  statCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginRight: Spacing.sm,
    width: 120,
    borderLeftWidth: 3,
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
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  actionLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
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
  testCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  testInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testPatient: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  priorityText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  testType: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  testMeta: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedBadge: {
    fontSize: Typography.fontSize.xs,
    color: '#4ECDC4',
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Spacing.sm,
  },
  startButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  analyticsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  breakdownLabel: {
    width: 100,
  },
  breakdownType: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  breakdownCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border.light,
    borderRadius: 4,
    marginHorizontal: Spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  breakdownPercentage: {
    width: 40,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'right',
    fontWeight: Typography.fontWeight.medium,
  },
});

