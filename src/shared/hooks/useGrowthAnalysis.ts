/**
 * useGrowthAnalysis Hook
 * 
 * Calculates percentiles and detects alerts for growth entries
 */

import { useMemo } from 'react';
import type { Baby, GrowthEntry } from '@/features/baby-profile/types';
import type { GrowthEntry as EnhancedGrowthEntry, GrowthAlert } from '@/features/growth/types/growth.types';
import HealthDataService from '@/core/api/healthDataService';
import { calculateAllPercentiles } from '@/shared/utils/growthCalculations';
import { detectGrowthAlerts } from '@/shared/utils/alertDetection';
import { differenceInDays } from 'date-fns';

export interface GrowthAnalysisResult {
  enhancedEntries: EnhancedGrowthEntry[];
  alerts: GrowthAlert[];
  latestEntry?: EnhancedGrowthEntry;
  latestPercentiles?: {
    weight?: number;
    height?: number;
    headCircumference?: number;
  };
}

/**
 * Calculate percentiles for all growth entries and detect alerts
 */
export function useGrowthAnalysis(
  baby: Baby | null,
  growthEntries: GrowthEntry[]
): GrowthAnalysisResult {
  return useMemo(() => {
    if (!baby || growthEntries.length === 0) {
      return {
        enhancedEntries: [],
        alerts: [],
      };
    }

    // Load growth standards for baby's sex
    const standards = HealthDataService.getAllGrowthStandards(baby.biologicalSex);

    // Calculate percentiles for each entry
    const enhancedEntries: EnhancedGrowthEntry[] = growthEntries.map((entry) => {
      // Calculate age at measurement
      const ageInDays = differenceInDays(new Date(entry.date), new Date(baby.dateOfBirth));
      
      // Calculate adjusted age for premature babies
      let adjustedAgeInDays: number | undefined;
      if (baby.isPremature && baby.originalDueDate) {
        adjustedAgeInDays = differenceInDays(new Date(entry.date), new Date(baby.originalDueDate));
      }

      // Use adjusted age if available, otherwise chronological age
      const ageForCalculation = adjustedAgeInDays ?? ageInDays;

      // Calculate percentiles
      const percentiles = calculateAllPercentiles(
        {
          weightKg: entry.weightKg ?? undefined,
          heightCm: entry.heightCm ?? undefined,
          headCircumferenceCm: entry.headCircumferenceCm ?? undefined,
        },
        ageForCalculation,
        baby.biologicalSex,
        standards.weight,
        standards.length || standards.height,
        standards.headCircumference
      );

      // Create enhanced entry
      const enhanced: EnhancedGrowthEntry = {
        ...entry,
        ageInDays,
        adjustedAgeInDays,
        weightPercentile: percentiles.weightPercentile,
        weightZScore: percentiles.weightZScore,
        heightPercentile: percentiles.heightPercentile,
        heightZScore: percentiles.heightZScore,
        headCircumferencePercentile: percentiles.headCircumferencePercentile,
        headCircumferenceZScore: percentiles.headCircumferenceZScore,
      };

      return enhanced;
    });

    // Sort by date (oldest first)
    const sortedEntries = [...enhancedEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Detect alerts
    const alerts = detectGrowthAlerts(sortedEntries, baby.id);

    // Get latest entry
    const latestEntry = sortedEntries.length > 0 
      ? sortedEntries[sortedEntries.length - 1]
      : undefined;

    // Get latest percentiles
    const latestPercentiles = latestEntry
      ? {
          weight: latestEntry.weightPercentile,
          height: latestEntry.heightPercentile,
          headCircumference: latestEntry.headCircumferencePercentile,
        }
      : undefined;

    return {
      enhancedEntries: sortedEntries,
      alerts,
      latestEntry,
      latestPercentiles,
    };
  }, [baby, growthEntries]);
}
