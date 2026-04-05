/**
 * MilestoneCard
 * Card component displaying a milestone with status toggles
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii, shadows } from '@/core/theme';
import type { Milestone, MilestoneStatus } from '../types';

interface MilestoneCardProps {
  milestone: Milestone;
  status: MilestoneStatus;
  onStatusChange: (status: MilestoneStatus) => void;
}

interface StatusButtonProps {
  type: MilestoneStatus;
  isActive: boolean;
  onPress: () => void;
}

function StatusButton({ type, isActive, onPress }: StatusButtonProps) {
  const getButtonStyle = () => {
    switch (type) {
      case 'not_yet':
        return {
          container: isActive ? styles.statusNotYetActive : styles.statusNotYet,
        };
      case 'in_progress':
        return {
          container: isActive ? styles.statusInProgressActive : styles.statusInProgress,
        };
      case 'achieved':
        return {
          container: isActive ? styles.statusAchievedActive : styles.statusAchieved,
        };
    }
  };

  const buttonStyle = getButtonStyle();

  const renderIcon = () => {
    if (type === 'achieved') {
      return (
        <Ionicons
          name="checkmark"
          size={18}
          color={isActive ? colors.textOnPrimary : colors.textMuted}
        />
      );
    }
    // For not_yet and in_progress, render a circle
    return (
      <View
        style={[
          styles.circleInner,
          type === 'in_progress' && isActive && styles.circleInnerFilled,
          type === 'in_progress' && !isActive && styles.circleInnerMuted,
        ]}
      />
    );
  };

  return (
    <Pressable
      style={[styles.statusButton, buttonStyle.container]}
      onPress={onPress}
    >
      {renderIcon()}
    </Pressable>
  );
}

export function MilestoneCard({
  milestone,
  status,
  onStatusChange,
}: MilestoneCardProps) {
  const handleStatusPress = useCallback(
    (newStatus: MilestoneStatus) => {
      onStatusChange(newStatus);
    },
    [onStatusChange]
  );

  const getSubcategoryLabel = () => {
    return milestone.subcategory.toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subcategory}>{getSubcategoryLabel()}</Text>
        <Text style={styles.title}>{milestone.title}</Text>
      </View>
      <View style={styles.statusContainer}>
        <StatusButton
          type="not_yet"
          isActive={status === 'not_yet'}
          onPress={() => handleStatusPress('not_yet')}
        />
        <StatusButton
          type="in_progress"
          isActive={status === 'in_progress'}
          onPress={() => handleStatusPress('in_progress')}
        />
        <StatusButton
          type="achieved"
          isActive={status === 'achieved'}
          onPress={() => handleStatusPress('achieved')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.lg,
  },
  content: {
    flex: 1,
    paddingRight: spacing.md,
  },
  subcategory: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  circleInner: {
    width: 0,
    height: 0,
  },
  circleInnerFilled: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  circleInnerMuted: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.textMuted,
  },
  statusNotYet: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  statusNotYetActive: {
    backgroundColor: 'transparent',
    borderColor: colors.textSecondary,
  },
  statusInProgress: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  statusInProgressActive: {
    backgroundColor: 'transparent',
    borderColor: colors.textMuted,
  },
  statusAchieved: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  statusAchievedActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
});
