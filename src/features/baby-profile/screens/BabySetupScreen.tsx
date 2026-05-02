/**
 * Baby Setup Screen
 * Clinical Baseline & Initial Log
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@core/theme';
import {
  Input,
  DatePicker,
  Toggle,
  MeasurementInput,
  PrimaryButton,
} from '@shared/components/ui';
import { InfoBanner } from '@shared/components';
import { useBabySetupViewModel } from '../hooks';
import { BiologicalSex } from '../types';

export function BabySetupScreen() {
  const {
    name,
    setName,
    dateOfBirth,
    setDateOfBirth,
    biologicalSex,
    setBiologicalSex,
    weight,
    setWeight,
    height,
    setHeight,
    headCircumference,
    setHeadCircumference,
    errors,
    isSubmitting,
    handleSubmit,
  } = useBabySetupViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <Ionicons name="leaf" size={24} color={colors.secondary} />
            <Text style={styles.logoText}>Sprout</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.sectionLabel}>BASELINE PROFILE</Text>
            <Text style={styles.title}>Clinical{'\n'}Baseline</Text>
            <Text style={styles.subtitle}>
              Enter your baby's starting measurements to help us calculate
              growth curves with clinical precision.
            </Text>
          </View>

          {/* Eligibility Warning */}
          <InfoBanner
            tone="warning"
            title="Before you add"
            message="Sprout is designed for full-term babies (born around 37–42 weeks of pregnancy). WHO growth standards may not accurately reflect very preterm or post-term babies."
            style={styles.eligibilityBanner}
          />

          {/* Baby Name */}
          <Input
            label="BABY'S NAME"
            value={name}
            onChangeText={setName}
            placeholder="Enter baby's name"
            error={errors.name}
            autoCapitalize="words"
          />

          {/* Date of Birth */}
          <DatePicker
            label="DATE OF BIRTH"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            maximumDate={new Date()}
            error={errors.dateOfBirth}
          />

          {/* Biological Sex */}
          <Toggle
            label="BIOLOGICAL SEX"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
            value={biologicalSex ?? ('' as any)}
            onChange={(val) => setBiologicalSex(val as BiologicalSex)}
            error={errors.biologicalSex}
          />

          {/* Starting Measurements */}
          <View style={styles.measurementHeader}>
            <Text style={styles.measurementSectionLabel}>
              STARTING MEASUREMENTS
            </Text>
          </View>

          <View style={styles.measurementRow}>
            <MeasurementInput
              label="WEIGHT"
              unit="kg"
              value={weight}
              onChangeText={setWeight}
              placeholder="e.g. 3.5"
              error={errors.weight}
            />
            <View style={{ width: spacing.md }} />
            <MeasurementInput
              label="HEIGHT"
              unit="cm"
              value={height}
              onChangeText={setHeight}
              placeholder="e.g. 50"
              error={errors.height}
            />
            <View style={{ width: spacing.md }} />
            <MeasurementInput
              label="HEAD"
              unit="cm"
              value={headCircumference}
              onChangeText={setHeadCircumference}
              placeholder="e.g. 35"
              error={errors.headCircumference}
            />
          </View>

          {/* Medical Disclaimer */}
          <InfoBanner
            tone="disclaimer"
            message="Sprout is for general tracking and educational purposes only. Always seek the guidance of a qualified healthcare professional for any concerns about your child's health or development."
            style={styles.disclaimerBanner}
          />

          {/* Submit Button */}
          <PrimaryButton
            title="Start Tracking"
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.submitButton}
          />

          {/* Privacy Notice */}
          <Text style={styles.privacyText}>
            By starting, you agree to Sprout's Clinical Privacy Guidelines and
            Health Data Management Policy.
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logoText: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  eligibilityBanner: {
    marginBottom: spacing.lg,
  },
  disclaimerBanner: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.md,
    lineHeight: 40,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  // ─── Measurement section ────────────────────────────────────────────────────
  measurementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  measurementSectionLabel: {
    ...typography.bodySmall,
    color: colors.inputLabel,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  measurementRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  submitButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.secondary,
  },
  privacyText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
  },
});
