/**
 * MilestoneCard
 * Card with a single "Achieved" checkbox.
 * Tapping toggles between not_yet ↔ achieved with haptic feedback +
 * an optional onCelebrate callback when newly completed (so the parent
 * can position a particle burst at the checkbox location).
 */

import React, { useCallback, memo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, findNodeHandle, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography, spacing, radii, shadows } from '@/core/theme';
import type { Milestone, MilestoneStatus } from '../types';

interface MilestoneCardProps {
  milestone: Milestone;
  status: MilestoneStatus;
  onStatusChange: (status: MilestoneStatus) => void;
  onCelebrate?: (originX: number, originY: number) => void;
}

function MilestoneCardComponent({
  milestone,
  status,
  onStatusChange,
  onCelebrate,
}: MilestoneCardProps) {
  const checkboxRef = useRef<View>(null);
  const isAchieved = status === 'achieved';

  const scale = useSharedValue(1);
  const checkScale = useSharedValue(isAchieved ? 1 : 0);

  // Keep check icon scale in sync if status changes externally
  React.useEffect(() => {
    checkScale.value = withSpring(isAchieved ? 1 : 0, {
      damping: 12,
      stiffness: 220,
    });
  }, [isAchieved, checkScale]);

  const handlePress = useCallback(() => {
    const willComplete = !isAchieved;
    const newStatus: MilestoneStatus = willComplete ? 'achieved' : 'not_yet';

    // Bouncy press animation
    scale.value = withSequence(
      withTiming(0.85, { duration: 90 }),
      withSpring(1, { damping: 6, stiffness: 220 })
    );

    if (willComplete) {
      // Haptic + celebration
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      if (onCelebrate && checkboxRef.current) {
        const handle = findNodeHandle(checkboxRef.current);
        if (handle) {
          UIManager.measureInWindow(handle, (x, y, width, height) => {
            onCelebrate(x + width / 2, y + height / 2);
          });
        }
      }
    } else {
      // Lighter haptic when un-completing
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    onStatusChange(newStatus);
  }, [isAchieved, onStatusChange, onCelebrate, scale]);

  const containerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkAnimStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerAnimStyle]}>
      <View style={styles.content}>
        <Text style={styles.subcategory}>{milestone.subcategory.toUpperCase()}</Text>
        <Text style={styles.title}>{milestone.title}</Text>
      </View>

      <Pressable
        ref={checkboxRef}
        onPress={handlePress}
        hitSlop={8}
        style={[styles.checkbox, isAchieved && styles.checkboxActive]}
      >
        <Animated.View style={checkAnimStyle}>
          <Ionicons name="checkmark" size={20} color={colors.textOnPrimary} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export const MilestoneCard = memo(MilestoneCardComponent);

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
  checkbox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  checkboxActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
});
