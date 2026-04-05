/**
 * useBabySwitcher Hook
 * Provides baby switching functionality for the app
 * Wraps useBabyStore with UI-friendly helpers
 */

import { useCallback, useMemo } from 'react';
import { useBabyStore } from '@/features/baby-profile/store';
import type { Baby } from '@/features/baby-profile/types';
import { differenceInMonths, differenceInDays } from 'date-fns';

export interface BabyDisplayInfo {
  id: string;
  name: string;
  photoUri: string | null;
  ageText: string;
  isSelected: boolean;
}

export interface UseBabySwitcherReturn {
  /** All babies */
  babies: Baby[];
  /** Currently selected baby */
  selectedBaby: Baby | null;
  /** Currently selected baby ID */
  selectedBabyId: string | null;
  /** Whether there are multiple babies */
  hasMultipleBabies: boolean;
  /** Babies formatted for display in selector */
  babiesForDisplay: BabyDisplayInfo[];
  /** Select a baby by ID */
  selectBaby: (id: string) => void;
  /** Get formatted age text for a baby */
  getAgeText: (baby: Baby) => string;
}

/**
 * Hook for baby switching functionality
 * Used by BabySwitcher and BabySelectorModal components
 */
export function useBabySwitcher(): UseBabySwitcherReturn {
  const babies = useBabyStore((state) => state.babies);
  const selectedBabyId = useBabyStore((state) => state.selectedBabyId);
  const selectBabyAction = useBabyStore((state) => state.selectBaby);
  const getSelectedBaby = useBabyStore((state) => state.getSelectedBaby);

  const selectedBaby = getSelectedBaby();
  const hasMultipleBabies = babies.length > 1;

  /**
   * Calculate age text for display
   */
  const getAgeText = useCallback((baby: Baby): string => {
    const birthDate = new Date(baby.dateOfBirth);
    const today = new Date();
    const months = differenceInMonths(today, birthDate);
    const totalDays = differenceInDays(today, birthDate);

    if (months < 1) {
      const weeks = Math.floor(totalDays / 7);
      if (weeks < 1) {
        return `${totalDays} day${totalDays !== 1 ? 's' : ''} old`;
      }
      return `${weeks} week${weeks !== 1 ? 's' : ''} old`;
    }

    if (months < 24) {
      return `${months} month${months !== 1 ? 's' : ''} old`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''} old`;
    }
    return `${years}y ${remainingMonths}m old`;
  }, []);

  /**
   * Format babies for display in selector UI
   */
  const babiesForDisplay = useMemo((): BabyDisplayInfo[] => {
    return babies.map((baby) => ({
      id: baby.id,
      name: baby.name,
      photoUri: baby.photoUri,
      ageText: getAgeText(baby),
      isSelected: baby.id === selectedBabyId,
    }));
  }, [babies, selectedBabyId, getAgeText]);

  /**
   * Select a baby by ID
   */
  const selectBaby = useCallback(
    (id: string) => {
      selectBabyAction(id);
    },
    [selectBabyAction]
  );

  return {
    babies,
    selectedBaby,
    selectedBabyId,
    hasMultipleBabies,
    babiesForDisplay,
    selectBaby,
    getAgeText,
  };
}
