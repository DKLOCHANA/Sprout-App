/**
 * Milestone Store
 * Zustand store for milestone achievements with AsyncStorage persistence and Firestore sync
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MilestoneAchievement, MilestoneStatus } from '../types';
import { milestoneService } from '@core/firebase';

interface MilestoneStore {
  // State
  achievements: MilestoneAchievement[];
  isSyncing: boolean;
  hasSeenLegend: boolean;

  // Actions
  updateMilestoneStatus: (
    milestoneId: string,
    babyId: string,
    status: MilestoneStatus,
    options?: { notes?: string; photoUri?: string; userId?: string }
  ) => void;
  
  setHasSeenLegend: () => void;
  
  getMilestoneAchievement: (
    milestoneId: string,
    babyId: string
  ) => MilestoneAchievement | undefined;
  
  getAchievementsForBaby: (babyId: string) => MilestoneAchievement[];
  
  getAchievedCountForBaby: (babyId: string) => number;
  
  deleteBabyAchievements: (babyId: string) => void;
  
  // Sync Operations
  syncToFirestore: (userId: string) => Promise<void>;
  loadFromFirestore: (userId: string, babyIds: string[]) => Promise<void>;
  
  reset: () => void;
}

const initialState = {
  achievements: [],
  isSyncing: false,
  hasSeenLegend: false,
};

export const useMilestoneStore = create<MilestoneStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateMilestoneStatus: (milestoneId, babyId, status, options) => {
        const now = new Date().toISOString();
        
        set((state) => {
          const existingIndex = state.achievements.findIndex(
            (a) => a.milestoneId === milestoneId && a.babyId === babyId
          );

          const newAchievement: MilestoneAchievement = {
            milestoneId,
            babyId,
            status,
            achievedAt: status === 'achieved' ? now : undefined,
            notes: options?.notes,
            photoUri: options?.photoUri,
            updatedAt: now,
          };

          if (existingIndex >= 0) {
            // Update existing
            const updated = [...state.achievements];
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...newAchievement,
              // Keep achievedAt if it was previously achieved
              achievedAt:
                status === 'achieved'
                  ? updated[existingIndex].achievedAt || now
                  : undefined,
            };
            return { achievements: updated };
          } else {
            // Add new
            return { achievements: [...state.achievements, newAchievement] };
          }
        });

        // Sync to Firestore (background, non-blocking)
        if (options?.userId) {
          milestoneService
            .updateMilestoneStatus(options.userId, babyId, milestoneId, status, {
              notes: options.notes,
              photoUri: options.photoUri,
            })
            .catch((error) => {
              console.warn('Failed to sync milestone to Firestore:', error);
            });
        }
      },

      getMilestoneAchievement: (milestoneId, babyId) => {
        return get().achievements.find(
          (a) => a.milestoneId === milestoneId && a.babyId === babyId
        );
      },

      getAchievementsForBaby: (babyId) => {
        return get().achievements.filter((a) => a.babyId === babyId);
      },

      getAchievedCountForBaby: (babyId) => {
        return get().achievements.filter(
          (a) => a.babyId === babyId && a.status === 'achieved'
        ).length;
      },

      deleteBabyAchievements: (babyId) => {
        set((state) => ({
          achievements: state.achievements.filter((a) => a.babyId !== babyId),
        }));
      },

      setHasSeenLegend: () => {
        set({ hasSeenLegend: true });
      },

      // Sync Operations
      syncToFirestore: async (userId) => {
        const state = get();
        if (state.isSyncing) return;

        set({ isSyncing: true });
        try {
          await milestoneService.syncAchievements(userId, state.achievements);
        } catch (error) {
          console.warn('Failed to sync milestones to Firestore:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      loadFromFirestore: async (userId, babyIds) => {
        const state = get();
        if (state.isSyncing) return;

        set({ isSyncing: true });
        try {
          const allAchievements: MilestoneAchievement[] = [];
          for (const babyId of babyIds) {
            const achievements = await milestoneService.getAchievementsForBaby(userId, babyId);
            allAchievements.push(...achievements);
          }
          set({ achievements: allAchievements });
        } catch (error) {
          console.warn('Failed to load milestones from Firestore:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'milestone-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        achievements: state.achievements,
        hasSeenLegend: state.hasSeenLegend,
      }),
    }
  )
);
