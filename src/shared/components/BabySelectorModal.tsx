/**
 * BabySelectorModal
 * Modal for selecting which baby to view in the app
 * Shows list of babies with selection state and add baby option
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, shadows } from '@/core/theme';
import { useBabySwitcher, BabyDisplayInfo } from '@/shared/hooks';

interface BabySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onAddBaby?: () => void;
}

interface BabyItemProps {
  baby: BabyDisplayInfo;
  onSelect: () => void;
}

/**
 * Individual baby item in the selector list
 */
function BabyItem({ baby, onSelect }: BabyItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.babyItem,
        baby.isSelected && styles.babyItemSelected,
        pressed && styles.babyItemPressed,
      ]}
      onPress={onSelect}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {baby.photoUri ? (
          <Image source={{ uri: baby.photoUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {baby.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.babyInfo}>
        <Text style={styles.babyName}>{baby.name}</Text>
        <Text style={styles.babyAge}>{baby.ageText}</Text>
      </View>

      {/* Selection indicator */}
      {baby.isSelected && (
        <View style={styles.checkContainer}>
          <Ionicons name="checkmark-circle" size={24} color={colors.secondary} />
        </View>
      )}
    </Pressable>
  );
}

/**
 * Modal component for baby selection
 */
export function BabySelectorModal({
  visible,
  onClose,
  onAddBaby,
}: BabySelectorModalProps) {
  const { babiesForDisplay, selectBaby } = useBabySwitcher();

  const handleSelectBaby = (babyId: string) => {
    selectBaby(babyId);
    onClose();
  };

  const handleAddBaby = () => {
    onClose();
    onAddBaby?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Child</Text>
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Baby List */}
        <FlatList
          data={babiesForDisplay}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BabyItem
              baby={item}
              onSelect={() => handleSelectBaby(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            onAddBaby ? (
              <Pressable
                style={({ pressed }) => [
                  styles.addBabyButton,
                  pressed && styles.addBabyButtonPressed,
                ]}
                onPress={handleAddBaby}
              >
                <View style={styles.addIconContainer}>
                  <Ionicons name="add" size={24} color={colors.textOnDark} />
                </View>
                <Text style={styles.addBabyText}>Add Another Child</Text>
              </Pressable>
            ) : null
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonPressed: {
    backgroundColor: colors.surfaceTertiary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  babyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.lg,
  },
  babyItemSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.infoDim,
  },
  babyItemPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...typography.h2,
    color: colors.textOnDark,
  },
  babyInfo: {
    flex: 1,
  },
  babyName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  babyAge: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  checkContainer: {
    marginLeft: spacing.sm,
  },
  addBabyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginTop: spacing.sm,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
    ...shadows.lg,
  },
  addBabyButtonPressed: {
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
  addBabyText: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '600',
  },
});
