/**
 * InfoBanner
 * Reusable banner for warnings, disclaimers and informational notes.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '@core/theme';

export type InfoBannerTone = 'info' | 'warning' | 'disclaimer';

interface InfoBannerProps {
  tone?: InfoBannerTone;
  title?: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

const TONE_STYLES: Record<InfoBannerTone, { bg: string; border: string; tint: string; defaultIcon: keyof typeof Ionicons.glyphMap }> = {
  info: {
    bg: colors.infoDim,
    border: colors.info,
    tint: colors.info,
    defaultIcon: 'information-circle-outline',
  },
  warning: {
    bg: colors.warningDim,
    border: colors.warning,
    tint: colors.warning,
    defaultIcon: 'alert-circle-outline',
  },
  disclaimer: {
    bg: colors.surfaceSecondary,
    border: colors.border,
    tint: colors.textMuted,
    defaultIcon: 'medical-outline',
  },
};

export function InfoBanner({
  tone = 'info',
  title,
  message,
  icon,
  style,
}: InfoBannerProps) {
  const t = TONE_STYLES[tone];
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: t.bg, borderLeftColor: t.border },
        style,
      ]}
    >
      <Ionicons
        name={icon ?? t.defaultIcon}
        size={tone === 'disclaimer' ? 16 : 18}
        color={t.tint}
        style={styles.icon}
      />
      <View style={styles.body}>
        {title && (
          <Text style={[styles.title, { color: t.tint }]}>{title}</Text>
        )}
        <Text
          style={[
            styles.message,
            tone === 'disclaimer' && styles.messageDisclaimer,
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm + 2,
    borderRadius: radii.md,
    borderLeftWidth: 3,
    gap: spacing.sm,
  },
  icon: {
    marginTop: 1,
  },
  body: {
    flex: 1,
  },
  title: {
    ...typography.bodySmall,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  message: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  messageDisclaimer: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 17,
  },
});
