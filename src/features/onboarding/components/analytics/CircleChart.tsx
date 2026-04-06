/**
 * CircleChart Analytics Component
 * Compact donut chart with segments
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors, spacing, typography, radii } from '@core/theme';
import { CircleChartData } from '@core/data/onboarding';

interface CircleChartProps {
  data: CircleChartData;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function CircleChart({ data }: CircleChartProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate segment positions
  let cumulativePercentage = 0;
  const segments = data.segments.map((segment) => {
    const startAngle = cumulativePercentage * 3.6;
    const segmentLength = (segment.value / 100) * circumference;
    cumulativePercentage += segment.value;
    return {
      ...segment,
      startAngle,
      segmentLength,
      offset: ((100 - cumulativePercentage + segment.value) / 100) * circumference,
    };
  });

  return (
    <Animated.View style={[styles.container, { opacity: animatedOpacity }]}>
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.border}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {segments.map((segment) => (
              <AnimatedCircle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${segment.segmentLength} ${circumference}`}
                strokeDashoffset={animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [circumference, segment.offset],
                })}
                strokeLinecap="round"
              />
            ))}
          </G>
        </Svg>
        <View style={styles.centerContent}>
          <Text style={styles.centerText}>{data.centerText}</Text>
          <Text style={styles.centerLabel}>avg/day</Text>
        </View>
      </View>

      <View style={styles.legendContainer}>
        {segments.map((segment) => (
          <View key={segment.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
            <Text style={styles.legendText}>{segment.label}</Text>
            <Text style={styles.legendValue}>{segment.value}%</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerText: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  centerLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  legendContainer: {
    width: '100%',
    gap: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radii.md,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  legendText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    flex: 1,
  },
  legendValue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
