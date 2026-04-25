/**
 * Metric Card Component
 * Displays a single growth metric (weight, height, head circumference)
 * Tappable to switch the active chart metric.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, typography, spacing } from '@/core/theme';

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  isSelected?: boolean;
  onPress?: () => void;
}

export function MetricCard({ label, value, unit, isSelected = false, onPress }: MetricCardProps) {
  return (
    <Pressable
      style={[
        styles.container,
        isSelected && styles.containerSelected,
      ]}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${label} ${value} ${unit}`}
    >
      <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, isSelected && styles.valueSelected]}>{value}</Text>
        <Text style={[styles.unit, isSelected && styles.unitSelected]}>{unit}</Text>
      </View>
      {isSelected && <View style={styles.indicator} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  containerSelected: {
    backgroundColor: colors.secondaryDim,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  labelSelected: {
    color: colors.secondary,
    fontWeight: '600',
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
  valueSelected: {
    color: colors.secondary,
  },
  unit: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  unitSelected: {
    color: colors.secondary,
  },
  indicator: {
    width: 20,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.secondary,
    marginTop: spacing.xs,
  },
});
