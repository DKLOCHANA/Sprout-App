/**
 * SuccessRate Analytics Component
 * Compact success percentage with testimonial
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
import { colors, spacing, typography, radii } from '@core/theme';
import { SuccessRateData } from '@core/data/onboarding';

interface SuccessRateProps {
  data: SuccessRateData;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function SuccessRate({ data }: SuccessRateProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const size = 140;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: data.percentage,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [data.percentage]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.success}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.centerContent}>
          <Text style={styles.percentage}>{data.percentage}%</Text>
          <Text style={styles.totalUsers}>{data.totalUsers}</Text>
        </View>
      </View>

      <View style={styles.testimonialCard}>
        <MaterialCommunityIcons
          name="format-quote-open"
          size={20}
          color={colors.primary}
        />
        <Text style={styles.testimonialText}>{data.testimonial}</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <MaterialCommunityIcons
              key={star}
              name="star"
              size={14}
              color={colors.warning}
            />
          ))}
        </View>
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
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.success,
    lineHeight: 40,
  },
  totalUsers: {
    ...typography.caption,
    color: colors.textMuted,
  },
  testimonialCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.md,
    width: '100%',
    alignItems: 'center',
  },
  testimonialText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: spacing.xs,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
});
