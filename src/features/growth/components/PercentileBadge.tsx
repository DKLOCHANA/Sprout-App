/**
 * Percentile Badge Component
 * Displays percentile with colour coding.
 * Tappable — opens PercentileInfoModal with a WHO-based explanation and colour guide.
 */

import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '@/core/theme';
import { getPercentileCategory, PERCENTILE_RANGES } from '@/features/growth/types/growth.types';
import type { ColorKey } from '@/core/theme';
import { PercentileInfoModal } from './PercentileInfoModal';

interface PercentileBadgeProps {
  percentile: number;
  size?: 'small' | 'medium' | 'large';
}

export function PercentileBadge({ percentile, size = 'medium' }: PercentileBadgeProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const category = getPercentileCategory(percentile);
  const config = PERCENTILE_RANGES[category];

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
          {Math.round(percentile)}th Percentile ⓘ
        </Text>
      </TouchableOpacity>

      <PercentileInfoModal
        visible={modalVisible}
        percentile={percentile}
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
