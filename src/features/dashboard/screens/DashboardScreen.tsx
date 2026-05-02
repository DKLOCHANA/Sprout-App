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
import { BabySelectorModal, EmptyState } from '@/shared/components';
import { useBabySwitcher } from '@/shared/hooks';
import {
  AgeDisplay,
  UpNextCard,
  QuickActions,
} from '../components';
import { setPendingMilestoneCategory } from '@/features/milestones';

export function DashboardScreen() {
  const router = useRouter();
  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [babySelectorVisible, setBabySelectorVisible] = useState(false);

  const {
    baby,
    exactAge,
    babyAgeMonths,
    upNextMilestones,
    getUpNextStatus,
  } = useDashboard();

  const { babiesForDisplay } = useBabySwitcher();

  // Get first up next milestone
  const primaryMilestone = upNextMilestones[0];

  // Navigation handlers
  const handleLogGrowth = useCallback(() => {
    router.push('/growth');
  }, [router]);

  const handleLogMilestone = useCallback(() => {
    router.push('/milestones');
  }, [router]);

  const handleMilestonePress = useCallback(() => {
    if (primaryMilestone?.category) {
      setPendingMilestoneCategory(primaryMilestone.category);
    }
    router.push('/milestones');
  }, [router, primaryMilestone]);

  const handleSleepChartPress = useCallback(() => {
    setSleepModalVisible(true);
  }, []);

  const handleAddBaby = useCallback(() => {
    router.push('/add-baby');
  }, [router]);

  const handleProfilePress = useCallback(() => {
    setBabySelectorVisible(true);
  }, []);

  const handleAddBabyFromModal = useCallback(() => {
    setBabySelectorVisible(false);
    router.push('/add-baby');
  }, [router]);

  // Show empty state if no baby selected
  if (!baby) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <EmptyState
          icon="person-add-outline"
          title="No Child Selected"
          message="Add your first child to start tracking their growth, milestones, and precious memories."
          action={{
            label: 'Add Child',
            onPress: handleAddBaby,
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Age Display with profile icon */}
        <AgeDisplay 
          months={exactAge.months} 
          days={exactAge.days}
          babyName={baby?.name}
          babyPhotoUri={baby?.photoUri}
          showProfileIcon={babiesForDisplay.length > 1}
          onProfilePress={handleProfilePress}
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

      {/* Baby Selector Modal */}
      <BabySelectorModal
        visible={babySelectorVisible}
        onClose={() => setBabySelectorVisible(false)}
        onAddBaby={handleAddBabyFromModal}
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
