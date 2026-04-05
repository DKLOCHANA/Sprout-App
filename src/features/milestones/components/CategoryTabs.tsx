/**
 * CategoryTabs
 * Category tabs for milestone filtering - fits screen width
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors, typography, spacing, radii, shadows } from '@/core/theme';
import type { MilestoneCategory } from '../types';

const CATEGORIES: MilestoneCategory[] = ['Motor', 'Cognitive', 'Social', 'Language'];

interface CategoryTabsProps {
  selectedCategory: MilestoneCategory;
  onSelectCategory: (category: MilestoneCategory) => void;
}

export function CategoryTabs({
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <View style={styles.container}>
      {CATEGORIES.map((category) => {
        const isSelected = category === selectedCategory;
        return (
          <Pressable
            key={category}
            style={[
              styles.tab,
              isSelected && styles.tabSelected,
            ]}
            onPress={() => onSelectCategory(category)}
          >
            <Text
              style={[
                styles.tabText,
                isSelected && styles.tabTextSelected,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  tabSelected: {
    backgroundColor: colors.secondary,
    ...shadows.lg,
    shadowColor: colors.secondary,
    shadowOpacity: 0.75,
  },
  tabText: {
    ...typography.bodySmall,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextSelected: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
});
