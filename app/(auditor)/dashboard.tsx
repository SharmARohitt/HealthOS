/**
 * Auditor Dashboard Screen
 * Complete dashboard for compliance auditors with audit logs, verification stats, and analytics
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

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorRole: string;
  target: string;
  timestamp: string;
  status: 'verified' | 'flagged' | 'pending';
  blockHash?: string;
}

interface ComplianceMetric {
  name: string;
  value: number;
  target: number;
  status: 'passing' | 'warning' | 'failing';
}

export default function AuditorDashboardScreen() {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'flagged' | 'verified'>('all');

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const stats = [
    { label: 'Total Records', value: '2,847', icon: '📊', color: '#4ECDC4' },
    { label: 'Verified Today', value: '156', icon: '✅', color: '#96CEB4' },
    { label: 'Flagged Issues', value: '12', icon: '⚠️', color: '#FFE66D' },
    { label: 'Compliance Rate', value: '99.2%', icon: '🎯', color: '#45B7D1' },
  ];

  const auditLogs: AuditLog[] = [
    { id: '1', action: 'Medical Fact Created', actor: 'Dr. Sarah Smith', actorRole: 'Doctor', target: 'Patient: John Doe', timestamp: '2 min ago', status: 'verified', blockHash: '0x7f3a...' },
    { id: '2', action: 'Consent Granted', actor: 'Jane Smith', actorRole: 'Patient', target: 'HealthFirst Insurance', timestamp: '15 min ago', status: 'verified', blockHash: '0x8c4b...' },
    { id: '3', action: 'Lab Result Uploaded', actor: 'MediLab Tech #12', actorRole: 'Lab', target: 'Patient: Robert Johnson', timestamp: '32 min ago', status: 'pending' },
    { id: '4', action: 'Record Access Attempt', actor: 'Unknown Agent', actorRole: 'Insurer', target: 'Patient: Emily Davis', timestamp: '1 hour ago', status: 'flagged' },
    { id: '5', action: 'Prescription Issued', actor: 'Dr. Michael Chen', actorRole: 'Doctor', target: 'Patient: Alice Cooper', timestamp: '2 hours ago', status: 'verified', blockHash: '0x9d5c...' },
    { id: '6', action: 'Consent Revoked', actor: 'Bob Williams', actorRole: 'Patient', target: 'BlueCross Insurer', timestamp: '3 hours ago', status: 'verified', blockHash: '0xa6e7...' },
  ];

  const complianceMetrics: ComplianceMetric[] = [
    { name: 'Data Integrity', value: 99.8, target: 99.5, status: 'passing' },
    { name: 'Consent Compliance', value: 98.5, target: 98.0, status: 'passing' },
    { name: 'Access Control', value: 97.2, target: 98.0, status: 'warning' },
    { name: 'Audit Trail Coverage', value: 100, target: 100, status: 'passing' },
    { name: 'Encryption Standards', value: 100, target: 100, status: 'passing' },
  ];

  const activityByRole = [
    { role: 'Doctors', count: 1245, color: '#4ECDC4' },
    { role: 'Patients', count: 892, color: '#45B7D1' },
    { role: 'Labs', count: 456, color: '#FFE66D' },
    { role: 'Insurers', count: 234, color: '#96CEB4' },
    { role: 'Other', count: 20, color: '#DDA0DD' },
  ];

  const getStatusColor = (status: AuditLog['status']) => {
    const colors = { verified: '#4ECDC4', flagged: '#FF6B6B', pending: '#FFE66D' };
    return colors[status];
  };

  const getStatusIcon = (status: AuditLog['status']) => {
    const icons = { verified: '✓', flagged: '⚠', pending: '⏳' };
    return icons[status];
  };

  const getComplianceColor = (status: ComplianceMetric['status']) => {
    const colors = { passing: '#4ECDC4', warning: '#FFE66D', failing: '#FF6B6B' };
    return colors[status];
  };

  const filteredLogs = selectedFilter === 'all' 
    ? auditLogs 
    : auditLogs.filter(log => log.status === selectedFilter);

  const totalActivity = activityByRole.reduce((sum, item) => sum + item.count, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Audit Console</Text>
          <Text style={styles.userName}>{user?.name || 'Auditor'}</Text>
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
              <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
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
              <Text style={styles.actionEmoji}>🔍</Text>
              <Text style={styles.actionText}>Run Audit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#45B7D1' }]}>
              <Text style={styles.actionEmoji}>📄</Text>
              <Text style={styles.actionText}>Export Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#96CEB4' }]}>
              <Text style={styles.actionEmoji}>⚙️</Text>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Compliance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compliance Metrics</Text>
          <View style={styles.metricsCard}>
            {complianceMetrics.map((metric, index) => (
              <View key={index} style={styles.metricRow}>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricName}>{metric.name}</Text>
                  <View style={[styles.metricBadge, { backgroundColor: `${getComplianceColor(metric.status)}20` }]}>
                    <Text style={[styles.metricBadgeText, { color: getComplianceColor(metric.status) }]}>
                      {metric.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.metricBarContainer}>
                  <View style={[styles.metricBar, { width: `${metric.value}%`, backgroundColor: getComplianceColor(metric.status) }]} />
                  <View style={[styles.metricTarget, { left: `${metric.target}%` }]} />
                </View>
                <Text style={styles.metricValue}>{metric.value}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Activity by Role */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity by Role</Text>
          <View style={styles.activityCard}>
            <View style={styles.pieChartPlaceholder}>
              {activityByRole.map((item, index) => (
                <View key={index} style={styles.activityRow}>
                  <View style={[styles.activityDot, { backgroundColor: item.color }]} />
                  <Text style={styles.activityRole}>{item.role}</Text>
                  <Text style={styles.activityCount}>{item.count}</Text>
                  <Text style={styles.activityPercent}>
                    {((item.count / totalActivity) * 100).toFixed(1)}%
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.activityTotal}>
              <Text style={styles.totalLabel}>Total Actions Today</Text>
              <Text style={styles.totalValue}>{totalActivity.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Audit Logs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Audit Logs</Text>
          </View>
          
          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            {(['all', 'verified', 'flagged'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterTab, selectedFilter === filter && styles.activeFilterTab]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredLogs.map((log) => (
            <TouchableOpacity key={log.id} style={styles.logCard}>
              <View style={[styles.logStatus, { backgroundColor: getStatusColor(log.status) }]}>
                <Text style={styles.logStatusIcon}>{getStatusIcon(log.status)}</Text>
              </View>
              <View style={styles.logInfo}>
                <Text style={styles.logAction}>{log.action}</Text>
                <Text style={styles.logActor}>{log.actor} ({log.actorRole})</Text>
                <Text style={styles.logTarget}>{log.target}</Text>
                <View style={styles.logMeta}>
                  <Text style={styles.logTime}>{log.timestamp}</Text>
                  {log.blockHash && (
                    <Text style={styles.logHash}>🔗 {log.blockHash}</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity style={styles.inspectButton}>
                <Text style={styles.inspectButtonText}>→</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Blockchain Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Blockchain Status</Text>
          <View style={styles.blockchainCard}>
            <View style={styles.chainRow}>
              <View style={styles.chainItem}>
                <Text style={styles.chainIcon}>⛓️</Text>
                <Text style={styles.chainValue}>Block #1,847,293</Text>
                <Text style={styles.chainLabel}>Latest Block</Text>
              </View>
              <View style={styles.chainItem}>
                <Text style={styles.chainIcon}>⏱️</Text>
                <Text style={styles.chainValue}>2.3s</Text>
                <Text style={styles.chainLabel}>Avg. Block Time</Text>
              </View>
              <View style={styles.chainItem}>
                <Text style={styles.chainIcon}>🔒</Text>
                <Text style={styles.chainValue}>256-bit</Text>
                <Text style={styles.chainLabel}>Encryption</Text>
              </View>
            </View>
            <View style={styles.chainStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusLabel}>Network Status: Healthy</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  metricsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  metricRow: {
    marginBottom: Spacing.md,
  },
  metricInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  metricName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  metricBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  metricBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  metricBarContainer: {
    height: 8,
    backgroundColor: Colors.border.light,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  metricBar: {
    height: '100%',
    borderRadius: 4,
  },
  metricTarget: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.text.primary,
  },
  metricValue: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'right',
    marginTop: 4,
  },
  activityCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  pieChartPlaceholder: {
    marginBottom: Spacing.md,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  activityRole: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  activityCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginRight: Spacing.md,
    width: 50,
    textAlign: 'right',
  },
  activityPercent: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.primary,
    fontWeight: Typography.fontWeight.medium,
    width: 50,
    textAlign: 'right',
  },
  activityTotal: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  totalValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    backgroundColor: Colors.background.secondary,
  },
  activeFilterTab: {
    backgroundColor: Colors.accent.primary,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  logStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logStatusIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  logInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  logAction: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  logActor: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  logTarget: {
    fontSize: Typography.fontSize.xs,
    color: Colors.accent.primary,
    marginTop: 2,
  },
  logMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  logTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  logHash: {
    fontSize: Typography.fontSize.xs,
    color: '#4ECDC4',
    marginLeft: Spacing.sm,
  },
  inspectButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inspectButtonText: {
    fontSize: 16,
    color: Colors.accent.primary,
    fontWeight: 'bold',
  },
  blockchainCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  chainRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  chainItem: {
    alignItems: 'center',
  },
  chainIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  chainValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  chainLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  chainStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
    marginRight: Spacing.sm,
  },
  statusLabel: {
    fontSize: Typography.fontSize.sm,
    color: '#4ECDC4',
    fontWeight: Typography.fontWeight.medium,
  },
});

