/**
 * PediatricianReportCard Component
 * Card for PDF report generation with stats
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii, shadows } from '@/core/theme';
import { StatChip } from './StatChip';
import type { ProfileStats } from '../types';

interface PediatricianReportCardProps {
  stats: ProfileStats;
  onGeneratePdf: () => void;
  isGenerating: boolean;
}

export function PediatricianReportCard({
  stats,
  onGeneratePdf,
  isGenerating,
}: PediatricianReportCardProps) {
  const formatPercentile = (value?: number): string => {
    if (value === undefined) return 'N/A';
    return `${Math.round(value)}th Percentile`;
  };

  const formatMilestoneProgress = (): string => {
    if (stats.totalMilestones === 0) return 'No data';
    return `${stats.achievedMilestones}/${stats.totalMilestones} Achieved`;
  };

  return (
    <View style={styles.container}>
      {/* Card Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pediatrician Report</Text>
        <Ionicons name="document-text" size={24} color={colors.secondary} />
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Generate a clinical PDF for your next visit. Summarize growth trends and milestone progress into a single professional document.
      </Text>

      {/* Generate Button */}
      <Pressable
        style={({ pressed }) => [
          styles.generateButton,
          pressed && styles.generateButtonPressed,
          isGenerating && styles.generateButtonDisabled,
        ]}
        onPress={onGeneratePdf}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color={colors.textOnPrimary} size="small" />
        ) : (
          <>
            <Text style={styles.generateButtonText}>Generate PDF</Text>
            <Ionicons name="document-outline" size={20} color={colors.textOnPrimary} />
          </>
        )}
      </Pressable>

      {/* Stats Chips - Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContent}
      >
        <StatChip
          icon="trending-up"
          iconColor={colors.primary}
          label="Growth Trends"
          value={formatPercentile(stats.growthPercentile)}
        />
        <StatChip
          icon="checkmark-circle"
          iconColor={colors.success}
          label="Milestones"
          value={formatMilestoneProgress()}
        />
        {stats.inProgressMilestones > 0 && (
          <StatChip
            icon="time"
            iconColor={colors.warning}
            label="In Progress"
            value={`${stats.inProgressMilestones} Active`}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
    gap: spacing.sm,
    ...shadows.lg,
  },
  generateButtonPressed: {
    backgroundColor: colors.secondaryGradientEnd,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  statsScroll: {
    marginTop: spacing.lg,
    marginHorizontal: -spacing.lg,
  },
  statsContent: {
    paddingHorizontal: spacing.lg,
  },
});
