/**
 * Login Screen
 * Sign in screen with email/password as primary, Apple login at bottom
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@core/theme';
import { Input } from '@shared/components/ui';
import { AppleSignInButton, AuthDivider } from '../components';
import { useLoginViewModel } from '../hooks/useLoginViewModel';

export function LoginScreen() {
  const {
    formData,
    isLoading,
    error,
    updateField,
    handleSignIn,
    handleAppleSignIn,
    handleForgotPassword,
    navigateToRegister,
  } = useLoginViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Ionicons name="leaf" size={28} color={colors.primary} />
              <Text style={styles.logoText}>Sprout</Text>
            </View>
          </View>

          {/* Headline */}
          <View style={styles.headerContainer}>
            <Text style={styles.headline}>Evidence-based{'\n'}peace of mind.</Text>
            <Text style={styles.subheadline}>
              Nurturing your journey with clinical precision and parental warmth.
            </Text>
          </View>

          {/* Email/Password Form - Primary */}
          <View style={styles.formContainer}>
            <Input
              label="EMAIL ADDRESS"
              placeholder="name@example.com"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <Input
              label="PASSWORD"
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              isPassword
              autoComplete="password"
            />

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
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
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Divider */}
          <AuthDivider text="OR" />

          {/* Apple Login */}
          <View style={styles.appleContainer}>
            <AppleSignInButton onPress={handleAppleSignIn} loading={false} />
          </View>

          {/* Create Account Link - Bottom */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.createAccountText}>Create account</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
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
  headerContainer: {
    paddingVertical: spacing.lg,
  },
  headline: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subheadline: {
    ...typography.body,
    color: colors.textSecondary,
  },
  formContainer: {
    paddingTop: spacing.md,
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
  signInButton: {
    height: 52,
    borderRadius: radii.xl,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.md,
  },
  forgotPasswordText: {
    ...typography.body,
    color: colors.link,
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
  appleContainer: {
    paddingVertical: spacing.md,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
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
