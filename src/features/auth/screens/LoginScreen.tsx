/**
 * Login Screen
 * Sign in screen with email/password as primary, Apple login at bottom
 * Responsive layout - fits all content on screen without scrolling
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const APP_ICON = require('../../../../assets/icon.png');
import { colors, spacing, radii, typography } from '@core/theme';
import { Input } from '@shared/components/ui';
import { useResponsiveAuth } from '@shared/hooks';
import { AppleSignInButton, AuthDivider } from '../components';
import { useLoginViewModel } from '../hooks/useLoginViewModel';

export function LoginScreen() {
  const {
    formData,
    isLoading,
    isAppleLoading,
    error,
    updateField,
    handleSignIn,
    handleAppleSignIn,
    handleForgotPassword,
    navigateToRegister,
  } = useLoginViewModel();

  const responsive = useResponsiveAuth();

  // Memoize dynamic styles based on screen dimensions
  const dynamicStyles = useMemo(
    () => ({
      scrollContent: {
        flexGrow: 1,
        paddingHorizontal: responsive.containerPadding,
        paddingBottom: responsive.sectionSpacing,
        justifyContent: 'space-between' as const,
      },
      logoContainer: {
        alignItems: 'center' as const,
        paddingTop: responsive.logoVerticalPadding,
        paddingBottom: responsive.isCompactScreen ? spacing.xs : spacing.sm,
      },
      headerContainer: {
        paddingVertical: responsive.headerVerticalPadding,
      },
      headline: {
        ...typography.h1,
        fontSize: responsive.headlineFontSize,
        lineHeight: responsive.headlineLineHeight,
        color: colors.textPrimary,
        marginBottom: responsive.isCompactScreen ? spacing.sm : spacing.md,
      },
      subheadline: {
        ...typography.body,
        fontSize: responsive.subheadlineFontSize,
        lineHeight: responsive.subheadlineLineHeight,
        color: colors.textSecondary,
      },
      formContainer: {
        paddingTop: responsive.formTopPadding,
      },
      signInButton: {
        height: responsive.buttonHeight,
        borderRadius: radii.xl,
        backgroundColor: colors.secondary,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginTop: responsive.isCompactScreen ? spacing.xs : spacing.sm,
      },
      forgotPasswordButton: {
        alignSelf: 'flex-end' as const,
        paddingVertical: spacing.md,
      },
      divider: {
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
      },
      appleContainer: {
        paddingBottom: spacing.xs,
      },
      footerContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        paddingTop: spacing.xs,
      },
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
          {/* Top Section: Logo + Header + Form */}
          <View>
            {/* Logo */}
            <View style={dynamicStyles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image source={APP_ICON} style={styles.logoIcon} resizeMode="contain" />
                <Text style={styles.logoText}>Sprout</Text>
              </View>
            </View>

            {/* Headline */}
            <View style={dynamicStyles.headerContainer}>
              <Text style={dynamicStyles.headline}>Evidence-based{'\n'}peace of mind.</Text>
              <Text style={dynamicStyles.subheadline}>
                Nurturing your journey with clinical precision and parental warmth.
              </Text>
            </View>

            {/* Email/Password Form - Primary */}
            <View style={dynamicStyles.formContainer}>
              <Input
                label="EMAIL ADDRESS"
                placeholder="name@example.com"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                inputHeight={responsive.inputHeight}
                containerSpacing={responsive.inputSpacing}
              />

              <Input
                label="PASSWORD"
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                isPassword
                autoComplete="password"
                inputHeight={responsive.inputHeight}
                containerSpacing={responsive.inputSpacing}
              />

              {/* Error Message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Sign In Button */}
              <TouchableOpacity
                style={[dynamicStyles.signInButton, isLoading && styles.signInButtonDisabled]}
                onPress={handleSignIn}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.signInButtonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Forgot Password - Right Aligned */}
              <TouchableOpacity
                style={dynamicStyles.forgotPasswordButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Section: Divider + Apple + Footer */}
          <View>
            {/* Divider */}
            <AuthDivider text="OR" style={dynamicStyles.divider} />

            {/* Apple Login */}
            <View style={dynamicStyles.appleContainer}>
              <AppleSignInButton onPress={handleAppleSignIn} loading={isAppleLoading} />
            </View>

            {/* Create Account Link - Bottom */}
            <View style={dynamicStyles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.createAccountText}>Create account</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 18,
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
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  forgotPasswordText: {
    ...typography.body,
    color: colors.link,
    fontWeight: '500',
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  createAccountText: {
    ...typography.body,
    color: colors.link,
    fontWeight: '600',
  },
});
