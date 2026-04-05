/**
 * QuickActions Component
 * Log Growth and Log Milestone buttons
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@/core/theme';

interface QuickActionsProps {
  onLogGrowth: () => void;
  onLogMilestone: () => void;
}

export function QuickActions({ onLogGrowth, onLogMilestone }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      {/* Log Growth Button */}
      <TouchableOpacity style={styles.button} onPress={onLogGrowth} activeOpacity={0.9}>
        <LinearGradient
          colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="bar-chart" size={24} color={colors.textOnPrimary} />
          </View>
          <Text style={styles.buttonTitle}>Log Growth</Text>
          <Text style={styles.buttonSubtitle}>WEIGHT & HEIGHT</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Log Milestone Button */}
      <TouchableOpacity style={styles.button} onPress={onLogMilestone} activeOpacity={0.9}>
        <LinearGradient
          colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="star" size={24} color={colors.textOnPrimary} />
          </View>
          <Text style={styles.buttonTitle}>Log Milestone</Text>
          <Text style={styles.buttonSubtitle}>NEW SKILLS</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  button: {
    flex: 1,
    borderRadius: radii.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  buttonTitle: {
    ...typography.h3,
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  buttonSubtitle: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
});