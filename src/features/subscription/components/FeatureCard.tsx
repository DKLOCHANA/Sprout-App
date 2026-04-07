/**
 * FeatureCard Component
 * Displays a premium feature with icon, title, and description
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, shadows } from '@/core/theme';
import { Typography } from '@/shared/components/ui';
import type { PaywallFeature } from '../types';

interface FeatureCardProps {
  feature: PaywallFeature;
}

/**
 * Map feature icon IDs to Ionicons names
 */
function getIconName(iconId: string): keyof typeof Ionicons.glyphMap {
  switch (iconId) {
    case 'document-text':
      return 'document-text-outline';
    case 'people':
      return 'people-outline';
    case 'book':
      return 'book-outline';
    default:
      return 'checkmark-circle-outline';
  }
}

function FeatureCardComponent({ feature }: FeatureCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={getIconName(feature.icon)}
          size={24}
          color={colors.primary}
        />
      </View>
      <View style={styles.content}>
        <Typography variant="body" weight="600" style={styles.title}>
          {feature.title}
        </Typography>
        <Typography variant="bodySmall" color="textSecondary" style={styles.description}>
          {feature.description}
        </Typography>
      </View>
      <View style={styles.checkContainer}>
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={colors.primary}
        />
      </View>
    </View>
  );
}

export const FeatureCard = memo(FeatureCardComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: spacing.xs,
  },
  description: {
    lineHeight: 18,
  },
  checkContainer: {
    marginLeft: spacing.sm,
  },
});
