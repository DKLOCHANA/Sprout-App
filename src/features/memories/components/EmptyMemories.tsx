/**
 * EmptyMemories Component
 * Displays when user has no achieved milestones yet
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii, shadows } from '@/core/theme';

interface EmptyMemoriesProps {
  onAddMemory?: () => void;
}

export function EmptyMemories({ onAddMemory }: EmptyMemoriesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="book-outline" size={64} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>No Memories Yet</Text>
      <Text style={styles.subtitle}>
        Start capturing your baby's special moments. Each memory will appear
        here as a cherished part of their journey.
      </Text>
      {onAddMemory && (
        <Pressable style={styles.addButton} onPress={onAddMemory}>
          <Ionicons name="add" size={20} color={colors.textOnPrimary} />
          <Text style={styles.addButtonText}>Add Your Baby's First Memory</Text>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    ...shadows.sm,
  },
  addButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
    marginLeft: spacing.sm,
  },
});
