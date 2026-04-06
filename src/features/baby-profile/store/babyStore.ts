/**
 * Baby Profile Store
 * Zustand store for baby profiles with AsyncStorage persistence and Firestore sync
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Baby, GrowthEntry } from '../types';
import { babyService } from '@core/firebase';

interface BabyStore {
  // State
  babies: Baby[];
  selectedBabyId: string | null;
  growthEntries: GrowthEntry[];
  isSyncing: boolean;
  isHydrated: boolean;
  
  // Baby Actions
  addBaby: (baby: Baby) => void;
  updateBaby: (id: string, updates: Partial<Baby>) => void;
  deleteBaby: (id: string) => void;
  selectBaby: (id: string | null) => void;
  getSelectedBaby: () => Baby | null;
  getBabyById: (id: string) => Baby | undefined;
  ensureSelectedBaby: () => void;
  
  // Growth Entry Actions
  addGrowthEntry: (entry: GrowthEntry) => void;
  updateGrowthEntry: (id: string, updates: Partial<GrowthEntry>) => void;
  deleteGrowthEntry: (id: string) => void;
  getGrowthEntriesForBaby: (babyId: string) => GrowthEntry[];
  
  // Batched Operations
  addBabyWithInitialGrowth: (baby: Baby, growthEntry: GrowthEntry) => void;
  
  // Sync Operations
  syncToFirestore: (userId: string) => Promise<void>;
  loadFromFirestore: (userId: string) => Promise<void>;
  
  // Reset
  reset: () => void;
}

const initialState = {
  babies: [],
  selectedBabyId: null,
  growthEntries: [],
  isSyncing: false,
  isHydrated: false,
};

export const useBabyStore = create<BabyStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Baby Actions
      addBaby: (baby) =>
        set((state) => ({
          babies: [...state.babies, baby],
          selectedBabyId: baby.id, // Auto-select new baby
        })),

      updateBaby: (id, updates) =>
        set((state) => ({
          babies: state.babies.map((baby) =>
            baby.id === id
              ? { ...baby, ...updates, updatedAt: new Date().toISOString() }
              : baby
          ),
        })),

      deleteBaby: (id) =>
        set((state) => {
          const remainingBabies = state.babies.filter((baby) => baby.id !== id);
          // If deleting the selected baby, auto-select the first remaining one
          const newSelectedId = state.selectedBabyId === id
            ? (remainingBabies.length > 0 ? remainingBabies[0].id : null)
            : state.selectedBabyId;
          
          return {
            babies: remainingBabies,
            selectedBabyId: newSelectedId,
            growthEntries: state.growthEntries.filter(
              (entry) => entry.babyId !== id
            ),
          };
        }),

      selectBaby: (id) => set({ selectedBabyId: id }),

      getSelectedBaby: () => {
        const state = get();
        // Find the selected baby
        const selectedBaby = state.babies.find((baby) => baby.id === state.selectedBabyId);
        
        // If no baby is selected but babies exist, auto-select the first one
        if (!selectedBaby && state.babies.length > 0) {
          const firstBaby = state.babies[0];
          // Update selection asynchronously to avoid state mutation during render
          setTimeout(() => {
            get().selectBaby(firstBaby.id);
          }, 0);
          return firstBaby;
        }
        
        return selectedBaby || null;
      },

      getBabyById: (id) => {
        const state = get();
        return state.babies.find((baby) => baby.id === id);
      },

      // Ensure a baby is selected (call on app load)
      ensureSelectedBaby: () => {
        const state = get();
        if (!state.selectedBabyId && state.babies.length > 0) {
          set({ selectedBabyId: state.babies[0].id });
        }
      },

      // Growth Entry Actions
      addGrowthEntry: (entry) =>
        set((state) => ({
          growthEntries: [...state.growthEntries, entry],
        })),

      updateGrowthEntry: (id, updates) =>
        set((state) => ({
          growthEntries: state.growthEntries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
              : entry
          ),
        })),

      deleteGrowthEntry: (id) =>
        set((state) => ({
          growthEntries: state.growthEntries.filter((entry) => entry.id !== id),
        })),

      getGrowthEntriesForBaby: (babyId) => {
        const state = get();
        return state.growthEntries
          .filter((entry) => entry.babyId === babyId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      // Batched Operations
      addBabyWithInitialGrowth: (baby, growthEntry) =>
        set((state) => ({
          babies: [...state.babies, baby],
          selectedBabyId: baby.id,
          growthEntries: [...state.growthEntries, growthEntry],
        })),

      // Sync Operations
      syncToFirestore: async (userId) => {
        const state = get();
        if (state.isSyncing) return;
        
        set({ isSyncing: true });
        try {
          await babyService.syncBabies(userId, state.babies, state.growthEntries);
        } catch (error) {
          console.warn('Failed to sync babies to Firestore:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      loadFromFirestore: async (userId) => {
        const state = get();
        if (state.isSyncing) return;
        
        set({ isSyncing: true });
        try {
          const babies = await babyService.getBabies(userId);
          
          // Load growth entries for each baby
          const allGrowthEntries: GrowthEntry[] = [];
          for (const baby of babies) {
            const entries = await babyService.getGrowthEntries(userId, baby.id);
            allGrowthEntries.push(...entries);
          }
          
          set({
            babies,
            growthEntries: allGrowthEntries,
            selectedBabyId: babies.length > 0 ? babies[0].id : null,
          });
        } catch (error) {
          console.warn('Failed to load babies from Firestore:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      // Reset - keep isHydrated true since we don't need rehydration after reset
      reset: () => set({ ...initialState, isHydrated: true }),
    }),
    {
      name: 'baby-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Baby store rehydration error:', error);
        }
        useBabyStore.setState({ isHydrated: true });
      },
      partialize: (state) => ({
        babies: state.babies,
        selectedBabyId: state.selectedBabyId,
        growthEntries: state.growthEntries,
      }),
    }
  )
);
