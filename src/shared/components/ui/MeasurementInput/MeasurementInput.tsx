/**
 * MeasurementInput Component
 * Specialized input for measurements with unit labels
 */

import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors, spacing, radii, typography } from '@core/theme';

interface MeasurementInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  unit: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export function MeasurementInput({
  label,
  unit,
  value,
  onChangeText,
  error,
  ...props
}: MeasurementInputProps) {
  /**
   * Filter input to only allow numeric values with optional decimal point
   */
  const handleTextChange = (text: string) => {
    // Remove any non-numeric characters except decimal point
    // Allow only one decimal point
    const sanitized = text
      .replace(/[^0-9.]/g, '') // Remove anything that's not a digit or decimal point
      .replace(/(\..*?)\./g, '$1'); // Remove multiple decimal points, keep only first
    
    onChangeText(sanitized);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.inputContainer, error && styles.inputContainerError]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          keyboardType="decimal-pad"
          placeholderTextColor={colors.inputPlaceholder}
          {...props}
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.inputLabel,
    marginBottom: spacing.xs,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    minHeight: 40,
    width: '100%',
  },
  unit: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
