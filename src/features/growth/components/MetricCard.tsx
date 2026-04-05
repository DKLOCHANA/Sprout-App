/**
 * Metric Card Component
 * Displays a single growth metric (weight, height, head circumference)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/core/theme';

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
}

export function MetricCard({ label, value, unit }: MetricCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  unit: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
