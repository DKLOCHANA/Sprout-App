/**
 * ProfileScreen
 * Main profile screen with user info, PDF report, and settings
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radii, shadows } from '@/core/theme';
import {
  ProfileHeader,
  PediatricianReportCard,
  SettingsSection,
  SettingsRow,
} from '../components';
import { useProfileViewModel } from '../hooks/useProfileViewModel';
import { usePdfReport } from '../hooks/usePdfReport';

export function ProfileScreen() {
  const {
    userName,
    userPhotoUrl,
    babyPhotoUri,
    profileStats,
    profilePhotoUri,
    handleSignOut,
    handleDeleteAccount,
    handleFamilyManagement,
    handlePrivacyPolicy,
    handleTermsOfService,
    handleProfilePhotoChange,
  } = useProfileViewModel();

  const { isGenerating, generateReport } = usePdfReport();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeader
          name={userName}
          photoUri={profilePhotoUri || babyPhotoUri || userPhotoUrl}
          onPhotoChange={handleProfilePhotoChange}
        />

        {/* Pediatrician Report Card */}
        <PediatricianReportCard
          stats={profileStats}
          onGeneratePdf={generateReport}
          isGenerating={isGenerating}
        />

        {/* Account Settings Section */}
        <SettingsSection title="Account Settings">
          <SettingsRow
            icon="people"
            iconBackgroundColor={colors.infoDim}
            label="Family Management"
            onPress={handleFamilyManagement}
            isLast
          />
        </SettingsSection>

        {/* Privacy & Security Section */}
        <SettingsSection title="Privacy & Security">
          <SettingsRow
            icon="shield-checkmark"
            iconBackgroundColor={colors.primaryDim}
            label="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingsRow
            icon="document-text"
            iconBackgroundColor={colors.surfaceTertiary}
            label="Terms of Service"
            onPress={handleTermsOfService}
            isLast
          />
        </SettingsSection>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {/* Sign Out Button */}
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.signOutButtonPressed,
            ]}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>

          {/* Delete Account Button */}
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  actionButtonsContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  signOutButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.lg,
  },
  signOutButtonPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  signOutText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.lg,
  },
  deleteButtonPressed: {
    backgroundColor: colors.errorDim,
  },
  deleteText: {
    ...typography.button,
    color: colors.textOnDark,
  },
});
