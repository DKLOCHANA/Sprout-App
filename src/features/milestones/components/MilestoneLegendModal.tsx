/**
 * MilestoneLegendModal
 * Modal that shows milestone tracking instructions on first visit
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii, shadows } from '@/core/theme';

interface MilestoneLegendModalProps {
  visible: boolean;
  onClose: () => void;
}

export function MilestoneLegendModal({
  visible,
  onClose,
}: MilestoneLegendModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Title */}
          <Text style={styles.title}>How to track milestones</Text>

          <Text style={styles.subtitle}>
            Tap the circle to mark a milestone as achieved. Tap again to undo.
          </Text>

          {/* Legend Items */}
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.statusButton, styles.statusNotYet]}>
                <View style={styles.circleEmpty} />
              </View>
              <Text style={styles.legendText}>Not yet achieved</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.statusButton, styles.statusAchieved]}>
                <Ionicons name="checkmark" size={14} color={colors.textOnPrimary} />
              </View>
              <Text style={styles.legendText}>Achieved 🎉</Text>
            </View>
          </View>

          <Text style={styles.note}>
            Every child develops at their own pace. Don't worry if a milestone hasn't happened yet.
          </Text>

          {/* Got it button */}
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Got it!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...shadows.lg,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  note: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: spacing.lg,
  },
  legendItems: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  statusNotYet: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  statusAchieved: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  circleEmpty: {
    width: 0,
    height: 0,
  },
  legendText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: radii.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
});
