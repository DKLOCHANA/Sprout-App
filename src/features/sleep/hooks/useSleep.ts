/**
 * useSleep Hook
 * Provides sleep data analysis with WHO recommendations
 */

import { useMemo, useCallback } from 'react';
import sleepGuidelines from '@/core/data/sleepStandards/who-sleep-guidelines.json';
import { useSleepStore } from '../store';
import { useBabyStore } from '@/features/baby-profile/store';
import type { SleepRecommendation, SleepAnalysis, SleepEntry } from '../types';

export function useSleep() {
  const { getSelectedBaby } = useBabyStore();
  const sleepEntries = useSleepStore((state) => state.entries);
  const addSleepEntry = useSleepStore((state) => state.addSleepEntry);
  const getTodaySleepEntry = useSleepStore((state) => state.getTodaySleepEntry);

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

  // Get WHO recommendation for baby's age
  const recommendation = useMemo((): SleepRecommendation | null => {
    const recommendations = sleepGuidelines.recommendations as SleepRecommendation[];
    
    for (const rec of recommendations) {
      if (
        babyAgeMonths >= rec.ageRangeMonths.min &&
        babyAgeMonths < rec.ageRangeMonths.max
      ) {
        return rec;
      }
    }
    
    // Return last recommendation for older children
    return recommendations[recommendations.length - 1] || null;
  }, [babyAgeMonths]);

  // Get baby's sleep entries
  const babySleepEntries = useMemo(() => {
    if (!baby) return [];
    return sleepEntries
      .filter((entry) => entry.babyId === baby.id)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [baby, sleepEntries]);

  // Get recent sleep entries (last 7 days)
  const recentSleepEntries = useMemo(() => {
    if (!baby) return [];
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    const cutoffString = cutoffDate.toISOString().split('T')[0];

    return babySleepEntries.filter((entry) => entry.date >= cutoffString);
  }, [baby, babySleepEntries]);

  // Calculate average sleep from recent entries
  const averageSleep = useMemo(() => {
    if (recentSleepEntries.length === 0) return null;

    const totalMinutes = recentSleepEntries.reduce((sum, entry) => {
      return sum + entry.sleepHours * 60 + entry.sleepMinutes;
    }, 0);

    const avgMinutes = totalMinutes / recentSleepEntries.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);

    return { hours, minutes, totalMinutes: avgMinutes };
  }, [recentSleepEntries]);

  // Analyze sleep against WHO recommendations
  const sleepAnalysis = useMemo((): SleepAnalysis | null => {
    if (!averageSleep || !recommendation) return null;

    const totalHours = averageSleep.hours + averageSleep.minutes / 60;
    const { min, max, recommended } = recommendation.sleepHours;

    let status: 'below' | 'optimal' | 'above';
    if (totalHours < min) {
      status = 'below';
    } else if (totalHours > max) {
      status = 'above';
    } else {
      status = 'optimal';
    }

    const percentageOfRecommended = (totalHours / recommended) * 100;

    return {
      totalHours,
      recommendation,
      status,
      percentageOfRecommended,
    };
  }, [averageSleep, recommendation]);

  // Get today's sleep entry
  const todaySleepEntry = useMemo(() => {
    if (!baby) return undefined;
    return getTodaySleepEntry(baby.id);
  }, [baby, getTodaySleepEntry, sleepEntries]);

  // Add/update today's sleep
  const logSleep = useCallback(
    (hours: number, minutes: number, quality?: 'good' | 'fair' | 'poor', notes?: string) => {
      if (!baby) return;

      const today = new Date().toISOString().split('T')[0];

      addSleepEntry({
        babyId: baby.id,
        date: today,
        sleepHours: hours,
        sleepMinutes: minutes,
        quality,
        notes,
      });
    },
    [baby, addSleepEntry]
  );

  // Format sleep duration for display
  const formatSleepDuration = useCallback((hours: number, minutes: number) => {
    if (hours === 0 && minutes === 0) return '0h';
    if (minutes === 0) return `${hours}h`;
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  }, []);

  return {
    baby,
    babyAgeMonths,
    recommendation,
    babySleepEntries,
    recentSleepEntries,
    averageSleep,
    sleepAnalysis,
    todaySleepEntry,
    logSleep,
    formatSleepDuration,
  };
}
