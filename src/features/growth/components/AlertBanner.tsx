/**
 * Alert Banner Component
 * Displays growth alerts with severity-based styling
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { GrowthAlert } from '@/features/growth/types/growth.types';
import { colors, typography, spacing, shadows } from '@/core/theme';

interface AlertBannerProps {
  alert: GrowthAlert;
  onDismiss?: (alertId: string) => void;
  compact?: boolean;
}

export function AlertBanner({ alert, onDismiss, compact = false }: AlertBannerProps) {
  const severityConfig = {
    urgent: {
      bgColor: colors.errorDim,
      borderColor: colors.error,
      iconColor: colors.error,
      icon: 'warning' as const,
    },
    warning: {
      bgColor: colors.warningDim,
      borderColor: colors.percentileLow,
      iconColor: colors.percentileLow,
      icon: 'alert-circle' as const,
    },
    info: {
      bgColor: colors.infoDim,
      borderColor: colors.info,
      iconColor: colors.info,
      icon: 'information-circle' as const,
    },
  };

  const config = severityConfig[alert.severity];

  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        { backgroundColor: config.bgColor, borderLeftColor: config.borderColor },
      ]}
    >
      <Ionicons 
        name={config.icon} 
        size={compact ? 18 : 24} 
        color={config.iconColor} 
        style={styles.icon} 
      />
      
      <View style={styles.content}>
        <Text style={[styles.message, compact && styles.messageCompact]} numberOfLines={compact ? 1 : undefined}>
          {alert.message}
        </Text>
        {!compact && alert.explanation && (
          <Text style={styles.explanation}>{alert.explanation}</Text>
        )}
        {!compact && alert.recommendation && (
          <Text style={styles.recommendation}>{alert.recommendation}</Text>
        )}
      </View>

      {onDismiss && (
        <Pressable
          onPress={() => onDismiss(alert.id)}
          style={styles.dismissButton}
          hitSlop={8}
        >
          <Ionicons name="close" size={compact ? 16 : 20} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
    alignItems: 'flex-start',
    ...shadows.sm,
  },
  containerCompact: {
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  message: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  messageCompact: {
    ...typography.bodySmall,
    marginBottom: 0,
  },
  explanation: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  recommendation: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  dismissButton: {
    padding: spacing.xs,
  },
});
