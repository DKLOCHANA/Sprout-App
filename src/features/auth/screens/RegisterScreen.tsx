/**
 * Register Screen
 * Sign up screen with email/password as primary, Apple sign-in at bottom
 * Responsive layout - fits all content on screen without scrolling
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@core/theme';
import { Input } from '@shared/components/ui';
import { useResponsiveAuth } from '@shared/hooks';
import { AppleSignInButton, AuthDivider } from '../components';
import { useRegisterViewModel } from '../hooks/useRegisterViewModel';

export function RegisterScreen() {
  const {
    formData,
    isLoading,
    error,
    updateField,
    handleSignUp,
    handleAppleSignIn,
    navigateToLogin,
  } = useRegisterViewModel();

  const responsive = useResponsiveAuth();

  // Memoize dynamic styles based on screen dimensions
  const dynamicStyles = useMemo(
    () => ({
      scrollContent: {
        flexGrow: 1,
        paddingHorizontal: responsive.containerPadding,
        paddingBottom: responsive.isCompactScreen ? spacing.sm : spacing.md,
      },
      logoContainer: {
        alignItems: 'center' as const,
        paddingTop: responsive.isCompactScreen ? spacing.xs : responsive.logoVerticalPadding,
        paddingBottom: responsive.isCompactScreen ? spacing.xs : spacing.sm,
      },
      headerContainer: {
        paddingVertical: responsive.isCompactScreen ? spacing.sm : responsive.headerVerticalPadding,
      },
      headline: {
        ...typography.h1,
        fontSize: responsive.headlineFontSize,
        lineHeight: responsive.headlineLineHeight,
        color: colors.textPrimary,
        marginBottom: responsive.isCompactScreen ? spacing.xs : spacing.sm,
      },
      subheadline: {
        ...typography.body,
        fontSize: responsive.subheadlineFontSize,
        lineHeight: responsive.subheadlineLineHeight,
        color: colors.textSecondary,
      },
      formContainer: {
        paddingTop: responsive.isCompactScreen ? 0 : responsive.formTopPadding,
      },
      signUpButton: {
        height: responsive.buttonHeight,
        borderRadius: radii.xl,
        backgroundColor: colors.secondary,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginTop: responsive.isCompactScreen ? spacing.xs : spacing.sm,
      },
      appleContainer: {
        paddingVertical: responsive.isCompactScreen ? spacing.xs : spacing.sm,
      },
      footerContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        paddingVertical: responsive.isCompactScreen ? spacing.sm : spacing.md,
      },
      // Register screen specific - tighter spacing for 4 inputs
      inputSpacing: responsive.isCompactScreen ? spacing.xs : responsive.inputSpacing,
      inputHeight: responsive.isCompactScreen ? 40 : responsive.inputHeight,
    }),
    [responsive]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={dynamicStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Logo */}
          <View style={dynamicStyles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Ionicons name="leaf" size={responsive.logoSize} color={colors.primary} />
              <Text style={styles.logoText}>Sprout</Text>
            </View>
          </View>

          {/* Headline */}
          <View style={dynamicStyles.headerContainer}>
            <Text style={dynamicStyles.headline}>Create your{'\n'}account.</Text>
            <Text style={dynamicStyles.subheadline}>
              Start tracking your baby's precious moments today.
            </Text>
          </View>

          {/* Email/Password Form - Primary */}
          <View style={dynamicStyles.formContainer}>
            <Input
              label="FULL NAME"
              placeholder="John Doe"
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              inputHeight={dynamicStyles.inputHeight}
              containerSpacing={dynamicStyles.inputSpacing}
            />

            <Input
              label="EMAIL ADDRESS"
              placeholder="name@example.com"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              inputHeight={dynamicStyles.inputHeight}
              containerSpacing={dynamicStyles.inputSpacing}
            />

            <Input
              label="PASSWORD"
              placeholder="At least 6 characters"
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              isPassword
              autoComplete="new-password"
              inputHeight={dynamicStyles.inputHeight}
              containerSpacing={dynamicStyles.inputSpacing}
            />

            <Input
              label="CONFIRM PASSWORD"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              isPassword
              autoComplete="new-password"
              inputHeight={dynamicStyles.inputHeight}
              containerSpacing={dynamicStyles.inputSpacing}
            />

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[dynamicStyles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <AuthDivider text="OR" />

          {/* Apple Login */}
          <View style={dynamicStyles.appleContainer}>
            <AppleSignInButton onPress={handleAppleSignIn} loading={false} />
          </View>

          {/* Sign In Link - Bottom */}
          <View style={dynamicStyles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logoText: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  errorContainer: {
    backgroundColor: colors.errorDim,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  signInText: {
    ...typography.body,
    color: colors.link,
    fontWeight: '600',
  },
});
