/**
 * Register Screen
 * Sign up screen with email/password as primary, Apple sign-in at bottom
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
            <Text style={styles.headline}>Create your{'\n'}account.</Text>
            <Text style={styles.subheadline}>
              Start tracking your baby's precious moments today.
            </Text>
          </View>

          {/* Email/Password Form - Primary */}
          <View style={styles.formContainer}>
            <Input
              label="FULL NAME"
              placeholder="John Doe"
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
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
            />

            <Input
              label="PASSWORD"
              placeholder="At least 6 characters"
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              isPassword
              autoComplete="new-password"
            />

            <Input
              label="CONFIRM PASSWORD"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              isPassword
              autoComplete="new-password"
            />

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
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

          {/* Sign In Link - Bottom */}
          <View style={styles.footerContainer}>
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
  signUpButton: {
    height: 52,
    borderRadius: radii.xl,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
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
  signInText: {
    ...typography.body,
    color: colors.link,
    fontWeight: '600',
  },
});
