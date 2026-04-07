/**
 * usePdfReport Hook
 * Handles PDF report generation logic
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useBabyStore } from '@/features/baby-profile/store';
import { useMilestoneStore } from '@/features/milestones/store';
import { useAuthStore } from '@/features/auth/store';
import { useGrowthAnalysis } from '@/shared/hooks';
import { useSubscription, useSubscriptionStore } from '@/features/subscription';
import { pdfReportService } from '../services';
import type { PdfReportData } from '../types';
import { differenceInMonths, differenceInDays } from 'date-fns';

// Load milestone definitions
import cdcMilestones from '@/core/data/milestones/cdc-milestones.json';

interface UsePdfReportReturn {
  isGenerating: boolean;
  generateReport: () => Promise<void>;
}

export function usePdfReport(): UsePdfReportReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { getSelectedBaby, getGrowthEntriesForBaby } = useBabyStore();
  const { getAchievementsForBaby } = useMilestoneStore();
  const { user } = useAuthStore();
  const { checkCanGenerateReport } = useSubscription();
  const incrementReportCount = useSubscriptionStore((state) => state.incrementReportCount);
  
  const baby = getSelectedBaby();
  const growthEntries = baby ? getGrowthEntriesForBaby(baby.id) : [];
  const { latestEntry, latestPercentiles } = useGrowthAnalysis(baby, growthEntries);

  const calculateAgeText = useCallback((dateOfBirth: string): string => {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    const months = differenceInMonths(now, dob);
    const days = differenceInDays(now, dob);
    
    if (months < 1) {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? '1 week' : `${weeks} weeks`;
    } else if (months < 24) {
      return months === 1 ? '1 month' : `${months} months`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return years === 1 ? '1 year' : `${years} years`;
      }
      return `${years} years, ${remainingMonths} months`;
    }
  }, []);

  const generateReport = useCallback(async () => {
    // Check subscription limits before generating report
    if (!checkCanGenerateReport()) {
      // checkCanGenerateReport will navigate to paywall if limit reached
      return;
    }

    if (!baby) {
      Alert.alert('No Baby Profile', 'Please add a baby profile first.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Get milestone achievements
      const achievements = getAchievementsForBaby(baby.id);
      const milestoneData = cdcMilestones as { milestones: Array<{ id: string; title: string }> };
      
      // Map achievements to milestone titles
      const getMilestoneTitle = (milestoneId: string): string => {
        const milestone = milestoneData.milestones.find(m => m.id === milestoneId);
        return milestone?.title || milestoneId;
      };

      const achievedMilestones = achievements
        .filter(a => a.status === 'achieved')
        .map(a => getMilestoneTitle(a.milestoneId));
      
      const inProgressMilestones = achievements
        .filter(a => a.status === 'in_progress')
        .map(a => getMilestoneTitle(a.milestoneId));
      
      // For delayed, we consider milestones not yet achieved that are past due
      const notYetMilestones = achievements
        .filter(a => a.status === 'not_yet')
        .map(a => getMilestoneTitle(a.milestoneId));

      // Build report data
      const reportData: PdfReportData = {
        babyName: baby.name,
        dateOfBirth: baby.dateOfBirth,
        ageText: calculateAgeText(baby.dateOfBirth),
        biologicalSex: baby.biologicalSex,
        isPremature: baby.isPremature,
        reportDate: new Date().toISOString(),
        growth: latestEntry ? {
          date: latestEntry.date,
          weightKg: latestEntry.weightKg,
          weightPercentile: latestPercentiles?.weight ?? null,
          heightCm: latestEntry.heightCm,
          heightPercentile: latestPercentiles?.height ?? null,
          headCircumferenceCm: latestEntry.headCircumferenceCm,
          headCircumferencePercentile: latestPercentiles?.headCircumference ?? null,
        } : null,
        milestones: {
          achieved: achievedMilestones,
          inProgress: inProgressMilestones,
          delayed: notYetMilestones,
        },
        parentName: user?.displayName || undefined,
      };

      await pdfReportService.generateAndSharePdf(reportData);
      
      // Increment report count after successful generation
      incrementReportCount();
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert(
        'Report Generation Failed',
        'Unable to generate the PDF report. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  }, [baby, latestEntry, latestPercentiles, getAchievementsForBaby, user, calculateAgeText, checkCanGenerateReport, incrementReportCount]);

  return {
    isGenerating,
    generateReport,
  };
}
