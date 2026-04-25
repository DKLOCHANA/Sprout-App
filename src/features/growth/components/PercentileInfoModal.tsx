/**
 * Percentile Info Modal
 * Shows a WHO-based explanation of a percentile value with a colour-coded table.
 * Fully responsive — adapts to screen size.
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, shadows } from '@/core/theme';
import { getPercentileCategory, PERCENTILE_RANGES } from '@/features/growth/types/growth.types';
import type { ColorKey } from '@/core/theme';

// ─── WHO explanations per category ──────────────────────────────────────────

const WHO_EXPLANATIONS: Record<
  keyof typeof PERCENTILE_RANGES,
  { title: string; meaning: string }
> = {
  VERY_LOW: {
    title: 'Below 3rd Percentile',
    meaning:
      "Your baby's measurement is below the 3rd percentile on the WHO growth chart. They are smaller than 97 out of 100 babies of the same age and sex worldwide.\n\nWHO considers this a zone that warrants careful monitoring. It does not automatically signal a problem, but consistent readings below this line may indicate undernutrition or another health factor worth discussing with your pediatrician.",
  },
  LOW: {
    title: '3rd \u2013 15th Percentile',
    meaning:
      "Your baby is in the lower range of normal growth according to WHO standards. They are smaller than roughly 85\u201397\u2009% of babies the same age and sex.\n\nWHO considers this within an acceptable range for many healthy babies. A downward trend across check-ups is more meaningful to watch than any single low reading.",
  },
  NORMAL: {
    title: 'Healthy Growth Range (15th \u2013 85th)',
    meaning:
      "Your baby is growing within the healthy range on the WHO growth chart \u2014 where most babies fall. This indicates good nutrition and development.\n\nWHO defines this range as optimal for child growth. Consistent readings here are a positive sign.",
  },
  HIGH: {
    title: '85th \u2013 97th Percentile',
    meaning:
      "Your baby's measurement is above average compared to WHO growth standards \u2014 larger than roughly 85\u201397\u2009% of babies the same age and sex.\n\nThis may be completely natural for some babies. WHO notes that a consistently upward trend, especially for weight, is worth discussing with your pediatrician to rule out accelerated gain.",
  },
  VERY_HIGH: {
    title: 'Above 97th Percentile',
    meaning:
      "Your baby's measurement is above the 97th percentile \u2014 larger than 97 out of 100 babies of the same age and sex worldwide according to WHO.\n\nWHO recommends discussing this with your pediatrician, particularly for weight measurements, as it may benefit from professional guidance.",
  },
};

// ─── Colour legend table rows ────────────────────────────────────────────────

const LEGEND_ROWS: {
  color: string;
  label: string;
  range: string;
  status: string;
  statusColor: string;
}[] = [
  {
    color: colors.percentileVeryLow,
    label: 'Red',
    range: '< 3rd or > 97th',
    status: 'See Doctor',
    statusColor: colors.percentileVeryLow,
  },
  {
    color: colors.percentileLow,
    label: 'Amber',
    range: '3rd \u2013 15th or 85th \u2013 97th',
    status: 'Monitor',
    statusColor: colors.percentileLow,
  },
  {
    color: colors.percentileNormal,
    label: 'Green',
    range: '15th \u2013 85th',
    status: 'Healthy',
    statusColor: colors.percentileNormal,
  },
];

// ─────────────────────────────────────────────────────────────────────────────

interface PercentileInfoModalProps {
  visible: boolean;
  percentile: number;
  onClose: () => void;
}

export function PercentileInfoModal({
  visible,
  percentile,
  onClose,
}: PercentileInfoModalProps) {
  const { width, height } = useWindowDimensions();

  const category = getPercentileCategory(percentile);
  const config = PERCENTILE_RANGES[category];
  const colorKey = config.color as ColorKey;
  const accentColor = colors[colorKey];
  const { title, meaning } = WHO_EXPLANATIONS[category];

  // Responsive sheet width — cap at 480 on large screens (iPad)
  const sheetWidth = Math.min(width, 480);
  // Responsive max height — 80 % of screen or 620 at most
  const sheetMaxHeight = Math.min(height * 0.80, 620);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Tap-outside to dismiss */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            { width: sheetWidth, maxHeight: sheetMaxHeight },
          ]}
        >
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.percentilePill, { backgroundColor: `${accentColor}18` }]}>
              <Text style={[styles.percentileValue, { color: accentColor }]}>
                {Math.round(percentile)}th
              </Text>
              <Text style={[styles.percentileLabel, { color: accentColor }]}>
                {' '}Percentile
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={12}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            {/* Section title */}
            <Text style={styles.sectionTitle}>{title}</Text>

            {/* WHO Meaning */}
            <View style={[styles.meaningCard, { borderLeftColor: accentColor }]}>
              <Text style={styles.sourceTag}>WHO Child Growth Standards</Text>
              <Text style={styles.meaningText}>{meaning}</Text>
            </View>

            {/* Colour legend table */}
            <Text style={styles.legendHeading}>Colour Guide</Text>
            <View style={styles.table}>
              {/* Table header */}
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                <Text style={[styles.tableCell, styles.tableHeaderText, styles.colColor]}>
                  Colour
                </Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, styles.colRange]}>
                  WHO Percentile Range
                </Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, styles.colStatus]}>
                  Status
                </Text>
              </View>

              {/* Table rows */}
              {LEGEND_ROWS.map((row, index) => (
                <View
                  key={row.label}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                  ]}
                >
                  {/* Colour swatch + label */}
                  <View style={[styles.tableCell, styles.colColor, styles.swatchCell]}>
                    <View style={[styles.swatch, { backgroundColor: row.color }]} />
                    <Text style={styles.swatchLabel}>{row.label}</Text>
                  </View>

                  {/* Range */}
                  <Text style={[styles.tableCell, styles.rangeText, styles.colRange]}>
                    {row.range}
                  </Text>

                  {/* Status badge */}
                  <View style={[styles.tableCell, styles.colStatus, styles.statusCell]}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${row.statusColor}18` },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: row.statusColor }]}>
                        {row.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.disclaimer}>
              Percentiles compare your baby to others of the same age and sex. They are a
              tool to track trends over time, not a single-point diagnosis. Always consult
              your pediatrician with concerns.
            </Text>
          </ScrollView>

          {/* Close button */}
          <Pressable style={[styles.doneButton, { backgroundColor: accentColor }]} onPress={onClose}>
            <Text style={styles.doneButtonText}>Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    ...shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  percentilePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  percentileValue: {
    ...typography.h2,
    fontWeight: '700',
    fontSize: 22,
  },
  percentileLabel: {
    ...typography.body,
    fontWeight: '600',
    fontSize: 14,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  meaningCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    marginBottom: spacing.lg,
  },
  sourceTag: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  meaningText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  legendHeading: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  table: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  tableHeaderRow: {
    backgroundColor: colors.surfaceTertiary,
    minHeight: 36,
  },
  tableRowEven: {
    backgroundColor: colors.surface,
  },
  tableRowOdd: {
    backgroundColor: colors.surfaceSecondary,
  },
  tableCell: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
  tableHeaderText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontSize: 10,
  },
  // Column widths (proportional)
  colColor: {
    flex: 1.2,
  },
  colRange: {
    flex: 2.2,
  },
  colStatus: {
    flex: 1.2,
  },
  swatchCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 6,
  },
  swatchLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    fontSize: 12,
  },
  rangeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  statusCell: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 11,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  doneButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  doneButtonText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.surface,
    fontSize: 16,
  },
});
