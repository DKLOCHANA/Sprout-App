/**
 * DashboardScreen
 * Home tab showing baby's age, upcoming milestones, quick actions, and sleep chart
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/core/theme';
import { useDashboard } from '../hooks';
import { useSleep, SleepChart, LogSleepModal } from '@/features/sleep';
import {
  AgeDisplay,
  UpNextCard,
  QuickActions,
} from '../components';

export function DashboardScreen() {
  const router = useRouter();
  const [sleepModalVisible, setSleepModalVisible] = useState(false);

  const {
    baby,
    exactAge,
    babyAgeMonths,
    upNextMilestones,
    getUpNextStatus,
  } = useDashboard();

  // Navigation handlers
  const handleLogGrowth = useCallback(() => {
    router.push('/growth');
  }, [router]);

  const handleLogMilestone = useCallback(() => {
    router.push('/milestones');
  }, [router]);

  const handleMilestonePress = useCallback(() => {
    router.push('/milestones');
  }, [router]);

  const handleSleepChartPress = useCallback(() => {
    setSleepModalVisible(true);
  }, []);

  // Get first up next milestone
  const primaryMilestone = upNextMilestones[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Age Display */}
        <AgeDisplay 
          months={exactAge.months} 
          days={exactAge.days}
          babyName={baby?.name}
        />

        {/* Up Next Milestone Card */}
        {primaryMilestone && (
          <UpNextCard
            milestone={primaryMilestone}
            status={getUpNextStatus(primaryMilestone.id)}
            babyAgeMonths={babyAgeMonths}
            onPress={handleMilestonePress}
          />
        )}

        {/* Quick Actions */}
        <QuickActions
          onLogGrowth={handleLogGrowth}
          onLogMilestone={handleLogMilestone}
        />

        {/* Sleep Quality Chart */}
        <View style={styles.sleepSection}>
          <SleepChart onLogSleep={handleSleepChartPress} />
        </View>
      </ScrollView>

      {/* Log Sleep Modal */}
      <LogSleepModal
        visible={sleepModalVisible}
        onClose={() => setSleepModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing['2xl'],
  },
  sleepSection: {
    paddingHorizontal: spacing.lg,
  },
});
