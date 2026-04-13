/**
 * Toggle Component
 * Binary selection toggle (e.g., Male/Female, Yes/No)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radii, typography } from '@core/theme';

interface ToggleOption<T> {
  value: T;
  label: string;
}

interface ToggleProps<T> {
  options: [ToggleOption<T>, ToggleOption<T>];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  error?: string;
}

export function Toggle<T extends string>({
  options,
  value,
  onChange,
  label,
  error,
}: ToggleProps<T>) {
  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, error ? styles.labelError : undefined]}>{label}</Text>}
      <View style={[styles.toggleContainer, error ? styles.toggleContainerError : undefined]}>
        {options.map((option, index) => {
          const isSelected = value === option.value;
          const isFirst = index === 0;
          const isLast = index === options.length - 1;
          
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                isFirst && styles.optionFirst,
                isLast && styles.optionLast,
              ]}
              onPress={() => onChange(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.inputLabel,
    marginBottom: spacing.xs,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    overflow: 'hidden' as const,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: colors.surface,
  },
  optionFirst: {
    borderTopLeftRadius: radii.md - 1,
    borderBottomLeftRadius: radii.md - 1,
  },
  optionLast: {
    borderTopRightRadius: radii.md - 1,
    borderBottomRightRadius: radii.md - 1,
  },
  optionText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.secondary,
    fontWeight: '600',
  },
  labelError: {
    color: colors.error,
  },
  toggleContainerError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
