/**
 * SettingsRow Component
 * Individual settings row with icon, label, optional badge, and chevron
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii } from '@/core/theme';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBackgroundColor?: string;
  label: string;
  badge?: string;
  onPress: () => void;
  showChevron?: boolean;
  isLast?: boolean;
}

export function SettingsRow({
  icon,
  iconBackgroundColor,
  label,
  badge,
  onPress,
  showChevron = true,
  isLast = false,
}: SettingsRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        !isLast && styles.borderBottom,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      {/* Icon */}
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: iconBackgroundColor || colors.surfaceTertiary }
        ]}
      >
        <Ionicons name={icon} size={20} color={colors.textPrimary} />
      </View>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Badge (optional) */}
      {badge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      {/* Chevron */}
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  badgeContainer: {
    backgroundColor: colors.primaryDim,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    marginRight: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
