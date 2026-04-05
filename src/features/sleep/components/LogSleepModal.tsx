/**
 * LogSleepModal Component
 * Bottom drawer for logging daily sleep
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '@/core/theme';
import { useSleep } from '../hooks';
import { useSleepStore } from '../store';

interface LogSleepModalProps {
  visible: boolean;
  onClose: () => void;
}

const HOURS_OPTIONS = Array.from({ length: 19 }, (_, i) => i); // 0-18 hours
const MINUTES_OPTIONS = [0, 15, 30, 45];

export function LogSleepModal({ visible, onClose }: LogSleepModalProps) {
  const { baby, formatSleepDuration } = useSleep();
  const { entries, addSleepEntry } = useSleepStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(0);

  // Load existing entry for selected date
  useEffect(() => {
    if (!baby || !visible) return;

    const dateString = selectedDate.toISOString().split('T')[0];
    const existingEntry = entries.find(
      (e) => e.babyId === baby.id && e.date === dateString
    );

    if (existingEntry) {
      setHours(existingEntry.sleepHours);
      setMinutes(existingEntry.sleepMinutes);
    } else {
      // Reset to defaults if no entry
      setHours(10);
      setMinutes(0);
    }
  }, [baby, selectedDate, entries, visible]);

  // Reset to today when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedDate(new Date());
    }
  }, [visible]);

  const handleSave = () => {
    if (!baby) return;

    const dateString = selectedDate.toISOString().split('T')[0];
    addSleepEntry({
      babyId: baby.id,
      date: dateString,
      sleepHours: hours,
      sleepMinutes: minutes,
    });
    onClose();
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const adjustHours = (delta: number) => {
    setHours((prev) => Math.max(0, Math.min(18, prev + delta)));
  };

  const adjustMinutes = (delta: number) => {
    const currentIndex = MINUTES_OPTIONS.indexOf(minutes);
    const newIndex = currentIndex + delta;
    
    if (newIndex < 0) {
      if (hours > 0) {
        setHours(hours - 1);
        setMinutes(45);
      }
    } else if (newIndex >= MINUTES_OPTIONS.length) {
      if (hours < 18) {
        setHours(hours + 1);
        setMinutes(0);
      }
    } else {
      setMinutes(MINUTES_OPTIONS[newIndex]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
            >
              <View style={styles.modalContent}>
                {/* Handle Bar */}
                <View style={styles.handleBar} />

                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Log Sleep</Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Date Picker */}
                <View style={styles.datePickerContainer}>
                  <Text style={styles.label}>Date</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Ionicons name="calendar-outline" size={20} color={colors.secondary} />
                    <Text style={styles.dateButtonText}>
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Date Picker Modal (iOS) or Inline (Android) */}
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}

                {/* Sleep Duration Picker */}
                <View style={styles.durationContainer}>
                  <Text style={styles.label}>Total Sleep (24hr)</Text>
                  
                  <View style={styles.pickerRow}>
                    {/* Hours */}
                    <View style={styles.pickerColumn}>
                      <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => adjustHours(1)}
                      >
                        <Ionicons name="chevron-up" size={24} color={colors.secondary} />
                      </TouchableOpacity>
                      
                      <View style={styles.valueContainer}>
                        <Text style={styles.valueText}>{hours}</Text>
                        <Text style={styles.unitText}>hr</Text>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => adjustHours(-1)}
                      >
                        <Ionicons name="chevron-down" size={24} color={colors.secondary} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.separator}>:</Text>

                    {/* Minutes */}
                    <View style={styles.pickerColumn}>
                      <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => adjustMinutes(1)}
                      >
                        <Ionicons name="chevron-up" size={24} color={colors.secondary} />
                      </TouchableOpacity>
                      
                      <View style={styles.valueContainer}>
                        <Text style={styles.valueText}>{minutes.toString().padStart(2, '0')}</Text>
                        <Text style={styles.unitText}>min</Text>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => adjustMinutes(-1)}
                      >
                        <Ionicons name="chevron-down" size={24} color={colors.secondary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Total Display */}
                  <Text style={styles.totalText}>
                    Total: {formatSleepDuration(hours, minutes)}
                  </Text>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save Sleep Log</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  datePickerContainer: {
    marginBottom: spacing.lg,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  dateButtonText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  durationContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerColumn: {
    alignItems: 'center',
  },
  pickerButton: {
    padding: spacing.sm,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.md,
    minWidth: 80,
    justifyContent: 'center',
  },
  valueText: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  unitText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  separator: {
    ...typography.h1,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  totalText: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.secondary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});
