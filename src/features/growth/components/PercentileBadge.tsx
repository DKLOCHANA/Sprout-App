/**
 * Percentile Badge Component
 * Displays percentile with color coding
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/core/theme';
import { getPercentileCategory, PERCENTILE_RANGES } from '@/features/growth/types/growth.types';
import type { ColorKey } from '@/core/theme';

interface PercentileBadgeProps {
  percentile: number;
  size?: 'small' | 'medium' | 'large';
}

export function PercentileBadge({ percentile, size = 'medium' }: PercentileBadgeProps) {
  const category = getPercentileCategory(percentile);
  const config = PERCENTILE_RANGES[category];
  
  // Get actual color value from theme using the color key
  const colorKey = config.color as ColorKey;
  const colorValue = colors[colorKey];

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
        { backgroundColor: `${colorValue}20` }, // 20 = 12.5% opacity in hex
      ]}
    >
      <Text
        style={[
          styles.text,
          textSizeStyles[size],
          { color: colorValue },
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
