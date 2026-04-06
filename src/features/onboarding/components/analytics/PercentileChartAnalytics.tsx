/**
 * PercentileChartAnalytics Component
 * Shows growth percentile visualization
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '@core/theme';
import { PercentileChartData } from '@core/data/onboarding';

interface PercentileChartAnalyticsProps {
  data: PercentileChartData;
}

export function PercentileChartAnalytics({ data }: PercentileChartAnalyticsProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animatedWidth, {
        toValue: data.percentile,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [data.percentile]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: animatedOpacity }]}>
      <View style={styles.chartContainer}>
        <View style={styles.percentileLabels}>
          <Text style={styles.percentileLabel}>3rd</Text>
          <Text style={styles.percentileLabel}>50th</Text>
          <Text style={styles.percentileLabel}>97th</Text>
        </View>
        
        <View style={styles.chartTrack}>
          <Animated.View 
            style={[
              styles.chartFill,
              { width: widthInterpolation }
            ]} 
          />
          <View style={[styles.marker, { left: `${data.percentile}%` }]}>
            <View style={styles.markerDot} />
            <View style={styles.markerLine} />
          </View>
        </View>

        <View style={styles.zones}>
          <View style={[styles.zone, styles.zoneLow]} />
          <View style={[styles.zone, styles.zoneNormal]} />
          <View style={[styles.zone, styles.zoneHigh]} />
        </View>
      </View>

      <View style={styles.resultContainer}>
        <MaterialCommunityIcons 
          name="chart-line" 
          size={32} 
          color={colors.primary} 
        />
        <Text style={styles.percentileValue}>{data.label}</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>

      <View style={styles.badge}>
        <MaterialCommunityIcons 
          name="shield-check" 
          size={20} 
          color={colors.success} 
        />
        <Text style={styles.badgeText}>WHO & CDC Certified Data</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginVertical: spacing.md,
  },
  chartContainer: {
    marginBottom: spacing.lg,
  },
  percentileLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  percentileLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  chartTrack: {
    height: 20,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radii.full,
    position: 'relative',
    overflow: 'visible',
  },
  chartFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
  marker: {
    position: 'absolute',
    top: -8,
    transform: [{ translateX: -12 }],
    alignItems: 'center',
  },
  markerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  markerLine: {
    width: 2,
    height: 12,
    backgroundColor: colors.primary,
  },
  zones: {
    flexDirection: 'row',
    height: 4,
    marginTop: spacing.xs,
    borderRadius: 2,
    overflow: 'hidden',
  },
  zone: {
    flex: 1,
  },
  zoneLow: {
    backgroundColor: colors.warning,
  },
  zoneNormal: {
    backgroundColor: colors.success,
  },
  zoneHigh: {
    backgroundColor: colors.warning,
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  percentileValue: {
    ...typography.h2,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successDim,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    gap: spacing.xs,
  },
  badgeText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
});
