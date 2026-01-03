/**
 * Patient Timeline Screen - Main home screen for patients
 * Displays health overview, timeline, appointments, and quick actions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface HealthStat {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: string;
}

interface TimelineEvent {
  id: string;
  type: 'diagnosis' | 'prescription' | 'lab' | 'procedure' | 'visit';
  title: string;
  provider: string;
  date: string;
  verified: boolean;
}

export default function PatientTimelineScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const healthStats: HealthStat[] = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', icon: '❤️' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', icon: '💓' },
    { label: 'Blood Sugar', value: '95', unit: 'mg/dL', status: 'normal', icon: '🩸' },
    { label: 'BMI', value: '23.5', unit: 'kg/m²', status: 'normal', icon: '⚖️' },
  ];

  const timelineEvents: TimelineEvent[] = [
    { id: '1', type: 'visit', title: 'Annual Checkup', provider: 'Dr. Sarah Smith', date: 'Jan 2, 2026', verified: true },
    { id: '2', type: 'lab', title: 'Complete Blood Count', provider: 'MediLab Diagnostics', date: 'Dec 28, 2025', verified: true },
    { id: '3', type: 'prescription', title: 'Vitamin D Supplement', provider: 'Dr. Sarah Smith', date: 'Dec 20, 2025', verified: true },
    { id: '4', type: 'diagnosis', title: 'Seasonal Allergies', provider: 'Dr. Michael Chen', date: 'Nov 15, 2025', verified: true },
    { id: '5', type: 'procedure', title: 'Dental Cleaning', provider: 'Dr. Emily Brown', date: 'Oct 5, 2025', verified: true },
  ];

  const upcomingAppointments = [
    { id: '1', title: 'Follow-up Checkup', provider: 'Dr. Sarah Smith', date: 'Jan 15, 2026', time: '10:00 AM' },
    { id: '2', title: 'Eye Examination', provider: 'Dr. James Wilson', date: 'Jan 22, 2026', time: '2:30 PM' },
  ];

  const getTypeColor = (type: TimelineEvent['type']) => {
    const colors = {
      diagnosis: '#FF6B6B',
      prescription: '#4ECDC4',
      lab: '#45B7D1',
      procedure: '#96CEB4',
      visit: '#DDA0DD',
    };
    return colors[type];
  };

  const getTypeIcon = (type: TimelineEvent['type']) => {
    const icons = {
      diagnosis: '🩺',
      prescription: '💊',
      lab: '🧪',
      procedure: '⚕️',
      visit: '🏥',
    };
    return icons[type];
  };

  const getStatusColor = (status: HealthStat['status']) => {
    const colors = {
      normal: '#4ECDC4',
      warning: '#FFE66D',
      critical: '#FF6B6B',
    };
    return colors[status];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>{user?.name || 'Patient'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Health Stats Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Overview</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
            {healthStats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { borderLeftColor: getStatusColor(stat.status) }]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statUnit}>{stat.unit}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {upcomingAppointments.map((apt) => (
            <TouchableOpacity key={apt.id} style={styles.appointmentCard}>
              <View style={styles.appointmentIcon}>
                <Text style={styles.appointmentEmoji}>📅</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentTitle}>{apt.title}</Text>
                <Text style={styles.appointmentProvider}>{apt.provider}</Text>
                <Text style={styles.appointmentTime}>{apt.date} • {apt.time}</Text>
              </View>
              <Text style={styles.appointmentArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Medical Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Timeline</Text>
          <View style={styles.timeline}>
            {timelineEvents.map((event, index) => (
              <TouchableOpacity key={event.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: getTypeColor(event.type) }]}>
                    <Text style={styles.timelineIcon}>{getTypeIcon(event.type)}</Text>
                  </View>
                  {index < timelineEvents.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTitle}>{event.title}</Text>
                    {event.verified && <Text style={styles.verifiedBadge}>✓ Verified</Text>}
                  </View>
                  <Text style={styles.timelineProvider}>{event.provider}</Text>
                  <Text style={styles.timelineDate}>{event.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📄</Text>
              <Text style={styles.actionLabel}>Download Records</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
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
  statIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
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
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.accent.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentEmoji: {
    fontSize: 24,
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  appointmentTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  appointmentProvider: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  appointmentTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.accent.primary,
    marginTop: 4,
  },
  appointmentArrow: {
    fontSize: 24,
    color: Colors.text.tertiary,
  },
  timeline: {
    marginLeft: Spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
  },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIcon: {
    fontSize: 16,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    flex: 1,
  },
  verifiedBadge: {
    fontSize: Typography.fontSize.xs,
    color: '#4ECDC4',
    fontWeight: Typography.fontWeight.medium,
  },
  timelineProvider: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  timelineDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: Colors.background.secondary,
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
    textAlign: 'center',
  },
});

