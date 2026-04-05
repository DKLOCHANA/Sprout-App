/**
 * Switch Component
 * Toggle switch with label and description
 */

import React from 'react';
import { View, Text, Switch as RNSwitch, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@core/theme';

interface SwitchProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function Switch({ label, description, value, onChange }: SwitchProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <RNSwitch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: colors.inputBorder,
          true: colors.primaryLight,
        }}
        thumbColor={value ? colors.primary : colors.surface}
        ios_backgroundColor={colors.inputBorder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
