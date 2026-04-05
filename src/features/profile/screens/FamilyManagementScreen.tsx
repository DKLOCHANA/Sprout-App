/**
 * FamilyManagementScreen
 * Screen for managing family members (children)
 * Allows viewing, selecting, editing, and deleting children
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@/core/theme';
import { useFamilyManagement } from '../hooks';
import { FamilyMemberCard } from '../components';
import { useBabyStore } from '@/features/baby-profile/store';
import { useBabySwitcher } from '@/shared/hooks';

export function FamilyManagementScreen() {
  const router = useRouter();
  const {
    babies,
    selectedBabyId,
    isDeleteConfirmVisible,
    pendingDeleteBaby,
    isLoading,
    selectBaby,
    handleEditBaby,
    handleDeleteBaby,
    confirmDelete,
    cancelDelete,
    handleAddBaby,
  } = useFamilyManagement();

  const { getAgeText } = useBabySwitcher();
  const rawBabies = useBabyStore((state) => state.babies);

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Family Management</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Manage your children's profiles. Tap on a child to set them as active,
            or use the buttons to edit or delete their profile.
          </Text>
        </View>

        {/* Children List */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            Children ({babies.length})
          </Text>
          
          {rawBabies.map((baby) => {
            const displayBaby = babies.find((b) => b.id === baby.id);
            return (
              <FamilyMemberCard
                key={baby.id}
                baby={baby}
                ageText={displayBaby?.ageText || getAgeText(baby)}
                isSelected={baby.id === selectedBabyId}
                onSelect={() => selectBaby(baby.id)}
                onEdit={() => handleEditBaby(baby.id)}
                onDelete={() => handleDeleteBaby(baby)}
              />
            );
          })}
        </View>

        {/* Add Child Button */}
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={handleAddBaby}
        >
          <View style={styles.addIconContainer}>
            <Ionicons name="add" size={28} color={colors.textOnPrimary} />
          </View>
          <View style={styles.addTextContainer}>
            <Text style={styles.addTitle}>Add Another Child</Text>
            <Text style={styles.addSubtitle}>
              Track milestones for another little one
            </Text>
          </View>
        </Pressable>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={48} color={colors.error} />
            </View>
            <Text style={styles.modalTitle}>Delete Profile?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete {pendingDeleteBaby?.name}'s profile?
              This will permanently remove all their milestones, growth data,
              sleep records, and memories.
            </Text>
            <Text style={styles.modalWarning}>
              This action cannot be undone.
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.cancelButton,
                  pressed && styles.cancelButtonPressed,
                ]}
                onPress={cancelDelete}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.deleteButton,
                  pressed && styles.deleteButtonPressed,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.textOnPrimary} size="small" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  descriptionContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
  },
  addButtonPressed: {
    backgroundColor: colors.infoDim,
  },
  addIconContainer: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  addTextContainer: {
    flex: 1,
  },
  addTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 2,
  },
  addSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    backgroundColor: colors.errorDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalWarning: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: colors.surfaceSecondary,
  },
  cancelButtonPressed: {
    backgroundColor: colors.surfaceTertiary,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  deleteButtonPressed: {
    backgroundColor: colors.errorDim,
  },
  deleteButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
