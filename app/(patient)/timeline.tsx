/**
 * Patient Timeline Screen - Main home screen for patients
 * Displays health overview, timeline, appointments, and quick actions
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { 
  createMockFacts, 
  createMockAppointments, 
  createMockHealthStats,
  createMockNotifications 
} from '@/services/mockData';
import { UserRole } from '@/types/user';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

export default function PatientTimelineScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Load mock data
  const facts = useMemo(() => user ? createMockFacts(user.id) : [], [user]);
  const appointments = useMemo(() => user ? createMockAppointments(user.id, UserRole.PATIENT) : [], [user]);
  const healthStats = useMemo(() => createMockHealthStats(), []);
  const notifications = useMemo(() => user ? createMockNotifications(user.id, UserRole.PATIENT) : [], [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filter timeline events
  const filteredFacts = useMemo(() => {
    let filtered = facts;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.title.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.issuerName.toLowerCase().includes(query)
      );
    }
    
    if (activeFilter) {
      filtered = filtered.filter(f => f.factType === activeFilter);
    }
    
    return filtered;
  }, [facts, searchQuery, activeFilter]);

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      diagnosis: '#FF6B6B',
      prescription: '#4ECDC4',
      lab_result: '#45B7D1',
      procedure: '#96CEB4',
      visit: '#DDA0DD',
      vaccination: '#FFEAA7',
      vital_signs: '#FF9FF3',
      allergy: '#FF9FF3',
      imaging: '#54A0FF',
    };
    return colors[type] || '#4ECDC4';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      diagnosis: '🩺',
      prescription: '💊',
      lab_result: '🧪',
      procedure: '⚕️',
      visit: '🏥',
      vaccination: '💉',
      vital_signs: '❤️',
      allergy: '⚠️',
      imaging: '📷',
    };
    return icons[type] || '📋';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      normal: '#4ECDC4',
      warning: '#FFE66D',
      critical: '#FF6B6B',
    };
    return colors[status] || '#4ECDC4';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const filterOptions = [
    { key: null, label: 'All' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'prescription', label: 'Rx' },
    { key: 'lab_result', label: 'Labs' },
    { key: 'procedure', label: 'Procedures' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>{user?.name || 'Patient'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.notificationBtn} 
            onPress={() => router.push('/(patient)/notifications')}
          >
            <Text style={styles.headerIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsBtn} 
            onPress={() => router.push('/(patient)/settings')}
          >
            <Text style={styles.headerIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search medical records..."
              placeholderTextColor={Colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearch}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Health Stats Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Overview</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
            {healthStats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { borderLeftColor: getStatusColor(stat.status) }]}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text style={[styles.trendIcon, { color: stat.trend === 'up' ? '#4ECDC4' : stat.trend === 'down' ? '#FF6B6B' : Colors.text.tertiary }]}>
                    {getTrendIcon(stat.trend || 'stable')}
                  </Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statUnit}>{stat.unit}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {upcomingAppointments.slice(0, 2).map((apt) => (
              <TouchableOpacity key={apt.id} style={styles.appointmentCard}>
                <View style={styles.appointmentIcon}>
                  <Text style={styles.appointmentEmoji}>📅</Text>
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentTitle}>{apt.type.charAt(0).toUpperCase() + apt.type.slice(1).replace('-', ' ')}</Text>
                  <Text style={styles.appointmentProvider}>{apt.doctorName}</Text>
                  <Text style={styles.appointmentTime}>
                    {format(apt.date, 'MMM d, yyyy')} • {apt.time}
                  </Text>
                </View>
                <Text style={styles.appointmentArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Filter Chips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical Timeline</Text>
            <Text style={styles.recordCount}>{filteredFacts.length} records</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key || 'all'}
                style={[
                  styles.filterChip,
                  activeFilter === option.key && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(option.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === option.key && styles.filterChipTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Medical Timeline */}
        <View style={styles.timelineSection}>
          {filteredFacts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No records found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search term' : 'Your medical records will appear here'}
              </Text>
            </View>
          ) : (
            <View style={styles.timeline}>
              {filteredFacts.map((fact, index) => (
                <TouchableOpacity 
                  key={fact.id} 
                  style={styles.timelineItem}
                  onPress={() => router.push({ pathname: '/(patient)/fact-detail', params: { factId: fact.id } })}
                >
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: getTypeColor(fact.factType) }]}>
                      <Text style={styles.timelineIcon}>{getTypeIcon(fact.factType)}</Text>
                    </View>
                    {index < filteredFacts.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineTitle} numberOfLines={1}>{fact.title}</Text>
                      {fact.verificationStatus === 'verified' && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.timelineProvider}>{fact.issuerName}</Text>
                    <Text style={styles.timelineDate}>
                      {format(fact.timestamp, 'MMM d, yyyy')}
                    </Text>
                    {fact.blockchainAnchor && (
                      <View style={styles.blockchainTag}>
                        <Text style={styles.blockchainText}>⛓️ On-chain</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.timelineArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(patient)/consent')}>
              <Text style={styles.actionIcon}>🔐</Text>
              <Text style={styles.actionLabel}>Manage Consent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(patient)/profile')}>
              <Text style={styles.actionIcon}>👤</Text>
              <Text style={styles.actionLabel}>My Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(patient)/fact-detail')}>
              <Text style={styles.actionIcon}>📄</Text>
              <Text style={styles.actionLabel}>View Records</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(patient)/notifications')}>
              <Text style={styles.actionIcon}>🔔</Text>
              <Text style={styles.actionLabel}>Notifications</Text>
            </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notificationBtn: {
    position: 'relative',
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
  },
  settingsBtn: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
  },
  headerIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF6B6B',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    padding: Spacing.md,
    paddingBottom: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  clearSearch: {
    fontSize: 16,
    color: Colors.text.tertiary,
    padding: Spacing.xs,
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
  recordCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginRight: Spacing.sm,
    width: 130,
    borderLeftWidth: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statIcon: {
    fontSize: 24,
  },
  trendIcon: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.bold,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  statUnit: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  appointmentCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  appointmentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#45B7D120',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  appointmentEmoji: {
    fontSize: 20,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  appointmentProvider: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  appointmentTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  appointmentArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  filterChipActive: {
    backgroundColor: Colors.accent.primary,
    borderColor: Colors.accent.primary,
  },
  filterChipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.medium,
  },
  timelineSection: {
    paddingHorizontal: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  timeline: {
    marginTop: Spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 50,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIcon: {
    fontSize: 18,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border.light,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginLeft: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#4ECDC420',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
  },
  verifiedText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: Typography.fontWeight.bold,
  },
  timelineProvider: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  timelineDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  blockchainTag: {
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: '#6C5CE720',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  blockchainText: {
    fontSize: 10,
    color: '#6C5CE7',
  },
  timelineArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
    alignSelf: 'center',
    marginLeft: Spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actionButton: {
    width: (width - Spacing.md * 3) / 2 - Spacing.sm / 2,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
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
    textAlign: 'center',
  },
});

