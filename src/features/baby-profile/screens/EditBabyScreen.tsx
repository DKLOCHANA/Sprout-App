/**
 * EditBabyScreen
 * Screen for editing an existing baby's profile
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, shadows } from '@core/theme';
import {
  Input,
  DatePicker,
  Toggle,
  Switch,
  PrimaryButton,
  ImagePicker,
} from '@shared/components/ui';
import { useEditBabyViewModel } from '../hooks';

export function EditBabyScreen() {
  const {
    baby,
    isLoading,
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
    errors,
    isSubmitting,
    handleSubmit,
    handleCancel,
  } = useEditBabyViewModel();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
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
            value={biologicalSex}
            onChange={setBiologicalSex}
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

          {/* Submit Button */}
          <PrimaryButton
            title="Save Changes"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
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
