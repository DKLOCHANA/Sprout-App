/**
 * ProgressBarAnalytics Component
 * Compact milestone tracking progress visualization
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '@core/theme';
import { ProgressBarData } from '@core/data/onboarding';

interface ProgressBarAnalyticsProps {
  data: ProgressBarData;
}

export function ProgressBarAnalytics({ data }: ProgressBarAnalyticsProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animatedWidth, {
        toValue: data.percentage,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [data.percentage]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: animatedOpacity }]}>
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.percentageText}>{data.percentage}%</Text>
          <Text style={styles.label}>{data.label}</Text>
        </View>
        
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[styles.progressFill, { width: widthInterpolation }]} 
          />
        </View>
      </View>

      <View style={styles.milestonesSection}>
        {data.milestones.map((milestone) => (
          <View key={milestone.name} style={styles.milestoneItem}>
            <View 
              style={[
                styles.checkCircle,
                milestone.tracked && styles.checkCircleActive
              ]}
            >
              {milestone.tracked && (
                <MaterialCommunityIcons name="check" size={14} color={colors.surface} />
              )}
            </View>
            <Text 
              style={[
                styles.milestoneName,
                milestone.tracked && styles.milestoneNameActive
              ]}
            >
              {milestone.name}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    justifyContent: 'center',
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  percentageText: {
    ...typography.h2,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
  milestonesSection: {
    gap: spacing.xs,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  checkCircleActive: {
    backgroundColor: colors.success,
  },
  milestoneName: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  milestoneNameActive: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
