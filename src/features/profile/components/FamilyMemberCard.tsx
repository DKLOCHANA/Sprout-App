/**
 * FamilyMemberCard Component
 * Card showing a baby/child with selection state and edit/delete actions
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, shadows } from '@/core/theme';
import type { Baby } from '@/features/baby-profile/types';

interface FamilyMemberCardProps {
  baby: Baby;
  ageText: string;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function FamilyMemberCard({
  baby,
  ageText,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: FamilyMemberCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.containerSelected,
        pressed && styles.containerPressed,
      ]}
      onPress={onSelect}
    >
      {/* Inner wrapper clips content without clipping shadow */}
      <View style={styles.innerClip}>
        {/* Selection indicator */}
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.textOnPrimary} />
            <Text style={styles.selectedText}>Active</Text>
          </View>
        )}

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

        {/* Baby Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {baby.name}
          </Text>
          <Text style={styles.age} numberOfLines={1}>
            {ageText}
          </Text>
          <View style={styles.detailsRow}>
            <View style={styles.genderBadge}>
              <Ionicons
                name={baby.biologicalSex === 'male' ? 'male' : 'female'}
                size={12}
                color={baby.biologicalSex === 'male' ? colors.info : colors.feeding}
              />
              <Text
                style={[
                  styles.genderText,
                  { color: baby.biologicalSex === 'male' ? colors.info : colors.feeding },
                ]}
              >
                {baby.biologicalSex === 'male' ? 'Boy' : 'Girl'}
              </Text>
            </View>
            {baby.isPremature && (
              <View style={styles.prematureBadge}>
                <Text style={styles.prematureText}>Premature</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={onEdit}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="pencil" size={18} color={colors.secondary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.lg,
    shadowOpacity: 0.25,
    position: 'relative',
  },
  containerSelected: {
    borderColor: colors.secondary,
  },
  containerPressed: {
    opacity: 0.95,
  },
  innerClip: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  selectedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomLeftRadius: radii.md,
    gap: 4,
  },
  selectedText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...typography.h2,
    color: colors.textOnDark,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  age: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  genderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  genderText: {
    ...typography.caption,
    fontWeight: '500',
  },
  prematureBadge: {
    backgroundColor: colors.warningDim,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  prematureText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginLeft: spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.infoDim,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonPressed: {
    backgroundColor: colors.surfaceTertiary,
  },
  deleteButton: {
    backgroundColor: colors.errorDim,
  },
  deleteButtonPressed: {
    backgroundColor: colors.error,
  },
});