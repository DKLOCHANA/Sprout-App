/**
 * Growth Tracker Screen
 * Main screen for tracking baby's growth with WHO/CDC percentiles
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBabyStore } from '@/features/baby-profile/store';
import { useAuthStore } from '@/features/auth/store';
import { useGrowthAnalysis } from '@/shared/hooks';
import { GrowthChart } from '@/shared/components/charts';
import { EmptyState } from '@/shared/components';
import { AlertBanner } from '../components/AlertBanner';
import { PercentileBadge } from '../components/PercentileBadge';
import { MetricCard } from '../components/MetricCard';
import { GrowthEntryModal } from '../components/GrowthEntryModal';
import { babyService } from '@/core/firebase';
import { colors, typography, spacing, shadows } from '@/core/theme';
import type { GrowthEntry } from '@/features/baby-profile/types';

export function GrowthScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'height' | 'headCircumference'>('weight');
  const { height: screenHeight } = useWindowDimensions();

  const { getSelectedBaby, addGrowthEntry, getGrowthEntriesForBaby } = useBabyStore();
  const { user } = useAuthStore();
  const baby = getSelectedBaby();
  const growthEntries = baby ? getGrowthEntriesForBaby(baby.id) : [];

  const { enhancedEntries, alerts, latestEntry, latestPercentiles } = useGrowthAnalysis(
    baby,
    growthEntries
  );

  const chartHeight = Math.max(220, screenHeight * 0.42);

  const handleAddBaby = useCallback(() => {
    router.push('/add-baby');
  }, [router]);

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

    // Save locally first
    addGrowthEntry(newEntry);

    // Sync to Firestore
    if (user?.id) {
      babyService.addGrowthEntry(user.id, baby.id, newEntry).catch((error) => {
        console.warn('Failed to sync growth entry to Firestore:', error);
      });
    }
  };

  if (!baby) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="person-add-outline"
          title="No Child Selected"
          message="Add a child to start tracking their growth with WHO/CDC percentile charts."
          action={{
            label: 'Add Child',
            onPress: handleAddBaby,
          }}
        />
      </SafeAreaView>
    );
  }

  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Add Entry Button */}
        <View style={styles.addButtonContainer}>
          <Pressable 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonTitle}>New Entry</Text>
          </Pressable>
        </View>

        {/* DEV: Generate Test Data */}
        {__DEV__ && (
          <View style={styles.addButtonContainer}>
            <Pressable
              style={[styles.addButton, { backgroundColor: colors.warning }]}
              onPress={() => {
                if (!baby) return;
                const now = Date.now();
                const dob = new Date(baby.dateOfBirth).getTime();
                const babyAgeDays = Math.floor((now - dob) / 86_400_000);

                // Generate 30 random days within the past 12 months (but not before birth)
                const maxDaysBack = Math.min(365, babyAgeDays);
                const randomDays = Array.from({ length: 30 }, () =>
                  Math.floor(Math.random() * maxDaysBack)
                ).sort((a, b) => b - a); // newest first

                for (const daysAgo of randomDays) {
                  const date = new Date(now - daysAgo * 86_400_000);
                  const ageMonths = (now - dob) / 86_400_000 / 30.44 - daysAgo / 30.44;
                  const clampedAge = Math.max(0, ageMonths);

                  // Realistic-ish growth curves with some noise
                  const weightKg = +(3.3 + clampedAge * 0.6 + (Math.random() - 0.5) * 0.4).toFixed(2);
                  const heightCm = +(49 + clampedAge * 2.5 + (Math.random() - 0.5) * 2).toFixed(1);
                  const headCm = +(34 + clampedAge * 0.8 + (Math.random() - 0.5) * 1).toFixed(1);

                  const entry: GrowthEntry = {
                    id: `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    babyId: baby.id,
                    date: date.toISOString(),
                    weightKg: Math.max(2.5, weightKg),
                    heightCm: Math.max(45, heightCm),
                    headCircumferenceCm: Math.max(32, headCm),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };
                  addGrowthEntry(entry);
                }
              }}
            >
              <Text style={styles.addButtonTitle}>🧪 Generate 30 Test Entries</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

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
    paddingBottom: spacing.md,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  alertsSection: {
    marginBottom: spacing.sm,
  },
  chartSection: {
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  metricsSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  addButtonContainer: {
    paddingTop: spacing.md,
  },
  addButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadows.lg,
  },
  addButtonTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.surface,
  },
  noDataSection: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
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
});