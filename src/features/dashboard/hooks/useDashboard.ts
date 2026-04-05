/**
 * useDashboard Hook
 * Provides data for the home dashboard
 */

import { useMemo } from 'react';
import { useBabyStore } from '@/features/baby-profile/store';
import { useMilestones } from '@/features/milestones/hooks';
import milestoneData from '@/core/data/milestones/cdc-milestones.json';
import type { Milestone, MilestoneStatus } from '@/features/milestones/types';

export function useDashboard() {
  const { getSelectedBaby } = useBabyStore();
  const baby = getSelectedBaby();

  const {
    babyAgeMonths,
    currentAgeBlock,
    getMilestoneStatus,
    achievedCount,
    totalMilestones,
  } = useMilestones();

  // Calculate exact age in months and days
  const exactAge = useMemo(() => {
    if (!baby?.dateOfBirth) {
      return { months: 0, days: 0 };
    }

    const birthDate = new Date(baby.dateOfBirth);
    const now = new Date();

    let months = (now.getFullYear() - birthDate.getFullYear()) * 12;
    months += now.getMonth() - birthDate.getMonth();

    // Adjust if current day is before birth day
    const dayDiff = now.getDate() - birthDate.getDate();
    if (dayDiff < 0) {
      months--;
      // Calculate days remaining in the previous month
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      const days = lastMonth.getDate() + dayDiff;
      return { months: Math.max(0, months), days };
    }

    return { months: Math.max(0, months), days: dayDiff };
  }, [baby?.dateOfBirth]);

  // Get "Up Next" milestones (1-2 milestones for current age)
  const upNextMilestones = useMemo(() => {
    const allMilestones = milestoneData.milestones as Milestone[];

    // Get milestones for current age block
    const currentMilestones = allMilestones.filter((milestone) => {
      const { min, max } = milestone.ageRangeMonths;
      return min < currentAgeBlock.maxMonths && max > currentAgeBlock.minMonths;
    });

    // Find milestones that are not yet achieved
    const pendingMilestones = currentMilestones.filter((m) => {
      const status = getMilestoneStatus(m.id);
      return status !== 'achieved';
    });

    // Sort by priority: in_progress first, then by age range min
    const sorted = pendingMilestones.sort((a, b) => {
      const statusA = getMilestoneStatus(a.id);
      const statusB = getMilestoneStatus(b.id);

      // In progress takes priority
      if (statusA === 'in_progress' && statusB !== 'in_progress') return -1;
      if (statusB === 'in_progress' && statusA !== 'in_progress') return 1;

      // Then by age range
      return a.ageRangeMonths.min - b.ageRangeMonths.min;
    });

    // Return top 1-2
    return sorted.slice(0, 2);
  }, [babyAgeMonths, currentAgeBlock, getMilestoneStatus]);

  // Get status for a milestone
  const getUpNextStatus = (milestoneId: string): MilestoneStatus => {
    return getMilestoneStatus(milestoneId);
  };

  // Progress percentage
  const progressPercentage = useMemo(() => {
    if (totalMilestones === 0) return 0;
    return Math.round((achievedCount / totalMilestones) * 100);
  }, [achievedCount, totalMilestones]);

  return {
    baby,
    exactAge,
    babyAgeMonths,
    currentAgeBlock,
    upNextMilestones,
    getUpNextStatus,
    achievedCount,
    totalMilestones,
    progressPercentage,
  };
}
