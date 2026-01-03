/**
 * Doctor Dashboard Screen
 * Complete dashboard with patient management, appointments, and stats
 */

import React from 'react';
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

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  lastVisit: string;
  status: 'stable' | 'follow-up' | 'critical';
}

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

export default function DoctorDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const stats = [
    { label: 'Patients Today', value: '12', icon: '👥', color: '#4ECDC4' },
    { label: 'Pending Reviews', value: '5', icon: '📋', color: '#FFE66D' },
    { label: 'Facts Created', value: '48', icon: '📝', color: '#96CEB4' },
    { label: 'This Week', value: '23', icon: '📅', color: '#DDA0DD' },
  ];

  const recentPatients: Patient[] = [
    { id: '1', name: 'John Doe', age: 45, condition: 'Type 2 Diabetes', lastVisit: 'Today', status: 'stable' },
    { id: '2', name: 'Jane Smith', age: 32, condition: 'Hypertension', lastVisit: 'Yesterday', status: 'follow-up' },
    { id: '3', name: 'Robert Johnson', age: 58, condition: 'Cardiac Arrhythmia', lastVisit: '2 days ago', status: 'critical' },
    { id: '4', name: 'Emily Davis', age: 28, condition: 'Seasonal Allergies', lastVisit: '3 days ago', status: 'stable' },
  ];

  const todayAppointments: Appointment[] = [
    { id: '1', patientName: 'Michael Brown', time: '9:00 AM', type: 'Checkup', status: 'completed' },
    { id: '2', patientName: 'Sarah Wilson', time: '10:30 AM', type: 'Follow-up', status: 'in-progress' },
    { id: '3', patientName: 'David Lee', time: '2:00 PM', type: 'Consultation', status: 'upcoming' },
    { id: '4', patientName: 'Lisa Anderson', time: '3:30 PM', type: 'New Patient', status: 'upcoming' },
  ];

  const getStatusColor = (status: Patient['status']) => {
    const colors = { stable: '#4ECDC4', 'follow-up': '#FFE66D', critical: '#FF6B6B' };
    return colors[status];
  };

  const getAppointmentStatusColor = (status: Appointment['status']) => {
    const colors = { completed: '#4ECDC4', 'in-progress': '#45B7D1', upcoming: '#96CEB4' };
    return colors[status];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Doctor'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { borderTopColor: stat.color }]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.primaryAction, { backgroundColor: '#4ECDC4' }]}
              onPress={() => router.push('/(doctor)/create-fact')}
            >
              <Text style={styles.actionEmoji}>📝</Text>
              <Text style={styles.primaryActionText}>Create Medical Fact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryAction, { backgroundColor: '#45B7D1' }]}>
              <Text style={styles.actionEmoji}>🔍</Text>
              <Text style={styles.secondaryActionText}>Search Patient</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {todayAppointments.map((apt) => (
            <TouchableOpacity key={apt.id} style={styles.appointmentCard}>
              <View style={styles.appointmentTime}>
                <Text style={styles.timeText}>{apt.time}</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.patientName}>{apt.patientName}</Text>
                <Text style={styles.appointmentType}>{apt.type}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getAppointmentStatusColor(apt.status)}20` }]}>
                <Text style={[styles.statusText, { color: getAppointmentStatusColor(apt.status) }]}>
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1).replace('-', ' ')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Patients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Patients</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentPatients.map((patient) => (
            <TouchableOpacity key={patient.id} style={styles.patientCard}>
              <View style={styles.patientAvatar}>
                <Text style={styles.avatarText}>{patient.name.charAt(0)}</Text>
              </View>
              <View style={styles.patientInfo}>
                <Text style={styles.patientNameText}>{patient.name}</Text>
                <Text style={styles.patientCondition}>{patient.condition}</Text>
                <Text style={styles.patientMeta}>Age: {patient.age} • Last visit: {patient.lastVisit}</Text>
              </View>
              <View style={[styles.patientStatus, { backgroundColor: getStatusColor(patient.status) }]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity Chart Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chartContainer}>
            <View style={styles.barChart}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const heights = [60, 80, 45, 90, 70, 30, 20];
                return (
                  <View key={day} style={styles.barColumn}>
                    <View style={[styles.bar, { height: heights[i], backgroundColor: i === 3 ? '#4ECDC4' : '#45B7D150' }]} />
                    <Text style={styles.barLabel}>{day}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.chartLegend}>
              <Text style={styles.legendText}>📊 Patients seen this week: 23</Text>
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
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  seeAllText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.primary,
    fontWeight: Typography.fontWeight.medium,
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
    borderTopWidth: 3,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize['3xl'],
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
    gap: Spacing.sm,
  },
  primaryAction: {
    flex: 2,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryAction: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 20,
    marginRight: Spacing.xs,
  },
  primaryActionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  secondaryActionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: '#FFFFFF',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  appointmentTime: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  timeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  patientName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  appointmentType: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  patientInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  patientNameText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  patientCondition: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  patientMeta: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  patientStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  chartContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: Spacing.md,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  barLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  chartLegend: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  legendText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

