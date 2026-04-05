/**
 * BabySwitcher
 * Displays current selected baby with dropdown to switch between children
 * Used in app header/navigation area
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@/core/theme';
import { useBabySwitcher } from '@/shared/hooks';
import { BabySelectorModal } from './BabySelectorModal';

interface BabySwitcherProps {
  /** Whether to show the dropdown chevron (only when multiple babies) */
  showChevron?: boolean;
  /** Compact mode for smaller spaces */
  compact?: boolean;
}

/**
 * Baby switcher component
 * Shows selected baby and opens modal to switch between children
 */
export function BabySwitcher({ showChevron = true, compact = false }: BabySwitcherProps) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedBaby, hasMultipleBabies, getAgeText, babies } = useBabySwitcher();

  // Don't render if no babies
  if (!selectedBaby || babies.length === 0) {
    return null;
  }

  const ageText = getAgeText(selectedBaby);
  const shouldShowChevron = showChevron && hasMultipleBabies;

  const handlePress = () => {
    if (hasMultipleBabies) {
      setModalVisible(true);
    }
  };

  const handleAddBaby = () => {
    router.push('/family-management');
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.container,
          compact && styles.containerCompact,
          hasMultipleBabies && pressed && styles.containerPressed,
        ]}
        onPress={handlePress}
        disabled={!hasMultipleBabies}
      >
        {/* Avatar */}
        <View style={[styles.avatarContainer, compact && styles.avatarContainerCompact]}>
          {selectedBaby.photoUri ? (
            <Image
              source={{ uri: selectedBaby.photoUri }}
              style={[styles.avatar, compact && styles.avatarCompact]}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, compact && styles.avatarCompact]}>
              <Text style={[styles.avatarInitial, compact && styles.avatarInitialCompact]}>
                {selectedBaby.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text 
              style={[styles.babyName, compact && styles.babyNameCompact]} 
              numberOfLines={1}
            >
              {selectedBaby.name}
            </Text>
            {shouldShowChevron && (
              <Ionicons
                name="chevron-down"
                size={compact ? 14 : 16}
                color={colors.textSecondary}
                style={styles.chevron}
              />
            )}
          </View>
          {!compact && (
            <Text style={styles.ageText} numberOfLines={1}>
              {ageText}
            </Text>
          )}
        </View>

        {/* Multiple babies indicator */}
        {hasMultipleBabies && !compact && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{babies.length}</Text>
            </View>
          </View>
        )}
      </Pressable>

      {/* Baby Selector Modal */}
      <BabySelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddBaby={handleAddBaby}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.sm,
    paddingRight: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerCompact: {
    padding: spacing.xs,
    paddingRight: spacing.sm,
  },
  containerPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  avatarContainer: {
    marginRight: spacing.sm,
  },
  avatarContainerCompact: {
    marginRight: spacing.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
  },
  avatarCompact: {
    width: 32,
    height: 32,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
  },
  avatarInitialCompact: {
    fontSize: 14,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  babyName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  babyNameCompact: {
    fontSize: 14,
  },
  chevron: {
    marginLeft: spacing.xs,
  },
  ageText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeContainer: {
    marginLeft: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textOnPrimary,
    fontSize: 11,
  },
});
