/**
 * Percentile Badge Component
 * Shows a human-friendly growth status label (not raw number).
 * Tappable — opens PercentileInfoModal with percentile details.
 */

import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '@/core/theme';
import { getPercentileCategory, PERCENTILE_RANGES } from '@/features/growth/types/growth.types';
import type { ColorKey } from '@/core/theme';
import { PercentileInfoModal } from './PercentileInfoModal';

type MetricType = 'weight' | 'height' | 'headCircumference';

interface PercentileBadgeProps {
  percentile: number;
  metric?: MetricType;
  measurement?: number;
  unit?: string;
  size?: 'small' | 'medium' | 'large';
}

const FRIENDLY_LABELS: Record<
  ReturnType<typeof getPercentileCategory>,
  Record<MetricType | 'default', string>
> = {
  VERY_LOW: {
    weight: 'Weight needs attention',
    height: 'Height needs attention',
    headCircumference: 'Head size needs attention',
    default: 'Needs attention',
  },
  LOW: {
    weight: 'Weight slightly low',
    height: 'Height slightly low',
    headCircumference: 'Head size slightly small',
    default: 'A little below average',
  },
  NORMAL: {
    weight: 'Healthy weight',
    height: 'Healthy height',
    headCircumference: 'Healthy head growth',
    default: 'Growing well',
  },
  HIGH: {
    weight: 'Weight above average',
    height: 'Height above average',
    headCircumference: 'Head size above average',
    default: 'Above average',
  },
  VERY_HIGH: {
    weight: 'Weight needs review',
    height: 'Height needs review',
    headCircumference: 'Head size needs review',
    default: 'Growth needs review',
  },
};

export function PercentileBadge({
  percentile,
  metric,
  measurement,
  unit,
  size = 'medium',
}: PercentileBadgeProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const category = getPercentileCategory(percentile);
  const config = PERCENTILE_RANGES[category];

  const colorKey = config.color as ColorKey;
  const colorValue = colors[colorKey];

  const labelMap = FRIENDLY_LABELS[category];
  const label = metric ? labelMap[metric] : labelMap.default;

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
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        style={[
          styles.container,
          sizeStyles[size],
          { backgroundColor: `${colorValue}20` },
        ]}
      >
        <Text
          style={[
            styles.text,
            textSizeStyles[size],
            { color: colorValue },
          ]}
        >
          {label}  ⓘ
        </Text>
      </TouchableOpacity>

      <PercentileInfoModal
        visible={modalVisible}
        percentile={percentile}
        metric={metric}
        measurement={measurement}
        unit={unit}
        onClose={() => setModalVisible(false)}
      />
    </>
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
