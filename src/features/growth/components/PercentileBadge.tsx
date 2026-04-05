/**
 * Percentile Badge Component
 * Displays percentile with color coding
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/core/theme';
import { getPercentileCategory, PERCENTILE_RANGES } from '@/features/growth/types/growth.types';

interface PercentileBadgeProps {
  percentile: number;
  size?: 'small' | 'medium' | 'large';
}

export function PercentileBadge({ percentile, size = 'medium' }: PercentileBadgeProps) {
  const category = getPercentileCategory(percentile);
  const config = PERCENTILE_RANGES[category];

  const sizeStyles = {
    small: { paddingHorizontal: spacing.xs, paddingVertical: 4 },
    medium: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
    large: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  };

  const textSizeStyles = {
    small: { fontSize: 11 },
    medium: { fontSize: 13 },
    large: { fontSize: 15 },
  };

  return (
    <View
      style={[
        styles.container,
        sizeStyles[size],
        { backgroundColor: `${config.color}20` },
      ]}
    >
      <Text
        style={[
          styles.text,
          textSizeStyles[size],
          { color: config.color },
        ]}
      >
        {Math.round(percentile)}th Percentile
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.body,
    fontWeight: '600',
  },
});
