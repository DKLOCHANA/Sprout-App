/**
 * PricingCard Component
 * Displays subscription pricing options (monthly/annual)
 */

import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radii, shadows } from '@/core/theme';
import { Typography } from '@/shared/components/ui';
import type { ProductOffering } from '../types';

interface PricingCardProps {
  offering: ProductOffering;
  isSelected: boolean;
  onSelect: () => void;
  isBestValue?: boolean;
}

function PricingCardComponent({
  offering,
  isSelected,
  onSelect,
  isBestValue = false,
}: PricingCardProps) {
  const isAnnual = offering.packageType === 'annual';
  const displayPrice = isAnnual && offering.monthlyEquivalentPrice
    ? `$${offering.monthlyEquivalentPrice.toFixed(2)}`
    : offering.priceString;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
      ]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {isBestValue && (
        <View style={styles.badge}>
          <Typography variant="caption" color="textOnPrimary" weight="600">
            BEST VALUE
          </Typography>
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Typography variant="body" weight="600">
            {isAnnual ? 'Annual (Best Value)' : 'Monthly'}
          </Typography>
          <Typography variant="bodySmall" color="textSecondary">
            {isAnnual ? `${offering.priceString} / year` : 'Cancel anytime'}
          </Typography>
        </View>
        
        <View style={styles.rightContent}>
          <Typography variant="h2" color="primary" weight="700">
            {displayPrice}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            PER MONTH
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const PricingCard = memo(PricingCardComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'visible',
  },
  containerSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  badge: {
    position: 'absolute',
    top: -12,
    left: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
});
