/**
 * AddBabyScreen
 * Screen for adding a new baby to the family
 * (Used from Family Management, not onboarding)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, shadows } from '@core/theme';
import {
  Input,
  DatePicker,
  Toggle,
  Switch,
  MeasurementInput,
  PrimaryButton,
  ImagePicker,
} from '@shared/components/ui';
import { useUnitPreference } from '@shared/hooks';
import { unitLabels, unitPlaceholders } from '@shared/utils/unitConversions';
import { useAddBabyViewModel } from '../hooks';
import { BiologicalSex } from '../types';

export function AddBabyScreen() {
  const {
    name,
    setName,
    photoUri,
    setPhotoUri,
    dateOfBirth,
    setDateOfBirth,
    biologicalSex,
    setBiologicalSex,
    isPremature,
    setIsPremature,
    originalDueDate,
    setOriginalDueDate,
    weight,
    setWeight,
    height,
    setHeight,
    headCircumference,
    setHeadCircumference,
    errors,
    isSubmitting,
    handleSubmit,
    handleCancel,
  } = useAddBabyViewModel();

  const { unitSystem, setUnitSystem } = useUnitPreference();
  const weightUnit = unitLabels.weight(unitSystem);
  const lengthUnit = unitLabels.length(unitSystem);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            onPress={handleCancel}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Add Child</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Photo Picker */}
          <ImagePicker
            imageUri={photoUri}
            onImageChange={setPhotoUri}
            name={name}
            size={120}
            label="CHILD'S PHOTO"
          />

          {/* Baby Name */}
          <Input
            label="CHILD'S NAME"
            value={name}
            onChangeText={setName}
            placeholder="Enter child's name"
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

          {/* Prematurity Toggle */}
          <Switch
            label="Born before 37 weeks?"
            description="Adjusts development milestones"
            value={isPremature}
            onChange={setIsPremature}
          />

          {/* Original Due Date (if premature) */}
          {isPremature && (
            <DatePicker
              label="ORIGINAL DUE DATE"
              value={originalDueDate}
              onChange={setOriginalDueDate}
              minimumDate={dateOfBirth}
              error={errors.originalDueDate}
            />
          )}

          {/* Current Measurements */}
          <View style={styles.measurementHeader}>
            <Text style={styles.measurementSectionLabel}>
              CURRENT MEASUREMENTS
            </Text>
            {/* Unit system toggle */}
            <View style={styles.unitToggle}>
              <Pressable
                style={[
                  styles.unitOption,
                  unitSystem === 'metric' && styles.unitOptionActive,
                ]}
                onPress={() => setUnitSystem('metric')}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    unitSystem === 'metric' && styles.unitOptionTextActive,
                  ]}
                >
                  Metric
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.unitOption,
                  unitSystem === 'standard' && styles.unitOptionActive,
                ]}
                onPress={() => setUnitSystem('standard')}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    unitSystem === 'standard' && styles.unitOptionTextActive,
                  ]}
                >
                  Standard
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.measurementRow}>
            <MeasurementInput
              label="WEIGHT"
              unit={weightUnit}
              value={weight}
              onChangeText={setWeight}
              placeholder={unitPlaceholders.weight(unitSystem)}
              error={errors.weight}
            />
            <View style={{ width: spacing.md }} />
            <MeasurementInput
              label="HEIGHT"
              unit={lengthUnit}
              value={height}
              onChangeText={setHeight}
              placeholder={unitPlaceholders.height(unitSystem)}
              error={errors.height}
            />
            <View style={{ width: spacing.md }} />
            <MeasurementInput
              label="HEAD"
              unit={lengthUnit}
              value={headCircumference}
              onChangeText={setHeadCircumference}
              placeholder={unitPlaceholders.head(unitSystem)}
              error={errors.headCircumference}
            />
          </View>

          {/* Submit Button */}
          <PrimaryButton
            title="Add Child"
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.submitButton}
          />

          {/* Cancel Button */}
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
            ]}
            onPress={handleCancel}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
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
  // ─── Unit toggle ────────────────────────────────────────────────────────────
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    overflow: 'hidden',
  },
  unitOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
  },
  unitOptionActive: {
    backgroundColor: colors.secondary,
  },
  unitOptionText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  unitOptionTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.secondary,
    ...shadows.lg,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: colors.surface,
    ...shadows.lg,
  },
  cancelButtonPressed: {
    backgroundColor: colors.errorDim,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.error,
  },
});
