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

  const handleSave = async () => {
    try {
      setLoading(true);
      
      await onSave({
        weightKg: weight ? parseFloat(weight) : null,
        heightCm: height ? parseFloat(height) : null,
        headCircumferenceCm: headCirc ? parseFloat(headCirc) : null,
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
              Today, {date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Text>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Weight Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>WEIGHT (KG)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            {/* Height Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>HEIGHT (CM)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={height}
                onChangeText={setHeight}
              />
            </View>

            {/* Head Circumference Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>HEAD CIRC. (CM)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
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
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.secondary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
