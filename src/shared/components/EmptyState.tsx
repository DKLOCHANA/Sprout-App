/**
 * EmptyState Component
 * Reusable empty state with icon, title, message, and action button
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@/core/theme';

interface EmptyStateProps {
  /** Icon name from Ionicons */
  icon: keyof typeof Ionicons.glyphMap;
  /** Main title */
  title: string;
  /** Description message */
  message: string;
  /** Optional action button */
  action?: {
    label: string;
    onPress: () => void;
  };
  /** Icon color */
  iconColor?: string;
  /** Background color for icon container */
  iconBackgroundColor?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  action,
  iconColor = colors.primary,
  iconBackgroundColor = colors.primaryDim,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Ionicons name={icon} size={48} color={iconColor} />
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Message */}
      <Text style={styles.message}>{message}</Text>

      {/* Action Button */}
      {action && (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={action.onPress}
        >
          <Text style={styles.actionButtonText}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  actionButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  actionButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});
