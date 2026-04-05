/**
 * UpNextCard Component
 * Shows upcoming milestone with status indicator
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@/core/theme';
import type { Milestone, MilestoneStatus } from '@/features/milestones/types';

interface UpNextCardProps {
  milestone: Milestone;
  status: MilestoneStatus;
  babyAgeMonths: number;
  onPress?: () => void;
}

const STATUS_CONFIG = {
  not_yet: {
    label: 'Not Yet',
    color: colors.textMuted,
    icon: 'ellipse-outline' as const,
    iconColor: colors.textMuted,
  },
  in_progress: {
    label: 'In Progress',
    color: '#F5A623',
    icon: 'ellipse' as const,
    iconColor: '#F5A623',
  },
  achieved: {
    label: 'Achieved',
    color: colors.success,
    icon: 'checkmark-circle' as const,
    iconColor: colors.success,
  },
};

export function UpNextCard({
  milestone,
  status,
  babyAgeMonths,
  onPress,
}: UpNextCardProps) {
  const config = STATUS_CONFIG[status];
  const expectedMonth = milestone.ageRangeMonths.max;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {/* Inner wrapper clips decorative shape without clipping shadow */}
      <View style={styles.innerClip}>
        {/* Decorative shape */}
        <View style={styles.decorativeShape} />

        {/* Header Row */}
        <View style={styles.header}>
          <View style={styles.upNextBadge}>
            <Text style={styles.upNextText}>UP NEXT</Text>
          </View>

          
        </View>

        {/* Milestone Title */}
        <Text style={styles.title}>{milestone.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  innerClip: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  decorativeShape: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundSecondary,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  upNextBadge: {
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  upNextText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});