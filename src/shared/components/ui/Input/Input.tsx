/**
 * Input Component
 * Styled text input with label and password toggle
 * Supports responsive sizing via inputHeight and containerSpacing props
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@core/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
  /** Responsive input height - defaults to 52 */
  inputHeight?: number;
  /** Responsive container margin bottom - defaults to spacing.md (16) */
  containerSpacing?: number;
}

export function Input({
  label,
  error,
  containerStyle,
  isPassword = false,
  secureTextEntry,
  inputHeight,
  containerSpacing,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const showPasswordToggle = isPassword || secureTextEntry;
  const shouldHideText = showPasswordToggle && !isPasswordVisible;

  // Use provided values or fall back to defaults
  const finalInputHeight = inputHeight ?? 52;
  const finalContainerSpacing = containerSpacing ?? spacing.md;

  return (
    <View style={[styles.container, { marginBottom: finalContainerSpacing }, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        <TextInput
          style={[styles.input, { height: finalInputHeight }]}
          placeholderTextColor={colors.inputPlaceholder}
          secureTextEntry={shouldHideText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={isPassword ? 'none' : props.autoCapitalize}
          autoCorrect={isPassword ? false : props.autoCorrect}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={[styles.toggleButton, { height: finalInputHeight }]}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginBottom is now dynamic, set via inline style
  },
  label: {
    ...typography.bodySmall,
    color: colors.inputLabel,
    marginBottom: spacing.xs,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  inputContainerFocused: {
    borderColor: colors.inputBorderFocus,
    backgroundColor: colors.surface,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    // height is now dynamic, set via inline style
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.inputText,
  },
  toggleButton: {
    paddingHorizontal: spacing.md,
    // height is now dynamic, set via inline style
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
