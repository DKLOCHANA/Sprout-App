/**
 * useMilestones Hook
 * Provides milestone data and filtering utilities
 */

import { useMemo, useCallback } from 'react';
import milestoneData from '@/core/data/milestones/cdc-milestones.json';
import { useMilestoneStore } from '../store';
import { useBabyStore } from '@/features/baby-profile/store';
import { useAuthStore } from '@/features/auth/store';
import type {
  Milestone,
  MilestoneCategory,
  MilestoneStatus,
  AgeFilterType,
  NurtureFocusContent,
  AgeBlock,
} from '../types';

interface UseMilestonesOptions {
  category?: MilestoneCategory;
  ageFilter?: AgeFilterType;
  searchQuery?: string;
}

const AGE_BLOCKS: AgeBlock[] = [
  { label: '0-2 Months', value: 'current', minMonths: 0, maxMonths: 2 },
  { label: '2-4 Months', value: 'current', minMonths: 2, maxMonths: 4 },
  { label: '4-6 Months', value: 'current', minMonths: 4, maxMonths: 6 },
  { label: '6-9 Months', value: 'current', minMonths: 6, maxMonths: 9 },
  { label: '9-12 Months', value: 'current', minMonths: 9, maxMonths: 12 },
  { label: '12-18 Months', value: 'current', minMonths: 12, maxMonths: 18 },
  { label: '18-24 Months', value: 'current', minMonths: 18, maxMonths: 24 },
];

export function useMilestones(options: UseMilestonesOptions = {}) {
  const { category, ageFilter = 'current', searchQuery = '' } = options;

  const { getSelectedBaby } = useBabyStore();
  const { user } = useAuthStore();
  const {
    achievements,
    getMilestoneAchievement,
    updateMilestoneStatus,
    getAchievedCountForBaby,
    hasSeenLegend,
    setHasSeenLegend,
  } = useMilestoneStore();

  const baby = getSelectedBaby();

  // Calculate baby's age in months
  const babyAgeMonths = useMemo(() => {
    if (!baby?.dateOfBirth) return 0;
    const birthDate = new Date(baby.dateOfBirth);
    const now = new Date();
    const months =
      (now.getFullYear() - birthDate.getFullYear()) * 12 +
      (now.getMonth() - birthDate.getMonth());
    return Math.max(0, months);
  }, [baby?.dateOfBirth]);

  // Get current age block
  const currentAgeBlock = useMemo(() => {
    for (const block of AGE_BLOCKS) {
      if (babyAgeMonths >= block.minMonths && babyAgeMonths < block.maxMonths) {
        return block;
      }
    }
    // Default to last block if older
    return AGE_BLOCKS[AGE_BLOCKS.length - 1];
  }, [babyAgeMonths]);

  // Get age label for display
  const currentAgeLabel = useMemo(() => {
    return `Current Age (${currentAgeBlock.label})`;
  }, [currentAgeBlock]);

  // All milestones
  const allMilestones = useMemo(() => {
    return milestoneData.milestones as Milestone[];
  }, []);

  // Filter milestones by category (skip if searching)
  const categoryMilestones = useMemo(() => {
    if (!category || searchQuery.trim()) return allMilestones;
    return allMilestones.filter((m) => m.category === category);
  }, [allMilestones, category, searchQuery]);

  // Filter milestones by age
  const filteredMilestones = useMemo(() => {
    let filtered = categoryMilestones;

    // Apply age filter (skip if searching)
    if (ageFilter !== 'all' && !searchQuery.trim()) {
      filtered = filtered.filter((milestone) => {
        const { min, max } = milestone.ageRangeMonths;

        switch (ageFilter) {
          case 'current':
            // Milestone overlaps with current age block
            return (
              min < currentAgeBlock.maxMonths && max > currentAgeBlock.minMonths
            );
          case 'past':
            // Milestone max is less than current age block min
            return max <= currentAgeBlock.minMonths;
          case 'upcoming':
            // Milestone min is greater than or equal to current age block max
            return min >= currentAgeBlock.maxMonths;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((milestone) =>
        milestone.title.toLowerCase().includes(query) ||
        milestone.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [categoryMilestones, ageFilter, currentAgeBlock, searchQuery]);

  // Get milestone status
  const getMilestoneStatus = useCallback(
    (milestoneId: string): MilestoneStatus => {
      if (!baby) return 'not_yet';
      const achievement = getMilestoneAchievement(milestoneId, baby.id);
      return achievement?.status || 'not_yet';
    },
    [baby, getMilestoneAchievement, achievements]
  );

  // Update milestone status
  const setMilestoneStatus = useCallback(
    (
      milestoneId: string,
      status: MilestoneStatus,
      options?: { notes?: string; photoUri?: string }
    ) => {
      if (!baby) return;
      updateMilestoneStatus(milestoneId, baby.id, status, {
        ...options,
        userId: user?.id,
      });
    },
    [baby, updateMilestoneStatus, user]
  );

  // Get achieved count
  const achievedCount = useMemo(() => {
    if (!baby) return 0;
    return getAchievedCountForBaby(baby.id);
  }, [baby, getAchievedCountForBaby, achievements]);

  // Nurture focus content
  const nurtureFocusContent = useMemo(() => {
    const content = milestoneData.nurtureFocusContent as NurtureFocusContent[];
    if (!category) return content;
    return content.filter((c) => c.category === category);
  }, [category]);

  // Get relevant nurture focus for current age and category
  const relevantNurtureFocus = useMemo(() => {
    return nurtureFocusContent.filter((content) => {
      const { min, max } = content.ageRangeMonths;
      return babyAgeMonths >= min && babyAgeMonths < max;
    });
  }, [nurtureFocusContent, babyAgeMonths]);

  // Get all available age filter options
  const ageFilterOptions: { label: string; value: AgeFilterType }[] = useMemo(
    () => [
      { label: currentAgeLabel, value: 'current' },
      { label: 'Past Milestones', value: 'past' },
      { label: 'Upcoming Milestones', value: 'upcoming' },
      { label: 'All Milestones', value: 'all' },
    ],
    [currentAgeLabel]
  );

  return {
    milestones: filteredMilestones,
    allMilestones,
    categoryMilestones,
    babyAgeMonths,
    currentAgeBlock,
    currentAgeLabel,
    getMilestoneStatus,
    setMilestoneStatus,
    achievedCount,
    totalMilestones: allMilestones.length,
    nurtureFocusContent,
    relevantNurtureFocus,
    ageFilterOptions,
    baby,
    hasSeenLegend,
    setHasSeenLegend,
  };
}
