/**
 * SleepChart Component
 * Bar chart showing 7-day sleep history with WHO recommendations
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@/core/theme';
import { useSleep } from '../hooks';

interface SleepChartProps {
  onLogSleep?: () => void;
}

const CHART_HEIGHT = 120;
const BAR_WIDTH = 32;
const MAX_HOURS = 18;

export function SleepChart({ onLogSleep }: SleepChartProps) {
  const { recentSleepEntries, averageSleep, recommendation, formatSleepDuration } = useSleep();

  // Generate last 7 days data
  const chartData = useMemo(() => {
    const days: { date: string; dayLabel: string; hours: number | null }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2);

      const entry = recentSleepEntries.find((e) => e.date === dateString);
      const hours = entry ? entry.sleepHours + entry.sleepMinutes / 60 : null;

      days.push({ date: dateString, dayLabel, hours });
    }

    return days;
  }, [recentSleepEntries]);

  // Calculate bar heights
  const getBarHeight = (hours: number | null) => {
    if (hours === null) return 0;
    return Math.min((hours / MAX_HOURS) * CHART_HEIGHT, CHART_HEIGHT);
  };

  // Get bar color based on recommendation
  const getBarColor = (hours: number | null) => {
    if (hours === null) return colors.surfaceTertiary;
    if (!recommendation) return colors.secondary;

    const { min, max } = recommendation.sleepHours;
    if (hours < min) return colors.sleep; // Below - lighter
    if (hours > max) return colors.secondaryLight; // Above
    return colors.secondary; // Optimal
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Sleep Quality</Text>
          {averageSleep && (
            <Text style={styles.average}>
              Average {formatSleepDuration(averageSleep.hours, averageSleep.minutes)}
            </Text>
          )}
        </View>
        
        {/* Log Sleep Button */}
        <TouchableOpacity
          style={styles.logButton}
          onPress={onLogSleep}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color={colors.textOnPrimary} />
          <Text style={styles.logButtonText}>Log Sleep</Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {chartData.map((day, index) => (
          <View key={day.date} style={styles.barColumn}>
            <View style={styles.barContainer}>
              {day.hours !== null ? (
                <View
                  style={[
                    styles.bar,
                    {
                      height: getBarHeight(day.hours),
                      backgroundColor: getBarColor(day.hours),
                    },
                  ]}
                />
              ) : (
                <View style={styles.emptyBar} />
              )}
            </View>
            <Text style={styles.dayLabel}>{day.dayLabel}</Text>
          </View>
        ))}
      </View>

      {/* Recommendation Note */}
      {recommendation && (
        <Text style={styles.recommendationNote}>
          WHO recommends {recommendation.sleepHours.min}-{recommendation.sleepHours.max}h for this age
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  average: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    gap: spacing.xs,
  },
  logButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 24, // Extra space for labels
    paddingBottom: 20,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: radii.sm,
    minHeight: 4,
  },
  emptyBar: {
    width: BAR_WIDTH,
    height: 4,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 2,
  },
  dayLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  recommendationNote: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
