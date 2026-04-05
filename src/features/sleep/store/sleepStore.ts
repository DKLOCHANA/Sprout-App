/**
 * Sleep Store
 * Zustand store for tracking daily sleep entries
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SleepEntry } from '../types';

interface SleepStore {
  // State
  entries: SleepEntry[];

  // Actions
  addSleepEntry: (entry: Omit<SleepEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSleepEntry: (id: string, updates: Partial<SleepEntry>) => void;
  deleteSleepEntry: (id: string) => void;
  getSleepEntriesForBaby: (babyId: string) => SleepEntry[];
  getRecentSleepEntries: (babyId: string, days?: number) => SleepEntry[];
  getTodaySleepEntry: (babyId: string) => SleepEntry | undefined;
  clearEntriesForBaby: (babyId: string) => void;
  
  // Reset
  reset: () => void;
}

const generateId = () => `sleep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getDateString = (date: Date = new Date()) => {
  return date.toISOString().split('T')[0];
};

const initialState = {
  entries: [] as SleepEntry[],
};

export const useSleepStore = create<SleepStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addSleepEntry: (entryData) => {
        const now = new Date().toISOString();
        const newEntry: SleepEntry = {
          ...entryData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => {
          // Check if entry for same date exists, replace it
          const existingIndex = state.entries.findIndex(
            (e) => e.babyId === entryData.babyId && e.date === entryData.date
          );

          if (existingIndex >= 0) {
            const updated = [...state.entries];
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...newEntry,
              id: updated[existingIndex].id, // Keep original ID
              createdAt: updated[existingIndex].createdAt, // Keep original creation time
            };
            return { entries: updated };
          }

          return { entries: [newEntry, ...state.entries] };
        });
      },

      updateSleepEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
              : entry
          ),
        }));
      },

      deleteSleepEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      getSleepEntriesForBaby: (babyId) => {
        return get().entries.filter((entry) => entry.babyId === babyId);
      },

      getRecentSleepEntries: (babyId, days = 7) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffString = getDateString(cutoffDate);

        return get()
          .entries.filter(
            (entry) => entry.babyId === babyId && entry.date >= cutoffString
          )
          .sort((a, b) => a.date.localeCompare(b.date));
      },

      getTodaySleepEntry: (babyId) => {
        const today = getDateString();
        return get().entries.find(
          (entry) => entry.babyId === babyId && entry.date === today
        );
      },

      clearEntriesForBaby: (babyId) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.babyId !== babyId),
        }));
      },

      reset: () => set(initialState),
    }),
    {
      name: 'sleep-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        entries: state.entries,
      }),
    }
  )
);
