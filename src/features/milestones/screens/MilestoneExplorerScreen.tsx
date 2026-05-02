/**
 * MilestoneExplorerScreen
 * Main screen for exploring and tracking developmental milestones
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii } from '@/core/theme';
import { EmptyState, InfoBanner, CelebrationBurst } from '@/shared/components';
import type { CelebrationBurstHandle } from '@/shared/components';
import { CategoryTabs } from '../components/CategoryTabs';
import { AgeFilterDropdown } from '../components/AgeFilterDropdown';
import { MilestoneCard } from '../components/MilestoneCard';
import { MilestoneLegendModal } from '../components/MilestoneLegendModal';
import { useMilestones } from '../hooks';
import { consumePendingMilestoneCategory } from '../navigationIntent';
import type { MilestoneCategory, AgeFilterType, MilestoneStatus } from '../types';

export function MilestoneExplorerScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<MilestoneCategory>('Motor');
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<AgeFilterType>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const celebrationRef = useRef<CelebrationBurstHandle>(null);

  useFocusEffect(
    useCallback(() => {
      const pending = consumePendingMilestoneCategory();
      if (pending) {
        setSelectedCategory(pending);
      }
    }, [])
  );

  const handleCelebrate = useCallback((x: number, y: number) => {
    celebrationRef.current?.play(x, y);
  }, []);

  const {
    milestones,
    getMilestoneStatus,
    setMilestoneStatus,
    ageFilterOptions,
    baby,
    hasSeenLegend,
    setHasSeenLegend,
  } = useMilestones({
    category: selectedCategory,
    ageFilter: selectedAgeFilter,
    searchQuery,
  });

  // Show legend modal on first visit
  useEffect(() => {
    if (!hasSeenLegend) {
      setIsLegendVisible(true);
    }
  }, [hasSeenLegend]);

  const handleLegendClose = useCallback(() => {
    setIsLegendVisible(false);
    setHasSeenLegend();
  }, [setHasSeenLegend]);

  const handleCategoryChange = useCallback((category: MilestoneCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleAgeFilterChange = useCallback((filter: AgeFilterType) => {
    setSelectedAgeFilter(filter);
  }, []);

  const handleStatusChange = useCallback(
    (milestoneId: string, status: MilestoneStatus) => {
      setMilestoneStatus(milestoneId, status);
    },
    [setMilestoneStatus]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAddBaby = useCallback(() => {
    router.push('/add-baby');
  }, [router]);

  if (!baby) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        <EmptyState
          icon="ribbon-outline"
          title="No Child Selected"
          message="Add a child to start exploring and tracking their developmental milestones."
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
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Milestone</Text>
          <Text style={styles.titleSecondary}>Explorer</Text>
        </View>

        {/* Category Tabs */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* Age Filter with Search */}
        <AgeFilterDropdown
          selectedFilter={selectedAgeFilter}
          options={ageFilterOptions}
          onSelectFilter={handleAgeFilterChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Milestones List */}
        <View style={styles.milestonesSection}>
          {milestones.length === 0 ? (
            <View style={styles.noMilestones}>
              <Text style={styles.noMilestonesText}>
                No milestones found for this filter
              </Text>
            </View>
          ) : (
            milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                status={getMilestoneStatus(milestone.id)}
                onStatusChange={(status) => handleStatusChange(milestone.id, status)}
                onCelebrate={handleCelebrate}
              />
            ))
          )}
        </View>

        {/* Medical Disclaimer */}
        <View style={styles.disclaimerWrapper}>
          <InfoBanner
            tone="disclaimer"
            message="Every child develops at their own pace. These milestones are educational guidelines from the CDC, not medical advice. If you have concerns about your child's development, please consult your pediatrician."
          />
        </View>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Legend Modal */}
      <MilestoneLegendModal
        visible={isLegendVisible}
        onClose={handleLegendClose}
      />

      {/* Celebration overlay */}
      <CelebrationBurst ref={celebrationRef} />
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
    paddingBottom: spacing.xl,
  },
  titleSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    fontSize: 40,
    lineHeight: 48,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  titleSecondary: {
    ...typography.h1,
    fontSize: 40,
    lineHeight: 48,
    color: colors.secondary,
  },
  milestonesSection: {
    paddingTop: spacing.sm,
  },
  noMilestones: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  noMilestonesText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  disclaimerWrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  bottomPadding: {
    height: spacing['2xl'],
  },
});
