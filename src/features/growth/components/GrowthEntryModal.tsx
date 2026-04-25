/**
 * Growth Entry Modal Component
 * Modal for adding new growth measurements
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, shadows } from '@/core/theme';
import { useUnitPreference } from '@shared/hooks';
import {
  UnitSystem,
  unitLabels,
  unitPlaceholders,
  toKg,
  toCm,
} from '@shared/utils/unitConversions';

interface GrowthEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    weightKg: number | null;
    heightCm: number | null;
    headCircumferenceCm: number | null;
    date: Date;
  }) => Promise<void>;
  initialDate?: Date;
}

export function GrowthEntryModal({
  visible,
  onClose,
  onSave,
  initialDate = new Date(),
}: GrowthEntryModalProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCirc, setHeadCirc] = useState('');
  const [date, setDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);

  const { unitSystem, setUnitSystem } = useUnitPreference();

  const handleSave = async () => {
    try {
      setLoading(true);

      await onSave({
        weightKg: weight ? toKg(parseFloat(weight), unitSystem) : null,
        heightCm: height ? toCm(parseFloat(height), unitSystem) : null,
        headCircumferenceCm: headCirc ? toCm(parseFloat(headCirc), unitSystem) : null,
        date,
      });

      // Reset form
      setWeight('');
      setHeight('');
      setHeadCirc('');
      onClose();
    } catch (error) {
      console.error('Error saving growth entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const isValid = weight || height || headCirc;

  const weightUnit = unitLabels.weight(unitSystem);
  const lengthUnit = unitLabels.length(unitSystem);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>New Entry</Text>
            <Text style={styles.subtitle}>
              Today,{' '}
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>

          {/* Unit System Toggle */}
          <View style={styles.unitToggleRow}>
            <Text style={styles.unitToggleLabel}>UNITS</Text>
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

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Weight Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                WEIGHT ({weightUnit.toUpperCase()})
              </Text>
              <TextInput
                style={styles.input}
                placeholder={unitPlaceholders.weight(unitSystem)}
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            {/* Height Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                HEIGHT ({lengthUnit.toUpperCase()})
              </Text>
              <TextInput
                style={styles.input}
                placeholder={unitPlaceholders.height(unitSystem)}
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={height}
                onChangeText={setHeight}
              />
            </View>

            {/* Head Circumference Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                HEAD CIRC. ({lengthUnit.toUpperCase()})
              </Text>
              <TextInput
                style={styles.input}
                placeholder={unitPlaceholders.head(unitSystem)}
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={headCirc}
                onChangeText={setHeadCirc}
              />
            </View>
          </ScrollView>

          {/* Save Button */}
          <Pressable
            style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!isValid || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <>
                <Text style={styles.saveButtonText}>Save Entry</Text>
                <Ionicons name="checkmark" size={20} color={colors.textOnPrimary} />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    maxHeight: '80%',
    ...shadows.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  // ─── Unit toggle ────────────────────────────────────────────────────────────
  unitToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  unitToggleLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    overflow: 'hidden',
  },
  unitOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  unitOptionActive: {
    backgroundColor: colors.secondary,
  },
  unitOptionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  unitOptionTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  // ─── Form ───────────────────────────────────────────────────────────────────
  form: {
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  input: {
    ...typography.h2,
    color: colors.textPrimary,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  saveButton: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  saveButtonDisabled: {
    backgroundColor: colors.buttonDisabled,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
    marginRight: spacing.xs,
  },
});
