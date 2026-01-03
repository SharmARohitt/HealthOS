/**
 * MedicalTimeline - Git-like vertical timeline of medical facts
 * Immutable sequence visualization with version history
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MedicalFact } from '@/types/medical';
import { TruthCard } from '../truth/TruthCard';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { format } from 'date-fns';

interface MedicalTimelineProps {
  facts: MedicalFact[];
  onFactPress?: (fact: MedicalFact) => void;
  patientId?: string;
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({
  facts,
  onFactPress,
  patientId,
}) => {
  // Group facts by date for timeline visualization
  const groupedFacts = facts.reduce((acc, fact) => {
    const dateKey = format(fact.timestamp, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(fact);
    return acc;
  }, {} as Record<string, MedicalFact[]>);

  const dateGroups = Object.entries(groupedFacts).sort(
    ([dateA], [dateB]) => dateB.localeCompare(dateA)
  );

  if (facts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No medical facts recorded</Text>
        <Text style={styles.emptySubtext}>
          Medical facts will appear here as they are created and anchored
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {dateGroups.map(([dateKey, dateFacts], groupIndex) => {
        const displayDate = format(new Date(dateKey), 'MMMM d, yyyy');
        const isFirstGroup = groupIndex === 0;

        return (
          <View key={dateKey} style={styles.dateGroup}>
            {/* Date Header */}
            <View style={styles.dateHeader}>
              <View style={styles.dateLine} />
              <Text style={styles.dateText}>{displayDate}</Text>
              <View style={styles.dateLine} />
            </View>

            {/* Timeline Items */}
            <View style={styles.timelineContainer}>
              {dateFacts.map((fact, factIndex) => {
                const isLastFact = factIndex === dateFacts.length - 1;
                const isLastGroup = groupIndex === dateGroups.length - 1;

                return (
                  <View key={fact.id} style={styles.timelineItem}>
                    {/* Timeline Line */}
                    {!(isLastFact && isLastGroup) && (
                      <View style={styles.timelineLine} />
                    )}

                    {/* Timeline Dot */}
                    <View style={styles.timelineDot} />

                    {/* Fact Card */}
                    <View style={styles.factContainer}>
                      <TruthCard fact={fact} onPress={onFactPress} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  emptyText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  dateGroup: {
    marginBottom: Spacing.xl,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.medium,
  },
  dateText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.tertiary,
    marginHorizontal: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timelineContainer: {
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.md,
  },
  timelineItem: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: 24,
    width: 2,
    height: '100%',
    backgroundColor: Colors.border.medium,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 20,
    width: 16,
    height: 16,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accent.primary,
    borderWidth: 3,
    borderColor: Colors.background.primary,
  },
  factContainer: {
    marginLeft: Spacing.xl,
  },
});

