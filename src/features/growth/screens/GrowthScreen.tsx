/**
 * Growth Tracker Screen
 * Main screen for tracking baby's growth with WHO/CDC percentiles
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBabyStore } from '@/features/baby-profile/store';
import { useGrowthAnalysis } from '@/shared/hooks';
import { GrowthChart } from '@/shared/components/charts';
import { AlertBanner } from '../components/AlertBanner';
import { PercentileBadge } from '../components/PercentileBadge';
import { MetricCard } from '../components/MetricCard';
import { GrowthEntryModal } from '../components/GrowthEntryModal';
import { colors, typography, spacing } from '@/core/theme';
import type { GrowthEntry } from '@/features/baby-profile/types';

export function GrowthScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'height' | 'headCircumference'>('weight');
  const { height: screenHeight } = useWindowDimensions();

  const { getSelectedBaby, addGrowthEntry, getGrowthEntriesForBaby } = useBabyStore();
  const baby = getSelectedBaby();
  const growthEntries = baby ? getGrowthEntriesForBaby(baby.id) : [];

  const { enhancedEntries, alerts, latestEntry, latestPercentiles } = useGrowthAnalysis(
    baby,
    growthEntries
  );

  const chartHeight = Math.max(220, screenHeight * 0.42);

  const handleSaveEntry = async (data: {
    weightKg: number | null;
    heightCm: number | null;
    headCircumferenceCm: number | null;
    date: Date;
  }) => {
    if (!baby) return;

    const newEntry: GrowthEntry = {
      id: `growth-${Date.now()}`,
      babyId: baby.id,
      date: data.date.toISOString(),
      weightKg: data.weightKg,
      heightCm: data.heightCm,
      headCircumferenceCm: data.headCircumferenceCm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addGrowthEntry(newEntry);
  };

  if (!baby) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="person-add-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Baby Profile</Text>
          <Text style={styles.emptyText}>
            Please add a baby profile to start tracking growth
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            Growth{'\n'}
            <Text style={styles.headerTitleAccent}>Trajectory</Text>
          </Text>
        </View>
      </View>

      {/* Main Content - No Scroll */}
      <View style={styles.content}>
        {/* Alerts */}
        {activeAlerts.length > 0 && (
          <View style={styles.alertsSection}>
            {activeAlerts.slice(0, 1).map(alert => (
              <AlertBanner key={alert.id} alert={alert} compact />
            ))}
          </View>
        )}

        {/* Growth Chart - Full Width */}
        <View style={styles.chartSection}>
          {latestPercentiles?.weight !== undefined && (
            <View style={styles.chartPercentileBadgeContainer}>
              <PercentileBadge 
                percentile={latestPercentiles.weight} 
                size="large"
              />
            </View>
          )}
          
          <GrowthChart
            baby={baby}
            entries={enhancedEntries}
            metric={selectedMetric}
            height={chartHeight}
          />
        </View>

        {/* Metric Cards */}
        {latestEntry && (
          <View style={styles.metricsSection}>
            <View style={styles.metricsRow}>
              {latestEntry.weightKg && (
                <MetricCard
                  label="WEIGHT"
                  value={latestEntry.weightKg.toFixed(1)}
                  unit="kg"
                />
              )}
              {latestEntry.heightCm && (
                <MetricCard
                  label="HEIGHT"
                  value={latestEntry.heightCm.toFixed(0)}
                  unit="cm"
                />
              )}
              {latestEntry.headCircumferenceCm && (
                <MetricCard
                  label="HEAD"
                  value={latestEntry.headCircumferenceCm.toFixed(0)}
                  unit="cm"
                />
              )}
            </View>
          </View>
        )}

        {/* Empty State for No Data */}
        {enhancedEntries.length === 0 && (
          <View style={styles.noDataSection}>
            <Text style={styles.noDataText}>
              Start tracking your baby's growth journey
            </Text>
            <Text style={styles.noDataSubtext}>
              Add your first measurement to see WHO/CDC percentile charts
            </Text>
          </View>
        )}

        {/* Add Entry Button - Fixed at bottom */}
        <View style={styles.addButtonContainer}>
          <Pressable 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonTitle}>New Entry</Text>
          </Pressable>
        </View>
      </View>

      {/* Growth Entry Modal */}
      <GrowthEntryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEntry}
      />
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  chartPercentileBadgeContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 40,
    lineHeight: 48,
    fontStyle: 'italic',
    color: colors.textPrimary,
  },
  headerTitleAccent: {
    color: colors.secondary,
    fontStyle: 'italic',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  alertsSection: {
    marginBottom: spacing.sm,
  },
  chartSection: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  metricsSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  addButtonContainer: {
    paddingBottom: spacing.md,
  },
  addButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  addButtonTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.surface,
  },
  noDataSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  noDataText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  noDataSubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});