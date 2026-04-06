/**
 * Calendar Analytics Component
 * Compact tracking days vs doctor visit gaps comparison
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '@core/theme';
import { CalendarData } from '@core/data/onboarding';

interface CalendarProps {
  data: CalendarData;
}

export function Calendar({ data }: CalendarProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Generate compact calendar grid (90 days = 13 weeks)
  const totalDays = data.trackingDays;
  const weeks = Math.ceil(totalDays / 7);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{data.trackingDays}</Text>
          <Text style={styles.statLabel}>Days Tracked</Text>
        </View>
        <Text style={styles.vsText}>vs</Text>
        <View style={[styles.statCard, styles.statCardGap]}>
          <Text style={[styles.statNumber, styles.statNumberGap]}>{data.gapDays}</Text>
          <Text style={styles.statLabel}>Doctor Visit</Text>
        </View>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarGrid}>
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const dayNumber = weekIndex * 7 + dayIndex + 1;
                if (dayNumber > totalDays) return null;
                return (
                  <View key={dayIndex} style={[styles.dayCell, styles.dayCellActive]} />
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Comparison */}
      <View style={styles.comparisonCard}>
        <MaterialCommunityIcons name="lightbulb-outline" size={18} color={colors.warning} />
        <Text style={styles.comparisonText}>{data.comparison}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.successDim,
    padding: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  statCardGap: {
    backgroundColor: colors.errorDim,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.success,
    lineHeight: 40,
  },
  statNumberGap: {
    color: colors.error,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  vsText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontWeight: '600',
    paddingHorizontal: spacing.sm,
  },
  calendarContainer: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  calendarGrid: {
    gap: 2,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 2,
  },
  dayCell: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: colors.border,
  },
  dayCellActive: {
    backgroundColor: colors.success,
  },
  comparisonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningDim,
    padding: spacing.sm,
    borderRadius: radii.md,
    gap: spacing.xs,
  },
  comparisonText: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
  },
});
