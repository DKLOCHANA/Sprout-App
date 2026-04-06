/**
 * BigNumber Analytics Component
 * Compact large number with supporting stats
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '@core/theme';
import { BigNumberData } from '@core/data/onboarding';

interface BigNumberProps {
  data: BigNumberData;
}

export function BigNumber({ data }: BigNumberProps) {
  const animatedScale = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(animatedScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: animatedOpacity }]}>
      <Animated.View
        style={[
          styles.mainNumber,
          { transform: [{ scale: animatedScale }] },
        ]}
      >
        <Text style={styles.number}>{data.number}</Text>
        <Text style={styles.suffix}>{data.suffix}</Text>
      </Animated.View>

      <Text style={styles.label}>{data.label}</Text>

      <View style={styles.subStatsContainer}>
        {data.subStats.map((stat, index) => (
          <View key={index} style={styles.subStat}>
            <MaterialCommunityIcons
              name={index === 0 ? 'trending-up' : 'clock-outline'}
              size={18}
              color={colors.primary}
            />
            <Text style={styles.subStatValue}>{stat.value}</Text>
            <Text style={styles.subStatLabel}>{stat.label}</Text>
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
  mainNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  number: {
    fontSize: 72,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 80,
  },
  suffix: {
    ...typography.h3,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subStatsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  subStat: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  subStatValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  subStatLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
