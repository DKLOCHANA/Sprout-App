/**
 * useFamilyManagement Hook
 * Business logic for family management screen
 */

import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useBabyStore } from '@/features/baby-profile/store';
import { useMilestoneStore } from '@/features/milestones/store';
import { useSleepStore } from '@/features/sleep/store';
import { useMemoryStore } from '@/features/memories/store';
import { useAuthStore } from '@/features/auth/store';
import { useBabySwitcher, BabyDisplayInfo } from '@/shared/hooks';
import { babyService } from '@/core/firebase';
import type { Baby } from '@/features/baby-profile/types';

export interface UseFamilyManagementReturn {
  /** All babies formatted for display */
  babies: BabyDisplayInfo[];
  /** Currently selected baby ID */
  selectedBabyId: string | null;
  /** Whether delete confirmation is showing */
  isDeleteConfirmVisible: boolean;
  /** Baby pending deletion */
  pendingDeleteBaby: Baby | null;
  /** Loading state */
  isLoading: boolean;
  /** Select a baby */
  selectBaby: (id: string) => void;
  /** Navigate to edit baby screen */
  handleEditBaby: (babyId: string) => void;
  /** Show delete confirmation */
  handleDeleteBaby: (baby: Baby) => void;
  /** Confirm and execute deletion */
  confirmDelete: () => void;
  /** Cancel delete confirmation */
  cancelDelete: () => void;
  /** Navigate to add baby screen */
  handleAddBaby: () => void;
}

/**
 * Hook for family management functionality
 */
export function useFamilyManagement(): UseFamilyManagementReturn {
  const router = useRouter();
  const { babiesForDisplay, selectedBabyId, selectBaby, babies: rawBabies } = useBabySwitcher();
  const { user } = useAuthStore();
  
  const deleteBaby = useBabyStore((state) => state.deleteBaby);
  const deleteBabyAchievements = useMilestoneStore((state) => state.deleteBabyAchievements);
  const clearEntriesForBaby = useSleepStore((state) => state.clearEntriesForBaby);
  const clearMemoriesForBaby = useMemoryStore((state) => state.clearMemoriesForBaby);

  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [pendingDeleteBaby, setPendingDeleteBaby] = useState<Baby | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Navigate to edit baby screen
   */
  const handleEditBaby = useCallback(
    (babyId: string) => {
      router.push(`/edit-baby?id=${babyId}`);
    },
    [router]
  );

  /**
   * Show delete confirmation for a baby
   */
  const handleDeleteBaby = useCallback((baby: Baby) => {
    const isOnlyBaby = rawBabies.length === 1;
    
    if (isOnlyBaby) {
      Alert.alert(
        'Cannot Delete',
        'You must have at least one child profile. Add another child before deleting this one.',
        [{ text: 'OK' }]
      );
      return;
    }

    setPendingDeleteBaby(baby);
    setIsDeleteConfirmVisible(true);
  }, [rawBabies.length]);

  /**
   * Confirm and execute baby deletion with cascade cleanup
   */
  const confirmDelete = useCallback(async () => {
    if (!pendingDeleteBaby) return;

    setIsLoading(true);
    try {
      const babyId = pendingDeleteBaby.id;
      const babyName = pendingDeleteBaby.name;

      // Cascade delete all related data locally
      deleteBabyAchievements?.(babyId);
      clearEntriesForBaby?.(babyId);
      clearMemoriesForBaby?.(babyId);
      
      // Delete the baby locally (this also clears growth entries in babyStore)
      deleteBaby(babyId);

      // Sync deletion to Firebase
      if (user?.id) {
        babyService.deleteBaby(user.id, babyId).catch((error) => {
          console.warn('Failed to sync baby deletion to Firebase:', error);
        });
      }

      // Close confirmation
      setIsDeleteConfirmVisible(false);
      setPendingDeleteBaby(null);

      // Show success message
      Alert.alert(
        'Deleted',
        `${babyName}'s profile and all related data has been deleted.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to delete baby:', error);
      Alert.alert(
        'Error',
        'Failed to delete the profile. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [pendingDeleteBaby, deleteBaby, deleteBabyAchievements, clearEntriesForBaby, clearMemoriesForBaby, user]);

  /**
   * Cancel delete confirmation
   */
  const cancelDelete = useCallback(() => {
    setIsDeleteConfirmVisible(false);
    setPendingDeleteBaby(null);
  }, []);

  /**
   * Navigate to add baby screen
   */
  const handleAddBaby = useCallback(() => {
    router.push('/add-baby');
  }, [router]);

  return {
    babies: babiesForDisplay,
    selectedBabyId,
    isDeleteConfirmVisible,
    pendingDeleteBaby,
    isLoading,
    selectBaby,
    handleEditBaby,
    handleDeleteBaby,
    confirmDelete,
    cancelDelete,
    handleAddBaby,
  };
}
